import { Product } from "@/types/product";
import { Category } from "@/types/category";
import { Offer } from "@/types/offer";
import { Store } from "@/types/store";
import {
  seedCategories,
  seedOffers,
  seedProducts,
  seedStores,
} from "@/services/seed-menu";

const aemEndpoint =
  process.env.AEM_GRAPHQL_ENDPOINT ?? process.env.NEXT_PUBLIC_AEM_GRAPHQL;

const REQUEST_TIMEOUT_MS = 6000;

function getAemHeaders(): Record<string, string> {
  const username = process.env.AEM_GRAPHQL_USERNAME;
  const password = process.env.AEM_GRAPHQL_PASSWORD;

  if (!username || !password) {
    return { "Content-Type": "application/json" };
  }

  const credentials = `${username}:${password}`;

  return {
    "Content-Type": "application/json",
    Authorization: `Basic ${Buffer.from(credentials).toString("base64")}`,
  };
}

async function requestAem(query: string): Promise<unknown> {
  if (!aemEndpoint) {
    throw new Error("AEM_GRAPHQL_ENDPOINT is not configured");
  }

  const response = await fetch(aemEndpoint, {
    method: "POST",
    headers: getAemHeaders(),
    body: JSON.stringify({ query }),
    cache: "no-store",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    const message =
      response.status === 401
        ? "AEM GraphQL authentication failed. Check the local AEM username and password."
        : `AEM GraphQL request failed with status ${response.status}`;
    throw new Error(message);
  }

  const payload = await response.json();

  if (Array.isArray(payload?.errors) && payload.errors.length > 0) {
    throw new Error(
      `AEM GraphQL query error: ${payload.errors[0]?.message ?? "unknown"}`
    );
  }

  return payload?.data;
}

/**
 * Shape of the GraphQL `data` envelope for list queries: each root field
 * resolves to an object with an optional `items` array.
 */
type AemQueryResult = Record<
  string,
  { items?: unknown[] } | undefined
>;

/**
 * The AEM GraphQL schema evolves with the authored Content Fragment Models, so
 * every read is expressed as ordered query variants. The first variant the
 * endpoint accepts wins; if none do, the caller falls back to seed content.
 */
async function queryFirstMatch(queries: string[]): Promise<AemQueryResult> {
  let lastError: unknown = new Error("no query variants");

  for (const query of queries) {
    try {
      return (await requestAem(query)) as AemQueryResult;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

function asPlainText(value: unknown): string | undefined {
  if (typeof value === "string") {
    return value;
  }
  if (value && typeof value === "object" && "plaintext" in value) {
    const plaintext = (value as { plaintext?: unknown }).plaintext;
    return typeof plaintext === "string" ? plaintext : undefined;
  }
  return undefined;
}

function asImagePath(value: unknown): { _path: string } | undefined {
  if (typeof value === "string" && value.startsWith("/content/dam/")) {
    return { _path: value };
  }
  if (
    value &&
    typeof value === "object" &&
    typeof (value as { _path?: unknown })._path === "string"
  ) {
    return { _path: (value as { _path: string })._path };
  }
  return undefined;
}

function asNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function asOptionalNumber(value: unknown): number | undefined {
  return value === undefined || value === null ? undefined : asNumber(value);
}

function asOptionalBoolean(value: unknown): boolean | undefined {
  return value === undefined || value === null ? undefined : Boolean(value);
}

function asOptionalString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

const PRODUCT_QUERIES = [
  `query {
    productList {
      items {
        _path
        title
        sku
        price
        currency
        category
        isVeg
        allergens
        availability
        displayOrder
        isActive
        image { ... on ImageRef { _path } }
        description { plaintext }
      }
    }
  }`,
  `query {
    productList {
      items {
        title
        sku
        price
        currency
        category
        isVeg
        image
        description
      }
    }
  }`,
  `query {
    productList {
      items { title sku price category isVeg description }
    }
  }`,
];

const CATEGORY_QUERIES = [
  `query {
    categoryList {
      items { _path title slug displayOrder isActive locale description { plaintext } }
    }
  }`,
  `query {
    categoryList {
      items { title slug displayOrder }
    }
  }`,
];

const OFFER_QUERIES = [
  `query {
    offerList {
      items { _path offerId title offerType value currency promoCode isActive description { plaintext } terms { plaintext } }
    }
  }`,
  `query {
    offerList {
      items { offerId title promoCode description }
    }
  }`,
];

const STORE_QUERIES = [
  // `address` and `openingHours` are multi-line text in the CF model, so the
  // generated schema types them as MultiFormatString and requires a
  // { plaintext } subselection.
  `query {
    storeList {
      items { _path storeId name address { plaintext } phone openingHours { plaintext } serviceModes timezone isActive temporaryClosure }
    }
  }`,
  // Fallback for schemas where those fields are single-line text.
  `query {
    storeList {
      items { storeId name address phone }
    }
  }`,
];

export async function getProducts(): Promise<Product[]> {
  const data = await queryFirstMatch(PRODUCT_QUERIES);
  const items: unknown[] = data?.productList?.items ?? [];

  return items
    .map((raw): Product | null => {
      const item = raw as Record<string, unknown>;
      if (typeof item.title !== "string" || typeof item.sku !== "string") {
        return null;
      }

      return {
        _path: asOptionalString(item._path),
        title: item.title,
        sku: item.sku,
        price: asNumber(item.price),
        currency: asOptionalString(item.currency) ?? "INR",
        category: asOptionalString(item.category) ?? "all",
        isVeg: Boolean(item.isVeg),
        description: asPlainText(item.description),
        allergens: asOptionalString(item.allergens),
        availability: asOptionalString(item.availability),
        displayOrder: asOptionalNumber(item.displayOrder),
        isActive: asOptionalBoolean(item.isActive),
        image: asImagePath(item.image),
      };
    })
    .filter((product): product is Product => product !== null);
}

export async function getCategories(): Promise<Category[]> {
  const data = await queryFirstMatch(CATEGORY_QUERIES);
  const items: unknown[] = data?.categoryList?.items ?? [];

  return items
    .map((raw): Category | null => {
      const item = raw as Record<string, unknown>;
      if (typeof item.title !== "string" || typeof item.slug !== "string") {
        return null;
      }

      return {
        _path: asOptionalString(item._path),
        title: item.title,
        slug: item.slug,
        displayOrder: asNumber(item.displayOrder),
        description: asPlainText(item.description),
        isActive: asOptionalBoolean(item.isActive),
        locale: asOptionalString(item.locale),
      };
    })
    .filter((category): category is Category => category !== null)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export async function getOffers(): Promise<Offer[]> {
  const data = await queryFirstMatch(OFFER_QUERIES);
  const items: unknown[] = data?.offerList?.items ?? [];

  return items
    .map((raw): Offer | null => {
      const item = raw as Record<string, unknown>;
      if (typeof item.title !== "string") {
        return null;
      }

      return {
        _path: asOptionalString(item._path),
        offerId: asOptionalString(item.offerId) ?? item.title,
        title: item.title,
        description: asPlainText(item.description),
        offerType: asOptionalString(item.offerType),
        value: asOptionalNumber(item.value),
        currency: asOptionalString(item.currency),
        promoCode: asOptionalString(item.promoCode),
        terms: asPlainText(item.terms),
        isActive: asOptionalBoolean(item.isActive),
      };
    })
    .filter((offer): offer is Offer => offer !== null);
}

export async function getStores(): Promise<Store[]> {
  const data = await queryFirstMatch(STORE_QUERIES);
  const items: unknown[] = data?.storeList?.items ?? [];

  return items
    .map((raw): Store | null => {
      const item = raw as Record<string, unknown>;
      if (typeof item.name !== "string") {
        return null;
      }

      return {
        _path: asOptionalString(item._path),
        storeId: asOptionalString(item.storeId) ?? item.name,
        name: item.name,
        // asPlainText accepts both a plain string and a { plaintext } object.
        address: asPlainText(item.address),
        phone: asOptionalString(item.phone),
        openingHours: asPlainText(item.openingHours),
        serviceModes: asOptionalString(item.serviceModes),
        timezone: asOptionalString(item.timezone),
        isActive: asOptionalBoolean(item.isActive),
        temporaryClosure: asOptionalBoolean(item.temporaryClosure),
      };
    })
    .filter((store): store is Store => store !== null);
}

export type MenuSource = "aem" | "seed" | "mixed";

export interface MenuData {
  products: Product[];
  categories: Category[];
  offers: Offer[];
  stores: Store[];
  source: MenuSource;
  /** Names of the content streams that fell back to seed data. */
  degraded: string[];
}

async function load<T>(
  name: string,
  loader: () => Promise<T[]>,
  seed: T[],
  degraded: string[]
): Promise<T[]> {
  try {
    const items = await loader();
    if (items.length === 0) {
      throw new Error(`${name} query returned no items`);
    }
    return items;
  } catch {
    degraded.push(name);
    return seed;
  }
}

/**
 * Loads the whole storefront experience in parallel. AEM stays the source of
 * truth; any stream that fails (endpoint down, model not deployed yet) is
 * replaced by bundled seed content so the site keeps working like the real one
 * while the AEM authoring stack is unavailable.
 */
export async function fetchMenuData(): Promise<MenuData> {
  const degraded: string[] = [];

  const [products, categories, offers, stores] = await Promise.all([
    load("products", getProducts, seedProducts, degraded),
    load("categories", getCategories, seedCategories, degraded),
    load("offers", getOffers, seedOffers, degraded),
    load("stores", getStores, seedStores, degraded),
  ]);

  const source: MenuSource =
    degraded.length === 0 ? "aem" : degraded.length === 4 ? "seed" : "mixed";

  return { products, categories, offers, stores, source, degraded };
}
