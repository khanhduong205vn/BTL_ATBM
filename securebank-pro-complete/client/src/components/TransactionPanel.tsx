import { useState, useEffect } from 'react';
import { Send, Unlock, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CryptoUtils } from '@/lib/crypto-utils';

interface TransactionPanelProps {
  onScoreUpdate: (points: number) => void;
  showNotification: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export default function TransactionPanel({ onScoreUpdate, showNotification }: TransactionPanelProps) {
  const [encryptedData, setEncryptedData] = useState('');
  const [decryptKey, setDecryptKey] = useState('');
  const [decryptedData, setDecryptedData] = useState('');
  const [transactionSent, setTransactionSent] = useState(false);
  const [statusMessages, setStatusMessages] = useState<string[]>([
    'Chờ dữ liệu mã hóa...'
  ]);

  const addStatusMessage = (message: string) => {
    setStatusMessages(prev => {
      const newMessages = [...prev, message];
      return newMessages.slice(-3); // Keep only last 3 messages
    });
  };

  const sendTransaction = () => {
    if (!encryptedData.trim()) {
      showNotification('⚠️ Chưa có dữ liệu mã hóa để gửi!', 'error');
      return;
    }

    setTransactionSent(true);
    addStatusMessage('📡 Giao dịch đã được gửi đến hệ thống ngân hàng');
    addStatusMessage('🔍 Đang chờ xác thực khóa giải mã...');
    showNotification('📨 Giao dịch đã được gửi thành công!', 'success');
  };

  const decryptData = async () => {
    if (!decryptKey.trim()) {
      showNotification('⚠️ Vui lòng nhập khóa AES để giải mã!', 'error');
      return;
    }

    if (!encryptedData.trim()) {
      showNotification('⚠️ Không có dữ liệu mã hóa để giải mã!', 'error');
      return;
    }

    // For demo purposes, we'll simulate decryption
    // In a real app, you'd use the actual IV and proper AES decryption
    const result = await CryptoUtils.decryptAES(encryptedData, decryptKey, '');
    
    if (result.success) {
      try {
        const parsedData = JSON.parse(result.decryptedData);
        const formattedData = `Tài khoản: ${parsedData.accountNumber}
Số tiền: ${CryptoUtils.formatCurrency(parsedData.amount)}
Nội dung: ${parsedData.content}
Thời gian: ${new Date(parsedData.timestamp).toLocaleString('vi-VN')}`;
        
        setDecryptedData(formattedData);
        onScoreUpdate(30);
        addStatusMessage('🔓 Dữ liệu đã được giải mã thành công');
        addStatusMessage('✅ Sẵn sàng tạo mã OTP xác thực');
        showNotification('🔓 Giải mã thành công!', 'success');
      } catch (error) {
        showNotification('❌ Dữ liệu giải mã không hợp lệ!', 'error');
      }
    } else {
      onScoreUpdate(-10);
      showNotification(`❌ ${result.error}`, 'error');
    }
  };

  const clearForm = () => {
    setEncryptedData('');
    setDecryptKey('');
    setDecryptedData('');
    setTransactionSent(false);
    setStatusMessages(['Chờ dữ liệu mã hóa...']);
  };

  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-bold text-yellow-400 mb-6 text-center border-b border-yellow-400 pb-3">
        <Send className="inline-block mr-2" />
        Xử lý Giao dịch
      </h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="encrypted-input" className="text-gray-300">
            Dữ liệu mã hóa từ panel trước
          </Label>
          <Textarea
            id="encrypted-input"
            value={encryptedData}
            onChange={(e) => setEncryptedData(e.target.value)}
            className="crypto-input h-20 resize-none"
            placeholder="Dán dữ liệu đã mã hóa từ panel trước..."
          />
        </div>

        <Button
          onClick={sendTransaction}
          disabled={!encryptedData.trim()}
          className="w-full banking-button-success"
        >
          <Send className="mr-2 h-4 w-4" />
          Gửi giao dịch
        </Button>
        
        <div className="bg-gray-800 rounded-lg p-4">
          <h4 className="font-bold text-blue-400 mb-3">
            <Info className="inline-block mr-2 h-4 w-4" />
            Trạng thái giao dịch
          </h4>
          <div className="space-y-2 text-sm">
            {statusMessages.map((message, index) => (
              <div key={index} className="flex items-center text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 flex-shrink-0" />
                {message}
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <Label htmlFor="decrypt-key" className="text-gray-300">
            Nhập khóa AES để giải mã
          </Label>
          <Input
            id="decrypt-key"
            type="text"
            value={decryptKey}
            onChange={(e) => setDecryptKey(e.target.value)}
            className="crypto-input"
            placeholder="Nhập khóa AES 256-bit..."
          />
        </div>
        
        <Button
          onClick={decryptData}
          disabled={!transactionSent || !decryptKey.trim()}
          className="w-full banking-button-primary"
        >
          <Unlock className="mr-2 h-4 w-4" />
          Giải mã dữ liệu
        </Button>
        
        <div>
          <Label htmlFor="decrypted-data" className="text-gray-300">
            Dữ liệu đã giải mã
          </Label>
          <Textarea
            id="decrypted-data"
            value={decryptedData}
            readOnly
            className="crypto-input text-green-400 bg-gray-800 h-24 resize-none"
            placeholder="Dữ liệu giải mã sẽ hiển thị ở đây..."
          />
        </div>

        <Button
          onClick={clearForm}
          variant="outline"
          className="w-full mt-4"
        >
          Xóa form
        </Button>
      </div>

      <div className="mt-4 p-3 bg-gray-800 rounded-lg text-xs">
        <p className="text-gray-400">
          💡 <strong>Hướng dẫn:</strong> Sao chép dữ liệu mã hóa từ panel trước, gửi giao dịch, 
          sau đó nhập đúng khóa AES để giải mã và chuyển sang bước xác thực OTP.
        </p>
      </div>
    </div>
  );
}
