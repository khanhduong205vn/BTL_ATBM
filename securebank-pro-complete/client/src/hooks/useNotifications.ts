import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Achievement {
  title: string;
  description: string;
}

export function useNotifications() {
  const { toast } = useToast();
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const showNotification = useCallback((
    message: string, 
    type: 'success' | 'error' | 'warning' | 'info' = 'info'
  ) => {
    const variants = {
      success: 'default',
      error: 'destructive',
      warning: 'default',
      info: 'default'
    } as const;

    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };

    toast({
      title: `${icons[type]} Thông báo`,
      description: message,
      variant: variants[type],
      duration: type === 'error' ? 5000 : 3000,
    });
  }, [toast]);

  const showAchievement = useCallback((title: string, description: string) => {
    const achievement = { title, description };
    setAchievements(prev => [...prev, achievement]);

    // Show special achievement toast
    toast({
      title: '🏆 Huy hiệu mới!',
      description: `${title} - ${description}`,
      duration: 5000,
      className: 'bg-gradient-to-r from-yellow-600 to-yellow-700 border-yellow-500 text-white',
    });

    // Auto-remove achievement after animation
    setTimeout(() => {
      setAchievements(prev => prev.filter(a => a !== achievement));
    }, 4000);
  }, [toast]);

  const showLevelUp = useCallback((level: number, bonus: number) => {
    toast({
      title: '🎉 Lên cấp!',
      description: `Chúc mừng! Bạn đã đạt Level ${level} và nhận ${bonus} điểm thưởng!`,
      duration: 4000,
      className: 'bg-gradient-to-r from-blue-600 to-purple-600 border-blue-500 text-white',
    });
  }, [toast]);

  const showGameComplete = useCallback((finalScore: number, level: number) => {
    toast({
      title: '🎊 Hoàn thành xuất sắc!',
      description: `Game kết thúc với ${finalScore.toLocaleString('vi-VN')} điểm tại Level ${level}!`,
      duration: 6000,
      className: 'bg-gradient-to-r from-green-600 to-emerald-600 border-green-500 text-white',
    });
  }, [toast]);

  const showCriticalWarning = useCallback((message: string) => {
    toast({
      title: '🚨 Cảnh báo quan trọng!',
      description: message,
      duration: 10000,
      variant: 'destructive',
      className: 'bg-gradient-to-r from-red-600 to-red-700 border-red-500 text-white animate-pulse',
    });
  }, [toast]);

  const showSecurityAlert = useCallback((message: string, level: 'low' | 'medium' | 'high') => {
    const configs = {
      low: {
        title: '🔒 Thông tin bảo mật',
        className: 'bg-gradient-to-r from-green-600 to-green-700 border-green-500 text-white'
      },
      medium: {
        title: '⚠️ Cảnh báo bảo mật',
        className: 'bg-gradient-to-r from-yellow-600 to-orange-600 border-yellow-500 text-white'
      },
      high: {
        title: '🚨 Nguy hiểm bảo mật!',
        className: 'bg-gradient-to-r from-red-600 to-red-700 border-red-500 text-white animate-pulse'
      }
    };

    const config = configs[level];
    
    toast({
      title: config.title,
      description: message,
      duration: level === 'high' ? 8000 : 5000,
      className: config.className,
    });
  }, [toast]);

  const showQuizResult = useCallback((
    correct: boolean, 
    score: number, 
    explanation?: string
  ) => {
    if (correct) {
      toast({
        title: '🎯 Chính xác!',
        description: `Xuất sắc! Bạn nhận được ${score} điểm.${explanation ? ` ${explanation}` : ''}`,
        duration: 4000,
        className: 'bg-gradient-to-r from-green-600 to-emerald-600 border-green-500 text-white',
      });
    } else {
      toast({
        title: '❌ Chưa đúng',
        description: `Đáp án sai. ${explanation || 'Hãy học hỏi thêm và thử lại!'}`,
        duration: 5000,
        variant: 'destructive',
      });
    }
  }, [toast]);

  const showTimeWarning = useCallback((timeLeft: number) => {
    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);
    
    if (timeLeft <= 60000) { // Last minute
      toast({
        title: '⏰ Cảnh báo thời gian!',
        description: `Chỉ còn ${seconds} giây để hoàn thành level!`,
        duration: 2000,
        className: 'bg-gradient-to-r from-red-600 to-red-700 border-red-500 text-white animate-pulse',
      });
    } else if (timeLeft <= 120000) { // Last 2 minutes
      toast({
        title: '⏱️ Thời gian sắp hết',
        description: `Còn ${minutes} phút ${seconds} giây. Hãy nhanh lên!`,
        duration: 3000,
        className: 'bg-gradient-to-r from-yellow-600 to-orange-600 border-yellow-500 text-white',
      });
    }
  }, [toast]);

  const showConnectivityStatus = useCallback((online: boolean) => {
    if (online) {
      toast({
        title: '🌐 Đã kết nối',
        description: 'Kết nối internet đã được khôi phục. Game tiếp tục bình thường.',
        duration: 3000,
        className: 'bg-gradient-to-r from-green-600 to-emerald-600 border-green-500 text-white',
      });
    } else {
      toast({
        title: '📶 Mất kết nối',
        description: 'Đang chơi offline. Một số tính năng có thể bị hạn chế.',
        duration: 5000,
        className: 'bg-gradient-to-r from-gray-600 to-gray-700 border-gray-500 text-white',
      });
    }
  }, [toast]);

  return {
    showNotification,
    showAchievement,
    showLevelUp,
    showGameComplete,
    showCriticalWarning,
    showSecurityAlert,
    showQuizResult,
    showTimeWarning,
    showConnectivityStatus,
    achievements
  };
}
