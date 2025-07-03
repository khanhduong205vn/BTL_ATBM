export interface EncryptionResult {
  encryptedData: string;
  iv: string;
  success: boolean;
  error?: string;
}

export interface DecryptionResult {
  decryptedData: string;
  success: boolean;
  error?: string;
}

export class CryptoUtils {
  
  /**
   * Generate a random AES-256 key (64 hex characters)
   */
  static generateAESKey(): string {
    const array = new Uint8Array(32); // 256 bits = 32 bytes
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Generate a secure random IV for AES encryption
   */
  static generateIV(): string {
    const array = new Uint8Array(16); // 128 bits = 16 bytes for AES block size
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Simulate AES-256-CBC encryption
   * In a real application, this would use Web Crypto API or a proper crypto library
   */
  static async encryptAES(data: string, key: string): Promise<EncryptionResult> {
    try {
      if (!data || !key) {
        return { encryptedData: '', iv: '', success: false, error: 'Dữ liệu hoặc khóa không hợp lệ' };
      }

      if (key.length !== 64) {
        return { encryptedData: '', iv: '', success: false, error: 'Khóa AES phải có độ dài 64 ký tự hex (256-bit)' };
      }

      // Generate random IV
      const iv = this.generateIV();
      
      // Simulate encryption by encoding with key and IV
      // In production, use proper AES-256-CBC implementation
      const timestamp = Date.now().toString();
      const payload = JSON.stringify({ data, timestamp, key: key.slice(0, 8) }); // Only store first 8 chars of key for verification
      
      // Use TextEncoder to handle Unicode characters properly
      const encoder = new TextEncoder();
      const uint8Array = encoder.encode(payload);
      let binaryString = '';
      for (let i = 0; i < uint8Array.length; i++) {
        binaryString += String.fromCharCode(uint8Array[i]);
      }
      const encoded = btoa(binaryString);
      
      // Add some randomness to make it look like real encrypted data
      const randomPrefix = this.generateRandomHex(8);
      const randomSuffix = this.generateRandomHex(8);
      const encryptedData = `${randomPrefix}${encoded}${randomSuffix}`;

      return {
        encryptedData,
        iv,
        success: true
      };

    } catch (error) {
      return {
        encryptedData: '',
        iv: '',
        success: false,
        error: `Lỗi mã hóa: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Simulate AES-256-CBC decryption
   */
  static async decryptAES(encryptedData: string, key: string, iv: string): Promise<DecryptionResult> {
    try {
      if (!encryptedData || !key || !iv) {
        return { decryptedData: '', success: false, error: 'Dữ liệu mã hóa, khóa hoặc IV không hợp lệ' };
      }

      if (key.length !== 64) {
        return { decryptedData: '', success: false, error: 'Khóa AES phải có độ dài 64 ký tự hex (256-bit)' };
      }

      // Remove random prefix and suffix (16 chars total)
      const coreData = encryptedData.slice(8, -8);
      
      // Decode the base64 data
      const binaryString = atob(coreData);
      const uint8Array = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
      }
      const decoder = new TextDecoder();
      const decoded = decoder.decode(uint8Array);
      const payload = JSON.parse(decoded);

      // Verify key matches
      if (payload.key !== key.slice(0, 8)) {
        return { decryptedData: '', success: false, error: 'Khóa AES không chính xác' };
      }

      // Check if data is not too old (for security)
      const dataAge = Date.now() - parseInt(payload.timestamp);
      if (dataAge > 24 * 60 * 60 * 1000) { // 24 hours
        return { decryptedData: '', success: false, error: 'Dữ liệu mã hóa đã hết hạn' };
      }

      return {
        decryptedData: payload.data,
        success: true
      };

    } catch (error) {
      return {
        decryptedData: '',
        success: false,
        error: `Lỗi giải mã: ${error instanceof Error ? error.message : 'Dữ liệu không hợp lệ'}`
      };
    }
  }

  /**
   * Generate SHA-256 hash
   */
  static async generateSHA256(data: string): Promise<string> {
    if (!data) return '';
    
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Generate a secure 6-digit OTP
   */
  static generateOTP(): string {
    const array = new Uint8Array(1);
    let otp = '';
    
    while (otp.length < 6) {
      crypto.getRandomValues(array);
      const digit = array[0] % 10;
      otp += digit.toString();
    }
    
    return otp;
  }

  /**
   * Validate account number format
   */
  static validateAccountNumber(accountNumber: string): { valid: boolean; error?: string } {
    if (!accountNumber) {
      return { valid: false, error: 'Số tài khoản không được để trống' };
    }

    if (!/^\d+$/.test(accountNumber)) {
      return { valid: false, error: 'Số tài khoản chỉ được chứa chữ số' };
    }

    if (accountNumber.length < 9 || accountNumber.length > 12) {
      return { valid: false, error: 'Số tài khoản phải có từ 9-12 chữ số' };
    }

    return { valid: true };
  }

  /**
   * Validate transaction amount
   */
  static validateAmount(amount: string | number): { valid: boolean; error?: string } {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    if (isNaN(numAmount)) {
      return { valid: false, error: 'Số tiền không hợp lệ' };
    }

    if (numAmount < 1000) {
      return { valid: false, error: 'Số tiền tối thiểu là 1,000 VND' };
    }

    if (numAmount > 1000000000) { // 1 billion VND
      return { valid: false, error: 'Số tiền tối đa là 1,000,000,000 VND' };
    }

    return { valid: true };
  }

  /**
   * Format currency in Vietnamese format
   */
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  /**
   * Check for phishing indicators in URL/text
   */
  static analyzePhishing(input: string): { riskLevel: 'low' | 'medium' | 'high'; score: number; warnings: string[] } {
    const warnings: string[] = [];
    let score = 0;

    const phishingKeywords = [
      'urgent', 'verify', 'suspend', 'limited time', 'act now', 'click here',
      'confirm identity', 'update payment', 'security alert', 'account locked',
      'immediate action', 'congrats', 'you won', 'claim now'
    ];

    const suspiciousDomains = [
      'bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly',
      'paypal-secure', 'bank-security', 'verify-account'
    ];

    const lowerInput = input.toLowerCase();

    // Check for phishing keywords
    phishingKeywords.forEach(keyword => {
      if (lowerInput.includes(keyword)) {
        score += 15;
        warnings.push(`Từ khóa đáng nghi: "${keyword}"`);
      }
    });

    // Check for suspicious domains
    suspiciousDomains.forEach(domain => {
      if (lowerInput.includes(domain)) {
        score += 25;
        warnings.push(`Tên miền đáng nghi: "${domain}"`);
      }
    });

    // Check for URL shorteners without HTTPS
    if (lowerInput.includes('http://') && !lowerInput.includes('https://')) {
      score += 20;
      warnings.push('Không sử dụng HTTPS (không an toàn)');
    }

    // Check for multiple subdomains
    const urlMatch = lowerInput.match(/https?:\/\/([^\/]+)/);
    if (urlMatch) {
      const domain = urlMatch[1];
      const subdomains = domain.split('.').length - 2;
      if (subdomains > 2) {
        score += 15;
        warnings.push('Quá nhiều subdomain');
      }
    }

    // Check for deceptive characters
    if (/[а-я]/.test(lowerInput)) { // Cyrillic characters
      score += 30;
      warnings.push('Chứa ký tự Cyrillic (có thể giả mạo)');
    }

    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high';
    if (score >= 50) {
      riskLevel = 'high';
    } else if (score >= 20) {
      riskLevel = 'medium';
    } else {
      riskLevel = 'low';
    }

    return { riskLevel, score, warnings };
  }

  /**
   * Generate random hexadecimal string
   */
  private static generateRandomHex(length: number): string {
    const array = new Uint8Array(Math.ceil(length / 2));
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('').slice(0, length);
  }

  /**
   * Secure random number generation
   */
  static secureRandom(min: number, max: number): number {
    const range = max - min + 1;
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return min + (array[0] % range);
  }

  /**
   * Generate secure password with specific requirements
   */
  static generateSecurePassword(length: number = 16): string {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    const allChars = lowercase + uppercase + numbers + symbols;
    let password = '';
    
    // Ensure at least one character from each category
    password += lowercase[this.secureRandom(0, lowercase.length - 1)];
    password += uppercase[this.secureRandom(0, uppercase.length - 1)];
    password += numbers[this.secureRandom(0, numbers.length - 1)];
    password += symbols[this.secureRandom(0, symbols.length - 1)];
    
    // Fill the rest randomly
    for (let i = 4; i < length; i++) {
      password += allChars[this.secureRandom(0, allChars.length - 1)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => this.secureRandom(0, 1) - 0.5).join('');
  }
}
