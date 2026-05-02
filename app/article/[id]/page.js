'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://lypjtxqvusqndqawugxu.supabase.co',
  'sb_publishable_rqtzTjZBNww4u56gNNCI4A_OS_ID1Bo'
)

const UI = {
  tr: {
    loading: 'Yükleniyor...', back: '← Geri Dön', notFound: 'Makale bulunamadı',
    abstract: 'Özet', abstractTr: 'Özet (Türkçe)', abstractEn: 'İngilizce',
    translating: 'Çevriliyor...', translateBtn: 'Türkçe',
    citations: 'atıf', rate: 'Bu araştırmayı puanlayın',
    rateConfirm: 'Onayla ✓', rated: 'Puanlandı!', avg: 'Ortalama',
    votes: 'oy', loginRate: 'Puan vermek için giriş yapın →',
    viewPubmed: 'PubMed\'de Görüntüle →', savePdf: '📄 PDF Kaydet',
    related: '🔗 İlgili Makaleler',
    comments: '💬 Yorumlar', commentPlaceholder: 'Bu araştırma hakkında görüşünüzü paylaşın...',
    submitting: 'Gönderiliyor...', submit: 'Yorum Yap',
    loginComment: 'Yorum yapmak için giriş yapın', loginBtn: 'Giriş Yap',
    noComments: 'Henüz yorum yok. İlk yorumu siz yapın!',
    noAbstract: 'Özet mevcut değil.',
    printTitle: 'Özet (Türkçe)', printSource: 'Kaynak',
    dateLocale: 'tr-TR',
    pdfLang: 'PDF Dili Seç', pdfSaving: 'PDF Hazırlanıyor...', pdfClose: 'Kapat',
    translateTitle: 'Başlığı çevir', fullText: 'Tam Metni Oku (PMC)',
  },
  en: {
    loading: 'Loading...', back: '← Back', notFound: 'Article not found',
    abstract: 'Abstract', abstractTr: 'Abstract (Translated)', abstractEn: 'English',
    translating: 'Translating...', translateBtn: 'Translate',
    citations: 'citations', rate: 'Rate this research',
    rateConfirm: 'Confirm ✓', rated: 'Rated!', avg: 'Average',
    votes: 'votes', loginRate: 'Sign in to rate →',
    viewPubmed: 'View on PubMed →', savePdf: '📄 Save PDF',
    related: '🔗 Related Articles',
    comments: '💬 Comments', commentPlaceholder: 'Share your thoughts on this research...',
    submitting: 'Submitting...', submit: 'Comment',
    loginComment: 'Sign in to comment', loginBtn: 'Sign In',
    noComments: 'No comments yet. Be the first!',
    noAbstract: 'No abstract available.',
    printTitle: 'Abstract (Translated)', printSource: 'Source',
    dateLocale: 'en-GB',
    pdfLang: 'Select PDF Language', pdfSaving: 'Preparing PDF...', pdfClose: 'Close',
    translateTitle: 'Translate title', fullText: 'Read Full Text (PMC)',
  },
  nl: {
    loading: 'Laden...', back: '← Terug', notFound: 'Artikel niet gevonden',
    abstract: 'Samenvatting', abstractTr: 'Samenvatting (Vertaald)', abstractEn: 'Engels',
    translating: 'Vertalen...', translateBtn: 'Vertalen',
    citations: 'citaties', rate: 'Beoordeel dit onderzoek',
    rateConfirm: 'Bevestigen ✓', rated: 'Beoordeeld!', avg: 'Gemiddelde',
    votes: 'stemmen', loginRate: 'Log in om te beoordelen →',
    viewPubmed: 'Bekijk op PubMed →', savePdf: '📄 PDF opslaan',
    related: '🔗 Gerelateerde artikelen',
    comments: '💬 Reacties', commentPlaceholder: 'Deel uw mening over dit onderzoek...',
    submitting: 'Verzenden...', submit: 'Reageren',
    loginComment: 'Log in om te reageren', loginBtn: 'Inloggen',
    noComments: 'Nog geen reacties. Wees de eerste!',
    noAbstract: 'Geen samenvatting beschikbaar.',
    printTitle: 'Samenvatting (Vertaald)', printSource: 'Bron',
    dateLocale: 'nl-NL',
    pdfLang: 'PDF-taal selecteren', pdfSaving: 'PDF voorbereiden...', pdfClose: 'Sluiten',
    translateTitle: 'Titel vertalen', fullText: 'Volledige tekst lezen (PMC)',
  },
  de: {
    loading: 'Laden...', back: '← Zurück', notFound: 'Artikel nicht gefunden',
    abstract: 'Abstract', abstractTr: 'Zusammenfassung (Übersetzt)', abstractEn: 'Englisch',
    translating: 'Übersetzen...', translateBtn: 'Übersetzen',
    citations: 'Zitierungen', rate: 'Dieses Forschungsprojekt bewerten',
    rateConfirm: 'Bestätigen ✓', rated: 'Bewertet!', avg: 'Durchschnitt',
    votes: 'Stimmen', loginRate: 'Anmelden zum Bewerten →',
    viewPubmed: 'Auf PubMed anzeigen →', savePdf: '📄 PDF speichern',
    related: '🔗 Verwandte Artikel',
    comments: '💬 Kommentare', commentPlaceholder: 'Teilen Sie Ihre Gedanken zu dieser Forschung...',
    submitting: 'Wird gesendet...', submit: 'Kommentieren',
    loginComment: 'Anmelden zum Kommentieren', loginBtn: 'Anmelden',
    noComments: 'Noch keine Kommentare. Seien Sie der Erste!',
    noAbstract: 'Kein Abstract verfügbar.',
    printTitle: 'Zusammenfassung (Übersetzt)', printSource: 'Quelle',
    dateLocale: 'de-DE',
    pdfLang: 'PDF-Sprache auswählen', pdfSaving: 'PDF wird vorbereitet...', pdfClose: 'Schließen',
    translateTitle: 'Titel übersetzen', fullText: 'Volltext lesen (PMC)',
  },
  fr: {
    loading: 'Chargement...', back: '← Retour', notFound: 'Article introuvable',
    abstract: 'Résumé', abstractTr: 'Résumé (Traduit)', abstractEn: 'Anglais',
    translating: 'Traduction...', translateBtn: 'Traduire',
    citations: 'citations', rate: 'Évaluer cette recherche',
    rateConfirm: 'Confirmer ✓', rated: 'Évalué!', avg: 'Moyenne',
    votes: 'votes', loginRate: 'Connectez-vous pour évaluer →',
    viewPubmed: 'Voir sur PubMed →', savePdf: '📄 Sauvegarder PDF',
    related: '🔗 Articles connexes',
    comments: '💬 Commentaires', commentPlaceholder: 'Partagez vos réflexions sur cette recherche...',
    submitting: 'Envoi...', submit: 'Commenter',
    loginComment: 'Connectez-vous pour commenter', loginBtn: 'Connexion',
    noComments: 'Pas encore de commentaires. Soyez le premier!',
    noAbstract: 'Aucun résumé disponible.',
    printTitle: 'Résumé (Traduit)', printSource: 'Source',
    dateLocale: 'fr-FR',
    pdfLang: 'Sélectionner la langue PDF', pdfSaving: 'Préparation du PDF...', pdfClose: 'Fermer',
    translateTitle: 'Traduire le titre', fullText: 'Lire le texte intégral (PMC)',
  },
  es: {
    loading: 'Cargando...', back: '← Volver', notFound: 'Artículo no encontrado',
    abstract: 'Resumen', abstractTr: 'Resumen (Traducido)', abstractEn: 'Inglés',
    translating: 'Traduciendo...', translateBtn: 'Traducir',
    citations: 'citas', rate: 'Valorar esta investigación',
    rateConfirm: 'Confirmar ✓', rated: '¡Valorado!', avg: 'Promedio',
    votes: 'votos', loginRate: 'Inicia sesión para valorar →',
    viewPubmed: 'Ver en PubMed →', savePdf: '📄 Guardar PDF',
    related: '🔗 Artículos relacionados',
    comments: '💬 Comentarios', commentPlaceholder: 'Comparte tus pensamientos sobre esta investigación...',
    submitting: 'Enviando...', submit: 'Comentar',
    loginComment: 'Inicia sesión para comentar', loginBtn: 'Iniciar sesión',
    noComments: 'Aún no hay comentarios. ¡Sé el primero!',
    noAbstract: 'No hay resumen disponible.',
    printTitle: 'Resumen (Traducido)', printSource: 'Fuente',
    dateLocale: 'es-ES',
    pdfLang: 'Seleccionar idioma PDF', pdfSaving: 'Preparando PDF...', pdfClose: 'Cerrar',
    translateTitle: 'Traducir título', fullText: 'Leer texto completo (PMC)',
  },
  ar: {
    loading: 'جاري التحميل...', back: '← رجوع', notFound: 'المقال غير موجود',
    abstract: 'الملخص', abstractTr: 'الملخص (مترجم)', abstractEn: 'الإنجليزية',
    translating: 'ترجمة...', translateBtn: 'ترجمة',
    citations: 'اقتباسات', rate: 'قيم هذا البحث',
    rateConfirm: 'تأكيد ✓', rated: 'تم التقييم!', avg: 'المتوسط',
    votes: 'أصوات', loginRate: 'سجل الدخول للتقييم →',
    viewPubmed: 'عرض على PubMed →', savePdf: '📄 حفظ PDF',
    related: '🔗 مقالات ذات صلة',
    comments: '💬 التعليقات', commentPlaceholder: 'شارك أفكارك حول هذا البحث...',
    submitting: 'جاري الإرسال...', submit: 'تعليق',
    loginComment: 'سجل الدخول للتعليق', loginBtn: 'تسجيل الدخول',
    noComments: 'لا تعليقات بعد. كن أول من يعلق!',
    noAbstract: 'لا يوجد ملخص.',
    printTitle: 'الملخص (مترجم)', printSource: 'المصدر',
    dateLocale: 'ar-SA',
    pdfLang: 'اختر لغة PDF', pdfSaving: 'جاري تحضير PDF...', pdfClose: 'إغلاق',
    translateTitle: 'ترجمة العنوان', fullText: 'قراءة النص الكامل (PMC)',
  },
}

