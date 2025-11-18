# Bottom Navigation Dock Implementation

## Problem Statement

Add a bottom navigation bar to the Trade Journal app using a custom Dock component. The dock component code will be copied from ReactBits (https://www.reactbits.dev/components/dock) and customized to fit the application's theme. The dock should provide quick access to the main navigation pages (Trade History, Dashboard, Tags, and Batch Comparison) and include a theme toggle button for switching between light and dark modes. The dock should be fixed at the bottom of the screen and provide smooth navigation between pages.

## Requirements

### 1. Copy and Customize Dock Component
- Copy the Dock component code from ReactBits into the codebase
- Create a new component file: `app/src/components/ui/Dock.jsx`
- Customize the Dock component styling to match the app's theme:
  - Replace hardcoded colors (e.g., `bg-[#060010]`, `border-neutral-700`) with theme-aware Tailwind classes
  - Update background colors to support light/dark mode
  - Update border colors to match the app's design system
  - Update text colors for proper contrast in both themes
  - Ensure the dock container styling matches the app's aesthetic
- Ensure compatibility with React 18.2.0 and framer-motion (motion/react)

### 2. Create Bottom Navigation Component
- Create a new component: `app/src/components/ui/BottomNavDock.jsx`
- The component should:
  - Import and use the customized Dock component
  - Accept navigation handlers and theme toggle function as props
  - Display navigation items with appropriate icons from `lucide-react`
  - Include a theme toggle button that switches between light and dark modes
  - Be positioned fixed at the bottom of the viewport
  - Have proper styling that matches the app's design system (dark mode support)

### 3. Navigation Items Configuration
The dock should include the following navigation items:
- **Trade History**: Navigate to `/history` route
  - Icon: `History` from lucide-react
  - Should highlight when on the trade history page
- **Dashboard**: Navigate to `/` (root) route
  - Icon: `LayoutDashboard` from lucide-react
  - Should highlight when on the dashboard page
- **Tags**: Navigate to `/tags` route
  - Icon: `Tag` from lucide-react
  - Should highlight when on the tags page
- **Batch Comparison**: Navigate to `/comparison` route
  - Icon: `TrendingUpDown` from lucide-react
  - Should highlight when on the batch comparison page
- **Theme Toggle**: Toggle between light and dark mode
  - Icon: `Sun` for light mode, `Moon` for dark mode (from lucide-react)
  - Should reflect the current theme state

### 4. Active State Management
- Use `useLocation` hook from `react-router-dom` to determine the current route
- Highlight the active navigation item based on the current pathname
- The active state should be visually distinct (e.g., different background color, scale, or border)
- Handle edge cases:
  - Root path `/` should activate Dashboard
  - `/detail/:tradeId` should not activate any dock item (detail pages are separate)

### 5. Navigation Integration
- Use `useNavigate` hook from `react-router-dom` for programmatic navigation
- Each navigation item should navigate to its respective route when clicked
- Navigation should work seamlessly with the existing routing structure
- Ensure navigation doesn't interfere with the existing Header navigation

### 6. Theme Toggle Integration
- Import and use the `useTheme` hook from `ThemeContext`
- The theme toggle button should call `toggleTheme` function
- The icon should dynamically change based on `isDark` state:
  - Show `Sun` icon when in dark mode (indicating clicking will switch to light)
  - Show `Moon` icon when in light mode (indicating clicking will switch to dark)
- The toggle should persist the theme preference (handled by ThemeContext)

### 7. Layout and Positioning
- The dock should be fixed at the bottom of the viewport
- Use appropriate z-index to ensure it appears above other content
- Add bottom padding to the main content area to prevent content from being hidden behind the dock
- The dock should be responsive and work on mobile, tablet, and desktop screens
- Consider safe area insets for mobile devices (especially iOS with notch/home indicator)

### 8. Styling and Theming
- Style the dock to match the app's existing design system
- Support both light and dark themes using Tailwind CSS classes
- Use backdrop blur and semi-transparent background for a modern look
- Ensure proper contrast and accessibility
- Add smooth transitions and hover effects
- Style active items distinctly from inactive items
- The dock should have a subtle border or shadow to separate it from content

### 9. Integration with App Layout
- Add the BottomNavDock component to `App.jsx` or `MainLayout`
- Ensure it's rendered within the `ThemeProvider` context
- Ensure it's rendered within the `BrowserRouter` context
- The dock should be visible on all main pages (dashboard, history, tags, comparison)
- The dock should NOT be visible on detail pages (`/detail/:tradeId`)

## Technical Implementation Details

### Component Structure

```
BottomNavDock
├── Dock Component (customized, copied from ReactBits)
│   ├── DockItem (sub-component)
│   ├── DockLabel (sub-component)
│   ├── DockIcon (sub-component)
│   └── Main Dock Component
├── Navigation Items Array
│   ├── Trade History Item
│   ├── Dashboard Item
│   ├── Tags Item
│   ├── Batch Comparison Item
│   └── Theme Toggle Item
└── Active State Logic
```

### Key Imports Required

**For Dock.jsx:**
- `motion, useMotionValue, useSpring, useTransform, AnimatePresence` from 'motion/react'
- `Children, cloneElement, useEffect, useMemo, useRef, useState` from 'react'

**For BottomNavDock.jsx:**
- `React` from 'react'
- `useLocation, useNavigate` from 'react-router-dom'
- `Dock` from './Dock' (local component)
- `History, LayoutDashboard, Tag, TrendingUpDown, Sun, Moon` from 'lucide-react'
- `useTheme` from '../../context/ThemeContext'

### Navigation Items Array Structure

```jsx
const location = useLocation();
const navigate = useNavigate();
const { toggleTheme, isDark } = useTheme();

const navItems = [
  {
    label: 'Trade History',
    icon: History,
    path: '/history',
    isActive: location.pathname === '/history',
    onClick: () => navigate('/history')
  },
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/',
    isActive: location.pathname === '/' && !location.pathname.startsWith('/detail'),
    onClick: () => navigate('/')
  },
  {
    label: 'Tags',
    icon: Tag,
    path: '/tags',
    isActive: location.pathname === '/tags',
    onClick: () => navigate('/tags')
  },
  {
    label: 'Batch Comparison',
    icon: TrendingUpDown,
    path: '/comparison',
    isActive: location.pathname === '/comparison',
    onClick: () => navigate('/comparison')
  },
  {
    label: isDark ? 'Light Mode' : 'Dark Mode',
    icon: isDark ? Sun : Moon,
    isActive: false,
    onClick: toggleTheme
  }
];
```

### Dock Component Source Code

The Dock component code should be copied from ReactBits and placed in `app/src/components/ui/Dock.jsx`. The complete source code is provided below. The source code includes:
- `DockItem`: Handles individual dock item animations and hover states
- `DockLabel`: Displays tooltip labels on hover
- `DockIcon`: Wrapper for dock item icons
- `Dock`: Main component that orchestrates the dock behavior

**Source Code to Copy:**

```jsx
'use client';

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react';
import { Children, cloneElement, useEffect, useMemo, useRef, useState } from 'react';

function DockItem({ children, className = '', onClick, mouseX, spring, distance, magnification, baseItemSize }) {
  const ref = useRef(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, val => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseItemSize
    };
    return val - rect.x - baseItemSize / 2;
  });

  const targetSize = useTransform(mouseDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize]);
  const size = useSpring(targetSize, spring);

  return (
    <motion.div
      ref={ref}
      style={{
        width: size,
        height: size
      }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center rounded-full bg-[#060010] border-neutral-700 border-2 shadow-md ${className}`}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
    >
      {Children.map(children, child => cloneElement(child, { isHovered }))}
    </motion.div>
  );
}

