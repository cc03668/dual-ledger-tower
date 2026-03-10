"use client";

import { useState, useEffect } from "react";
import { AutoCheckToast } from "@/components/ui/AutoCheckToast";
import { OnboardingWizard } from "@/components/ui/OnboardingWizard";
import { hasAnyData, isOnboardingComplete } from "@/lib/storage";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [showWizard, setShowWizard] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!hasAnyData() && !isOnboardingComplete()) {
      setShowWizard(true);
    }
    setChecked(true);
  }, []);

  return (
    <>
      {checked && children}
      {showWizard && (
        <OnboardingWizard onComplete={() => setShowWizard(false)} />
      )}
      <AutoCheckToast />
    </>
  );
}
