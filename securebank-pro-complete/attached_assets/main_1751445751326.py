import sys
import random
import string
import hashlib
import rsa
import base64
from PySide6.QtWidgets import (QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout, QLabel, QLineEdit,
                               QPushButton, QFrame, QGridLayout, QStackedWidget, QMessageBox, QProgressBar, QListWidget,
                               QSizePolicy, QListWidgetItem, QGraphicsOpacityEffect, QGraphicsDropShadowEffect)
from PySide6.QtGui import QColor, QPainter, QPen, QBrush, QLinearGradient, QFont, QPalette, QPixmap
from PySide6.QtCore import Qt, Slot, QTimer, QTime, QPropertyAnimation, QEasingCurve, QRect, QParallelAnimationGroup, QSequentialAnimationGroup
from crypto_utils import encrypt_aes, decrypt_aes
import os
import re

# Dữ liệu nâng cấp
UPGRADES = {
    "firewall": {"name": "🔥 Tường lửa Nâng cao", "cost": 30, "description": "Giảm 20% tỉ lệ gói tin bị tấn công", "effect": {"detection": 0.2}},
    "cpu": {"name": "⚡ Bộ xử lý Lượng tử", "cost": 50, "description": "Tăng thêm 15 giây xử lý ở các màn khó", "effect": {"speed": 15}},
    "scanner": {"name": "🛡️ Hệ thống Cảnh báo Sớm", "cost": 70, "description": "Tự động phát hiện lỗi và cảnh báo", "effect": {"detection": 0.3}},
    "ai_detection": {"name": "🤖 AI Phát hiện Bất thường", "cost": 100, "description": "Giảm 30% nguy cơ tấn công giả lập", "effect": {"detection": 0.3}},
    "backup_server": {"name": "💾 Máy chủ Dự phòng", "cost": 120, "description": "Tăng 20 giây xử lý khi có sự cố", "effect": {"speed": 20}},
    "decoder": {"name": "🔓 Bộ công cụ Giải mã", "cost": 50, "description": "Tăng 10% tốc độ xử lý", "effect": {"speed": 10}},
    "detection": {"name": "🔍 Phát hiện Giả mạo", "cost": 50, "description": "Tăng 20% xác suất phát hiện", "effect": {"detection": 0.2}},
    "training": {"name": "🎓 Khóa học An ninh", "cost": 50, "description": "Tăng 50 điểm kinh nghiệm", "effect": {"score": 50}}
}

class AnimatedBackground(QWidget):
    """Widget nền với hiệu ứng động gradient và particles"""
    def __init__(self, parent=None):
        super().__init__(parent)
        self.particles = []
        self.init_particles()
        self.gradient_offset = 0
        
        # Timer cho animation
        self.animation_timer = QTimer(self)
        self.animation_timer.timeout.connect(self.update_animation)
        self.animation_timer.start(50)  # 50ms refresh rate
        
        self.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Expanding)

    def init_particles(self):
        """Khởi tạo các particles cho hiệu ứng nền"""
        for _ in range(50):
            particle = {
                'x': random.randint(0, 1920),
                'y': random.randint(0, 1080),
                'size': random.randint(1, 3),
                'speed_x': random.uniform(-0.5, 0.5),
                'speed_y': random.uniform(-0.5, 0.5),
                'opacity': random.randint(30, 100)
            }
            self.particles.append(particle)

    def paintEvent(self, event):
        painter = QPainter(self)
        painter.setRenderHint(QPainter.Antialiasing)
        
        # Gradient nền động
        gradient = QLinearGradient(0, 0, self.width(), self.height())
        gradient.setColorAt(0, QColor(15, 32, 62))  # Xanh đậm
        gradient.setColorAt(0.5, QColor(25, 55, 109))  # Xanh ngân hàng
        gradient.setColorAt(1, QColor(35, 47, 68))  # Xám xanh
        
        painter.fillRect(self.rect(), gradient)
        
        # Vẽ particles
        for particle in self.particles:
            painter.setBrush(QBrush(QColor(100, 150, 255, particle['opacity'])))
            painter.setPen(Qt.NoPen)
            painter.drawEllipse(int(particle['x']), int(particle['y']), 
                              particle['size'], particle['size'])

    def update_animation(self):
        """Cập nhật vị trí particles"""
        for particle in self.particles:
            particle['x'] += particle['speed_x']
            particle['y'] += particle['speed_y']
            
            # Reset particle khi ra khỏi màn hình
            if particle['x'] < 0 or particle['x'] > self.width():
                particle['x'] = random.randint(0, self.width())
            if particle['y'] < 0 or particle['y'] > self.height():
                particle['y'] = random.randint(0, self.height())
        
        self.update()

