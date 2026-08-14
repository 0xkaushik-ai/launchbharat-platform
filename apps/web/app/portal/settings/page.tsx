import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import ProfileForm from "@/components/portal/ProfileForm";

export default async function ProfileSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login?next=/portal/settings");
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, mobile, city, state, college")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <main className="mx-auto max-w-3xl">
      <p className="chip-mono">Applicant portal</p>
      <h1 className="display-md mt-3 text-ink-950">My profile</h1>
      <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-600">Keep these contact details current so the team can reach you about your application and future opportunities.</p>
      <section className="surface mt-8 p-6 sm:p-8"><ProfileForm profile={profile} /></section>
    </main>
  );
}
