import { useState, useEffect } from "react";
import "../App.css";

export default function Loading({
  duration = 9000,
  isDataLoading = false,
  onComplete,
}) {
  const [isVisible, setIsVisible] = useState(true);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [startFadeOut, setStartFadeOut] = useState(false);

  useEffect(() => {
    // Set minimum time elapsed after duration
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  useEffect(() => {
    // Start fade out animation when conditions are met
    if (minTimeElapsed && !isDataLoading) {
      setStartFadeOut(true);

      // Wait for the CSS fade animation to complete (1s) before unmounting
      setTimeout(() => {
        setIsVisible(false);
        if (onComplete) onComplete();
      }, 1100); // 1s animation + 100ms buffer
    }
  }, [minTimeElapsed, isDataLoading, onComplete]);

  return (
    isVisible && (
      <div
        className={`loading fixed inset-0 z-50 flex h-screen w-screen items-center justify-center ${startFadeOut ? "fade-out" : ""}`}
      >
        <img
          src="/assets/loading.gif"
          alt="loading_img"
          className="loading-icon h-64 w-64"
        />
      </div>
    )
  );
}