class AnimatedButton(QPushButton):
    """Nút bấm với hiệu ứng animation"""
    def __init__(self, text, parent=None):
        super().__init__(text, parent)
        self.default_color = QColor(25, 55, 109)
        self.hover_color = QColor(35, 85, 165)
        self.press_color = QColor(15, 35, 79)
        
        # Animation cho scale effect
        self.scale_animation = QPropertyAnimation(self, b"geometry")
        self.scale_animation.setDuration(150)
        self.scale_animation.setEasingCurve(QEasingCurve.OutQuad)
        
        # Shadow effect
        self.shadow_effect = QGraphicsDropShadowEffect()
        self.shadow_effect.setBlurRadius(10)
        self.shadow_effect.setColor(QColor(0, 0, 0, 50))
        self.shadow_effect.setOffset(0, 2)
        self.setGraphicsEffect(self.shadow_effect)

    def enterEvent(self, event):
        """Hiệu ứng khi hover"""
        super().enterEvent(event)
        self.animate_scale(1.05)
        self.shadow_effect.setBlurRadius(15)
        self.shadow_effect.setOffset(0, 4)

    def leaveEvent(self, event):
        """Hiệu ứng khi rời chuột"""
        super().leaveEvent(event)
        self.animate_scale(1.0)
        self.shadow_effect.setBlurRadius(10)
        self.shadow_effect.setOffset(0, 2)

    def animate_scale(self, scale_factor):
        """Animation scaling"""
        current_rect = self.geometry()
        center = current_rect.center()
        new_width = int(current_rect.width() * scale_factor)
        new_height = int(current_rect.height() * scale_factor)
        new_rect = QRect(0, 0, new_width, new_height)
        new_rect.moveCenter(center)
        
        self.scale_animation.setStartValue(current_rect)
        self.scale_animation.setEndValue(new_rect)
        self.scale_animation.start()

class AnimatedProgressBar(QProgressBar):
    """Thanh tiến trình với hiệu ứng animation"""
    def __init__(self, parent=None):
        super().__init__(parent)
        self.pulse_timer = QTimer(self)
        self.pulse_timer.timeout.connect(self.pulse_effect)
        self.pulse_value = 0
        self.pulse_direction = 1

    def start_pulse(self):
        """Bắt đầu hiệu ứng pulse"""
        self.pulse_timer.start(50)

    def stop_pulse(self):
        """Dừng hiệu ứng pulse"""
        self.pulse_timer.stop()

    def pulse_effect(self):
        """Hiệu ứng pulse cho thanh tiến trình"""
        self.pulse_value += self.pulse_direction * 2
        if self.pulse_value >= 20:
            self.pulse_direction = -1
        elif self.pulse_value <= 0:
            self.pulse_direction = 1
        self.update()

class TransactionNotification(QWidget):
    """Widget thông báo giao dịch với animation"""
    def __init__(self, message, success=True, parent=None):
        super().__init__(parent)
        self.success = success
        self.init_ui(message)
        self.setup_animations()

    def init_ui(self, message):
        layout = QHBoxLayout(self)
        
        # Icon
        icon_label = QLabel("✅" if self.success else "❌")
        icon_label.setStyleSheet("font-size: 20px;")
        
        # Message
        msg_label = QLabel(message)
        msg_label.setStyleSheet("""
            color: white;
            font-weight: bold;
            font-size: 14px;
        """)
        
        layout.addWidget(icon_label)
        layout.addWidget(msg_label)
        
        # Styling
        bg_color = "rgba(40, 167, 69, 0.9)" if self.success else "rgba(220, 53, 69, 0.9)"
        self.setStyleSheet(f"""
            QWidget {{
                background-color: {bg_color};
                border-radius: 8px;
                padding: 10px;
                border: 1px solid rgba(255, 255, 255, 0.3);
            }}
        """)

    def setup_animations(self):
        """Thiết lập animations cho notification"""
        # Fade in animation
        self.opacity_effect = QGraphicsOpacityEffect()
        self.setGraphicsEffect(self.opacity_effect)
        
        self.fade_in = QPropertyAnimation(self.opacity_effect, b"opacity")
        self.fade_in.setDuration(300)
        self.fade_in.setStartValue(0.0)
        self.fade_in.setEndValue(1.0)
        
        # Slide in animation
        self.slide_in = QPropertyAnimation(self, b"geometry")
        self.slide_in.setDuration(300)
        self.slide_in.setEasingCurve(QEasingCurve.OutQuad)

    def show_notification(self, position):
        """Hiển thị notification với animation"""
        start_rect = QRect(position.x(), position.y() - 50, 300, 60)
        end_rect = QRect(position.x(), position.y(), 300, 60)
        
        self.setGeometry(start_rect)
        self.slide_in.setStartValue(start_rect)
        self.slide_in.setEndValue(end_rect)
        
        # Parallel animation
        self.animation_group = QParallelAnimationGroup()
        self.animation_group.addAnimation(self.fade_in)
        self.animation_group.addAnimation(self.slide_in)
        
        self.show()
        self.animation_group.start()
        
        # Auto hide after 3 seconds
        QTimer.singleShot(3000, self.hide_notification)

    def hide_notification(self):
        """Ẩn notification với animation"""
        fade_out = QPropertyAnimation(self.opacity_effect, b"opacity")
        fade_out.setDuration(300)
        fade_out.setStartValue(1.0)
        fade_out.setEndValue(0.0)
        fade_out.finished.connect(self.hide)
        fade_out.start()

