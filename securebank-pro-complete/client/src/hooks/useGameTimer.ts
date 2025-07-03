import { useState, useEffect, useCallback } from 'react';

export function useGameTimer(level: number) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  // Calculate level duration based on level
  const getLevelDuration = useCallback((level: number): number => {
    if (level <= 3) return 5 * 60 * 1000; // 5 minutes
    if (level <= 6) return 7 * 60 * 1000; // 7 minutes
    return 10 * 60 * 1000; // 10 minutes
  }, []);

  const startTimer = useCallback(() => {
    const duration = getLevelDuration(level);
    setTimeLeft(duration);
    setIsRunning(true);

    const id = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1000) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    setIntervalId(id);
  }, [level, getLevelDuration]);

  const stopTimer = useCallback(() => {
    setIsRunning(false);
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [intervalId]);

  const resetTimer = useCallback(() => {
    stopTimer();
    setTimeLeft(getLevelDuration(level));
  }, [level, getLevelDuration, stopTimer]);

  const pauseTimer = useCallback(() => {
    if (isRunning && intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
      setIsRunning(false);
    }
  }, [isRunning, intervalId]);

  const resumeTimer = useCallback(() => {
    if (!isRunning && timeLeft > 0) {
      setIsRunning(true);
      const id = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1000) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
      setIntervalId(id);
    }
  }, [isRunning, timeLeft]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  // Format time as MM:SS
  const formatTime = useCallback((milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  // Get time percentage for progress bars
  const getTimePercentage = useCallback((): number => {
    const totalTime = getLevelDuration(level);
    return Math.max(0, (timeLeft / totalTime) * 100);
  }, [timeLeft, level, getLevelDuration]);

  // Check if time is critical (less than 1 minute)
  const isCritical = timeLeft < 60000;

  // Check if time is warning (less than 2 minutes)
  const isWarning = timeLeft < 120000;

  return {
    timeLeft,
    isRunning,
    startTimer,
    stopTimer,
    resetTimer,
    pauseTimer,
    resumeTimer,
    formatTime: () => formatTime(timeLeft),
    getTimePercentage,
    isCritical,
    isWarning,
    levelDuration: getLevelDuration(level)
  };
}
