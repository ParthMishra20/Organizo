import { lazy } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Wallet, 
  UserCircle,
  type LucideIcon 
} from 'lucide-react';

export interface RouteConfig {
  path: string;
  component: React.LazyExoticComponent<React.ComponentType>;
  icon: LucideIcon;
  label: string;
  description: string;
  loadingMessage: string;
}

// Lazy load components
const Dashboard = lazy(() => import('../pages/Dashboard'));
const TaskScheduler = lazy(() => import('../pages/TaskScheduler'));
const BudgetBuddy = lazy(() => import('../pages/BudgetBuddy'));
const Profile = lazy(() => import('../pages/Profile'));

export const ROUTES: RouteConfig[] = [
  { 
    path: "/dashboard",
    component: Dashboard,
    icon: LayoutDashboard,
    label: "Dashboard",
    description: "Overview and statistics",
    loadingMessage: "Loading dashboard..."
  },
  { 
    path: "/scheduler",
    component: TaskScheduler,
    icon: Calendar,
    label: "Task Scheduler",
    description: "Task management and scheduling",
    loadingMessage: "Loading scheduler..."
  },
  { 
    path: "/budget",
    component: BudgetBuddy,
    icon: Wallet,
    label: "Budget Buddy",
    description: "Budget management and tracking",
    loadingMessage: "Loading budget tracker..."
  },
  { 
    path: "/profile",
    component: Profile,
    icon: UserCircle,
    label: "Profile",
    description: "User settings and preferences",
    loadingMessage: "Loading profile..."
  }
];

export const AUTH_ROUTES = {
  signIn: {
    path: "/sign-in/*",
    appearance: {
      elements: {
        rootBox: "transition-all duration-300",
        card: "animate-slideIn shadow-xl",
        socialButtonsBlockButton: "hover:scale-102 transition-transform",
        formButtonPrimary: "hover:scale-102 transition-transform",
      }
    }
  },
  signUp: {
    path: "/sign-up/*",
    appearance: {
      elements: {
        rootBox: "transition-all duration-300",
        card: "animate-slideIn shadow-xl",
        socialButtonsBlockButton: "hover:scale-102 transition-transform",
        formButtonPrimary: "hover:scale-102 transition-transform",
      }
    }
  }
};

export const ROOT_REDIRECT = {
  from: "/",
  to: "/dashboard"
} as const;

// Helper function to get route by path
export function getRouteByPath(path: string): RouteConfig | undefined {
  return ROUTES.find(route => route.path === path);
}

// Helper function to get route metadata
export function getRouteMetadata(path: string) {
  const route = getRouteByPath(path);
  if (!route) return null;

  return {
    label: route.label,
    description: route.description,
    icon: route.icon
  };
}

// Type for the route metadata
export interface RouteMetadata {
  label: string;
  description: string;
  icon: LucideIcon;
}

// Helper function to check if a path is a valid route
export function isValidRoute(path: string): boolean {
  return ROUTES.some(route => route.path === path);
}