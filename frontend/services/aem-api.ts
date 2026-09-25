const aemEndpoint =
  process.env.AEM_GRAPHQL_ENDPOINT ?? process.env.NEXT_PUBLIC_AEM_GRAPHQL;

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

async function requestAem(query: string) {
  if (!aemEndpoint) {
    throw new Error("AEM_GRAPHQL_ENDPOINT is not configured");
  }

  const response = await fetch(aemEndpoint, {
      method: "POST",
      headers: getAemHeaders(),
      body: JSON.stringify({
        query,
      }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const message = response.status === 401
      ? "AEM GraphQL authentication failed. Check the local AEM username and password."
      : `AEM GraphQL request failed with status ${response.status}`;

    throw new Error(message);
  }

  return response.json();
}

export async function getProducts() {
  return requestAem(`
          query {
            productList {
              items {
                title
                sku
                price
                category
                isVeg

                image {
                  ... on ImageRef {
                    _path
                  }
                }

                description {
                  plaintext
                }
              }
            }
          }
        `);
}

export async function getCategories() {
  return requestAem(`
          query {
            categoryList {
              items {
                title
                slug
                displayOrder
              }
            }
          }
        `);
}