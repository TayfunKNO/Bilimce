export default function PrivacyPage() {
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
        <h1 className="text-3xl font-bold text-white mb-2">Gizlilik Politikası</h1>
        <p className="text-white/40 text-sm mb-10">Son güncelleme: Mart 2026</p>

        <div className="flex flex-col gap-8 text-white/70 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white mb-3">1. Giriş</h2>
            <p>BİLİMCE ("biz", "uygulama") olarak gizliliğinize saygı duyuyoruz. Bu politika, bilimce.vercel.app adresindeki platformumuzu kullandığınızda hangi verileri topladığımızı ve nasıl kullandığımızı açıklar.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">2. Topladığımız Veriler</h2>
            <p className="mb-2"><strong className="text-white">Hesap bilgileri:</strong> Kayıt olurken e-posta adresinizi ve kullanıcı adınızı topluyoruz.</p>
            <p className="mb-2"><strong className="text-white">Kullanım verileri:</strong> Arama geçmişiniz, favorilediğiniz makaleler, okuma listeniz ve oluşturduğunuz koleksiyonlar.</p>
            <p className="mb-2"><strong className="text-white">Teknik veriler:</strong> Tarayıcı türü, cihaz bilgisi ve IP adresi gibi standart log verileri.</p>
            <p><strong className="text-white">Geri bildirimler:</strong> Uygulama içinden gönderdiğiniz geri bildirim metinleri.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">3. Verileri Nasıl Kullanıyoruz</h2>
            <p className="mb-2">• Hizmetlerimizi sunmak ve geliştirmek için</p>
            <p className="mb-2">• Kişiselleştirilmiş deneyim sağlamak için</p>
            <p className="mb-2">• Bildirim ve e-posta göndermek için (izin vermeniz halinde)</p>
            <p>• Güvenlik ve dolandırıcılık önleme için</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">4. Üçüncü Taraf Hizmetler</h2>
            <p className="mb-2"><strong className="text-white">PubMed / NIH:</strong> Bilimsel makale verileri ABD Ulusal Tıp Kütüphanesi'nin açık API'sinden alınmaktadır.</p>
            <p className="mb-2"><strong className="text-white">Supabase:</strong> Veritabanı ve kimlik doğrulama hizmeti. GDPR uyumludur.</p>
            <p><strong className="text-white">Google Translate:</strong> Makale başlık ve özetlerinin çevirisi için kullanılmaktadır.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">5. Veri Güvenliği</h2>
            <p>Verileriniz Supabase altyapısında şifrelenmiş olarak saklanmaktadır. Row Level Security (RLS) politikaları ile yalnızca siz kendi verilerinize erişebilirsiniz.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">6. Haklarınız</h2>
            <p className="mb-2">• Verilerinize erişim talep edebilirsiniz</p>
            <p className="mb-2">• Hesabınızı ve tüm verilerinizi silebilirsiniz</p>
            <p className="mb-2">• E-posta bildirimlerinden istediğiniz zaman çıkabilirsiniz</p>
            <p>• KVKK kapsamındaki haklarınızı kullanabilirsiniz</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">7. Çerezler</h2>
            <p>Oturum yönetimi için zorunlu çerezler kullanılmaktadır. Dil ve tema tercihleriniz tarayıcınızın yerel depolama alanında saklanır.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">8. İletişim</h2>
            <p>Gizlilik ile ilgili sorularınız için: <span className="text-blue-400">bilimce@proton.me</span></p>
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
