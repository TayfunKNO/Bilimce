'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://lypjtxqvusqndqawugxu.supabase.co',
  'sb_publishable_rqtzTjZBNww4u56gNNCI4A_OS_ID1Bo'
)

const UI = {
  tr: {
    home: '← Ana Sayfa', badge: 'BİLİMCE Premium',
    hero: 'Bilimi daha derine', heroSpan: 'keşfet',
    heroSub: 'Sınırsız koleksiyon, gelişmiş filtreler ve çok daha fazlası ile araştırmalarınızı bir üst seviyeye taşıyın.',
    freeTitle: 'Ücretsiz', freeSub: 'Temel özelliklerle başlayın', freePrice: '₺0',
    premiumTitle: 'Premium 👑', premiumSub: 'Tam güç, sınırsız erişim', premiumPrice: '₺49',
    perMonth: '/ay', popular: 'EN POPÜLER', soon: '🔜 Yakında',
    currentPlan: 'Mevcut Plan', startFree: 'Ücretsiz Başla',
    notifyTitle: 'Premium çıkınca haberdar ol',
    notifySub: 'Premium üyelik yakında aktif olacak. Email bırak, ilk sen öğren!',
    notifySuccess: '✓ Harika! Premium çıkınca seni haberdar edeceğiz.',
    notifyBtn: 'Bildir', emailPlaceholder: 'email@adresin.com',
    faqTitle: 'Sık Sorulan Sorular',
    freeFeatures: [
      { label: 'Günlük 10 arama hakkı', included: true },
      { label: 'Max 20 sonuç / arama', included: true },
      { label: 'Günde 5 özet çevirisi', included: true },
      { label: 'Makale favorileme', included: true },
      { label: 'Okuma listesi', included: true },
      { label: 'Topluluk', included: true },
      { label: '3 koleksiyon', included: true },
      { label: 'Atıf sayısı', included: true },
      { label: 'Sınırsız arama', included: false },
      { label: '100 sonuç / arama', included: false },
      { label: 'Sınırsız çeviri', included: false },
      { label: 'Sınırsız koleksiyon', included: false },
      { label: 'Gelişmiş filtreler', included: false },
      { label: 'PDF dışa aktarma', included: false },
      { label: 'Öncelikli destek', included: false },
      { label: 'Premium rozet 🏆', included: false },
    ],
    premiumFeatures: [
      'PubMed araması', 'Türkçe çeviri', 'Makale favorileme', 'Okuma listesi',
      'Topluluk', 'Sınırsız koleksiyon', 'Makale karşılaştırma', 'Atıf sayısı',
      'Gelişmiş filtreler', 'PDF dışa aktarma', 'Öncelikli destek', 'Premium rozet 🏆', 'Reklamsız deneyim',
    ],
    faq: [
      { q: 'Premium ne zaman çıkacak?', a: 'Çok yakında! Email bırakarak ilk öğrenenlerden biri olabilirsin.' },
      { q: 'Ücretsiz plan devam edecek mi?', a: 'Evet! Temel özellikler her zaman ücretsiz kalacak.' },
      { q: 'İptal edebilir miyim?', a: 'Evet, istediğin zaman iptal edebilirsin. Taahhüt yok.' },
      { q: 'Hangi ödeme yöntemleri kabul edilecek?', a: 'Kredi kartı ve banka havalesi ile ödeme yapabileceksin.' },
    ],
  },
  en: {
    home: '← Home', badge: 'BİLİMCE Premium',
    hero: 'Explore science', heroSpan: 'deeper',
    heroSub: 'Take your research to the next level with unlimited collections, advanced filters and much more.',
    freeTitle: 'Free', freeSub: 'Start with basic features', freePrice: '$0',
    premiumTitle: 'Premium 👑', premiumSub: 'Full power, unlimited access', premiumPrice: '$5',
    perMonth: '/mo', popular: 'MOST POPULAR', soon: '🔜 Coming Soon',
    currentPlan: 'Current Plan', startFree: 'Start Free',
    notifyTitle: 'Get notified when Premium launches',
    notifySub: 'Premium membership coming soon. Leave your email to be the first to know!',
    notifySuccess: '✓ Great! We\'ll notify you when Premium launches.',
    notifyBtn: 'Notify me', emailPlaceholder: 'your@email.com',
    faqTitle: 'Frequently Asked Questions',
    freeFeatures: [
      { label: '10 searches per day', included: true },
      { label: 'Max 20 results / search', included: true },
      { label: '5 abstract translations/day', included: true },
      { label: 'Article favorites', included: true },
      { label: 'Reading list', included: true },
      { label: 'Community', included: true },
      { label: '3 collections', included: true },
      { label: 'Citation count', included: true },
      { label: 'Unlimited searches', included: false },
      { label: '100 results / search', included: false },
      { label: 'Unlimited translations', included: false },
      { label: 'Unlimited collections', included: false },
      { label: 'Advanced filters', included: false },
      { label: 'PDF export', included: false },
      { label: 'Priority support', included: false },
      { label: 'Premium badge 🏆', included: false },
    ],
    premiumFeatures: [
      'PubMed search', 'Translation', 'Article favorites', 'Reading list',
      'Community', 'Unlimited collections', 'Article comparison', 'Citation count',
      'Advanced filters', 'PDF export', 'Priority support', 'Premium badge 🏆', 'Ad-free experience',
    ],
    faq: [
      { q: 'When will Premium launch?', a: 'Very soon! Leave your email to be among the first to know.' },
      { q: 'Will the free plan continue?', a: 'Yes! Basic features will always remain free.' },
      { q: 'Can I cancel?', a: 'Yes, cancel anytime. No commitment.' },
      { q: 'What payment methods will be accepted?', a: 'Credit card and bank transfer will be available.' },
    ],
  },
  nl: {
    home: '← Startpagina', badge: 'BİLİMCE Premium',
    hero: 'Verken wetenschap', heroSpan: 'dieper',
    heroSub: 'Breng uw onderzoek naar een hoger niveau met onbeperkte collecties, geavanceerde filters en veel meer.',
    freeTitle: 'Gratis', freeSub: 'Begin met basisfuncties', freePrice: '€0',
    premiumTitle: 'Premium 👑', premiumSub: 'Volledige kracht, onbeperkte toegang', premiumPrice: '€5',
    perMonth: '/mnd', popular: 'MEEST POPULAIR', soon: '🔜 Binnenkort',
    currentPlan: 'Huidig plan', startFree: 'Gratis beginnen',
    notifyTitle: 'Ontvang een melding wanneer Premium beschikbaar is',
    notifySub: 'Premium lidmaatschap komt binnenkort. Laat uw e-mail achter!',
    notifySuccess: '✓ Geweldig! We sturen u een melding wanneer Premium beschikbaar is.',
    notifyBtn: 'Meld mij', emailPlaceholder: 'uw@email.nl',
    faqTitle: 'Veelgestelde vragen',
    freeFeatures: [
      { label: '10 zoekopdrachten per dag', included: true },
      { label: 'Max 20 resultaten / zoekopdracht', included: true },
      { label: '5 samenvattingsvertalingen/dag', included: true },
      { label: 'Artikel favorieten', included: true },
      { label: 'Leeslijst', included: true },
      { label: 'Gemeenschap', included: true },
      { label: '3 collecties', included: true },
      { label: 'Citaatcount', included: true },
      { label: 'Onbeperkt zoeken', included: false },
      { label: '100 resultaten / zoekopdracht', included: false },
      { label: 'Onbeperkte vertalingen', included: false },
      { label: 'Onbeperkte collecties', included: false },
      { label: 'Geavanceerde filters', included: false },
      { label: 'PDF exporteren', included: false },
      { label: 'Prioriteitsondersteuning', included: false },
      { label: 'Premium badge 🏆', included: false },
    ],
    premiumFeatures: [
      'PubMed zoeken', 'Vertaling', 'Artikel favorieten', 'Leeslijst',
      'Gemeenschap', 'Onbeperkte collecties', 'Artikelvergelijking', 'Citaatcount',
      'Geavanceerde filters', 'PDF exporteren', 'Prioriteitsondersteuning', 'Premium badge 🏆', 'Advertentievrij',
    ],
    faq: [
      { q: 'Wanneer wordt Premium gelanceerd?', a: 'Heel binnenkort! Laat uw e-mail achter om als eerste te weten.' },
      { q: 'Blijft het gratis plan bestaan?', a: 'Ja! Basisfuncties blijven altijd gratis.' },
      { q: 'Kan ik annuleren?', a: 'Ja, annuleer wanneer u wilt. Geen verplichtingen.' },
      { q: 'Welke betaalmethoden worden geaccepteerd?', a: 'Creditcard en bankoverschrijving.' },
    ],
  },
  de: {
    home: '← Startseite', badge: 'BİLİMCE Premium',
    hero: 'Erkunde Wissenschaft', heroSpan: 'tiefer',
    heroSub: 'Bringen Sie Ihre Forschung mit unbegrenzten Sammlungen, erweiterten Filtern und vielem mehr auf ein neues Niveau.',
    freeTitle: 'Kostenlos', freeSub: 'Mit Grundfunktionen beginnen', freePrice: '€0',
    premiumTitle: 'Premium 👑', premiumSub: 'Volle Kraft, unbegrenzter Zugang', premiumPrice: '€5',
    perMonth: '/Mo', popular: 'AM BELIEBTESTEN', soon: '🔜 Demnächst',
    currentPlan: 'Aktueller Plan', startFree: 'Kostenlos starten',
    notifyTitle: 'Benachrichtigt werden, wenn Premium verfügbar ist',
    notifySub: 'Premium-Mitgliedschaft kommt bald. E-Mail hinterlassen!',
    notifySuccess: '✓ Super! Wir benachrichtigen Sie, wenn Premium verfügbar ist.',
    notifyBtn: 'Benachrichtigen', emailPlaceholder: 'ihre@email.de',
    faqTitle: 'Häufig gestellte Fragen',
    freeFeatures: [
      { label: '10 Suchen pro Tag', included: true },
      { label: 'Max 20 Ergebnisse / Suche', included: true },
      { label: '5 Abstract-Übersetzungen/Tag', included: true },
      { label: 'Artikel-Favoriten', included: true },
      { label: 'Leseliste', included: true },
      { label: 'Community', included: true },
      { label: '3 Sammlungen', included: true },
      { label: 'Zitieranzahl', included: true },
      { label: 'Unbegrenzte Suchen', included: false },
      { label: '100 Ergebnisse / Suche', included: false },
      { label: 'Unbegrenzte Übersetzungen', included: false },
      { label: 'Unbegrenzte Sammlungen', included: false },
      { label: 'Erweiterte Filter', included: false },
      { label: 'PDF-Export', included: false },
      { label: 'Prioritätssupport', included: false },
      { label: 'Premium-Abzeichen 🏆', included: false },
    ],
    premiumFeatures: [
      'PubMed-Suche', 'Übersetzung', 'Artikel-Favoriten', 'Leseliste',
      'Community', 'Unbegrenzte Sammlungen', 'Artikelvergleich', 'Zitieranzahl',
      'Erweiterte Filter', 'PDF-Export', 'Prioritätssupport', 'Premium-Abzeichen 🏆', 'Werbefrei',
    ],
    faq: [
      { q: 'Wann wird Premium verfügbar sein?', a: 'Sehr bald! E-Mail hinterlassen, um als Erster zu erfahren.' },
      { q: 'Wird der kostenlose Plan fortgesetzt?', a: 'Ja! Grundfunktionen bleiben immer kostenlos.' },
      { q: 'Kann ich kündigen?', a: 'Ja, jederzeit kündigen. Keine Verpflichtungen.' },
      { q: 'Welche Zahlungsmethoden werden akzeptiert?', a: 'Kreditkarte und Banküberweisung.' },
    ],
  },
  fr: {
    home: '← Accueil', badge: 'BİLİMCE Premium',
    hero: 'Explorez la science', heroSpan: 'plus profondément',
    heroSub: 'Portez vos recherches au niveau supérieur avec des collections illimitées, des filtres avancés et bien plus.',
    freeTitle: 'Gratuit', freeSub: 'Commencer avec les fonctions de base', freePrice: '€0',
    premiumTitle: 'Premium 👑', premiumSub: 'Pleine puissance, accès illimité', premiumPrice: '€5',
    perMonth: '/mois', popular: 'LE PLUS POPULAIRE', soon: '🔜 Bientôt',
    currentPlan: 'Plan actuel', startFree: 'Commencer gratuitement',
    notifyTitle: 'Être notifié quand Premium sera disponible',
    notifySub: 'L\'abonnement Premium arrive bientôt. Laissez votre e-mail!',
    notifySuccess: '✓ Super! Nous vous notifierons quand Premium sera disponible.',
    notifyBtn: 'Me notifier', emailPlaceholder: 'votre@email.fr',
    faqTitle: 'Questions fréquentes',
    freeFeatures: [
      { label: '10 recherches par jour', included: true },
      { label: 'Max 20 résultats / recherche', included: true },
      { label: '5 traductions de résumé/jour', included: true },
      { label: 'Articles favoris', included: true },
      { label: 'Liste de lecture', included: true },
      { label: 'Communauté', included: true },
      { label: '3 collections', included: true },
      { label: 'Nombre de citations', included: true },
      { label: 'Recherches illimitées', included: false },
      { label: '100 résultats / recherche', included: false },
      { label: 'Traductions illimitées', included: false },
      { label: 'Collections illimitées', included: false },
      { label: 'Filtres avancés', included: false },
      { label: 'Export PDF', included: false },
      { label: 'Support prioritaire', included: false },
      { label: 'Badge Premium 🏆', included: false },
    ],
    premiumFeatures: [
      'Recherche PubMed', 'Traduction', 'Articles favoris', 'Liste de lecture',
      'Communauté', 'Collections illimitées', 'Comparaison d\'articles', 'Nombre de citations',
      'Filtres avancés', 'Export PDF', 'Support prioritaire', 'Badge Premium 🏆', 'Sans publicité',
    ],
    faq: [
      { q: 'Quand Premium sera-t-il disponible?', a: 'Très bientôt! Laissez votre e-mail pour être parmi les premiers.' },
      { q: 'Le plan gratuit continuera-t-il?', a: 'Oui! Les fonctions de base resteront toujours gratuites.' },
      { q: 'Puis-je annuler?', a: 'Oui, annulez quand vous voulez. Sans engagement.' },
      { q: 'Quels modes de paiement seront acceptés?', a: 'Carte de crédit et virement bancaire.' },
    ],
  },
  es: {
    home: '← Inicio', badge: 'BİLİMCE Premium',
    hero: 'Explora la ciencia', heroSpan: 'más profundo',
    heroSub: 'Lleva tu investigación al siguiente nivel con colecciones ilimitadas, filtros avanzados y mucho más.',
    freeTitle: 'Gratuito', freeSub: 'Comenzar con funciones básicas', freePrice: '€0',
    premiumTitle: 'Premium 👑', premiumSub: 'Potencia total, acceso ilimitado', premiumPrice: '€5',
    perMonth: '/mes', popular: 'MÁS POPULAR', soon: '🔜 Próximamente',
    currentPlan: 'Plan actual', startFree: 'Comenzar gratis',
    notifyTitle: 'Recibir notificación cuando Premium esté disponible',
    notifySub: 'La membresía Premium llegará pronto. ¡Deja tu email!',
    notifySuccess: '✓ ¡Genial! Te notificaremos cuando Premium esté disponible.',
    notifyBtn: 'Notificarme', emailPlaceholder: 'tu@email.com',
    faqTitle: 'Preguntas frecuentes',
    freeFeatures: [
      { label: '10 búsquedas por día', included: true },
      { label: 'Máx 20 resultados / búsqueda', included: true },
      { label: '5 traducciones de resumen/día', included: true },
      { label: 'Artículos favoritos', included: true },
      { label: 'Lista de lectura', included: true },
      { label: 'Comunidad', included: true },
      { label: '3 colecciones', included: true },
      { label: 'Recuento de citas', included: true },
      { label: 'Búsquedas ilimitadas', included: false },
      { label: '100 resultados / búsqueda', included: false },
      { label: 'Traducciones ilimitadas', included: false },
      { label: 'Colecciones ilimitadas', included: false },
      { label: 'Filtros avanzados', included: false },
      { label: 'Exportación PDF', included: false },
      { label: 'Soporte prioritario', included: false },
      { label: 'Insignia Premium 🏆', included: false },
    ],
    premiumFeatures: [
      'Búsqueda PubMed', 'Traducción', 'Artículos favoritos', 'Lista de lectura',
      'Comunidad', 'Colecciones ilimitadas', 'Comparación de artículos', 'Recuento de citas',
      'Filtros avanzados', 'Exportación PDF', 'Soporte prioritario', 'Insignia Premium 🏆', 'Sin anuncios',
    ],
    faq: [
      { q: '¿Cuándo estará disponible Premium?', a: '¡Muy pronto! Deja tu email para ser de los primeros en saber.' },
      { q: '¿Continuará el plan gratuito?', a: '¡Sí! Las funciones básicas siempre serán gratuitas.' },
      { q: '¿Puedo cancelar?', a: 'Sí, cancela cuando quieras. Sin compromiso.' },
      { q: '¿Qué métodos de pago se aceptarán?', a: 'Tarjeta de crédito y transferencia bancaria.' },
    ],
  },
  ar: {
    home: '← الرئيسية', badge: 'BİLİMCE Premium',
    hero: 'استكشف العلوم', heroSpan: 'بعمق أكبر',
    heroSub: 'ارفع مستوى أبحاثك مع مجموعات غير محدودة وفلاتر متقدمة والمزيد.',
    freeTitle: 'مجاني', freeSub: 'ابدأ بالميزات الأساسية', freePrice: '$0',
    premiumTitle: 'Premium 👑', premiumSub: 'قوة كاملة، وصول غير محدود', premiumPrice: '$5',
    perMonth: '/شهر', popular: 'الأكثر شعبية', soon: '🔜 قريباً',
    currentPlan: 'الخطة الحالية', startFree: 'ابدأ مجاناً',
    notifyTitle: 'احصل على إشعار عند توفر Premium',
    notifySub: 'عضوية Premium قادمة قريباً. اترك بريدك الإلكتروني!',
    notifySuccess: '✓ رائع! سنخطرك عند توفر Premium.',
    notifyBtn: 'أخطرني', emailPlaceholder: 'بريدك@email.com',
    faqTitle: 'الأسئلة الشائعة',
    freeFeatures: [
      { label: '10 عمليات بحث يومياً', included: true },
      { label: 'حد أقصى 20 نتيجة / بحث', included: true },
      { label: '5 ترجمات ملخص/يوم', included: true },
      { label: 'مقالات مفضلة', included: true },
      { label: 'قائمة القراءة', included: true },
      { label: 'المجتمع', included: true },
      { label: '3 مجموعات', included: true },
      { label: 'عدد الاستشهادات', included: true },
      { label: 'بحث غير محدود', included: false },
      { label: '100 نتيجة / بحث', included: false },
      { label: 'ترجمات غير محدودة', included: false },
      { label: 'مجموعات غير محدودة', included: false },
      { label: 'فلاتر متقدمة', included: false },
      { label: 'تصدير PDF', included: false },
      { label: 'دعم ذو أولوية', included: false },
      { label: 'شارة Premium 🏆', included: false },
    ],
    premiumFeatures: [
      'بحث PubMed', 'الترجمة', 'مقالات مفضلة', 'قائمة القراءة',
      'المجتمع', 'مجموعات غير محدودة', 'مقارنة المقالات', 'عدد الاستشهادات',
      'فلاتر متقدمة', 'تصدير PDF', 'دعم ذو أولوية', 'شارة Premium 🏆', 'بدون إعلانات',
    ],
    faq: [
      { q: 'متى سيتوفر Premium؟', a: 'قريباً جداً! اترك بريدك لتكون من أوائل من يعلمون.' },
      { q: 'هل ستستمر الخطة المجانية؟', a: 'نعم! الميزات الأساسية ستبقى مجانية دائماً.' },
      { q: 'هل يمكنني الإلغاء؟', a: 'نعم، يمكنك الإلغاء في أي وقت. بدون التزام.' },
      { q: 'ما طرق الدفع المقبولة؟', a: 'بطاقة الائتمان والتحويل المصرفي.' },
    ],
  },
}

