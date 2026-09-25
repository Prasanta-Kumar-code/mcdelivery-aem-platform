# McDelivery Platform Project Vision

**Status:** Planning baseline  
**Audience:** Product, design, engineering, QA, security, and delivery teams  
**Primary deployment principle:** Local-first development with reproducible Docker Compose environments

## Product Vision

Build a fast, accessible, McDonald's-style digital ordering experience that lets customers discover menu items, customize a basket, select a store, and place and track an order with minimal friction. Content authors should be able to manage menu content, categories, offers, and campaign messaging in AEM without requiring frontend releases.

The platform is a portfolio-grade reference implementation: a headless AEM content layer, Next.js customer experience, Spring Boot domain services, PostgreSQL persistence, automated quality gates, and a fully reproducible local environment.

## Scope

- Browse products and categories from AEM GraphQL.
- Display product imagery, descriptions, prices, dietary metadata, and availability signals.
- Manage a client-side cart and synchronize it with a backend cart service.
- Select a store and validate fulfillment availability.
- Support guest checkout in MVP and authenticated checkout in a later release.
- Create, price, submit, and track orders.
- Manage offers and coupons with explicit eligibility and expiry rules.
- Provide responsive web, accessibility, observability, security, and test coverage.
- Run the complete stack locally without AWS, Azure, or third-party cloud dependencies.

## Non-Goals

- Reproducing McDonald's proprietary branding, production systems, menu data, or trademarks beyond a learning-inspired visual direction.
- Building a native iOS or Android application in the initial roadmap.
- Processing real payments before a payment provider and compliance review are approved.
- Implementing a full restaurant point-of-sale integration in MVP.
- Supporting multi-region tax, currency, and legal requirements in the first release.
- Operating a production cloud platform from this repository.

## Architecture Overview

AEM owns editorial content and exposes published Content Fragments through GraphQL. Next.js renders the customer experience and uses Zustand for responsive cart state. Spring Boot owns transactional workflows such as carts, stores, users, coupons, and orders. PostgreSQL stores domain data. Docker Compose provides the local system boundary; GitHub Actions validates changes and builds artifacts.

## Technology Stack

| Area | Technology | Responsibility |
|---|---|---|
| Web | Next.js 15, React 19, TypeScript | Server rendering, routing, UI, API clients |
| State | Zustand | Cart and session-adjacent client state |
| Styling | Tailwind CSS | Responsive design system and utility styling |
| CMS | AEM as a Cloud Service | Editorial models, assets, content governance |
| Content API | AEM GraphQL | Headless product, category, and offer delivery |
| Backend | Spring Boot, Java | Domain APIs and transactional orchestration |
| Persistence | PostgreSQL | Users, carts, orders, stores, coupons |
| Quality | JUnit, Mockito, Testcontainers, Cypress, Playwright | Automated verification |
| Delivery | GitHub, GitHub Actions, Docker, Docker Compose | Local-first CI/CD and artifact creation |

> Repository note: the current frontend package reports Next.js 16.3.3. Before implementation resumes, decide whether to pin the repository to the stated Next.js 15 baseline or update this plan and compatibility validation to Next.js 16.

## User Personas

### Hungry Customer
Wants to find a familiar meal quickly, understand the total cost, and complete an order on a phone.

### Returning Customer
Wants saved details, recent orders, favorite items, and reliable order status updates.

### Store Operator
Needs store hours, service modes, availability, and temporary closures represented accurately.

### Content Author
Needs to create and schedule products, categories, offers, imagery, and campaign content safely in AEM.

### Platform Engineer
Needs reproducible local environments, clear contracts, secure defaults, and observable service boundaries.

## User Stories

- As a customer, I can browse categories and see products without logging in.
- As a customer, I can filter products by category and dietary attributes.
- As a customer, I can add, remove, and change quantities in my cart.
- As a customer, I can see pricing, fees, discounts, and an order total before submitting.
- As a customer, I can select a nearby store and see whether ordering is available.
- As a customer, I can submit a guest order and receive a confirmation identifier.
- As a returning customer, I can sign in and view my order history.
- As a content author, I can publish a product update without a frontend deployment.
- As an operator, I can mark a store closed and prevent new orders there.
- As a developer, I can start the supported stack locally with documented commands.

## Success Metrics

- Product listing first meaningful render under 2.5 seconds on a representative local production build.
- Product and category API error rate below 1% during acceptance testing.
- Cart mutation success rate above 99% in integration tests.
- Checkout completion rate above 70% for valid test orders.
- Core customer journeys meet WCAG 2.2 AA checks.
- Main branch passes build, unit, lint, security, and regression gates.
- A new developer can run the documented local environment in under 30 minutes.
- No critical or high-severity unresolved security findings at release.

## MVP Definition

MVP includes published product and category content, responsive listing and filtering, a cart drawer, store selection, guest checkout, order creation, order confirmation, basic order status, local PostgreSQL persistence, AEM GraphQL integration, automated tests, and Docker Compose documentation. Payments, advanced personalization, push notifications, and production integrations remain simulated or deferred.

## Future Roadmap

1. **Post-MVP:** Authentication, saved addresses, order history, offers, and email confirmation.
2. **v1:** Store finder, location-aware availability, payment sandbox, richer order tracking, PWA installability.
3. **v2:** Recommendations, loyalty concepts, analytics, experimentation, and operational dashboards.
4. **v3:** POS integration, real-time fulfillment events, multi-region configuration, and production payment certification.
