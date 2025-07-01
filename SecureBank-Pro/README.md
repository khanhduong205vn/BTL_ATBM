# 🏦 SecureBank Pro - Game Bảo mật Ngân hàng Chuyên nghiệp

## 📋 Giới thiệu

SecureBank Pro là một trò chơi giáo dục mô phỏng hệ thống bảo mật ngân hàng hiện đại. Người chơi sẽ đóng vai một chuyên viên bảo mật, thực hiện các giao dịch an toàn và trả lời quiz kiến thức bảo mật.

## ✨ Tính năng chính

### 🔐 Hệ thống Mã hóa
- **AES-256 Encryption**: Mã hóa dữ liệu giao dịch với thuật toán AES-256
- **SHA-256 Hashing**: Tạo fingerprint cho dữ liệu
- **OTP Authentication**: Xác thực 2 lớp với mã OTP 6 chữ số
- **RSA Support**: Hỗ trợ mã hóa bất đối xứng (trong phiên bản Python)

### 🧠 Mini Quiz Bảo mật
- **8+ câu hỏi**: Kiến thức về mã hóa, phishing, tấn công mạng
- **Thời gian**: 3 phút cho mỗi câu hỏi
- **Điểm thưởng**: 50-150 điểm tùy level
- **Giải thích**: Học hỏi từ các câu trả lời

### 🛡️ Công cụ Bảo mật
- **Phát hiện Phishing**: Kiểm tra URL và email đáng nghi
- **Hash Generator**: Tạo hash SHA-256 cho dữ liệu
- **Transaction Monitor**: Theo dõi lịch sử giao dịch

### 🎮 Gameplay
- **10+ Level**: Từ cơ bản đến chuyên gia
- **Streak System**: Chuỗi giao dịch thành công
- **Timer Challenge**: Áp lực thời gian tăng dần
- **Auto-save**: Lưu tiến trình tự động

### 🎨 Giao diện Hiện đại
- **Banking Theme**: Màu sắc chuyên nghiệp ngân hàng
- **Particles Animation**: Hiệu ứng particles vàng động
- **Gradient Background**: Nền gradient chuyển động
- **Responsive Design**: Tương thích mobile và desktop
- **Smooth Animations**: Các hiệu ứng mượt mà

## 🚀 Cách chạy

### Phiên bản Web (Khuyến nghị)
1. Mở file `securebank_pro.html` trong trình duyệt web
2. Hoặc chạy server local:
   ```bash
   python -m http.server 8000
   ```
3. Truy cập `http://localhost:8000/securebank_pro.html`

### Phiên bản Python (Desktop)
1. Cài đặt dependencies:
   ```bash
   pip install PySide6 pycryptodome rsa
   ```
2. Chạy game:
   ```bash
   python main.py
   ```

## 📁 Cấu trúc Project

```
SecureBank-Pro/
├── securebank_pro.html      # Phiên bản web chính (KHUYẾN NGHỊ)
├── game.html                # Phiên bản web đơn giản
├── index.html               # Trang giới thiệu
├── main.py                  # Phiên bản Python desktop
├── crypto_utils.py          # Thư viện mã hóa
├── modern_bank_style.qss    # Stylesheet cho Python
├── README.md                # Hướng dẫn này
└── replit.md               # Tài liệu kỹ thuật
```

## 🎯 Hướng dẫn chơi

### 1. Quy trình Giao dịch Cơ bản
1. **Tạo khóa AES**: Bấm "🔑 Tạo khóa AES" để tạo khóa mã hóa 256-bit
2. **Nhập thông tin**: 
   - Số tài khoản (9-12 chữ số)
   - Số tiền (VND)
   - Nội dung chuyển khoản
3. **Mã hóa**: Bấm "🔒 Mã hóa dữ liệu" để bảo mật thông tin
4. **Gửi**: Bấm "📨 Gửi giao dịch" để truyền dữ liệu
5. **Giải mã**: Nhập khóa AES và bấm "🔓 Giải mã dữ liệu"
6. **OTP**: Bấm "📱 Tạo mã OTP" và nhập mã 6 chữ số
7. **Xác thực**: Bấm "✅ Xác thực giao dịch" để hoàn tất

### 2. Mini Quiz
- Xuất hiện tự động mỗi 5 giao dịch thành công
- Hoặc bấm nút "🧠" để bắt đầu quiz bất kỳ lúc nào
- Thời gian: 3 phút cho mỗi câu hỏi
- Chủ đề: Mã hóa, bảo mật, phishing, tấn công mạng

### 3. Công cụ Bảo mật
- **Hash SHA-256**: Nhập dữ liệu và bấm "🔨 Tạo Hash"
- **Phát hiện Phishing**: Nhập URL/email và bấm "🔍 Kiểm tra Phishing"
- **Xuất/Nhập dữ liệu**: Sao lưu và khôi phục tiến trình game

## 🏆 Hệ thống Điểm

| Hoạt động | Điểm thưởng |
|-----------|-------------|
| Tạo khóa AES | +10 điểm |
| Mã hóa thành công | +20 điểm |
| Giải mã thành công | +30 điểm |
| Hoàn thành giao dịch | +100-300 điểm |
| Quiz đúng | +50-150 điểm |
| Bonus level | +50-500 điểm |

## 🔒 Mức độ Bảo mật

- **🔒 Thường (Level 1-2)**: Giao dịch cơ bản
- **🔐 Cao (Level 3-5)**: Thêm xác thực OTP
- **🛡️ Rất cao (Level 6-8)**: Mã hóa nâng cao
- **🔒 Tối đa (Level 9-12)**: Bảo mật đa lớp
- **⚡ Siêu việt (Level 13+)**: Chuyên gia bảo mật

## ⚙️ Yêu cầu Hệ thống

### Phiên bản Web
- Trình duyệt hiện đại (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- Không cần cài đặt thêm

### Phiên bản Python
- Python 3.8+ 
- PySide6 (GUI framework)
- pycryptodome (mã hóa)
- rsa (RSA encryption)
- RAM: 4GB+
- Ổ cứng: 100MB

## 🐛 Xử lý Lỗi

### Lỗi thường gặp:
1. **Lỗi mã hóa UTF-8**: Đã fix trong phiên bản mới
2. **Lỗi library Python**: Cài đặt lại dependencies
3. **Lag trên thiết bị cũ**: Tắt animations trong CSS

### Debug:
- Mở Developer Tools (F12) để xem console logs
- Kiểm tra file README cho troubleshooting

## 🔧 Phát triển

### Thêm tính năng mới:
1. Edit file `securebank_pro.html`
2. Thêm function JavaScript mới
3. Update CSS cho styling
4. Test trên nhiều trình duyệt

### Custom styling:
- Sửa CSS variables trong `:root`
- Thay đổi màu sắc theme ngân hàng
- Adjust animation timing

## 📜 License

MIT License - Sử dụng tự do cho mục đích giáo dục và thương mại.

## 👨‍💻 Tác giả

Phát triển bởi SecureBank Team với mục tiêu giáo dục về bảo mật thông tin.

## 🚀 Phiên bản tiếp theo

- [ ] Multiplayer mode
- [ ] Blockchain integration  
- [ ] AI opponent
- [ ] Mobile app
- [ ] Advanced cryptography algorithms
- [ ] Real-time collaborative security challenges

---

**🎮 Chúc bạn chơi game vui vẻ và học được nhiều kiến thức bảo mật!**