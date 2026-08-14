import Link from "next/link";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-slate-50">
      <div className="container-lb py-8 sm:py-12">
        <nav aria-label="Applicant portal" className="mb-8 flex items-center gap-5 border-b border-line pb-4 text-sm font-medium text-ink-600">
          <Link href="/portal" className="transition hover:text-saffron-600">My application</Link>
          <Link href="/portal/settings" className="transition hover:text-saffron-600">My profile</Link>
        </nav>
        {children}
      </div>
    </div>
  );
}
