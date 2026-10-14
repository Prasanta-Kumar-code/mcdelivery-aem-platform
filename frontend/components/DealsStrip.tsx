"use client";

import { useState } from "react";
import { Offer } from "@/types/offer";
import { formatMoney } from "@/lib/format";

export default function DealsStrip({
  offers,
}: {
  offers: Offer[];
}) {
  const [copied, setCopied] = useState<string | null>(null);

  const active =
    offers.length > 0
      ? offers
          .filter((offer) => offer.isActive)
          .sort((a, b) => (a.value ?? 0) - (b.value ?? 0))
          .slice(0, 3)
      : [];

  return (
    <section className="deals" id="deals" aria-labelledby="deals-heading">
      <div className="deals__inner">
        <div className="deals__title-row">
          <p className="eyebrow">Today&apos;s specials</p>
          <h2 id="deals-heading">Deals that hit the spot</h2>
        </div>

        {active.length === 0 ? (
          <p className="deals__empty">No active offers right now. Check back soon.</p>
        ) : (
          <div className="deals__grid">
            {active.map((offer) => (
              <article className="deal" key={offer.offerId ?? offer.title}>
                <div className="deal__badge">{offer.offerType?.toUpperCase()}</div>
                <h3 className="deal__title">{offer.title}</h3>
                <p className="deal__desc">{offer.description}</p>
                <div className="deal__actions">
                  <span className="deal__code">{offer.promoCode}</span>
                  <button
                    type="button"
                    className="btn btn--small"
                    onClick={() => {
                      setCopied(offer.promoCode ?? "");
                      setTimeout(() => setCopied(null), 1600);
                    }}
                  >
                    {copied === offer.promoCode ? "Copied" : "Copy code"}
                  </button>
                </div>
                {offer.value !== undefined && (
                  <p className="deal__save">Save <span className="deal__save-amount">{formatMoney(offer.value)}</span></p>
                )}
                {offer.terms && <p className="deal__terms">{offer.terms}</p>}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
