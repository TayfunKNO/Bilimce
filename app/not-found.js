'use client'
import { useEffect, useState } from 'react'

const UI = {
  tr: { title: 'Sayfa Bulunamadı', desc: 'Aradığınız sayfa mevcut değil veya taşınmış olabilir.', home: 'Ana Sayfaya Dön', community: 'Topluluğa Git', redirect: (n) => `${n} saniye sonra ana sayfaya yönlendiriliyorsunuz...`, redirecting: 'Yönlendiriliyor...' },
  en: { title: 'Page Not Found', desc: 'The page you are looking for does not exist or may have been moved.', home: 'Go to Home', community: 'Go to Community', redirect: (n) => `Redirecting to home in ${n} seconds...`, redirecting: 'Redirecting...' },
  nl: { title: 'Pagina niet gevonden', desc: 'De pagina die u zoekt bestaat niet of is mogelijk verplaatst.', home: 'Naar startpagina', community: 'Naar gemeenschap', redirect: (n) => `Doorsturen naar startpagina in ${n} seconden...`, redirecting: 'Doorsturen...' },
  de: { title: 'Seite nicht gefunden', desc: 'Die gesuchte Seite existiert nicht oder wurde möglicherweise verschoben.', home: 'Zur Startseite', community: 'Zur Community', redirect: (n) => `Weiterleitung zur Startseite in ${n} Sekunden...`, redirecting: 'Weiterleiten...' },
  fr: { title: 'Page introuvable', desc: 'La page que vous cherchez n\'existe pas ou a peut-être été déplacée.', home: 'Aller à l\'accueil', community: 'Aller à la communauté', redirect: (n) => `Redirection vers l\'accueil dans ${n} secondes...`, redirecting: 'Redirection...' },
  es: { title: 'Página no encontrada', desc: 'La página que busca no existe o puede haber sido movida.', home: 'Ir al inicio', community: 'Ir a la comunidad', redirect: (n) => `Redirigiendo al inicio en ${n} segundos...`, redirecting: 'Redirigiendo...' },
  ar: { title: 'الصفحة غير موجودة', desc: 'الصفحة التي تبحث عنها غير موجودة أو ربما تم نقلها.', home: 'الذهاب إلى الرئيسية', community: 'الذهاب إلى المجتمع', redirect: (n) => `إعادة التوجيه إلى الرئيسية خلال ${n} ثوانٍ...`, redirecting: 'جاري التوجيه...' },
}

export default function NotFound() {
  const [count, setCount] = useState(5)
  const [lang, setLang] = useState('en')

  useEffect(() => {
    const savedLang = localStorage.getItem('bilimce_lang') || 'en'
    setLang(savedLang)
    const timer = setInterval(() => {
      setCount(prev => {
        if (prev <= 1) { clearInterval(timer); window.location.href = '/'; return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const t = UI[lang] || UI.en

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white mx-auto mb-6">B</div>
        <div className="text-6xl mb-4">🔭</div>
        <h1 className="text-3xl font-bold text-white mb-3">{t.title}</h1>
        <p className="text-white/40 text-sm mb-8 leading-relaxed">{t.desc}</p>
        <div className="flex flex-col gap-3">
          <a href="/" className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition">{t.home}</a>
          <a href="/community" className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white/60 hover:text-white transition">{t.community}</a>
        </div>
        <p className="text-white/20 text-xs mt-8">
          {count > 0 ? t.redirect(count) : t.redirecting}
        </p>
      </div>
    </div>
  )
}
