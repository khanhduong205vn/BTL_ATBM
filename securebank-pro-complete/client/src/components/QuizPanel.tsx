import { useState, useEffect } from 'react';
import { Brain, Clock, CheckCircle, XCircle, ArrowRight, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getQuizQuestions, calculateQuizScore, type QuizQuestion } from '@/lib/quiz-data';

interface QuizPanelProps {
  level: number;
  onScoreUpdate: (points: number) => void;
  onQuizComplete: () => void;
  showNotification: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export default function QuizPanel({ level, onScoreUpdate, onQuizComplete, showNotification }: QuizPanelProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes per question
  const [showExplanation, setShowExplanation] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  // Initialize quiz
  useEffect(() => {
    const quizQuestions = getQuizQuestions(level, 5);
    setQuestions(quizQuestions);
    setCurrentQuestionIndex(0);
    setTimeLeft(180);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setAnswered(false);
    setCorrectAnswers(0);
  }, [level]);

  // Timer
  useEffect(() => {
    if (timeLeft > 0 && !answered) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !answered) {
      // Auto-skip when time runs out
      skipQuestion();
    }
  }, [timeLeft, answered]);

  const currentQuestion = questions[currentQuestionIndex];

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimePercentage = () => {
    return (timeLeft / 180) * 100;
  };

  const selectAnswer = (optionIndex: number) => {
    if (!answered) {
      setSelectedAnswer(optionIndex);
    }
  };

  const submitAnswer = () => {
    if (selectedAnswer === null) {
      showNotification('⚠️ Vui lòng chọn một câu trả lời!', 'error');
      return;
    }

    setAnswered(true);
    setShowExplanation(true);

    const isCorrect = selectedAnswer === currentQuestion.correct;
    
    if (isCorrect) {
      const score = calculateQuizScore(currentQuestion, timeLeft, 180);
      onScoreUpdate(score);
      setCorrectAnswers(prev => prev + 1);
      showNotification(`✅ Đúng rồi! +${score} điểm`, 'success');
    } else {
      onScoreUpdate(-25);
      showNotification('❌ Sai rồi! -25 điểm', 'error');
    }

    // Auto-advance after 3 seconds
    setTimeout(() => {
      nextQuestion();
    }, 3000);
  };

  const skipQuestion = () => {
    onScoreUpdate(-50);
    showNotification('⏭️ Đã bỏ qua câu hỏi! -50 điểm', 'warning');
    nextQuestion();
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setTimeLeft(180);
      setShowExplanation(false);
      setAnswered(false);
    } else {
      // Quiz completed
      const completionBonus = correctAnswers * 50;
      onScoreUpdate(completionBonus);
      showNotification(
        `🧠 Quiz hoàn thành! ${correctAnswers}/${questions.length} đúng. Bonus: +${completionBonus} điểm`,
        'success'
      );
      onQuizComplete();
    }
  };

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="glass-card p-6 mb-8">
      <h3 className="text-2xl font-bold text-yellow-400 mb-6 text-center border-b border-yellow-400 pb-3">
        <Brain className="inline-block mr-2" />
        Quiz Bảo mật - Kiến thức Chuyên sâu
      </h3>
      
      {/* Quiz Progress */}
      <div className="mb-6 text-center">
        <div className="text-sm text-gray-300 mb-2">
          Câu hỏi {currentQuestionIndex + 1} / {questions.length}
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Timer */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-300 flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Thời gian còn lại
          </span>
          <span className={`text-xl font-bold ${timeLeft <= 30 ? 'text-red-400 crypto-glow' : 'text-yellow-400'}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-4">
          <div 
            className={`h-4 rounded-full timer-bar transition-all duration-1000 ${timeLeft <= 30 ? 'quiz-timer-warning' : ''}`}
            style={{ width: `${getTimePercentage()}%` }}
          />
        </div>
      </div>
      
      {/* Question */}
      <Card className="bg-gray-800 border-blue-400 p-6 mb-6">
        <h4 className="text-lg font-bold text-blue-400 mb-4">
          {currentQuestion.question}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => selectAnswer(index)}
              disabled={answered}
              className={`quiz-option text-left ${
                selectedAnswer === index ? 'selected' : ''
              } ${
                answered && index === currentQuestion.correct ? 'correct' : ''
              } ${
                answered && selectedAnswer === index && index !== currentQuestion.correct ? 'incorrect' : ''
              }`}
            >
              <span className="font-medium text-sm text-gray-400 mr-2">
                {String.fromCharCode(65 + index)}.
              </span>
              {option}
            </button>
          ))}
        </div>
      </Card>
      
      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 mb-4">
        <Button
          onClick={submitAnswer}
          disabled={selectedAnswer === null || answered}
          className="banking-button-primary"
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Gửi câu trả lời
        </Button>
        
        <Button
          onClick={skipQuestion}
          disabled={answered}
          className="banking-button-warning"
        >
          <SkipForward className="mr-2 h-4 w-4" />
          Bỏ qua (-50 điểm)
        </Button>
      </div>
      
      {/* Explanation */}
      {showExplanation && (
        <Card className="bg-blue-900 border-blue-400 p-4 mt-6">
          <h5 className="font-bold text-blue-300 mb-2 flex items-center">
            <Brain className="mr-2 h-4 w-4" />
            💡 Giải thích:
          </h5>
          <p className="text-blue-100">{currentQuestion.explanation}</p>
          
          <div className="mt-3 text-sm text-blue-300">
            <span className="font-medium">Độ khó:</span> {
              currentQuestion.difficulty === 'easy' ? '🟢 Dễ' :
              currentQuestion.difficulty === 'medium' ? '🟡 Trung bình' : '🔴 Khó'
            }
            <span className="ml-4 font-medium">Chủ đề:</span> {
              currentQuestion.category === 'crypto' ? '🔐 Mã hóa' :
              currentQuestion.category === 'security' ? '🛡️ Bảo mật' :
              currentQuestion.category === 'phishing' ? '🎣 Phishing' :
              currentQuestion.category === 'banking' ? '🏦 Ngân hàng' : '📚 Tổng quát'
            }
          </div>
        </Card>
      )}

      {/* Quiz Stats */}
      <div className="mt-6 text-center">
        <div className="text-sm text-gray-300">
          Điểm hiện tại: <span className="text-green-400 font-bold">{correctAnswers}</span> đúng / 
          <span className="text-red-400 font-bold">{currentQuestionIndex + 1 - correctAnswers}</span> sai
        </div>
      </div>
    </div>
  );
}
