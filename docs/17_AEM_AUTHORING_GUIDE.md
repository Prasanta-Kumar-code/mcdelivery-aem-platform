# AEM Authoring Guide — McDelivery Storefront

**Audience:** Content authors and marketers editing the McDelivery experience.
**No code changes or deployments are needed** for anything in this guide.

## 1. Where to author

1. Open the AEM author instance (local: `http://localhost:5502/aem/start.html`).
2. Go to **Assets → Files → mcd** (`/content/dam/mcd`).
3. Pick the folder for the content type (see the tables below).
4. Open a Content Fragment, edit the fields, and **Save**.
5. In AEM as a Cloud Service, select the fragment (or folder) and use
   **Manage Publication** to publish to the delivery tier.

The storefront reads the GraphQL endpoint on every request, so a saved change
appears on refresh — no rebuild required.

## 2. What lives where

| Folder | Fragment model | Use it for |
|--------|----------------|-----------|
| `settings` | Site Settings | Brand name/tagline, CTA labels, cart copy, footer titles/legal copy, SEO title/description, currency symbol, fallback notice |
| `heroes` | Hero | Campaign eyebrow, headline, sub-headline, description, CTAs, promo badge, hero image, variant |
| `sections` | Page Section | Section eyebrows, headings, empty-state messages, page order |
| `navigation` | Navigation Link | Header and footer links, CTA highlighting, social icons |
| `features` | Feature Flag | Launch/hide UI features |
| `products` | Product | Menu items, prices, descriptions, veg flag, allergens, images |
| `categories` | Category | Category names, slugs, order, visibility |
| `offers` | Offer | Promo codes, discount values, terms, validity |
| `stores` | Store | Restaurant name, address, phone, hours, service modes, closure |

## 3. Common tasks

### Change the hero campaign

1. Open `heroes/main`.
2. Edit **Eyebrow**, **Headline**, **Sub-headline**, **Description**,
   **Primary CTA label/link**, **Secondary CTA label/link**, **Promo badge**.
3. Leave **Variant** as `campaign` (or `deal` for a deal-led hero).
4. Save.

Leave a field empty to hide that element (for example, clear *Sub-headline*).

### Change a section heading or empty state

Open the matching fragment in `sections`:

| Fragment | Controls |
|----------|----------|
| `hero` | Hero placement in the page order (the copy comes from `heroes`) |
| `menu` | Menu eyebrow, heading, "no products" message |
| `deals` | Deals eyebrow, heading, "no offers" message |
| `locations` | Store eyebrow, heading, "no stores" message |

### Reorder or hide sections

- **Order:** set **Display order** on each `sections/*` fragment. Lower numbers
  render first. Current order: hero 1, menu 2, deals 3, locations 4.
- **Hide:** uncheck **Active** on a section, or disable the matching feature flag
  (next section).

### Launch or hide a feature

Open `features/<flag>` and set **Enabled**:

| Flag | Controls |
|------|----------|
| `hero` | Hero banner |
| `deals` | Deals strip |
| `menu` | Product grid |
| `menuFilters` | Category pills |
| `storeLocator` | Store cards |
| `cart` | Cart button + drawer |
| `account` | Sign-in entry point |
| `vegBadges` | Veg / non-veg badges on product cards |
| `footerSocial` | Social icons in the footer |

A missing flag is treated as **enabled**, so only explicit `false` hides a
feature.

### Edit header or footer links

Open the fragment in `navigation`:

- **Link group** must be one of `header`, `footer-company`, `footer-policy`,
  `footer-tools`, `footer-social`, `footer-bottom`.
- **Display order** controls position inside the group.
- **Call to action** (`isCta`) styles a header link as the highlighted button.
- **Icon key** (`facebook`, `twitter`, `instagram`) renders the matching social
  icon; without it the label is shown as text.
- **Opens in a new tab** sets `target="_blank"` with a safe `rel`.

### Change cart, footer or legal copy

Open `settings/global`:

- **Cart:** eyebrow, title, empty message, subtotal label, checkout label,
  close label, per-item label, remove label.
- **Footer:** brand tagline, note, copyright, and the four column titles.
- **Deals:** copy-code, copied and save labels.
- **Menu:** "All items" pill, item singular/plural labels.
- **SEO:** page title and description.
- **Fallback notice:** message (`{count}` is replaced with the number of
  unavailable streams) and hint shown only when AEM cannot be reached.

### Add or edit a menu item

1. Open `products` → create or open a fragment.
2. Fill **Title**, **SKU** (unique), **Price**, **Category slug** (must match a
   `categories` slug), **Vegetarian**, and **Description**.
3. Set **Active** to show it. **Display order** is optional.
4. Save.

### Add a deal

Open `offers` → new fragment. **Promo code** and **Title** are the only required
fields in practice; set **Active** and the validity dates. The three
lowest-value active offers are featured.

## 4. Fields authors should not change casually

- **Model definitions** under `/conf/mcd/settings/dam/cfm/models` — changing a
  model changes the GraphQL schema and requires the frontend query set to match.
- **`slug`** on categories and **`category`** on products — they are the join
  keys used by filtering and URL parameters (`?category=burgers`).
- **`flagKey`**, **`sectionKey`**, **`linkGroup`**, **`iconKey`** — these are
  API keys, not display labels. Renaming them removes the behaviour.

## 5. Previewing locally

```bash
cd frontend && npm run build && node start-mvp.cjs
# http://localhost:4200
```

If the page shows the yellow fallback notice, AEM is unreachable or a stream
failed. Start the AEM SDK and confirm the content package is installed; the
notice disappears once all streams load from AEM.

## 6. Publishing checklist

1. Fragment saved with no validation errors.
2. Referenced product/category slugs exist.
3. Feature flag intentionally left on/off.
4. Section order still makes sense (hero first, footer is always last).
5. Fragment published in AEM as a Cloud Service.
6. Refresh the storefront and confirm the change.

## 7. Troubleshooting

### The fragment editor returns an Internal Server Error

If `crx-quickstart/logs/error.log` shows
`ElementEditorModel cannot be correctly instantiated` with
`ClassCastException: Boolean cannot be cast to String`, the model field's
`required` property is stored as a Boolean. AEM 2024.8's fragment editor expects
a String. This repository now generates `required="on"`, but instances that
installed an older content package keep the Boolean value because merge-mode
imports do not retype properties.

Fix the running instance once (idempotent; no content is changed):

```bash
python3 mcd-aem/scripts/normalize-cf-required.py
# custom host/credentials:
python3 mcd-aem/scripts/normalize-cf-required.py \
  --url http://localhost:5502 --user admin --password admin
```

Then reload the fragment editor. A fresh install of the current
`ui.content` package is already correct.

### A field I added to a model does not appear on the fragment

Merge-mode packages do not add children/properties to an existing model node.
Delete that one model node in AEM, reinstall the content package, and reopen the
fragment. On a shared environment, update the model in the model editor instead
of deleting it.

### My edit does not appear on the storefront

- Confirm the fragment was **saved**, not just edited.
- On AEM as a Cloud Service, confirm it was **published**.
- Check the yellow fallback notice on the storefront; if it is visible, AEM or
  one of the GraphQL streams is unreachable and the site is showing seed content.
- The page reads AEM on every request, so a browser refresh is enough — no
  frontend rebuild.
