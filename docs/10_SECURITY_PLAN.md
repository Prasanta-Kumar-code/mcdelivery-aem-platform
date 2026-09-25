# Security Plan

## Security Objectives

Protect customer identity, order data, credentials, content authoring, and local developer environments while keeping the portfolio project easy to run. Apply defense in depth and document security decisions alongside API and schema changes.

## Authentication

- Support guest sessions with high-entropy, expiring identifiers.
- Add OIDC-compatible authentication before exposing account data.
- Store only identity-provider subject references, not passwords.
- Rotate sessions after sign-in and invalidate them at sign-out.
- Apply idle and absolute session expiry.
- Require re-authentication for sensitive account operations.
- Never place access tokens in URLs or logs.

## Authorization

- Enforce ownership checks on every cart, order, address, and notification endpoint.
- Use roles for content authors, operators, support users, and administrators.
- Keep AEM author permissions separate from publish delivery permissions.
- Apply least privilege to service accounts and database roles.
- Default-deny unknown routes and methods.
- Test horizontal and vertical privilege escalation explicitly.

## CSRF

- Use SameSite cookies and secure, HTTP-only session cookies where cookie sessions are used.
- Require CSRF tokens for state-changing browser requests when applicable.
- Validate `Origin` and `Referer` according to deployment policy.
- Do not treat CORS as CSRF protection.
- Use bearer-token APIs only when browser storage and token handling have been reviewed.

## XSS

- Treat AEM rich text as untrusted input at render time.
- Use framework escaping by default.
- Sanitize any intentionally rendered HTML with an approved sanitizer.
- Apply a restrictive Content Security Policy and remove unsafe inline scripts.
- Validate URLs and reject unsafe schemes such as `javascript:`.
- Add regression tests for product descriptions, offers, image alt text, and query parameters.

## Secrets Management

- Keep credentials out of source, docs examples, Docker images, build artifacts, and logs.
- Use `.env.example` with placeholders only.
- Use local environment variables or a developer-managed secret store for local work.
- Use short-lived credentials where supported.
- Rotate AEM, database, signing, and provider credentials on a documented schedule.
- Separate local, CI, test, and release credentials.

## GitHub Secret Usage

- Store repository or environment secrets only in GitHub Actions settings.
- Use environment protection rules for release jobs.
- Restrict secret-bearing jobs to trusted branches and reviewed workflows.
- Never pass secrets to forked pull-request workflows.
- Mask values and avoid writing them to command output.
- Audit secret access and rotate after suspected exposure.

## API and Data Protection

- Validate JSON schema, content type, payload size, pagination, and numeric bounds.
- Rate-limit login, guest session, coupon, and order endpoints.
- Use idempotency keys for checkout and redemption commands.
- Encrypt transport; use TLS in any non-local deployment.
- Minimize PII and redact email, token, address, and payment data from logs.
- Use immutable order snapshots and controlled retention/deletion workflows.

## Security Verification

Run dependency scanning, secret scanning, SAST, DAST against local services, container scanning, AEM analyzer checks, and manual threat-model reviews at MVP and every major release. Track findings with severity, owner, remediation date, and risk acceptance authority.
