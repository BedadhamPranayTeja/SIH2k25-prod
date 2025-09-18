import { Suspense } from "react";
import LandingPage from "@/components/custom/LandingPage";

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="spinner" />
        </div>
      }
    >
      <LandingPage />
    </Suspense>
  );
}
