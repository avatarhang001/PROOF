import { useState, useEffect } from 'react';

export interface OnboardingData {
  tags: string[];
  level: string;
  time: string;
  query: string;
}

export function useOnboarding() {
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [data, setData] = useState<OnboardingData | null>(null);

  useEffect(() => {
    try {
      const completed = localStorage.getItem('onboarding_completed');
      const storedData = localStorage.getItem('onboarding_data');

      setIsCompleted(completed === 'true');
      
      if (storedData) {
        setData(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Failed to load onboarding data:', error);
    }
  }, []);

  const clearOnboarding = () => {
    try {
      localStorage.removeItem('onboarding_completed');
      localStorage.removeItem('onboarding_data');
      setIsCompleted(false);
      setData(null);
    } catch (error) {
      console.error('Failed to clear onboarding data:', error);
    }
  };

  return {
    isCompleted,
    data,
    clearOnboarding,
  };
}
