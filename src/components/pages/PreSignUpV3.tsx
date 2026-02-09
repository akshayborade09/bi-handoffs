"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollReveal from "@/components/ScrollReveal";

gsap.registerPlugin(ScrollTrigger);

function BondCard({
  badgeText = "Highest YTM",
  badgeBg = "bg-[#f2e2ff]",
  badgeTextColor = "text-[#694189]",
}: {
  badgeText?: string;
  badgeBg?: string;
  badgeTextColor?: string;
}) {
  return (
    <div
      className="bg-white rounded-[14px] shadow-[0px_4px_44px_0px_rgba(0,0,0,0.05)] p-2.5 flex flex-col gap-4 w-[260px]"
      style={{ fontFamily: "var(--font-instrument-sans), sans-serif" }}
    >
      <div className="bg-[#d1dadd] rounded-[11px] h-[130px] relative overflow-hidden">
        <p className="absolute bottom-8 left-3 text-[#126b89] font-semibold text-[15px] tracking-[-0.3px]">
          11.81% yearly
        </p>
        <div className={`absolute bottom-3 right-3 ${badgeBg} px-2 py-1.5 rounded`}>
          <p className={`${badgeTextColor} font-semibold text-[11px] leading-[13px] tracking-[-0.22px] text-center`}>
            {badgeText}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5 text-black">
          <p className="opacity-70 text-[15px] tracking-[-0.3px]">Satin Finserv</p>
          <p className="opacity-70 text-[11px] tracking-[-0.22px]">SFL Pvt Limited</p>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <div className="flex flex-col gap-1 w-[60px]">
            <div className="h-[3px] bg-black rounded-full w-full" />
            <div className="h-[3px] bg-black rounded-full w-[50px]" />
          </div>
          <p className="text-black font-semibold text-[13px] tracking-[-0.26px]">98.99% sold</p>
        </div>
      </div>
      <div className="h-px bg-black/10 w-full" />
      <div className="flex items-center justify-between">
        <p className="text-black opacity-70 text-[13px] tracking-[-0.26px]">
          Minimum <span className="font-bold">₹99,869</span>
        </p>
        <button className="bg-black text-white font-semibold text-[11px] tracking-[-0.22px] px-2.5 py-2 rounded-lg">
          Know more
        </button>
      </div>
    </div>
  );
}

const FEATURE_CARDS = [
  {
    title: "Zero Brokerage",
    image: "/zero-brokerage.png",
    description: "We believe in removing barriers for first-time market participants. We grow when you grow.",
  },
  {
    title: "Seamless KYC",
    image: "/kyc.png",
    description: "Onboard in minutes with our fully digital and secure KYC process.",
  },
  {
    title: "Curated bonds",
    image: "/curated.png",
    description: "Access a handpicked selection of bonds vetted by our expert research team.",
  },
  {
    title: "Secured Payment",
    image: "/seecured.png",
    description: "Transact with confidence using our secure, encrypted payment gateways.",
  },
];

