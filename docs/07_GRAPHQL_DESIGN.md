# GraphQL Design

## Contract Principles

AEM GraphQL is a read-oriented content API. Use persisted or allow-listed queries, explicit field selection, pagination, locale filtering, and cache-aware delivery. Do not use it for order creation, payment, cart authority, or private user data.

## Category Queries

### Query

```graphql
query Categories($locale: String!) {
  categoryList(filter: { locale: { _expressions: [{ value: $locale }] } }) {
    items {
      _path
      title
      slug
      displayOrder
      isActive
    }
  }
}
```

### Response

```json
{
  "data": {
    "categoryList": {
      "items": [
        { "_path": "/content/dam/mcdelivery/categories/menu", "title": "Menu", "slug": "menu", "displayOrder": 1, "isActive": true }
      ]
    }
  }
}
```

## Product Queries

### Query

```graphql
query Products($category: String, $limit: Int!, $offset: Int!) {
  productList(
    filter: { category: { _expressions: [{ value: $category }] }, isActive: { _values: [true] } }
    limit: $limit
    offset: $offset
  ) {
    items {
      _path
      title
      sku
      price
      currency
      category
      isVeg
      availability
      image { ... on ImageRef { _path } }
      description { plaintext }
    }
  }
}
```

### Response

```json
{
  "data": {
    "productList": {
      "items": [
        {
          "_path": "/content/dam/mcdelivery/products/classic-burger",
          "title": "Classic Burger",
          "sku": "BURGER-001",
          "price": 599,
          "currency": "USD",
          "category": "burgers",
          "isVeg": false,
          "availability": "AVAILABLE",
          "image": { "_path": "/content/dam/mcdelivery/assets/classic-burger.jpg" },
          "description": { "plaintext": "A familiar menu favorite." }
        }
      ]
    }
  }
}
```

## Offer Queries

### Query

```graphql
query ActiveOffers($locale: String!, $now: Calendar!) {
  offerList(
    filter: {
      locale: { _expressions: [{ value: $locale }] }
      isActive: { _values: [true] }
      startAt: { _value: $now, _operator: BEFORE }
      endAt: { _value: $now, _operator: AFTER }
    }
  ) {
    items {
      _path
      offerId
      title
      description { plaintext }
      offerType
      value
      currency
      promoCode
      terms { plaintext }
      image { ... on ImageRef { _path } }
    }
  }
}
```

### Response

```json
{
  "data": {
    "offerList": {
      "items": [
        {
          "_path": "/content/dam/mcdelivery/offers/meal-deal",
          "offerId": "MEAL-DEAL-01",
          "title": "Meal Deal",
          "description": { "plaintext": "Save on a selected meal." },
          "offerType": "FIXED_DISCOUNT",
          "value": 200,
          "currency": "USD",
          "promoCode": "MEAL200",
          "terms": { "plaintext": "Valid on eligible items only." },
          "image": { "_path": "/content/dam/mcdelivery/assets/meal-deal.jpg" }
        }
      ]
    }
  }
}
```

## Error Handling

Clients must handle a top-level `errors` array, partial `data`, timeouts, empty results, invalid content, and image failures. The frontend should expose a retryable state without leaking query details or credentials.

## Future Order Queries

Order data belongs to the authenticated Spring Boot API. A future gateway may expose a unified GraphQL façade, but it must preserve backend authorization, pagination, ownership checks, status filtering, and snapshot semantics.

## Future Store Queries

A store query may expose public store name, hours, service modes, coordinates, and availability summaries. Exact operational availability must be resolved by Store Service, not inferred only from editorial AEM content.

## Governance

- Keep queries in version-controlled documents or generated client artifacts.
- Add schema compatibility tests when Content Fragment Models change.
- Set maximum depth, complexity, page size, and response size.
- Never accept arbitrary user-provided field selection from untrusted integrations.
- Record query name, latency, result count, and error class without logging personal data.
