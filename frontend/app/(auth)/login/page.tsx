import { LoginForm } from "@/components/auth/login-form";

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string; reason?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirect, reason } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <LoginForm redirectTo={redirect ?? "/dashboard"} sessionExpired={reason === "session_expired"} />
    </div>
  );
}