export default function PremiumPage() {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [notified, setNotified] = useState(false)
  const [loading, setLoading] = useState(false)
  const [lang, setLang] = useState('tr')

  useEffect(() => {
    const savedLang = localStorage.getItem('bilimce_lang') || 'tr'
    setLang(savedLang)
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) { setUser(data.user); setEmail(data.user.email || '') }
    })
  }, [])

  const t = UI[lang] || UI.tr

  const handleNotify = async () => {
    if (!email.trim() || !email.includes('@')) return
    setLoading(true)
    await supabase.from('email_subscribers').upsert({ email: email.trim() })
    setNotified(true); setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <header className="border-b border-white/5 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="/"><img src="/logo.svg" alt="B" className="w-7 h-7" /></a>
            <span className="font-bold text-base tracking-tight text-white">BİLİMCE</span>
          </div>
          <a href="/" className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white/60 hover:text-white transition">{t.home}</a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-400 text-xs font-semibold mb-6">
            <span>👑</span><span>{t.badge}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            {t.hero} <br />
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">{t.heroSpan}</span>
          </h1>
          <p className="text-white/50 text-lg max-w-lg mx-auto">{t.heroSub}</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-16 max-w-2xl mx-auto">
          <div className="bg-white/3 border border-white/10 rounded-2xl p-6">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-white mb-1">{t.freeTitle}</h2>
              <p className="text-white/40 text-sm">{t.freeSub}</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-black text-white">{t.freePrice}</span>
              <span className="text-white/40 text-sm">{t.perMonth}</span>
            </div>
            <div className="flex flex-col gap-2.5 mb-6">
              {t.freeFeatures.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className={f.included ? 'text-green-400' : 'text-white/20'}>{f.included ? '✓' : '✕'}</span>
                  <span className={`text-sm ${f.included ? 'text-white/70' : 'text-white/25'}`}>{f.label}</span>
                </div>
              ))}
            </div>
            <a href={user ? '/' : '/auth'} className="block w-full px-6 py-3 bg-white/5 border border-white/10 text-white/60 rounded-xl text-sm font-semibold text-center hover:bg-white/10 transition">
              {user ? t.currentPlan : t.startFree}
            </a>
          </div>

          <div className="relative bg-gradient-to-b from-yellow-500/10 to-orange-500/5 border border-yellow-500/30 rounded-2xl p-6">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="px-4 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-xs font-bold text-black">{t.popular}</span>
            </div>
            <div className="mb-4">
              <h2 className="text-lg font-bold text-white mb-1">{t.premiumTitle}</h2>
              <p className="text-white/40 text-sm">{t.premiumSub}</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-black text-yellow-400">{t.premiumPrice}</span>
              <span className="text-white/40 text-sm">{t.perMonth}</span>
            </div>
            <div className="flex flex-col gap-2.5 mb-6">
              {t.premiumFeatures.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-green-400">✓</span>
                  <span className="text-sm text-white/70">{f}</span>
                </div>
              ))}
            </div>
            <button disabled className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl text-sm font-bold text-black opacity-60 cursor-not-allowed">
              {t.soon}
            </button>
          </div>
        </div>

        <div className="max-w-lg mx-auto text-center bg-white/3 border border-white/10 rounded-2xl p-8">
          <div className="text-3xl mb-3">🔔</div>
          <h2 className="text-xl font-bold text-white mb-2">{t.notifyTitle}</h2>
          <p className="text-white/40 text-sm mb-6">{t.notifySub}</p>
          {notified ? (
            <p className="text-green-400 font-semibold">{t.notifySuccess}</p>
          ) : (
            <div className="flex gap-2">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleNotify()} placeholder={t.emailPlaceholder}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/25 outline-none text-sm" />
              <button onClick={handleNotify} disabled={loading || !email.trim()} className="px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl text-sm font-bold text-black hover:opacity-90 transition disabled:opacity-50 whitespace-nowrap">
                {loading ? '...' : t.notifyBtn}
              </button>
            </div>
          )}
        </div>

        <div className="max-w-2xl mx-auto mt-16">
          <h2 className="text-xl font-bold text-white text-center mb-8">{t.faqTitle}</h2>
          <div className="flex flex-col gap-4">
            {t.faq.map((item, i) => (
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
