import { Clock, Shield } from 'lucide-react';

interface GameHeaderProps {
  title: string;
  subtitle: string;
  timeLeft: number;
  level: number;
}

export default function GameHeader({ title, subtitle, timeLeft, level }: GameHeaderProps) {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getTimePercentage = () => {
    const totalTime = level <= 3 ? 5 * 60 * 1000 : level <= 6 ? 7 * 60 * 1000 : 10 * 60 * 1000;
    return Math.max(0, (timeLeft / totalTime) * 100);
  };

  return (
    <header className="glass-card p-8 mb-8 relative overflow-hidden">
      <div className="relative z-10">
        <h1 className="text-5xl font-black text-center mb-4 gold-text">
          {title}
        </h1>
        <p className="text-xl text-center text-gray-300 mb-6">
          {subtitle}
        </p>
        
        {/* Extended Level Timer */}
        <div className="bg-gray-800 rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-300 flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Thời gian Level hiện tại
            </span>
            <span className="text-lg font-bold text-yellow-400">
              {formatTime(timeLeft)}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="h-3 rounded-full timer-bar transition-all duration-1000"
              style={{ width: `${getTimePercentage()}%` }}
            />
          </div>
          <div className="text-xs text-gray-400 mt-2 text-center">
            Level {level} - {level <= 3 ? '5 phút' : level <= 6 ? '7 phút' : '10 phút'} để hoàn thành
          </div>
        </div>
      </div>
    </header>
  );
}
