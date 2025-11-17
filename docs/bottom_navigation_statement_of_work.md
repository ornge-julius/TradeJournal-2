# Statement of Work: Bottom Navigation Replacement

## Background
- The current navigation lives inside the hamburger menu rendered in `app/src/components/ui/Header.jsx` via a right-hand MUI `SwipeableDrawer`. The drawer lists links for Dashboard (`/`), Batch Comparison (`/comparison`), Tags (`/tags`), and Trade History (`/history`), alongside other controls such as account selection, trade/settings shortcuts, theme toggle, and authentication actions.
- There is no persistent bottom navigation; mobile users rely on the hamburger-triggered drawer for page switching. The request is to replace those drawer navigation links with a bottom navigation built with the **Dock** component from **reactbits** (example: https://www.reactbits.dev/components/dock).

## Objective
Deliver a responsive bottom navigation bar using `Dock` from reactbits that surfaces the primary page destinations and removes the redundant navigation list from the hamburger drawer while preserving the drawer for the remaining controls (accounts, trading/actions, appearance, authentication).

## Scope of Work
### In Scope
- Add reactbits as a dependency and import its `Dock` component for the new navigation UI.
- Build a reusable Bottom Dock component (e.g., `app/src/components/ui/BottomDockNav.jsx`) that:
  - Anchors to the bottom of the viewport with safe-area insets, supports light/dark themes, and is keyboard-accessible.
  - Defines the existing navigation set: Dashboard (`/`), Batch Comparison (`/comparison`), Tags (`/tags`), Trade History (`/history`).
  - Reflects active route state using `useLocation` (React Router) and triggers navigation via `Link`/`useNavigate`.
  - Shows recognizable icons (can reuse current Lucide icons) and compact labels suitable for small screens.
  - Handles long labels/tooltips gracefully and provides tap targets large enough for mobile use.
- Integrate the Bottom Dock at the app shell level (e.g., in `App.jsx` or a layout wrapper) so it appears across routed pages (excluding any routes explicitly opted out, such as full-screen modals if needed).
- Remove the navigation list from the hamburger drawer in `Header.jsx`, keeping other drawer sections intact (Accounts, Trading, Appearance, Authentication). Update spacing/labels if the navigation section is removed.
- Ensure the hamburger toggle remains available for non-navigation actions (account selection, theme, auth, etc.).
- Provide minimal styling to align with the app’s Tailwind aesthetic and dark mode support.

### Out of Scope / Assumptions
- No backend changes are required.
- The drawer still manages account selection, theme toggle, trade form toggles, and authentication controls; only the page navigation links move to the bottom dock.
- No redesign of icons or typography beyond what is needed to match existing styles.

## Implementation Plan (Developer Checklist)
1. **Dependency**: Install `reactbits` in the `app` package (`npm install reactbits`). Verify lockfile updates.
2. **Component**: Create `app/src/components/ui/BottomDockNav.jsx` that wraps `Dock`. Define nav items (path, label, icon, active flag) mirroring the existing `navItems` array from `Header.jsx`. Use `useLocation` to highlight the active item and `Link`/`useNavigate` to route on selection. Apply Tailwind classes and consider safe-area env variables for iOS.
3. **Theme Support**: Style the Dock background, active indicator, and icon colors for both light and dark themes, matching the palette used in `Header.jsx` (emerald/gray) and respecting translucency if desired.
4. **Layout Integration**: Mount the new component in the shared layout (bottom of `AppContent` render tree or a new layout wrapper) so it appears on all primary pages. Ensure it does not obstruct fixed elements (e.g., floating buttons) and that page padding accommodates its height.
5. **Drawer Update**: In `Header.jsx`, remove or gate the navigation section that currently renders `navItems`. Retain the rest of the drawer sections. Confirm the hamburger button still opens the drawer for account/auth/theme controls.
6. **Responsiveness**: Decide visibility rules (e.g., always on mobile, optionally hidden on large screens to avoid duplicate navigation). Implement breakpoint-based visibility with Tailwind utility classes if needed.
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
