import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";
import PageLoader from "@/components/PageLoader";

export const metadata = {
  title: "Sign In | BearHug KE",
  description: "Sign in or create your BearHug KE account to track orders and save favourites.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<PageLoader label="Loading sign in…" compact />}>
      <AuthForm />
    </Suspense>
  );
}