function DockLabel({ children, className = '', ...rest }) {
  const { isHovered } = rest;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = isHovered.on('change', latest => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`${className} absolute -top-6 left-1/2 w-fit whitespace-pre rounded-md border border-neutral-700 bg-[#060010] px-2 py-0.5 text-xs text-white`}
          role="tooltip"
          style={{ x: '-50%' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DockIcon({ children, className = '' }) {
  return <div className={`flex items-center justify-center ${className}`}>{children}</div>;
}

export default function Dock({
  items,
  className = '',
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 70,
  distance = 200,
  panelHeight = 64,
  dockHeight = 256,
  baseItemSize = 50
}) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  const maxHeight = useMemo(
    () => Math.max(dockHeight, magnification + magnification / 2 + 4),
    [magnification, dockHeight]
  );
  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, spring);

  return (
    <motion.div style={{ height, scrollbarWidth: 'none' }} className="mx-2 flex max-w-full items-center">
      <motion.div
        onMouseMove={({ pageX }) => {
          isHovered.set(1);
          mouseX.set(pageX);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseX.set(Infinity);
        }}
        className={`${className} absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-end w-fit gap-4 rounded-2xl border-neutral-700 border-2 pb-2 px-4`}
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label="Application dock"
      >
        {items.map((item, index) => (
          <DockItem
            key={index}
            onClick={item.onClick}
            className={item.className}
            mouseX={mouseX}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
          >
            <DockIcon>{item.icon}</DockIcon>
            <DockLabel>{item.label}</DockLabel>
          </DockItem>
        ))}
      </motion.div>
    </motion.div>
  );
}
```

**Key Customizations Needed:**
1. Remove `'use client'` directive (not needed in React)
2. Replace `bg-[#060010]` with theme-aware classes: `bg-white dark:bg-gray-900` (in DockItem)
3. Replace `border-neutral-700` with theme-aware classes: `border-gray-200 dark:border-gray-800`
4. Update DockLabel colors: `bg-[#060010] border-neutral-700 text-white` → `bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white`
5. Update the dock container positioning to be fixed at bottom (handled in BottomNavDock wrapper)
6. Add backdrop blur for modern glass effect (add to className prop)

### Dock Component Usage Pattern

```jsx
<Dock
  items={navItems}
  className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800"
  spring={{ mass: 0.1, stiffness: 150, damping: 12 }}
  magnification={70}
  distance={200}
  panelHeight={64}
  dockHeight={256}
  baseItemSize={50}
/>
```

### Active State Detection

```jsx
const getActiveState = (path) => {
  if (path === '/') {
    return location.pathname === '/' && !location.pathname.startsWith('/detail');
  }
  return location.pathname === path;
};
```

### Content Padding Adjustment

To prevent content from being hidden behind the dock, add bottom padding to the main content container:

```jsx
// In App.jsx or MainLayout
<div className="min-h-screen pb-20"> {/* Add pb-20 or appropriate padding */}
  {/* Main content */}
</div>
```

## Files to Create/Modify

1. **app/src/components/ui/Dock.jsx** (NEW FILE)
   - Copy the Dock component source code from ReactBits
   - Customize styling to match the app's theme:
     - Replace hardcoded background colors with theme-aware Tailwind classes
     - Update border colors for light/dark mode support
     - Update text colors for proper contrast
     - Adjust positioning and container styling
   - Ensure all sub-components (DockItem, DockLabel, DockIcon) are included

2. **app/src/components/ui/BottomNavDock.jsx** (NEW FILE)
   - Create the bottom navigation dock component
   - Import the customized Dock component
   - Implement navigation items with icons
   - Integrate theme toggle functionality
   - Handle active state based on current route
   - Wrap Dock component with fixed positioning container

3. **app/src/App.jsx**
   - Import `BottomNavDock` component
   - Add `<BottomNavDock />` to the `MainLayout` component
   - Ensure it's only rendered for main routes (not detail pages)
   - Add bottom padding to main content area to accommodate the dock

4. **app/src/index.css** (if needed)
   - Add any custom styles for the dock if needed
   - Ensure proper z-index layering

## Dependencies

### New Dependencies Required
- `motion` (framer-motion): Required for the Dock component animations
  - Install with: `npm install motion` or `npm install framer-motion`
  - Note: The Dock component uses `motion/react` import, which is the new framer-motion API

### Existing Dependencies Used
- `react-router-dom`: For navigation and location detection
- `lucide-react`: For navigation and theme icons
- `tailwindcss`: For styling (already configured)

## Dock Component Customization Details

### Required Style Customizations

The original Dock component uses hardcoded dark theme colors. These must be replaced with theme-aware Tailwind classes:

1. **DockItem Component:**
   - Replace: `bg-[#060010] border-neutral-700`
   - With: `bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800`
   - Add active state styling: `bg-emerald-100 dark:bg-emerald-900/50` when item is active

2. **DockLabel Component:**
   - Replace: `bg-[#060010] border-neutral-700 text-white`
   - With: `bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white`

3. **Dock Container:**
   - Replace: `border-neutral-700`
   - With: `border-gray-200 dark:border-gray-800`
   - Add: `backdrop-blur-lg` for glass effect
   - Update positioning to be fixed at bottom of viewport

4. **Container Wrapper:**
   - Wrap the Dock component in a fixed positioned div
   - Add z-index for proper layering
   - Ensure full width at bottom of screen

## Styling Considerations

### Light Mode
- Background: `bg-white/95` with backdrop blur
- Border: `border-gray-200`
- Active item: Distinct background color (e.g., `bg-blue-100` or `bg-emerald-100`)
- Text: `text-gray-900` for active, `text-gray-600` for inactive

### Dark Mode
- Background: `dark:bg-gray-900/95` with backdrop blur
- Border: `dark:border-gray-800`
- Active item: Distinct background color (e.g., `dark:bg-blue-900` or `dark:bg-emerald-900`)
- Text: `dark:text-white` for active, `dark:text-gray-400` for inactive

### Responsive Design
- Ensure dock items are appropriately sized for touch targets on mobile (minimum 44x44px)
- Consider reducing number of visible items on very small screens if needed
- Ensure icons and labels are readable at all screen sizes

## Testing Considerations

1. **Navigation Testing**
   - Verify clicking each navigation item navigates to the correct route
   - Verify active state highlights the correct item based on current route
   - Verify navigation works from all pages (dashboard, history, tags, comparison)
   - Verify navigation doesn't break when coming from detail pages

2. **Theme Toggle Testing**
   - Verify clicking theme toggle switches between light and dark modes
   - Verify icon changes correctly (Sun/Moon) based on current theme
   - Verify theme preference persists after page refresh
   - Verify dock styling adapts correctly to theme changes

3. **Layout Testing**
   - Verify dock is fixed at bottom and doesn't scroll with content
   - Verify content is not hidden behind the dock (proper padding)
   - Verify dock appears on all main pages
   - Verify dock does NOT appear on detail pages (`/detail/:tradeId`)

4. **Responsive Testing**
   - Verify dock works correctly on mobile devices (iOS and Android)
   - Verify dock works correctly on tablets
   - Verify dock works correctly on desktop
   - Verify touch targets are appropriately sized
   - Verify safe area insets are respected on devices with notches

5. **Visual Testing**
   - Verify active state is visually distinct
   - Verify hover states work correctly
   - Verify transitions are smooth
   - Verify backdrop blur effect works
   - Verify contrast meets accessibility standards

6. **Edge Cases**
   - Verify behavior when navigating directly via URL
   - Verify behavior when using browser back/forward buttons
   - Verify behavior when theme is toggled while on different pages
   - Verify dock doesn't interfere with existing Header navigation
   - Verify dock doesn't block important UI elements (modals, dropdowns, etc.)

## Edge Cases

1. **Direct URL Access**: When a user directly accesses a URL (e.g., `/tags`), the dock should correctly highlight the active item.

2. **Browser Navigation**: When using browser back/forward buttons, the active state should update correctly.

3. **Theme Persistence**: The theme toggle should work correctly even if the user navigates between pages while toggling.

4. **Mobile Safe Areas**: On devices with notches or home indicators, ensure the dock respects safe area insets and doesn't overlap with system UI.

5. **Z-Index Conflicts**: Ensure the dock's z-index doesn't conflict with modals, dropdowns, or other overlay components. The dock should typically be below modals but above regular content.

6. **Content Overflow**: Ensure long content pages don't get cut off by the dock. The bottom padding should be sufficient.

7. **Dock Component Customization**: Since we're copying the Dock component code, we have full control over its implementation. Ensure all customizations maintain the original animation behavior while adapting the styling to match the app's theme.

## Related Components

- `Header.jsx`: Existing header component with navigation menu (dock complements this)
- `ThemeContext.jsx`: Provides theme state and toggle functionality
- `App.jsx`: Main app component where routing and layout are configured
- `MainLayout`: Layout component that wraps main routes

## Implementation Notes

1. **Dock Component Source:**
   - Copy the complete Dock component code provided in the requirements
   - Place it in `app/src/components/ui/Dock.jsx`
   - Convert from TypeScript to JavaScript if needed (remove type annotations)
   - Update all hardcoded colors to use theme-aware Tailwind classes

2. **Customization Approach:**
   - The Dock component uses framer-motion (motion/react) for animations
   - Customize styling by replacing hardcoded color values with Tailwind classes
   - Use conditional classes for active states based on route
   - Ensure all sub-components (DockItem, DockLabel, DockIcon) are properly styled

3. **Active State Implementation:**
   - The Dock component doesn't have built-in active state support
   - Implement active state by:
     - Passing `className` prop to each dock item with active styling
     - Using conditional classes based on current route
     - Applying distinct background colors for active items

4. **Theme Integration:**
   - All color values must support both light and dark themes
   - Use Tailwind's `dark:` prefix for dark mode styles
   - Test theme switching to ensure all elements update correctly

5. **The dock should enhance the user experience without conflicting with the existing Header navigation. Both can coexist, with the dock providing quick access to main pages.**

4. Consider accessibility:
   - Ensure proper ARIA labels for navigation items
   - Ensure keyboard navigation works (if applicable)
   - Ensure screen reader compatibility
   - Ensure sufficient color contrast

5. Performance considerations:
   - The dock should not cause unnecessary re-renders
   - Use React.memo if needed to optimize performance
   - Ensure smooth animations and transitions

