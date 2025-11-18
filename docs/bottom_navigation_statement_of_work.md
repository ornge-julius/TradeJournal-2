# Statement of Work: Bottom Navigation Replacement

## Background
- The current navigation lives inside the hamburger menu rendered in `app/src/components/ui/Header.jsx` via a right-hand MUI `SwipeableDrawer`. The drawer lists links for Dashboard (`/`), Batch Comparison (`/comparison`), Tags (`/tags`), and Trade History (`/history`), alongside other controls such as account selection, trade/settings shortcuts, theme toggle, and authentication actions.
- There is no persistent bottom navigation; mobile users rely on the hamburger-triggered drawer for page switching. The request is to replace those drawer navigation links with a bottom navigation built with the **Dock** component from **reactbits** (example: https://www.reactbits.dev/components/dock).

## Objective
Deliver a responsive bottom navigation bar using `Dock` from reactbits that surfaces the primary page destinations and removes the redundant navigation list from the hamburger drawer while preserving the drawer for the remaining controls (accounts, trading/actions, appearance, authentication).

## Scope of Work
### In Scope
- Add `@appletosolutions/reactbits` as a dependency and import its `Dock` component for the new navigation UI. Install the Dock peer dependencies used by the package entrypoint (e.g., `framer-motion`, `matter-js`, `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `@react-three/rapier`, `meshline`, `ogl`, `gl-matrix`, `postprocessing`, `three-stdlib`, `@motionone/types`) so bundling succeeds.
- Build a reusable Bottom Dock component (`app/src/components/ui/BottomDockNav.jsx`) that:
  - Anchors to the bottom of the viewport with safe-area insets, supports light/dark themes, and is keyboard-accessible.
  - Defines the existing navigation set: Dashboard (`/`), Batch Comparison (`/comparison`), Tags (`/tags`), Trade History (`/history`).
  - Reflects active route state using `useLocation` (React Router) and triggers navigation via `useNavigate`.
  - Shows recognizable icons (reusing current Lucide icons) and compact labels suitable for small screens.
  - Handles long labels/tooltips gracefully, providing mobile-friendly tap targets and separating the Dock’s hover/press styling from the icon/label stack.
- Integrate the Bottom Dock at the app shell level (e.g., in `App.jsx` or a layout wrapper) so it appears across routed pages (excluding any routes explicitly opted out, such as full-screen modals if needed). Hide the Dock on medium+ breakpoints to avoid duplicating desktop navigation, and add bottom padding to the layout so content is not occluded by the fixed bar.
- Remove the navigation list from the hamburger drawer in `Header.jsx`, keeping other drawer sections intact (Accounts, Trading, Appearance, Authentication). Update spacing so Accounts is the first drawer section and all existing controls remain accessible via the hamburger trigger.
- Ensure the hamburger toggle remains available for non-navigation actions (account selection, theme, auth, etc.).
- Provide minimal styling to align with the app’s Tailwind aesthetic and dark mode support.

### Out of Scope / Assumptions
- No backend changes are required.
- The drawer still manages account selection, theme toggle, trade form toggles, and authentication controls; only the page navigation links move to the bottom dock.
- No redesign of icons or typography beyond what is needed to match existing styles.

## Implementation Plan (Developer Checklist)
1. **Dependency**: Install `@appletosolutions/reactbits` in the `app` package and add the required peer dependencies so `Dock` can be bundled without missing modules. If the bundler requires fully specified plugin paths, patch the package (e.g., with `patch-package`) to append `.js` extensions to GSAP subpath imports. Verify lockfile updates.
2. **Component**: Create `app/src/components/ui/BottomDockNav.jsx` that wraps `Dock`. Define nav items (path, label, icon, active flag) mirroring the existing destinations. Use `useLocation` to highlight the active item and `useNavigate` to route on selection. Apply Tailwind classes and consider safe-area env variables for iOS.
3. **Theme Support**: Style the Dock background, active indicator, and icon colors for both light and dark themes, matching the palette used in `Header.jsx` (emerald/gray) and respecting translucency if desired.
4. **Layout Integration**: Mount the new component in the shared layout (bottom of `AppContent` render tree or a new layout wrapper) so it appears on all primary pages. Ensure it does not obstruct fixed elements (e.g., floating buttons) and that page padding accommodates its height. Hide the Dock at `md` and above to prevent duplicate desktop navigation.
5. **Drawer Update**: In `Header.jsx`, remove or gate the navigation section that currently renders `navItems`. Retain the rest of the drawer sections so Accounts, Trading, Appearance, and Authentication remain accessible. Confirm the hamburger button still opens the drawer for non-navigation controls.
6. **Responsiveness**: Keep mobile-first sizing with clear focus states and hover/press feedback; verify safe-area padding on devices with display notches.
7. **Accessibility**: Add `aria-labels`, focus styles, and ensure keyboard navigation works within the Dock. Confirm color contrast for active/inactive states.
8. **Testing/Verification**:
   - Manual navigation between Dashboard, Batch Comparison, Tags, and Trade History via the new dock.
   - Drawer opens and still exposes account selection, trade form toggle, settings, theme toggle, and auth controls; navigation links are absent from the drawer.
   - Verify behavior on small screens/devtools mobile emulation and in both light/dark themes.
   - Check no console errors and that routing preserves existing logic (including trade detail pages).

## Deliverables
- `docs/bottom_navigation_statement_of_work.md` (this document).
- Implemented Bottom Dock navigation using reactbits with active routing and theming support.
- Updated `Header.jsx` drawer without navigation links and with intact non-navigation sections.

## Acceptance Criteria
- Bottom navigation renders across primary pages, uses reactbits `Dock`, and highlights the active route.
- Tapping/clicking dock items routes to the correct pages without page reloads.
- Hamburger drawer no longer lists Dashboard/Batch Comparison/Tags/Trade History links but still manages accounts, trading actions, appearance, and authentication.
- Light/dark themes render clearly; dock does not overlap content due to added bottom padding/margin.
- No regression in existing header/drawer interactions.
