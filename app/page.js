"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import useReveal from "@/hooks/useReveal";

export default function LandingPage() {
  useReveal();

  return (
    <main className="bg-[var(--hiroma-bg)] text-[var(--hiroma-text)]">
      <Header />

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        {/* Background shapes */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full bg-[var(--hiroma-blue)] opacity-[0.06] animate-pulse" />
          <div className="absolute top-32 -left-40 h-[320px] w-[320px] rounded-full bg-[var(--hiroma-navy)] opacity-[0.05]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className="animate-fade-up">
            <h1 className="leading-tight">
              Be Part of a Growing
              <span className="block text-[var(--hiroma-blue)]">
                Fragrance Business
              </span>
              with HIROMA
            </h1>

            <p className="mt-6 max-w-xl text-lg animate-fade-up animate-delay-1">
              Join HIROMA and start your journey in the fragrance industry —
              backed by real perfume products, a structured reseller network,
              and a fair system designed for long-term growth.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 animate-fade-up animate-delay-2">
              <button className="hiroma-btn hiroma-btn-primary transition hover:scale-[1.03]">
                I Want to Become a Reseller
              </button>

              <Link
                href="/login"
                className="hiroma-btn hiroma-btn-secondary transition hover:scale-[1.03]"
              >
                Login
              </Link>
            </div>

            <p className="mt-4 text-sm text-[var(--hiroma-muted)] animate-fade-up animate-delay-3">
              ✔ Real perfume products &nbsp;•&nbsp;
              ✔ Structured reseller program &nbsp;•&nbsp;
              ✔ Transparent rewards
            </p>
          </div>

          {/* Product Visual */}
          <div className="hidden md:flex justify-center items-center reveal">
  <div className="relative w-[420px] h-[420px] flex items-center justify-center">

    {/* Circle 1 – Brand Blue */}
    <div
      className="
        absolute
        -top-8 left-6
        w-36 h-36
        rounded-full
        bg-blue-500/20
        animate-slow-float
      "
    />

    {/* Circle 2 – Deep Navy */}
    <div
      className="
        absolute
        top-20 -right-10
        w-56 h-56
        rounded-full
        bg-indigo-900/15
        animate-slow-float-delayed
      "
    />

    {/* Circle 3 – Accent Sky */}
    <div
      className="
        absolute
        bottom-8 left-1/2 -translate-x-1/2
        w-28 h-28
        rounded-full
        bg-sky-400/25
        animate-slow-float
      "
    />

    {/* Perfume Image */}
    <img
      src="/perfume-clio.png"
      alt="HIROMA Clio Eau de Parfum"
      className="
        relative z-10
        h-[420px]
        object-contain
        drop-shadow-2xl
        animate-float
      "
    />

    {/* Label */}
    <p className="absolute -bottom-10 w-full text-center text-sm text-[var(--hiroma-muted)]">
      HIROMA • Clio Eau de Parfum
    </p>
  </div>
</div>



        </div>
      </section>

      {/* ================= HOW YOU EARN ================= */}
      <section className="bg-white py-24 reveal">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center">How You Earn with HIROMA</h2>
          <p className="text-center mt-4 max-w-2xl mx-auto">
            Earn through a fair and transparent system designed for
            long-term growth.
          </p>

          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="reveal reveal-delay-1">
              <EarnCard
                title="Direct Referral Bonus"
                description="Earn rewards when you successfully invite new resellers."
              />
            </div>
            <div className="reveal reveal-delay-2">
              <EarnCard
                title="Pairing & Points System"
                description="Gain points when your left and right teams grow together."
              />
            </div>
            <div className="reveal reveal-delay-3">
              <EarnCard
                title="Spillover Advantage"
                description="Unused points are carried forward for future pairings."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= PACKAGES ================= */}
      <section className="py-24 reveal">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center">Choose Your Starting Package</h2>
          <p className="text-center mt-4 max-w-2xl mx-auto">
            Select a package that matches your goals and start building today.
          </p>

          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <PackageCard
              title="Starter"
              points="300 Points"
              description="Entry-level package with perfume products."
            />
            <PackageCard
              title="Builder"
              points="500 Points"
              description="Designed for active builders who want more growth."
              highlight
            />
            <PackageCard
              title="Entrepreneurship"
              points="1000 Points"
              description="Full business package for serious leaders."
            />
          </div>
        </div>
      </section>

      {/* ================= WHAT YOU GET ================= */}
      <section className="bg-white py-24 reveal">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center">What You Get with HIROMA</h2>

          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <InfoCard
              title="Real Perfume Products"
              text="Backed by physical products distributed through a controlled supply chain."
            />
            <InfoCard
              title="Structured Growth System"
              text="A clear referral and pairing model designed for sustainability."
            />
            <InfoCard
              title="Full Transparency"
              text="Track inventory, points, and withdrawals with clarity."
            />
          </div>
        </div>
      </section>

      {/* ================= WHY HIROMA ================= */}
      <section className="bg-white py-24 reveal">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-center">Why Choose HIROMA</h2>

          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <WhyItem text="Controlled reseller registration" />
            <WhyItem text="Transparent referral and pairing logic" />
            <WhyItem text="Inventory tracking at every level" />
            <WhyItem text="Manual, traceable withdrawals" />
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-24 reveal">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2>How It Works</h2>

          <div className="mt-16 grid md:grid-cols-5 gap-6 text-sm">
            {[
              "Choose a package",
              "Register through a distributor",
              "Receive products",
              "Build your network",
              "Earn rewards",
            ].map((step, i) => (
              <div key={i} className={`reveal reveal-delay-${i + 1}`}>
                <Step text={step} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-28 text-center reveal">
        <h2>Build with Structure. Grow with Confidence.</h2>
        <p className="mt-4 max-w-xl mx-auto">
          Join HIROMA and start building your perfume business the right way.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <button className="hiroma-btn hiroma-btn-primary transition hover:scale-[1.04]">
            Talk to a Distributor
          </button>

          <Link
            href="/login"
            className="hiroma-btn hiroma-btn-secondary transition hover:scale-[1.04]"
          >
            Login
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}

/* ================= COMPONENTS ================= */

function EarnCard({ title, description }) {
  return (
    <div className="hiroma-card transition-all hover:-translate-y-2 hover:shadow-lg">
      <h3>{title}</h3>
      <p className="mt-2">{description}</p>
    </div>
  );
}

function PackageCard({ title, points, description, highlight }) {
  return (
    <div
      className={`hiroma-card text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-lg ${
        highlight
          ? "ring-2 ring-[var(--hiroma-blue)] scale-[1.02]"
          : ""
      }`}
    >
      <h3>{title}</h3>
      <p className="mt-2 text-sm font-medium text-[var(--hiroma-blue)]">
        {points}
      </p>
      <p className="mt-4">{description}</p>
    </div>
  );
}

function InfoCard({ title, text }) {
  return (
    <div className="hiroma-card transition-all hover:-translate-y-2 hover:shadow-lg">
      <h3>{title}</h3>
      <p className="mt-2">{text}</p>
    </div>
  );
}

function WhyItem({ text }) {
  return (
    <div className="hiroma-card">
      <p>{text}</p>
    </div>
  );
}

function Step({ text }) {
  return (
    <div className="hiroma-card text-center text-sm">
      {text}
    </div>
  );
}