class PhishingScreen(QWidget):
    """Màn hình phishing với hiệu ứng"""
    def __init__(self, parent=None):
        super().__init__(parent)
        layout = QVBoxLayout(self)
        
        # Title với animation
        title = QLabel("🎣 Phát hiện Email Lừa đảo")
        title.setObjectName("AnimatedTitle")
        title.setAlignment(Qt.AlignCenter)
        
        self.email_list = QListWidget()
        self.email_list.setObjectName("ModernList")
        self.email_list.addItems([
            "📧 Email 1: Thông báo chuyển khoản khẩn cấp",
            "📧 Email 2: Cập nhật bảo mật tài khoản", 
            "📧 Email 3: Phần thưởng khách hàng VIP",
            "⚠️ Email 4: Cảnh báo tài khoản bị đóng băng"
        ])
        
        self.email_body = QLabel("📋 Chọn email để xem chi tiết...")
        self.email_body.setObjectName("EmailContent")
        self.email_body.setWordWrap(True)
        
        layout.addWidget(title)
        layout.addWidget(self.email_list)
        layout.addWidget(self.email_body)
        
        self.email_list.currentTextChanged.connect(self.update_email_body)
        self.setStyleSheet("background: transparent;")

    def update_email_body(self, text):
        """Cập nhật nội dung email với hiệu ứng"""
        if "khẩn cấp" in text or "đóng băng" in text:
            self.email_body.setText("""
            🚨 CẢNH BÁO: Email lừa đảo!
            
            Dấu hiệu nhận biết:
            • Tạo cảm giác khẩn cấp
            • Yêu cầu thông tin cá nhân
            • Liên kết đáng nghi
            • Lỗi chính tả, ngữ pháp
            
            ❌ KHÔNG BẤM LINK hoặc cung cấp thông tin!
            """)
            self.email_body.setStyleSheet("""
                QLabel#EmailContent {
                    background: qlineargradient(x1:0, y1:0, x2:1, y2:1,
                        stop:0 rgba(220, 53, 69, 0.1),
                        stop:1 rgba(220, 53, 69, 0.05));
                    border-left: 4px solid #dc3545;
                    color: #dc3545;
                    font-weight: bold;
                }
            """)
        else:
            self.email_body.setText("""
            ✅ Email hợp lệ
            
            Đặc điểm email tin cậy:
            • Từ địa chỉ chính thức
            • Nội dung rõ ràng, chính xác
            • Không yêu cầu thông tin nhạy cảm
            • Có thể xác minh qua kênh khác
            
            ✓ An toàn để xử lý
            """)
            self.email_body.setStyleSheet("""
                QLabel#EmailContent {
                    background: qlineargradient(x1:0, y1:0, x2:1, y2:1,
                        stop:0 rgba(40, 167, 69, 0.1),
                        stop:1 rgba(40, 167, 69, 0.05));
                    border-left: 4px solid #28a745;
                    color: #28a745;
                    font-weight: bold;
                }
            """)

class UpgradeScreen(QWidget):
    """Màn hình nâng cấp với animation"""
    def __init__(self, parent=None):
        super().__init__(parent)
        self.parent = parent
        layout = QVBoxLayout(self)
        layout.setAlignment(Qt.AlignCenter)
        layout.setSpacing(20)
        
        # Title
        title_label = QLabel("🏪 Cửa hàng Nâng cấp Hệ thống")
        title_label.setObjectName("ShopTitle")
        title_label.setAlignment(Qt.AlignCenter)
        layout.addWidget(title_label)
        
        # Score display
        self.upgrade_score_label = QLabel("💰 Điểm của bạn: 0")
        self.upgrade_score_label.setObjectName("ScoreDisplay")
        layout.addWidget(self.upgrade_score_label)
        
        # Upgrade buttons
        self.upgrade_buttons = {}
        upgrade_layout = QVBoxLayout()
        
        for key, upgrade in UPGRADES.items():
            btn = AnimatedButton(f"{upgrade['name']} - {upgrade['cost']} điểm\n{upgrade['description']}")
            btn.setObjectName("UpgradeButton")
            btn.clicked.connect(lambda checked, k=key: self.parent.purchase_upgrade(k))
            upgrade_layout.addWidget(btn)
            self.upgrade_buttons[key] = btn
        
        layout.addLayout(upgrade_layout)
        
        # Continue button
        btn_continue = AnimatedButton("🚀 Tiếp tục Ca làm việc")
        btn_continue.setObjectName("ContinueButton")
        btn_continue.clicked.connect(parent.proceed_to_next_level)
        layout.addWidget(btn_continue)

