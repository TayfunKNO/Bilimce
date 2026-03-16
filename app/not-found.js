'use client'
import { useEffect, useState } from 'react'

export default function NotFound() {
  const [count, setCount] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => {
        if (prev <= 1) { clearInterval(timer); window.location.href = '/'; return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white mx-auto mb-6">
          B
        </div>
        <div className="text-6xl mb-4">🔭</div>
        <h1 className="text-3xl font-bold text-white mb-3">Sayfa Bulunamadı</h1>
        <p className="text-white/40 text-sm mb-8 leading-relaxed">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>
        <div className="flex flex-col gap-3">
          <a href="/" className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition">
            Ana Sayfaya Dön
          </a>
          <a href="/community" className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white/60 hover:text-white transition">
            Topluluğa Git
          </a>
        </div>
        <p className="text-white/20 text-xs mt-8">
          {count > 0 ? `${count} saniye sonra ana sayfaya yönlendiriliyorsunuz...` : 'Yönlendiriliyor...'}
        </p>
      </div>
    </div>
  )
}
