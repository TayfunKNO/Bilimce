'use client'
import { useState, useEffect } from 'react'

const UI = {
  tr: {
    loading: 'Yükleniyor...', notFound: 'Karşılaştırılacak makale bulunamadı',
    back: '← Geri', translating: 'Çevriliyor...', translated: '✓ Çevrildi',
    translateBtn: 'Çevir', title: '⚖️ Makale Karşılaştırma',
    article: 'Makale', journal: 'Dergi', year: 'Yıl', authors: 'Yazarlar',
    keywords: 'Anahtar Kelimeler', abstract: 'Özet', detail: 'Detaya Git →',
    noAbstract: 'Özet mevcut değil.',
  },
  en: {
    loading: 'Loading...', notFound: 'Articles to compare not found',
    back: '← Back', translating: 'Translating...', translated: '✓ Translated',
    translateBtn: 'Translate', title: '⚖️ Article Comparison',
    article: 'Article', journal: 'Journal', year: 'Year', authors: 'Authors',
    keywords: 'Keywords', abstract: 'Abstract', detail: 'View Details →',
    noAbstract: 'No abstract available.',
  },
  nl: {
    loading: 'Laden...', notFound: 'Te vergelijken artikelen niet gevonden',
    back: '← Terug', translating: 'Vertalen...', translated: '✓ Vertaald',
    translateBtn: 'Vertalen', title: '⚖️ Artikelvergelijking',
    article: 'Artikel', journal: 'Tijdschrift', year: 'Jaar', authors: 'Auteurs',
    keywords: 'Trefwoorden', abstract: 'Samenvatting', detail: 'Details bekijken →',
    noAbstract: 'Geen samenvatting beschikbaar.',
  },
  de: {
    loading: 'Laden...', notFound: 'Zu vergleichende Artikel nicht gefunden',
    back: '← Zurück', translating: 'Übersetzen...', translated: '✓ Übersetzt',
    translateBtn: 'Übersetzen', title: '⚖️ Artikelvergleich',
    article: 'Artikel', journal: 'Zeitschrift', year: 'Jahr', authors: 'Autoren',
    keywords: 'Schlüsselwörter', abstract: 'Zusammenfassung', detail: 'Details ansehen →',
    noAbstract: 'Kein Abstract verfügbar.',
  },
  fr: {
    loading: 'Chargement...', notFound: 'Articles à comparer introuvables',
    back: '← Retour', translating: 'Traduction...', translated: '✓ Traduit',
    translateBtn: 'Traduire', title: '⚖️ Comparaison d\'articles',
    article: 'Article', journal: 'Revue', year: 'Année', authors: 'Auteurs',
    keywords: 'Mots-clés', abstract: 'Résumé', detail: 'Voir les détails →',
    noAbstract: 'Aucun résumé disponible.',
  },
  es: {
    loading: 'Cargando...', notFound: 'Artículos a comparar no encontrados',
    back: '← Volver', translating: 'Traduciendo...', translated: '✓ Traducido',
    translateBtn: 'Traducir', title: '⚖️ Comparación de artículos',
    article: 'Artículo', journal: 'Revista', year: 'Año', authors: 'Autores',
    keywords: 'Palabras clave', abstract: 'Resumen', detail: 'Ver detalles →',
    noAbstract: 'No hay resumen disponible.',
  },
  ar: {
    loading: 'جاري التحميل...', notFound: 'لم يتم العثور على مقالات للمقارنة',
    back: '← رجوع', translating: 'ترجمة...', translated: '✓ تمت الترجمة',
    translateBtn: 'ترجمة', title: '⚖️ مقارنة المقالات',
    article: 'مقال', journal: 'مجلة', year: 'سنة', authors: 'المؤلفون',
    keywords: 'الكلمات المفتاحية', abstract: 'الملخص', detail: 'عرض التفاصيل →',
    noAbstract: 'لا يوجد ملخص.',
  },
}

