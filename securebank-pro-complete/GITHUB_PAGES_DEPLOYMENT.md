# Hướng dẫn Deploy SecureBank Pro lên GitHub Pages

## Bước 1: Chuẩn bị project

1. **Tạo repository mới trên GitHub:**
   - Truy cập https://github.com
   - Tạo repository mới với tên `securebank-pro-game`
   - Chọn `Public` để có thể dùng GitHub Pages miễn phí

## Bước 2: Cấu hình project cho Static Deploy

Thêm script build vào `package.json`:

```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

## Bước 3: Tạo file GitHub Actions

Tạo file `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Setup Pages
      uses: actions/configure-pages@v4
      
    - name: Upload artifact
      uses: actions/upload-pages-artifact@v3
      with:
        path: './dist'
        
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v4
```

## Bước 4: Cấu hình Vite cho GitHub Pages

Cập nhật `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/securebank-pro-game/', // Thay thế bằng tên repository của bạn
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@assets': path.resolve(__dirname, './attached_assets'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-tabs'],
        },
      },
    },
  },
})
```

## Bước 5: Cập nhật Routing

Cập nhật `client/src/App.tsx` để hỗ trợ GitHub Pages:

```typescript
import { Router, Route } from 'wouter'
import { useHashLocation } from 'wouter/use-hash-location'

function App() {
  return (
    <Router hook={useHashLocation}>
      <Route path="/" component={SecureBankGame} />
      <Route path="/game" component={SecureBankGame} />
      <Route>
        <NotFound />
      </Route>
    </Router>
  )
}
```

## Bước 6: Upload và Deploy

1. **Upload code lên GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: SecureBank Pro Game"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/securebank-pro-game.git
   git push -u origin main
   ```

2. **Kích hoạt GitHub Pages:**
   - Vào `Settings` > `Pages`
   - Chọn `GitHub Actions` làm source
   - Lưu cấu hình

3. **Kiểm tra deployment:**
   - Vào tab `Actions` để xem quá trình build
   - Sau khi hoàn thành, game sẽ có sẵn tại: `https://YOUR_USERNAME.github.io/securebank-pro-game/`

## Bước 7: Cấu hình Domain (Tùy chọn)

Nếu có domain riêng:
1. Tạo file `CNAME` trong thư mục `public/` với nội dung domain của bạn
2. Cập nhật DNS records để trỏ về GitHub Pages

## Troubleshooting

**Lỗi thường gặp:**

1. **404 khi refresh page:** 
   - Sử dụng hash routing thay vì browser routing
   - Thêm 404.html redirect về index.html

2. **Assets không load:**
   - Kiểm tra đường dẫn `base` trong vite.config.ts
   - Đảm bảo tên repository chính xác

3. **Build fails:**
   - Kiểm tra tất cả dependencies trong package.json
   - Xóa node_modules và chạy `npm install` lại

## Game Features

Game bao gồm:
- 🔐 Mã hóa AES-256 và SHA-256
- 🎯 Hệ thống Quiz bảo mật với 15+ câu hỏi
- ⏱️ Thời gian chơi mở rộng theo level
- 🛡️ Công cụ phát hiện phishing
- 📱 Giao diện responsive cho mobile
- 🇻🇳 Hoàn toàn bằng tiếng Việt

**URL Demo:** https://YOUR_USERNAME.github.io/securebank-pro-game/

Sau khi deploy thành công, bạn có thể chia sẻ link này cho bạn bè để cùng chơi game bảo mật!