# Progress Tracker

**Last reviewed:** 2026-10-19  
**Tracking rule:** Update this document when a task changes state and link the evidence in the relevant pull request, test report, or decision record.

## Current Status

The repository has an AEM-first storefront: commerce Content Fragments (products, categories, offers, stores) plus page-level authoring fragments (site settings, hero, page sections, navigation links, feature flags). Every displayed string, section order and feature switch is authored in AEM and read over GraphQL; the Next.js app keeps only a seed fallback. The planning baseline is documented. The platform is not yet MVP-complete: transactional backend services, PostgreSQL persistence, checkout, automated cross-stack CI, authentication, and release hardening remain.

## Completed

- [x] Product Content Fragment Model exists.
- [x] Category Content Fragment Model exists.
- [x] Product Content Fragments exist.
- [x] Category Content Fragments exist.
- [x] AEM GraphQL endpoint exists.
- [x] Next.js GraphQL integration exists.
- [x] Product grid exists.
- [x] Category navigation exists.
- [x] Zustand cart counter exists.
- [x] AEM-authored site settings, hero, page sections and navigation links exist.
- [x] AEM feature flags control hero, deals, menu, filters, stores, cart, account, badges and social links.
- [x] Storefront page order and section visibility authored in AEM.
- [x] Frontend content boundary extracted to a shared server-side AEM client with per-stream seed fallback.
- [x] AEM handoff and authoring guide documented (`16_AEM_HANDOFF.md`, `17_AEM_AUTHORING_GUIDE.md`).
- [x] Project vision documented.
- [x] System architecture documented.
- [x] AEM content model roadmap documented.
- [x] Frontend roadmap documented.
- [x] Backend roadmap documented.
- [x] Database design documented.
- [x] GraphQL design documented.
- [x] Local-first CI/CD strategy documented.
- [x] GitHub Actions plans documented.
- [x] Security plan documented.
- [x] Testing plan documented.
- [x] Release plan documented.
- [x] Future feature plan documented.
- [x] Master execution checklist created.

## In Progress

- [ ] Decide Next.js 15 versus repository package version 16.3.3.
- [ ] Create the local Docker Compose development environment.
- [ ] Define Spring Boot module and service boundaries.
- [ ] Define PostgreSQL migrations and seed data.
- [ ] Add a drift guard between bundled seed content and live AEM fragments.
- [ ] Add GraphQL contract tests.
- [ ] Add frontend typecheck and focused unit-test coverage.
- [ ] Add backend API contract and integration-test foundation.

## Blocked

- [ ] Payment integration is blocked on provider selection and compliance requirements.
- [ ] Production authentication is blocked on identity-provider selection.
- [ ] Real-time order tracking is blocked on fulfillment event availability.
- [ ] Adobe Analytics and Adobe Target are blocked on consent, taxonomy, and account configuration.
- [ ] Production AEM Cloud Manager deployment is outside the local-first application release path and requires Adobe project access.

## Upcoming

1. Resolve the version and credential-boundary decisions.
2. Build the local development topology and seed data.
3. Implement backend foundation and cart APIs.
4. Complete cart drawer and checkout UI.
5. Add order creation, confirmation, and basic tracking.
6. Add automated CI workflows and security gates.
7. Run the MVP release rehearsal.

## KPIs

| KPI | Baseline | MVP target | Measurement |
|---|---:|---:|---|
| Product listing render | To measure | < 2.5 s local production build | Lighthouse / browser trace |
| GraphQL error rate | To measure | < 1% acceptance run | Contract-test report |
| Cart mutation success | To measure | > 99% | Backend integration metrics |
| Checkout completion | To measure | > 70% valid test journeys | UI test report |
| WCAG 2.2 AA blockers | To measure | 0 release blockers | axe + manual review |
| Critical/high security findings | To measure | 0 unresolved | CI security reports |
| Clean setup time | To measure | < 30 minutes | Setup rehearsal |
| Main branch CI pass rate | To measure | > 95% | GitHub Actions history |

## Status Definitions

- **Completed:** Evidence exists and acceptance criteria pass.
- **In Progress:** Work has an owner and an active implementation or review.
- **Blocked:** Progress requires an external decision, credential, integration, or dependency.
- **Upcoming:** Sequenced work with no active implementation yet.
