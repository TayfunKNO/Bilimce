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
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'BİLİMCE - Bilimsel Araştırmalar Türkçe',
      }
    ],
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
      </head>
      <body>{children}</body>
    </html>
  )
}
