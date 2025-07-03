import { useEffect, useState } from 'react';
import { Shield, Trophy, Zap, Medal } from 'lucide-react';
import GameHeader from '@/components/GameHeader';
import StatsPanel from '@/components/StatsPanel';
import CryptoPanel from '@/components/CryptoPanel';
import TransactionPanel from '@/components/TransactionPanel';
import OTPPanel from '@/components/OTPPanel';
import QuizPanel from '@/components/QuizPanel';
import SecurityTools from '@/components/SecurityTools';
import ParticleBackground from '@/components/ParticleBackground';
import { useGameState } from '@/lib/game-state';
import { useGameTimer } from '@/hooks/useGameTimer';
import { useNotifications } from '@/hooks/useNotifications';

export default function SecureBankGame() {
  const { gameState, updateGameState, resetGame } = useGameState();
  const { timeLeft, startTimer, resetTimer } = useGameTimer(gameState.level);
  const { showNotification, showAchievement } = useNotifications();
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    startTimer();
  }, [gameState.level]);

  useEffect(() => {
    if (timeLeft <= 0) {
      showNotification('⏰ Hết thời gian! Chuyển sang level tiếp theo.', 'warning');
      nextLevel();
    }
  }, [timeLeft]);

  const updateScore = (points: number) => {
    const newScore = Math.max(0, gameState.score + points);
    updateGameState({ score: newScore });
  };

  const updateStreak = () => {
    const newStreak = gameState.streak + 1;
    updateGameState({ streak: newStreak });
    
    // Trigger quiz every 5 successful transactions
    if (newStreak % 5 === 0) {
      setShowQuiz(true);
    }
  };

  const nextLevel = () => {
    const newLevel = gameState.level + 1;
    const levelBonus = newLevel * 50;
    
    updateGameState({ 
      level: newLevel,
      score: gameState.score + levelBonus 
    });
    
    resetTimer();
    startTimer();
    
    showNotification(`🎉 Chúc mừng! Lên Level ${newLevel}! +${levelBonus} điểm`, 'success');
    checkLevelAchievements(newLevel);
  };

  const checkLevelAchievements = (level: number) => {
    const levelAchievements = {
      5: { name: 'Chuyên gia Bảo mật', desc: 'Đạt Level 5 - Chuyên gia bảo mật cơ bản' },
      10: { name: 'Bậc thầy Mã hóa', desc: 'Đạt Level 10 - Bậc thầy về mã hóa' },
      15: { name: 'Siêu chuyên gia', desc: 'Đạt Level 15 - Siêu chuyên gia bảo mật' },
      20: { name: 'Hacker mũ trắng', desc: 'Đạt Level 20 - Hacker mũ trắng chính thức' }
    };

    const achievement = levelAchievements[level as keyof typeof levelAchievements];
    if (achievement) {
      const achievementId = `level_${level}`;
      if (!gameState.achievements.includes(achievementId)) {
        updateGameState({
          achievements: [...gameState.achievements, achievementId]
        });
        showAchievement(achievement.name, achievement.desc);
        updateScore(level * 50);
      }
    }
  };

  const getSecurityLevel = () => {
    const levels = [
      { min: 1, max: 2, text: '🔒 Thường', bars: 1, color: 'text-yellow-400' },
      { min: 3, max: 5, text: '🔐 Cao', bars: 2, color: 'text-orange-400' },
      { min: 6, max: 8, text: '🛡️ Rất cao', bars: 3, color: 'text-blue-400' },
      { min: 9, max: 12, text: '🔒 Tối đa', bars: 4, color: 'text-purple-400' },
      { min: 13, max: 999, text: '⚡ Siêu việt', bars: 5, color: 'text-green-400' }
    ];
    
    return levels.find(l => gameState.level >= l.min && gameState.level <= l.max) || levels[0];
  };

  const securityLevel = getSecurityLevel();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticleBackground />
      
      {/* Bank Logo */}
      <div className="fixed top-4 left-4 z-50">
        <div className="flex items-center space-x-2 text-yellow-400">
          <Shield className="h-8 w-8" />
          <span className="font-bold text-lg">SecureBank Pro</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        <GameHeader 
          title="🏦 SecureBank Pro"
          subtitle="Trò chơi Mô phỏng Hệ thống Bảo mật Ngân hàng Chuyên nghiệp"
          timeLeft={timeLeft}
          level={gameState.level}
        />

        <StatsPanel 
          score={gameState.score}
          level={gameState.level}
          streak={gameState.streak}
          achievementsCount={gameState.achievements.length}
        />

        {/* Security Level Indicator */}
        <div className="glass-card p-6 mb-8 text-center security-pulse">
          <h3 className="text-xl font-bold text-green-400 mb-4">
            <Shield className="inline-block mr-2" />
            Mức độ Bảo mật: <span className={securityLevel.color}>{securityLevel.text}</span>
          </h3>
          <div className="flex justify-center space-x-2">
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className={`w-8 h-2 rounded-full ${
                  i < securityLevel.bars 
                    ? 'bg-green-400 shadow-lg shadow-green-500/50' 
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Main Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <CryptoPanel 
            onScoreUpdate={updateScore}
            showNotification={showNotification}
          />
          <TransactionPanel 
            onScoreUpdate={updateScore}
            showNotification={showNotification}
          />
          <OTPPanel 
            onScoreUpdate={updateScore}
            onStreak={updateStreak}
            showNotification={showNotification}
            onTransactionComplete={() => {
              if (gameState.streak % 5 === 0) {
                setShowQuiz(true);
              }
            }}
          />
        </div>

        {/* Quiz Panel */}
        {showQuiz && (
          <QuizPanel
            level={gameState.level}
            onScoreUpdate={updateScore}
            onQuizComplete={() => setShowQuiz(false)}
            showNotification={showNotification}
          />
        )}

        {/* Security Tools */}
        <SecurityTools 
          onScoreUpdate={updateScore}
          showNotification={showNotification}
          gameData={gameState}
          onImportData={updateGameState}
        />

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => setShowQuiz(true)}
            className="banking-button-primary"
          >
            <Trophy className="inline-block mr-2 h-5 w-5" />
            Bắt đầu Quiz Bảo mật
          </button>
          
          <button
            onClick={nextLevel}
            className="banking-button-success"
          >
            <Zap className="inline-block mr-2 h-5 w-5" />
            Lên cấp độ tiếp theo
          </button>
          
          <button
            onClick={() => {
              if (confirm('Bạn có chắc muốn chơi lại từ đầu? Tất cả tiến trình sẽ bị mất!')) {
                resetGame();
                resetTimer();
                startTimer();
                showNotification('🔄 Game đã được reset!', 'success');
              }
            }}
            className="banking-button-danger"
          >
            Chơi lại từ đầu
          </button>
        </div>

        {/* Game Instructions */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-yellow-400 mb-4 text-center">
            <Medal className="inline-block mr-2" />
            Hướng dẫn Chơi Game
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm text-gray-300">
            <div>
              <h4 className="font-bold text-white mb-2">🔐 Mã hóa AES</h4>
              <ol className="list-decimal list-inside space-y-1">
                <li>Nhập thông tin giao dịch đầy đủ</li>
                <li>Nhấn "Tạo khóa AES" để tạo khóa 256-bit</li>
                <li>Nhấn "Mã hóa" để bảo mật dữ liệu</li>
                <li>Lưu khóa AES để giải mã sau</li>
              </ol>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-2">📨 Xử lý Giao dịch</h4>
              <ol className="list-decimal list-inside space-y-1">
                <li>Nhấn "Gửi giao dịch" sau khi mã hóa</li>
                <li>Nhập khóa AES để giải mã</li>
                <li>Nhấn "Giải mã dữ liệu" để xác minh</li>
                <li>Kiểm tra thông tin đã giải mã</li>
              </ol>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-2">🔑 Xác thực OTP</h4>
              <ol className="list-decimal list-inside space-y-1">
                <li>Nhấn "Tạo mã OTP" để tạo mã 6 chữ số</li>
                <li>Nhập mã OTP trong vòng 60 giây</li>
                <li>Nhấn "Xác thực giao dịch" để hoàn tất</li>
                <li>Kiếm thêm điểm qua Quiz bảo mật</li>
              </ol>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <h4 className="font-bold text-yellow-400 mb-2">⏱️ Thời gian Extended cho mỗi Level</h4>
            <div className="text-sm text-gray-300">
              <p><strong>Level 1-3:</strong> 5 phút | <strong>Level 4-6:</strong> 7 phút | <strong>Level 7+:</strong> 10 phút</p>
              <p><strong>Quiz:</strong> 3 phút cho mỗi câu hỏi | <strong>Bonus:</strong> +50-500 điểm tùy cấp độ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
