import { ReactNode } from "react";
import { GoldenArches } from "@/components/FoodArt";
import {
  NavigationLink,
  SiteSettings,
} from "@/types/site-content";

function linksFor(links: NavigationLink[], group: string): NavigationLink[] {
  return links.filter((link) => link.linkGroup === group);
}

const SOCIAL_ICONS: Record<string, ReactNode> = {
  facebook: (
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  ),
  twitter: (
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  ),
  instagram: (
    <path d="M12 2.16c3.2 0 3.58 0 4.85.07 1.27.05 1.8.25 2.22.45.55.24.96.48 1.41.9.47.43.83.88 1.04 1.48.2.6-.07 1.13-.52 1.44-.45.32-.98.52-1.54.52h-2.22c-2.12 0-3.77-1.65-3.77-3.77 0-1.18.64-2.08 1.64-2.52.43-.19.93-.36 1.44-.46l.23-.04c.37-.07.78-.1 1.16-.1h2.22c2.13 0 3.78 1.51 3.78 3.78 0 1.53-.77 2.82-1.64 3.56-.41.36-.76.76-1.01 1.24-.24.48-.03 1.03.44 1.27.48.23.98.35 1.52.35h2.22c2.15 0 3.8 1.65 3.8 3.78 0 1.36-.68 2.56-1.76 3.2.49.15.88.49 1.08 1 .2.51.05 1.07-.52 1.43-.58.36-1.2.58-1.84.58h-2.22c-2.13 0-3.77-1.68-3.77-3.88 0-1.3.72-2.47 1.99-3.13.54-.25 1.16-.47 1.76-.47h2.22c2.15 0 3.77 1.68 3.77 3.88 0 1.38-.71 2.61-1.88 3.32-.48.36-.8.79-.91 1.34l-.06.2c-.06.23-.18.43-.36.56l-.1.07c-.26.17-.56.26-.87.26h-2.22c-2.13 0-3.78-1.66-3.78-3.88 0-1.12.51-2.16 1.34-2.83.45-.35.92-.69 1.38-1.04.5-.38.94-.82 1.26-1.34.31-.51.31-1.09.05-1.62z" />
  ),
};

function LinkColumn({
  title,
  links,
}: {
  readonly title?: string;
  readonly links: NavigationLink[];
}) {
  if (links.length === 0) {
    return null;
  }

  return (
    <div className="site-footer__col">
      {title && <h4 className="site-footer__col-title">{title}</h4>}
      <ul className="site-footer__col-list">
        {links.map((link) => (
          <li key={`${link.linkGroup}-${link.label}-${link.href}`}>
            <a
              href={link.href}
              target={link.externalLink ? "_blank" : undefined}
              rel={link.externalLink ? "noreferrer" : undefined}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer({
  settings,
  links,
  showSocial = true,
}: {
  readonly settings: SiteSettings;
  readonly links: NavigationLink[];
  readonly showSocial?: boolean;
}) {
  const companyLinks = linksFor(links, "footer-company");
  const policyLinks = linksFor(links, "footer-policy");
  const toolsLinks = linksFor(links, "footer-tools");
  const socialLinks = linksFor(links, "footer-social");
  const bottomLinks = linksFor(links, "footer-bottom");

  return (
    <footer className="site-footer" id="footer">
      <div className="site-footer__top">
        <div className="site-footer__brand">
          <span className="site-footer__arches">
            <GoldenArches stroke="#F0B04A" />
          </span>
          <p className="site-footer__brand-text">
            <span className="site-footer__brand-name">{settings.brandName}</span>
            {settings.brandTagline && (
              <span className="site-footer__brand-tag">{settings.brandTagline}</span>
            )}
          </p>
          {settings.footerNote && (
            <p className="site-footer__brand-note">{settings.footerNote}</p>
          )}
        </div>

        <div className="site-footer__cols">
          <LinkColumn title={settings.footerCompanyTitle} links={companyLinks} />
          <LinkColumn title={settings.footerPolicyTitle} links={policyLinks} />
          <LinkColumn title={settings.footerToolsTitle} links={toolsLinks} />

          {showSocial && socialLinks.length > 0 && (
            <div className="site-footer__col site-footer__col--follow">
              <h4 className="site-footer__col-title">{settings.footerSocialTitle}</h4>
              <div className="site-footer__social">
                {socialLinks.map((link) => {
                  const icon = link.iconKey ? SOCIAL_ICONS[link.iconKey] : undefined;

                  return (
                    <a
                      key={`${link.linkGroup}-${link.label}-${link.href}`}
                      href={link.href}
                      aria-label={link.label}
                      target={link.externalLink ? "_blank" : undefined}
                      rel={link.externalLink ? "noreferrer" : undefined}
                    >
                      {icon ? (
                        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          {icon}
                        </svg>
                      ) : (
                        link.label
                      )}
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="site-footer__bottom">
        {settings.copyright && <p>{settings.copyright}</p>}
        {bottomLinks.length > 0 && (
          <div className="site-footer__bottom-links">
            {bottomLinks.map((link) => (
              <a
                key={`${link.linkGroup}-${link.label}-${link.href}`}
                href={link.href}
                target={link.externalLink ? "_blank" : undefined}
                rel={link.externalLink ? "noreferrer" : undefined}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}
