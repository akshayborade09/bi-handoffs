"use client";

import { useCallback, useEffect, useRef, useState } from "react";
// next/image import removed — using native <img> for external URLs
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
      className="bg-white rounded-[12px] desk-sm:rounded-[14px] desk-md:rounded-[17px] desk:rounded-[20px] shadow-[0px_4px_44px_0px_rgba(0,0,0,0.05)] p-2 desk-sm:p-2.5 desk-md:p-3 desk:p-3.5 flex flex-col gap-2.5 desk-sm:gap-3 desk-md:gap-4 desk:gap-5 w-[210px] desk-sm:w-[230px] desk-md:w-[270px] desk:w-[300px] desk-lg:w-[340px]"
      style={{ fontFamily: "var(--font-instrument-sans), sans-serif" }}
    >
      <div className="bg-[#d1dadd] rounded-[9px] desk-sm:rounded-[11px] desk-md:rounded-[14px] desk:rounded-[16px] h-[100px] desk-sm:h-[115px] desk-md:h-[140px] desk:h-[150px] desk-lg:h-[170px] relative overflow-hidden">
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

const FAQ_ITEMS = [
  {
    id: "item-1",
    question: "What are bonds and how do they work?",
    answer:
      "Bonds are fixed-income instruments where you lend money to a government or corporation in exchange for regular interest payments and return of principal at maturity. They offer predictable returns ranging from 7-12% depending on the issuer and tenure.",
  },
  {
    id: "item-2",
    question: "What is the minimum investment amount?",
    answer:
      "You can start investing in bonds with as little as ₹1,000 on our platform. Some government securities and corporate bonds may have higher minimums depending on the issue, but we ensure accessible options for every investor.",
  },
  {
    id: "item-3",
    question: "Are my investments safe on BondsIndia?",
    answer:
      "BondsIndia is SEBI registered and all transactions are processed through secure, encrypted payment gateways. Government bonds carry sovereign guarantee, while corporate bonds are rated by agencies like CRISIL and ICRA to help you assess risk.",
  },
  {
    id: "item-4",
    question: "How do I receive my interest payouts?",
    answer:
      "Interest payouts are credited directly to your registered bank account. Depending on the bond, payouts can be monthly, quarterly, semi-annual, or at maturity. You can filter bonds by payout frequency on our platform.",
  },
  {
    id: "item-5",
    question: "Can I sell my bonds before maturity?",
    answer:
      "Yes, most bonds listed on our platform can be sold in the secondary market before maturity. Liquidity varies by bond type — government securities typically have higher liquidity than corporate bonds.",
  },
];

