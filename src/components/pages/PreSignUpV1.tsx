"use client";

export function PreSignUpV1() {
  return (
    <div className="min-h-full bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-[100] border-b border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-900 sm:px-8">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between">
          <div className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Bonds India
          </div>
          <div className="hidden items-center gap-6 md:flex sm:gap-8">
            <a
              href="#"
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Bond Collections
            </a>
            <a
              href="#"
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              NCD IPOs
            </a>
            <a
              href="#"
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              How It Works
            </a>
            <a
              href="#"
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Learn
            </a>
            <a
              href="#"
              className="rounded-md border border-zinc-200 bg-transparent px-5 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              Login
            </a>
            <a
              href="#"
              className="rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Explore Investments
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-white px-4 py-12 text-center dark:bg-zinc-900 sm:px-8 md:py-20">
        <div className="mx-auto max-w-[720px]">
          <h1 className="mb-6 text-3xl font-bold leading-tight tracking-tight text-zinc-900 dark:text-zinc-100 md:text-5xl">
            Invest in bonds with clarity and confidence
          </h1>
          <p className="mx-auto mb-10 max-w-[560px] text-lg text-zinc-600 dark:text-zinc-400 md:text-xl">
            Access curated, SEBI-regulated bond investments with predictable returns and transparent risk.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#"
              className="rounded-md bg-zinc-900 px-8 py-3.5 text-base font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Explore Investments
            </a>
            <a
              href="#"
              className="rounded-md border border-zinc-200 bg-transparent px-8 py-3.5 text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              Learn About Bonds
            </a>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="bg-zinc-100 px-4 py-16 dark:bg-zinc-900/50 sm:px-8">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 text-2xl dark:bg-zinc-800">
                ◈
              </div>
              <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Curated Selection
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Every bond is vetted by our research team. We focus on quality over quantity.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 text-2xl dark:bg-zinc-800">
                ◎
              </div>
              <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Predictable Income
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Know your returns upfront. Fixed income instruments designed for stability.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 text-2xl dark:bg-zinc-800">
                ◇
              </div>
              <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Full Transparency
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Clear risk labels, honest disclosures, and no hidden surprises.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="bg-white px-4 py-16 dark:bg-zinc-900 sm:px-8 md:py-20">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Built for thoughtful investors
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Whether you&apos;re starting out or diversifying, we make bonds accessible.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: "💼", title: "Working Professionals", desc: "Build wealth alongside your career with stable returns." },
              { icon: "🏡", title: "Retired Investors", desc: "Secure regular income with lower volatility options." },
              { icon: "🌱", title: "First-Time Investors", desc: "Start with simple, well-explained bond options." },
              { icon: "📊", title: "Portfolio Diversifiers", desc: "Balance equity exposure with fixed income allocation." },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-6 text-center dark:border-zinc-800 dark:bg-zinc-900/50"
              >
                <div className="mb-4 text-3xl">{card.icon}</div>
                <h4 className="mb-2 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  {card.title}
                </h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collections Preview */}
      <section className="bg-zinc-100 px-4 py-16 dark:bg-zinc-900/50 sm:px-8 md:py-20">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Explore bond collections
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Browse curated categories based on your preferences.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "12% Plus", badge: "Popular", desc: "Bonds offering higher interest payout structures.", meta: ["Yield: 12–15%", "Risk: Moderate"] },
              { title: "High Rated", badge: null, desc: "Bonds from well-recognised and established entities.", meta: ["Rating: AA and above", "Risk: Lower"] },
              { title: "Monthly Interest", badge: null, desc: "Bonds that pay interest at regular monthly intervals.", meta: ["Payout: Monthly", "Yield: 9–12%"] },
              { title: "10K Bonds", badge: "Entry-friendly", desc: "Start investing with a minimum of ten thousand rupees.", meta: ["Min: ₹10,000", "Options: 25+"] },
              { title: "Short Term", badge: null, desc: "Bonds with shorter maturity periods for quicker returns.", meta: ["Tenure: 1–2 years", "Liquidity: Higher"] },
              { title: "Secured Bonds", badge: null, desc: "Bonds supported by defined security structures.", meta: ["Security: Asset-backed", "Risk: Lower"] },
            ].map((c) => (
              <div
                key={c.title}
                className="cursor-pointer rounded-xl border border-zinc-200 bg-white p-7 transition-all hover:-translate-y-0.5 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600"
              >
                <div className="mb-4 flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    {c.title}
                  </h3>
                  {c.badge && (
                    <span className="rounded bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                      {c.badge}
                    </span>
                  )}
                </div>
                <p className="mb-5 text-sm text-zinc-600 dark:text-zinc-400">{c.desc}</p>
                <div className="flex justify-between border-t border-zinc-200 pt-4 dark:border-zinc-700">
                  {c.meta.map((m) => (
                    <span key={m} className="text-xs text-zinc-500 dark:text-zinc-400">
                      {m.split(": ")[0]}: <strong className="text-zinc-900 dark:text-zinc-100">{m.split(": ")[1]}</strong>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white px-4 py-16 dark:bg-zinc-900 sm:px-8 md:py-20">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              How it works
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Three simple steps to start investing in bonds.
            </p>
          </div>
          <div className="grid gap-12 md:grid-cols-3">
            {[
              { num: "1", title: "Create Your Account", desc: "Sign up in minutes with basic details and complete your KYC." },
              { num: "2", title: "Explore & Choose", desc: "Browse curated collections and select bonds that match your goals." },
              { num: "3", title: "Invest & Earn", desc: "Complete your investment and start receiving predictable returns." },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 text-xl font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
                  {step.num}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {step.title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="bg-zinc-100 px-4 py-16 dark:bg-zinc-900/50 sm:px-8 md:py-20">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="mb-12 text-center text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Trusted by investors across India
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: "30L+", label: "Investors trust us" },
              { value: "₹2,500Cr+", label: "Investments facilitated" },
              { value: "SEBI", label: "Registered platform" },
              { value: "500+", label: "Bond options available" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="mb-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100 md:text-4xl">
                  {item.value}
                </div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Risk Clarity */}
      <section className="bg-zinc-50 px-4 py-16 dark:bg-zinc-950 sm:px-8">
        <div className="mx-auto max-w-[800px] text-center">
          <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100 md:text-2xl">
            Transparent about risk
          </h2>
          <p className="mb-6 text-zinc-600 dark:text-zinc-400">
            We believe trust is built through honesty. Every investment carries risk, and we help you understand it clearly.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {["Clear risk labels on every bond", "Plain language explanations", "No hidden terms or surprises", "Your capital is at risk"].map((point) => (
              <div key={point} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <span className="text-zinc-900 dark:text-zinc-100">✓</span>
                {point}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white px-4 py-16 dark:bg-zinc-900 sm:px-8 md:py-20">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="mb-12 text-center text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            What investors say
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { quote: "Finally, a platform that explains bonds without jargon. I understood exactly what I was investing in.", name: "Rajesh M.", role: "Salaried Professional, Bangalore", initial: "R" },
              { quote: "The monthly interest payouts help me manage my retirement expenses smoothly.", name: "Sunita K.", role: "Retired Investor, Mumbai", initial: "S" },
              { quote: "I started with 10K bonds to learn. The curated collections made it easy to choose.", name: "Amit P.", role: "First-time Investor, Delhi", initial: "A" },
            ].map((t) => (
              <div
                key={t.name}
                className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-8 dark:border-zinc-800 dark:bg-zinc-900/50"
              >
                <p className="mb-6 italic leading-relaxed text-zinc-900 dark:text-zinc-100">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200 text-base dark:bg-zinc-700 dark:text-zinc-300">
                    {t.initial}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{t.name}</h4>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Links */}
      <section className="bg-zinc-100 px-4 py-16 dark:bg-zinc-900/50 sm:px-8">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Learn about bonds
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              New to fixed income? We&apos;ve got you covered.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {["What are bonds?", "Understanding fixed income", "How bond yields work"].map((label) => (
              <a
                key={label}
                href="#"
                className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-6 py-5 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600"
              >
                <span className="font-medium text-zinc-900 dark:text-zinc-100">{label}</span>
                <span className="text-zinc-500 dark:text-zinc-400">→</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-zinc-900 px-4 py-16 text-center dark:bg-zinc-100 sm:px-8 md:py-20">
        <h2 className="mb-4 text-2xl font-bold text-white dark:text-zinc-900 md:text-3xl">
          Ready to explore?
        </h2>
        <p className="mb-8 text-lg text-white/80 dark:text-zinc-700">
          Start your journey towards predictable, transparent fixed income.
        </p>
        <a
          href="#"
          className="inline-block rounded-md bg-white px-8 py-4 text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
        >
          Explore Investments
        </a>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white px-4 py-12 dark:border-zinc-800 dark:bg-zinc-900 sm:px-8">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <h3 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                Bonds India
              </h3>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                A SEBI-registered platform for curated bond investments. We help investors access fixed income opportunities with clarity and confidence.
              </p>
            </div>
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-900 dark:text-zinc-100">
                Products
              </h4>
              <ul className="space-y-2">
                {["Bond Collections", "NCD IPOs", "Active Deals", "Watchlist"].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-900 dark:text-zinc-100">
                Learn
              </h4>
              <ul className="space-y-2">
                {["Bond Basics", "Fixed Income Guide", "Risk Education", "Blog"].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-900 dark:text-zinc-100">
                Support
              </h4>
              <ul className="space-y-2">
                {["Help Centre", "Contact Us", "FAQs", "Grievance Redressal"].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-zinc-200 pt-8 dark:border-zinc-700">
            <p className="mb-4 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              <strong>Risk Disclosure:</strong> Investments in bonds are subject to market risks. Returns are not guaranteed and past performance does not indicate future results. Please read all scheme-related documents carefully before investing. Bonds India is a SEBI-registered intermediary.
            </p>
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-center">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                © 2025 Bonds India. All rights reserved.
              </span>
              <div className="flex gap-6">
                <a href="#" className="text-sm text-zinc-600 dark:text-zinc-400">Privacy Policy</a>
                <a href="#" className="text-sm text-zinc-600 dark:text-zinc-400">Terms of Use</a>
                <a href="#" className="text-sm text-zinc-600 dark:text-zinc-400">Disclosures</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
