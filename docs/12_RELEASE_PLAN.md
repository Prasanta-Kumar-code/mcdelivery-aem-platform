# Release Plan

## Versioning Strategy

Use semantic versioning for the application contract: `MAJOR.MINOR.PATCH`. Major versions may remove or break public APIs. Minor versions add backward-compatible capabilities. Patch versions fix defects and security issues. Tag releases from protected main after all gates pass.

Maintain separate versions for frontend, backend API, AEM content/package, and database migration compatibility when independent release cadence is required. Publish a repository release summary that maps those versions to one tested compatibility set.

## MVP

**Purpose:** Prove the complete local ordering journey.

**Scope:** AEM products/categories, Next.js listing and filtering, cart drawer, store selection, guest checkout, Spring Boot order creation, PostgreSQL persistence, local Docker Compose, automated quality gates, and basic order confirmation.

**Release criteria:**

- Menu content is published and GraphQL queries are contract-tested.
- Cart and order totals are calculated authoritatively by backend services.
- Checkout is idempotent and duplicate submissions are covered by tests.
- Critical customer journeys pass UI smoke tests.
- Accessibility issues blocking WCAG 2.2 AA are resolved.
- No unresolved critical or high security findings.
- A new developer can start the documented local environment.

## v1

**Scope:** Authentication, order history, coupon validation, email confirmation, store finder, stronger observability, PWA baseline, and payment sandbox integration.

**Release criteria:** Protected resources enforce ownership; account deletion and consent flows are documented; notifications retry safely; payment is isolated behind an adapter; migration and restore drills pass; performance budgets are met.

## v2

**Scope:** Location-aware discovery, richer order tracking, recommendations, offers engine, analytics, experimentation, and operational support views.

**Release criteria:** Personalization has consent and fallback behavior; analytics events are documented; recommendation failures do not block ordering; experiments have audience and rollback controls; operational access is audited.

## v3

**Scope:** Production payment certification, POS/fulfillment integration, real-time status events, multi-region configuration, advanced loyalty, and broader localization.

**Release criteria:** External contracts are certified; reconciliation and replay procedures exist; disaster recovery targets are tested; legal, privacy, accessibility, and operational readiness reviews are signed off.

## Standard Release Process

1. Freeze scope and confirm acceptance criteria.
2. Update version metadata, migrations, API contracts, and documentation.
3. Run the full CI and release candidate build.
4. Deploy to the local release environment and run smoke/regression suites.
5. Review security, accessibility, performance, and known issues.
6. Tag the release and publish artifacts, SBOM, reports, and release notes.
7. Record rollback or forward-fix procedure.
8. Monitor post-release health checks and close release actions.
