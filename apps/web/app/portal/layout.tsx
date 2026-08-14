import Link from "next/link";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden bg-paper">
      <div aria-hidden="true" className="aurora-wash pointer-events-none absolute inset-x-0 top-0 h-72" />
      <div className="container-lb relative py-10 sm:py-14">
        <nav aria-label="Applicant portal" className="mb-8 flex items-center gap-2 border-b border-line pb-4 text-sm font-medium text-ink-600">
          <Link href="/portal" className="rounded-full px-3 py-1.5 transition hover:bg-white hover:text-iris-600">
            My application
          </Link>
          <Link href="/portal/settings" className="rounded-full px-3 py-1.5 transition hover:bg-white hover:text-iris-600">
            My profile
          </Link>
        </nav>
        {children}
      </div>
    </div>
  );
}
