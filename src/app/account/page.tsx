import { PageHeader } from "@/components/layout/PageHeader";
import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm";
import { getCurrentUser } from "@/lib/auth/current-user";

export default async function AccountPage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Account"
        title={user ? user.name : "Your account"}
        description="Change the password you sign in with."
      />
      <div className="max-w-sm">
        <ChangePasswordForm />
      </div>
    </div>
  );
}
