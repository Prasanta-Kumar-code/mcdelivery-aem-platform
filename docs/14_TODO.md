# Master Execution Checklist

Every item is intentionally small, actionable, and independently testable. Mark an item complete only when its acceptance evidence exists in the repository, CI, or release record.

## Phase 1: Baseline and Decisions

- [ ] Confirm project name and repository ownership.
- [ ] Confirm target Node.js version.
- [ ] Confirm target Java version.
- [ ] Resolve Next.js 15 baseline versus installed Next.js 16.3.3.
- [ ] Pin the selected Next.js version.
- [ ] Pin the selected React version.
- [ ] Pin the selected PostgreSQL major version.
- [ ] Record supported browsers.
- [ ] Record supported locales.
- [ ] Record currency and timezone policy.
- [ ] Create a product decision log.
- [ ] Create a technical decision record template.
- [ ] Define MVP acceptance ownership.
- [ ] Define issue labels and priorities.
- [ ] Define branch protection rules.
- [ ] Define pull request review requirements.

## Phase 2: Local Developer Environment

- [ ] Document repository prerequisites.
- [ ] Add `.env.example` files without secrets.
- [ ] Document frontend startup command.
- [ ] Document backend startup command.
- [ ] Document PostgreSQL startup command.
- [ ] Document AEM author startup command.
- [ ] Document AEM publish startup command.
- [ ] Document local service ports.
- [ ] Create Docker Compose development topology.
- [ ] Add PostgreSQL health check.
- [ ] Add backend health check.
- [ ] Add frontend readiness check.
- [ ] Add local mail catcher configuration.
- [ ] Add deterministic database seed command.
- [ ] Add deterministic AEM content seed process.
- [ ] Verify a clean-machine startup.
- [ ] Record troubleshooting steps.

## Phase 3: Repository and Quality Baseline

- [ ] Add root README navigation.
- [ ] Link all planning documents.
- [ ] Add Markdown lint configuration.
- [ ] Add Mermaid validation approach.
- [ ] Add editor settings for formatting.
- [ ] Add frontend typecheck script.
- [ ] Add backend formatting check.
- [ ] Add Maven verification command.
- [ ] Add test report output paths.
- [ ] Add coverage report output paths.
- [ ] Add consistent line-ending policy.
- [ ] Add dependency lockfile policy.
- [ ] Add changelog policy.
- [ ] Add code ownership rules.
- [ ] Add issue templates.
- [ ] Add pull request template.
- [ ] Verify the baseline build passes.

## Phase 4: AEM Content Foundation

- [ ] Review the Category Content Fragment Model.
- [ ] Verify required category fields.
- [ ] Verify category slug validation.
- [ ] Verify category locale field.
- [ ] Review the Product Content Fragment Model.
- [ ] Verify required product fields.
- [ ] Verify SKU uniqueness policy.
- [ ] Verify product price validation.
- [ ] Verify product image references.
- [ ] Verify product availability values.
- [ ] Create the Offer Content Fragment Model.
- [ ] Create the Store Content Fragment Model.
- [ ] Document User editorial boundary.
- [ ] Document Order transactional boundary.
- [ ] Add model descriptions for authors.
- [ ] Add sample category fragments.
- [ ] Add sample product fragments.
- [ ] Add sample offer fragments.
- [ ] Add sample store fragments.
- [ ] Validate references in AEM.
- [ ] Publish approved sample content.
- [ ] Record AEM content paths.
- [ ] Document authoring workflow.

## Phase 5: GraphQL Content Delivery

- [ ] Confirm AEM GraphQL endpoint configuration.
- [ ] Define category query contract.
- [ ] Define product query contract.
- [ ] Define offer query contract.
- [ ] Define pagination behavior.
- [ ] Define locale filtering behavior.
- [ ] Define unavailable-content behavior.
- [ ] Define image reference handling.
- [ ] Add persisted query strategy.
- [ ] Add GraphQL response types.
- [ ] Remove privileged credentials from browser code.
- [ ] Add server-side credential boundary if required.
- [ ] Add GraphQL timeout handling.
- [ ] Add GraphQL error mapping.
- [ ] Add empty-result handling.
- [ ] Add GraphQL fixture responses.
- [ ] Add query contract tests.
- [ ] Verify published content in local AEM.
- [ ] Verify cache and revalidation policy.
- [ ] Document query ownership.

## Phase 6: Frontend Menu Experience

