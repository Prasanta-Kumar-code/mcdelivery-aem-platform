import { GoldenArches } from "@/components/FoodArt";

export default function Hero({
  variant,
}: {
  /** "campaign" renders a promotion-style hero, "deal" renders a deal banner */
  variant?: "campaign" | "deal";
}) {
  return (
    <section
      className={`hero hero--${(variant ?? "campaign")}${variant === "deal" ? " hero--deal" : ""}`}
      id="hero"
      aria-labelledby="hero-heading"
    >
      <div className="hero__inner">
        <div className="hero__copy">
          {variant === "deal" ? (
            <>
              <p className="hero__eyebrow">Today only</p>
              <h1 id="hero-heading">
                <span className="hero__headline">Free delivery over ₹499</span>
                <span className="hero__sub">on orders placed before 9 PM</span>
              </h1>
              <p className="hero__desc">
                Build your basket now and get your favourite McDelivery meal at
                your doorstep, hot and ready.
              </p>
            </>
          ) : (
            <>
              <p className="hero__eyebrow">Made for your moment</p>
              <h1 id="hero-heading"><span className="hero__headline">Good food. Good mood.</span></h1>
              <p className="hero__desc">
                Freshly grilled, made to order. Browse the menu, build your
                favourite meal and get it delivered hot.
              </p>
              <div className="hero__actions">
                <a className="btn btn--primary" href="#menu">
                  Order now
                </a>
                <a className="btn btn--ghost" href="#deals">
                  See the deals
                </a>
              </div>
            </>
          )}
        </div>

        <div className="hero__art" aria-hidden="true">
          <GoldenArches stroke="#F0B04A" className="hero__arches" />
          <div className="hero__art-floating">
            <span className="hero__tag">Free delivery over ₹499</span>
          </div>
          <div className="hero__art-stack">
            <div className="hero__art-stack-item hero__art-stack-burger">
              <Burger />
            </div>
            <div className="hero__art-stack-item">
              <Fries />
            </div>
            <div className="hero__art-stack-item">
              <GoldenArches stroke="#F0B04A" className="hero__art-stack-item-burger" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Fries() {
  return (
    <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g>
        <path d="M28 72 L88 72 L92 66 L32 66 Z" fill="#C62828" />
        <path d="M34 80 L82 80 L86 74 L30 74 Z" fill="#D32F2F" />
        <g>
          <rect x={38} y={20} width={6} height={26} rx={2} fill="#F0B04A" />
          <rect x={52} y={16} width={6} height={26} rx={2} fill="#F0B04A" />
          <rect x={66} y={22} width={6} height={22} rx={2} fill="#F0B04A" />
          <rect x={80} y={18} width={6} height={26} rx={2} fill="#F0B04A" />
          <g>
            <rect x={36} y={16} width={8} height={4} rx={2} transform="rotate(-18 36 16)" fill="#FFC72C" />
            <rect x={32} y={16} width={8} height={4} rx={2} transform="rotate(-18 32 16)" fill="#FFC72C" />
            <rect x={50} y={12} width={8} height={4} rx={2} transform="rotate(-18 50 12)" fill="#FFC72C" />
            <rect x={46} y={12} width={8} height={4} rx={2} transform="rotate(-18 46 12)" fill="#FFC72C" />
            <rect x={64} y={16} width={8} height={4} rx={2} transform="rotate(-18 64 16)" fill="#FFC72C" />
            <rect x={60} y={16} width={8} height={4} rx={2} transform="rotate(-18 60 16)" fill="#FFC72C" />
            <rect x={78} y={12} width={8} height={4} rx={2} transform="rotate(-18 78 12)" fill="#FFC72C" />
            <rect x={74} y={12} width={8} height={4} rx={2} transform="rotate(-18 74 12)" fill="#FFC72C" />
          </g>
        </g>
        <text x={60} y={46} textAnchor="middle" fontSize={18} fontWeight={800} fill="#8F1420" fontFamily="ui-sans-serif, system-ui, sans-serif">DIPS</text>
      </g>
    </svg>
  );
}

function Burger() {
  return (
    <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g>
        <rect x={20} y={20} width={10} height={55} rx={2} fill="#F0B04A" />
        <rect x={60} y={16} width={40} height={40} rx={6} fill="#F0B04A" />
        <rect x={96} y={20} width="8" height="36" rx="2" fill="#3A506B" />
        <rect x={20} y={20} width="8" height="55" rx={2} fill="#3A506B" />
        <path d="M86 12 L86 22" stroke="#8F1420" strokeWidth={6} strokeLinecap="round" />
        <rect x={90} y={8} width={6} height={6} rx={2} fill="#F0B04A" />
        <rect x={72} y={46} width={10} height="6" rx={2} fill="#F0B04A" />
      </g>
    </svg>
  );
}
