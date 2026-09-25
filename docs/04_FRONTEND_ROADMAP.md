# Frontend Roadmap

## Delivery Standards

Each phase includes loading, empty, error, responsive, keyboard, screen-reader, analytics, and test considerations. Components must use typed domain contracts and must not embed privileged credentials. The current repository already has product listing, category navigation, AEM GraphQL integration, and a Zustand cart counter; phase acceptance should confirm and harden those capabilities before expanding them.

## Phase 1: Product Listing

### Objectives

- Establish the production-quality menu landing page.
- Render published product content from AEM GraphQL.
- Handle loading, empty, error, and image-failure states.

### Components

`Header`, `CategoryBar`, `ProductGrid`, `ProductCard`, responsive image wrapper, page shell, error boundary, and skeleton states.

### Acceptance Criteria

- Products render from a typed GraphQL response.
- Cards show title, price, image, category, and dietary metadata.
- The page is usable at mobile, tablet, and desktop widths.
- A failed AEM response shows an actionable retry state.
- No browser bundle contains AEM author credentials.
- Keyboard and screen-reader checks pass for navigation and cards.

## Phase 2: Category Filtering

### Objectives

- Connect category navigation to product filtering.
- Preserve selected category in URL state.
- Support direct links and refresh without losing the filter.

### Components

Category tabs or segmented navigation, filter state adapter, URL query parser, active state, no-results state, and filter analytics event.

### Acceptance Criteria

- Selecting a category updates visible products and URL state.
- Direct navigation to a valid category works.
- Invalid categories fall back safely.
- Filter state is keyboard accessible and visually clear.
- Product ordering remains deterministic.

## Phase 3: Hero Banner

### Objectives

- Add editorial campaign content without hardcoded campaign logic.
- Provide responsive imagery and accessible supporting copy.

### Components

Hero banner, responsive asset renderer, campaign CTA, content fallback, and analytics instrumentation.

### Acceptance Criteria

- Hero content is sourced from approved AEM content.
- Images have meaningful alternative text or are marked decorative.
- CTA destinations are validated and keyboard reachable.
- Layout does not shift when media loads.
- Mobile viewport keeps the next useful menu content discoverable.

## Phase 4: Cart Drawer

### Objectives

- Turn the cart counter into a complete, accessible cart workflow.
- Keep local interaction state responsive while preparing backend synchronization.

### Components

Cart drawer, line item, quantity stepper, remove action, subtotal summary, empty state, focus trap, cart trigger, and optimistic update boundary.

### Acceptance Criteria

- Add, increment, decrement, and remove operations work.
- Quantity controls have accessible names and stable dimensions.
- Drawer traps focus and closes with Escape.
- Cart totals update without stale values.
- Anonymous cart state survives a page refresh without storing sensitive data.

## Phase 5: Checkout

### Objectives

- Collect store, contact, fulfillment, and confirmation data.
- Integrate with backend order APIs using idempotent submission.

### Components

Checkout stepper, store selector, contact form, order summary, validation messages, submit state, confirmation page, and failure recovery.

### Acceptance Criteria

- Invalid fields are identified before submission.
- Backend validation is displayed without losing entered data.
- Double-submit cannot create duplicate orders.
- Total shown before submission matches backend response.
- Successful checkout produces a stable confirmation view.

## Phase 6: Authentication

### Objectives

- Add sign-in and account-aware flows without blocking guest ordering.
- Establish session and protected-route behavior.

### Components

Sign-in, registration or identity-provider redirect, session boundary, account menu, order history, and sign-out action.

### Acceptance Criteria

- Guest browsing and guest checkout remain available where intended.
- Protected data is unavailable after sign-out.
- Session expiry is handled without destructive data loss.
- Authentication errors are safe and non-revealing.
- Account journeys pass keyboard and mobile checks.

## Phase 7: Order Tracking

### Objectives

- Show order status and meaningful progress after placement.
- Prepare for polling or event-driven status updates.

### Components

Order status timeline, order detail, estimated time, refresh/polling hook, delayed-order state, and notification preference control.

### Acceptance Criteria

- Authorized users can view only their own orders.
- Status transitions are rendered in documented order.
- Stale data is labeled or refreshed predictably.
- Network failure preserves the last known safe state.
- Tracking works on mobile and with reduced motion enabled.

## Phase 8: PWA Support

### Objectives

- Provide installable, resilient web access for supported browsers.
- Cache only safe static and public content.

### Components

Web app manifest, service worker, offline shell, update prompt, install affordance, and cache policy.

### Acceptance Criteria

- Lighthouse PWA checks meet the agreed threshold.
- Checkout and authenticated data are never served from unsafe stale caches.
- Offline state is explicit and recoverable.
- New releases invalidate stale assets safely.
- Install and update flows work on supported mobile browsers.

## Phase Exit Checklist

Every phase requires a design review, accessibility review, unit tests, integration tests where API contracts change, responsive verification, error-state verification, documentation update, and a green CI run.
