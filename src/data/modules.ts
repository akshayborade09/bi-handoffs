export interface Module {
  id: string;
  title: string;
  description: string;
  version: string;
}

export const modules: Module[] = [
  {
    id: "1",
    title: "Module 1: Pre-Sign Up Page",
    description:
      "Hero, metrics, bonds, questionnaire, reviews, FAQ, footer, Annotations & refinements",
    version: "1.0",
  },
  {
    id: "2",
    title: "Module 2: Unified Login/Sign-Up",
    description: "Auth screens, OTP, social login, error states",
    version: "1.0",
  },
  {
    id: "3",
    title: "Module 3: Home Dashboard",
    description:
      "Navigation, portfolio widget, collections, filters, Search, statistics, FAQ, deal of the day",
    version: "1.0",
  },
  {
    id: "4",
    title: "Module 4: KYC Module",
    description:
      "Declaration, DigiLocker, document selection, forms, e-Sign, HUF screens, error states, progress",
    version: "1.0",
  },
  {
    id: "5",
    title: "Module 5: Profile",
    description: "Details, bank/demat, family members, picture, deletion",
    version: "1.0",
  },
  {
    id: "6",
    title: "Module 6: Portfolio",
    description: "Dashboard, repayments, investments, zero-state, sell",
    version: "1.0",
  },
  {
    id: "7",
    title: "Module 7: Product Listing & Bond Details",
    description: "Listing, filters, cards, detail page, calculator",
    version: "1.0",
  },
  {
    id: "8",
    title: "Module 8: My Orders",
    description: "Orders list, status filters, details, retry",
    version: "1.0",
  },
  {
    id: "9",
    title: "Module 9: IPO Module",
    description:
      "IPO listing, categories, cards, detail page, series, Order panel, pre-apply, payment modes, confirmation",
    version: "1.0",
  },
  {
    id: "10",
    title: "Module 10: Transaction Flow",
    description: "Transaction page, payment modes, UPI/NetBanking, success/failure",
    version: "1.0",
  },
  {
    id: "11",
    title: "Module 11: Service Tab (Global)",
    description: "Service tab, query submission, automation",
    version: "1.0",
  },
];
