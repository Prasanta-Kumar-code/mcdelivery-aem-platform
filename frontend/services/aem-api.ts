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
import {
  asImagePath,
  asNumber,
  asOptionalBoolean,
  asOptionalNumber,
  asOptionalString,
  asPlainText,
  queryFirstMatch,
} from "@/services/aem-client";

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
