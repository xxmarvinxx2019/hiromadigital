"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase/client";
import EarningsHistoryModal from "@/components/EarningsHistoryModal";

export default function ResellerTreePage() {
  const [focusNode, setFocusNode] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [earningsNode, setEarningsNode] = useState(null);

  useEffect(() => {
    async function loadTree() {
      try {
        const token = await auth.currentUser.getIdToken();

        const res = await fetch("/api/network/tree", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setFocusNode(data.tree);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadTree();
  }, []);

  if (loading) {
    return <p className="text-sm text-slate-500">Loading network...</p>;
  }

  if (!focusNode) {
    return <p className="text-sm text-slate-500">No network found.</p>;
  }

  const levels = buildLevels(focusNode, 3);

  const handleSelectNode = (node) => {
    setHistory((prev) => [...prev, focusNode]);
    setFocusNode(node);
  };

  const handleBack = () => {
    setHistory((prev) => {
      const newHistory = [...prev];
      const last = newHistory.pop();
      setFocusNode(last);
      return newHistory;
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">My Network Tree</h1>
          <p className="text-sm text-slate-500">
            Click a reseller to focus on their network.
          </p>
        </div>

        <button
          onClick={handleBack}
          disabled={history.length === 0}
          className={`
            px-3 py-2 text-sm rounded-md transition
            ${
              history.length === 0
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-white border hover:bg-slate-50"
            }
          `}
        >
          ← Back
        </button>
      </div>

      {/* TREE */}
      <div className="overflow-x-auto">
        <div className="min-w-[900px] space-y-10">
          {levels.map((level, depth) => (
            <div key={depth} className="flex justify-center gap-12">
              {level.map((node, i) => (
                <div
                  key={i}
                  style={{ width: `${400 / Math.pow(2, depth)}px` }}
                  className="flex justify-center"
                >
                  {node ? (
                    <NodeCard
  node={node}
  onClick={() => handleSelectNode(node)}
  onViewEarnings={() => setEarningsNode(node)}
/>

                  ) : (
                    <EmptySlot />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Binary structure: Left and Right legs grow symmetrically.
      </p>
      <EarningsHistoryModal
  open={!!earningsNode}
  user={earningsNode}
  onClose={() => setEarningsNode(null)}
/>

    </div>
  );
}

/* ================= HELPERS ================= */

function buildLevels(root, maxDepth) {
  const levels = [];
  let queue = [{ node: root, level: 0 }];

  while (queue.length) {
    const { node, level } = queue.shift();

    if (!levels[level]) levels[level] = [];
    levels[level].push(node);

    if (level < maxDepth - 1) {
      queue.push({ node: node?.left || null, level: level + 1 });
      queue.push({ node: node?.right || null, level: level + 1 });
    }
  }

  return levels;
}

function NodeCard({ node, onClick, onViewEarnings }) {
  return (
    <div
      onClick={onClick}
      className="
        w-56 rounded-xl bg-white
        shadow-sm border border-slate-200
        px-4 py-3 text-center
        hover:shadow-md hover:-translate-y-0.5
        transition cursor-pointer
      "
    >
      {/* NAME */}
      <p className="text-sm font-medium">{node.name}</p>
      <p className="text-xs text-slate-500">@{node.username}</p>

      {/* POINTS */}
      <div className="mt-2 grid grid-cols-2 gap-1 text-[11px]">
        <div className="bg-blue-50 rounded px-1 py-0.5">
          L: <b>{node.leftPoints ?? 0}</b>
        </div>
        <div className="bg-green-50 rounded px-1 py-0.5">
          R: <b>{node.rightPoints ?? 0}</b>
        </div>
      </div>

      {/* TOTAL EARNINGS */}
      <div className="mt-2 text-sm font-semibold text-slate-800">
        💰 ₱{node.totalEarnings.toFixed(2)}
      </div>

      {/* BREAKDOWN */}
      <div className="mt-1 text-[11px] text-slate-500 space-y-0.5">
        <div>🤝 Referral: ₱{node.referralEarnings.toFixed(2)}</div>
        <div>🔗 Pairing: ₱{node.pairingEarnings.toFixed(2)}</div>
      </div>

      {/* ACTION */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // 🔥 prevents focus change
          onViewEarnings();
        }}
        className="
          mt-2 text-xs text-blue-600
          hover:underline
        "
      >
        View earnings
      </button>
    </div>
  );
}



function EmptySlot() {
  return (
    <div
      className="
        w-44 h-16 rounded-xl
        border border-dashed border-slate-300
        flex items-center justify-center
        text-xs text-slate-400
      "
    >
      Empty
    </div>
  );
}
