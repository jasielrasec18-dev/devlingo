import { useEffect, useState } from 'react';
import loaderImage from '../assets/images/devlingo-loader.png';

type LoadingScreenProps = {
  onFinish?: () => void;
};

export const LoadingScreen = ({ onFinish }: LoadingScreenProps) => {
  const [isFading, setIsFading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => {
      setIsFading(true);
    }, 2000);

    const hideTimer = window.setTimeout(() => {
      setIsVisible(false);
      onFinish?.();
    }, 2700);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, [onFinish]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#8a2be2] text-white transition-opacity duration-700 ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
      aria-label="Loading"
    >
      <img
        src={loaderImage}
        alt="Devlingo"
        className="w-32 sm:w-40 animate-float"
      />
      <h1 className="mt-6 text-3xl font-bold font-sans">Devlingo</h1>
    </div>
  );
};
