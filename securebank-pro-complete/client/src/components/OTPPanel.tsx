import { useState, useEffect } from 'react';
import { Smartphone, Check, History, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CryptoUtils } from '@/lib/crypto-utils';

interface OTPPanelProps {
  onScoreUpdate: (points: number) => void;
  onStreak: () => void;
  showNotification: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  onTransactionComplete: () => void;
}

interface Transaction {
  id: number;
  amount: string;
  account: string;
  timestamp: string;
  level: number;
}

export default function OTPPanel({ onScoreUpdate, onStreak, showNotification, onTransactionComplete }: OTPPanelProps) {
  const [currentOTP, setCurrentOTP] = useState('');
  const [inputOTP, setInputOTP] = useState('');
  const [otpExpiry, setOtpExpiry] = useState<number | null>(null);
  const [otpTimeLeft, setOtpTimeLeft] = useState(60);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // OTP Timer
  useEffect(() => {
    if (otpExpiry) {
      const timer = setInterval(() => {
        const remaining = Math.max(0, otpExpiry - Date.now());
        setOtpTimeLeft(Math.floor(remaining / 1000));
        
        if (remaining <= 0) {
          setCurrentOTP('');
          setOtpExpiry(null);
          showNotification('⏰ Mã OTP đã hết hạn!', 'warning');
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [otpExpiry, showNotification]);

  const generateOTP = () => {
    const otp = CryptoUtils.generateOTP();
    setCurrentOTP(otp);
    setOtpExpiry(Date.now() + 60000); // 60 seconds
    setOtpTimeLeft(60);
    showNotification('📱 Mã OTP đã được tạo!', 'success');
  };

  const verifyTransaction = () => {
    if (!inputOTP.trim()) {
      showNotification('⚠️ Vui lòng nhập mã OTP!', 'error');
      return;
    }

    if (inputOTP !== currentOTP) {
      showNotification('❌ Mã OTP không chính xác!', 'error');
      onScoreUpdate(-20);
      return;
    }

    if (!otpExpiry || Date.now() > otpExpiry) {
      showNotification('⏰ Mã OTP đã hết hạn!', 'error');
      return;
    }

    // Successful transaction
    const baseScore = 100;
    const timeBonus = Math.floor((otpTimeLeft / 60) * 50); // Bonus for quick verification
    const totalScore = baseScore + timeBonus;
    
    onScoreUpdate(totalScore);
    onStreak();

    // Add to transaction history
    const newTransaction: Transaction = {
      id: Date.now(),
      amount: '1,000,000 VND', // This would come from the previous panels
      account: '123******789',
      timestamp: new Date().toLocaleString('vi-VN'),
      level: 1 // This would come from game state
    };

    setTransactions(prev => [newTransaction, ...prev.slice(0, 9)]); // Keep last 10
    
    // Reset form
    setCurrentOTP('');
    setInputOTP('');
    setOtpExpiry(null);
    setOtpTimeLeft(60);
    
    showNotification(`🎉 Giao dịch thành công! +${totalScore} điểm`, 'success');
    onTransactionComplete();
  };

  const getOTPTimePercentage = () => {
    return (otpTimeLeft / 60) * 100;
  };

  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-bold text-yellow-400 mb-6 text-center border-b border-yellow-400 pb-3">
        <Smartphone className="inline-block mr-2" />
        Xác thực OTP
      </h3>
      
      <div className="space-y-4">
        <Button
          onClick={generateOTP}
          className="w-full banking-button-crypto"
        >
          <Smartphone className="mr-2 h-4 w-4" />
          Tạo mã OTP
        </Button>
        
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <h4 className="font-bold text-purple-400 mb-2">Mã OTP (6 chữ số)</h4>
          <div className="text-3xl font-mono font-bold text-yellow-400 mb-2">
            {currentOTP || '------'}
          </div>
          <div className="text-xs text-gray-400 mb-2">
            Có hiệu lực trong {otpTimeLeft} giây
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="timer-bar h-2 rounded-full transition-all duration-1000"
              style={{ width: `${getOTPTimePercentage()}%` }}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="otp-input" className="text-gray-300">
            Nhập mã OTP
          </Label>
          <Input
            id="otp-input"
            type="text"
            value={inputOTP}
            onChange={(e) => setInputOTP(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="crypto-input text-center text-xl font-mono"
            placeholder="000000"
            maxLength={6}
          />
        </div>
        
        <Button
          onClick={verifyTransaction}
          disabled={!currentOTP || !inputOTP || inputOTP.length !== 6}
          className="w-full banking-button-success"
        >
          <Check className="mr-2 h-4 w-4" />
          Xác thực giao dịch
        </Button>
        
        {/* Transaction History */}
        <div className="bg-gray-800 rounded-lg p-4 max-h-48 overflow-y-auto">
          <h4 className="font-bold text-green-400 mb-2 flex items-center">
            <History className="mr-2 h-4 w-4" />
            Lịch sử giao dịch
          </h4>
          <div className="space-y-2 text-xs">
            {transactions.length === 0 ? (
              <div className="text-gray-400">Chưa có giao dịch nào...</div>
            ) : (
              transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex justify-between items-center py-1 border-b border-gray-700 last:border-0"
                >
                  <div className="flex items-center text-green-400">
                    <Check className="h-3 w-3 mr-1" />
                    <span>{tx.amount}</span>
                  </div>
                  <div className="text-gray-400 text-right">
                    <div>{tx.account}</div>
                    <div className="text-xs">{tx.timestamp}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-gray-800 rounded-lg text-xs">
        <p className="text-gray-400">
          💡 <strong>Bảo mật OTP:</strong> Mã OTP có hiệu lực 60 giây và chỉ sử dụng một lần. 
          Nhập càng nhanh, điểm thưởng càng cao!
        </p>
      </div>
    </div>
  );
}
