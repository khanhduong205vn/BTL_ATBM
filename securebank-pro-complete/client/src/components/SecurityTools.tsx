import { useState } from 'react';
import { Hash, Shield, Download, Upload, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { CryptoUtils } from '@/lib/crypto-utils';
import type { GameState } from '@/lib/game-state';

interface SecurityToolsProps {
  onScoreUpdate: (points: number) => void;
  showNotification: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  gameData: GameState;
  onImportData: (data: Partial<GameState>) => void;
}

export default function SecurityTools({ onScoreUpdate, showNotification, gameData, onImportData }: SecurityToolsProps) {
  const [hashInput, setHashInput] = useState('');
  const [hashOutput, setHashOutput] = useState('');
  const [phishingUrl, setPhishingUrl] = useState('');
  const [phishingResult, setPhishingResult] = useState<{
    riskLevel: 'low' | 'medium' | 'high';
    score: number;
    warnings: string[];
  } | null>(null);

  const generateHash = async () => {
    if (!hashInput.trim()) {
      showNotification('⚠️ Vui lòng nhập dữ liệu cần hash!', 'error');
      return;
    }

    try {
      const hash = await CryptoUtils.generateSHA256(hashInput);
      setHashOutput(hash);
      onScoreUpdate(5);
      showNotification('🔨 Hash SHA-256 đã được tạo thành công!', 'success');
    } catch (error) {
      showNotification('❌ Lỗi khi tạo hash!', 'error');
    }
  };

  const checkPhishing = () => {
    if (!phishingUrl.trim()) {
      showNotification('⚠️ Vui lòng nhập URL hoặc email cần kiểm tra!', 'error');
      return;
    }

    const result = CryptoUtils.analyzePhishing(phishingUrl);
    setPhishingResult(result);
    
    const scoreBonus = {
      low: 10,
      medium: 15,
      high: 25
    }[result.riskLevel];
    
    onScoreUpdate(scoreBonus);
    showNotification('🔍 Đã hoàn thành kiểm tra phishing!', 'success');
  };

  const exportGameData = () => {
    try {
      const exportData = {
        ...gameData,
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
      showNotification('💾 Dữ liệu đã được xuất thành công!', 'success');
    } catch (error) {
      showNotification('❌ Lỗi khi xuất dữ liệu!', 'error');
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        // Validate data structure
        if (typeof data.score === 'number' && typeof data.level === 'number') {
          onImportData(data);
          showNotification('📂 Dữ liệu đã được nhập thành công!', 'success');
        } else {
          showNotification('❌ File dữ liệu không hợp lệ!', 'error');
        }
      } catch (error) {
        showNotification('❌ Lỗi: File dữ liệu bị hỏng!', 'error');
      }
    };
    reader.readAsText(file);
  };

  const getRiskColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low': return 'border-green-500 bg-green-900';
      case 'medium': return 'border-yellow-500 bg-yellow-900';
      case 'high': return 'border-red-500 bg-red-900';
    }
  };

  const getRiskIcon = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low': return '✅';
      case 'medium': return '⚠️';
      case 'high': return '🚨';
    }
  };

  const getRiskText = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low': return 'An toàn! Không phát hiện dấu hiệu phishing.';
      case 'medium': return 'Cảnh báo! Có một số dấu hiệu đáng nghi.';
      case 'high': return 'NGUY HIỂM! Có khả năng cao đây là phishing!';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      
      {/* Hash Generator */}
      <Card className="glass-card p-6">
        <h4 className="text-lg font-bold text-yellow-400 mb-4 text-center">
          <Hash className="inline-block mr-2" />
          Tạo Hash SHA-256
        </h4>
        <div className="space-y-3">
          <div>
            <Label htmlFor="hash-input" className="text-gray-300">
              Dữ liệu cần hash
            </Label>
            <Textarea
              id="hash-input"
              value={hashInput}
              onChange={(e) => setHashInput(e.target.value)}
              className="crypto-input h-20 resize-none"
              placeholder="Nhập dữ liệu cần tạo hash..."
            />
          </div>
          <Button
            onClick={generateHash}
            className="w-full banking-button-crypto"
          >
            <Hash className="mr-2 h-4 w-4" />
            Tạo Hash
          </Button>
          <div>
            <Label htmlFor="hash-output" className="text-gray-300">
              Hash SHA-256
            </Label>
            <Input
              id="hash-output"
              value={hashOutput}
              readOnly
              className="crypto-input text-purple-400 bg-gray-800 text-sm font-mono"
              placeholder="Hash SHA-256 sẽ hiển thị ở đây..."
            />
          </div>
        </div>
      </Card>
      
      {/* Phishing Detector */}
      <Card className="glass-card p-6">
        <h4 className="text-lg font-bold text-yellow-400 mb-4 text-center">
          <Shield className="inline-block mr-2" />
          Phát hiện Phishing
        </h4>
        <div className="space-y-3">
          <div>
            <Label htmlFor="phishing-url" className="text-gray-300">
              URL hoặc email nghi ngờ
            </Label>
            <Input
              id="phishing-url"
              type="url"
              value={phishingUrl}
              onChange={(e) => setPhishingUrl(e.target.value)}
              className="crypto-input"
              placeholder="Nhập URL hoặc email nghi ngờ..."
            />
          </div>
          <Button
            onClick={checkPhishing}
            className="w-full banking-button-danger"
          >
            <Shield className="mr-2 h-4 w-4" />
            Kiểm tra An toàn
          </Button>
          
          {phishingResult && (
            <Card className={`p-3 border-2 ${getRiskColor(phishingResult.riskLevel)}`}>
              <div className="text-center mb-2">
                <span className="text-2xl mr-2">{getRiskIcon(phishingResult.riskLevel)}</span>
                <span className="font-bold text-white">
                  {getRiskText(phishingResult.riskLevel)}
                </span>
              </div>
              <div className="text-sm text-gray-300">
                <div className="mb-2">
                  <strong>Điểm rủi ro:</strong> {phishingResult.score}/100
                </div>
                {phishingResult.warnings.length > 0 && (
                  <div>
                    <strong>Cảnh báo:</strong>
                    <ul className="list-disc list-inside ml-2 mt-1">
                      {phishingResult.warnings.map((warning, index) => (
                        <li key={index} className="text-xs">{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </Card>
      
      {/* Data Export/Import */}
      <Card className="glass-card p-6">
        <h4 className="text-lg font-bold text-yellow-400 mb-4 text-center">
          <Download className="inline-block mr-2" />
          Sao lưu Dữ liệu
        </h4>
        <div className="space-y-3">
          <Button
            onClick={exportGameData}
            className="w-full banking-button-primary"
          >
            <Download className="mr-2 h-4 w-4" />
            Xuất dữ liệu
          </Button>
          
          <div>
            <Label htmlFor="import-file" className="text-gray-300">
              Nhập dữ liệu đã lưu
            </Label>
            <Input
              id="import-file"
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="crypto-input"
            />
          </div>
          
          <div className="text-xs text-gray-400 text-center space-y-1">
            <p>Lưu tiến trình game để tiếp tục sau</p>
            <div className="flex justify-between text-xs">
              <span>Điểm: {gameData.score.toLocaleString('vi-VN')}</span>
              <span>Level: {gameData.level}</span>
              <span>Streak: {gameData.streak}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
