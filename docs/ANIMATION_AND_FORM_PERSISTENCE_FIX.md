# Animation Control and Form Data Persistence Fix

## Problem Statement

The application currently has two critical user experience issues:

1. **Animation Replay Issue**: When users navigate away from the app window (e.g., switching browser tabs, minimizing the window, or switching applications) and return, animations play again unexpectedly. Animations should only play during specific, intentional moments: initial page load, date filter changes, or tag filter changes.

2. **Form Data Loss Issue**: When users are filling out forms and navigate away from the app window, returning causes all form data to be lost. This creates a frustrating experience where users must re-enter all their data. Form data should persist across window focus/blur events until the form is explicitly submitted, closed, or the user navigates to a different page.

## Current Behavior

### Animation Behavior

The `AnimatedContent` component (`app/src/components/ui/animation/AnimatedContent.jsx`) uses GSAP (GreenSock Animation Platform) with ScrollTrigger to animate content. The component's `useEffect` hook runs whenever its dependencies change, which includes:

- Component mount/unmount cycles
- Window focus/blur events (which can trigger React re-renders)
- Any changes to animation configuration props

**Current Implementation Issues:**
- The `useEffect` in `AnimatedContent` (lines 24-79) runs on every dependency change
- When the browser tab loses and regains focus, React may re-render components, causing the animation effect to re-run
- The `ScrollTrigger` with `once: true` (line 57) should prevent re-animation, but window focus events may reset the trigger state
- Components using `AnimatedContent` with `immediate={true}` (like `AvgWLCard` and `TagsManagementView`) will re-animate on every mount

**Components Using AnimatedContent:**
- `AvgWLCard` (`app/src/components/ui/cards/AvgWLCard.jsx`) - Uses `immediate={true}` with a key based on data values
- `TagsManagementView` (`app/src/components/views/TagsManagementView.jsx`) - Uses `immediate={true}` for tag cards
- Other components may use `AnimatedContent` with scroll-based triggers

### Form Data Behavior

All form components use local React state (`useState`) to manage form data:

- **TradeForm** (`app/src/components/forms/TradeForm.jsx`): Uses `formData` state (lines 17-30) that resets when `editingTrade` changes or component unmounts
- **SettingsForm** (`app/src/components/forms/SettingsForm.jsx`): Uses `balance` state (line 9) initialized from `currentBalance` prop
- **TagForm** (`app/src/components/forms/TagForm.jsx`): Uses `formData` state (lines 5-8) that resets when `editingTag` or `isOpen` changes
- **AccountEditForm** (`app/src/components/forms/AccountEditForm.jsx`): Uses `formData` state (lines 10-14) that resets when `account` prop changes
- **SignInForm** (`app/src/components/forms/SignInForm.jsx`): Uses `formData` state (lines 5-8) that resets on close

**Current Implementation Issues:**
- Form state is stored only in React component state
- When the browser tab loses focus and regains it, React may unmount and remount components, losing all form data
- No persistence mechanism exists to save form data to localStorage or sessionStorage
- Form data is only preserved while the component remains mounted and the user stays on the same page

## Requirements

### Animation Control Requirements

1. **Animation Trigger Conditions**
   - Animations MUST play when:
     - The page/route first loads (initial mount)
     - The date filter changes (detected via `DateFilterContext`)
     - The tag filter changes (detected via `TagFilterContext`)
   - Animations MUST NOT play when:
     - User navigates away from the app window and returns (window blur/focus events)
     - Component re-renders due to unrelated state changes
     - User scrolls back to previously animated content
     - Browser tab is switched away and back

2. **Implementation Approach**
   - Track animation state to prevent re-animation on window focus events
   - Use a combination of:
     - `sessionStorage` or a ref to track if animations have already played for the current session
     - Context or props to detect filter changes and trigger animations only when filters actually change
     - Window focus/blur event listeners to prevent animation re-triggering
   - Modify `AnimatedContent` component to accept a `shouldAnimate` prop or similar mechanism
   - Ensure ScrollTrigger's `once: true` behavior is respected and not reset by focus events

