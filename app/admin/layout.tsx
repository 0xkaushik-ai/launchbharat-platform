"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { LogoMark } from "@/components/ui";

const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin" },
  { label: "User Management", href: "/admin/users" },
  { label: "Event Management", href: "/admin/events" },
  { label: "Ticket Management", href: "/admin/tickets" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  // Don't show sidebar on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-line bg-white lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b border-line px-5 py-4">
            <Link href="/" className="flex items-center gap-2">
              <LogoMark variant="light" size="sm" />
            </Link>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400">
              Admin Panel
            </p>
          </div>

          <nav className="flex-1 px-3 py-4">
            <ul className="space-y-1">
              {ADMIN_NAV.map((item) => {
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                        isActive
                          ? "bg-saffron-100 text-saffron-700"
                          : "text-ink-600 hover:bg-slate-50 hover:text-ink-950"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t border-line px-3 py-4">
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-600 transition hover:bg-red-50 hover:text-red-600"
            >
              Sign out
            </button>
            <Link
              href="/"
              className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-600 transition hover:bg-slate-50 hover:text-ink-950"
            >
              View Website
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-white px-4 py-3 lg:hidden">
          <LogoMark variant="light" size="sm" />
          <div className="flex gap-2">
            {ADMIN_NAV.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-2 py-1.5 text-xs font-medium ${
                    isActive
                      ? "bg-saffron-100 text-saffron-700"
                      : "text-ink-600"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
