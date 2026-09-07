# Hoàng Long — Profile

Profile cá nhân của **Nguyễn Hoàng Long** — sinh viên VKU, ngành Khoa học Máy tính.
Web tĩnh (HTML/CSS/JS thuần) + PWA, deploy miễn phí trên **Cloudflare Pages**.

## ✨ Tính năng

- 🎨 **Single-page portfolio**: Hero, About, Skills, Projects, Contact
- 📱 **Responsive**: mobile-first, breakpoints 760px
- 🌗 **Theme toggle**: dark/light, lưu vào `localStorage`, tôn trọng `prefers-color-scheme`
- ⌨️ **Typed animation** cho role headline
- 🚀 **PWA đầy đủ**:
  - `manifest.json` (standalone, theme color, shortcuts)
  - Service worker (cache-first cho assets, network-first cho HTML)
  - Install prompt trên Chrome/Edge/Android
- 🔒 **Security headers** qua Cloudflare `_headers`
- ⚡ **Zero build step** — chỉ cần static hosting

## 🗂️ Cấu trúc

```
hoang-long-profile/
├── index.html         # Trang chính
├── style.css          # Design system + layout
├── script.js          # Theme, typed, reveal-on-scroll, SW register
├── sw.js              # Service worker (cache strategy)
├── manifest.json      # PWA manifest
├── robots.txt
├── _headers           # Cloudflare Pages security headers
├── icons/
│   ├── icon.svg
│   ├── icon-192.png
│   ├── icon-512.png
│   └── favicon-32.png
└── README.md
```

## 🛠️ Chạy local

```bash
# Cách 1: Python
python -m http.server 8000

# Cách 2: Node
npx serve .
```

Mở <http://localhost:8000>

## ☁️ Deploy lên Cloudflare Pages

### Cách A: Qua Dashboard (khuyến nghị cho người mới)
1. Push repo này lên GitHub
2. Vào <https://dash.cloudflare.com/> → **Pages** → **Create application** → **Connect to Git**
3. Chọn repo `hoang-long-profile`
4. Build settings:
   - **Build command**: (để trống)
   - **Build output directory**: `/`
5. Bấm **Save and Deploy** → sau 1-2 phút có URL `https://<project>.pages.dev`

### Cách B: Qua Wrangler CLI
```bash
npm i -g wrangler
wrangler login
wrangler pages deploy . --project-name=hoang-long-profile
```

## 🧪 Test PWA

Sau khi deploy (HTTPS bắt buộc):
1. Mở URL trên Chrome/Edge
2. DevTools → **Application** tab:
   - **Manifest** hiển thị name + icons
   - **Service Workers** hiển thị `sw.js` activated
3. Address bar có nút **Install** → cài như app native
4. Lighthouse → **PWA category** đạt ✅

## 📜 License

MIT © 2026 Nguyễn Hoàng Long
