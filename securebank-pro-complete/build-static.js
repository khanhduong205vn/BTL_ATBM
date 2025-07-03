#!/usr/bin/env node

// Script để build static version cho GitHub Pages
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Building SecureBank Pro for GitHub Pages...');

// Tạo thư mục dist nếu chưa có
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Copy static files
console.log('📁 Copying static files...');

// Copy client files
execSync('cp -r client/* dist/', { stdio: 'inherit' });

// Copy attached assets 
if (fs.existsSync('attached_assets')) {
  execSync('cp -r attached_assets dist/assets/', { stdio: 'inherit' });
}

// Tạo index.html cho GitHub Pages
const indexHtml = `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SecureBank Pro - Game Bảo Mật Ngân Hàng</title>
    <meta name="description" content="Game giáo dục về bảo mật ngân hàng và mã hóa. Học cách bảo vệ tài khoản ngân hàng khỏi các cuộc tấn công mạng.">
    
    <!-- Open Graph -->
    <meta property="og:title" content="SecureBank Pro - Game Bảo Mật Ngân Hàng">
    <meta property="og:description" content="Game giáo dục về bảo mật ngân hàng và mã hóa">
    <meta property="og:type" content="website">
    
    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏦</text></svg>">
    
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
        .container {
            text-align: center;
            padding: 2rem;
            background: rgba(255,255,255,0.1);
            border-radius: 20px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
            max-width: 600px;
        }
        h1 { font-size: 2.5rem; margin-bottom: 1rem; color: #ffd700; }
        .subtitle { font-size: 1.2rem; margin-bottom: 2rem; opacity: 0.9; }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin: 2rem 0;
        }
        .feature {
            background: rgba(255,255,255,0.1);
            padding: 1rem;
            border-radius: 10px;
            border: 1px solid rgba(255,255,255,0.1);
        }
        .start-btn {
            background: linear-gradient(45deg, #ffd700, #ffed4e);
            color: #1e3c72;
            padding: 1rem 2rem;
            border: none;
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.3s ease;
            text-decoration: none;
            display: inline-block;
            margin-top: 1rem;
        }
        .start-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255,215,0,0.4);
        }
        .loading {
            display: none;
            margin-top: 1rem;
        }
        .spinner {
            border: 3px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top: 3px solid #ffd700;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
            margin: 0 auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🏦 SecureBank Pro</h1>
        <p class="subtitle">Game Giáo Dục Bảo Mật Ngân Hàng & Mã Hóa</p>
        
        <div class="features">
            <div class="feature">
                <h3>🔐 Mã Hóa AES-256</h3>
                <p>Học cách mã hóa dữ liệu an toàn</p>
            </div>
            <div class="feature">
                <h3>🎯 Quiz Bảo Mật</h3>
                <p>15+ câu hỏi chuyên sâu</p>
            </div>
            <div class="feature">
                <h3>⏱️ Thời Gian Mở Rộng</h3>
                <p>5-10 phút mỗi level</p>
            </div>
            <div class="feature">
                <h3>🛡️ Phát Hiện Phishing</h3>
                <p>Công cụ bảo mật thông minh</p>
            </div>
        </div>
        
        <button class="start-btn" onclick="startGame()">
            Bắt Đầu Chơi Game
        </button>
        
        <div class="loading" id="loading">
            <div class="spinner"></div>
            <p>Đang tải game...</p>
        </div>
    </div>

    <script type="module">
        window.startGame = function() {
            document.querySelector('.start-btn').style.display = 'none';
            document.getElementById('loading').style.display = 'block';
            
            // Load game components
            setTimeout(() => {
                loadGameApp();
            }, 1000);
        }
        
        async function loadGameApp() {
            try {
                // Import main game component
                const { default: SecureBankGame } = await import('./src/pages/SecureBankGame.js');
                
                // Clear landing page
                document.body.innerHTML = '<div id="root"></div>';
                
                // Load React and render game
                const React = await import('https://esm.sh/react@18');
                const ReactDOM = await import('https://esm.sh/react-dom@18/client');
                
                const root = ReactDOM.createRoot(document.getElementById('root'));
                root.render(React.createElement(SecureBankGame));
                
            } catch (error) {
                console.error('Error loading game:', error);
                document.body.innerHTML = \`
                    <div style="text-align: center; padding: 2rem; color: white;">
                        <h2>⚠️ Lỗi tải game</h2>
                        <p>Vui lòng tải xuống và chạy local hoặc liên hệ admin.</p>
                        <button onclick="location.reload()" style="padding: 0.5rem 1rem; margin-top: 1rem; border: none; border-radius: 5px; background: #ffd700; color: #1e3c72; cursor: pointer;">
                            Thử Lại
                        </button>
                    </div>
                \`;
            }
        }
    </script>
</body>
</html>`;

fs.writeFileSync('dist/index.html', indexHtml);

console.log('✅ Build completed successfully!');
console.log('📦 Files ready in dist/ folder');
console.log('🌐 Ready for GitHub Pages deployment');