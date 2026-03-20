export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-white/5 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="/"><img src="/logo.svg" alt="B" className="w-7 h-7" /></a>
            <span className="font-bold text-base tracking-tight text-white">BİLİMCE</span>
          </div>
          <a href="/" className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white/60 hover:text-white transition">← Ana Sayfa</a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <img src="/logo.svg" alt="BİLİMCE" className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">BİLİMCE Hakkında</h1>
          <p className="text-white/40 text-sm">Bilimi herkes için erişilebilir kılıyoruz</p>
        </div>

        <div className="flex flex-col gap-8 text-white/70 text-sm leading-relaxed">
          <section className="bg-white/3 border border-white/5 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-3">🔬 Ne Yapıyoruz?</h2>
            <p>BİLİMCE, dünyanın en büyük biyomedikal literatür veritabanı olan PubMed'deki 35 milyondan fazla bilimsel makaleye Türkçe ve 5 farklı dilde erişim sağlayan ücretsiz bir platformdur.</p>
          </section>

          <section className="bg-white/3 border border-white/5 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-3">🌍 Neden BİLİMCE?</h2>
            <p className="mb-3">Bilimsel araştırmaların büyük çoğunluğu İngilizce yayınlanmaktadır. Bu durum, İngilizce bilmeyen milyonlarca insanın bilimsel gelişmelerden haberdar olamamasına neden olmaktadır.</p>
            <p>BİLİMCE, bu engeli ortadan kaldırmak için yapay zeka destekli çeviri teknolojisiyle bilimsel makaleleri anında Türkçe'ye çeviriyor.</p>
          </section>

          <section className="bg-white/3 border border-white/5 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-3">✨ Özellikler</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '🌐', label: 'Türkçe Çeviri' },
                { icon: '🔍', label: 'Akıllı Arama' },
                { icon: '⚖️', label: 'Makale Karşılaştırma' },
                { icon: '📊', label: 'Atıf Sayısı' },
                { icon: '💬', label: 'Topluluk' },
                { icon: '📚', label: 'Koleksiyonlar' },
                { icon: '🔔', label: 'Konu Takibi' },
                { icon: '👑', label: 'Premium Plan' },
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 bg-white/3 rounded-xl">
                  <span>{f.icon}</span>
                  <span className="text-white/60 text-xs">{f.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white/3 border border-white/5 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-3">📡 Veri Kaynağı</h2>
            <p>Tüm bilimsel makale verileri, ABD Ulusal Tıp Kütüphanesi'nin (NIH/NLM) açık erişimli PubMed API'sinden alınmaktadır. BİLİMCE, orijinal araştırmaları değiştirmez; yalnızca erişimi kolaylaştırır.</p>
          </section>

          <section className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-3">👨‍💻 Geliştirici</h2>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white shrink-0">T</div>
              <div>
                <p className="font-semibold text-white">TayfunKNO</p>
                <p className="text-white/40 text-xs mt-0.5">Bağımsız Yazılım Geliştirici</p>
                <a href="https://github.com/TayfunKNO" target="_blank" rel="noopener noreferrer" className="text-blue-400 text-xs hover:text-blue-300 transition mt-1 block">github.com/TayfunKNO →</a>
              </div>
            </div>
          </section>

          <section className="bg-white/3 border border-white/5 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-3">📬 İletişim</h2>
            <p className="mb-2">Öneri, şikayet veya iş birliği için:</p>
            <p><span className="text-blue-400">bilimce@proton.me</span></p>
          </section>
        </div>
      </main>

      <footer className="border-t border-white/5 py-8 mt-12">
        <div className="max-w-3xl mx-auto px-4 flex gap-6 justify-center text-xs text-white/30 flex-wrap">
          <a href="/about" className="hover:text-white transition">Hakkında</a>
          <a href="/privacy" className="hover:text-white transition">Gizlilik Politikası</a>
          <a href="/terms" className="hover:text-white transition">Kullanım Şartları</a>
          <a href="/" className="hover:text-white transition">Ana Sayfa</a>
        </div>
      </footer>
    </div>
  )
}
