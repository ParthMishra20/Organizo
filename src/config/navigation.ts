import { 
  LayoutDashboard, 
  Calendar, 
  Wallet, 
  UserCircle 
} from 'lucide-react';

export const MAIN_NAVIGATION = [
  { 
    to: '/dashboard', 
    icon: LayoutDashboard, 
    label: 'Dashboard',
    description: 'View your daily overview and statistics'
  },
  { 
    to: '/scheduler', 
    icon: Calendar, 
    label: 'Task Scheduler',
    description: 'Manage your tasks and schedule'
  },
  { 
    to: '/budget', 
    icon: Wallet, 
    label: 'Budget Buddy',
    description: 'Track your expenses and budget'
  },
  { 
    to: '/profile', 
    icon: UserCircle, 
    label: 'Profile',
    description: 'Manage your account settings'
  }
] as const;

export const CLERK_APPEARANCE = {
  layout: {
    socialButtonsPlacement: "bottom" as const,
    logoPlacement: "inside" as const,
    logoImageUrl: "/site logo.svg"
  },
  variables: {
    colorPrimary: "#4f46e5",
    colorTextOnPrimaryBackground: "#ffffff",
    borderRadius: "0.5rem",
    fontFamily: 'inherit'
  },
  elements: {
    card: "shadow-xl border border-gray-100 dark:border-gray-800",
    socialButtonsIconButton: 
      "hover:scale-105 transition-transform",
    socialButtonsBlockButton: 
      "hover:scale-105 transition-transform",
    formButtonPrimary: 
      "hover:scale-105 transition-transform",
    footerActionLink: 
      "text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300",
    headerTitle: "text-2xl",
    headerSubtitle: "text-gray-600 dark:text-gray-400"
  }
};

export const MOBILE_MENU_BREAKPOINT = 'md';

export const NAVIGATION_THEME = {
  light: {
    active: "bg-indigo-50 text-indigo-600",
    inactive: "text-gray-600 hover:bg-gray-50 hover:text-indigo-500",
    mobileMenuBg: "bg-white",
    mobileMenuBorder: "border-gray-200"
  },
  dark: {
    active: "bg-indigo-900/20 text-indigo-400",
    inactive: "text-gray-300 hover:bg-gray-800 hover:text-indigo-300",
    mobileMenuBg: "bg-gray-900",
    mobileMenuBorder: "border-gray-800"
  }
};

export const ANIMATION_DURATION = {
  fast: 200,
  normal: 300,
  slow: 500
};

export const Z_INDEX = {
  navbar: 50,
  mobileMenu: 40,
  modal: 100,
  toast: 1000
};