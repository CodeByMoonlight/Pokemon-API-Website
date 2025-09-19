import { useEffect, useRef, useState } from "react";

const ScrollReveal = ({
  children,
  direction = "up",
  delay = 0,
  duration = 800,
  threshold = 0.1,
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      {
        threshold: threshold,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [delay, threshold]);

  const getInitialStyle = () => {
    switch (direction) {
      case "up":
        return { transform: "translateY(50px)", opacity: 0 };
      case "down":
        return { transform: "translateY(-50px)", opacity: 0 };
      case "left":
        return { transform: "translateX(50px)", opacity: 0 };
      case "right":
        return { transform: "translateX(-50px)", opacity: 0 };
      case "fade":
        return { opacity: 0 };
      case "scale":
        return { transform: "scale(0.8)", opacity: 0 };
      default:
        return { transform: "translateY(50px)", opacity: 0 };
    }
  };

  const getVisibleStyle = () => {
    return {
      transform: "translateY(0) translateX(0) scale(1)",
      opacity: 1,
    };
  };

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        ...(!isVisible ? getInitialStyle() : getVisibleStyle()),
        transition: `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
      }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
