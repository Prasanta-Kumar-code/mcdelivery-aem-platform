import { GoldenArches } from "@/components/FoodArt";

const policyLinks = [
  { label: "Terms & Conditions", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Accessibility", href: "#" },
  { label: "Your Privacy Choices", href: "#" },
  { label: "CA Privacy Rights", href: "#" },
  { label: "Interest-Based Ads", href: "#" },
];

const companyLinks = [
  { label: "Contact Us", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Our History", href: "#" },
  { label: "Newsroom", href: "#" },
  { label: "Our Suppliers", href: "#" },
  { label: "Sustainability", href: "#" },
];

const appsLinks = [
  { label: "Download on the App Store", href: "#" },
  { label: "Get it on Google Play", href: "#" },
];

export default function Footer() {
  return (
    <footer className="site-footer" id="footer">
      <div className="site-footer__top">
        <div className="site-footer__brand">
          <span className="site-footer__arches">
            <GoldenArches stroke="#F0B04A" />
          </span>
          <p className="site-footer__brand-text">
            <span className="site-footer__brand-name">McDelivery</span>
            <span className="site-footer__brand-tag">Hot &amp; fresh, right away</span>
          </p>
          <p className="site-footer__brand-note">
            Learning project — built with AEM, Next.js, Spring Boot and PostgreSQL.
            <br />
            Not affiliated with or endorsed by McDonald&apos;s.
          </p>
        </div>

        <div className="site-footer__cols">
          <div className="site-footer__col">
            <h4 className="site-footer__col-title">Link</h4>
            <ul className="site-footer__col-list">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="site-footer__col">
            <h4 className="site-footer__col-title">Policy</h4>
            <ul className="site-footer__col-list">
              {policyLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="site-footer__col">
            <h4 className="site-footer__col-title">Tools</h4>
            <ul className="site-footer__col-list">
              {appsLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="site-footer__col site-footer__col--follow">
            <h4 className="site-footer__col-title">Follow us</h4>
            <div className="site-footer__social">
              <a href="#" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="#" aria-label="Twitter">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                </svg>
              </a>
              <a href="#" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2.16c3.2 0 3.58 0 4.85.07 1.27.05 1.8.25 2.22.45.55.24.96.48 1.41.9.47.43.83.88 1.04 1.48.2.6-.07 1.13-.52 1.44-.45.32-.98.52-1.54.52h-2.22c-2.12 0-3.77-1.65-3.77-3.77 0-1.18.64-2.08 1.64-2.52.43-.19.93-.36 1.44-.46l.23-.04c.37-.07.78-.1 1.16-.1h2.22c2.13 0 3.78 1.51 3.78 3.78 0 1.53-.77 2.82-1.64 3.56-.41.36-.76.76-1.01 1.24-.24.48-.03 1.03.44 1.27.48.23.98.35 1.52.35h2.22c2.15 0 3.8 1.65 3.8 3.78 0 1.36-.68 2.56-1.76 3.2.49.15.88.49 1.08 1 .2.51.05 1.07-.52 1.43-.58.36-1.2.58-1.84.58h-2.22c-2.13 0-3.77-1.68-3.77-3.88 0-1.3.72-2.47 1.99-3.13.54-.25 1.16-.47 1.76-.47h2.22c2.15 0 3.77 1.68 3.77 3.88 0 1.38-.71 2.61-1.88 3.32-.48.36-.8.79-.91 1.34l-.06.2c-.06.23-.18.43-.36.56l-.1.07c-.26.17-.56.26-.87.26h-2.22c-2.13 0-3.78-1.66-3.78-3.88 0-1.12.51-2.16 1.34-2.83.45-.35.92-.69 1.38-1.04.5-.38.94-.82 1.26-1.34.31-.51.31-1.09.05-1.62z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="site-footer__bottom">
        <p>&copy; 2026 McDelivery. A learning project — not affiliated with McDonald&apos;s.</p>
        <div className="site-footer__bottom-links">
          {policyLinks.map((link) => (
            <a key={link.label} href={link.href}>{link.label}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}
