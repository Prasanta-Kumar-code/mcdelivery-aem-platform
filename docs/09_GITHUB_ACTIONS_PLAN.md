# GitHub Actions Plan

These are future workflow plans. They are intentionally not implemented in this document set.

## `frontend-ci.yml`

**Trigger:** Pull requests touching `frontend/**`, frontend dependency files, or shared documentation; pushes to protected main; manual dispatch.

**Steps:** Check out code; configure the pinned Node version; restore dependency cache; install from lockfile; run lint; run TypeScript typecheck; run unit/component tests; build Next.js production output; optionally run accessibility smoke tests; upload reports and build artifacts.

**Expected outputs:** Lint report, typecheck result, test report, build artifact, bundle-size summary, and job summary with the tested commit.

## `backend-ci.yml`

**Trigger:** Pull requests touching backend source, database migrations, shared API contracts, or backend build files; pushes to main; manual dispatch.

**Steps:** Configure JDK and Maven; cache Maven dependencies; compile; run unit tests; start Testcontainers PostgreSQL; run repository and controller integration tests; generate OpenAPI; run formatting and static analysis; package the service; upload reports.

**Expected outputs:** JUnit XML, coverage report, OpenAPI artifact, package artifact, static-analysis result, and database migration verification.

## `aem-build.yml`

**Trigger:** Pull requests or pushes touching `mcd-aem/**`; manual dispatch with optional AEM SDK integration flag.

**Steps:** Configure JDK and Maven; cache Maven dependencies; run `mvn clean verify`; execute AEM unit tests and analyzer checks; package `all`; optionally deploy to a local AEM SDK runner; run GraphQL/content smoke checks.

**Expected outputs:** Maven reports, analyzer report, FileVault package, unit-test report, and optional local AEM smoke-test report.

## `weekly-health-check.yml`

**Trigger:** Weekly scheduled run and manual dispatch.

**Steps:** Check dependency advisories; run full frontend/backend/AEM builds; run Docker Compose startup and smoke tests; validate documentation links; inspect image base updates; summarize flaky tests and known issues.

**Expected outputs:** Weekly health summary, dependency report, smoke-test result, artifact retention links, and an issue recommendation when a check fails.

## `dependency-update.yml`

**Trigger:** Weekly schedule and manual dispatch.

**Steps:** Inspect npm, Maven, Docker base images, and GitHub Action versions; create a branch or pull request with lockfile updates; run the relevant workflows; label updates by risk; never merge automatically when breaking changes or security exceptions are detected.

**Expected outputs:** Reviewable dependency pull request, compatibility results, changelog summary, and security advisory context.

## Common Workflow Controls

- Use least-privilege `permissions`.
- Pin third-party actions to reviewed major versions or commit SHAs.
- Avoid printing secrets and disable command echo for sensitive steps.
- Upload artifacts only when they contain no credentials or private customer data.
- Set timeouts and concurrency cancellation for superseded PR runs.
- Use required status checks and branch protection.
- Retain reports for a documented period.
- Separate build, test, and release permissions.