- [ ] Define the page information architecture.
- [ ] Define responsive breakpoints.
- [ ] Define typography and color tokens.
- [ ] Define loading skeletons.
- [ ] Define empty menu state.
- [ ] Define menu error state.
- [ ] Harden the header component.
- [ ] Harden the category navigation component.
- [ ] Harden the product card component.
- [ ] Add responsive product grid behavior.
- [ ] Add image loading and fallback behavior.
- [ ] Add dietary metadata presentation.
- [ ] Add product detail interaction.
- [ ] Add category URL state.
- [ ] Add invalid-category fallback.
- [ ] Add no-results state.
- [ ] Add accessible active category state.
- [ ] Add keyboard navigation tests.
- [ ] Add responsive viewport tests.
- [ ] Add menu analytics event contract.
- [ ] Verify menu against local AEM content.

## Phase 7: Cart

- [ ] Define cart item domain type.
- [ ] Define cart total domain type.
- [ ] Define quantity bounds.
- [ ] Define anonymous cart identifier policy.
- [ ] Persist only safe anonymous cart state.
- [ ] Add add-to-cart action.
- [ ] Add increment action.
- [ ] Add decrement action.
- [ ] Add remove action.
- [ ] Add cart empty state.
- [ ] Add cart drawer shell.
- [ ] Add cart drawer focus management.
- [ ] Add Escape-to-close behavior.
- [ ] Add accessible cart trigger label.
- [ ] Add line-item quantity controls.
- [ ] Add subtotal presentation.
- [ ] Add optimistic update rollback.
- [ ] Add cart state unit tests.
- [ ] Add cart keyboard tests.
- [ ] Add cart mobile tests.
- [ ] Document local cart limitations.

## Phase 8: Backend Foundation

- [ ] Create Spring Boot application structure.
- [ ] Configure local profiles.
- [ ] Add structured logging.
- [ ] Add correlation ID filter.
- [ ] Add global problem response handler.
- [ ] Add request validation.
- [ ] Add OpenAPI generation.
- [ ] Add PostgreSQL connection configuration.
- [ ] Add migration tool.
- [ ] Create initial migration.
- [ ] Add database health endpoint.
- [ ] Add backend readiness endpoint.
- [ ] Add repository test fixture.
- [ ] Add Testcontainers PostgreSQL setup.
- [ ] Verify migration from empty database.
- [ ] Verify migration upgrade path.
- [ ] Add API versioning convention.
- [ ] Add rate-limit design.
- [ ] Add idempotency key design.
- [ ] Add backend error taxonomy.

## Phase 9: Domain Services

- [ ] Implement Cart Service contract.
- [ ] Test cart creation.
- [ ] Test cart item addition.
- [ ] Test cart quantity update.
- [ ] Test cart item removal.
- [ ] Test cart ownership.
- [ ] Implement Product Service contract.
- [ ] Test product lookup.
- [ ] Test unavailable product behavior.
- [ ] Implement Store Service contract.
- [ ] Test store lookup.
- [ ] Test closed-store behavior.
- [ ] Implement User Service contract.
- [ ] Test guest identity creation.
- [ ] Test user ownership.
- [ ] Implement Coupon Service contract.
- [ ] Test coupon date eligibility.
- [ ] Test coupon redemption limits.
- [ ] Implement Order Service contract.
- [ ] Test authoritative order totals.
- [ ] Test order idempotency.
- [ ] Test order status transitions.
- [ ] Implement Notification Service contract.
- [ ] Test notification outbox creation.

## Phase 10: Checkout

- [ ] Define checkout request schema.
- [ ] Define checkout response schema.
- [ ] Define store selection rules.
- [ ] Define contact data rules.
- [ ] Define tax and fee policy.
- [ ] Define discount application order.
- [ ] Add checkout form fields.
- [ ] Add client-side validation.
- [ ] Add server-side validation.
- [ ] Add order summary reconciliation.
- [ ] Add duplicate-submit protection.
- [ ] Add checkout loading state.
- [ ] Add checkout failure state.
- [ ] Add order confirmation page.
- [ ] Add confirmation identifier display.
- [ ] Add confirmation analytics event.
- [ ] Test invalid checkout input.
- [ ] Test backend total mismatch.
- [ ] Test closed store during checkout.
- [ ] Test retry after timeout.
- [ ] Verify guest checkout end to end.

## Phase 11: Authentication and Privacy

- [ ] Choose OIDC-compatible provider boundary.
- [ ] Define guest-to-user cart merge rules.
- [ ] Define session expiry policy.
- [ ] Define sign-out behavior.
- [ ] Define account deletion policy.
- [ ] Define consent records.
- [ ] Add protected API ownership checks.
- [ ] Add sign-in UI boundary.
- [ ] Add sign-out UI.
- [ ] Add account profile view.
- [ ] Add order history authorization test.
- [ ] Add CSRF protection decision.
- [ ] Add CSP policy draft.
- [ ] Add PII logging redaction.
- [ ] Add data retention policy.
- [ ] Test unauthorized resource access.
- [ ] Test expired session behavior.
- [ ] Test guest checkout remains available.

