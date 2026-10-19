import { PageSection, SiteSettings } from "@/types/site-content";
import { Store } from "@/types/store";

export default function StoreLocator({
  stores,
  section,
  settings,
}: {
  readonly stores: Store[];
  readonly section: PageSection;
  readonly settings: SiteSettings;
}) {
  const active = stores.filter((store) => store.isActive !== false);

  return (
    <section className="stores" id="locations" aria-labelledby="locations-heading">
      <div className="stores__inner">
        <div className="stores__title-row">
          {section.eyebrow && <p className="eyebrow">{section.eyebrow}</p>}
          <h2 id="locations-heading">{section.heading}</h2>
        </div>

        {active.length === 0 ? (
          <p className="stores__empty">
            {section.emptyMessage ?? "No active stores right now."}
          </p>
        ) : (
          <div className="stores__cards">
            {active.map((store) => (
              <article className="store" key={store.storeId ?? store.name}>
                <h3 className="store__name">{store.name}</h3>
                {store.address && <p className="store__address">{store.address}</p>}
                {store.phone && <p className="store__phone">{store.phone}</p>}
                {store.openingHours && (
                  <p className="store__hours">{store.openingHours}</p>
                )}
                {store.serviceModes && (
                  <p className="store__modes">
                    {store.serviceModes.split(",").map((mode) => (
                      <span className="store__mode-tag" key={mode.trim()}>
                        {mode.trim()}
                      </span>
                    ))}
                  </p>
                )}
                {!store.temporaryClosure && settings.storeBadgeLabel && (
                  <span className="store__badge">{settings.storeBadgeLabel}</span>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
