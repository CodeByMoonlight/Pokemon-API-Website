import React from "react";

const ProgressBar = ({ progress, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed left-0 top-0 z-50 w-full">
      <div className="h-1 bg-gray-200">
        <div
          className="from-text-secondary to-text-tertiary h-full bg-gradient-to-r transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      {progress > 0 && progress < 100 && (
        <div className="absolute left-1/2 top-1 -translate-x-1/2 transform"></div>
      )}
    </div>
  );
};

export default ProgressBar;
