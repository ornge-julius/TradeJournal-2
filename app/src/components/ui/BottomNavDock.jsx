import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Dock from './Dock';
import {
  History,
  LayoutDashboard,
  Tag,
  TrendingUpDown,
  Sun,
  Moon,
  Plus
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const BottomNavDock = ({ onToggleTradeForm, showTradeForm }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toggleTheme, isDark } = useTheme();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Helper function to determine if a path is active
  const isActive = (path) => {
    if (path === '/') {
      // Dashboard is active only on root path, not on detail pages
      return location.pathname === '/' && !location.pathname.startsWith('/detail');
    }
    return location.pathname === path;
  };

  // Navigation items configuration
  const navItems = [
    {
      icon: <History className="w-6 h-6 text-gray-700 dark:text-gray-300" />,
      label: 'Trade History',
      onClick: () => navigate('/history'),
      className: isActive('/history')
        ? 'bg-emerald-100 dark:bg-emerald-900/50'
        : ''
    },
    {
      icon: <LayoutDashboard className="w-6 h-6 text-gray-700 dark:text-gray-300" />,
      label: 'Dashboard',
      onClick: () => navigate('/'),
      className: isActive('/')
        ? 'bg-emerald-100 dark:bg-emerald-900/50'
        : ''
    },
    {
      icon: <Plus className="w-6 h-6 text-gray-700 dark:text-gray-300" />,
      label: showTradeForm ? 'Hide Trade Form' : 'New Trade',
      onClick: onToggleTradeForm,
      className: showTradeForm
        ? 'bg-emerald-100 dark:bg-emerald-900/50'
        : ''
    },
    {
      icon: <Tag className="w-6 h-6 text-gray-700 dark:text-gray-300" />,
      label: 'Tags',
      onClick: () => navigate('/tags'),
      className: isActive('/tags')
        ? 'bg-emerald-100 dark:bg-emerald-900/50'
        : ''
    },
    {
      icon: <TrendingUpDown className="w-6 h-6 text-gray-700 dark:text-gray-300" />,
      label: 'Batch Comparison',
      onClick: () => navigate('/comparison'),
      className: isActive('/comparison')
        ? 'bg-emerald-100 dark:bg-emerald-900/50'
        : ''
    },
    {
      icon: isDark ? (
        <Sun className="w-6 h-6 text-gray-700 dark:text-gray-300" />
      ) : (
        <Moon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
      ),
      label: isDark ? 'Light Mode' : 'Dark Mode',
      onClick: toggleTheme,
      className: ''
    }
  ];

  // Responsive sizing for mobile devices
  const baseItemSize = isMobile ? 44 : 50;
  const magnification = isMobile ? 60 : 70;
  const panelHeight = isMobile ? 56 : 64;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center">
      <Dock
        items={navItems}
        className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 shadow-lg"
        spring={{ mass: 0.1, stiffness: 150, damping: 12 }}
        magnification={magnification}
        distance={200}
        panelHeight={panelHeight}
        dockHeight={256}
        baseItemSize={baseItemSize}
      />
    </div>
  );
};

export default BottomNavDock;

