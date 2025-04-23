import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavigationItem {
  id: string;
  path: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  children?: NavigationItem[];
}

interface Breadcrumb {
  label: string;
  path: string;
}

interface NavigationContextType {
  currentPath: string;
  breadcrumbs: Breadcrumb[];
  activePath: string;
  navigationItems: NavigationItem[];
  isNavigating: boolean;
  navigate: (path: string) => void;
  setNavigationItems: (items: NavigationItem[]) => void;
  toggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

interface NavigationProviderProps {
  children: React.ReactNode;
  initialItems?: NavigationItem[];
}

export function NavigationProvider({ 
  children, 
  initialItems = [] 
}: NavigationProviderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>(initialItems);

  // Track current path
  const [currentPath, setCurrentPath] = useState(location.pathname);
  const [activePath, setActivePath] = useState(location.pathname);

  // Generate breadcrumbs based on current path
  const generateBreadcrumbs = useCallback((path: string): Breadcrumb[] => {
    const parts = path.split('/').filter(Boolean);
    const breadcrumbs: Breadcrumb[] = [{ label: 'Home', path: '/' }];

    let currentPath = '';
    parts.forEach(part => {
      currentPath += `/${part}`;
      const navItem = navigationItems.find(item => item.path === currentPath);
      if (navItem) {
        breadcrumbs.push({ label: navItem.label, path: currentPath });
      }
    });

    return breadcrumbs;
  }, [navigationItems]);

  // Update path when location changes
  useEffect(() => {
    setCurrentPath(location.pathname);
    setActivePath(location.pathname);
  }, [location]);

  // Handle navigation
  const handleNavigate = useCallback(async (path: string) => {
    try {
      setIsNavigating(true);
      await navigate(path);
      setCurrentPath(path);
      setActivePath(path);
      setIsMobileMenuOpen(false);
    } finally {
      setIsNavigating(false);
    }
  }, [navigate]);

  // Toggle mobile menu
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const value = {
    currentPath,
    breadcrumbs: generateBreadcrumbs(currentPath),
    activePath,
    navigationItems,
    isNavigating,
    navigate: handleNavigate,
    setNavigationItems,
    toggleMobileMenu,
    isMobileMenuOpen,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  
  return context;
}

/* Example usage:
const Component = () => {
  const { 
    navigate, 
    currentPath, 
    breadcrumbs,
    navigationItems,
    isMobileMenuOpen,
    toggleMobileMenu 
  } = useNavigation();

  return (
    <nav>
      <button onClick={toggleMobileMenu}>
        Menu
      </button>
      
      <div className={isMobileMenuOpen ? 'block' : 'hidden'}>
        {navigationItems.map(item => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={currentPath === item.path ? 'active' : ''}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="breadcrumbs">
        {breadcrumbs.map(({ label, path }, index) => (
          <React.Fragment key={path}>
            {index > 0 && <span>/</span>}
            <button onClick={() => navigate(path)}>
              {label}
            </button>
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};
*/