import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata = {
  title: 'BİLİMCE — Bilimsel Araştırmalar Türkçe',
  description: 'Dünya genelindeki bilimsel araştırmaları Türkçe olarak keşfedin.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className={`${inter.variable} font-sans bg-[#0a0a0f] text-white min-h-screen`}>
        {children}
      </body>
    </html>
  )
}
