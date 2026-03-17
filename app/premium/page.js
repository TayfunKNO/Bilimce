'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xlnnopufkjaqxjsmhtot.supabase.co',
  'sb_publishable_EbJEG5Y_81M3qM4isjXyaw_uUraIsAu'
)

const FREE_FEATURES = [
  { label: 'PubMed araması', included: true },
  { label: 'Türkçe çeviri', included: true },
  { label: 'Makale favorileme', included: true },
  { label: 'Okuma listesi', included: true },
  { label: 'Topluluk', included: true },
  { label: '3 koleksiyon', included: true },
  { label: 'Makale karşılaştırma', included: true },
  { label: 'Atıf sayısı', included: true },
  { label: 'Sınırsız koleksiyon', included: false },
  { label: 'Gelişmiş filtreler', included: false },
  { label: 'PDF dışa aktarma', included: false },
  { label: 'Öncelikli destek', included: false },
  { label: 'Premium rozet 🏆', included: false },
  { label: 'Reklamsız deneyim', included: false },
]

const PREMIUM_FEATURES = [
  { label: 'PubMed araması', included: true },
  { label: 'Türkçe çeviri', included: true },
  { label: 'Makale favorileme', included: true },
  { label: 'Okuma listesi', included: true },
  { label: 'Topluluk', included: true },
  { label: 'Sınırsız koleksiyon', included: true },
  { label: 'Makale karşılaştırma', included: true },
  { label: 'Atıf sayısı', included: true },
  { label: 'Sınırsız koleksiyon', included: true },
  { label: 'Gelişmiş filtreler', included: true },
  { label: 'PDF dışa aktarma', included: true },
  { label: 'Öncelikli destek', included: true },
  { label: 'Premium rozet 🏆', included: true },
  { label: 'Reklamsız deneyim', included: true },
]

export default function PremiumPage() {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [notified, setNotified] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user)
        setEmail(data.user.email || '')
      }
    })
  }, [])

  const handleNotify = async () => {
    if (!email.trim() || !email.includes('@')) return
    setLoading(true)
    await supabase.from('email_subscribers').upsert({ email: email.trim() })
    setNotified(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-white/5 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="/"><img src="/logo.svg" alt="B" className="w-7 h-7" /></a>
            <span className="font-bold text-base tracking-tight text-white">BİLİMCE</span>
          </div>
          <a href="/" className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white/60 hover:text-white transition">← Ana Sayfa</a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-400 text-xs font-semibold mb-6">
            <span>👑</span><span>BİLİMCE Premium</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            Bilimi daha derine <br />
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">keşfet</span>
          </h1>
          <p className="text-white/50 text-lg max-w-lg mx-auto">
            Sınırsız koleksiyon, gelişmiş filtreler ve çok daha fazlası ile araştırmalarınızı bir üst seviyeye taşıyın.
          </p>
        </div>

        {/* Fiyat kartları */}
        <div className="grid sm:grid-cols-2 gap-6 mb-16 max-w-2xl mx-auto">
          {/* Ücretsiz */}
          <div className="bg-white/3 border border-white/10 rounded-2xl p-6">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-white mb-1">Ücretsiz</h2>
              <p className="text-white/40 text-sm">Temel özelliklerle başlayın</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-black text-white">₺0</span>
              <span className="text-white/40 text-sm">/ay</span>
            </div>
            <div className="flex flex-col gap-2.5 mb-6">
              {FREE_FEATURES.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className={f.included ? 'text-green-400' : 'text-white/20'}>{f.included ? '✓' : '✕'}</span>
                  <span className={`text-sm ${f.included ? 'text-white/70' : 'text-white/25'}`}>{f.label}</span>
                </div>
              ))}
            </div>
            <a href={user ? '/' : '/auth'} className="block w-full px-6 py-3 bg-white/5 border border-white/10 text-white/60 rounded-xl text-sm font-semibold text-center hover:bg-white/10 transition">
              {user ? 'Mevcut Plan' : 'Ücretsiz Başla'}
            </a>
          </div>

          {/* Premium */}
          <div className="relative bg-gradient-to-b from-yellow-500/10 to-orange-500/5 border border-yellow-500/30 rounded-2xl p-6">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="px-4 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-xs font-bold text-black">EN POPÜLER</span>
            </div>
            <div className="mb-4">
              <h2 className="text-lg font-bold text-white mb-1">Premium 👑</h2>
              <p className="text-white/40 text-sm">Tam güç, sınırsız erişim</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-black text-yellow-400">₺49</span>
              <span className="text-white/40 text-sm">/ay</span>
            </div>
            <div className="flex flex-col gap-2.5 mb-6">
              {PREMIUM_FEATURES.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-green-400">✓</span>
                  <span className="text-sm text-white/70">{f.label}</span>
                </div>
              ))}
            </div>
            <button disabled className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl text-sm font-bold text-black opacity-60 cursor-not-allowed">
              🔜 Yakında
            </button>
          </div>
        </div>

        {/* Bildirim formu */}
        <div className="max-w-lg mx-auto text-center bg-white/3 border border-white/10 rounded-2xl p-8">
          <div className="text-3xl mb-3">🔔</div>
          <h2 className="text-xl font-bold text-white mb-2">Premium çıkınca haberdar ol</h2>
          <p className="text-white/40 text-sm mb-6">Premium üyelik yakında aktif olacak. Email bırak, ilk sen öğren!</p>
          {notified ? (
            <p className="text-green-400 font-semibold">✓ Harika! Premium çıkınca seni haberdar edeceğiz.</p>
          ) : (
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleNotify()}
                placeholder="email@adresin.com"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/25 outline-none text-sm"
              />
              <button
                onClick={handleNotify}
                disabled={loading || !email.trim()}
                className="px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl text-sm font-bold text-black hover:opacity-90 transition disabled:opacity-50 whitespace-nowrap"
              >
                {loading ? '...' : 'Bildir'}
              </button>
            </div>
          )}
        </div>

        {/* SSS */}
        <div className="max-w-2xl mx-auto mt-16">
          <h2 className="text-xl font-bold text-white text-center mb-8">Sık Sorulan Sorular</h2>
          <div className="flex flex-col gap-4">
            {[
              { q: 'Premium ne zaman çıkacak?', a: 'Çok yakında! Email bırakarak ilk öğrenenlerden biri olabilirsin.' },
              { q: 'Ücretsiz plan devam edecek mi?', a: 'Evet! Temel özellikler her zaman ücretsiz kalacak.' },
              { q: 'İptal edebilir miyim?', a: 'Evet, istediğin zaman iptal edebilirsin. Taahhüt yok.' },
              { q: 'Hangi ödeme yöntemleri kabul edilecek?', a: 'Kredi kartı ve banka havalesi ile ödeme yapabileceksin.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/3 border border-white/5 rounded-xl p-5">
                <p className="font-semibold text-white mb-2 text-sm">❓ {item.q}</p>
                <p className="text-white/50 text-sm">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
