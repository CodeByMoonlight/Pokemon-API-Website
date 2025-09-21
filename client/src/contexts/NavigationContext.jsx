import React, { createContext, useContext, useState } from "react";

const NavigationContext = createContext();

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};

export const NavigationProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pendingRoute, setPendingRoute] = useState(null);

  const startLoading = (route) => {
    setIsLoading(true);
    setProgress(0);
    setPendingRoute(route);
  };

  const updateProgress = (newProgress) => {
    setProgress(Math.min(100, Math.max(0, newProgress)));
  };

  const completeLoading = () => {
    setProgress(100);
    setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
      setPendingRoute(null);
    }, 300); // Small delay to show 100% completion
  };

  const cancelLoading = () => {
    setIsLoading(false);
    setProgress(0);
    setPendingRoute(null);
  };

  const value = {
    isLoading,
    progress,
    pendingRoute,
    startLoading,
    updateProgress,
    completeLoading,
    cancelLoading,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};
