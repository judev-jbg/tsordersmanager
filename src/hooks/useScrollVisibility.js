import { useEffect, useState } from "react";

const useScrollVisibility = (threshold) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.pageYOffset > threshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return isVisible;
};

export default useScrollVisibility;
