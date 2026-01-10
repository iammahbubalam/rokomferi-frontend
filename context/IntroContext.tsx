"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface IntroContextType {
  isIntroComplete: boolean;
  completeIntro: () => void;
}

const IntroContext = createContext<IntroContextType | undefined>(undefined);

export function IntroProvider({ children }: { children: React.ReactNode }) {
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false);

  useEffect(() => {
    // Check session storage on mount
    const hasSeen = sessionStorage.getItem("rokomferi_intro_seen");
    if (hasSeen) {
      setIsIntroComplete(true);
    }
    setHasCheckedStorage(true);
  }, []);

  const completeIntro = () => {
    setIsIntroComplete(true);
    sessionStorage.setItem("rokomferi_intro_seen", "true");
  };

  // Prevent flash: Don't render children until we know the state? 
  // No, render children always. Hero will check the state.
  
  return (
    <IntroContext.Provider value={{ isIntroComplete, completeIntro }}>
      {children}
    </IntroContext.Provider>
  );
}

export function useIntro() {
  const context = useContext(IntroContext);
  if (context === undefined) {
    throw new Error("useIntro must be used within an IntroProvider");
  }
  return context;
}