function FAQAccordion() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full divide-y divide-dotted divide-white/15">
      {FAQ_ITEMS.map((item) => (
        <div key={item.id}>
          <button
            onClick={() => toggle(item.id)}
            className="w-full flex items-center justify-between py-6 text-left cursor-pointer group"
          >
            <span className="text-md desk-sm:text-lg desk-md:text-lg desk:text-xl font-medium text-white group-hover:text-white/70 transition-colors">
              {item.question}
            </span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 16 16"
              fill="none"
              className={`shrink-0 ml-4 text-white/40 transition-transform duration-300 ${
                openId === item.id ? "rotate-180" : ""
              }`}
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div
            className={`grid transition-all duration-300 ease-in-out ${
              openId === item.id
                ? "grid-rows-[1fr] opacity-100 pb-5"
                : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <p className="text-sm desk-sm:text-base desk-md:text-lg desk:text-xl text-white/60 leading-relaxed">
                {item.answer}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const TESTIMONIALS = [
  {
    id: 1,
    quote:
      "The attention to detail and creative vision transformed our brand identity completely.",
    author: "Sarah Chen",
    role: "Creative Director",
    company: "Studio Forma",
    image:
      "https://plus.unsplash.com/premium_photo-1689551671548-79ff30459d2a?w=900&auto=format&fit=crop&q=60",
  },
  {
    id: 2,
    quote:
      "Working with them felt like a true creative partnership from day one.",
    author: "Marcus Webb",
    role: "Head of Design",
    company: "Minimal Co",
    image:
      "https://images.unsplash.com/photo-1649123245135-4db6ead931b5?w=900&auto=format&fit=crop&q=60",
  },
  {
    id: 3,
    quote:
      "They understand that great design is invisible yet unforgettable.",
    author: "Elena Voss",
    role: "Art Director",
    company: "Pixel & Co",
    image:
      "https://images.unsplash.com/photo-1701615004837-40d8573b6652?w=900&auto=format&fit=crop&q=60",
  },
];

// Module-level reset function for the testimonials carousel
let resetTestimonialsCarousel: (() => void) | null = null;

function TestimonialsCarousel() {
  const [active, setActive] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActive((prev) =>
          prev === TESTIMONIALS.length - 1 ? 0 : prev + 1
        );
        setTimeout(() => setIsTransitioning(false), 50);
      }, 300);
    }, 5000);
  }, []);

  // Expose reset to module scope
  useEffect(() => {
    resetTestimonialsCarousel = () => {
      setActive(0);
      setIsTransitioning(false);
      resetTimer();
    };
    return () => {
      resetTestimonialsCarousel = null;
    };
  }, [resetTimer]);

  // Start auto-play on mount
  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  const handleChange = (index: number) => {
    if (index === active || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActive(index);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 300);
    resetTimer(); // restart timer on manual interaction
  };

  const handlePrev = () => {
    const newIndex = active === 0 ? TESTIMONIALS.length - 1 : active - 1;
    handleChange(newIndex);
  };

  const handleNext = () => {
    const newIndex = active === TESTIMONIALS.length - 1 ? 0 : active + 1;
    handleChange(newIndex);
  };

  const current = TESTIMONIALS[active];

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col">
      {/* Large index number */}
      <div className="flex items-start gap-4 desk-sm:gap-6 desk-md:gap-7 desk:gap-8 min-h-[200px] desk-sm:min-h-[220px] desk-md:min-h-[235px] desk:min-h-[250px] desk-lg:min-h-[260px]">
        <span
          className="text-[72px] desk-sm:text-[90px] desk-md:text-[100px] desk:text-[110px] desk-lg:text-[120px] font-light leading-none text-black/10 select-none transition-all duration-500 shrink-0"
          style={{ fontFeatureSettings: '"tnum"', minWidth: "80px" }}
        >
          {String(active + 1).padStart(2, "0")}
        </span>

        <div className="flex-1 pt-2 desk-sm:pt-3 desk-md:pt-3 desk:pt-4">
          {/* Quote */}
          <blockquote
            className={`text-xl desk-sm:text-2xl desk-md:text-[26px] desk:text-[28px] desk-lg:text-3xl font-light leading-relaxed text-black tracking-tight transition-all duration-300 min-h-[80px] desk-sm:min-h-[90px] desk-md:min-h-[96px] desk:min-h-[102px] desk-lg:min-h-[108px] ${
              isTransitioning
                ? "opacity-0 translate-x-4"
                : "opacity-100 translate-x-0"
            }`}
          >
            {current.quote}
          </blockquote>

          {/* Author info */}
          <div
            className={`mt-10 group cursor-default transition-all duration-300 delay-100 ${
              isTransitioning ? "opacity-0" : "opacity-100"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-black/10 group-hover:ring-black/30 transition-all duration-300">
                <img
                  src={current.image}
                  alt={current.author}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <div>
                <p className="text-md desk-sm:text-md desk-md:text-lg desk:text-lg font-medium text-black">{current.author}</p>
                <p className="text-md desk-sm:text-md desk-md:text-lg desk:text-lg text-black/60">
                  {current.role}
                  <span className="mx-2 text-black/20">/</span>
                  <span className="group-hover:text-black transition-colors duration-300">
                    {current.company}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            {TESTIMONIALS.map((_, index) => (
              <button
                key={index}
                onClick={() => handleChange(index)}
                className="group relative py-4"
              >
                <span
                  className={`block h-px transition-all duration-500 ease-out ${
                    index === active
                      ? "w-12 bg-black"
                      : "w-6 bg-black/20 group-hover:w-8 group-hover:bg-black/40"
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="text-xs text-black/60 tracking-widest uppercase">
            {String(active + 1).padStart(2, "0")} /{" "}
            {String(TESTIMONIALS.length).padStart(2, "0")}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handlePrev}
            className="p-2 rounded-full text-black/40 hover:text-black hover:bg-black/5 transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded-full text-black/40 hover:text-black hover:bg-black/5 transition-all duration-300"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
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

const BONDS_FOR_EVERYONE_CARDS = [
  {
    title: "Start small with ₹1,000",
    description:
      "Starting small? Start small, learn via investing and build appetite for bonds.",
  },
  {
    title: "Choose tenure as per your need",
    description:
      "Start as low as 1 year tenure or choose to stay put for up to 5 years.",
  },
  {
    title: "Choose from 100+ bonds",
    description:
      "Choose from Govt of Govt, State Govt to Corporate, PSUs and SLUs bonds.",
  },
];

const HOW_IT_WORKS_SECTIONS = [
  {
    title: "Create Your Account",
    description:
      "Join 1 lakh+ investors. Sign up in minutes with basic details and complete your securely encrypted KYC process to get started.",
    image: "/version 3/create-account.png",
    imageFirst: false,
    cta: false,
  },
  {
    title: "Explore & Choose",
    description:
      "Browse through our curated collection of Govt, State Govt, and Corporate bonds. Filter by tenure, yield, and risk appetite.",
    image: "/version 3/explore-choose.png",
    imageFirst: true,
    cta: false,
  },
  {
    title: "Invest &\nEarn",
    description:
      "Complete your investment via UPI or Net Banking. Sit back and watch your wealth grow with predictable, timely returns.",
    image: "/version 3/invest-earn.png",
    imageFirst: false,
    cta: false,
  },
  {
    title: "Expand your investment portfolio for better returns today!",
    description: "",
    image: "/version 3/download app.png",
    imageFirst: true,
    cta: true,
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

  const ytmTitleRef = useRef<HTMLDivElement>(null);
  const mpTitleRef = useRef<HTMLDivElement>(null);
  const ltTitleRef = useRef<HTMLDivElement>(null);

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

  // How It Works section refs
  const hiwEntranceTriggerRef = useRef<HTMLDivElement>(null);
  const hiwTrigger2Ref = useRef<HTMLDivElement>(null);
  const hiwTrigger3Ref = useRef<HTMLDivElement>(null);
  const hiwTrigger4Ref = useRef<HTMLDivElement>(null);
  const howItWorksOverlayRef = useRef<HTMLDivElement>(null);
  const hiwHeadingRef = useRef<HTMLDivElement>(null);
  const hiwPanel1Ref = useRef<HTMLDivElement>(null);
  const hiwPanel2Ref = useRef<HTMLDivElement>(null);
  const hiwPanel3Ref = useRef<HTMLDivElement>(null);
  const hiwPanel4Ref = useRef<HTMLDivElement>(null);
  const hiwPanelContainerRef = useRef<HTMLDivElement>(null);
  const [hiwActiveStep, setHiwActiveStep] = useState(0);
  const hiwStepRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];


  // Bonds for Everyone section refs
  const bfeTriggerRef = useRef<HTMLDivElement>(null);
  const bfeSectionRef = useRef<HTMLDivElement>(null);
  const bfeHeadingRef = useRef<HTMLDivElement>(null);
  const bfeCard1 = useRef<HTMLDivElement>(null);
  const bfeCard2 = useRef<HTMLDivElement>(null);
  const bfeCard3 = useRef<HTMLDivElement>(null);

  // Testimonials section refs
  const testimTriggerRef = useRef<HTMLDivElement>(null);
  const testimSectionRef = useRef<HTMLDivElement>(null);
  const testimHeadingRef = useRef<HTMLDivElement>(null);
  const testimContentRef = useRef<HTMLDivElement>(null);

  // FAQ section refs
  const faqTriggerRef = useRef<HTMLDivElement>(null);
  const faqSectionRef = useRef<HTMLDivElement>(null);
  const faqHeadingRef = useRef<HTMLDivElement>(null);
  const faqContentRef = useRef<HTMLDivElement>(null);

  // Diversify CTA section refs
  const divTrigger1Ref = useRef<HTMLDivElement>(null); // FAQ → card entrance
  const divTrigger2Ref = useRef<HTMLDivElement>(null); // card → fullscreen
  const divSectionRef = useRef<HTMLDivElement>(null);
  const divCardRef = useRef<HTMLDivElement>(null);
  const divContentRef = useRef<HTMLDivElement>(null);
  const divSectionActive = useRef(false);

  useEffect(() => {
    let lastScroll = 0;
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (headerRef.current) {
        // Don't show header while the Diversify CTA section is active
        if (divSectionActive.current) {
          lastScroll = currentScroll;
          return;
        }
        if (currentScroll > lastScroll && currentScroll > 100) {
          // Hide nav on scroll down
          gsap.to(headerRef.current, { y: -100, duration: 0.3, ease: "power2.out", overwrite: true });
        } else if (currentScroll < lastScroll) {
          // Show nav instantly on scroll up so it doesn't delay page transitions
          gsap.set(headerRef.current, { y: 0, overwrite: true });
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
    const bfeCards = [bfeCard1.current, bfeCard2.current, bfeCard3.current];

    const allRefsExist =
      mobileContainerRef.current && mobileRef.current && appScrollRef.current &&
      yieldCardRef.current && tenureCardRef.current && card3Ref.current &&
      card4Ref.current && card5Ref.current && card6Ref.current &&
      bgPatternRef.current && bgOverlayRef.current && bondsSectionRef.current &&
      ytmTitleRef.current && mpTitleRef.current && ltTitleRef.current &&
      ytmCards.every(Boolean) && mpCards.every(Boolean) && ltCardsRef.current &&
      nurturingTriggerRef.current && nurturingSectionRef.current &&
      nurtCards.every(Boolean) && nurtHeadingRef.current &&
      hiwEntranceTriggerRef.current &&
      hiwTrigger2Ref.current && hiwTrigger3Ref.current && hiwTrigger4Ref.current &&
      howItWorksOverlayRef.current &&
      hiwHeadingRef.current && hiwPanelContainerRef.current &&
      hiwPanel1Ref.current && hiwPanel2Ref.current &&
      hiwPanel3Ref.current && hiwPanel4Ref.current &&
      bfeTriggerRef.current && bfeSectionRef.current &&
      bfeHeadingRef.current && bfeCards.every(Boolean) &&
      testimTriggerRef.current && testimSectionRef.current &&
      testimHeadingRef.current && testimContentRef.current &&
      faqTriggerRef.current && faqSectionRef.current &&
      faqHeadingRef.current && faqContentRef.current &&
      divTrigger1Ref.current && divTrigger2Ref.current &&
      divSectionRef.current && divCardRef.current && divContentRef.current;

    if (allRefsExist) {
      // Side cards initial states — hidden until scroll activates
      gsap.set(yieldCardRef.current, { autoAlpha: 0, y: -200 });
      gsap.set(tenureCardRef.current, { autoAlpha: 0, y: 400 });
      gsap.set(card3Ref.current, { autoAlpha: 0, y: 1000 });
      gsap.set(card4Ref.current, { autoAlpha: 0, y: 1600 });
      gsap.set(card5Ref.current, { autoAlpha: 0, y: 2200 });
      gsap.set(card6Ref.current, { autoAlpha: 0, y: 2800 });

      // Bonds section initial states
      gsap.set(bgOverlayRef.current, { opacity: 0 });
      gsap.set(bondsSectionRef.current, { autoAlpha: 0, y: 40 });
      gsap.set(ytmCards, { transformOrigin: "top center" });
      gsap.set(mpCards, { transformOrigin: "top center" });
      gsap.set(mpTitleRef.current, { opacity: 0, y: 10 });
      gsap.set(mpCards, { opacity: 0, y: 40 });
      gsap.set(ltTitleRef.current, { opacity: 0, y: 10 });
      gsap.set(ltCardsRef.current, { opacity: 0, y: 40 });

      // Nurturing section initial states
      gsap.set(nurturingSectionRef.current, { autoAlpha: 0 });
      gsap.set(nurtHeadingRef.current, { opacity: 0, y: 30 });
      gsap.set(nurtCards, { opacity: 0, y: 60 });

      // Bonds for Everyone initial states
      gsap.set(bfeSectionRef.current, { autoAlpha: 0 });
      gsap.set(bfeHeadingRef.current, { opacity: 0, y: 30 });
      gsap.set(bfeCards, { opacity: 0, y: 60 });

      // Testimonials initial states
      gsap.set(testimSectionRef.current, { autoAlpha: 0 });
      gsap.set(testimHeadingRef.current, { opacity: 0, y: 30 });
      gsap.set(testimContentRef.current, { opacity: 0, y: 60 });

      // FAQ initial states
      gsap.set(faqSectionRef.current, { autoAlpha: 0 });
      gsap.set(faqHeadingRef.current, { opacity: 0, y: 30 });
      gsap.set(faqContentRef.current, { opacity: 0, y: 60 });

      // Diversify CTA initial states
      gsap.set(divSectionRef.current, { autoAlpha: 0 });
      gsap.set(divCardRef.current, {
        clipPath: "inset(15% 5% 15% 5% round 40px)",
      });
      gsap.set(divContentRef.current, { opacity: 0, y: 40 });

      // How It Works initial states
      gsap.set(howItWorksOverlayRef.current, { autoAlpha: 0, pointerEvents: "none" });
      gsap.set(hiwHeadingRef.current, { opacity: 0, y: 30 });
      const hiwPanels = [hiwPanel1Ref.current!, hiwPanel2Ref.current!, hiwPanel3Ref.current!, hiwPanel4Ref.current!];

      // Dynamic positioning: top-align active panel, peek next panel at bottom
      const panelContainerHeight = hiwPanelContainerRef.current!.clientHeight;
      const peekVisible = 60; // fixed 60px peek — just the top rounded edges of next cards
      const peekY = panelContainerHeight - peekVisible;
      // Panel 1: hidden, top-aligned
      gsap.set(hiwPanels[0], { opacity: 0, y: 0 });
      gsap.set(hiwPanels[0].children, { opacity: 0, y: 60 });
      // Panels 2-4: hidden, positioned at peek (bottom of container, 10% visible)
      for (let i = 1; i < hiwPanels.length; i++) {
        gsap.set(hiwPanels[i], { opacity: 0, y: peekY });
        gsap.set(hiwPanels[i].children, { opacity: 0, y: 0 });
      }

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

      // Phase 1: Mobile centers + section pt shrinks (0 → 0.18)
      tl.to(mobileContainerRef.current, { paddingTop: 0, ease: "power1.out", duration: 0.18 }, 0);
      tl.to(headingContainerRef.current!, { opacity: 0, height: 0, ease: "power1.out", duration: 0.14 }, 0);
      tl.to(mobileRef.current, { scale: 0.85, ease: "power1.out", duration: 0.18 }, 0);

      // Phase 2: Pause (0.18 → 0.24)
      tl.to({}, { duration: 0.06 }, 0.18);

      // Phase 3: Phone scroll (0.24 → 0.59) — cards are delayed & slower
      tl.to(appScrollRef.current, { y: -3500, ease: "none", duration: 0.35 }, 0.24);
      const CARD_MOVE_DISTANCE = 2600;
      // Fade in cards with delay after phone scroll starts (0.30 → 0.38)
      [yieldCardRef, tenureCardRef, card3Ref, card4Ref, card5Ref, card6Ref].forEach((ref) => {
        tl.to(ref.current!, { autoAlpha: 1, duration: 0.08, ease: "power2.out" }, 0.30);
      });
      // Move cards — delayed start (0.30) and slower pace than phone scroll
      [yieldCardRef, tenureCardRef, card3Ref, card4Ref, card5Ref, card6Ref].forEach((ref, i) => {
        const startY = [-200, 400, 1000, 1600, 2200, 2800][i];
        tl.to(ref.current!, { y: startY - CARD_MOVE_DISTANCE, ease: "power1.inOut", duration: 0.29 }, 0.30);
      });

      // Phase 4: Phone exits (0.52 → 0.63)
      tl.to(mobileRef.current, { y: -500, opacity: 0, ease: "power2.in", duration: 0.04 }, 0.59);
      // Fade out cards (starts earlier for a visible fade)
      [yieldCardRef, tenureCardRef, card3Ref, card4Ref, card5Ref, card6Ref].forEach((ref) => {
        tl.to(ref.current!, { autoAlpha: 0, duration: 0.08, ease: "power2.in" }, 0.52);
      });
      tl.to(bgPatternRef.current, { opacity: 0, duration: 0.04 }, 0.59);
      tl.to(bgOverlayRef.current, { opacity: 1, duration: 0.04 }, 0.59);

      // Phase 5: YTM section appears (0.63 → 0.67)
      tl.to(bondsSectionRef.current, { autoAlpha: 1, y: 0, ease: "power2.out", duration: 0.04 }, 0.63);

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
          gsap.to(bondsSectionRef.current, { autoAlpha: 0, y: -30, duration: 0.4, ease: "power2.in" });

          // Change bg to white
          gsap.to(bgOverlayRef.current, {
            backgroundColor: "#ffffff",
            duration: 0.4,
          });

          // Fade in nurturing section
          gsap.to(nurturingSectionRef.current, { autoAlpha: 1, duration: 0.3, delay: 0.25 });

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
          // Reverse: hide nurturing and show bonds simultaneously
          gsap.to(nurtCards, { opacity: 0, y: 60, duration: 0.3, stagger: 0 });
          gsap.to(nurtHeadingRef.current, { opacity: 0, y: 30, duration: 0.3 });
          gsap.to(nurturingSectionRef.current, { autoAlpha: 0, duration: 0.3 });
          gsap.to(bgOverlayRef.current, { backgroundColor: "#F3F3F3", duration: 0.3 });
          gsap.to(bondsSectionRef.current, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" });
        },
      });

      // ═══════════════════════════════════════════════════════
      // HOW IT WORKS — entrance trigger (same pattern as nurturing)
      // Nurturing fades out → overlay + heading + panel 1 cards stagger in
      // ═══════════════════════════════════════════════════════

      // Helper: build a scrub timeline for HIW panel transition
      const buildHiwScrubTransition = (
        trigger: HTMLElement,
        outPanel: HTMLElement,
        inPanel: HTMLElement,
        nextPeekPanel: HTMLElement | null,
        stepIndex: number,
      ) => {
        const stl = gsap.timeline({
          scrollTrigger: {
            trigger,
            start: "top bottom",
            end: "top 40%",
            scrub: 0.5,
            snap: {
              snapTo: (p: number) => (p > 0.3 ? 1 : 0),
              duration: 0.3,
            },
            onUpdate: (self) => {
              const forward = self.progress > 0.3;
              setHiwActiveStep(forward ? stepIndex : stepIndex - 1);
            },
          },
        });

        // Current panel fades out
        stl.fromTo(outPanel.children[0], { opacity: 1, y: 0 }, { opacity: 0, y: -20, duration: 0.4, immediateRender: false }, 0);
        stl.fromTo(outPanel.children[1], { opacity: 1, y: 0 }, { opacity: 0, y: -20, duration: 0.4, immediateRender: false }, 0.05);
        stl.fromTo(outPanel, { opacity: 1 }, { opacity: 0, duration: 0.05, immediateRender: false }, 0.45);

        // Next panel slides up from peek (no opacity change)
        stl.fromTo(inPanel, { y: peekY }, { y: 0, duration: 0.7, immediateRender: false }, 0);

        // Next peek appears at the end (full opacity, no fade)
        if (nextPeekPanel) {
          stl.fromTo(nextPeekPanel, { opacity: 0 }, { opacity: 1, duration: 0.05, immediateRender: false }, 0.75);
          stl.fromTo(nextPeekPanel.children[0], { opacity: 0 }, { opacity: 1, duration: 0.05, immediateRender: false }, 0.75);
          stl.fromTo(nextPeekPanel.children[1], { opacity: 0 }, { opacity: 1, duration: 0.05, immediateRender: false }, 0.75);
        }
      };

      // Panel 1 entrance (nurturing → HIW)
      ScrollTrigger.create({
        trigger: hiwEntranceTriggerRef.current,
        start: "top 90%",
        onEnter: () => {
          // Fade out nurturing section
          gsap.to(nurtCards, { opacity: 0, y: -30, duration: 0.3, stagger: 0.05, ease: "power2.in" });
          gsap.to(nurtHeadingRef.current, { opacity: 0, y: -30, duration: 0.4, ease: "power2.in" });
          gsap.to(nurturingSectionRef.current, { autoAlpha: 0, duration: 0.4, delay: 0.2 });

          // Fade in HIW overlay
          gsap.to(howItWorksOverlayRef.current, { autoAlpha: 1, pointerEvents: "auto", duration: 0.3, delay: 0.25 });

          // Heading slides in
          gsap.to(hiwHeadingRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.3 });

          // Set step to 0 (Create Account)
          setHiwActiveStep(0);

          // Panel 1 — left and right cards stagger in
          gsap.set(hiwPanel1Ref.current!, { opacity: 1, delay: 0.35 });
          gsap.to(hiwPanel1Ref.current!.children[0], { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.4 });
          gsap.to(hiwPanel1Ref.current!.children[1], { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.55 });

          // Show Panel 2 as peek at the bottom (full opacity, no fade)
          gsap.set(hiwPanel2Ref.current!, { opacity: 1, y: peekY, delay: 0.6 });
          gsap.set(hiwPanel2Ref.current!.children[0], { opacity: 1, y: 0, delay: 0.6 });
          gsap.set(hiwPanel2Ref.current!.children[1], { opacity: 1, y: 0, delay: 0.6 });
        },
        onLeaveBack: () => {
          // Hide Panel 2 peek
          gsap.set(hiwPanel2Ref.current!, { opacity: 0 });
          gsap.set(hiwPanel2Ref.current!.children[0], { opacity: 0 });
          gsap.set(hiwPanel2Ref.current!.children[1], { opacity: 0 });

          // Reverse: hide HIW and bring back nurturing simultaneously
          gsap.to(hiwPanel1Ref.current!.children[0], { opacity: 0, y: 60, duration: 0.3 });
          gsap.to(hiwPanel1Ref.current!.children[1], { opacity: 0, y: 60, duration: 0.3 });
          gsap.set(hiwPanel1Ref.current!, { opacity: 0, delay: 0.3 });
          gsap.to(hiwHeadingRef.current, { opacity: 0, y: 30, duration: 0.3 });
          gsap.to(howItWorksOverlayRef.current, { autoAlpha: 0, pointerEvents: "none", duration: 0.3 });

          // Bring back nurturing at the same time
          gsap.to(nurturingSectionRef.current, { autoAlpha: 1, duration: 0.3 });
          gsap.to(nurtHeadingRef.current, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
          gsap.to(nurtCards, {
            opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power2.out",
          });
        },
      });

      // Panel 1 → Panel 2 (scrub: card rises with scroll, snaps at 30%)
      buildHiwScrubTransition(hiwTrigger2Ref.current!, hiwPanel1Ref.current!, hiwPanel2Ref.current!, hiwPanel3Ref.current, 1);

      // Panel 2 → Panel 3
      buildHiwScrubTransition(hiwTrigger3Ref.current!, hiwPanel2Ref.current!, hiwPanel3Ref.current!, hiwPanel4Ref.current, 2);

      // Panel 3 → Panel 4 (no next peek)
      buildHiwScrubTransition(hiwTrigger4Ref.current!, hiwPanel3Ref.current!, hiwPanel4Ref.current!, null, 3);

      // ═══════════════════════════════════════════════════════
      // BONDS FOR EVERYONE — entrance trigger (HIW fades out → cards stagger in)
      // ═══════════════════════════════════════════════════════
      ScrollTrigger.create({
        trigger: bfeTriggerRef.current,
        start: "top 90%",
        onEnter: () => {
          // Fade out HIW overlay
          gsap.to(howItWorksOverlayRef.current, { autoAlpha: 0, pointerEvents: "none", duration: 0.4, ease: "power2.in" });

          // Fade in Bonds for Everyone section
          gsap.to(bfeSectionRef.current, { autoAlpha: 1, duration: 0.3, delay: 0.25 });

          // Heading slides in
          gsap.to(bfeHeadingRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.3 });

          // Cards stagger in one by one with delay
          gsap.to(bfeCards, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.15,
            ease: "power2.out",
            delay: 0.5,
          });
        },
        onLeaveBack: () => {
          // Reverse: hide BFE and bring back HIW
          gsap.to(bfeCards, { opacity: 0, y: 60, duration: 0.3, stagger: 0 });
          gsap.to(bfeHeadingRef.current, { opacity: 0, y: 30, duration: 0.3 });
          gsap.to(bfeSectionRef.current, { autoAlpha: 0, duration: 0.3 });

          // Bring back HIW
          gsap.to(howItWorksOverlayRef.current, { autoAlpha: 1, pointerEvents: "auto", duration: 0.3 });
        },
      });

      // ═══════════════════════════════════════════════════════
      // TESTIMONIALS — entrance trigger (BFE fades out → testimonials stagger in)
      // ═══════════════════════════════════════════════════════
      ScrollTrigger.create({
        trigger: testimTriggerRef.current,
        start: "top 90%",
        onEnter: () => {
          // Fade out BFE section
          gsap.to(bfeCards, { opacity: 0, y: -30, duration: 0.3, stagger: 0.05, ease: "power2.in" });
          gsap.to(bfeHeadingRef.current, { opacity: 0, y: -30, duration: 0.4, ease: "power2.in" });
          gsap.to(bfeSectionRef.current, { autoAlpha: 0, duration: 0.4, delay: 0.2 });

          // Reset testimonials to first slide
          resetTestimonialsCarousel?.();

          // Fade in testimonials section
          gsap.to(testimSectionRef.current, { autoAlpha: 1, duration: 0.3, delay: 0.25 });

          // Heading slides in
          gsap.to(testimHeadingRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.3 });

          // Carousel content slides in with delay
          gsap.to(testimContentRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            delay: 0.5,
          });
        },
        onLeaveBack: () => {
          // Reverse: hide testimonials and bring back BFE
          gsap.to(testimContentRef.current, { opacity: 0, y: 60, duration: 0.3 });
          gsap.to(testimHeadingRef.current, { opacity: 0, y: 30, duration: 0.3 });
          gsap.to(testimSectionRef.current, { autoAlpha: 0, duration: 0.3 });

          // Bring back BFE
          gsap.to(bfeSectionRef.current, { autoAlpha: 1, duration: 0.3 });
          gsap.to(bfeHeadingRef.current, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
          gsap.to(bfeCards, {
            opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power2.out",
          });
        },
      });

      // ═══════════════════════════════════════════════════════
      // FAQ — entrance trigger (testimonials fades out → FAQ fades in)
      // ═══════════════════════════════════════════════════════
      ScrollTrigger.create({
        trigger: faqTriggerRef.current,
        start: "top 90%",
        onEnter: () => {
          // Fade out testimonials
          gsap.to(testimContentRef.current, { opacity: 0, y: -30, duration: 0.3, ease: "power2.in" });
          gsap.to(testimHeadingRef.current, { opacity: 0, y: -30, duration: 0.4, ease: "power2.in" });
          gsap.to(testimSectionRef.current, { autoAlpha: 0, duration: 0.4, delay: 0.2 });

          // Fade in FAQ section (reset y in case it was parallaxed up)
          gsap.set(faqSectionRef.current, { y: 0 });
          gsap.to(faqSectionRef.current, { autoAlpha: 1, duration: 0.3, delay: 0.25 });

          // Heading slides in
          gsap.to(faqHeadingRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.3 });

          // Accordion content slides in with delay
          gsap.to(faqContentRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            delay: 0.5,
          });
        },
        onLeaveBack: () => {
          // Reverse: hide FAQ and bring back testimonials
          gsap.to(faqContentRef.current, { opacity: 0, y: 60, duration: 0.3 });
          gsap.to(faqHeadingRef.current, { opacity: 0, y: 30, duration: 0.3 });
          gsap.to(faqSectionRef.current, { autoAlpha: 0, duration: 0.3 });

          // Bring back testimonials
          gsap.to(testimSectionRef.current, { autoAlpha: 1, duration: 0.3 });
          gsap.to(testimHeadingRef.current, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
          gsap.to(testimContentRef.current, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
        },
      });

      // ═══════════════════════════════════════════════════════
      // DIVERSIFY CTA — Step 1: FAQ slides up (parallax) revealing rounded card
      // ═══════════════════════════════════════════════════════
      const faqDivTl = gsap.timeline({
        scrollTrigger: {
          trigger: divTrigger1Ref.current,
          start: "top bottom",
          end: "top 20%",
          scrub: 0.5,
          onUpdate: (self) => {
            // Mark Diversify section as active once FAQ is mostly gone
            divSectionActive.current = self.progress > 0.5;
          },
          onLeaveBack: () => {
            divSectionActive.current = false;
          },
        },
      });
      // Show the Diversify section behind the FAQ (FAQ z-40, Diversify z-35)
      faqDivTl.fromTo(divSectionRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05, immediateRender: false }, 0);
      // Content fades in as the card is revealed
      faqDivTl.fromTo(divContentRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", immediateRender: false }, 0.3);
      // FAQ slides up off-screen with parallax
      faqDivTl.fromTo(faqSectionRef.current, { y: 0 }, { y: "-100%", duration: 1, ease: "none", immediateRender: false }, 0);
      // Hide the header as Diversify section is revealed
      faqDivTl.fromTo(headerRef.current!, { y: 0 }, { y: -100, duration: 0.3, ease: "power2.out", immediateRender: false }, 0.5);

      // ═══════════════════════════════════════════════════════
      // DIVERSIFY CTA — Step 2: fluid clip-path expansion (scrub-based, delayed)
      // Card sits visible for a while, then expansion begins mid-way through trigger 2
      // ═══════════════════════════════════════════════════════
      const divExpandTl = gsap.timeline({
        scrollTrigger: {
          trigger: divTrigger2Ref.current,
          start: "top 80%",
          end: "top 20%",
          scrub: 0.4,
        },
      });
      divExpandTl.fromTo(
        divCardRef.current,
        { clipPath: "inset(15% 5% 15% 5% round 40px)" },
        { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1, ease: "none", immediateRender: false },
        0,
      );
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
        className="fixed inset-0 w-full h-full flex flex-col items-center justify-center z-[15] pointer-events-none invisible"
      >
        <div className="pointer-events-auto flex flex-col items-center gap-5">
          <div className="text-center mb-4 desk-md:mb-6 desk:mb-8 relative h-[70px] desk-sm:h-[80px] desk-md:h-[85px] desk:h-[90px] desk-lg:h-[95px] w-full">
            {/* YTM heading group */}
            <div ref={ytmTitleRef} className="absolute inset-x-0 top-0 flex flex-col items-center whitespace-nowrap">
              <p className="text-base desk-sm:text-lg desk-md:text-xl desk:text-[21px] desk-lg:text-[22px] font-semibold tracking-[-0.44px] text-black mb-1">
                Bonds with highest
              </p>
              <p className="text-3xl desk-sm:text-4xl desk-md:text-[42px] desk:text-[45px] desk-lg:text-[48px] font-medium tracking-[-0.96px] whitespace-nowrap"
                style={{ background: "linear-gradient(180deg, #C57AFF 0%, #37035F 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Yield to Maturity
              </p>
            </div>
            {/* MP heading group */}
            <div ref={mpTitleRef} className="absolute inset-x-0 top-0 flex flex-col items-center whitespace-nowrap">
              <p className="text-base desk-sm:text-lg desk-md:text-xl desk:text-[21px] desk-lg:text-[22px] font-semibold tracking-[-0.44px] text-black mb-1">
                Bonds with highest
              </p>
              <p className="text-3xl desk-sm:text-4xl desk-md:text-[42px] desk:text-[45px] desk-lg:text-[48px] font-medium tracking-[-0.96px] whitespace-nowrap"
                style={{ background: "linear-gradient(180deg, #2B5BDB 0%, #0C1C54 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Monthly Payouts
              </p>
            </div>
            {/* LT heading group */}
            <div ref={ltTitleRef} className="absolute inset-x-0 top-0 flex flex-col items-center whitespace-nowrap">
              <p className="text-base desk-sm:text-lg desk-md:text-xl desk:text-[21px] desk-lg:text-[22px] font-semibold tracking-[-0.44px] text-black mb-1">
                Bonds with
              </p>
              <p className="text-3xl desk-sm:text-4xl desk-md:text-[42px] desk:text-[45px] desk-lg:text-[48px] font-medium tracking-[-0.96px] whitespace-nowrap"
                style={{ background: "linear-gradient(180deg, #E84393 0%, #6C1D45 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Lowest tenure
              </p>
            </div>
          </div>

          <div className="relative mb-10">
            <div className="flex items-start justify-center gap-3 desk-sm:gap-3.5 desk-md:gap-4 desk:gap-6 desk-lg:gap-8">
              <div ref={ytmC1}><BondCard badgeText="Highest YTM" badgeBg="bg-[#f2e2ff]" badgeTextColor="text-[#694189]" /></div>
              <div ref={ytmC2}><BondCard badgeText="Highest YTM" badgeBg="bg-[#f2e2ff]" badgeTextColor="text-[#694189]" /></div>
              <div ref={ytmC3}><BondCard badgeText="Highest YTM" badgeBg="bg-[#f2e2ff]" badgeTextColor="text-[#694189]" /></div>
              <div ref={ytmC4}><BondCard badgeText="Highest YTM" badgeBg="bg-[#f2e2ff]" badgeTextColor="text-[#694189]" /></div>
            </div>
            <div className="absolute inset-0 flex items-start justify-center gap-3 desk-sm:gap-3.5 desk-md:gap-4 desk:gap-6 desk-lg:gap-8">
              <div ref={mpC1}><BondCard badgeText="Monthly Payouts" badgeBg="bg-[#E2EAFF]" badgeTextColor="text-[#2B4899]" /></div>
              <div ref={mpC2}><BondCard badgeText="Monthly Payouts" badgeBg="bg-[#E2EAFF]" badgeTextColor="text-[#2B4899]" /></div>
              <div ref={mpC3}><BondCard badgeText="Monthly Payouts" badgeBg="bg-[#E2EAFF]" badgeTextColor="text-[#2B4899]" /></div>
              <div ref={mpC4}><BondCard badgeText="Monthly Payouts" badgeBg="bg-[#E2EAFF]" badgeTextColor="text-[#2B4899]" /></div>
            </div>
            <div ref={ltCardsRef} className="absolute inset-0 flex items-start justify-center gap-3 desk-sm:gap-3.5 desk-md:gap-4 desk:gap-6 desk-lg:gap-8">
              <BondCard badgeText="Lowest Tenure" badgeBg="bg-[#FFE2EC]" badgeTextColor="text-[#8B2252]" />
              <BondCard badgeText="Lowest Tenure" badgeBg="bg-[#FFE2EC]" badgeTextColor="text-[#8B2252]" />
              <BondCard badgeText="Lowest Tenure" badgeBg="bg-[#FFE2EC]" badgeTextColor="text-[#8B2252]" />
              <BondCard badgeText="Lowest Tenure" badgeBg="bg-[#FFE2EC]" badgeTextColor="text-[#8B2252]" />
            </div>
          </div>

        </div>
      </div>

      {/* ═══ Nurturing Section — Fixed overlay ═══ */}
      <div
        ref={nurturingSectionRef}
        className="fixed inset-0 w-full h-full z-[16] pointer-events-none invisible"
        style={{ opacity: 0 }}
      >
        <div className="pointer-events-auto w-full h-full bg-white px-8 desk-sm:px-12 desk-md:px-16 desk:px-18 desk-lg:px-20 pt-32 desk-md:pt-24 desk:pt-48 desk-lg:pt-32 pb-6 desk-sm:pb-8 desk-md:pb-12 desk:pb-16 desk-lg:pb-20 flex flex-col justify-center gap-3 desk-sm:gap-4 desk-md:gap-5 desk:gap-6">
          {/* Heading */}
          <div ref={nurtHeadingRef} className="mb-2 desk-sm:mb-3 desk-md:mb-2 desk:mb-3 desk-lg:mb-4">
            <div className="text-3xl desk-sm:text-4xl desk-md:text-5xl desk:text-[56px] desk-lg:text-6xl font-normal leading-[1.2] tracking-[-0.96px] text-black flex flex-col gap-1.5">
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
          <div className="flex gap-3 desk-sm:gap-3.5 desk-md:gap-4 desk:gap-5 items-stretch">
            {FEATURE_CARDS.map((card, i) => (
              <div
                key={card.title}
                ref={[nurtCard1, nurtCard2, nurtCard3, nurtCard4][i]}
                className="bg-gradient-to-b from-white to-[#eaf2f2] border border-[#d9f0f3] rounded-[14px] desk-sm:rounded-[16px] desk-md:rounded-[18px] desk:rounded-[20px] flex-1 overflow-hidden relative flex flex-col p-3 desk-sm:p-4 desk-md:p-5 gap-2 desk-sm:gap-3 desk-md:gap-4 desk:gap-6"
              >
                {/* Title row with decorative brackets */}
                <div className="flex gap-1 items-center">
                  <span
                    className="text-[20px] desk-sm:text-[24px] desk-md:text-[30px] desk:text-[37px] desk-lg:text-[40px] leading-none font-normal"
                    style={{
                      background: "linear-gradient(to bottom, #00f9ff, #003c3e)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    ‹
                  </span>
                  <p className="text-base desk-sm:text-lg desk-md:text-2xl desk:text-[28px] desk-lg:text-3xl font-medium text-black tracking-[-0.48px] leading-[1.3]">
                    {card.title}
                  </p>
                  <span
                    className="text-[20px] desk-sm:text-[24px] desk-md:text-[30px] desk:text-[37px] desk-lg:text-[40px] leading-none font-normal"
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
                <div className="w-[100px] h-[100px] desk-sm:w-[120px] desk-sm:h-[120px] desk-md:w-[160px] desk-md:h-[160px] desk:w-[220px] desk:h-[220px] desk-lg:w-[280px] desk-lg:h-[280px] mt-1 desk-sm:mt-2 desk-md:mt-3 desk:mt-4 mx-auto flex items-center justify-center">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

                {/* Description */}
                <p className="text-xs desk-sm:text-sm desk-md:text-base desk:text-lg desk-lg:text-xl font-medium text-black tracking-[-0.36px] leading-[1.4] mt-auto max-w-[254px]">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Header */}
      <header ref={headerRef} className="fixed top-0 left-0 right-0 bg-white px-8 desk-sm:px-16 desk-md:px-24 desk:px-28 desk-lg:px-32 py-3 desk-sm:py-4 desk-md:py-4 desk:py-5 desk-lg:py-5 z-50">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl desk-sm:text-[26px] desk-md:text-[28px] desk:text-3xl font-bold tracking-tight text-black">BondsIndia</h1>
          <div className="flex items-center gap-4 desk-sm:gap-4 desk-md:gap-5 desk:gap-6">
            <div className="flex items-center gap-4 desk-sm:gap-4 desk-md:gap-5 desk:gap-6 text-xs desk-sm:text-[13px] desk-md:text-sm font-medium tracking-tight text-black">
              <a href="#" className="hover:opacity-70 transition-opacity">Bonds</a>
              <a href="#" className="hover:opacity-70 transition-opacity">Resources</a>
            </div>
            <a href="#" className="text-xs desk-sm:text-[13px] desk-md:text-sm font-medium tracking-tight text-black hover:opacity-70 transition-opacity">
              Download App
            </a>
            <button className="flex items-center justify-center gap-1 desk-md:gap-1.5 rounded bg-[#3be2e4] px-2.5 py-2 desk-sm:px-2.5 desk-sm:py-2 desk-md:px-3 desk-md:py-2.5 text-xs desk-sm:text-[13px] desk-md:text-sm font-medium tracking-tight text-black transition-all hover:bg-[#2dd1d3]">
              <span>Login</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="-rotate-45 desk-md:w-5 desk-md:h-5">
                <path d="M3.83594 9.16667L10.0859 9.16667L7.41927 11.8333L8.5026 12.9167L13.086 8.33333L8.5026 3.75L7.41927 4.83333L10.0859 7.5L3.83594 7.5L3.83594 9.16667Z" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Mobile */}
      <section ref={mobileContainerRef} className="relative px-8 desk-sm:px-16 desk-md:px-24 desk:px-28 desk-lg:px-32 pt-28 overflow-visible h-screen flex flex-col z-10">
        <div ref={yieldCardRef} className="absolute right-0 desk-sm:right-0 desk-md:right-4 desk:right-10 desk-lg:right-16 top-1/2 z-10 invisible">
          <img src="/version 3/yield.png" alt="Yield Card" className="w-[200px] desk-sm:w-[240px] desk-md:w-[300px] desk:w-[360px] desk-lg:w-[400px] h-auto" />
        </div>
        <div ref={tenureCardRef} className="absolute left-0 desk-sm:left-0 desk-md:left-4 desk:left-10 desk-lg:left-16 top-1/2 z-10 invisible">
          <img src="/version 3/tenure.png" alt="Tenure Card" className="w-[200px] desk-sm:w-[240px] desk-md:w-[300px] desk:w-[360px] desk-lg:w-[400px] h-auto" />
        </div>
        <div ref={card3Ref} className="absolute right-0 desk-sm:right-0 desk-md:right-4 desk:right-10 desk-lg:right-16 top-1/2 z-10 invisible">
          <img src="/version 3/payout.png" alt="Payout Card" className="w-[200px] desk-sm:w-[240px] desk-md:w-[300px] desk:w-[360px] desk-lg:w-[400px] h-auto" />
        </div>
        <div ref={card4Ref} className="absolute left-0 desk-sm:left-0 desk-md:left-4 desk:left-10 desk-lg:left-16 top-1/2 z-10 invisible">
          <img src="/version 3/yield.png" alt="Yield Card 2" className="w-[200px] desk-sm:w-[240px] desk-md:w-[300px] desk:w-[360px] desk-lg:w-[400px] h-auto" />
        </div>
        <div ref={card5Ref} className="absolute right-0 desk-sm:right-0 desk-md:right-4 desk:right-10 desk-lg:right-16 top-1/2 z-10 invisible">
          <img src="/version 3/tenure.png" alt="Tenure Card 2" className="w-[200px] desk-sm:w-[240px] desk-md:w-[300px] desk:w-[360px] desk-lg:w-[400px] h-auto" />
        </div>
        <div ref={card6Ref} className="absolute left-0 desk-sm:left-0 desk-md:left-4 desk:left-10 desk-lg:left-16 top-1/2 z-10 invisible">
          <img src="/version 3/payout.png" alt="Payout Card 2" className="w-[200px] desk-sm:w-[240px] desk-md:w-[300px] desk:w-[360px] desk-lg:w-[400px] h-auto" />
        </div>

        <div ref={headingContainerRef} className="flex flex-col items-center text-center">
          <div className="whitespace-nowrap">
            <ScrollReveal
              containerClassName="text-center"
              textClassName="text-5xl desk-sm:text-6xl desk-md:text-7xl desk:text-[80px] desk-lg:text-8xl font-medium leading-tight tracking-tighter text-black whitespace-nowrap"
              baseOpacity={0.2} baseRotation={2} blurStrength={3}
            >
              Invest in bonds with
            </ScrollReveal>
          </div>
          <div className="flex items-center justify-center gap-3 mt-0">
            <span className="text-5xl desk-sm:text-6xl desk-md:text-7xl desk:text-[80px] desk-lg:text-8xl font-medium leading-tight tracking-tighter bg-gradient-to-b from-[#06C3C5] to-[#035E5F] bg-clip-text text-transparent"
              style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              9-12%
            </span>
            <span className="text-5xl desk-sm:text-6xl desk-md:text-7xl desk:text-[80px] desk-lg:text-8xl font-medium leading-tight tracking-tighter text-black">fixed returns</span>
          </div>
          <div className="flex items-center justify-center gap-4 desk-md:gap-5 desk:gap-6 mt-2 desk-sm:mt-3 desk-md:mt-4 desk:mt-5 desk-lg:mt-6 mb-8 desk-sm:mb-10 desk-md:mb-12 desk:mb-14 desk-lg:mb-16">
            <span className="text-base desk-md:text-lg desk:text-xl font-medium text-black">SEBI Registered</span>
            <img src="/version 3/star.svg" alt="" width="16" height="16" />
            <span className="text-base desk-md:text-lg desk:text-xl font-medium text-black">Invest as low as ₹1,000</span>
            <img src="/version 3/star.svg" alt="" width="16" height="16" />
            <span className="text-base desk-md:text-lg desk:text-xl font-medium text-black">Zero brokerage</span>
          </div>
        </div>

        <div className="flex-1 relative flex items-center justify-center pt-4">
          <div ref={mobileRef} className="relative w-[240px] desk-sm:w-[280px] desk-md:w-[320px] desk:w-[380px] desk-lg:w-[440px]">
            <img src="/version 3/mobile-frame.png" alt="Mobile Frame" className="w-full h-auto" />
            <div className="absolute top-2 left-2.5 right-2.5 bottom-2 desk-sm:top-2.5 desk-sm:left-3 desk-sm:right-3 desk-sm:bottom-2.5 desk-md:top-3 desk-md:left-[14px] desk-md:right-[14px] desk-md:bottom-3 bg-white rounded-[30px] desk-sm:rounded-[35px] desk-md:rounded-[36px] desk:rounded-[42px] desk-lg:rounded-[54px] overflow-hidden">
              <img ref={appScrollRef} src="/version 3/app-scroll.png" alt="App Content" className="w-full" />
              <img src="/version 3/top-status.png" alt="Status Bar" className="w-full absolute top-0 left-0 right-0 z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Nurturing trigger section — appears after pin ends */}
      <section ref={nurturingTriggerRef} className="h-screen" />

      {/* How It Works entrance trigger — mirrors nurturing entrance pattern */}
      <section ref={hiwEntranceTriggerRef} className="h-screen" />

      {/* ═══ How It Works — Fixed overlay ═══ */}
      <div
        ref={howItWorksOverlayRef}
        className="fixed inset-0 w-full h-full z-[20] invisible"
        style={{ pointerEvents: "none" }}
      >
        <div className="w-full h-full bg-white px-8 desk-sm:px-12 desk-md:px-14 desk:px-16 desk-lg:px-[72px] flex flex-col pt-24 desk-md:pt-28 desk:pt-32">
          {/* Heading + Step indicator — persists across all 4 panels */}
          <div ref={hiwHeadingRef} className="mb-6 desk-md:mb-8 desk:mb-10 flex items-end justify-between">
            <p className="text-3xl desk-sm:text-4xl desk-md:text-5xl desk:text-6xl desk-lg:text-6xl font-normal leading-[1.2] tracking-[-0.96px] text-black">
              How this works?
            </p>
            {/* Step indicator */}
            <div className="flex items-center gap-3 desk-sm:gap-4 desk-md:gap-5 desk:gap-6 pb-1 desk-md:pb-2">
              {["Create Account", "Explore & Choose", "Invest & Earn", "Download App"].map((label, i) => (
                <div key={label} ref={hiwStepRefs[i]} className="flex flex-col items-start gap-1.5 desk-md:gap-2">
                  {/* Track + fill bar */}
                  <div className="relative h-[3px] desk-md:h-[4px] w-[80px] desk-sm:w-[90px] desk-md:w-[110px] desk:w-[130px] desk-lg:w-[140px] rounded-full bg-black/15 overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-black rounded-full transition-all duration-700 ease-out"
                      style={{ width: i < hiwActiveStep ? "100%" : i === hiwActiveStep ? "100%" : "0%" }}
                    />
                  </div>
                  <span
                    className={`text-xs desk-sm:text-[13px] desk-md:text-sm desk:text-[15px] font-medium tracking-tight whitespace-nowrap transition-colors duration-500 ${
                      i <= hiwActiveStep ? "text-black" : "text-black/30"
                    }`}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stacked panels — each absolutely positioned, fills remaining viewport height */}
          <div
            ref={hiwPanelContainerRef}
            className="relative flex-1 overflow-hidden"
          >
            {/* Panel 1: Create Your Account — text left, phone right */}
            <div ref={hiwPanel1Ref} className="absolute inset-x-0 h-[70%] desk-sm:h-[75%] desk-md:h-[80%] desk:h-[85%] flex gap-4 desk-sm:gap-6 desk-md:gap-8 desk:gap-9 desk-lg:gap-10">
              <div className="bg-[#f3f3f3] border border-[#f3f3f3] rounded-[20px] flex-1 h-full flex items-center overflow-hidden">
                <div className="pl-8 desk-sm:pl-12 desk-md:pl-16 desk:pl-18 desk-lg:pl-20 max-w-[320px] desk-sm:max-w-[380px] desk-md:max-w-[440px] desk:max-w-[470px] desk-lg:max-w-[497px] flex flex-col gap-4 desk-md:gap-5 desk:gap-6">
                  <p className="text-[28px] desk-sm:text-[34px] desk-md:text-[40px] desk:text-[44px] desk-lg:text-[48px] font-normal tracking-[-0.96px] text-black leading-normal">
                    Create Your Account
                  </p>
                  <p className="text-base desk-md:text-lg desk:text-[19px] desk-lg:text-[20px] font-normal tracking-[-0.4px] text-black/60 leading-[1.7]">
                    Join 1 lakh+ investors. Sign up in minutes with basic details and complete your securely encrypted KYC process to get started.
                  </p>
                </div>
              </div>
              <div className="rounded-[20px] flex-1 h-full overflow-hidden bg-[#FBFBFB]">
                <img src="/version 3/create-account.png" alt="Create Account" className="w-full h-auto pointer-events-none" draggable={false} />
              </div>
            </div>

            {/* Panel 2: Explore & Choose — phone left, text right */}
            <div ref={hiwPanel2Ref} className="absolute inset-x-0 h-[70%] desk-sm:h-[75%] desk-md:h-[80%] desk:h-[85%] flex gap-4 desk-sm:gap-6 desk-md:gap-8 desk:gap-9 desk-lg:gap-10">
              <div className="rounded-[20px] flex-1 h-full overflow-hidden bg-[#FBFBFB]">
                <img src="/version 3/explore-choose.png" alt="Explore & Choose" className="w-full h-auto pointer-events-none" draggable={false} />
              </div>
              <div className="bg-[#f3f3f3] border border-[#f3f3f3] rounded-[20px] flex-1 h-full flex items-center overflow-hidden">
                <div className="pl-8 desk-sm:pl-12 desk-md:pl-16 desk:pl-18 desk-lg:pl-20 max-w-[320px] desk-sm:max-w-[380px] desk-md:max-w-[440px] desk:max-w-[470px] desk-lg:max-w-[497px] flex flex-col gap-4 desk-md:gap-5 desk:gap-6">
                  <p className="text-[28px] desk-sm:text-[34px] desk-md:text-[40px] desk:text-[44px] desk-lg:text-[48px] font-normal tracking-[-0.96px] text-black leading-normal">
                    Explore &amp; Choose
                  </p>
                  <p className="text-base desk-md:text-lg desk:text-[19px] desk-lg:text-[20px] font-normal tracking-[-0.4px] text-black/60 leading-[1.7]">
                    Browse through our curated collection of Govt, State Govt, and Corporate bonds. Filter by tenure, yield, and risk appetite.
                  </p>
                </div>
              </div>
            </div>

            {/* Panel 3: Invest & Earn — text left, phone right */}
            <div ref={hiwPanel3Ref} className="absolute inset-x-0 h-[70%] desk-sm:h-[75%] desk-md:h-[80%] desk:h-[85%] flex gap-4 desk-sm:gap-6 desk-md:gap-8 desk:gap-9 desk-lg:gap-10">
              <div className="bg-[#f3f3f3] border border-[#f3f3f3] rounded-[20px] flex-1 h-full flex items-center overflow-hidden">
                <div className="pl-8 desk-sm:pl-12 desk-md:pl-16 desk:pl-18 desk-lg:pl-20 max-w-[320px] desk-sm:max-w-[380px] desk-md:max-w-[440px] desk:max-w-[470px] desk-lg:max-w-[497px] flex flex-col gap-4 desk-md:gap-5 desk:gap-6">
                  <p className="text-[28px] desk-sm:text-[34px] desk-md:text-[40px] desk:text-[44px] desk-lg:text-[48px] font-normal tracking-[-0.96px] text-black leading-normal whitespace-pre-wrap">
                    {"Invest &\nEarn"}
                  </p>
                  <p className="text-base desk-md:text-lg desk:text-[19px] desk-lg:text-[20px] font-normal tracking-[-0.4px] text-black/60 leading-[1.7]">
                    Complete your investment via UPI or Net Banking. Sit back and watch your wealth grow with predictable, timely returns.
                  </p>
                </div>
              </div>
              <div className="rounded-[20px] flex-1 h-full overflow-hidden bg-[#FBFBFB]">
                <img src="/version 3/invest-earn.png" alt="Invest & Earn" className="w-full h-auto pointer-events-none" draggable={false} />
              </div>
            </div>

            {/* Panel 4: Download the app — phone left, text right */}
            <div ref={hiwPanel4Ref} className="absolute inset-x-0 h-[70%] desk-sm:h-[75%] desk-md:h-[80%] desk:h-[85%] flex gap-4 desk-sm:gap-6 desk-md:gap-8 desk:gap-9 desk-lg:gap-10">
              <div className="rounded-[20px] flex-1 h-full overflow-hidden bg-[#FBFBFB]">
                <img src="/version 3/download app.png" alt="Download App" className="w-full h-auto pointer-events-none" draggable={false} />
              </div>
              <div className="bg-[#f3f3f3] border border-[#f3f3f3] rounded-[20px] flex-1 h-full flex items-center overflow-hidden">
                <div className="mx-auto max-w-[320px] desk-sm:max-w-[380px] desk-md:max-w-[440px] desk:max-w-[464px] desk-lg:max-w-[484px] flex flex-col gap-6 desk-md:gap-7 desk:gap-8">
                  <p className="text-[28px] desk-sm:text-[34px] desk-md:text-[40px] desk:text-[44px] desk-lg:text-[48px] font-normal tracking-[-0.96px] text-black leading-normal">
                    Expand your investment portfolio for better returns today!
                  </p>
                  <button className="bg-black text-white font-medium text-lg desk-md:text-xl desk:text-[22px] desk-lg:text-[24px] tracking-[-0.48px] px-4 desk-md:px-5 py-3 desk-md:py-4 desk:py-[19px] rounded-lg flex items-center gap-2.5 w-fit">
                    Download the app
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works panel transition triggers */}
      <section ref={hiwTrigger2Ref} className="h-screen" />
      <section ref={hiwTrigger3Ref} className="h-screen" />
      <section ref={hiwTrigger4Ref} className="h-screen" />

      {/* ═══ Bonds for Everyone — Fixed overlay ═══ */}
      <div
        ref={bfeSectionRef}
        className="fixed inset-0 w-full h-full z-[25] pointer-events-none invisible"
      >
        <div className="pointer-events-auto w-full h-full bg-white flex flex-col items-center justify-center pt-16 desk-sm:pt-20 desk-md:pt-24 px-8 desk-sm:px-12 desk-md:px-16 desk:px-18 desk-lg:px-20">
          {/* Heading */}
          <div ref={bfeHeadingRef} className="flex flex-col items-center gap-2 desk-md:gap-3 mb-10 desk-sm:mb-12 desk-md:mb-[60px] desk:mb-[65px] desk-lg:mb-[70px]">
            <p className="text-3xl desk-sm:text-4xl desk-md:text-5xl desk:text-6xl desk-lg:text-6xl font-normal leading-[1.2] tracking-[-0.96px] text-black text-center">
              Bond&apos;s are for everyone
            </p>
            <p className="text-lg desk-md:text-xl desk:text-[22px] desk-lg:text-[24px] font-normal tracking-[-0.48px] text-black text-center">
              From short term to long, from govt to corporate, we have got it all
            </p>
          </div>

          {/* 3 Cards */}
          <div className="flex gap-6 desk-sm:gap-7 desk-md:gap-8 desk:gap-9 desk-lg:gap-10 items-start w-full max-w-[900px] desk-sm:max-w-[1000px] desk-md:max-w-[1100px] desk:max-w-[1160px] desk-lg:max-w-[1220px]">
            {BONDS_FOR_EVERYONE_CARDS.map((card, i) => (
              <div
                key={card.title}
                ref={[bfeCard1, bfeCard2, bfeCard3][i]}
                className="flex flex-col gap-5 desk-md:gap-[30px] items-start flex-1"
              >
                {/* Placeholder image */}
                <div className="bg-[#d9d9d9] rounded-[28px] desk-md:rounded-[34px] desk:rounded-[40px] w-[140px] h-[140px] desk-sm:w-[160px] desk-sm:h-[160px] desk-md:w-[180px] desk-md:h-[180px] desk:w-[190px] desk:h-[190px] desk-lg:w-[200px] desk-lg:h-[200px] shrink-0" />

                {/* Text content */}
                <div className="flex flex-col gap-3 desk-md:gap-5 w-full">
                  <p className="text-lg desk-sm:text-xl desk-md:text-[22px] desk:text-[23px] desk-lg:text-[24px] font-normal tracking-[-0.48px] text-black leading-normal">
                    {card.title}
                  </p>
                  <p className="text-sm desk-sm:text-base desk-md:text-[17px] desk:text-[17px] desk-lg:text-[18px] font-normal tracking-[-0.36px] text-black/70 leading-[1.5]">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bonds for Everyone trigger */}
      <section ref={bfeTriggerRef} className="h-screen" />

      {/* ═══ Testimonials — Fixed overlay ═══ */}
      <div
        ref={testimSectionRef}
        className="fixed inset-0 w-full h-full z-[30] pointer-events-none invisible"
      >
        <div className="pointer-events-auto w-full h-full bg-white flex flex-col items-center justify-center pt-20 desk-md:pt-24 px-8 desk-sm:px-12 desk-md:px-16 desk:px-18 desk-lg:px-20">
          {/* Heading */}
          <div ref={testimHeadingRef} className="mb-10 desk-md:mb-12 desk:mb-14 desk-lg:mb-16">
            <p className="text-3xl desk-sm:text-4xl desk-md:text-5xl desk:text-6xl desk-lg:text-6xl font-normal leading-[1.2] tracking-[-0.96px] text-black text-center">
              What our users are saying
            </p>
          </div>

          {/* Carousel */}
          <div ref={testimContentRef} className="w-full max-w-[700px] desk-md:max-w-[800px] desk:max-w-[850px] desk-lg:max-w-[900px]">
            <TestimonialsCarousel />
          </div>
        </div>
      </div>

      {/* Testimonials trigger */}
      <section ref={testimTriggerRef} className="h-screen" />

      {/* ═══ FAQ — Fixed overlay ═══ */}
      <div
        ref={faqSectionRef}
        className="fixed inset-0 w-full h-full z-[40] pointer-events-none invisible"
      >
        <div
          className="pointer-events-auto w-full h-full bg-black flex items-center justify-center pt-20 desk-md:pt-24 px-8 desk-sm:px-12 desk-md:px-16 desk:px-18 desk-lg:px-20"
          style={{ fontFamily: "var(--font-instrument-sans), sans-serif" }}
        >
          <div className="flex gap-10 desk-sm:gap-12 desk-md:gap-16 desk:gap-18 desk-lg:gap-20 items-start w-full max-w-[900px] desk-sm:max-w-[1000px] desk-md:max-w-[1100px] desk:max-w-[1160px] desk-lg:max-w-[1220px]">
            {/* Left column — heading + subtitle + support link */}
            <div ref={faqHeadingRef} className="w-[240px] desk-sm:w-[280px] desk-md:w-[310px] desk:w-[325px] desk-lg:w-[340px] shrink-0">
              <p className="text-3xl desk-sm:text-4xl desk-md:text-5xl desk:text-6xl desk-lg:text-6xl font-normal leading-[1.2] tracking-[-0.96px] text-white">
                FAQs
              </p>
              <p className="text-md desk-md:text-lg desk:text-xl font-normal tracking-[-0.32px] text-white/50 mt-3 leading-relaxed">
                Your questions answered
              </p>
              <p className="text-sm desk-sm:text-base desk-md:text-lg desk:text-xl font-normal tracking-[-0.3px] text-white/50 mt-6 desk-md:mt-8 leading-relaxed">
                Can&apos;t find what you&apos;re looking for?{" "}
                Contact our{" "}
                <a
                  href="#"
                  className="text-white font-semibold hover:underline"
                >
                  customer support team
                </a>
              </p>
            </div>

            {/* Right column — accordion */}
            <div ref={faqContentRef} className="flex-1 min-w-0">
              <FAQAccordion />
            </div>
          </div>
        </div>
      </div>

      {/* FAQ trigger */}
      <section ref={faqTriggerRef} className="h-screen" />

      {/* ═══ Diversify CTA — Fixed overlay ═══ */}
      <div
        ref={divSectionRef}
        className="fixed inset-0 w-full h-full z-[35] pointer-events-none invisible"
      >
        <div className="pointer-events-auto w-full h-full">
          {/* Card — full viewport, clipped via clip-path */}
          <div
            ref={divCardRef}
            className="w-full h-full bg-[#021c1c] flex items-center justify-center relative"
            style={{
            clipPath: "inset(15% 5% 15% 5% round 40px)",
              fontFamily: "var(--font-instrument-sans), sans-serif",
            }}
          >
            {/* Background pattern — fixed size, centered, no scaling */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "url(/version\\ 3/diversify-pattern.png)",
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "100vw 100vh",
              }}
            />

            {/* Content */}
            <div
              ref={divContentRef}
              className="relative z-10 flex flex-col items-center text-center px-8 desk-sm:px-20 desk-md:px-[120px] desk:px-[160px] desk-lg:px-[196px] py-16 desk-md:py-20 desk:py-[100px] gap-8 desk-md:gap-10 desk:gap-[52px]"
            >
              <div className="flex flex-col gap-4 desk-md:gap-5 desk:gap-[22px] items-center">
                <p className="text-3xl desk-sm:text-4xl desk-md:text-[44px] desk:text-[52px] desk-lg:text-[56px] font-normal tracking-[-1.12px] text-white leading-[1.2]">
                  Ready to diversify your investments?
                </p>
                <p className="text-base desk-sm:text-lg desk-md:text-xl desk:text-[22px] desk-lg:text-[24px] font-normal tracking-[-0.48px] text-white/60">
                  It&apos;s never wise to keep all your investments in the same
                  basket
                </p>
              </div>
              <button className="bg-[#3be2e4] text-black font-medium text-lg desk-md:text-xl desk:text-[22px] desk-lg:text-[24px] tracking-[-0.48px] px-4 desk-md:px-5 py-3 desk-md:py-4 desk:py-[19px] rounded-lg flex items-center gap-2.5 transition-all hover:bg-[#2dd1d3]">
                Show all bonds
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Diversify trigger 1: card entrance */}
      <section ref={divTrigger1Ref} className="h-screen" />
      {/* Diversify trigger 2: expand to fullscreen */}
      <section ref={divTrigger2Ref} className="h-screen" />
    </div>
  );
}
