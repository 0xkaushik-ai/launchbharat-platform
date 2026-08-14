"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LogoMark, Button } from "@/components/ui";
import { createClient } from "@/lib/supabase-browser";
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

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setAccountOpen(false);
    router.push("/");
    router.refresh();
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    void supabase.auth.getUser().then(({ data }) => setCurrentUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setCurrentUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

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
    <header className="sticky top-0 z-50">
      <div className="hidden border-b border-line/80 bg-paper/90 text-ink-600 backdrop-blur-md sm:block">
        <div className="container-lb flex items-center justify-between py-1.5 text-[11px]">
          <p className="font-mono uppercase tracking-[0.18em] text-ink-400">
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

      <div className={`border-b border-line/80 bg-white/80 shadow-[0_1px_0_rgb(15_23_42/0.03)] backdrop-blur-xl transition-[padding] duration-300 ${
        scrolled ? "py-2.5" : "py-3.5"
      }`}>
        <div className="container-lb flex items-center justify-between gap-6">
          <Link href="/" className="shrink-0" aria-label="LaunchBharat — home">
            <LogoMark variant="light" size={scrolled ? "sm" : "md"} />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`rounded-full px-3 py-2 text-[13px] font-medium tracking-wide transition ${
                      isActive(item.href)
                        ? "bg-iris-100 text-iris-600"
                        : "text-ink-800 hover:bg-mist hover:text-ink-950"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="relative hidden sm:block" ref={accountRef}>
                <button
                  type="button"
                  aria-expanded={accountOpen}
                  aria-haspopup="menu"
                  onClick={() => setAccountOpen((open) => !open)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-iris-100 text-iris-600 transition hover:bg-iris-100/80 focus:outline-none"
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
                    className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-line bg-white py-1 shadow-[0_16px_40px_-20px_rgb(15_23_42/0.3)]"
                  >
                    <Link
                      href="/portal"
                      role="menuitem"
                      className="block px-4 py-2.5 text-sm text-ink-800 transition hover:bg-mist"
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
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-950 transition hover:bg-mist lg:hidden"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3 6h18M3 12h18M3 18h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {announcement.enabled && (
        <div className="border-b border-line bg-lilac/80 text-center backdrop-blur-sm">
          <Link
            href={announcement.href}
            className="container-lb flex items-center justify-center gap-2 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-iris-600 transition hover:text-iris-500"
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
          className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-white"
        >
          <div className="container-lb relative flex items-center justify-between py-4">
            <LogoMark variant="light" size="sm" />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-950 hover:bg-mist"
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
                    className={`font-display block border-b border-line py-4 text-2xl font-bold tracking-tight transition hover:text-iris-600 ${
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
