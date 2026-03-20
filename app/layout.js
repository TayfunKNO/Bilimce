import './globals.css'

export const metadata = {
  metadataBase: new URL('https://bilimce.vercel.app'),
  title: 'BİLİMCE - Bilimsel Araştırmalar Türkçe',
  description: 'Dünya genelindeki 35M+ bilimsel araştırmaya anında erişin. PubMed makalelerini 7 farklı dilde okuyun. Kanser, alzheimer, diyabet ve daha fazlası.',
  keywords: 'bilimsel araştırma, türkçe makale, pubmed türkçe, bilim, tıp, araştırma, kanser, alzheimer, diyabet, scientific research, pubmed turkish, science, medical research, wetenschappelijk onderzoek',
  authors: [{ name: 'BİLİMCE' }],
  creator: 'TayfunKNO',
  publisher: 'BİLİMCE',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'BİLİMCE',
  },
  verification: {
    google: 'tCo4eRUPVrp30f-Wh1mLR1JDq0kJApN4RGYoL08Vl6k',
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://bilimce.vercel.app',
    title: 'BİLİMCE - Bilimsel Araştırmalar Türkçe',
    description: 'Dünya genelindeki 35M+ bilimsel araştırmaya anında erişin. PubMed makalelerini 7 farklı dilde okuyun.',
    siteName: 'BİLİMCE',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'BİLİMCE' }],
  },
  twitter: {
  card: 'summary_large_image',
  title: 'BİLİMCE - Bilimsel Araştırmalar Türkçe',
  description: 'Dünya genelindeki 35M+ bilimsel araştırmaya anında erişin. PubMed makalelerini 7 farklı dilde okuyun.',
  images: ['https://bilimce.vercel.app/opengraph-image'],
},

  alternates: {
    canonical: 'https://bilimce.vercel.app',
  },
  icons: {
    icon: '/logo.svg',
    apple: [
      { url: '/icon-192.png', sizes: '192x192' },
      { url: '/icon-512.png', sizes: '512x512' },
    ],
  },
}

export const viewport = {
  themeColor: '#0a0a0f',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icon-512.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="BİLİMCE" />
        <meta name="application-name" content="BİLİMCE" />
        <meta name="mobile-web-app-capable" content="yes" />
        <style>{`
          #splash {
            position: fixed;
            inset: 0;
            background: #0a0a0f;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            transition: opacity 0.5s ease;
          }
          #splash.hidden {
            opacity: 0;
            pointer-events: none;
          }
          .splash-logo {
            width: 90px;
            height: 90px;
            margin-bottom: 20px;
            animation: pulse 1.5s ease-in-out infinite;
          }
          .splash-title {
            font-family: sans-serif;
            font-size: 28px;
            font-weight: 900;
            color: white;
            letter-spacing: -1px;
            margin-bottom: 8px;
          }
          .splash-sub {
            font-family: sans-serif;
            font-size: 14px;
            color: rgba(255,255,255,0.4);
            margin-bottom: 40px;
          }
          .splash-dots {
            display: flex;
            gap: 8px;
          }
          .splash-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #3b82f6;
            animation: bounce 1.2s ease-in-out infinite;
          }
          .splash-dot:nth-child(2) { animation-delay: 0.2s; background: #8b5cf6; }
          .splash-dot:nth-child(3) { animation-delay: 0.4s; background: #a78bfa; }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.08); }
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); opacity: 0.4; }
            50% { transform: translateY(-10px); opacity: 1; }
          }
        `}</style>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.addEventListener('load', function() {
              setTimeout(function() {
                var splash = document.getElementById('splash');
                if (splash) {
                  splash.classList.add('hidden');
                  setTimeout(function() { splash.remove(); }, 500);
                }
              }, 1200);
            });
          `
        }} />
      </head>
      <body>
        <div id="splash">
          <svg class="splash-logo" width="90" height="90" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="splashGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#3b82f6"/>
                <stop offset="100%" stop-color="#8b5cf6"/>
              </linearGradient>
            </defs>
            <polygon points="30,3 54,16 54,44 30,57 6,44 6,16" fill="url(#splashGrad)"/>
            <circle cx="44" cy="11" r="3" fill="#8b5cf6" opacity="0.6"/>
            <circle cx="16" cy="49" r="2" fill="#3b82f6" opacity="0.4"/>
            <text x="30" y="41" text-anchor="middle" fill="white" font-size="28" font-weight="900" font-family="Arial, sans-serif">B</text>
          </svg>
          <div class="splash-title">BİLİMCE</div>
          <div class="splash-sub">Bilimsel araştırmalar Türkçe</div>
          <div class="splash-dots">
            <div class="splash-dot"></div>
            <div class="splash-dot"></div>
            <div class="splash-dot"></div>
          </div>
        </div>
        {children}
      </body>
    </html>
  )
}