async function fetchArticle(pubmedId) {
  try {
    const res = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${pubmedId}&retmode=xml`)
    const xml = await res.text()
    const title = xml.match(/<ArticleTitle[^>]*>([\s\S]*?)<\/ArticleTitle>/)?.[1]?.replace(/<[^>]+>/g, '') || ''
    const abstractSection = xml.match(/<Abstract>([\s\S]*?)<\/Abstract>/)?.[1] || ''
    const abstractParts = []
    const abstractTextMatches = abstractSection.match(/<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/g) || []
    for (const part of abstractTextMatches) {
      const label = part.match(/Label="([^"]+)"/)?.[1]
      const text = part.replace(/<[^>]+>/g, '').trim()
      if (text) abstractParts.push(label ? `${label}: ${text}` : text)
    }
    const abstract = abstractParts.join('\n\n')
    const journal = xml.match(/<Title>([\s\S]*?)<\/Title>/)?.[1] || ''
    const year = xml.match(/<PubDate>[\s\S]*?<Year>(\d+)<\/Year>/)?.[1] || ''
    const lastNames = xml.match(/<LastName>([\s\S]*?)<\/LastName>/g)?.slice(0, 3).map(n => n.replace(/<[^>]+>/g, '')) || []
    const meshTerms = xml.match(/<DescriptorName[^>]*>([\s\S]*?)<\/DescriptorName>/g)?.slice(0, 5).map(n => n.replace(/<[^>]+>/g, '')) || []
    return { pubmed_id: pubmedId, title_en: title, abstract_en: abstract, journal, published_date: year, authors: lastNames.join(', '), keywords: meshTerms }
  } catch { return null }
}

export default function ComparePage() {
  const [articles, setArticles] = useState([null, null])
  const [loading, setLoading] = useState(true)
  const [translating, setTranslating] = useState(false)
  const [translated, setTranslated] = useState([false, false])
  const [lang, setLang] = useState('tr')

  useEffect(() => {
    const savedLang = localStorage.getItem('bilimce_lang') || 'tr'
    setLang(savedLang)
    const params = new URLSearchParams(window.location.search)
    const id1 = params.get('id1')
    const id2 = params.get('id2')
    if (!id1 || !id2) { setLoading(false); return }
    Promise.all([fetchArticle(id1), fetchArticle(id2)]).then(([a1, a2]) => {
      setArticles([a1, a2]); setLoading(false)
    })
  }, [])

  const t = UI[lang] || UI.tr

  const translateAll = async () => {
    setTranslating(true)
    const updated = await Promise.all(articles.map(async (a, i) => {
      if (!a || translated[i]) return a
      try {
        const res = await fetch('/api/translate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: a.title_en, abstract: a.abstract_en }) })
        const data = await res.json()
        return { ...a, title_tr: data.title_tr, abstract_tr: data.abstract_tr }
      } catch { return a }
    }))
    setArticles(updated); setTranslated([true, true]); setTranslating(false)
  }

  const AbstractDisplay = ({ text }) => {
    if (!text) return <p className="text-white/40 text-sm italic">{t.noAbstract}</p>
    const sections = text.split('\n\n').filter(Boolean)
    if (sections.length <= 1) return <p className="text-sm text-white/80 leading-relaxed">{text}</p>
    return (
      <div className="flex flex-col gap-3">
        {sections.map((section, i) => {
          const colonIdx = section.indexOf(':')
          if (colonIdx > 0 && colonIdx < 30) {
            const label = section.slice(0, colonIdx)
            const content = section.slice(colonIdx + 1).trim()
            return (
              <div key={i}>
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide">{label}</span>
                <p className="text-sm text-white/80 leading-relaxed mt-1">{content}</p>
              </div>
            )
          }
          return <p key={i} className="text-sm text-white/80 leading-relaxed">{section}</p>
        })}
      </div>
    )
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="text-white/30">{UI[lang]?.loading || 'Loading...'}</div>
    </div>
  )

  if (!articles[0] || !articles[1]) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="text-center text-white/30">
        <div className="text-5xl mb-4">🔭</div>
        <p className="mb-4">{t.notFound}</p>
        <button onClick={() => window.history.back()} className="px-6 py-3 bg-blue-500/20 border border-blue-500/20 text-blue-300 rounded-xl text-sm hover:bg-blue-500/30 transition">{t.back}</button>
      </div>
    </div>
  )

  const rowLabels = [t.journal, t.year, t.authors]
  const rowKeys = ['journal', 'published_date', 'authors']

  return (
    <div className="min-h-screen bg-[#0a0a0f]" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <header className="border-b border-white/5 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="/" className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">B</a>
            <span className="font-bold text-base tracking-tight text-white">BİLİMCE</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={translateAll} disabled={translating || (translated[0] && translated[1])} className="px-4 py-2 bg-blue-500/20 border border-blue-500/20 text-blue-300 rounded-xl text-xs font-medium hover:bg-blue-500/30 transition disabled:opacity-50 shrink-0">
              {translating ? t.translating : (translated[0] && translated[1]) ? t.translated : t.translateBtn}
            </button>
            <button onClick={() => window.history.back()} className="px-4 py-2 bg-white/5 border border-white/10 text-white/60 rounded-xl text-xs hover:text-white transition shrink-0">{t.back}</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-white mb-6 text-center">{t.title}</h1>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {articles.map((a, i) => (
            <div key={i} className="bg-white/3 border border-white/10 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2 py-1 rounded-lg text-xs font-bold ${i === 0 ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'}`}>
                  {t.article} {i + 1}
                </span>
              </div>
              <h2 className="text-sm font-semibold text-white leading-snug mb-2">
                {(translated[i] && a.title_tr) ? a.title_tr : a.title_en}
              </h2>
              <div className="flex flex-wrap gap-2 text-xs text-white/40">
                {a.journal && <span>{a.journal}</span>}
                {a.published_date && <span>· {a.published_date.slice(0,4)}</span>}
                {a.authors && <span>· {a.authors}</span>}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white/3 border border-white/5 rounded-2xl overflow-hidden mb-6">
          {rowLabels.map((label, i) => (
            <div key={i} className={`grid grid-cols-3 ${i % 2 === 0 ? 'bg-white/2' : ''}`}>
              <div className="px-4 py-3 text-xs font-semibold text-white/40 border-r border-white/5">{label}</div>
              <div className="px-4 py-3 text-xs text-white/70 border-r border-white/5">
                {rowKeys[i] === 'published_date' ? articles[0]?.[rowKeys[i]]?.slice(0,4) : articles[0]?.[rowKeys[i]] || '-'}
              </div>
              <div className="px-4 py-3 text-xs text-white/70">
                {rowKeys[i] === 'published_date' ? articles[1]?.[rowKeys[i]]?.slice(0,4) : articles[1]?.[rowKeys[i]] || '-'}
              </div>
            </div>
          ))}
          <div className="grid grid-cols-3 bg-white/2">
            <div className="px-4 py-3 text-xs font-semibold text-white/40 border-r border-white/5">{t.keywords}</div>
            {articles.map((a, i) => (
              <div key={i} className={`px-4 py-3 ${i === 0 ? 'border-r border-white/5' : ''}`}>
                <div className="flex flex-wrap gap-1">
                  {a.keywords?.length > 0 ? a.keywords.map((k, j) => (
                    <span key={j} className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded text-xs">{k}</span>
                  )) : <span className="text-white/30 text-xs">-</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {articles.map((a, i) => (
            <div key={i} className="bg-white/3 border border-white/5 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-2 py-1 rounded-lg text-xs font-bold ${i === 0 ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'}`}>
                  {t.article} {i + 1}
                </span>
                <span className="text-xs text-white/40">{t.abstract}</span>
              </div>
              <AbstractDisplay text={(translated[i] && a.abstract_tr) ? a.abstract_tr : a.abstract_en} />
              <div className="mt-4 pt-4 border-t border-white/5">
                <a href={`/article/${a.pubmed_id}`} className="text-xs text-blue-400 hover:text-blue-300 transition">{t.detail}</a>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
