import { useState } from 'react';
import { Key, Lock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CryptoUtils } from '@/lib/crypto-utils';

interface CryptoPanelProps {
  onScoreUpdate: (points: number) => void;
  showNotification: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export default function CryptoPanel({ onScoreUpdate, showNotification }: CryptoPanelProps) {
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [content, setContent] = useState('');
  const [aesKey, setAesKey] = useState('');
  const [encryptedData, setEncryptedData] = useState('');
  const [iv, setIv] = useState('');

  const generateAESKey = () => {
    const key = CryptoUtils.generateAESKey();
    setAesKey(key);
    onScoreUpdate(10);
    showNotification('🔑 Khóa AES-256 đã được tạo thành công!', 'success');
  };

  const encryptData = async () => {
    // Validate inputs
    const accountValidation = CryptoUtils.validateAccountNumber(accountNumber);
    if (!accountValidation.valid) {
      showNotification(`⚠️ ${accountValidation.error}`, 'error');
      return;
    }

    const amountValidation = CryptoUtils.validateAmount(amount);
    if (!amountValidation.valid) {
      showNotification(`⚠️ ${amountValidation.error}`, 'error');
      return;
    }

    if (!content.trim()) {
      showNotification('⚠️ Vui lòng nhập nội dung chuyển khoản!', 'error');
      return;
    }

    if (!aesKey) {
      showNotification('⚠️ Vui lòng tạo khóa AES trước!', 'error');
      return;
    }

    const transactionData = {
      accountNumber,
      amount: parseFloat(amount),
      content,
      timestamp: new Date().toISOString()
    };

    const result = await CryptoUtils.encryptAES(JSON.stringify(transactionData), aesKey);
    
    if (result.success) {
      setEncryptedData(result.encryptedData);
      setIv(result.iv);
      onScoreUpdate(20);
      showNotification('🔒 Dữ liệu đã được mã hóa thành công!', 'success');
    } else {
      showNotification(`❌ Lỗi mã hóa: ${result.error}`, 'error');
    }
  };

  const clearForm = () => {
    setAccountNumber('');
    setAmount('');
    setContent('');
    setAesKey('');
    setEncryptedData('');
    setIv('');
  };

  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-bold text-yellow-400 mb-6 text-center border-b border-yellow-400 pb-3">
        <Key className="inline-block mr-2" />
        Mã hóa AES-256
      </h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="account-number" className="text-gray-300">
            Số tài khoản (9-12 chữ số)
          </Label>
          <Input
            id="account-number"
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
            className="crypto-input"
            placeholder="123456789012"
            maxLength={12}
          />
        </div>
        
        <div>
          <Label htmlFor="amount" className="text-gray-300">
            Số tiền (VND)
          </Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="crypto-input"
            placeholder="1000000"
            min="1000"
          />
        </div>
        
        <div>
          <Label htmlFor="transfer-content" className="text-gray-300">
            Nội dung chuyển khoản
          </Label>
          <Textarea
            id="transfer-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="crypto-input h-20 resize-none"
            placeholder="Chuyển tiền thanh toán..."
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={generateAESKey}
            className="banking-button-crypto"
          >
            <Key className="mr-2 h-4 w-4" />
            Tạo khóa AES
          </Button>
          
          <Button
            onClick={encryptData}
            disabled={!aesKey || !accountNumber || !amount || !content}
            className="banking-button-primary"
          >
            <Lock className="mr-2 h-4 w-4" />
            Mã hóa
          </Button>
        </div>
        
        <div>
          <Label htmlFor="aes-key" className="text-gray-300">
            Khóa AES (256-bit)
          </Label>
          <Input
            id="aes-key"
            value={aesKey}
            readOnly
            className="crypto-input text-green-400 bg-gray-800"
            placeholder="Nhấn 'Tạo khóa AES' để tạo khóa..."
          />
        </div>
        
        <div>
          <Label htmlFor="encrypted-data" className="text-gray-300">
            Dữ liệu đã mã hóa
          </Label>
          <Textarea
            id="encrypted-data"
            value={encryptedData}
            readOnly
            className="crypto-input text-yellow-400 bg-gray-800 h-24 resize-none"
            placeholder="Dữ liệu mã hóa sẽ hiển thị ở đây..."
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

      {/* Export encrypted data and key for next panel */}
      <div className="mt-4 p-3 bg-gray-800 rounded-lg text-xs">
        <p className="text-gray-400">
          💡 <strong>Lưu ý:</strong> Sau khi mã hóa, hãy chuyển sang panel "Xử lý Giao dịch" 
          để gửi dữ liệu mã hóa và thực hiện giải mã.
        </p>
      </div>
    </div>
  );
}