## Phase 12: Testing and Accessibility

- [ ] Set frontend unit-test framework.
- [ ] Add ProductCard tests.
- [ ] Add CategoryBar tests.
- [ ] Add cart-store tests.
- [ ] Add GraphQL client tests.
- [ ] Set backend unit-test conventions.
- [ ] Add pricing rule tests.
- [ ] Add controller tests.
- [ ] Add repository integration tests.
- [ ] Add AEM model tests.
- [ ] Add AEM package smoke test.
- [ ] Add REST contract tests.
- [ ] Add GraphQL contract tests.
- [ ] Add Cypress AEM flow.
- [ ] Add Playwright frontend flow.
- [ ] Add checkout regression flow.
- [ ] Add axe accessibility checks.
- [ ] Add keyboard-only regression flow.
- [ ] Add reduced-motion verification.
- [ ] Add performance baseline.
- [ ] Add representative load test.
- [ ] Add test data reset process.
- [ ] Publish test reports in CI.

## Phase 13: CI/CD and Security

- [ ] Create frontend CI workflow plan.
- [ ] Create backend CI workflow plan.
- [ ] Create AEM build workflow plan.
- [ ] Create weekly health workflow plan.
- [ ] Create dependency update workflow plan.
- [ ] Add PR validation checks.
- [ ] Add build artifact retention.
- [ ] Add secret scanning.
- [ ] Add dependency scanning.
- [ ] Add SAST scanning.
- [ ] Add container scanning.
- [ ] Add SBOM generation.
- [ ] Pin GitHub Action versions.
- [ ] Set least-privilege workflow permissions.
- [ ] Configure concurrency cancellation.
- [ ] Configure protected main checks.
- [ ] Add Docker non-root runtime users.
- [ ] Add Docker health checks.
- [ ] Add Compose smoke test job.
- [ ] Verify no secrets in logs.
- [ ] Document GitHub secret ownership.

## Phase 14: Observability and Operations

- [ ] Define structured log schema.
- [ ] Define correlation ID propagation.
- [ ] Define frontend error reporting boundary.
- [ ] Define backend metrics.
- [ ] Define AEM query latency metrics.
- [ ] Define database health metrics.
- [ ] Define order failure alerts.
- [ ] Define checkout latency budget.
- [ ] Add local log aggregation guidance.
- [ ] Add health endpoint documentation.
- [ ] Add operational runbook.
- [ ] Add database backup procedure.
- [ ] Add database restore drill.
- [ ] Add migration failure procedure.
- [ ] Add AEM content rollback procedure.
- [ ] Add order reconciliation procedure.
- [ ] Add incident severity policy.
- [ ] Add incident contact ownership.
- [ ] Add post-incident review template.

## Phase 15: Release and Production Readiness

- [ ] Define MVP release version.
- [ ] Freeze MVP scope.
- [ ] Complete MVP acceptance review.
- [ ] Complete security review.
- [ ] Complete privacy review.
- [ ] Complete accessibility review.
- [ ] Complete performance review.
- [ ] Complete API compatibility review.
- [ ] Complete database migration review.
- [ ] Complete AEM publishing review.
- [ ] Complete local deployment rehearsal.
- [ ] Run full regression suite.
- [ ] Run clean-machine setup rehearsal.
- [ ] Build release artifacts.
- [ ] Generate release SBOM.
- [ ] Publish release notes.
- [ ] Tag MVP release.
- [ ] Verify rollback instructions.
- [ ] Record known residual risks.
- [ ] Start v1 planning.

## Phase 16: Post-MVP Enhancements

- [ ] Add authenticated order history.
- [ ] Add email confirmation adapter.
- [ ] Add coupon presentation from AEM.
- [ ] Add coupon redemption audit.
- [ ] Add store finder search.
- [ ] Add location permission flow.
- [ ] Add order status polling.
- [ ] Add PWA manifest.
- [ ] Add safe service-worker caching.
- [ ] Add payment sandbox adapter.
- [ ] Add recommendation baseline.
- [ ] Add offers engine rules.
- [ ] Define analytics event taxonomy.
- [ ] Add Adobe Analytics integration boundary.
- [ ] Define experimentation governance.
- [ ] Add Adobe Target integration boundary.
- [ ] Review v1 release criteria.
- [ ] Publish v1 release notes.