3. **Filter Change Detection**
   - Monitor `DateFilterContext` for filter changes
   - Monitor `TagFilterContext` for tag filter changes
   - Only trigger animations when filter values actually change (not on every context update)
   - Use refs or comparison logic to detect meaningful filter changes

### Form Data Persistence Requirements

1. **Persistence Scope**
   - Form data MUST persist when:
     - User switches browser tabs
     - User minimizes/maximizes the browser window
     - User switches to another application and returns
     - Browser tab loses and regains focus
   - Form data MUST be cleared when:
     - Form is successfully submitted
     - Form is explicitly closed (user clicks cancel/close button)
     - User navigates to a different page/route
     - Form switches from "create" to "edit" mode or vice versa (for forms that support both)

2. **Storage Mechanism**
   - Use `sessionStorage` (not `localStorage`) to persist form data
   - `sessionStorage` ensures data is cleared when the browser session ends
   - Store form data with unique keys per form type:
     - `tradeForm_data` for TradeForm
     - `settingsForm_data` for SettingsForm
     - `tagForm_data` for TagForm
     - `accountEditForm_data` for AccountEditForm
     - `signInForm_data` for SignInForm (optional - may want to clear on close for security)

3. **Implementation Approach**
   - Create a custom hook (e.g., `useFormPersistence`) that:
     - Saves form data to `sessionStorage` on every input change (debounced or immediate)
     - Restores form data from `sessionStorage` on component mount
     - Clears `sessionStorage` on form submit, close, or navigation
   - Integrate the hook into all form components
   - Handle edge cases:
     - Form data should not persist when switching between "create" and "edit" modes
     - Form data should be cleared when editing a different item (e.g., editing a different trade)
     - Ensure form validation state is also considered (don't restore invalid data if validation rules have changed)

4. **Form-Specific Considerations**

   **TradeForm:**
   - Persist all form fields including: symbol, position_type, entry_price, exit_price, quantity, entry_date, exit_date, notes, reasoning, result, option, source, and selectedTagIds
   - Clear persisted data when:
     - Form is submitted successfully
     - Form is closed/cancelled
     - `editingTrade` prop changes (switching to edit a different trade)
     - User navigates to a different route

   **SettingsForm:**
   - Persist the balance input value
   - Clear persisted data when:
     - Form is submitted successfully
     - Form is closed/cancelled
     - User navigates to a different route

   **TagForm:**
   - Persist name and color fields
   - Clear persisted data when:
     - Form is submitted successfully
     - Form is closed/cancelled
     - `editingTag` prop changes (switching to edit a different tag)
     - User navigates to a different route

   **AccountEditForm:**
   - Persist name, startingBalance, and currentBalance fields
   - Clear persisted data when:
     - Form is submitted successfully
     - Form is closed/cancelled
     - `account` prop changes (switching to edit a different account)
     - User navigates to a different route

   **SignInForm:**
   - Optionally persist email (not password for security)
   - Clear persisted data when:
     - Form is submitted successfully
     - Form is closed
     - User navigates to a different route

## Technical Implementation Details

### Animation Control Implementation

1. **Modify AnimatedContent Component**
   - Add a `shouldAnimate` prop that controls whether the animation should run
   - Add logic to check `sessionStorage` or a ref to determine if animation has already played
   - Add window focus/blur event listeners to prevent re-animation
   - Ensure ScrollTrigger state is preserved across focus events
   - Add a mechanism to reset animation state when filters change

2. **Create Animation Context or Hook**
   - Create a context or hook that tracks:
     - Whether animations have played for the current page/route
     - Current filter values (date and tag filters)
     - Previous filter values for comparison
   - Provide a function to reset animation state when filters change
   - Components using `AnimatedContent` should subscribe to filter changes and pass `shouldAnimate` accordingly

3. **Filter Change Detection**
   - In components that use `AnimatedContent`, use `useDateFilter()` and `useTagFilter()` hooks
   - Compare current filter values with previous values using `useRef` or `useMemo`
   - Only set `shouldAnimate={true}` when:
     - Component first mounts (initial load)
     - Date filter actually changes (value comparison)
     - Tag filter actually changes (value comparison)

### Form Persistence Implementation

1. **Create useFormPersistence Hook**
   ```javascript
   // Pseudo-code structure
   useFormPersistence(formKey, formData, options) {
     // Save to sessionStorage on formData changes
     // Restore from sessionStorage on mount
     // Clear on submit/close/navigation
   }
   ```

2. **Integration Points**
   - Modify each form component to:
     - Use the `useFormPersistence` hook
     - Save form data on every input change
     - Restore form data on mount (if form is open and no editing item is set)
     - Clear persisted data on submit, close, or navigation

3. **Navigation Detection**
   - Use React Router's `useLocation` hook to detect route changes
   - Clear all form persistence when route changes
   - Alternatively, clear form persistence when the form component unmounts due to navigation

4. **Edge Case Handling**
   - Handle rapid tab switching (debounce save operations if needed)
   - Handle browser back/forward navigation
   - Handle form state when multiple forms could be open (though current implementation seems to show one form at a time)
   - Ensure form data doesn't persist across browser sessions (use sessionStorage, not localStorage)

## Testing Considerations

### Animation Testing
- Test that animations play on initial page load
- Test that animations play when date filter changes
- Test that animations play when tag filter changes
- Test that animations do NOT play when:
  - Switching browser tabs and returning
  - Minimizing and restoring the window
  - Switching applications and returning
  - Scrolling back to previously animated content
  - Component re-renders due to unrelated state changes

### Form Persistence Testing
- Test that form data persists when:
  - Switching browser tabs and returning
  - Minimizing and restoring the window
  - Switching applications and returning
- Test that form data is cleared when:
  - Form is submitted successfully
  - Form is closed/cancelled
  - User navigates to a different route
  - Form switches between create/edit modes
  - Editing a different item (different trade, tag, account)
- Test edge cases:
  - Multiple forms (ensure data doesn't mix)
  - Browser back/forward navigation
  - Rapid tab switching
  - Form validation with persisted data
  - Form data persistence across component remounts

## Files to Modify

### Animation Control
- `app/src/components/ui/animation/AnimatedContent.jsx` - Core animation component
- `app/src/components/ui/cards/AvgWLCard.jsx` - Uses AnimatedContent
- `app/src/components/views/TagsManagementView.jsx` - Uses AnimatedContent
- Any other components using `AnimatedContent`
- Potentially create: `app/src/hooks/useAnimationControl.js` or `app/src/context/AnimationContext.jsx`

### Form Persistence
- `app/src/components/forms/TradeForm.jsx`
- `app/src/components/forms/SettingsForm.jsx`
- `app/src/components/forms/TagForm.jsx`
- `app/src/components/forms/AccountEditForm.jsx`
- `app/src/components/forms/SignInForm.jsx` (optional)
- Create: `app/src/hooks/useFormPersistence.js`

## Success Criteria

1. ✅ Animations only play on initial page load and when filters change
2. ✅ Animations do not play when user navigates away and returns to the app window
3. ✅ Form data persists when user navigates away from the app window and returns
4. ✅ Form data is cleared appropriately (on submit, close, or navigation)
5. ✅ No performance degradation from persistence mechanisms
6. ✅ No data leakage between different forms or form instances
7. ✅ All existing functionality remains intact

## Additional Notes

- Consider using `sessionStorage` instead of `localStorage` for both animations and forms to ensure data is cleared when the browser session ends
- The implementation should be backward compatible - if `sessionStorage` is unavailable or disabled, the app should still function (just without persistence)
- Consider adding user preferences in the future to allow users to disable form persistence if desired
- Animation control should work seamlessly with existing ScrollTrigger configurations
- Form persistence should not interfere with form validation or error states

