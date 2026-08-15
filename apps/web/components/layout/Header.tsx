"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LogoMark, Button } from "@/components/ui";
import { createClient, isSupabaseConfigured } from "@/lib/supabase-browser";
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
  const [accountOpen, setAccountOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(user);
  const pathname = usePathname();
  const router = useRouter();
  const accountRef = useRef<HTMLDivElement>(null);
  const supabaseConfigured = isSupabaseConfigured();
  const isHome = pathname === "/";

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setAccountOpen(false);
    router.push("/");
    router.refresh();
  };

  useEffect(() => {
    const onScroll = () => {
      const nextScrolled = window.scrollY > 16;
      setScrolled((current) => (current === nextScrolled ? current : nextScrolled));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!supabaseConfigured) return;
    const supabase = createClient();
    void supabase.auth.getUser().then(({ data }) => setCurrentUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setCurrentUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, [supabaseConfigured]);

  useEffect(() => {
    setMenuOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setAccountOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!accountOpen) return;
    const onPointer = (event: MouseEvent) => {
      if (!accountRef.current?.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    };
    window.addEventListener("mousedown", onPointer);
    return () => window.removeEventListener("mousedown", onPointer);
  }, [accountOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className={`sticky top-0 z-50 pb-2 ${isHome ? "home-header" : ""}`}>
      <div className={`hidden border-b border-white/70 bg-white/70 text-ink-600 backdrop-blur-xl sm:block ${
        isHome ? "home-utility-bar" : ""
      }`}>
        <div className="container-lb flex items-center justify-between py-1.5 text-[11px]">
          <p className="flex items-center gap-2 font-mono uppercase tracking-[0.18em] text-ink-500">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(56,189,248,0.75)]" aria-hidden="true" />
            A nationwide startup &amp; innovation movement
          </p>
          <nav aria-label="Utility">
            <ul className="flex items-center gap-4">
              {utilityNav.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={`transition hover:text-iris-600 ${
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

      <div className={`px-2 transition-[padding] duration-300 sm:px-4 ${
        scrolled ? "pt-2" : "pt-3"
      }`}>
        <div className="container-lb !px-0">
          <div className={`water-nav-panel flex items-center justify-between gap-3 px-3 transition-[padding,background-color,box-shadow,border-radius] duration-300 sm:px-4 lg:gap-5 lg:px-5 ${
            scrolled ? "water-nav-panel--scrolled py-1.5" : "py-2"
          }`}>
            <Link
              href="/"
              className="water-logo group shrink-0"
              aria-label="LaunchBharat — home"
            >
              <LogoMark
                variant="light"
                size={scrolled ? "lg" : "xl"}
                className="transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </Link>

            <nav aria-label="Primary" className="hidden min-w-0 xl:block">
              <ul className="flex items-center justify-end gap-0.5">
                {nav.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`water-nav-link whitespace-nowrap px-2.5 py-2 text-[13px] font-medium tracking-wide xl:px-3 ${
                          active ? "water-nav-link--active" : ""
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="relative z-10 flex items-center gap-2 sm:gap-3">
              {currentUser ? (
                <div className="relative hidden sm:block" ref={accountRef}>
                  <button
                    type="button"
                    aria-expanded={accountOpen}
                    aria-haspopup="menu"
                    onClick={() => setAccountOpen((open) => !open)}
                    className="water-icon-button flex h-10 w-10 items-center justify-center rounded-full text-iris-600 transition focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span className="sr-only">Open account menu</span>
                  </button>
                  {accountOpen && (
                    <div
                      role="menu"
                      className="absolute right-0 mt-3 w-48 overflow-hidden rounded-2xl border border-white/80 bg-white/90 py-1 shadow-[0_20px_55px_-20px_rgb(37_46_86/0.35)] backdrop-blur-2xl"
                    >
                      <Link
                        href="/portal"
                        role="menuitem"
                        className="block px-4 py-2.5 text-sm text-ink-800 transition hover:bg-cyan-400/10"
                      >
                        Your portal
                      </Link>
                      <button
                        onClick={handleSignOut}
                        role="menuitem"
                        className="block w-full px-4 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  href="/register"
                  variant="primary"
                  size="sm"
                  className="hidden shrink-0 whitespace-nowrap shadow-[0_12px_28px_-12px_rgba(124,58,237,0.65)] sm:inline-flex"
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
                className="water-icon-button inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-950 transition xl:hidden"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M4 7h16M7 12h13M10 17h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {announcement.enabled && !isHome && (
        <div className="container-lb mt-2 text-center">
          <Link
            href={announcement.href}
            className="water-announcement mx-auto flex w-fit max-w-full items-center justify-center gap-2 rounded-full px-4 py-2 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-iris-600 transition hover:text-iris-500 sm:text-[11px] sm:tracking-[0.16em]"
          >
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
            />
            {announcement.text} <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}

      {menuOpen && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className="water-mobile-menu fixed inset-0 z-50 flex flex-col overflow-hidden bg-white"
        >
          <div className="container-lb relative flex items-center justify-between py-4">
            <div className="water-logo">
              <LogoMark variant="light" size="xl" />
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="water-icon-button inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-950"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <nav aria-label="Primary mobile" className="container-lb relative flex-1 overflow-y-auto py-6">
            <ul className="flex flex-col">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`water-mobile-link font-display block border-b border-white/70 py-4 text-2xl font-bold tracking-tight transition hover:text-iris-600 ${
                      isActive(item.href) ? "text-iris-600" : "text-ink-950"
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
                    className={`text-sm text-ink-600 transition hover:text-iris-600 ${
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
            {currentUser ? (
              <div className="space-y-3">
                <Button href="/portal" variant="primary" size="lg" className="w-full">
                  My application
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