export function PreSignUpV3() {
  const headerRef = useRef<HTMLElement>(null);
  const headingContainerRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const appScrollRef = useRef<HTMLImageElement>(null);
  const yieldCardRef = useRef<HTMLDivElement>(null);
  const tenureCardRef = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const card4Ref = useRef<HTMLDivElement>(null);
  const card5Ref = useRef<HTMLDivElement>(null);
  const card6Ref = useRef<HTMLDivElement>(null);

  const bgPatternRef = useRef<HTMLDivElement>(null);
  const bgOverlayRef = useRef<HTMLDivElement>(null);
  const bondsSectionRef = useRef<HTMLDivElement>(null);

  const ytmTitleRef = useRef<HTMLParagraphElement>(null);
  const mpTitleRef = useRef<HTMLParagraphElement>(null);
  const ltTitleRef = useRef<HTMLParagraphElement>(null);

  const ytmC1 = useRef<HTMLDivElement>(null);
  const ytmC2 = useRef<HTMLDivElement>(null);
  const ytmC3 = useRef<HTMLDivElement>(null);
  const ytmC4 = useRef<HTMLDivElement>(null);

  const mpC1 = useRef<HTMLDivElement>(null);
  const mpC2 = useRef<HTMLDivElement>(null);
  const mpC3 = useRef<HTMLDivElement>(null);
  const mpC4 = useRef<HTMLDivElement>(null);

  const ltCardsRef = useRef<HTMLDivElement>(null);

  // Nurturing section refs
  const nurturingTriggerRef = useRef<HTMLDivElement>(null);
  const nurturingSectionRef = useRef<HTMLDivElement>(null);
  const nurtCard1 = useRef<HTMLDivElement>(null);
  const nurtCard2 = useRef<HTMLDivElement>(null);
  const nurtCard3 = useRef<HTMLDivElement>(null);
  const nurtCard4 = useRef<HTMLDivElement>(null);
  const nurtHeadingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let lastScroll = 0;
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (headerRef.current) {
        if (currentScroll > lastScroll && currentScroll > 100) {
          gsap.to(headerRef.current, { y: -100, duration: 0.3, ease: "power2.out" });
        } else if (currentScroll < lastScroll) {
          gsap.to(headerRef.current, { y: 0, duration: 0.3, ease: "power2.out" });
        }
      }
      lastScroll = currentScroll;
    };
    window.addEventListener("scroll", handleScroll);

    if (headingContainerRef.current) {
      gsap.to(headingContainerRef.current, {
        opacity: 0, y: -80, scale: 0.95, ease: "power2.out",
        scrollTrigger: { trigger: headingContainerRef.current, start: "top top", end: "top -200px", scrub: 1.5 },
      });
    }

    const ytmCards = [ytmC1.current, ytmC2.current, ytmC3.current, ytmC4.current];
    const mpCards = [mpC1.current, mpC2.current, mpC3.current, mpC4.current];
    const nurtCards = [nurtCard1.current, nurtCard2.current, nurtCard3.current, nurtCard4.current];

    const allRefsExist =
      mobileContainerRef.current && mobileRef.current && appScrollRef.current &&
      yieldCardRef.current && tenureCardRef.current && card3Ref.current &&
      card4Ref.current && card5Ref.current && card6Ref.current &&
      bgPatternRef.current && bgOverlayRef.current && bondsSectionRef.current &&
      ytmTitleRef.current && mpTitleRef.current && ltTitleRef.current &&
      ytmCards.every(Boolean) && mpCards.every(Boolean) && ltCardsRef.current &&
      nurturingTriggerRef.current && nurturingSectionRef.current &&
      nurtCards.every(Boolean) && nurtHeadingRef.current;

    if (allRefsExist) {
      // Side cards initial states
      gsap.set(yieldCardRef.current, { opacity: 0.6, y: -200 });
      gsap.set(tenureCardRef.current, { opacity: 0.6, y: 400 });
      gsap.set(card3Ref.current, { opacity: 0.6, y: 1000 });
      gsap.set(card4Ref.current, { opacity: 0.6, y: 1600 });
      gsap.set(card5Ref.current, { opacity: 0.6, y: 2200 });
      gsap.set(card6Ref.current, { opacity: 0.6, y: 2800 });

      // Bonds section initial states
      gsap.set(bgOverlayRef.current, { opacity: 0 });
      gsap.set(bondsSectionRef.current, { opacity: 0, y: 40 });
      gsap.set(ytmCards, { transformOrigin: "top center" });
      gsap.set(mpCards, { transformOrigin: "top center" });
      gsap.set(mpTitleRef.current, { opacity: 0, y: 10 });
      gsap.set(mpCards, { opacity: 0, y: 40 });
      gsap.set(ltTitleRef.current, { opacity: 0, y: 10 });
      gsap.set(ltCardsRef.current, { opacity: 0, y: 40 });

      // Nurturing section initial states
      gsap.set(nurturingSectionRef.current, { opacity: 0 });
      gsap.set(nurtHeadingRef.current, { opacity: 0, y: 30 });
      gsap.set(nurtCards, { opacity: 0, y: 60 });

      // ═══════════════════════════════════════════════════════
      // MAIN PINNED TIMELINE — +=340%
      // ═══════════════════════════════════════════════════════
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: mobileContainerRef.current,
          start: "top top",
          end: "+=340%",
          pin: mobileContainerRef.current,
          scrub: 0.5,
          anticipatePin: 1,
        },
      });

      // Phase 1: Mobile centers (0 → 0.18)
      tl.fromTo(mobileRef.current,
        { marginBottom: "-15%", y: 0 },
        { marginBottom: "0%", y: -200, ease: "power1.out", duration: 0.18 },
        0
      );

      // Phase 2: Pause (0.18 → 0.24)
      tl.to({}, { duration: 0.06 }, 0.18);

      // Phase 3: Phone scroll + side cards (0.24 → 0.59)
      tl.to(appScrollRef.current, { y: -3500, ease: "none", duration: 0.35 }, 0.24);
      const MOVE_DISTANCE = 3400;
      [yieldCardRef, tenureCardRef, card3Ref, card4Ref, card5Ref, card6Ref].forEach((ref, i) => {
        const startY = [-200, 400, 1000, 1600, 2200, 2800][i];
        tl.to(ref.current!, { y: startY - MOVE_DISTANCE, opacity: 1, ease: "none", duration: 0.35 }, 0.24);
      });

      // Phase 4: Phone exits (0.59 → 0.63)
      tl.to(mobileRef.current, { y: -500, opacity: 0, ease: "power2.in", duration: 0.04 }, 0.59);
      [yieldCardRef, tenureCardRef, card3Ref, card4Ref, card5Ref, card6Ref].forEach((ref) => {
        tl.to(ref.current!, { opacity: 0, ease: "power2.in", duration: 0.03 }, 0.59);
      });
      tl.to(bgPatternRef.current, { opacity: 0, duration: 0.04 }, 0.59);
      tl.to(bgOverlayRef.current, { opacity: 1, duration: 0.04 }, 0.59);

      // Phase 5: YTM section appears (0.63 → 0.67)
      tl.to(bondsSectionRef.current, { opacity: 1, y: 0, ease: "power2.out", duration: 0.04 }, 0.63);

      // Phase 6: YTM recedes → MP appears (0.69 → 0.79)
      tl.to(ytmTitleRef.current, { opacity: 0, y: -10, ease: "power2.in", duration: 0.05 }, 0.69);
      ytmCards.forEach((card) => {
        tl.to(card!, { scale: 0.92, y: -20, opacity: 0.35, ease: "power2.inOut", duration: 0.08 }, 0.69);
      });
      tl.to(mpTitleRef.current, { opacity: 1, y: 0, ease: "power2.out", duration: 0.05 }, 0.74);
      mpCards.forEach((card) => {
        tl.to(card!, { opacity: 1, y: 0, ease: "power2.out", duration: 0.06 }, 0.74);
      });

      // Phase 7: MP recedes → LT appears (0.82 → 0.95)
      tl.to(mpTitleRef.current, { opacity: 0, y: -10, ease: "power2.in", duration: 0.05 }, 0.82);
      ytmCards.forEach((card) => {
        tl.to(card!, { scale: 0.82, y: -40, opacity: 0.15, ease: "power2.inOut", duration: 0.08 }, 0.82);
      });
      mpCards.forEach((card) => {
        tl.to(card!, { scale: 0.92, y: -20, opacity: 0.35, ease: "power2.inOut", duration: 0.08 }, 0.82);
      });
      tl.to(ltTitleRef.current, { opacity: 1, y: 0, ease: "power2.out", duration: 0.05 }, 0.88);
      tl.to(ltCardsRef.current, { opacity: 1, y: 0, ease: "power2.out", duration: 0.08 }, 0.88);

      // ═══════════════════════════════════════════════════════
      // NURTURING SECTION — separate ScrollTrigger
      // Bonds section fades out → nurturing appears → cards stagger in
      // ═══════════════════════════════════════════════════════
      ScrollTrigger.create({
        trigger: nurturingTriggerRef.current,
        start: "top 90%",
        onEnter: () => {
          // Fade out bonds section
          gsap.to(bondsSectionRef.current, { opacity: 0, y: -30, duration: 0.4, ease: "power2.in" });

          // Change bg to white
          gsap.to(bgOverlayRef.current, {
            backgroundColor: "#ffffff",
            duration: 0.4,
          });

          // Fade in nurturing section
          gsap.to(nurturingSectionRef.current, { opacity: 1, duration: 0.3, delay: 0.25 });

          // Heading slides in
          gsap.to(nurtHeadingRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.3 });

          // Cards slide in one by one with stagger
          gsap.to(nurtCards, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.12,
            ease: "power2.out",
            delay: 0.45,
          });
        },
        onLeaveBack: () => {
          // Reverse: hide nurturing, show bonds
          gsap.to(nurtCards, { opacity: 0, y: 60, duration: 0.3, stagger: 0 });
          gsap.to(nurtHeadingRef.current, { opacity: 0, y: 30, duration: 0.3 });
          gsap.to(nurturingSectionRef.current, { opacity: 0, duration: 0.3 });
          gsap.to(bgOverlayRef.current, { backgroundColor: "#F3F3F3", duration: 0.3 });
          gsap.to(bondsSectionRef.current, { opacity: 1, y: 0, duration: 0.4, delay: 0.2, ease: "power2.out" });
        },
      });
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-white via-[#E3FDF3] to-[#E3FDEB] relative"
      style={{ fontFamily: "var(--font-instrument-sans), sans-serif" }}
    >
      {/* Background Pattern */}
      <div
        ref={bgPatternRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        style={{
          backgroundImage: "url(/version\\ 3/bg-pattern.svg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Background Overlay */}
      <div
        ref={bgOverlayRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-[5]"
        style={{ backgroundColor: "#F3F3F3", opacity: 0 }}
      />

      {/* ═══ Bonds Section — 3 stacked card layers ═══ */}
      <div
        ref={bondsSectionRef}
        className="fixed inset-0 w-full h-full flex flex-col items-center justify-center z-[15] pointer-events-none"
      >
        <div className="pointer-events-auto flex flex-col items-center">
          <div className="text-center mb-10">
            <p className="text-[22px] font-semibold tracking-[-0.44px] text-black mb-1">
              Bonds with highest
            </p>
            <div className="relative h-[60px]">
              <p ref={ytmTitleRef} className="text-[48px] font-medium tracking-[-0.96px] absolute inset-0"
                style={{ background: "linear-gradient(180deg, #C57AFF 0%, #37035F 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Yield to Maturity
              </p>
              <p ref={mpTitleRef} className="text-[48px] font-medium tracking-[-0.96px] absolute inset-0"
                style={{ background: "linear-gradient(180deg, #2B5BDB 0%, #0C1C54 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Monthly Payouts
              </p>
              <p ref={ltTitleRef} className="text-[48px] font-medium tracking-[-0.96px] absolute inset-0"
                style={{ background: "linear-gradient(180deg, #E84393 0%, #6C1D45 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Lowest tenure
              </p>
            </div>
          </div>

          <div className="relative mb-10">
            <div className="flex items-start justify-center gap-5">
              <div ref={ytmC1}><BondCard badgeText="Highest YTM" badgeBg="bg-[#f2e2ff]" badgeTextColor="text-[#694189]" /></div>
              <div ref={ytmC2}><BondCard badgeText="Highest YTM" badgeBg="bg-[#f2e2ff]" badgeTextColor="text-[#694189]" /></div>
              <div ref={ytmC3}><BondCard badgeText="Highest YTM" badgeBg="bg-[#f2e2ff]" badgeTextColor="text-[#694189]" /></div>
              <div ref={ytmC4}><BondCard badgeText="Highest YTM" badgeBg="bg-[#f2e2ff]" badgeTextColor="text-[#694189]" /></div>
            </div>
            <div className="absolute inset-0 flex items-start justify-center gap-5">
              <div ref={mpC1}><BondCard badgeText="Monthly Payouts" badgeBg="bg-[#E2EAFF]" badgeTextColor="text-[#2B4899]" /></div>
              <div ref={mpC2}><BondCard badgeText="Monthly Payouts" badgeBg="bg-[#E2EAFF]" badgeTextColor="text-[#2B4899]" /></div>
              <div ref={mpC3}><BondCard badgeText="Monthly Payouts" badgeBg="bg-[#E2EAFF]" badgeTextColor="text-[#2B4899]" /></div>
              <div ref={mpC4}><BondCard badgeText="Monthly Payouts" badgeBg="bg-[#E2EAFF]" badgeTextColor="text-[#2B4899]" /></div>
            </div>
            <div ref={ltCardsRef} className="absolute inset-0 flex items-start justify-center gap-5">
              <BondCard badgeText="Lowest Tenure" badgeBg="bg-[#FFE2EC]" badgeTextColor="text-[#8B2252]" />
              <BondCard badgeText="Lowest Tenure" badgeBg="bg-[#FFE2EC]" badgeTextColor="text-[#8B2252]" />
              <BondCard badgeText="Lowest Tenure" badgeBg="bg-[#FFE2EC]" badgeTextColor="text-[#8B2252]" />
              <BondCard badgeText="Lowest Tenure" badgeBg="bg-[#FFE2EC]" badgeTextColor="text-[#8B2252]" />
            </div>
          </div>

          <div>
            <button className="px-8 py-3 rounded-full border border-black/20 text-black/50 text-sm font-medium tracking-tight hover:bg-black/5 transition-colors">
              Show all bonds
            </button>
          </div>
        </div>
      </div>

      {/* ═══ Nurturing Section — Fixed overlay ═══ */}
      <div
        ref={nurturingSectionRef}
        className="fixed inset-0 w-full h-full z-[16] pointer-events-none"
        style={{ opacity: 0 }}
      >
        <div className="pointer-events-auto w-full h-full bg-white px-20 pt-24 pb-20 flex flex-col justify-center gap-6">
          {/* Heading */}
          <div ref={nurtHeadingRef} className="mb-8">
            <div className="text-7xl font-normal leading-[1.2] tracking-[-0.96px] text-black flex flex-col gap-1.5">
              <p>&ldquo;Nurturing financial growth&rdquo;</p>
              <div className="flex gap-2 items-center">
                <p>for 1 lakh+</p>
                <p
                  className="font-semibold"
                  style={{
                    background: "linear-gradient(to right, #00c9e4, #01969a)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Indians
                </p>
              </div>
            </div>
          </div>

          {/* 4 Feature Cards */}
          <div className="flex gap-5 items-stretch">
            {FEATURE_CARDS.map((card, i) => (
              <div
                key={card.title}
                ref={[nurtCard1, nurtCard2, nurtCard3, nurtCard4][i]}
                className="bg-gradient-to-b from-white to-[#eaf2f2] border border-[#d9f0f3] rounded-[20px] flex-1 overflow-hidden relative flex flex-col p-5 gap-8"
              >
                {/* Title row with decorative brackets */}
                <div className="flex gap-1 items-center">
                  <span
                    className="text-[40px] leading-none font-normal"
                    style={{
                      background: "linear-gradient(to bottom, #00f9ff, #003c3e)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    ‹
                  </span>
                  <p className="text-3xl font-medium text-black tracking-[-0.48px] leading-[38px]">
                    {card.title}
                  </p>
                  <span
                    className="text-[40px] leading-none font-normal"
                    style={{
                      background: "linear-gradient(to bottom, #00f9ff, #003c3e)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    ›
                  </span>
                </div>

                {/* Image */}
                <div className="w-[320px] h-[320px] mt-6 mx-auto flex items-center justify-center">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

                {/* Description */}
                <p className="text-xl font-medium text-black tracking-[-0.36px] leading-[28px] mt-auto w-[254px]">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Header */}
      <header ref={headerRef} className="fixed top-0 left-0 right-0 bg-white px-32 py-6 z-50">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-black">BondsIndia</h1>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-6 text-sm font-medium tracking-tight text-black">
              <a href="#" className="hover:opacity-70 transition-opacity">Bonds</a>
              <a href="#" className="hover:opacity-70 transition-opacity">Resources</a>
            </div>
            <a href="#" className="text-sm font-medium tracking-tight text-black hover:opacity-70 transition-opacity">
              Download App
            </a>
            <button className="flex items-center justify-center gap-1.5 rounded bg-[#3be2e4] px-3 py-2.5 text-sm font-medium tracking-tight text-black transition-all hover:bg-[#2dd1d3]">
              <span>Login</span>
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="-rotate-45">
                <path d="M3.83594 9.16667L10.0859 9.16667L7.41927 11.8333L8.5026 12.9167L13.086 8.33333L8.5026 3.75L7.41927 4.83333L10.0859 7.5L3.83594 7.5L3.83594 9.16667Z" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Mobile */}
      <section ref={mobileContainerRef} className="relative px-32 pt-32 overflow-visible h-screen flex flex-col z-10">
        <div ref={yieldCardRef} className="absolute right-40 top-1/2 z-10">
          <img src="/version 3/yield.png" alt="Yield Card" className="w-[400px] h-auto" />
        </div>
        <div ref={tenureCardRef} className="absolute left-40 top-1/2 z-10">
          <img src="/version 3/tenure.png" alt="Tenure Card" className="w-[400px] h-auto" />
        </div>
        <div ref={card3Ref} className="absolute right-40 top-1/2 z-10">
          <img src="/version 3/payout.png" alt="Payout Card" className="w-[400px] h-auto" />
        </div>
        <div ref={card4Ref} className="absolute left-40 top-1/2 z-10">
          <img src="/version 3/yield.png" alt="Yield Card 2" className="w-[400px] h-auto" />
        </div>
        <div ref={card5Ref} className="absolute right-40 top-1/2 z-10">
          <img src="/version 3/tenure.png" alt="Tenure Card 2" className="w-[400px] h-auto" />
        </div>
        <div ref={card6Ref} className="absolute left-40 top-1/2 z-10">
          <img src="/version 3/payout.png" alt="Payout Card 2" className="w-[400px] h-auto" />
        </div>

        <div ref={headingContainerRef} className="flex flex-col items-center text-center">
          <div className="whitespace-nowrap">
            <ScrollReveal
              containerClassName="text-center"
              textClassName="text-8xl font-medium leading-normal tracking-tighter text-black whitespace-nowrap"
              baseOpacity={0.2} baseRotation={2} blurStrength={3}
            >
              Invest in bonds with
            </ScrollReveal>
          </div>
          <div className="flex items-center justify-center gap-3 -mt-5">
            <span className="text-8xl font-medium leading-normal tracking-tighter bg-gradient-to-b from-[#06C3C5] to-[#035E5F] bg-clip-text text-transparent"
              style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              9-12%
            </span>
            <span className="text-8xl font-medium leading-normal tracking-tighter text-black">fixed returns</span>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 mb-16">
            <span className="text-xl font-medium text-black">SEBI Registered</span>
            <img src="/version 3/star.svg" alt="" width="16" height="16" />
            <span className="text-xl font-medium text-black">Invest as low as ₹1,000</span>
            <img src="/version 3/star.svg" alt="" width="16" height="16" />
            <span className="text-xl font-medium text-black">Zero brokerage</span>
          </div>
        </div>

        <div className="flex-1 relative flex items-end justify-center">
          <div ref={mobileRef} className="relative w-[390px] scale-[1.3]" style={{ marginBottom: "-15%" }}>
            <img src="/version 3/mobile-frame.png" alt="Mobile Frame" className="w-full h-auto" />
            <div className="absolute top-3 left-[14px] right-[14px] bottom-3 bg-white rounded-[45px] overflow-hidden">
              <img ref={appScrollRef} src="/version 3/app-scroll.png" alt="App Content" className="w-full" />
              <img src="/version 3/top-status.png" alt="Status Bar" className="w-full absolute top-0 left-0 right-0 z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Nurturing trigger section — appears after pin ends */}
      <section ref={nurturingTriggerRef} className="h-screen" />

      {/* Extra scroll space */}
      <section className="min-h-screen" />
    </div>
  );
}
