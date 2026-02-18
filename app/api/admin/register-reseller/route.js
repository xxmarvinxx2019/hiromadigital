import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { Timestamp } from "firebase-admin/firestore";
import {
  PACKAGE_CONFIG,
  POINT_TO_PESO,
  DAILY_PAIRING_CAP,
  POINTS_PER_PAIR,
} from "@/lib/mlm/constants";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      pinCode,
      firstName,
      middleName,
      lastName,
      email,
      password,
      mobile,
      province,
      city,
      barangay,
      pob,
      dob,
      referralEmail,
      placement,
    } = body;

    /* ================= BASIC VALIDATION ================= */

    if (
      !mobile ||
      !province ||
      !city ||
      !barangay ||
      !pob ||
      !dob ||
      !referralEmail ||
      !placement?.leg
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!/^09\d{9}$/.test(mobile)) {
      return NextResponse.json(
        { error: "Invalid mobile format" },
        { status: 400 }
      );
    }

    /* ================= 7 ACCOUNT LIMIT CHECK ================= */

    const identityQuery = await adminDb
      .collection("users")
      .where("firstName", "==", firstName)
      .where("lastName", "==", lastName)
      .where("dateOfBirth", "==", dob)
      .where("placeOfBirth", "==", pob)
      .get();

    if (identityQuery.size >= 7) {
      return NextResponse.json(
        { error: "Maximum 7 accounts per identity reached" },
        { status: 400 }
      );
    }

    /* ================= READ PIN ================= */

    const pinSnap = await adminDb
      .collection("pins")
      .where("code", "==", pinCode)
      .limit(1)
      .get();

    if (pinSnap.empty) {
      return NextResponse.json({ error: "Invalid PIN" }, { status: 400 });
    }

    const pinDoc = pinSnap.docs[0];
    const pin = pinDoc.data();

    if (pin.status !== "Assigned") {
      return NextResponse.json(
        { error: "PIN not available" },
        { status: 400 }
      );
    }

    const packageName = pin.package;
    const packageConfig = PACKAGE_CONFIG[packageName];

    if (!packageConfig) {
      return NextResponse.json(
        { error: "Invalid package" },
        { status: 400 }
      );
    }

    const distributorId = pin.assignedTo;

    /* ================= CREATE AUTH USER ================= */

    const userRecord = await adminAuth.createUser({
      email,
      password,
    });

    const uid = userRecord.uid;

    /* ================= TRANSACTION ================= */

    await adminDb.runTransaction(async (tx) => {
      const usersRef = adminDb.collection("users");
      const pinsRef = adminDb.collection("pins").doc(pinDoc.id);
      const transactionsRef = adminDb.collection("transactions");
      const hiromaRef = usersRef.doc("HIROMA_ROOT");

      /* ---------- Parent ---------- */

      let parentSnap = null;

      if (placement.leg !== "root") {
        parentSnap = await tx.get(usersRef.doc(placement.parentId));

        if (!parentSnap.exists) throw new Error("Parent not found");

        if (parentSnap.data()[placement.leg]) {
          throw new Error("Slot already occupied");
        }
      }

      /* ---------- Referral ---------- */

      const refQuery = await tx.get(
        usersRef
          .where("email", "==", referralEmail)
          .where("role", "==", "reseller")
          .limit(1)
      );

      if (refQuery.empty) throw new Error("Invalid referral");

      const referrerSnap = refQuery.docs[0];

      /* ---------- Build Uplines ---------- */

      const uplines = [];
      let currentParentId = placement.parentId;
      let currentLeg = placement.leg;

      while (currentParentId) {
        const snap = await tx.get(usersRef.doc(currentParentId));
        if (!snap.exists) break;

        uplines.push({
          ref: snap.ref,
          data: snap.data(),
          leg: currentLeg,
        });

        currentLeg = snap.data().leg;
        currentParentId = snap.data().parentId;
      }

      const updates = [];
      const transactionLogs = [];
      const today = new Date().toISOString().slice(0, 10);

      /* ================= REFERRAL BONUS (NO CAP) ================= */

      const bonus = packageConfig.referralBonus;
      const refData = referrerSnap.data();

      updates.push({
        ref: referrerSnap.ref,
        data: {
          referralEarnings: (refData.referralEarnings || 0) + bonus,
          totalEarnings: (refData.totalEarnings || 0) + bonus,
        },
      });

      transactionLogs.push({
        userId: referrerSnap.id,
        type: "referral",
        amount: bonus,
        points: 0,
        description: `Referral bonus from ${email}`,
      });

      /* ================= PAIRING WITH DAILY CAP ================= */

      for (const upline of uplines) {
        let leftPoints = upline.data.leftPoints || 0;
        let rightPoints = upline.data.rightPoints || 0;

        if (upline.leg === "left") leftPoints += packageConfig.points;
        if (upline.leg === "right") rightPoints += packageConfig.points;

        const pairPoints = Math.min(leftPoints, rightPoints);
        const possiblePairs = Math.floor(pairPoints / POINTS_PER_PAIR);

        if (possiblePairs > 0) {
          const usedToday =
            upline.data.dailyPairingDate === today
              ? upline.data.dailyPairingCount || 0
              : 0;

          const remainingCap = Math.max(
            DAILY_PAIRING_CAP - usedToday,
            0
          );

          const paidPairs = Math.min(possiblePairs, remainingCap);
          const overflowPairs = possiblePairs - paidPairs;

          const paidPoints = paidPairs * POINTS_PER_PAIR;
          const overflowPoints = overflowPairs * POINTS_PER_PAIR;

          const paidEarnings = paidPoints * POINT_TO_PESO;
          const overflowEarnings = overflowPoints * POINT_TO_PESO;

          leftPoints -= pairPoints;
          rightPoints -= pairPoints;

          /* ---- Pay reseller ---- */

          if (paidPairs > 0) {
            updates.push({
              ref: upline.ref,
              data: {
                pairingEarnings:
                  (upline.data.pairingEarnings || 0) +
                  paidEarnings,
                totalEarnings:
                  (upline.data.totalEarnings || 0) +
                  paidEarnings,
                dailyPairingCount: usedToday + paidPairs,
                dailyPairingDate: today,
              },
            });

            transactionLogs.push({
              userId: upline.ref.id,
              type: "pairing",
              amount: paidEarnings,
              points: paidPoints,
              description: "Binary pairing",
            });
          }

          /* ---- Overflow to HIROMA ---- */

          if (overflowPairs > 0) {
            const hiromaSnap = await tx.get(hiromaRef);

            tx.update(hiromaRef, {
              pairingEarnings:
                (hiromaSnap.data()?.pairingEarnings || 0) +
                overflowEarnings,
              totalEarnings:
                (hiromaSnap.data()?.totalEarnings || 0) +
                overflowEarnings,
            });

            transactionLogs.push({
              userId: "HIROMA",
              type: "pairing_overflow",
              amount: overflowEarnings,
              points: overflowPoints,
              description: "Pairing overflow",
            });
          }

          updates.push({
            ref: upline.ref,
            data: { leftPoints, rightPoints },
          });
        } else {
          updates.push({
            ref: upline.ref,
            data: { leftPoints, rightPoints },
          });
        }
      }

      /* ================= WRITE PHASE ================= */

      if (parentSnap) {
        tx.update(parentSnap.ref, {
          [placement.leg]: uid,
        });
      }

      tx.set(usersRef.doc(uid), {
        role: "reseller",
        distributorId,
        package: packageName,

        firstName,
        middleName: middleName || "",
        lastName,
        email,
        mobile,

        province,
        city,
        barangay,

        placeOfBirth: pob,
        dateOfBirth: dob,

        parentId: placement.parentId || null,
        leg: placement.leg,
        referralEmail,

        leftPoints: 0,
        rightPoints: 0,
        referralEarnings: 0,
        pairingEarnings: 0,
        totalEarnings: 0,

        dailyPairingCount: 0,
        dailyPairingDate: today,

        createdAt: Timestamp.now(),
      });

      for (const u of updates) {
        tx.update(u.ref, u.data);
      }

      for (const log of transactionLogs) {
        tx.set(transactionsRef.doc(), {
          ...log,
          createdAt: Timestamp.now(),
        });
      }

      tx.update(pinsRef, {
        status: "Used",
        usedBy: uid,
        usedAt: Timestamp.now(),
      });
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("REGISTER RESELLER ERROR:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
