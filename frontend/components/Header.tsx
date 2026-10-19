"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart-store";
import { NavigationLink, SiteSettings } from "@/types/site-content";
import { GoldenArches } from "./FoodArt";

export default function Header({
  settings,
  navLinks,
  showCart = true,
  showAccount = true,
}: {
  readonly settings: SiteSettings;
  readonly navLinks: NavigationLink[];
  readonly showCart?: boolean;
  readonly showAccount?: boolean;
}) {
  const count = useCartStore((state) => state.count);
  const openCart = useCartStore((state) => state.openCart);
  const [menuOpen, setMenuOpen] = useState(false);

  const renderLink = (link: NavigationLink, closeMenu = false) => (
    <a
      key={`${link.linkGroup}-${link.label}-${link.href}`}
      className={`site-header__nav-link${link.isCta ? " site-header__nav-link--cta" : ""}`}
      href={link.href}
      target={link.externalLink ? "_blank" : undefined}
      rel={link.externalLink ? "noreferrer" : undefined}
      onClick={closeMenu ? () => setMenuOpen(false) : undefined}
    >
      {link.label}
    </a>
  );

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <button
          type="button"
          className="site-header__brand"
          aria-label={`${settings.brandName} home`}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="site-header__brand-mark">
            <GoldenArches stroke="#F0B04A" className="site-header__arches" />
          </span>
          <span className="site-header__brand-text">
            <span className="site-header__brand-name">{settings.brandName}</span>
            {settings.brandTagline && (
              <span className="site-header__brand-tag">{settings.brandTagline}</span>
            )}
          </span>
        </button>

        <nav
          className={`site-header__nav${menuOpen ? " site-header__nav--open" : ""}`}
          aria-label="Main"
        >
          {navLinks.map((link) => renderLink(link))}
        </nav>

        <div className="site-header__actions">
          {showAccount && (
            <button
              type="button"
              className="site-header__account"
              aria-label="Open account menu"
            >
              <span className="site-header__account-mark">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx={12} cy={8} r={4} />
                  <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
                </svg>
              </span>
              <span className="site-header__account-label">{settings.accountLabel}</span>
            </button>
          )}

          {showCart && (
            <button
              type="button"
              className="site-header__cart"
              onClick={openCart}
              aria-label={`Open cart with ${count} item${count === 1 ? "" : "s"}`}
            >
              <span aria-hidden="true">
                <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 8h5l2 4M11 4h6l2 4M17 4h2l1 4M5 8h5l2 4M11 4h6l2 4M17 4h2l1 4" />
                  <circle cx={30} cy={7} r={4} />
                  <circle cx={26} cy={17} r={4} />
                  <circle cx={22} cy={26} r={4} />
                  <path d="M22 26h6l-2 4" />
                </svg>
              </span>
              <span className="site-header__cart-count">{count}</span>
            </button>
          )}

          <div
            className="site-header__mobile-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span className="sr-only">Menu</span>
            <span className={`site-header__hamburger${menuOpen ? " site-header__hamburger--active" : ""}`} />
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="site-header__drawer" onClick={() => setMenuOpen(false)}>
          <div className="site-header__drawer-inner">
            {navLinks.map((link) => renderLink(link, true))}
          </div>
        </div>
      )}
    </header>
  );
}
