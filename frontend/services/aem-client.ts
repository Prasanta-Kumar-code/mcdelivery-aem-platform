/**
 * Low-level AEM GraphQL transport shared by every server-side content reader.
 *
 * The public site never calls AEM from the browser: the endpoint and the author
 * credentials stay on the server, and pages receive plain typed content.
 */

const aemEndpoint =
  process.env.AEM_GRAPHQL_ENDPOINT ?? process.env.NEXT_PUBLIC_AEM_GRAPHQL;

const REQUEST_TIMEOUT_MS = 6000;

export function getAemHeaders(): Record<string, string> {
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

export async function requestAem(query: string): Promise<unknown> {
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
export type AemQueryResult = Record<
  string,
  { items?: unknown[] } | undefined
>;

/**
 * The AEM GraphQL schema evolves with the authored Content Fragment Models, so
 * every read is expressed as ordered query variants. The first variant the
 * endpoint accepts wins; if none do, the caller falls back to seed content.
 */
export async function queryFirstMatch(
  queries: string[]
): Promise<AemQueryResult> {
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

export function asPlainText(value: unknown): string | undefined {
  if (typeof value === "string") {
    return value;
  }
  if (value && typeof value === "object" && "plaintext" in value) {
    const plaintext = (value as { plaintext?: unknown }).plaintext;
    return typeof plaintext === "string" ? plaintext : undefined;
  }
  return undefined;
}

export function asImagePath(value: unknown): { _path: string } | undefined {
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

export function asNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function asOptionalNumber(value: unknown): number | undefined {
  return value === undefined || value === null ? undefined : asNumber(value);
}

export function asOptionalBoolean(value: unknown): boolean | undefined {
  return value === undefined || value === null ? undefined : Boolean(value);
}

export function asOptionalString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

/** Reads the first active item of a list query, sorted by display order. */
export function firstActiveItem(data: AemQueryResult, field: string): Record<string, unknown> | undefined {
  const items = (data?.[field]?.items ?? []) as unknown[];

  return items
    .map((item) => item as Record<string, unknown>)
    .filter((item) => item.isActive !== false)
    .sort(
      (a, b) => asNumber(a.displayOrder) - asNumber(b.displayOrder)
    )[0];
}
