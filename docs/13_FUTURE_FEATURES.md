# Future Features

## Store Finder

Provide searchable stores with hours, service modes, distance, temporary closures, and accessibility details. Start with seeded coordinates and backend filtering; add geospatial indexing and operational integrations only after the store contract is stable.

## Location Detection

Request browser location only after clear user intent. Explain permission use, provide manual search fallback, avoid storing precise coordinates unnecessarily, and apply a distance calculation policy that respects privacy and accuracy limits.

## Order Tracking

Expose a documented state machine such as `RECEIVED`, `CONFIRMED`, `PREPARING`, `READY`, `COMPLETED`, and `CANCELLED`. Begin with polling and move to server-sent events or WebSockets when operational events are reliable. Preserve last-known state and communicate delays clearly.

## Payment Gateway

Create a provider-neutral adapter with authorization, capture, cancellation, refund, webhook verification, and idempotency. Keep card data outside the application wherever possible through hosted fields or tokenization. Use sandbox credentials locally and complete PCI and legal review before live processing.

## Recommendation Engine

Start with transparent rules such as related category and frequently paired items. Add behavioral recommendations only with consent, explainable fallback behavior, offline-safe caching, and strict separation from price or eligibility decisions.

## Offers Engine

Combine AEM presentation content with backend eligibility, redemption limits, date windows, customer segments, and abuse controls. Provide preview, audit, rollback, and clear terms. A failed offer evaluation must not block valid checkout.

## Adobe Analytics

Define a versioned event taxonomy for menu views, category selection, add-to-cart, checkout steps, order success, and errors. Minimize PII, obtain consent where required, document data retention, and validate events in local debug mode before activation.

## Adobe Target

Use experiments only after baseline performance and accessibility are stable. Define audience, hypothesis, success metric, exposure limits, fallback content, and kill switch. Editorial content remains usable when Target is unavailable.

## Sequencing Principles

Prioritize features that improve ordering reliability before personalization. Each feature requires an owner, threat model, data classification, API contract, test plan, accessibility review, observability plan, and rollback path.
