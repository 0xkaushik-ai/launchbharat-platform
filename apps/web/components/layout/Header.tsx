"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogoMark, Button } from "@/components/ui";
import type { NavItem } from "@/lib/content";
import type { User } from "@supabase/supabase-js";

export default function Header({
  nav,
  utilityNav,
  announcement,
  user,
}: {
  nav: NavItem[];
  utilityNav: NavItem[];
  announcement: { enabled: boolean; text: string; href: string };
  user: User | null;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const handleSignOut = async () => {
    const { createClient } = await import("@/lib/supabase-browser");
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu on route change and lock scroll while open
  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="relative z-50">
      {/* Utility bar — collapses once scrolled */}
      {/* Utility bar */}
      <div className="border-b border-line bg-slate-50 text-ink-600">
        <div className="container-lb flex items-center justify-between py-1.5 text-[11px]">
          <p className="hidden font-mono uppercase tracking-[0.18em] text-ink-400 sm:block">
            A nationwide startup &amp; innovation movement
          </p>
          <nav aria-label="Utility">
            <ul className="flex items-center gap-4">
              {utilityNav.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={`transition hover:text-saffron-500 ${
                      item.label === "हिन्दी" ? "font-devanagari" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Main bar */}
      <div className={`relative z-10 border-b border-line bg-white shadow-sm transition-[padding] duration-300 ${
        scrolled ? "py-2.5" : "py-4"
      }`}>
        <div className="container-lb flex items-center justify-between gap-6">
          <Link href="/" className="shrink-0" aria-label="LaunchBharat — home">
            <LogoMark variant="light" size={scrolled ? "sm" : "md"} />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-6">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`group pb-1 border-b-2 border-transparent transition hover:border-saffron-500 hover:text-saffron-600 text-[13px] font-medium tracking-wide ${
                      isActive(item.href) ? "text-saffron-600 border-saffron-600" : "text-ink-800"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative group hidden sm:block">
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-saffron-100 text-saffron-700 hover:bg-saffron-200 transition focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:ring-offset-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 focus-within:opacity-100 focus-within:visible">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-ink-800 hover:bg-slate-50 transition"
                  >
                    Your Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <Button
                href="/register"
                variant="primary"
                size="sm"
                className="hidden sm:inline-flex"
              >
                Register now
              </Button>
            )}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label="Open menu"
              className="inline-flex h-10 w-10 items-center justify-center text-ink-950 lg:hidden"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3 6h18M3 12h18M3 18h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Announcement ribbon */}
      {announcement.enabled && (
        <div className="sticky top-[60px] border-b border-saffron-300/40 bg-slate-50 border-line text-center">
          <Link
            href={announcement.href}
            className="container-lb flex items-center justify-center gap-2 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-saffron-600 transition hover:text-saffron-700"
          >
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
            />
            {announcement.text} <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}

      {/* Full-screen mobile menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-white"
        >
          <div aria-hidden="true" className="hidden" />
          <div className="container-lb relative flex items-center justify-between py-4">
            <LogoMark variant="light" size="sm" />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="inline-flex h-10 w-10 items-center justify-center text-ink-950"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <nav aria-label="Primary mobile" className="container-lb relative flex-1 overflow-y-auto py-8">
            <ul className="flex flex-col gap-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`font-display block border-b border-line py-4 text-2xl font-bold tracking-tight transition hover:text-saffron-600 ${
                      isActive(item.href) ? "text-saffron-600" : "text-ink-950"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {utilityNav.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={`text-sm text-ink-600 transition hover:text-saffron-600 ${
                      item.label === "हिन्दी" ? "font-devanagari" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="container-lb relative pb-8">
            {user ? (
              <div className="space-y-3">
                <Button href="/profile" variant="primary" size="lg" className="w-full">
                  View Profile
                </Button>
                <Button onClick={handleSignOut} variant="secondary" size="lg" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                  Sign out
                </Button>
              </div>
            ) : (
              <Button href="/register" variant="primary" size="lg" className="w-full">
                Register now
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
