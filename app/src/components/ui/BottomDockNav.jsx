import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Dock } from '@appletosolutions/reactbits';
import {
  LayoutDashboard,
  TrendingUpDown,
  Tag,
  History
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Batch Comparison', path: '/comparison', icon: TrendingUpDown },
  { label: 'Tags', path: '/tags', icon: Tag },
  { label: 'Trade History', path: '/history', icon: History }
];

const BottomDockNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const activePath = useMemo(() => {
    if (location.pathname.startsWith('/detail')) {
      return '/';
    }
    const matchingPath = NAV_ITEMS.find(
      (item) => item.path !== '/' && location.pathname.startsWith(item.path)
    );

    return matchingPath?.path || '/';
  }, [location.pathname]);

  const dockItems = NAV_ITEMS.map((item) => {
    const Icon = item.icon;
    const isActive = activePath === item.path;

    return {
      label: item.label,
      onClick: () => navigate(item.path),
      className: `group flex flex-col items-center gap-1 rounded-2xl px-3 py-2 text-xs font-medium transition-colors ${
        isActive
          ? 'bg-emerald-50 text-emerald-600 shadow-inner ring-1 ring-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-100 dark:ring-emerald-400/40'
          : 'text-gray-600 hover:text-emerald-600 dark:text-gray-200/70 dark:hover:text-emerald-200'
      }`,
      icon: (
        <>
          <Icon className="h-5 w-5" aria-hidden />
          <span className="leading-tight text-[11px]">{item.label}</span>
        </>
      )
    };
  });

  return (
    <div
      role="navigation"
      aria-label="Primary"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center pb-[max(env(safe-area-inset-bottom),1rem)] md:hidden"
    >
      <div className="pointer-events-auto w-full max-w-3xl px-4 pb-3">
        <Dock
          items={dockItems}
          className="w-full justify-between gap-2 rounded-3xl border border-gray-200/80 bg-white/90 p-2 shadow-2xl backdrop-blur-xl dark:border-gray-700/80 dark:bg-gray-900/85"
          distance={60}
          panelHeight={78}
          dockHeight={82}
          baseItemSize={60}
          magnification={1.08}
          spring={{ stiffness: 260, damping: 24 }}
        />
      </div>
    </div>
  );
};

export default BottomDockNav;
