import { useState, useEffect } from 'react';

export interface Transaction {
  id: number;
  accountNumber: string;
  amount: number;
  content: string;
  timestamp: string;
  level: number;
  status: 'completed' | 'failed';
}

export interface GameState {
  score: number;
  level: number;
  streak: number;
  achievements: string[];
  transactions: Transaction[];
  totalTransactions: number;
  bestStreak: number;
  totalScore: number;
  playTime: number; // in minutes
  currentSession: {
    startTime: number;
    transactionsCompleted: number;
    scoreGained: number;
  };
}

const defaultGameState: GameState = {
  score: 0,
  level: 1,
  streak: 0,
  achievements: [],
  transactions: [],
  totalTransactions: 0,
  bestStreak: 0,
  totalScore: 0,
  playTime: 0,
  currentSession: {
    startTime: Date.now(),
    transactionsCompleted: 0,
    scoreGained: 0
  }
};

const STORAGE_KEY = 'securebank-pro-game-state';

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedState = JSON.parse(saved);
        // Merge with default state to handle new properties
        return {
          ...defaultGameState,
          ...parsedState,
          currentSession: {
            startTime: Date.now(),
            transactionsCompleted: 0,
            scoreGained: 0
          }
        };
      }
    } catch (error) {
      console.warn('Failed to load game state:', error);
    }
    return defaultGameState;
  });

  // Auto-save game state
  useEffect(() => {
    const saveInterval = setInterval(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    }, 10000); // Save every 10 seconds

    return () => clearInterval(saveInterval);
  }, [gameState]);

  // Update play time
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        playTime: prev.playTime + 1
      }));
    }, 60000); // Update every minute

    return () => clearInterval(timeInterval);
  }, []);

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState(prev => {
      const newState = { ...prev, ...updates };
      
      // Update derived stats
      if (updates.score !== undefined) {
        newState.totalScore = Math.max(newState.totalScore, newState.score);
        newState.currentSession.scoreGained = newState.score - prev.score + newState.currentSession.scoreGained;
      }
      
      if (updates.streak !== undefined) {
        newState.bestStreak = Math.max(newState.bestStreak, newState.streak);
      }

      return newState;
    });
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now(),
      timestamp: new Date().toLocaleString('vi-VN')
    };

    setGameState(prev => ({
      ...prev,
      transactions: [newTransaction, ...prev.transactions.slice(0, 49)], // Keep last 50
      totalTransactions: prev.totalTransactions + 1,
      currentSession: {
        ...prev.currentSession,
        transactionsCompleted: prev.currentSession.transactionsCompleted + 1
      }
    }));

    return newTransaction;
  };

  const resetGame = () => {
    const newState: GameState = {
      ...defaultGameState,
      bestStreak: gameState.bestStreak,
      totalScore: gameState.totalScore,
      totalTransactions: gameState.totalTransactions,
      playTime: gameState.playTime,
      currentSession: {
        startTime: Date.now(),
        transactionsCompleted: 0,
        scoreGained: 0
      }
    };
    
    setGameState(newState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  };

  const exportGameData = () => {
    const exportData = {
      ...gameState,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `securebank-pro-save-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(link.href);
  };

  const importGameData = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          
          // Validate data structure
          if (typeof data.score === 'number' && typeof data.level === 'number') {
            const importedState: GameState = {
              ...defaultGameState,
              ...data,
              currentSession: {
                startTime: Date.now(),
                transactionsCompleted: 0,
                scoreGained: 0
              }
            };
            
            setGameState(importedState);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(importedState));
            resolve(true);
          } else {
            resolve(false);
          }
        } catch (error) {
          console.error('Import error:', error);
          resolve(false);
        }
      };
      
      reader.onerror = () => resolve(false);
      reader.readAsText(file);
    });
  };

  // Calculate level duration based on current level
  const getLevelDuration = (level: number): number => {
    if (level <= 3) return 5 * 60 * 1000; // 5 minutes
    if (level <= 6) return 7 * 60 * 1000; // 7 minutes
    return 10 * 60 * 1000; // 10 minutes
  };

  // Calculate score bonus based on level and time
  const calculateBonus = (level: number, timeLeft: number, totalTime: number): number => {
    const timeBonus = Math.floor((timeLeft / totalTime) * 100);
    const levelMultiplier = level * 10;
    return timeBonus + levelMultiplier;
  };

  const getSessionStats = () => {
    const sessionTime = Math.floor((Date.now() - gameState.currentSession.startTime) / (1000 * 60));
    return {
      sessionTime,
      transactionsCompleted: gameState.currentSession.transactionsCompleted,
      scoreGained: gameState.currentSession.scoreGained,
      averageScorePerTransaction: gameState.currentSession.transactionsCompleted > 0 
        ? Math.floor(gameState.currentSession.scoreGained / gameState.currentSession.transactionsCompleted)
        : 0
    };
  };

  return {
    gameState,
    updateGameState,
    addTransaction,
    resetGame,
    exportGameData,
    importGameData,
    getLevelDuration,
    calculateBonus,
    getSessionStats
  };
}
