# AEM Content Model

## Modeling Standards

- Use lower-camel-case field names aligned with GraphQL output.
- Use stable identifiers and slugs; never use display titles as keys.
- Keep editorial content in AEM and transactional truth in the backend.
- Use required fields for data needed to render safely.
- Use references for reusable entities and snapshots for order history.
- Publish only validated, approved fragments to the delivery endpoint.

## Category Model

### Fields

| Field | Type | Required | Notes |
|---|---|---:|---|
| `title` | String | Yes | Customer-facing category name |
| `slug` | String | Yes | URL/filter-safe unique value |
| `description` | Rich text | No | Short editorial description |
| `image` | Content Reference | No | Category artwork |
| `displayOrder` | Integer | Yes | Non-negative ordering value |
| `isActive` | Boolean | Yes | Controls discoverability |
| `locale` | String | Yes | BCP 47 locale |

### Constraints

Unique slug per locale; display order must be non-negative; title length 1-80; inactive categories are excluded from default queries.

### Relationships

One category references many products. A product may reference multiple categories if merchandising requires it.

### GraphQL Usage

Use `categoryList` for navigation and filter metadata. Query only active categories, order by `displayOrder`, and request a stable identifier, title, slug, and image reference.

## Product Model

### Fields

| Field | Type | Required | Notes |
|---|---|---:|---|
| `title` | String | Yes | Product display name |
| `sku` | String | Yes | Stable merchandising identifier |
| `description` | Rich text | No | Product description |
| `price` | Decimal | Yes | Display price; backend revalidates totals |
| `currency` | String | Yes | ISO 4217 code |
| `image` | Content Reference | Yes | Responsive product image |
| `category` | String/Reference | Yes | Category association |
| `isVeg` | Boolean | Yes | Dietary attribute |
| `allergens` | String list | No | Disclosure metadata |
| `availability` | Enumeration | Yes | `AVAILABLE`, `LIMITED`, `UNAVAILABLE` |
| `displayOrder` | Integer | Yes | Category ordering |
| `isActive` | Boolean | Yes | Publication eligibility |

### Constraints

SKU is unique; price is non-negative with currency precision; image must have an approved rendition; unavailable products are not addable; authoring validation cannot be treated as payment authority.

### Relationships

Belongs to one primary category and optionally many related categories or upsell products. May be referenced by offers.

### GraphQL Usage

Use `productList` for listing pages with pagination and selected fields. Avoid requesting large rich-text or image payloads when cards only need summary data.

## Offer Model

### Fields

`offerId`, `title`, `description`, `offerType`, `value`, `currency`, `promoCode`, `startAt`, `endAt`, `eligibleProductSkus`, `eligibleCategorySlugs`, `minimumSubtotal`, `maximumRedemptions`, `isActive`, `image`, `terms`, and `locale`.

### Constraints

Offer ID and promo code are stable and unique; `startAt < endAt`; value must match offer type; eligibility references must resolve; expired offers are excluded; terms are required for customer-visible promotions.

### Relationships

References products and categories. Coupon redemption and one-time use are enforced by the backend, not AEM.

### GraphQL Usage

Query active offers by locale and current publication window. Use AEM for presentation and eligibility hints; call Coupon Service for authoritative redemption validation.

## Store Model

### Fields

`storeId`, `name`, `address`, `latitude`, `longitude`, `timezone`, `phone`, `openingHours`, `serviceModes`, `deliveryRadius`, `isActive`, `temporaryClosure`, `supportedCategories`, and `locale`.

### Constraints

Store ID unique; coordinates valid; timezone is IANA; hours must be parseable; inactive or temporarily closed stores cannot be selected for new orders.

### Relationships

A store serves many products and orders. Availability may reference product and category content while operational availability remains backend-owned.

### GraphQL Usage

Use for editorial store finder content and service metadata. Backend Store Service must reconcile it with operational state before checkout.

## User Model

### Fields

`userId`, `externalSubject`, `email`, `displayName`, `preferredLocale`, `marketingConsent`, `savedAddressReference`, `isActive`, and `createdAt`.

### Constraints

Do not store passwords in AEM. External subject is unique; consent must be explicit and timestamped; personal data should be minimized and access-controlled.

### Relationships

A user owns backend carts, orders, and preferences. AEM may contain only approved editorial profile content if needed, never transactional identity state.

### GraphQL Usage

Not exposed through public AEM GraphQL in MVP. If future editorial personalization needs it, use a protected, minimized query and keep identity authoritative in the identity service.

## Order Model

### Fields

`orderId`, `displayNumber`, `status`, `storeReference`, `customerReference`, `itemsSnapshot`, `subtotal`, `discountTotal`, `taxTotal`, `deliveryFee`, `grandTotal`, `currency`, `placedAt`, `estimatedReadyAt`, and `statusHistory`.

### Constraints

Orders are immutable financial snapshots after placement except for controlled status transitions. Totals are calculated by backend services; product content changes must not rewrite historical item names or prices.

### Relationships

References a user or guest token, store, coupon redemption, and one or more order item snapshots. It may reference AEM SKUs but must retain denormalized display data.

### GraphQL Usage

Orders are not authored content and should not be delivered from public AEM GraphQL. Future order queries belong to the authenticated backend API.

## Editorial Workflow

1. Author creates or updates a fragment.
2. Validation checks required fields, references, imagery, and locale.
3. Reviewer approves content and scheduling.
4. AEM publishes the fragment to the delivery endpoint.
5. GraphQL contract tests verify the published shape.
6. Next.js revalidation or cache invalidation exposes the change.
7. Backend validates product identity and price policy during checkout.
