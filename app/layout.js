import './globals.css'

export const metadata = {
  metadataBase: new URL('https://bilimce.vercel.app'),
  title: 'BİLİMCE - Bilimsel Araştırmalar Türkçe',
  description: 'Dünya genelindeki bilimsel araştırmaları Türkçe okuyun. PubMed makalelerini yapay zeka ile çevirin. Kanser, alzheimer, diyabet ve daha fazlası.',
  keywords: 'bilimsel araştırma, türkçe makale, pubmed türkçe, bilim, tıp, araştırma, kanser, alzheimer, diyabet',
  authors: [{ name: 'BİLİMCE' }],
  creator: 'BİLİMCE',
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
    description: 'Dünya genelindeki bilimsel araştırmaları Türkçe okuyun. PubMed makalelerini yapay zeka ile çevirin.',
    siteName: 'BİLİMCE',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'BİLİMCE' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BİLİMCE - Bilimsel Araştırmalar Türkçe',
    description: 'Dünya genelindeki bilimsel araştırmaları Türkçe okuyun.',
    images: ['/opengraph-image'],
  },
  alternates: {
    canonical: 'https://bilimce.vercel.app',
  },
}

export const viewport = {
  themeColor: '#0a0a0f',
}

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="BİLİMCE" />
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
            width: 80px;
            height: 80px;
            border-radius: 20px;
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            font-weight: 900;
            color: white;
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
          .splash-dot:nth-child(3) { animation-delay: 0.4s; background: #ec4899; }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
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
          <div class="splash-logo">B</div>
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
