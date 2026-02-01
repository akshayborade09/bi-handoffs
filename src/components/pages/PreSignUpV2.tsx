"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useTransform } from "framer-motion";
import { ChevronDown, Check, Instagram, Linkedin, Twitter, Youtube, CircleDollarSign, UserCheck, Search, Lock, TrendingUp, Clock, ShieldCheck, Menu, X } from "lucide-react";

// --- Components ---

const Button = ({
  children,
  variant = "primary",
  size = "lg",
  className = "",
  ...props
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "white";
  size?: "sm" | "lg";
  className?: string;
  [key: string]: any;
}) => {
  const baseStyles = "rounded-md font-medium transition-all duration-200 inline-flex items-center justify-center gap-2 cursor-pointer";

  const sizes = {
    sm: "px-4 h-[38px] text-sm",
    lg: "px-6 h-[48px] text-base"
  };

  const variants = {
    primary: "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200",
    secondary: "bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-50",
    outline: "border border-zinc-700 text-zinc-100 hover:bg-zinc-800",
    white: "bg-white text-zinc-900 hover:bg-zinc-100"
  };

  return (
    <button className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Navbar = ({ isLight }: { isLight: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6 py-4 ${isLight
      ? "bg-white border-b border-zinc-200"
      : "bg-black border-b border-white/10"
      }`}>
      <div className="max-w-[1280px] mx-auto flex items-center justify-between">
        <div className={`text-xl font-bold tracking-tight transition-colors duration-500 ${isLight ? "text-zinc-900" : "text-white"
          }`}>
          Bonds India
        </div>

        {/* Desktop Menu */}
        <div className={`hidden md:flex items-center gap-8 text-sm font-medium transition-colors duration-500 ${isLight ? "text-zinc-600" : "text-white/70"
          }`}>
          <a href="#" className={`transition-colors ${isLight ? "hover:text-zinc-900" : "hover:text-white"}`}>Bonds</a>
          <a href="#" className={`transition-colors ${isLight ? "hover:text-zinc-900" : "hover:text-white"}`}>Resources</a>
          <Button
            variant={isLight ? "primary" : "white"}
            size="sm"
            className="rounded-md"
          >
            Login/Register
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`md:hidden p-1 ${isLight ? "text-zinc-900" : "text-white"}`}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="md:hidden overflow-hidden"
          >
            <div className={`flex flex-col gap-4 py-6 mt-2 border-t ${isLight ? "border-zinc-100 text-zinc-600" : "border-white/10 text-white/70"}`}>
              <a href="#" className={`text-sm font-medium transition-colors ${isLight ? "hover:text-zinc-900" : "hover:text-white"}`}>Bonds</a>
              <a href="#" className={`text-sm font-medium transition-colors ${isLight ? "hover:text-zinc-900" : "hover:text-white"}`}>Resources</a>
              <Button
                variant={isLight ? "primary" : "white"}
                size="sm"
                className="w-full rounded-md"
              >
                Login/Register
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const FAQItem = ({
  question,
  answer,
  isOpen,
  onToggle
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  return (
    <div className="border-b border-zinc-100 dark:border-zinc-800 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-6 text-left hover:text-zinc-600 transition-colors cursor-pointer group"
      >
        <span className={`text-lg transition-colors duration-300 relative inline-flex flex-col items-start ${isOpen
          ? "font-semibold text-zinc-900 dark:text-zinc-100"
          : "font-normal text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300"
          }`}>
          {/* Layout stabilizer: Reserves space for the bold text to prevent stuttering/shifting */}
          <span className="invisible h-0 font-semibold select-none pointer-events-none" aria-hidden="true">
            {question}
          </span>
          <span className="transition-all duration-300">
            {question}
          </span>
        </span>
        <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-zinc-500 dark:text-zinc-400 leading-relaxed text-[16px]">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!ref.current) return;

    const updateHeight = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setHeight(rect.height);
      }
    };

    // Initial calculation
    updateHeight();

    // Resize observer for dynamic content changes
    const observer = new ResizeObserver(() => {
      updateHeight();
    });

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 50%"],
  });


  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // With 3 items, divide the progress into 3 parts
    const step = 1 / data.length;
    const index = Math.floor(latest / step);
    setActiveIndex(Math.min(index, data.length - 1));
  });

  return (
    <div
      className="w-full bg-white dark:bg-zinc-950 font-sans md:px-10"
      ref={containerRef}
    >
      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            className={`flex justify-start ${index === 0 ? "pt-16" : "pt-8"} md:pt-[120px] md:gap-10`}
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white dark:bg-black flex items-center justify-center border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors duration-500">
                <div className={`h-4 w-4 rounded-full border p-2 transition-colors duration-500 ${activeIndex >= index
                  ? "bg-zinc-900 border-zinc-900 dark:bg-white dark:border-white"
                  : "bg-zinc-200 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
                  }`} />
              </div>
              <h3 className={`hidden md:block text-xl md:pl-20 md:text-5xl font-bold transition-colors duration-500 ${activeIndex >= index
                ? "text-zinc-900 dark:text-white"
                : "text-zinc-300 dark:text-zinc-700"
                }`}>
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 className={`md:hidden block text-2xl mb-4 text-left font-bold transition-colors duration-500 ${activeIndex >= index
                ? "text-zinc-900 dark:text-white"
                : "text-zinc-400 dark:text-zinc-500"
                }`}>
                {item.title}
              </h3>
              <div className={`transition-opacity duration-500 ${activeIndex >= index ? "opacity-100" : "opacity-40"}`}>
                {item.content}
              </div>
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-zinc-200 dark:via-zinc-800 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-zinc-900 via-zinc-400 to-transparent dark:from-white dark:via-zinc-500 from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

// --- Page Component ---

export function PreSignUpV2() {
  const [activeGrowth, setActiveGrowth] = useState(0);
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(0);
  const [isNavbarLight, setIsNavbarLight] = useState(false);
  const { scrollY } = useScroll();
  const growthSectionRef = useRef<HTMLElement>(null);
  const ctaSectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: growthSectionRef,
    offset: ["start 10%", "end start"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest: number) => {
    if (latest <= 0.1) setActiveGrowth(0);
    else if (latest > 0.1 && latest <= 0.2) setActiveGrowth(1);
    else if (latest > 0.2 && latest <= 0.3) setActiveGrowth(2);
    else if (latest > 0.3) setActiveGrowth(3);
  });

  /* Navbar Logic */
  useMotionValueEvent(scrollY, "change", (latest: number) => {
    const heroThreshold = 720;

    // Default to dark (false) if at top, light (true) if past hero
    let isLight = latest > heroThreshold;

    // Check if the CTA section is reaching the navbar
    // If so, switch back to dark
    if (ctaSectionRef.current) {
      const ctaTop = ctaSectionRef.current.offsetTop;
      const navbarHeight = 80; // approximate
      // If scroll position + navbar height >= cta top, we are entering the dark section
      if (latest + navbarHeight >= ctaTop) {
        isLight = false;
      }
    }

    setIsNavbarLight(isLight);
  });

  const growthItems = [
    { title: "Zero Brokerage", desc: "We believe in removing barriers for first-time market participants. We grow when you grow.", icon: CircleDollarSign },
    { title: "Seamless KYC", desc: "Onboard in minutes with our fully digital and secure KYC process.", icon: UserCheck },
    { title: "Carefully curated bonds", desc: "Access a handpicked selection of bonds vetted by our expert research team.", icon: Search },
    { title: "Secured Payment", desc: "Transact with confidence using our secure, encrypted payment gateways.", icon: Lock }
  ];

  return (
    <div className="w-full min-h-screen bg-white dark:bg-zinc-950 font-sans selection:bg-zinc-900 selection:text-white">
      <Navbar isLight={isNavbarLight} />

      {/* Hero Section */}
      <section className="relative pt-[82px] h-[95vh] min-h-[600px] flex items-center justify-center bg-black overflow-hidden px-6">
        <div className="max-w-[1080px] w-full text-center z-10 py-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-sans font-[900] text-[48px] md:text-[72px] leading-[1.05] tracking-[-0.04em] text-white mb-10"
          >
            Predictable returns <br />
            for thoughtful investors
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row items-center justify-center flex-wrap gap-3 md:gap-6 mb-12 text-[16px] md:text-[18px] text-white font-medium"
          >
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Check className="w-[11px] h-[11px] text-white stroke-[3]" />
              </div>
              <span className="leading-none">SEBI Registered</span>
            </div>
            <div className="hidden md:block w-[1px] h-3 bg-white/30" />
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Check className="w-[11px] h-[11px] text-white stroke-[3]" />
              </div>
              <span className="leading-none">Invest as low as ₹1,000</span>
            </div>
            <div className="hidden md:block w-[1px] h-3 bg-white/30" />
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Check className="w-[11px] h-[11px] text-white stroke-[3]" />
              </div>
              <span className="leading-none">Zero brokerage</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button variant="white" size="lg" className="min-w-[180px]">Explore Bonds</Button>
            <Button variant="outline" size="lg" className="min-w-[180px]">Learn how bonds work</Button>
          </motion.div>
        </div>

        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-zinc-800/20 rounded-full blur-[120px] pointer-events-none" />
      </section>

      {/* Financial Growth (Accordion) Section */}
      <section ref={growthSectionRef} className="pt-[152px] pb-24 md:pb-48 px-6 bg-white dark:bg-zinc-950">
        <div className="max-w-[1080px] mx-auto text-center">
          <h2 className="text-[32px] leading-[32px] md:text-[54px] md:leading-[60px] font-semibold tracking-tight text-zinc-900 dark:text-white mb-4">
            "Nurturing financial growth" <br />
            for 1 lakh+ Indians
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-16 text-[16px] md:text-lg">Our offering stands tall as our moto</p>

          <div className="max-w-[720px] mx-auto">
            {growthItems.map((item, index) => (
              <div key={index} className="py-1">
                <motion.div
                  layout
                  onClick={() => setActiveGrowth(index)}
                  className={`text-left p-6 sm:px-8 sm:py-7 cursor-pointer transition-all duration-200 ${activeGrowth === index
                    ? "bg-white border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none rounded-2xl z-10 relative"
                    : `border-b hover:bg-zinc-50 dark:hover:bg-zinc-900/50 ${activeGrowth === index + 1 ? "border-transparent" : "border-zinc-100 dark:border-zinc-800"}`
                    }`}
                >
                  <div className="flex items-start gap-5">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${activeGrowth === index ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800"
                      }`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div className="pt-1.5 flex-1">
                      <h3 className={`text-xl font-semibold transition-colors ${activeGrowth === index ? "text-zinc-900 dark:text-white" : "text-zinc-500 dark:text-zinc-400"}`}>{item.title}</h3>
                      <AnimatePresence initial={false}>
                        {activeGrowth === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                            className="overflow-hidden"
                          >
                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[16px] mt-2">
                              {item.desc}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bonds are for everyone (Benefits) Section */}
      <section className="py-24 px-6 bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-[1240px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[32px] leading-[32px] md:text-[54px] md:leading-[60px] font-semibold tracking-tight text-zinc-900 dark:text-white mb-4">
              Bond's are for everyone
            </h2>
            <p className="text-zinc-500 text-[16px] md:text-lg">From short term to long, from govt to corporate, we have got it all</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-0 md:mb-16">
            {[
              {
                title: "Start small with ₹1,000",
                desc: "Starting small? Start small, learn via investing and build appetite for bonds.",
                image: "/benefits/start_small_refined.png"
              },
              {
                title: "Choose tenure as per your need and wants",
                desc: "Start as low as 1 year tenure or choose to stay put for up to 5 years.",
                image: "/benefits/tenure_refined.png"
              },
              {
                title: "Choose from 100+ bonds",
                desc: "Choose from Govt of Govt, State Govt to Corporate, PSUs and SLUs bonds.",
                image: "/benefits/bonds_refined.png"
              }
            ].map((card, i) => (
              <div key={i} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-8 flex flex-col items-start text-left transition-all duration-300 shadow-sm hover:shadow-md hover:border-zinc-200">
                <div className="w-20 h-20 overflow-hidden mb-8 flex items-center justify-center">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-contain scale-[1.6] opacity-90 group-hover:opacity-100 transition-all duration-500 group-hover:scale-[1.7]"
                  />
                </div>
                <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-white leading-tight">{card.title}</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-[15px] leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* How it works Section */}
      <section className="py-24 px-6 bg-white dark:bg-zinc-950">
        <div className="max-w-[1080px] mx-auto">
          <div className="text-center mb-0">
            <h2 className="text-[32px] leading-[32px] md:text-[54px] md:leading-[60px] font-semibold tracking-tight text-zinc-900 dark:text-white mb-4">How it works</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-[16px] md:text-lg">Three simple steps to start investing in bonds.</p>
          </div>

          <Timeline
            data={[
              {
                title: "Step 01",
                content: (
                  <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 md:p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                    <h4 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white mb-3 md:mb-4">Create Your Account</h4>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-lg leading-relaxed">
                      Join 1 lakh+ investors. Sign up in minutes with basic details and complete your securely encrypted KYC process to get started.
                    </p>
                  </div>
                ),
              },
              {
                title: "Step 02",
                content: (
                  <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 md:p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                    <h4 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white mb-3 md:mb-4">Explore & Choose</h4>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-lg leading-relaxed">
                      Browse through our curated collection of Govt, State Govt, and Corporate bonds. Filter by tenure, yield, and risk apppetite.
                    </p>
                  </div>
                ),
              },
              {
                title: "Step 03",
                content: (
                  <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 md:p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                    <h4 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white mb-3 md:mb-4">Invest & Earn</h4>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-lg leading-relaxed">
                      Complete your investment via UPI or Net Banking. Sit back and watch your wealth grow with predictable, timely returns.
                    </p>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </section>

      {/* FAQs Section */}
      <section className="pb-24 md:pb-[196px] px-6 bg-white dark:bg-zinc-950">
        <div className="max-w-[800px] mx-auto text-center mb-10 md:mb-20">
          <img
            src="/divider-flourish.png"
            alt="Section Divider"
            className="h-6 mx-auto opacity-60 dark:invert dark:opacity-40 mb-[180px]"
          />
          <h2 className="text-[32px] leading-[32px] md:text-3xl md:leading-[60px] font-semibold text-zinc-900 dark:text-white">FAQs</h2>
        </div>
        <div className="max-w-[800px] mx-auto">
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {[
              {
                question: "What exactly is a bond?",
                answer: "Think of bonds like fixed deposits (FDs)—but, instead of placing money in a bank, you deposit it directly with companies or the government for higher returns."
              },
              {
                question: "Can I sell the bonds before it matures?",
                answer: "Yes, bonds can be sold in the secondary market. However, liquidity depends on the specific bond and market conditions."
              },
              {
                question: "Do you charge any fees?",
                answer: "We pride ourselves on 100% transparency. We have zero brokerage model for many of our listed instruments."
              },
              {
                question: "How are interest earned on bonds taxed?",
                answer: "Interests are generally taxed based on your income slab. Capital gains tax may also apply if sold before maturity."
              }
            ].map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFAQIndex === index}
                onToggle={() => setOpenFAQIndex(openFAQIndex === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section ref={ctaSectionRef} className="h-[95vh] px-6 bg-black text-center relative overflow-hidden text-white flex flex-col items-center justify-center">
        <div className="max-w-[1000px] mx-auto z-10 relative">
          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="font-bold text-[40px] leading-[40px] md:text-[64px] md:leading-[60px] tracking-tight mb-8"
          >
            Ready to diversify <br /> your investments?
          </motion.h2>
          <p className="text-white/60 text-[16px] md:text-lg mb-12 italic">It’s never wise to keep all your investments in the same basket</p>
          <Button variant="white" size="lg" className="min-w-[220px]">Register & Invest</Button>
        </div>

        {/* Decorative background elements */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[140%] h-[500px] bg-gradient-to-t from-zinc-800/10 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
      </section>

      {/* Footer */}
      {/* Footer */}
      <footer className="pt-12 pb-12 md:pt-[79px] md:pb-[79px] px-6 md:px-[100px] bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900">
        <div className="flex flex-col md:flex-row flex-wrap justify-between items-start w-full max-w-[1280px] mx-auto gap-10 md:gap-10">

          {/* Column 1: Address & Contact */}
          <div className="flex flex-col gap-6 w-full md:w-[244px] shrink-0">
            <h3 className="font-semibold text-base leading-[22px] text-zinc-900 dark:text-white">Bonds India</h3>
            <div className="flex flex-col gap-3 text-sm leading-[20px] text-zinc-900 dark:text-zinc-300 font-normal">
              <p>601/602, Express Building, 14 E Road, Churchgate, Mumbai- 400020</p>
              <p>+91-8882-200-300</p>
            </div>
          </div>

          {/* Separator */}
          <div className="hidden lg:block w-[1px] h-[150px] bg-zinc-100 dark:bg-zinc-800" />

          {/* Column 2: Registration Details */}
          <div className="flex flex-col gap-4 text-sm leading-[20px] text-zinc-900 dark:text-zinc-300 w-full md:w-[260px] shrink-0">
            <div>
              <span className="font-semibold block mb-1">SEBI Registration number:</span>
              <span>INZ000296636</span>
            </div>
            <div>
              <span className="font-semibold">BSE Membership ID: </span>
              <span>6746</span>
            </div>
            <div>
              <span className="font-semibold">NSE Membership ID: </span>
              <span>90329</span>
            </div>
            <div>
              <span className="font-semibold">CIN: </span>
              <span>U67100MH2020PTC425987</span>
            </div>
          </div>

          {/* Separator */}
          <div className="hidden lg:block w-[1px] h-[150px] bg-zinc-100 dark:bg-zinc-800" />

          {/* Mobile Flex Stack for Links (was Grid) */}
          <div className="flex flex-col gap-10 w-full md:flex-row md:w-auto md:gap-10">

            {/* Column 3: Products */}
            <div className="flex flex-col gap-4 text-sm w-full md:w-[100px] shrink-0">
              <h4 className="font-semibold text-base leading-[22px] text-zinc-900 dark:text-white">Products</h4>
              <div className="flex flex-col gap-3 text-zinc-900 dark:text-zinc-300">
                <a href="#" className="hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors">Bonds</a>
              </div>
            </div>

            {/* Column 4: About */}
            <div className="flex flex-col gap-4 text-sm w-full md:w-[100px] shrink-0">
              <h4 className="font-semibold text-base leading-[22px] text-zinc-900 dark:text-white">About</h4>
              <div className="flex flex-col gap-3 text-zinc-900 dark:text-zinc-300">
                <a href="#" className="hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors">Our story</a>
                <a href="#" className="hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors">Contact Us</a>
                <a href="#" className="hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors">Blogs</a>
              </div>
            </div>

            {/* Column 5: Important Links */}
            <div className="flex flex-col gap-4 text-sm w-full md:w-[180px] shrink-0">
              <h4 className="font-semibold text-base leading-[22px] text-zinc-900 dark:text-white">Important links</h4>
              <div className="flex flex-col gap-3 text-zinc-900 dark:text-zinc-300">
                <a href="#" className="hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors">Terms and Conditions</a>
                <a href="#" className="hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors">Investor Awareness</a>
                <a href="#" className="hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors">Risk Disclosures & Disclaimers</a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Contact Section */}
        <div className="w-full max-w-[1280px] mx-auto mt-12 md:mt-20 text-left md:text-center">
          <p className="text-zinc-900 dark:text-zinc-400 text-sm leading-relaxed">
            For grievances please write to : <br className="md:hidden" />
            <span className="font-semibold">compliance@bondsindia.com</span> / <span className="font-semibold">igr@bondsindia.com</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
