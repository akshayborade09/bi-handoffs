"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

const FAQ_ITEMS = [
  {
    question: "Why bonds over bank deposits?",
    answer:
      "Bonds typically offer higher yields than fixed deposits while providing predictable returns. They're issued by companies and governments, giving you more options to diversify your fixed income portfolio.",
  },
  {
    question: "What do returns mean in plain words?",
    answer:
      "The indicative yield shows what percentage return you can expect annually. For example, a 10% yield on ₹1,00,000 means you'd earn approximately ₹10,000 per year until maturity.",
  },
  {
    question: "How do interest payouts work?",
    answer:
      "Depending on the bond, interest is paid monthly, quarterly, or at maturity. Monthly payout bonds give you regular income, while cumulative bonds compound your returns until maturity.",
  },
  {
    question: "Where are my funds held?",
    answer:
      "Your investments are held in a demat account in your name. BondsIndia acts as an intermediary — we never hold your funds directly. All transactions are processed through SEBI-registered depositories.",
  },
];

export function PostSignUpV1() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const { data: session } = useSession();
  
  const userName = session?.user?.name || "User";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-full bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-[100] border-b border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-900 sm:px-8">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between">
          <div className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            BondsIndia
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
              Active Deals
            </a>
            <a
              href="#"
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Learn
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="p-2 text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              aria-label="Cart"
            >
              🛒
            </a>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white transition-opacity hover:opacity-80 dark:bg-zinc-100 dark:text-zinc-900"
              aria-label="Sign out"
              title="Click to sign out"
            >
              {userInitials}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-[1200px] px-4 py-8 pb-24 sm:px-8 md:pb-8">
        {/* Welcome Section */}
        <section className="mb-8 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 sm:p-10">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-md bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                <span>✓</span> Account created successfully
              </div>
              <h1 className="mb-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-3xl">
                Welcome, {userName}
              </h1>
              <p className="mb-4 text-lg text-zinc-600 dark:text-zinc-400">
                Your journey to predictable income starts here.
              </p>
              <p className="mb-6 border-l-4 border-zinc-200 pl-4 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
                Explore curated, SEBI-regulated bonds with clear returns and simple choices.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <a
              href="#"
              className="rounded-md bg-zinc-900 px-8 py-3.5 text-base font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Start Investing
            </a>
            <a
              href="#"
              className="rounded-md border border-zinc-200 bg-transparent px-8 py-3.5 text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              Build My Portfolio
            </a>
          </div>
        </section>

        {/* Two Column Grid */}
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          {/* Main Column */}
          <div>
            {/* Recommended for You */}
            <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Recommended for you
                </h2>
                <a
                  href="#"
                  className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  View all →
                </a>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-zinc-200 bg-zinc-50/80 p-5 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-600">
                  <div>
                    <h3 className="mb-1.5 font-semibold text-zinc-900 dark:text-zinc-100">
                      High-Rated Corporate Bonds
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                      <span>Tenure: <strong className="text-zinc-900 dark:text-zinc-100">3 Years</strong></span>
                      <span>Rating: <strong className="text-zinc-900 dark:text-zinc-100">AA+</strong></span>
                      <span>Min: <strong className="text-zinc-900 dark:text-zinc-100">₹10,000</strong></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="rounded bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                      Filling Fast
                    </span>
                    <div className="text-right">
                      <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">10.2%</div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">Indicative Yield</div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-zinc-200 bg-zinc-50/80 p-5 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-600">
                  <div>
                    <h3 className="mb-1.5 font-semibold text-zinc-900 dark:text-zinc-100">
                      Monthly Payout Bonds
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                      <span>Tenure: <strong className="text-zinc-900 dark:text-zinc-100">2 Years</strong></span>
                      <span>Rating: <strong className="text-zinc-900 dark:text-zinc-100">A+</strong></span>
                      <span>Payout: <strong className="text-zinc-900 dark:text-zinc-100">Monthly</strong></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="rounded bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                      Good for beginners
                    </span>
                    <div className="text-right">
                      <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">9.5%</div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">Indicative Yield</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* KYC Banner */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 dark:border-amber-800 dark:bg-amber-950/30">
              <div className="flex items-center gap-3">
                <span className="text-xl">📋</span>
                <div>
                  <h4 className="font-medium text-amber-900 dark:text-amber-200">
                    Complete your KYC to invest seamlessly
                  </h4>
                  <p className="text-sm text-amber-800 dark:text-amber-300/90">
                    One-time verification. Takes less than 5 minutes.
                  </p>
                </div>
              </div>
              <a
                href="#"
                className="shrink-0 rounded-md bg-amber-800 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-900 dark:bg-amber-700 dark:hover:bg-amber-600"
              >
                Complete KYC
              </a>
            </div>

            {/* Next Steps Checklist */}
            <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="mb-5 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Your next steps
              </h2>
              <div className="flex flex-col gap-3">
                {[
                  { done: true, title: "Create your account", desc: "Account successfully created" },
                  { done: false, title: "Complete profile & risk preferences", desc: "Help us understand your investment goals", action: "Complete →" },
                  { done: false, title: "Choose bond category", desc: "Browse curated collections", action: "Explore →" },
                  { done: false, title: "Select tenure & amount", desc: "Pick bonds that fit your timeline" },
                  { done: false, title: "Invest with confidence", desc: "Complete your first investment" },
                ].map((item) => (
                  <div
                    key={item.title}
                    className={`flex flex-wrap items-center gap-3 rounded-lg border p-4 ${
                      item.done
                        ? "border-emerald-200 bg-emerald-50/80 dark:border-emerald-900 dark:bg-emerald-950/30"
                        : "border-zinc-200 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-900/50"
                    }`}
                  >
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                        item.done
                          ? "border-emerald-600 bg-emerald-600 text-white dark:border-emerald-500 dark:bg-emerald-500"
                          : "border-zinc-300 dark:border-zinc-600"
                      }`}
                    >
                      {item.done && "✓"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-zinc-900 dark:text-zinc-100">{item.title}</h4>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">{item.desc}</p>
                    </div>
                    {item.action && (
                      <a
                        href="#"
                        className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                      >
                        {item.action}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Accordion */}
            <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="mb-5 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Common questions
              </h2>
              <div className="flex flex-col gap-2">
                {FAQ_ITEMS.map((faq, index) => (
                  <div
                    key={faq.question}
                    className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                      className="flex w-full items-center justify-between bg-zinc-50/80 px-5 py-4 text-left text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:bg-zinc-900/50 dark:text-zinc-100 dark:hover:bg-zinc-800"
                    >
                      {faq.question}
                      <span className="shrink-0 text-zinc-500 dark:text-zinc-400">
                        {openFaqIndex === index ? "−" : "+"}
                      </span>
                    </button>
                    {openFaqIndex === index && (
                      <div className="border-t border-zinc-200 bg-white px-5 py-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Secondary Actions */}
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: "📊", label: "Explore All Opportunities" },
                { icon: "📚", label: "Learn About Bonds" },
                { icon: "💬", label: "Help & Support" },
              ].map((action) => (
                <a
                  key={action.label}
                  href="#"
                  className="flex flex-col items-center rounded-xl border border-zinc-200 bg-white p-6 text-center transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600"
                >
                  <span className="mb-3 text-2xl">{action.icon}</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {action.label}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6 lg:order-none">
            {/* Trust Card */}
            <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Why invest with us
              </h3>
              <ul className="flex flex-col gap-3">
                {[
                  "SEBI-registered investment platform",
                  "Transparent return calculations",
                  "Clear risk disclosure on every bond",
                  "Curated by in-house research team",
                ].map((text) => (
                  <li key={text} className="flex items-start gap-2.5">
                    <span className="mt-0.5 text-emerald-600 dark:text-emerald-400">✓</span>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{text}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-t border-zinc-200 pt-4 text-xs text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                Returns not guaranteed. Investments are subject to market risks.
              </p>
            </div>

            {/* Social Proof */}
            <div className="rounded-xl border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-1 text-3xl font-bold text-zinc-900 dark:text-zinc-100">30L+</div>
              <div className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
                investors trust BondsIndia
              </div>
              <div className="border-t border-zinc-200 pt-4 dark:border-zinc-700">
                <p className="mb-2 text-sm italic text-zinc-600 dark:text-zinc-400">
                  &ldquo;The clarity on returns made my first bond investment very simple.&rdquo;
                </p>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">— Priya S., Mumbai</span>
              </div>
            </div>
          </div>
        </div>

        {/* Support Banner */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div>
            <h3 className="mb-1 font-semibold text-zinc-900 dark:text-zinc-100">
              We&apos;re here to help you choose confidently
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Have questions? Our team is ready to assist you.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <a
              href="#"
              className="flex items-center gap-2 rounded-md bg-zinc-100 px-4 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
            >
              💬 Chat with us
            </a>
            <a
              href="#"
              className="flex items-center gap-2 rounded-md bg-zinc-100 px-4 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
            >
              📞 Request callback
            </a>
            <a
              href="#"
              className="flex items-center gap-2 rounded-md bg-zinc-100 px-4 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
            >
              📖 Help centre
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-zinc-200 bg-white px-4 py-8 dark:border-zinc-800 dark:bg-zinc-900 sm:px-8">
        <div className="mx-auto max-w-[1200px]">
          <p className="mb-4 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
            <strong>Risk Disclosure:</strong> Investments in bonds are subject to market risks. Returns are not guaranteed and past performance does not indicate future results. Please read all scheme-related documents carefully before investing. BondsIndia is a SEBI-registered intermediary.
          </p>
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-center">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              © 2025 BondsIndia. All rights reserved.
            </span>
            <div className="flex flex-wrap gap-6">
              <a href="#" className="text-sm text-zinc-600 dark:text-zinc-400">Privacy Policy</a>
              <a href="#" className="text-sm text-zinc-600 dark:text-zinc-400">Terms of Use</a>
              <a href="#" className="text-sm text-zinc-600 dark:text-zinc-400">Disclosures</a>
              <a href="#" className="text-sm text-zinc-600 dark:text-zinc-400">Contact</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-[100] border-t border-zinc-200 bg-white p-4 md:hidden dark:border-zinc-800 dark:bg-zinc-900">
        <a
          href="#"
          className="block w-full rounded-md bg-zinc-900 py-4 text-center text-base font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Start Investing
        </a>
      </div>
    </div>
  );
}
