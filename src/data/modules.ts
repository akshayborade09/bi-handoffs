export interface SubNavChild {
  label: string;
  pageId?: string;
}

export interface ModuleSubNavItem {
  title: string;
  children: SubNavChild[];
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  version: string;
  subNav?: ModuleSubNavItem[];
}

export const modules: Module[] = [
  {
    id: "1",
    title: "Module 1: Pre/Post Sign Up Page",
    version: "1.0",
    subNav: [
      { title: "Pre sign up", children: [{ label: "Version 1", pageId: "pre-signup-v1" }, { label: "Version 2", pageId: "pre-signup-v2" }] },
      { title: "Post sign up", children: [{ label: "Version 1", pageId: "post-signup-v1" }] },
    ],
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
