export default function SourceBanner({
  degraded,
}: {
  degraded: string[];
  products: { title: string }[];
}) {
  if (degraded.length === 0) return null;

  return (
    <div className="source-banner" role="status">
      <div className="source-banner__inner">
        {" "}
        <span className="source-banner__mark">{degraded.length} streaming content source{degraded.length > 1 ? "s" : ""} couldn&apos;t be reached, so we&apos;re showing bundled seed content</span>
        {(degraded.length > 0 || degraded.includes("products")) && (
          <>
            <span className="source-banner__hint">
              Start the AEM SDK (author + publish) and configure AEM_GRAPHQL_ENDPOINT to
              load the authored menu instead.
            </span>
            <button
              type="button"
              className="source-banner__dismiss"
            >
              Dismiss
            </button>
          </>
        )}
      </div>
    </div>
  );
}
