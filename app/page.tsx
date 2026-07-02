import { Dashboard } from "@/components/dashboard"
import { AuthWrapper } from "@/components/auth-wrapper"

export default function Page() {
  return (
    <AuthWrapper>
      <Dashboard />
    </AuthWrapper>
  )
}
