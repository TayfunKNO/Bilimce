export default function TermsPage() {
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
        <h1 className="text-3xl font-bold text-white mb-2">Kullanım Şartları</h1>
        <p className="text-white/40 text-sm mb-10">Son güncelleme: Mart 2026</p>

        <div className="flex flex-col gap-8 text-white/70 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white mb-3">1. Kabul</h2>
            <p>BİLİMCE'yi kullanarak bu kullanım şartlarını kabul etmiş olursunuz. Şartları kabul etmiyorsanız platformu kullanmayınız.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">2. Hizmet Tanımı</h2>
            <p>BİLİMCE, PubMed veritabanındaki bilimsel makaleleri Türkçe ve diğer dillerde erişilebilir kılan ücretsiz/freemium bir platformdur. Makale içerikleri NIH Ulusal Tıp Kütüphanesi'ne aittir.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">3. Hesap Sorumlulukları</h2>
            <p className="mb-2">• Hesap bilgilerinizin güvenliğinden siz sorumlusunuz</p>
            <p className="mb-2">• Gerçek ve doğru bilgiler sağlamakla yükümlüsünüz</p>
            <p>• Hesabınızın yetkisiz kullanımını derhal bildirmeniz gerekmektedir</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">4. Kabul Edilemez Kullanım</h2>
            <p className="mb-2">Aşağıdaki kullanımlar yasaktır:</p>
            <p className="mb-2">• Platformu otomatik araçlarla aşırı yüklemek</p>
            <p className="mb-2">• Diğer kullanıcıların verilerine yetkisiz erişim sağlamak</p>
            <p className="mb-2">• Yanıltıcı veya zararlı içerik paylaşmak</p>
            <p>• Telif hakkı ihlali oluşturacak şekilde içerik kopyalamak</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">5. Tıbbi Sorumluluk Reddi</h2>
            <p className="text-yellow-400/80">BİLİMCE tıbbi tavsiye vermez. Platform üzerindeki bilimsel makaleler yalnızca bilgi amaçlıdır. Sağlık kararlarınız için mutlaka bir doktora danışınız.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">6. Freemium Model</h2>
            <p className="mb-2">Ücretsiz plan günlük 10 arama ve 5 çeviri hakkı içerir. Premium üyelik ek özellikler ve sınırsız kullanım sağlar. Fiyatlandırma değişiklik hakkı saklıdır.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">7. Fikri Mülkiyet</h2>
            <p>BİLİMCE'nin tasarımı, kodu ve özgün içeriği telif hakkı ile korunmaktadır. Makale içerikleri NIH/PubMed'e aittir ve açık erişim politikaları kapsamında sunulmaktadır.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">8. Hizmet Değişiklikleri</h2>
            <p>BİLİMCE, hizmetleri önceden bildirimde bulunmaksızın değiştirme, askıya alma veya sonlandırma hakkını saklı tutar.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">9. Uygulanacak Hukuk</h2>
            <p>Bu şartlar Türkiye Cumhuriyeti yasalarına tabidir.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">10. İletişim</h2>
            <p>Sorularınız için: <span className="text-blue-400">bilimce@proton.me</span></p>
          </section>
        </div>
      </main>

      <footer className="border-t border-white/5 py-8 mt-12">
        <div className="max-w-3xl mx-auto px-4 flex gap-6 justify-center text-xs text-white/30">
          <a href="/privacy" className="hover:text-white transition">Gizlilik Politikası</a>
          <a href="/terms" className="hover:text-white transition">Kullanım Şartları</a>
          <a href="/" className="hover:text-white transition">Ana Sayfa</a>
        </div>
      </footer>
    </div>
  )
}
