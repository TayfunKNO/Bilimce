import './globals.css'

export const metadata = {
  title: 'BİLİMCE - Bilimsel Araştırmalar Türkçe',
  description: 'Dünya genelindeki bilimsel araştırmaları Türkçe okuyun. PubMed makalelerini yapay zeka ile çevirin.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'BİLİMCE',
  },
  verification: {
    google: 'tCo4eRUPVrp30f-Wh1mLR1JDq0kJApN4RGYoL08Vl6k',
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
