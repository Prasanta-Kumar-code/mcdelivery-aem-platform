# Testing Plan

## Testing Strategy

Use a risk-based pyramid: fast unit tests for business rules, integration tests for persistence and service boundaries, contract tests for AEM GraphQL and REST, and a small number of reliable end-to-end journeys. Every defect adds a regression test at the lowest useful level.

## Unit Testing

**Scope:** React components, Zustand stores, GraphQL mappers, Spring services, validators, pricing, coupon rules, status transitions, and AEM models/services.

**Recommended tools:** Vitest or Jest, React Testing Library, JUnit 5, Mockito, AssertJ, and AEM Mocks/Sling Mocks.

**Exit criteria:** Deterministic tests, no network dependency, meaningful boundary cases, and coverage thresholds agreed by module rather than a single vanity percentage.

## Integration Testing

**Scope:** Spring repositories, migrations, transaction boundaries, REST controllers, AEM package behavior, and frontend-to-backend client contracts.

**Recommended tools:** Testcontainers PostgreSQL, Spring Boot test slices, WireMock, Maven Failsafe, and local AEM SDK.

**Exit criteria:** Tests run from an empty database, verify upgrade migrations, and cover failure behavior and idempotency.

## GraphQL Testing

- Validate query shape against the AEM schema.
- Test published, unpublished, missing, malformed, and empty content.
- Verify pagination, locale, category filters, image references, and rich-text handling.
- Test timeout, partial data, and GraphQL error responses.
- Add compatibility checks when Content Fragment Models change.

**Recommended tools:** GraphQL fixtures, schema introspection in controlled environments, WireMock, and contract snapshots.

## AEM Testing

- Unit test Sling Models, services, filters, listeners, and schedulers.
- Run Maven analyzer and package validation.
- Deploy packages to a local AEM SDK for smoke testing.
- Verify Content Fragment Models, required fields, references, publishing paths, and persisted queries.
- Use existing integration and Cypress module conventions in `mcd-aem`.

**Recommended tools:** JUnit 5, AEM Mocks, Sling Mocks, AEM Testing Clients, Maven, and Cypress.

## UI Testing

- Test product listing, filtering, hero content, cart drawer, checkout, auth, and order tracking.
- Verify keyboard navigation, focus management, responsive layouts, reduced motion, and screen-reader names.
- Cover loading, empty, error, offline, and duplicate-submit states.

**Recommended tools:** Playwright for frontend flows, Cypress for AEM-hosted UI flows, React Testing Library, axe-core, and Lighthouse.

## API Testing

- Validate OpenAPI schema, status codes, problem responses, authorization, rate limits, pagination, and idempotency.
- Test valid, invalid, expired, duplicate, unauthorized, and concurrent requests.
- Verify that backend prices and totals cannot be overridden by client input.

**Recommended tools:** REST Assured, Spring MockMvc, Postman/Newman or Bruno, WireMock, and contract-test fixtures.

## Performance Testing

Measure menu load, AEM GraphQL latency, cart mutation latency, checkout throughput, database query plans, and container startup. Test representative product volumes, concurrent carts, cache states, and slow dependencies.

**Recommended tools:** k6, Lighthouse, Playwright traces, JMeter where needed, PostgreSQL `EXPLAIN`, and Docker resource metrics.

## Test Data and Environments

Use synthetic products, stores, users, coupons, and orders. Never use real PII. Keep deterministic seed data versioned. CI uses isolated dependencies; local smoke tests use Docker Compose and an AEM SDK. Document which tests require author, publish, backend, or database services.

## Release Test Gate

All required unit, integration, contract, UI smoke, security, accessibility, and performance checks pass; flaky tests are triaged; test reports are retained; and release notes identify any accepted residual risk.
