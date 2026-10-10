"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogoMark } from "./Logo";
import { site } from "@/lib/site";

const links = [
  { href: "/#work", label: "Work", match: "/work", color: "var(--pink)" },
  { href: "/journal", label: "Journal", match: "/journal", color: "var(--violet)" },
  { href: "/about", label: "About", match: "/about", color: "var(--blue)" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // close the menu on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // lock scroll + close on Escape while the mobile menu is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header className="site-header">
        <div className="container">
          <Link href="/" className="logo" aria-label={`${site.name}, home`}>
            <LogoMark />
            <span>{site.handle}</span>
          </Link>

          <nav className="nav" aria-label="Primary">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={pathname.startsWith(l.match) ? "page" : undefined}
              >
                {l.label}
              </Link>
            ))}
            <a className="btn btn-round" href={site.resume}>
              Résumé ↓
            </a>
          </nav>

          <button
            type="button"
            className="menu-toggle"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      {open && (
        <div id="mobile-menu" className="mobile-menu grain" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="mobile-menu__top">
            <span className="label">Menu</span>
            <button
              type="button"
              className="menu-toggle"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              style={{ display: "flex" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <line x1="4" y1="4" x2="20" y2="20" stroke="var(--ink)" strokeWidth="2.2" />
                <line x1="20" y1="4" x2="4" y2="20" stroke="var(--ink)" strokeWidth="2.2" />
              </svg>
            </button>
          </div>
          <nav className="mobile-menu__links" aria-label="Mobile">
            {links.map((l, i) => (
              <Link key={l.href} href={l.href}>
                <span className="num" style={{ color: l.color }}>
                  0{i + 1}
                </span>
                <span className="big">{l.label}</span>
              </Link>
            ))}
            <a href={site.resume}>
              <span className="num" style={{ color: "var(--amber)" }}>
                04
              </span>
              <span className="big">Résumé</span>
            </a>
          </nav>
          <div className="mobile-menu__foot">
            <span className="label">@{site.handle}</span>
            <span className="spectrum" style={{ width: 80, height: 4 }} />
          </div>
        </div>
      )}
    </>
  );
}
