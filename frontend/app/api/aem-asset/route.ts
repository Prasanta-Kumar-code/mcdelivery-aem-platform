import { NextRequest } from "next/server";

function getAemHeaders(): Record<string, string> {
  const username = process.env.AEM_GRAPHQL_USERNAME;
  const password = process.env.AEM_GRAPHQL_PASSWORD;

  if (!username || !password) {
    return {};
  }

  const credentials = `${username}:${password}`;
  return {
    Authorization: `Basic ${Buffer.from(credentials).toString("base64")}`,
  };
}

function getAemOrigin(): string {
  const endpoint = process.env.AEM_GRAPHQL_ENDPOINT ?? process.env.NEXT_PUBLIC_AEM_GRAPHQL;

  if (!endpoint) {
    throw new Error("AEM GraphQL endpoint is not configured");
  }

  return new URL(endpoint).origin;
}

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path");

  if (!path || !path.startsWith("/content/dam/") || path.includes("..")) {
    return new Response("Invalid AEM asset path", { status: 400 });
  }

  try {
    const response = await fetch(`${getAemOrigin()}${path}`, {
      headers: getAemHeaders(),
      cache: "no-store",
    });

    if (!response.ok) {
      return new Response("AEM asset unavailable", { status: response.status });
    }

    const contentType = response.headers.get("content-type") ?? "application/octet-stream";
    if (!contentType.startsWith("image/")) {
      return new Response("AEM asset is not an image", { status: 415 });
    }

    return new Response(response.body, {
      headers: {
        "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
        "Content-Type": contentType,
      },
    });
  } catch {
    return new Response("Unable to reach AEM asset service", { status: 502 });
  }
}