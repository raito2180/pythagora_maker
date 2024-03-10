import { useState, useEffect } from 'react';

export const useDevice = () => {
  const [isPC, setIsPC] = useState(null);
  const [isMobile, setIsMobile] = useState(null);

  useEffect(() => {
    const detectDevice = () => {
      const isDesktop = !navigator.userAgent.match(/(iPhone|iPad|iPod|Android)/i);
      setIsPC(isDesktop);
      setIsMobile(!isDesktop);
    };

    detectDevice();
  }, []);

  return { isPC, isMobile };
};
