import React from "react";
import { useNavigate } from "react-router-dom";
import { useNavigation } from "../contexts/NavigationContext";

const NavigationLink = ({
  to,
  children,
  className = "",
  loadingOptions = {},
  onClick = null,
  ...props
}) => {
  const navigate = useNavigate();
  const { startLoading, updateProgress, completeLoading } = useNavigation();

  const handleClick = (e) => {
    e.preventDefault();

    // Call custom onClick if provided
    if (onClick) {
      onClick(e);
    }

    // Start loading
    const { minLoadingTime = 1000 } = loadingOptions;
    startLoading(to);

    // Simulate loading progress
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / minLoadingTime) * 100, 95);

      updateProgress(progress);

      if (progress >= 95) {
        clearInterval(interval);
        // Complete the loading and navigate
        updateProgress(100);
        setTimeout(() => {
          completeLoading();
          navigate(to);
        }, 200);
      }
    }, 50);
  };

  return (
    <a
      href={to}
      onClick={handleClick}
      className={`cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </a>
  );
};

export default NavigationLink;