const PDF_LANGUAGES = [
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
]

const decodeHtml = (str) => {
  if (!str) return str
  return str
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
}

async function fetchArticle(pubmedId) {
  try {
    const res = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${pubmedId}&retmode=xml`)
    const xml = await res.text()
    const title = decodeHtml(xml.match(/<ArticleTitle[^>]*>([\s\S]*?)<\/ArticleTitle>/)?.[1]?.replace(/<[^>]+>/g, '') || '')
    const abstractSection = xml.match(/<Abstract>([\s\S]*?)<\/Abstract>/)?.[1] || ''
    const abstractParts = []
    const abstractTextMatches = abstractSection.match(/<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/g) || []
    for (const part of abstractTextMatches) {
      const label = part.match(/Label="([^"]+)"/)?.[1]
      const text = decodeHtml(part.replace(/<[^>]+>/g, '').trim())
      if (text) abstractParts.push(label ? `${label}: ${text}` : text)
    }
    const abstract = abstractParts.join('\n\n')
    const journal = decodeHtml(xml.match(/<Title>([\s\S]*?)<\/Title>/)?.[1] || '')
    const year = xml.match(/<PubDate>[\s\S]*?<Year>(\d+)<\/Year>/)?.[1] || ''
    const lastNames = xml.match(/<LastName>([\s\S]*?)<\/LastName>/g)?.slice(0, 5).map(n => decodeHtml(n.replace(/<[^>]+>/g, ''))) || []
    const meshTerms = xml.match(/<DescriptorName[^>]*>([\s\S]*?)<\/DescriptorName>/g)?.slice(0, 3).map(n => decodeHtml(n.replace(/<[^>]+>/g, ''))) || []
    const keywords = xml.match(/<Keyword[^>]*>([\s\S]*?)<\/Keyword>/g)?.slice(0, 3).map(n => decodeHtml(n.replace(/<[^>]+>/g, ''))) || []
    const allKeywords = [...new Set([...meshTerms, ...keywords])].slice(0, 3)
    const searchTerms = allKeywords.length > 0 ? allKeywords : title.split(' ').slice(0, 3).join(' ')
    return { pubmed_id: pubmedId, title_en: title, abstract_en: abstract, journal, published_date: year, authors: lastNames.join(', '), keywords: allKeywords, searchTerms }
  } catch { return null }
}

async function fetchCitationCount(pubmedId) {
  try {
    const res = await fetch(`https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:${pubmedId}%20AND%20SRC:MED&format=json&resulttype=core`)
    const data = await res.json()
    return data.resultList?.result?.[0]?.citedByCount || 0
  } catch { return null }
}

async function fetchRelated(searchTerms, currentId) {
  try {
    const query = Array.isArray(searchTerms) ? searchTerms.slice(0, 2).join(' ') : searchTerms
    if (!query) return []
    const searchRes = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=6&retmode=json`)
    const searchData = await searchRes.json()
    const ids = (searchData.esearchresult?.idlist || []).filter(id => id !== currentId).slice(0, 4)
    if (ids.length === 0) return []
    const fetchRes = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${ids.join(',')}&retmode=xml`)
    const xml = await fetchRes.text()
    const articles = []
    const matches = xml.match(/<PubmedArticle>[\s\S]*?<\/PubmedArticle>/g) || []
    for (const article of matches) {
      const pubmedId = article.match(/<PMID[^>]*>(\d+)<\/PMID>/)?.[1]
      const title = decodeHtml(article.match(/<ArticleTitle[^>]*>([\s\S]*?)<\/ArticleTitle>/)?.[1]?.replace(/<[^>]+>/g, '') || '')
      const journal = decodeHtml(article.match(/<Title>([\s\S]*?)<\/Title>/)?.[1] || '')
      const year = article.match(/<PubDate>[\s\S]*?<Year>(\d+)<\/Year>/)?.[1] || ''
      if (pubmedId && title) articles.push({ pubmed_id: pubmedId, title_en: title, journal, published_date: year })
    }
    return articles
  } catch { return [] }
}

const translateOne = async (text, targetLang) => {
  if (!text || targetLang === 'en') return text
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
    const res = await fetch(url)
    const data = await res.json()
    return data[0]?.map(t => t[0]).filter(Boolean).join('') || text
  } catch { return text }
}

const generatePdfHtml = (article, title, abstract, langCode) => {
  const date = new Date().toLocaleDateString()
  const dir = langCode === 'ar' ? 'rtl' : 'ltr'
  return `<!DOCTYPE html><html dir="${dir}"><head><meta charset="UTF-8"><title>${title}</title>
<style>
body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;padding:20px;color:#1a1a1a;line-height:1.6;direction:${dir}}
.header{border-bottom:2px solid #3b82f6;padding-bottom:16px;margin-bottom:24px}
.badge{background:#eff6ff;color:#1d4ed8;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:bold;display:inline-block;margin-bottom:12px}
h1{font-size:20px;font-weight:bold;color:#111827;margin:0 0 12px;line-height:1.4}
.meta{display:flex;flex-wrap:wrap;gap:8px;font-size:13px;color:#6b7280}
.meta span{background:#f3f4f6;padding:3px 10px;border-radius:12px}
.section{margin:24px 0}
.abstract-part{margin-bottom:12px;font-size:14px;color:#374151}
.abstract-label{font-size:11px;font-weight:bold;color:#3b82f6;text-transform:uppercase;display:block;margin-bottom:4px}
.footer{margin-top:32px;padding-top:16px;border-top:1px solid #e5e7eb;font-size:12px;color:#9ca3af;text-align:center}
@media print{body{margin:20px}}
</style></head><body>
<div class="header">
<div class="badge">BİLİMCE</div>
<h1>${title}</h1>
<div class="meta">
${article.journal ? `<span>📖 ${article.journal}</span>` : ''}
${article.published_date ? `<span>📅 ${article.published_date.slice(0,4)}</span>` : ''}
${article.authors ? `<span>👤 ${article.authors}</span>` : ''}
<span>🔬 PubMed ID: ${article.pubmed_id}</span>
</div></div>
<div class="section">
${(abstract || '').split('\n\n').map(s => {
  const c = s.indexOf(':')
  if (c > 0 && c < 30) return `<div class="abstract-part"><span class="abstract-label">${s.slice(0,c)}</span>${s.slice(c+1).trim()}</div>`
  return `<div class="abstract-part">${s}</div>`
}).join('')}
</div>
<div class="footer">
<p>Source: https://pubmed.ncbi.nlm.nih.gov/${article.pubmed_id}/</p>
<p>BİLİMCE - bilimce.vercel.app | ${date}</p>
</div>
</body></html>`
}

function NoAbstractSection({ article, pubmedId, t }) {
  const [translations, setTranslations] = useState({})
  const [translating, setTranslating] = useState(false)
  const [selectedLang, setSelectedLang] = useState(null)

  const LANGS = [
    { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'nl', label: 'Nederlands', flag: '🇳' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  ]

  const handleTranslate = async (code) => {
    if (translations[code]) { setSelectedLang(code); return }
    setTranslating(true); setSelectedLang(code)
    try {
      const title = await translateOne(article.title_en, code)
      setTranslations(prev => ({ ...prev, [code]: { title } }))
    } catch {}
    setTranslating(false)
  }

  return (
    <div className="bg-white/3 border border-[#30363d] rounded-2xl p-6 mb-6">
      <p className="text-white/40 text-sm mb-4">{t.noAbstract}</p>
      <p className="text-xs text-white/30 mb-3">🌐 {t.translateTitle}:</p>
      <div className="flex flex-wrap gap-2 mb-3">
        {LANGS.map(l => (
          <button key={l.code} onClick={() => handleTranslate(l.code)}
            className={`px-3 py-1.5 rounded-xl text-xs border transition ${selectedLang === l.code ? 'bg-blue-500/30 border-blue-500/50 text-blue-200' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}>
            {l.flag} {l.label}
          </button>
        ))}
      </div>
      {translating && <p className="text-blue-400/60 text-xs animate-pulse mb-3">{t.translating}</p>}
      {selectedLang && translations[selectedLang] && (
        <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-4">
          <p className="text-sm text-white/80 leading-relaxed">{translations[selectedLang].title}</p>
        </div>
      )}
      <div className="flex flex-wrap gap-3">
        <a href={`https://pubmed.ncbi.nlm.nih.gov/${pubmedId}/`} target="_blank" rel="noopener noreferrer"
          className="px-4 py-2 bg-blue-500/20 border border-blue-500/20 text-blue-300 rounded-xl text-xs font-medium hover:bg-blue-500/30 transition">
          🔬 {t.viewPubmed}
        </a>
        <a href={`https://www.ncbi.nlm.nih.gov/pmc/search/?term=${pubmedId}`} target="_blank" rel="noopener noreferrer"
          className="px-4 py-2 bg-green-500/20 border border-green-500/20 text-green-300 rounded-xl text-xs font-medium hover:bg-green-500/30 transition">
          📄 {t.fullText}
        </a>
      </div>
    </div>
  )
}

export default function ArticlePage({ params }) {
  const pubmedId = params.id
  const [article, setArticle] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [citationCount, setCitationCount] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [selectedRating, setSelectedRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [avgRating, setAvgRating] = useState(0)
  const [totalRatings, setTotalRatings] = useState(0)
  const [ratingSuccess, setRatingSuccess] = useState(false)
  const [abstractTr, setAbstractTr] = useState(null)
  const [titleTr, setTitleTr] = useState(null)
  const [translating, setTranslating] = useState(false)
  const [showTr, setShowTr] = useState(false)
  const [lang, setLang] = useState('tr')
  const [showPdfModal, setShowPdfModal] = useState(false)
  const [pdfLang, setPdfLang] = useState('tr')
  const [pdfSaving, setPdfSaving] = useState(false)

  useEffect(() => {
    const savedLang = localStorage.getItem('bilimce_lang') || 'tr'
    setLang(savedLang)
    setPdfLang(savedLang)
    fetchArticle(pubmedId).then(a => {
      setArticle(a); setLoading(false)
      if (a?.searchTerms) fetchRelated(a.searchTerms, pubmedId).then(setRelated)
    })
    fetchCitationCount(pubmedId).then(setCitationCount)
    loadComments(); loadRatings()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null)
      if (data?.user) { loadUsername(data.user.id); loadUserRating(data.user.id) }
    })
  }, [pubmedId])

  const t = UI[lang] || UI.tr

  const goBack = () => {
    if (window.history.length > 1) { window.history.back() }
    else { window.location.href = '/' }
  }

  const loadUsername = async (userId) => {
    const { data } = await supabase.from('profiles').select('username').eq('id', userId).single()
    if (data?.username) setUsername(data.username)
  }

  const loadRatings = async () => {
    const { data } = await supabase.from('ratings').select('rating').eq('pubmed_id', pubmedId)
    if (data && data.length > 0) { const avg = data.reduce((s, r) => s + r.rating, 0) / data.length; setAvgRating(avg); setTotalRatings(data.length) }
  }

  const loadUserRating = async (userId) => {
    const { data } = await supabase.from('ratings').select('rating').eq('pubmed_id', pubmedId).eq('user_id', userId).single()
    if (data) { setUserRating(data.rating); setSelectedRating(data.rating) }
  }

  const handleRate = async () => {
    if (!user || !selectedRating) return
    const { error } = await supabase.from('ratings').upsert({ user_id: user.id, pubmed_id: pubmedId, rating: selectedRating })
    if (!error) { setUserRating(selectedRating); setRatingSuccess(true); setTimeout(() => setRatingSuccess(false), 2000); loadRatings() }
  }

  const translateAbstract = async () => {
    if (abstractTr) { setShowTr(!showTr); return }
    setTranslating(true)
    try {
      const res = await fetch('/api/translate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: article.title_en, abstract: article.abstract_en }),
      })
      const data = await res.json()
      setTitleTr(data.title_tr); setAbstractTr(data.abstract_tr); setShowTr(true)
    } catch (err) { console.error(err) }
    finally { setTranslating(false) }
  }

  const loadComments = async () => {
    const { data } = await supabase.from('comments').select('*').eq('pubmed_id', pubmedId).order('created_at', { ascending: false })
    setComments(data || [])
  }

  const submitComment = async () => {
    if (!newComment.trim() || !user) return
    setSubmitting(true)
    const { error } = await supabase.from('comments').insert({ user_id: user.id, pubmed_id: pubmedId, username: username || user.email?.split('@')[0], content: newComment.trim() })
    if (!error) { setNewComment(''); loadComments() }
    setSubmitting(false)
  }

  const deleteComment = async (id) => {
    await supabase.from('comments').delete().eq('id', id)
    setComments(prev => prev.filter(c => c.id !== id))
  }

  const handleSavePdf = async () => {
    if (!article) return
    setPdfSaving(true)
    try {
      let translatedTitle = article.title_en
      let translatedAbstract = article.abstract_en
      if (pdfLang !== 'en') {
        translatedTitle = await translateOne(article.title_en, pdfLang)
        translatedAbstract = await translateOne(article.abstract_en, pdfLang)
      }
      const html = generatePdfHtml(article, translatedTitle, translatedAbstract, pdfLang)
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `bilimce-${pubmedId}-${pdfLang}.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setShowPdfModal(false)
    } catch (err) { console.error(err) }
    setPdfSaving(false)
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
      <div className="text-white/30">{UI[lang]?.loading || 'Loading...'}</div>
    </div>
  )

  const abstract = article?.abstract_en || ''
  const displayAbstract = showTr && abstractTr ? abstractTr : abstract
  const sections = displayAbstract.split('\n\n').filter(Boolean)

  return (
    <div className="min-h-screen bg-[#0d1117]" dir={lang === 'ar' ? 'rtl' : 'ltr'}>

      {showPdfModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4" onClick={() => setShowPdfModal(false)}>
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-white font-semibold mb-4 text-base">📄 {t.pdfLang}</h3>
            <div className="grid grid-cols-2 gap-2 mb-5">
              {PDF_LANGUAGES.map(l => (
                <button key={l.code} onClick={() => setPdfLang(l.code)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm border transition ${pdfLang === l.code ? 'bg-blue-500/30 border-blue-500/50 text-blue-200' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}>
                  <span>{l.flag}</span><span>{l.label}</span>
                </button>
              ))}
            </div>
            <button onClick={handleSavePdf} disabled={pdfSaving}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition disabled:opacity-50 mb-2">
              {pdfSaving ? t.pdfSaving : t.savePdf}
            </button>
            <button onClick={() => setShowPdfModal(false)} className="w-full py-2 text-xs text-white/30 hover:text-white transition">{t.pdfClose}</button>
          </div>
        </div>
      )}

      <header className="border-b border-[#30363d] px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="/" className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">B</a>
            <span className="font-bold text-base tracking-tight text-white">BİLİMCE</span>
          </div>
          <button onClick={goBack} className="px-4 py-2 bg-white/5 border border-[#30363d] rounded-xl text-xs text-white/60 hover:text-white transition">{t.back}</button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        {!article ? (
          <div className="text-center py-20 text-white/30">
            <div className="text-5xl mb-4">🔭</div>
            <p className="mb-4">{t.notFound}</p>
            <button onClick={goBack} className="inline-block px-6 py-3 bg-blue-500/20 border border-blue-500/20 text-blue-300 rounded-xl text-sm hover:bg-blue-500/30 transition">{t.back}</button>
          </div>
        ) : (
          <>
            <article>
              <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-white leading-snug mb-2">{showTr && titleTr ? titleTr : article.title_en}</h1>
                {showTr && titleTr && <p className="text-white/40 text-sm mb-3">{article.title_en}</p>}
                <div className="flex flex-wrap gap-2 text-xs text-white/40 mb-4">
                  {article.journal && (
                    <a href={`/journal/${encodeURIComponent(article.journal)}`} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg hover:border-green-500/30 hover:text-green-300 transition">
                      📖 {article.journal}
                    </a>
                  )}
                  {article.published_date && <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg">{article.published_date.slice(0,4)}</span>}
                  {article.authors && (
                    <div className="flex flex-wrap gap-2">
                      {article.authors.split(', ').map((author, i) => (
                        <a key={i} href={`/author/${encodeURIComponent(author)}`} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg hover:border-blue-500/30 hover:text-blue-300 transition">👤 {author}</a>
                      ))}
                    </div>
                  )}
                  <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg">PubMed ID: {pubmedId}</span>
                  {citationCount !== null && (
                    <span className={`px-3 py-1 rounded-lg border font-semibold ${citationCount > 100 ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' : citationCount > 20 ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-white/5 border-white/10 text-white/50'}`}>
                      📊 {citationCount} {t.citations}
                    </span>
                  )}
                </div>
                {article.keywords?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {article.keywords.map((k, i) => <span key={i} className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-lg text-xs">{k}</span>)}
                  </div>
                )}
              </div>

              {abstract ? (
                <div className="bg-white/3 border border-[#30363d] rounded-2xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wide">
                      {showTr ? t.abstractTr : t.abstract}
                    </h2>
                    <button onClick={translateAbstract} disabled={translating} className="px-3 py-1.5 bg-blue-500/20 border border-blue-500/20 text-blue-300 rounded-xl text-xs font-medium hover:bg-blue-500/30 transition disabled:opacity-50">
                      {translating ? t.translating : showTr ? t.abstractEn : t.translateBtn}
                    </button>
                  </div>
                  {sections.length > 1 ? (
                    <div className="flex flex-col gap-4">
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
                  ) : (
                    <p className="text-sm text-white/80 leading-relaxed">{sections[0]}</p>
                  )}
                  <div className="mt-6 pt-4 border-t border-white/5">
                    <p className="text-xs text-white/40 mb-3">{t.rate}</p>
                    {user ? (
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map(star => (
                            <button key={star} onClick={() => setSelectedRating(star)} onMouseEnter={() => setHovered(star)} onMouseLeave={() => setHovered(0)} className="text-3xl transition-transform hover:scale-110 leading-none cursor-pointer">
                              <span style={{ color: star <= (hovered || selectedRating) ? '#facc15' : 'rgba(255,255,255,0.15)' }}>★</span>
                            </button>
                          ))}
                        </div>
                        {selectedRating > 0 && selectedRating !== userRating && (
                          <button onClick={handleRate} className="px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 rounded-xl text-xs font-medium hover:bg-yellow-500/30 transition">{t.rateConfirm}</button>
                        )}
                        {ratingSuccess && <span className="text-green-400 text-xs">{t.rated}</span>}
                        {totalRatings > 0 && <span className="text-xs text-white/40">{t.avg}: <span className="text-yellow-400 font-semibold">{avgRating.toFixed(1)}</span> ({totalRatings} {t.votes})</span>}
                      </div>
                    ) : (
                      <a href="/auth" className="text-xs text-blue-400 hover:text-blue-300 transition">{t.loginRate}</a>
                    )}
                  </div>
                </div>
              ) : (
                <NoAbstractSection article={article} pubmedId={pubmedId} t={t} />
              )}

              <div className="flex flex-wrap gap-3 mb-12">
                <a href={`https://pubmed.ncbi.nlm.nih.gov/${pubmedId}/`} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-blue-500/20 border border-blue-500/20 text-blue-300 rounded-xl text-sm font-medium hover:bg-blue-500/30 transition">{t.viewPubmed}</a>
                <button onClick={() => setShowPdfModal(true)} className="px-5 py-2.5 bg-green-500/20 border border-green-500/20 text-green-300 rounded-xl text-sm font-medium hover:bg-green-500/30 transition">{t.savePdf}</button>
                <button onClick={goBack} className="px-5 py-2.5 bg-white/5 border border-white/10 text-white/60 rounded-xl text-sm hover:text-white transition">{t.back}</button>
              </div>
            </article>

            {related.length > 0 && (
              <div className="border-t border-[#30363d] pt-8 mb-8">
                <h2 className="text-lg font-semibold text-white mb-4">{t.related}</h2>
                <div className="grid gap-3">
                  {related.map(r => (
                    <a key={r.pubmed_id} href={`/article/${r.pubmed_id}`} className="bg-white/3 border border-[#30363d] rounded-xl p-4 hover:border-white/15 transition-all block">
                      <p className="text-sm text-white/80 leading-snug mb-2">{r.title_en}</p>
                      <div className="flex gap-3 text-xs text-white/30">
                        {r.journal && <span>{r.journal}</span>}
                        {r.published_date && <span>{r.published_date.slice(0,4)}</span>}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-[#30363d] pt-8">
              <h2 className="text-lg font-semibold text-white mb-6">{t.comments} ({comments.length})</h2>
              {user ? (
                <div className="mb-6">
                  <textarea value={newComment} onChange={e => setNewComment(e.target.value)} placeholder={t.commentPlaceholder} rows={3} className="w-full bg-white/5 border border-[#30363d] rounded-xl px-4 py-3 text-white placeholder-white/25 outline-none text-sm focus:border-blue-500/50 resize-none mb-3" />
                  <button onClick={submitComment} disabled={submitting || !newComment.trim()} className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition disabled:opacity-50">
                    {submitting ? t.submitting : t.submit}
                  </button>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-white/3 border border-[#30363d] rounded-xl text-center">
                  <p className="text-white/40 text-sm mb-3">{t.loginComment}</p>
                  <a href="/auth" className="px-6 py-2 bg-blue-500/20 border border-blue-500/20 text-blue-300 rounded-xl text-sm hover:bg-blue-500/30 transition">{t.loginBtn}</a>
                </div>
              )}
              {comments.length === 0 ? (
                <p className="text-white/30 text-sm">{t.noComments}</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {comments.map(comment => (
                    <div key={comment.id} className="bg-white/3 border border-[#30363d] rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-blue-400 text-xs font-semibold">👤 {comment.username}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-white/25 text-xs">{new Date(comment.created_at).toLocaleDateString(t.dateLocale)}</span>
                          {user && user.id === comment.user_id && <button onClick={() => deleteComment(comment.id)} className="text-white/25 hover:text-red-400 transition text-xs">✕</button>}
                        </div>
                      </div>
                      <p className="text-sm text-white/70 leading-relaxed">{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
