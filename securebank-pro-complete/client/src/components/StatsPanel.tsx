import { Trophy, Layers, Flame, Medal } from 'lucide-react';

interface StatsPanelProps {
  score: number;
  level: number;
  streak: number;
  achievementsCount: number;
}

export default function StatsPanel({ score, level, streak, achievementsCount }: StatsPanelProps) {
  const stats = [
    {
      icon: Trophy,
      value: score.toLocaleString('vi-VN'),
      label: 'Điểm số',
      color: 'text-yellow-400'
    },
    {
      icon: Layers,
      value: level,
      label: 'Cấp độ',
      color: 'text-blue-400'
    },
    {
      icon: Flame,
      value: streak,
      label: 'Chuỗi thành công',
      color: 'text-red-400'
    },
    {
      icon: Medal,
      value: achievementsCount,
      label: 'Huy hiệu',
      color: 'text-purple-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="glass-card p-6 text-center hover:scale-105 transition-transform duration-300"
        >
          <stat.icon className={`h-12 w-12 ${stat.color} mb-4 mx-auto`} />
          <div className={`text-3xl font-bold ${stat.color} mb-2`}>
            {stat.value}
          </div>
          <div className="text-sm text-gray-300">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