class BankSecurityGame(QMainWindow):
    """Game bảo mật ngân hàng với giao diện hiện đại"""
    def __init__(self):
        super().__init__()
        self.sender_public_key, self.sender_private_key = rsa.newkeys(2048)
        self.aes_key = base64.urlsafe_b64encode(os.urandom(16)).decode('utf-8')[:16]
        self.score = 0
        self.level = 1
        self.player_name = ""
        self.current_transaction_index = 0
        self.success_streak = 0
        self.purchased_upgrades = []
        self.upgrade_bonus = {"speed": 0, "detection": 0, "score": 0}
        self.achievements = []
        self.is_alerting = False
        self.otp_code = ""
        self.blink_timer = None
        self.is_blinking = False
        self.completed_transactions = []
        
        # Storyline data
        self.storyline_titles = {
            1: "🌅 Ca sáng - Khởi động hệ thống", 2: "☀️ Ca sáng - Giao dịch thường",
            3: "⚡ Hệ thống Quá tải", 4: "🔥 Áp lực Cao điểm",
            5: "🎯 Tấn công Có mục đích", 6: "⚔️ Chiến thuật Tấn công",
            7: "💥 Khủng hoảng Tài chính", 8: "🕷️ Tấn công Man-in-the-Middle",
            9: "🔨 Brute Force Nâng cao", 10: "🌍 Cuộc chiến Bảo mật Toàn cầu"
        }
        
        self.transactions_per_level = {1: 2, 2: 3, 3: 4, 4: 4, 5: 5, 6: 5, 7: 6, 8: 7, 9: 8, 10: 10}
        
        # Timers
        self.timer = QTimer(self)
        self.timer.timeout.connect(self.update_timer)
        self.alert_timer = QTimer(self)
        self.alert_timer.timeout.connect(self.update_alert)
        
        self.init_ui()
        self.load_styles()
        self.reset_transaction_state()

    def init_ui(self):
        """Khởi tạo giao diện người dùng"""
        self.setObjectName("MainWindow")
        self.setWindowTitle("🏦 SecureBank Pro - Hệ thống Bảo mật Giao dịch")
        self.setMinimumSize(1200, 800)
        
        # Container chính
        self.container = QWidget(self)
        self.container.setObjectName("CentralWidget")
        self.setCentralWidget(self.container)
        
        # Background animation
        self.background_widget = AnimatedBackground(self.container)
        
        # Stacked widget cho các màn hình
        self.stack = QStackedWidget(self.container)
        self.stack.setStyleSheet("background: transparent;")
        
        # Tạo các màn hình
        self.create_start_screen()
        self.create_game_screen()
        self.phishing_screen = PhishingScreen(self)
        self.upgrade_screen = UpgradeScreen(self)
        
        # Thêm vào stack
        self.stack.addWidget(self.start_screen_widget)
        self.stack.addWidget(self.game_screen_widget)
        self.stack.addWidget(self.phishing_screen)
        self.stack.addWidget(self.upgrade_screen)
        
        self.show_start_screen()

    def load_styles(self):
        """Load stylesheet hiện đại"""
        with open('modern_bank_style.qss', 'r', encoding='utf-8') as f:
            self.setStyleSheet(f.read())

    def resizeEvent(self, event):
        """Xử lý thay đổi kích thước cửa sổ"""
        self.background_widget.resize(event.size())
        self.stack.resize(event.size())
        super().resizeEvent(event)

    def create_start_screen(self):
        """Tạo màn hình bắt đầu"""
        self.start_screen_widget = QWidget()
        self.start_screen_widget.setStyleSheet("background: transparent;")
        layout = QVBoxLayout(self.start_screen_widget)
        layout.setAlignment(Qt.AlignCenter)
        layout.setSpacing(30)
        
        # Logo và title
        title = QLabel("🏦 SecureBank Pro")
        title.setObjectName("MainTitle")
        
        subtitle = QLabel("Hệ thống Bảo mật Giao dịch Ngân hàng")
        subtitle.setObjectName("Subtitle")
        
        # Input tên người chơi  
        self.entry_player_name = QLineEdit()
        self.entry_player_name.setPlaceholderText("👤 Nhập tên Chuyên viên Bảo mật...")
        self.entry_player_name.setObjectName("PlayerNameInput")
        self.entry_player_name.setMinimumWidth(400)
        
        # Start button
        btn_start = AnimatedButton("🚀 Bắt đầu Ca làm việc")
        btn_start.setObjectName("StartButton")
        btn_start.clicked.connect(lambda: self.setup_new_level(1))
        
        layout.addWidget(title)
        layout.addWidget(subtitle)
        layout.addWidget(self.entry_player_name)
        layout.addWidget(btn_start)

    def create_game_screen(self):
        """Tạo màn hình game chính"""
        self.game_screen_widget = QWidget()
        self.game_screen_widget.setObjectName("GameScreen")
        layout = QVBoxLayout(self.game_screen_widget)
        layout.setContentsMargins(20, 20, 20, 20)
        layout.setSpacing(15)
        
        # Header với thông tin game
        header_layout = self.create_header()
        layout.addLayout(header_layout)
        
        # Danh sách giao dịch đã xử lý
        self.completed_transactions_list = QListWidget()
        self.completed_transactions_list.setObjectName("CompletedTransactionsList")
        self.completed_transactions_list.setMaximumHeight(100)
        layout.addWidget(self.create_group_box("✅ Giao dịch Đã Xử lý", self.completed_transactions_list))
        
        # Panel chính với sender và receiver
        main_panels = self.create_main_panels()
        layout.addLayout(main_panels)
        
        # Buttons control
        control_buttons = self.create_control_buttons()
        layout.addLayout(control_buttons)

    def create_header(self):
        """Tạo header với thông tin game"""
        header_layout = QHBoxLayout()
        
        self.label_level = QLabel()
        self.label_level.setObjectName("LevelLabel")
        
        self.label_score = QLabel()
        self.label_score.setObjectName("ScoreLabel")
        
        self.timer_label = AnimatedProgressBar()
        self.timer_label.setObjectName("TimerBar")
        self.timer_label.setMinimumWidth(200)
        
        self.achievement_label = QLabel("🏆 Huy hiệu: Chưa có")
        self.achievement_label.setObjectName("AchievementLabel")
        
        header_layout.addWidget(self.label_level)
        header_layout.addWidget(self.timer_label)
        header_layout.addWidget(self.achievement_label)
        header_layout.addStretch()
        header_layout.addWidget(self.label_score)
        
        return header_layout

    def create_main_panels(self):
        """Tạo panel chính với sender và receiver"""
        main_hbox = QHBoxLayout()
        main_hbox.setSpacing(20)
        
        # Sender panel
        sender_panel = self.create_sender_panel()
        main_hbox.addWidget(self.create_group_box("📤 BÊN GỬI (SENDER)", sender_panel), 1)
        
        # Receiver panel  
        receiver_panel = self.create_receiver_panel()
        main_hbox.addWidget(self.create_group_box("📥 BÊN NHẬN (RECEIVER)", receiver_panel), 1)
        
        return main_hbox

    def create_sender_panel(self):
        """Tạo panel bên gửi"""
        layout = QVBoxLayout()
        layout.setSpacing(15)
        
        # Input fields
        self.entry_account = QLineEdit()
        self.entry_account.setPlaceholderText("💳 Số tài khoản (chỉ số và chữ không dấu)")
        self.entry_account.setObjectName("AccountInput")
        
        self.entry_amount = QLineEdit()
        self.entry_amount.setPlaceholderText("💰 Số tiền giao dịch")
        self.entry_amount.setObjectName("AmountInput")
        
        self.entry_message = QLineEdit()
        self.entry_message.setPlaceholderText("💬 Nội dung chuyển khoản")
        self.entry_message.setObjectName("MessageInput")
        
        # Buttons
        self.btn_generate_keys = AnimatedButton("🔑 Tạo Khóa RSA")
        self.btn_generate_keys.setObjectName("GenerateButton")
        self.btn_generate_keys.clicked.connect(self.generate_keys)
        
        self.btn_encrypt = AnimatedButton("🔒 Mã hóa & Gửi")
        self.btn_encrypt.setObjectName("EncryptButton")
        self.btn_encrypt.clicked.connect(self.encrypt_and_send)
        
        # Status
        self.sender_status = QLabel("⏳ Chờ nhập liệu...")
        self.sender_status.setObjectName("StatusLabel")
        
        layout.addWidget(self.entry_account)
        layout.addWidget(self.entry_amount)
        layout.addWidget(self.entry_message)
        layout.addWidget(self.btn_generate_keys)
        layout.addWidget(self.btn_encrypt)
        layout.addWidget(self.sender_status)
        
        return layout

    def create_receiver_panel(self):
        """Tạo panel bên nhận"""
        layout = QVBoxLayout()
        layout.setSpacing(15)
        
        # Display fields
        self.display_encrypted = QLineEdit()
        self.display_encrypted.setPlaceholderText("🔐 Dữ liệu mã hóa sẽ hiển thị ở đây...")
        self.display_encrypted.setReadOnly(True)
        self.display_encrypted.setObjectName("EncryptedDisplay")
        
        self.display_decrypted = QLineEdit()
        self.display_decrypted.setPlaceholderText("📋 Dữ liệu giải mã sẽ hiển thị ở đây...")
        self.display_decrypted.setReadOnly(True)
        self.display_decrypted.setObjectName("DecryptedDisplay")
        
        # OTP
        self.entry_otp = QLineEdit()
        self.entry_otp.setPlaceholderText("🔢 Nhập mã OTP để xác thực")
        self.entry_otp.setObjectName("OTPInput")
        
        # Buttons
        self.btn_decrypt = AnimatedButton("🔓 Giải mã & Xác thực")
        self.btn_decrypt.setObjectName("DecryptButton")
        self.btn_decrypt.clicked.connect(self.decrypt_and_verify)
        
        self.btn_complete = AnimatedButton("✅ Hoàn thành Giao dịch")
        self.btn_complete.setObjectName("CompleteButton")
        self.btn_complete.clicked.connect(self.complete_transaction)
        
        # Status
        self.receiver_status = QLabel("⏳ Chờ dữ liệu...")
        self.receiver_status.setObjectName("StatusLabel")
        
        layout.addWidget(self.display_encrypted)
        layout.addWidget(self.display_decrypted)
        layout.addWidget(self.entry_otp)
        layout.addWidget(self.btn_decrypt)
        layout.addWidget(self.btn_complete)
        layout.addWidget(self.receiver_status)
        
        return layout

    def create_control_buttons(self):
        """Tạo các nút điều khiển"""
        button_layout = QHBoxLayout()
        button_layout.setSpacing(15)
        
        self.btn_help = AnimatedButton("❓ Hướng dẫn")
        self.btn_help.setObjectName("HelpButton") 
        self.btn_help.clicked.connect(self.show_help)
        
        self.btn_emergency = AnimatedButton("🚨 Chế độ Khẩn cấp")
        self.btn_emergency.setObjectName("EmergencyButton")
        self.btn_emergency.clicked.connect(self.on_emergency)
        
        self.btn_upgrade = AnimatedButton("🛒 Cửa hàng Nâng cấp")
        self.btn_upgrade.setObjectName("UpgradeButton")
        self.btn_upgrade.clicked.connect(self.show_upgrade_screen)
        
        button_layout.addStretch()
        button_layout.addWidget(self.btn_help)
        button_layout.addWidget(self.btn_emergency)
        button_layout.addWidget(self.btn_upgrade)
        button_layout.addStretch()
        
        return button_layout

    def create_group_box(self, title, widget):
        """Tạo group box cho các panel"""
        frame = QFrame()
        frame.setObjectName("GroupFrame")
        layout = QVBoxLayout(frame)
        
        title_label = QLabel(title)
        title_label.setObjectName("GroupTitleLabel")
        
        layout.addWidget(title_label)
        if isinstance(widget, QLayout):
            layout.addLayout(widget)
        else:
            layout.addWidget(widget)
            
        return frame

    # Game logic methods (giữ nguyên từ code gốc)
    def generate_keys(self):
        """Tạo khóa RSA mới"""
        self.sender_public_key, self.sender_private_key = rsa.newkeys(2048)
        self.sender_status.setText("✅ Đã tạo khóa RSA 2048-bit")
        self.show_notification("🔑 Khóa RSA đã được tạo thành công!", True)

    def encrypt_and_send(self):
        """Mã hóa và gửi dữ liệu"""
        account = self.entry_account.text().strip()
        amount = self.entry_amount.text().strip()
        message = self.entry_message.text().strip()
        
        if not all([account, amount, message]):
            self.show_notification("⚠️ Vui lòng nhập đầy đủ thông tin!", False)
            return
            
        # Validate account format
        if not re.match(r'^[a-zA-Z0-9]+$', account):
            self.show_notification("❌ Số tài khoản chỉ được chứa chữ và số!", False)
            return
            
        try:
            float(amount)
        except ValueError:
            self.show_notification("❌ Số tiền không hợp lệ!", False)
            return
        
        # Mã hóa dữ liệu
        data = f"Tài khoản: {account}|Số tiền: {amount}|Nội dung: {message}"
        
        try:
            encrypted_data = encrypt_aes(data, self.aes_key)
            self.display_encrypted.setText(encrypted_data[:50] + "...")
            
            # Tạo OTP
            self.otp_code = ''.join(random.choices(string.digits, k=6))
            
            self.sender_status.setText("✅ Đã mã hóa và gửi dữ liệu")
            self.receiver_status.setText(f"📨 Đã nhận dữ liệu. OTP: {self.otp_code}")
            
            self.show_notification("🔒 Dữ liệu đã được mã hóa và gửi!", True)
            
        except Exception as e:
            self.show_notification(f"❌ Lỗi mã hóa: {str(e)}", False)

    def decrypt_and_verify(self):
        """Giải mã và xác thực"""
        otp_input = self.entry_otp.text().strip()
        
        if not self.display_encrypted.text() or self.display_encrypted.text() == "🔐 Dữ liệu mã hóa sẽ hiển thị ở đây...":
            self.show_notification("⚠️ Chưa có dữ liệu để giải mã!", False)
            return
            
        if otp_input != self.otp_code:
            self.show_notification("❌ Mã OTP không chính xác!", False)
            return
        
        try:
            # Lấy dữ liệu mã hóa đầy đủ (không bị cắt)
            encrypted_full = encrypt_aes(
                f"Tài khoản: {self.entry_account.text()}|Số tiền: {self.entry_amount.text()}|Nội dung: {self.entry_message.text()}",
                self.aes_key
            )
            
            decrypted_data = decrypt_aes(encrypted_full, self.aes_key)
            self.display_decrypted.setText(decrypted_data)
            
            self.receiver_status.setText("✅ Đã giải mã và xác thực thành công")
            self.show_notification("🔓 Giải mã thành công! Dữ liệu hợp lệ.", True)
            
        except Exception as e:
            self.show_notification(f"❌ Lỗi giải mã: {str(e)}", False)

    def complete_transaction(self):
        """Hoàn thành giao dịch"""
        if not self.display_decrypted.text() or self.display_decrypted.text() == "📋 Dữ liệu giải mã sẽ hiển thị ở đây...":
            self.show_notification("⚠️ Chưa giải mã dữ liệu!", False)
            return
        
        # Thêm vào danh sách giao dịch hoàn thành
        transaction_info = f"✅ Giao dịch #{self.current_transaction_index + 1}: {self.entry_amount.text()} VND - {self.entry_message.text()[:30]}..."
        self.completed_transactions.append(transaction_info)
        self.completed_transactions_list.addItem(transaction_info)
        
        # Tăng điểm
        points = 10 + (self.level * 2)
        self.score += points
        self.success_streak += 1
        
        self.show_notification(f"🎉 Giao dịch hoàn thành! +{points} điểm", True)
        
        # Reset form
        self.reset_transaction_state()
        
        # Kiểm tra level up
        self.current_transaction_index += 1
        if self.current_transaction_index >= self.transactions_per_level.get(self.level, 3):
            self.level_up()
        else:
            self.update_ui_labels()

    def show_notification(self, message, success=True):
        """Hiển thị thông báo với animation"""
        notification = TransactionNotification(message, success, self)
        notification.show_notification(self.rect().center())

    def reset_transaction_state(self):
        """Reset trạng thái giao dịch"""
        self.entry_account.clear()
        self.entry_amount.clear()
        self.entry_message.clear()
        self.entry_otp.clear()
        self.display_encrypted.clear()
        self.display_decrypted.clear()
        
        self.sender_status.setText("⏳ Chờ nhập liệu...")
        self.receiver_status.setText("⏳ Chờ dữ liệu...")
        
        self.otp_code = ""

    def level_up(self):
        """Tăng level"""
        self.level += 1
        self.current_transaction_index = 0
        self.show_notification(f"🆙 Lên cấp {self.level}! Chúc mừng!", True)
        
        if self.level <= 10:
            self.show_upgrade_screen()
        else:
            self.show_victory()

    def show_upgrade_screen(self):
        """Hiển thị màn hình nâng cấp"""
        self.upgrade_screen.upgrade_score_label.setText(f"💰 Điểm của bạn: {self.score}")
        
        # Cập nhật trạng thái buttons
        for key, btn in self.upgrade_screen.upgrade_buttons.items():
            if key in self.purchased_upgrades:
                btn.setText(f"✅ {UPGRADES[key]['name']} - Đã mua")
                btn.setEnabled(False)
            else:
                cost = UPGRADES[key]['cost']
                btn.setEnabled(self.score >= cost)
                
        self.stack.setCurrentWidget(self.upgrade_screen)

    def purchase_upgrade(self, upgrade_key):
        """Mua nâng cấp"""
        if upgrade_key in self.purchased_upgrades:
            return
            
        upgrade = UPGRADES[upgrade_key]
        if self.score >= upgrade['cost']:
            self.score -= upgrade['cost']
            self.purchased_upgrades.append(upgrade_key)
            
            # Áp dụng hiệu ứng
            for effect_type, value in upgrade['effect'].items():
                self.upgrade_bonus[effect_type] += value
                
            self.show_notification(f"🛒 Đã mua: {upgrade['name']}", True)
            
            # Cập nhật UI
            self.upgrade_screen.upgrade_score_label.setText(f"💰 Điểm của bạn: {self.score}")
            btn = self.upgrade_screen.upgrade_buttons[upgrade_key]
            btn.setText(f"✅ {upgrade['name']} - Đã mua")
            btn.setEnabled(False)

    def proceed_to_next_level(self):
        """Tiến tới level tiếp theo"""
        self.setup_new_level(self.level)

    def setup_new_level(self, level):
        """Thiết lập level mới"""
        if level == 1:
            self.player_name = self.entry_player_name.text().strip() or "Chuyên viên Bảo mật"
            
        self.level = level
        self.current_transaction_index = 0
        self.update_ui_labels()
        self.reset_transaction_state()
        
        # Start timer
        time_limit = 60 + self.upgrade_bonus.get('speed', 0)
        self.timer_label.setMaximum(time_limit)
        self.timer_label.setValue(time_limit)
        self.timer_label.start_pulse()
        self.timer.start(1000)
        
        self.stack.setCurrentWidget(self.game_screen_widget)

    def update_ui_labels(self):
        """Cập nhật labels UI"""
        level_title = self.storyline_titles.get(self.level, f"Level {self.level}")
        self.label_level.setText(f"🎯 {level_title}")
        self.label_score.setText(f"💰 Điểm: {self.score}")
        
        # Cập nhật achievements
        if self.success_streak >= 5:
            self.achievement_label.setText("🏆 Streak Master")
        elif self.success_streak >= 3:
            self.achievement_label.setText("🥉 Consistent")
        else:
            self.achievement_label.setText("🏆 Huy hiệu: Chưa có")

    def update_timer(self):
        """Cập nhật timer"""
        current_value = self.timer_label.value()
        if current_value > 0:
            self.timer_label.setValue(current_value - 1)
        else:
            self.timer.stop()
            self.timer_label.stop_pulse()
            self.show_notification("⏰ Hết thời gian! Game Over!", False)
            self.game_over()

    def update_alert(self):
        """Cập nhật alert"""
        pass  # Placeholder for alert logic

    def show_help(self):
        """Hiển thị hướng dẫn"""
        help_text = """
        🎯 HƯỚNG DẪN CHƠI:
        
        1. 🔑 Tạo khóa RSA để bảo mật
        2. 💰 Nhập thông tin giao dịch
        3. 🔒 Mã hóa dữ liệu bằng AES
        4. 🔢 Nhập mã OTP để xác thực
        5. 🔓 Giải mã và kiểm tra
        6. ✅ Hoàn thành giao dịch
        
        💡 MẸO:
        • Mua nâng cấp để tăng hiệu suất
        • Hoàn thành streak để nhận huy hiệu
        • Chú ý thời gian còn lại
        """
        
        msg = QMessageBox(self)
        msg.setWindowTitle("📚 Hướng dẫn Game")
        msg.setText(help_text)
        msg.setStyleSheet("""
            QMessageBox {
                background-color: #1e3a5f;
                color: white;
            }
            QMessageBox QPushButton {
                background-color: #2d5aa0;
                color: white;
                border-radius: 5px;
                padding: 8px 16px;
                font-weight: bold;
            }
        """)
        msg.exec()

    def on_emergency(self):
        """Xử lý chế độ khẩn cấp"""
        self.show_notification("🚨 Chế độ khẩn cấp đã kích hoạt!", False)
        # Thêm 30 giây
        current_time = self.timer_label.value()
        self.timer_label.setValue(min(current_time + 30, self.timer_label.maximum()))

    def show_start_screen(self):
        """Hiển thị màn hình bắt đầu"""
        self.stack.setCurrentWidget(self.start_screen_widget)

    def game_over(self):
        """Xử lý game over"""
        msg = QMessageBox(self)
        msg.setWindowTitle("🎮 Game Over")
        msg.setText(f"""
        🏁 Game Over!
        
        📊 Thống kê:
        • Level đạt được: {self.level}
        • Tổng điểm: {self.score}
        • Giao dịch hoàn thành: {len(self.completed_transactions)}
        
        🔄 Bạn có muốn chơi lại không?
        """)
        msg.setStandardButtons(QMessageBox.Yes | QMessageBox.No)
        
        if msg.exec() == QMessageBox.Yes:
            self.restart_game()
        else:
            self.close()

    def show_victory(self):
        """Hiển thị màn hình chiến thắng"""
        msg = QMessageBox(self)
        msg.setWindowTitle("🏆 Chiến thắng!")
        msg.setText(f"""
        🎉 Chúc mừng {self.player_name}!
        
        Bạn đã hoàn thành tất cả 10 level!
        
        📊 Kết quả cuối:
        • Tổng điểm: {self.score}
        • Giao dịch hoàn thành: {len(self.completed_transactions)}
        • Nâng cấp đã mua: {len(self.purchased_upgrades)}
        
        🏅 Bạn là một Chuyên gia Bảo mật thực thụ!
        """)
        msg.exec()
        
        self.restart_game()

    def restart_game(self):
        """Khởi động lại game"""
        self.score = 0
        self.level = 1
        self.current_transaction_index = 0
        self.success_streak = 0
        self.purchased_upgrades = []
        self.upgrade_bonus = {"speed": 0, "detection": 0, "score": 0}
        self.completed_transactions = []
        self.completed_transactions_list.clear()
        
        self.timer.stop()
        self.timer_label.stop_pulse()
        
        self.show_start_screen()

def main():
    """Hàm chính"""
    app = QApplication(sys.argv)
    app.setApplicationName("SecureBank Pro")
    app.setApplicationVersion("2.0")
    
    # Set font
    font = QFont("Inter", 10)
    app.setFont(font)
    
    # Tạo và hiển thị game
    game = BankSecurityGame()
    game.showMaximized()
    
    sys.exit(app.exec())

if __name__ == "__main__":
    main()
