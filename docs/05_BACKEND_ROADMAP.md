# Backend Roadmap

## Service Design Principles

Services may begin as modules in one Spring Boot application to keep local development simple. Extract them into deployable processes only when ownership, scaling, failure isolation, and operational value justify the cost. REST commands must be authenticated or explicitly guest-scoped, validated, idempotent where retried, and versioned.

## Cart Service

**Purpose:** Manage anonymous and authenticated carts, line quantities, item validation, and subtotal calculation.

**REST APIs:** `POST /api/v1/carts`, `GET /api/v1/carts/{cartId}`, `POST /api/v1/carts/{cartId}/items`, `PATCH /api/v1/carts/{cartId}/items/{itemId}`, `DELETE /api/v1/carts/{cartId}/items/{itemId}`, `POST /api/v1/carts/{cartId}/merge`.

**Database Tables:** `carts`, `cart_items`, `cart_events`, `idempotency_keys`.

**DTOs:** `CreateCartRequest`, `AddCartItemRequest`, `UpdateCartItemRequest`, `CartResponse`, `CartItemResponse`, `PriceBreakdown`.

**Future Enhancements:** Saved carts, expiration jobs, product customization, inventory reservations, and event publication.

## Product Service

**Purpose:** Provide a backend-safe product view, reconcile AEM content, and expose availability and price policies needed by transactional services.

**REST APIs:** `GET /api/v1/products/{sku}`, `GET /api/v1/products?category=`, `POST /internal/v1/products/sync`, `GET /internal/v1/products/health`.

**Database Tables:** `product_snapshots`, `product_availability`, `product_sync_runs`.

**DTOs:** `ProductSummary`, `ProductDetail`, `ProductAvailability`, `ProductSnapshot`, `ProductSyncResult`.

**Future Enhancements:** Cache warming, versioned content snapshots, nutrition service integration, and store-specific assortment.

## User Service

**Purpose:** Manage customer profile references, guest identity, consent, and account-owned resources.

**REST APIs:** `POST /api/v1/users`, `GET /api/v1/users/me`, `PATCH /api/v1/users/me`, `POST /api/v1/users/guest`, `DELETE /api/v1/users/me`.

**Database Tables:** `users`, `user_consents`, `user_addresses`, `guest_sessions`.

**DTOs:** `CreateUserRequest`, `UpdateProfileRequest`, `UserResponse`, `GuestSessionResponse`, `ConsentRequest`.

**Future Enhancements:** OIDC integration, saved payment references, loyalty identity, and account deletion workflows.

## Store Service

**Purpose:** Provide store discovery, hours, service modes, operational status, and delivery eligibility.

**REST APIs:** `GET /api/v1/stores`, `GET /api/v1/stores/{storeId}`, `GET /api/v1/stores/{storeId}/availability`, `POST /internal/v1/stores/{storeId}/closures`.

**Database Tables:** `stores`, `store_hours`, `store_service_modes`, `store_closures`.

**DTOs:** `StoreSummary`, `StoreDetail`, `StoreHours`, `StoreAvailability`, `ClosureRequest`.

**Future Enhancements:** Geospatial search, live restaurant capacity, POS availability, and holiday schedules.

## Order Service

**Purpose:** Validate checkout, calculate authoritative totals, create orders, and manage status transitions.

**REST APIs:** `POST /api/v1/orders`, `GET /api/v1/orders/{orderId}`, `GET /api/v1/orders`, `POST /api/v1/orders/{orderId}/cancel`, `POST /internal/v1/orders/{orderId}/status`.

**Database Tables:** `orders`, `order_items`, `order_status_history`, `order_payments`, `order_outbox`.

**DTOs:** `CreateOrderRequest`, `OrderResponse`, `OrderItemSnapshot`, `OrderTotal`, `OrderStatusUpdate`, `CancelOrderRequest`.

**Future Enhancements:** Payment authorization, fulfillment events, POS integration, refunds, and delivery partner adapters.

## Coupon Service

**Purpose:** Validate coupon eligibility, calculate discounts, and enforce redemption limits.

**REST APIs:** `POST /api/v1/coupons/validate`, `POST /api/v1/coupons/redeem`, `POST /api/v1/coupons/release`, `GET /api/v1/coupons/available`.

**Database Tables:** `coupons`, `coupon_rules`, `coupon_redemptions`.

**DTOs:** `ValidateCouponRequest`, `CouponValidationResponse`, `DiscountLine`, `RedemptionRequest`.

**Future Enhancements:** Segmented offers, campaign scheduling, abuse detection, and AEM offer synchronization.

## Notification Service

**Purpose:** Deliver order confirmation and lifecycle messages through replaceable adapters.

**REST APIs:** `POST /internal/v1/notifications`, `GET /internal/v1/notifications/{notificationId}`, `POST /api/v1/users/me/notification-preferences`.

**Database Tables:** `notifications`, `notification_attempts`, `notification_preferences`.

**DTOs:** `NotificationRequest`, `NotificationResponse`, `DeliveryAttempt`, `NotificationPreferenceRequest`.

**Future Enhancements:** Email provider integration, SMS/push adapters, templates, retries with dead-letter handling, and delivery analytics.

## Shared Backend Requirements

- OpenAPI specification generated and reviewed for every public endpoint.
- RFC 7807-style problem responses with correlation IDs.
- Database migrations run forward-only and are tested from an empty database.
- Transaction boundaries and isolation levels documented for cart, coupon, and order operations.
- Outbox pattern for reliable post-transaction notifications.
- Rate limits on public and guest endpoints.
- Contract tests between frontend clients and backend APIs.
