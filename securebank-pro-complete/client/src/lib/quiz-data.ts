export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'crypto' | 'security' | 'phishing' | 'banking' | 'general';
  points: number;
}

export const vietnameseQuizQuestions: QuizQuestion[] = [
  {
    id: 'aes_key_length',
    question: 'Thuật toán mã hóa AES-256 sử dụng khóa có độ dài bao nhiêu bit?',
    options: ['128 bit', '192 bit', '256 bit', '512 bit'],
    correct: 2,
    explanation: 'AES-256 sử dụng khóa 256-bit, đây là chuẩn mã hóa mạnh nhất trong họ AES, được khuyến nghị cho các ứng dụng bảo mật cao như ngân hàng và quân sự.',
    difficulty: 'easy',
    category: 'crypto',
    points: 50
  },
  {
    id: 'phishing_attack',
    question: 'Đâu là phương pháp tấn công phổ biến nhất đối với hệ thống ngân hàng?',
    options: ['Tấn công DDoS', 'Phishing qua email', 'SQL Injection', 'Brute Force'],
    correct: 1,
    explanation: 'Phishing qua email là phương thức tấn công phổ biến nhất, chiếm khoảng 70% các vụ tấn công ngân hàng vì nó khai thác lỗ hổng con người - yếu tố dễ bị tấn công nhất.',
    difficulty: 'easy',
    category: 'phishing',
    points: 60
  },
  {
    id: 'otp_lifetime',
    question: 'Thời gian tồn tại tối đa an toàn cho một mã OTP ngân hàng là?',
    options: ['30 giây', '60 giây', '2 phút', '5 phút'],
    correct: 1,
    explanation: 'Mã OTP ngân hàng nên có thời hạn tối đa 60 giây để cân bằng giữa bảo mật và trải nghiệm người dùng. Thời gian này đủ để người dùng nhập mã nhưng không quá dài để kẻ tấn công có thể lợi dụng.',
    difficulty: 'medium',
    category: 'security',
    points: 70
  },
  {
    id: 'sha256_length',
    question: 'Hash SHA-256 tạo ra kết quả có độ dài bao nhiêu ký tự (hexadecimal)?',
    options: ['32 ký tự', '48 ký tự', '64 ký tự', '128 ký tự'],
    correct: 2,
    explanation: 'SHA-256 tạo ra hash 256-bit, tương đương 64 ký tự hexadecimal (mỗi ký tự hex = 4 bit). Đây là chuẩn hash được sử dụng rộng rãi trong blockchain Bitcoin và nhiều hệ thống bảo mật khác.',
    difficulty: 'medium',
    category: 'crypto',
    points: 80
  },
  {
    id: 'best_2fa',
    question: 'Phương pháp xác thực 2 lớp (2FA) nào an toàn nhất cho ngân hàng?',
    options: ['SMS OTP', 'Email OTP', 'Authenticator App', 'Hardware Token'],
    correct: 3,
    explanation: 'Hardware Token (như USB token hoặc smart card) là an toàn nhất vì hoạt động offline, không thể bị tấn công qua mạng, và tạo mã dựa trên thuật toán mã hóa phần cứng không thể trích xuất.',
    difficulty: 'hard',
    category: 'security',
    points: 100
  },
  {
    id: 'web_vulnerabilities',
    question: 'Lỗ hổng bảo mật nào thường xuyên xuất hiện trong ứng dụng web ngân hàng?',
    options: ['Cross-Site Scripting (XSS)', 'Cross-Site Request Forgery (CSRF)', 'SQL Injection', 'Tất cả các đáp án trên'],
    correct: 3,
    explanation: 'Tất cả các lỗ hổng này đều phổ biến và nguy hiểm. Ngân hàng cần áp dụng nhiều lớp bảo vệ: input validation, CSRF tokens, Content Security Policy, và regular security audits.',
    difficulty: 'hard',
    category: 'security',
    points: 120
  },
  {
    id: 'pci_dss',
    question: 'Chuẩn bảo mật nào được yêu cầu bắt buộc cho hệ thống thanh toán thẻ?',
    options: ['ISO 27001', 'PCI DSS', 'SOX', 'GDPR'],
    correct: 1,
    explanation: 'PCI DSS (Payment Card Industry Data Security Standard) là chuẩn bảo mật bắt buộc cho mọi tổ chức xử lý, lưu trữ hoặc truyền tải dữ liệu thẻ thanh toán. Vi phạm có thể dẫn đến phạt tiền lớn.',
    difficulty: 'medium',
    category: 'banking',
    points: 90
  },
  {
    id: 'bitcoin_signature',
    question: 'Kỹ thuật mã hóa nào được sử dụng trong chữ ký số Bitcoin?',
    options: ['RSA', 'AES', 'ECDSA', 'DES'],
    correct: 2,
    explanation: 'Bitcoin sử dụng ECDSA (Elliptic Curve Digital Signature Algorithm) với đường cong secp256k1. ECDSA hiệu quả hơn RSA với cùng độ bảo mật và phù hợp cho blockchain.',
    difficulty: 'hard',
    category: 'crypto',
    points: 110
  },
  {
    id: 'ssl_tls',
    question: 'Giao thức nào đảm bảo bảo mật khi truyền dữ liệu qua internet?',
    options: ['HTTP', 'FTP', 'TLS/SSL', 'SMTP'],
    correct: 2,
    explanation: 'TLS (Transport Layer Security) và SSL (Secure Sockets Layer) đảm bảo mã hóa end-to-end cho dữ liệu truyền qua internet. Phiên bản hiện tại TLS 1.3 là an toàn nhất.',
    difficulty: 'easy',
    category: 'security',
    points: 50
  },
  {
    id: 'social_engineering',
    question: 'Kỹ thuật tấn công nào dựa vào việc thao túng tâm lý con người?',
    options: ['Brute Force', 'Social Engineering', 'DDoS', 'SQL Injection'],
    correct: 1,
    explanation: 'Social Engineering là kỹ thuật tấn công dựa vào việc thao túng tâm lý để lừa đảo thông tin. Đây là một trong những phương pháp tấn công hiệu quả nhất vì khai thác yếu tố con người.',
    difficulty: 'easy',
    category: 'phishing',
    points: 60
  },
  {
    id: 'blockchain_hash',
    question: 'Trong blockchain, hash của block trước được lưu ở đâu trong block hiện tại?',
    options: ['Block header', 'Transaction data', 'Merkle root', 'Timestamp'],
    correct: 0,
    explanation: 'Hash của block trước được lưu trong block header của block hiện tại, tạo thành chuỗi liên kết bảo mật. Điều này đảm bảo tính bất biến của blockchain.',
    difficulty: 'medium',
    category: 'crypto',
    points: 85
  },
  {
    id: 'zero_day',
    question: 'Zero-day vulnerability là gì?',
    options: ['Lỗ hổng đã được vá', 'Lỗ hổng chưa được phát hiện', 'Lỗ hổng đã công bố nhưng chưa vá', 'Lỗ hổng trong ngày đầu tiên'],
    correct: 2,
    explanation: 'Zero-day vulnerability là lỗ hổng đã được phát hiện và có thể đang bị khai thác, nhưng nhà phát triển chưa có bản vá. Đây là loại lỗ hổng nguy hiểm nhất.',
    difficulty: 'medium',
    category: 'security',
    points: 95
  },
  {
    id: 'rsa_vs_ecc',
    question: 'Tại sao ECC (Elliptic Curve Cryptography) được ưa chuộng hơn RSA trong thiết bị di động?',
    options: ['Bảo mật tốt hơn', 'Khóa ngắn hơn với cùng độ bảo mật', 'Dễ triển khai hơn', 'Có từ lâu hơn'],
    correct: 1,
    explanation: 'ECC cung cấp cùng mức độ bảo mật như RSA nhưng với khóa ngắn hơn đáng kể, làm giảm tải tính toán và tiết kiệm pin - rất quan trọng cho thiết bị di động.',
    difficulty: 'hard',
    category: 'crypto',
    points: 130
  },
  {
    id: 'quantum_threat',
    question: 'Thuật toán mã hóa nào có thể chống lại tấn công từ máy tính lượng tử?',
    options: ['RSA', 'ECC', 'Post-Quantum Cryptography', 'AES-128'],
    correct: 2,
    explanation: 'Post-Quantum Cryptography được thiết kế để chống lại cả máy tính cổ điển và lượng tử. RSA và ECC sẽ bị phá vỡ bởi thuật toán Shor trên máy tính lượng tử.',
    difficulty: 'hard',
    category: 'crypto',
    points: 150
  },
  {
    id: 'incident_response',
    question: 'Bước đầu tiên trong quy trình phản ứng sự cố bảo mật là gì?',
    options: ['Điều tra nguyên nhân', 'Cô lập hệ thống bị tấn công', 'Thông báo cho khách hàng', 'Khôi phục dữ liệu'],
    correct: 1,
    explanation: 'Cô lập hệ thống bị tấn công là bước đầu tiên để ngăn chặn sự lan truyền của cuộc tấn công và bảo vệ các hệ thống khác. Sau đó mới đến điều tra và khôi phục.',
    difficulty: 'medium',
    category: 'security',
    points: 75
  }
];

export function getQuizQuestions(level: number, count: number = 5): QuizQuestion[] {
  // Filter questions based on level difficulty
  let availableQuestions = vietnameseQuizQuestions;
  
  if (level <= 3) {
    availableQuestions = vietnameseQuizQuestions.filter(q => q.difficulty === 'easy');
  } else if (level <= 6) {
    availableQuestions = vietnameseQuizQuestions.filter(q => q.difficulty === 'easy' || q.difficulty === 'medium');
  } else {
    // All difficulties for high levels
    availableQuestions = vietnameseQuizQuestions;
  }
  
  // Shuffle and return requested count
  const shuffled = [...availableQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function calculateQuizScore(question: QuizQuestion, timeLeft: number, totalTime: number): number {
  const baseScore = question.points;
  const timeBonus = Math.floor((timeLeft / totalTime) * (baseScore * 0.5));
  const difficultyMultiplier = {
    easy: 1,
    medium: 1.2,
    hard: 1.5
  }[question.difficulty];
  
  return Math.floor((baseScore + timeBonus) * difficultyMultiplier);
}
