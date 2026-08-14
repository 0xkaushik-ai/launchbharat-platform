"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/applications", label: "Applications" },
  { href: "/events", label: "Events" },
  { href: "/tickets", label: "Tickets" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    await createClient().auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="border-b border-line bg-white lg:min-h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 lg:block">
          <Image src="/logo.jpg" alt="LaunchBharat" width={180} height={60} className="h-9 w-auto object-contain" priority />
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400 lg:mt-2">Operations console</p>
        </div>
        <nav className="overflow-x-auto p-3" aria-label="Admin navigation">
          <ul className="flex gap-1 lg:block lg:space-y-1">
            {links.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link href={item.href} className={`block whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition ${active ? "bg-saffron-100 text-saffron-700" : "text-ink-600 hover:bg-slate-50 hover:text-ink-950"}`}>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-3 lg:absolute lg:bottom-4 lg:w-[260px]">
          <a href={process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"} className="block rounded-lg px-3 py-2 text-sm text-ink-600 hover:bg-slate-50">View public site ↗</a>
          <button onClick={signOut} className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50">Sign out</button>
        </div>
      </aside>
      <main className="min-w-0 p-5 sm:p-8">{children}</main>
    </div>
  );
}
