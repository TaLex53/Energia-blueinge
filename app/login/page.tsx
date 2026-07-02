import { AuthWrapper } from "@/components/auth-wrapper";
import { redirect } from "next/navigation";

export default function LoginPageRoute() {
  return (
    <AuthWrapper>
      {/* If AuthWrapper renders children, the user is already logged in, so redirect to dashboard */}
      <RedirectToHome />
    </AuthWrapper>
  );
}

function RedirectToHome() {
  if (typeof window !== "undefined") {
    window.location.href = "/";
  }
  return null;
}
