import { Link } from "react-router-dom";
import { BarChart3, Code2, Video } from "lucide-react";

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <h3 className="text-base font-semibold text-slate-950">{title}</h3>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 md:px-8">
        <div className="text-sm font-semibold tracking-tight text-slate-950">
          Placement Readiness
        </div>
        <Link
          to="/dashboard"
          className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          Get Started
        </Link>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-14 pt-8 md:px-8 md:pb-20 md:pt-14">
        <section className="rounded-3xl border border-slate-200 bg-white/70 p-8 shadow-sm backdrop-blur md:p-12">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Placement Prep Platform
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            Ace Your Placement
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Practice, assess, and prepare for your dream job
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              Get Started
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              Explore Features
            </a>
          </div>
        </section>

        <section id="features" className="mt-12 md:mt-16">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                Everything you need to get hired
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                A focused workflow for consistent daily improvement.
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            <FeatureCard
              icon={Code2}
              title="Practice Problems"
              description="Solve curated DSA and core CS problems daily."
            />
            <FeatureCard
              icon={Video}
              title="Mock Interviews"
              description="Simulate real interviews and build confidence."
            />
            <FeatureCard
              icon={BarChart3}
              title="Track Progress"
              description="Measure improvements and spot weak areas fast."
            />
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white/70">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-600 md:px-8">
          © {new Date().getFullYear()} Placement Readiness Platform. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
}

