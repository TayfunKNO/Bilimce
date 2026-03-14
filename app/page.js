'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { searchPubMed } from '../lib/pubmed'

const supabase = createClient(
  'https://xlnnopufkjaqxjsmhtot.supabase.co',
  'sb_publishable_EbJEG5Y_81M3qM4isjXyaw_uUraIsAu'
)

const LANGUAGES = [
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
]

const UI_TEXT = {
  tr: {
    search: 'Ara', searching: 'Aranıyor...', placeholder: 'Konu, hastalık, molekül...',
    found: 'araştırma bulundu', translating: 'Başlıklar çevriliyor...', noResult: 'Sonuç bulunamadı',
    popular: 'Popüler aramalar', newest: 'En Yeni', oldest: 'En Eski',
    translateRead: 'Özeti Çevir ve Oku', read: 'Özeti Oku', close: 'Kapat', translatingBtn: 'Çevriliyor...',
    source: 'Kaynak', favorites: 'Favorilerim', profile: 'Profilim', logout: 'Çıkış Yap', login: 'Giriş Yap',
    subtitle: 'Bilimsel araştırmalar', hero: 'Bilimi Türkçe Keşfet',
    heroSub: 'Dünya genelindeki bilimsel araştırmaları arayın, yapay zeka ile özetlerini okuyun.',
    noAbstract: 'Özet mevcut değil.', trending: 'Bu Hafta Trend', readingList: 'Okuma Listem',
  },
  en: {
    search: 'Search', searching: 'Searching...', placeholder: 'Topic, disease, molecule...',
    found: 'research found', translating: 'Translating titles...', noResult: 'No results found',
    popular: 'Popular searches', newest: 'Newest', oldest: 'Oldest',
    translateRead: 'Translate & Read Abstract', read: 'Read Abstract', close: 'Close', translatingBtn: 'Translating...',
    source: 'Source', favorites: 'Favorites', profile: 'Profile', logout: 'Sign Out', login: 'Sign In',
    subtitle: 'Scientific research', hero: 'Discover Science',
    heroSub: 'Search scientific research worldwide, read summaries translated by AI.',
    noAbstract: 'No abstract available.', trending: 'Trending This Week', readingList: 'Reading List',
  },
  de: {
    search: 'Suchen', searching: 'Suche...', placeholder: 'Thema, Krankheit, Molekül...',
    found: 'Studien gefunden', translating: 'Titel werden übersetzt...', noResult: 'Keine Ergebnisse',
    popular: 'Beliebte Suchen', newest: 'Neueste', oldest: 'Älteste',
    translateRead: 'Zusammenfassung übersetzen', read: 'Zusammenfassung lesen', close: 'Schließen', translatingBtn: 'Übersetzen...',
    source: 'Quelle', favorites: 'Favoriten', profile: 'Profil', logout: 'Abmelden', login: 'Anmelden',
    subtitle: 'Wissenschaftliche Forschung', hero: 'Wissenschaft entdecken',
    heroSub: 'Wissenschaftliche Studien weltweit suchen.',
    noAbstract: 'Keine Zusammenfassung.', trending: 'Diese Woche Trending', readingList: 'Leseliste',
  },
  fr: {
    search: 'Rechercher', searching: 'Recherche...', placeholder: 'Sujet, maladie, molécule...',
    found: 'études trouvées', translating: 'Traduction...', noResult: 'Aucun résultat',
    popular: 'Recherches populaires', newest: 'Plus récent', oldest: 'Plus ancien',
    translateRead: 'Traduire et lire', read: 'Lire le résumé', close: 'Fermer', translatingBtn: 'Traduction...',
    source: 'Source', favorites: 'Favoris', profile: 'Profil', logout: 'Déconnexion', login: 'Connexion',
    subtitle: 'Recherche scientifique', hero: 'Découvrir la science',
    heroSub: 'Recherchez des études scientifiques mondiales.',
    noAbstract: 'Aucun résumé.', trending: 'Tendances', readingList: 'Liste de lecture',
  },
  es: {
    search: 'Buscar', searching: 'Buscando...', placeholder: 'Tema, enfermedad, molécula...',
    found: 'estudios encontrados', translating: 'Traduciendo...', noResult: 'Sin resultados',
    popular: 'Búsquedas populares', newest: 'Más reciente', oldest: 'Más antiguo',
    translateRead: 'Traducir y leer', read: 'Leer resumen', close: 'Cerrar', translatingBtn: 'Traduciendo...',
    source: 'Fuente', favorites: 'Favoritos', profile: 'Perfil', logout: 'Cerrar sesión', login: 'Iniciar sesión',
    subtitle: 'Investigación científica', hero: 'Descubrir la ciencia',
    heroSub: 'Busca estudios científicos mundiales.',
    noAbstract: 'No hay resumen.', trending: 'Tendencias', readingList: 'Lista de lectura',
  },
  ar: {
    search: 'بحث', searching: 'جاري البحث...', placeholder: 'موضوع، مرض، جزيء...',
    found: 'دراسة وجدت', translating: 'جاري الترجمة...', noResult: 'لا توجد نتائج',
    popular: 'البحث الشائع', newest: 'الأحدث', oldest: 'الأقدم',
    translateRead: 'ترجمة وقراءة', read: 'قراءة الملخص', close: 'إغلاق', translatingBtn: 'جاري الترجمة...',
    source: 'المصدر', favorites: 'المفضلة', profile: 'الملف', logout: 'خروج', login: 'دخول',
    subtitle: 'البحث العلمي', hero: 'اكتشف العلم',
    heroSub: 'ابحث في الدراسات العلمية العالمية.',
    noAbstract: 'لا يوجد ملخص.', trending: 'الأكثر رواجاً', readingList: 'قائمة القراءة',
  },
}

const CATEGORIES = [
  { id: 'all', icon: '🔬' },
  { id: 'medicine', icon: '🩺' },
  { id: 'biology', icon: '🧬' },
  { id: 'physics', icon: '⚛️' },
  { id: 'chemistry', icon: '🧪' },
  { id: 'psychology', icon: '🧠' },
  { id: 'environment', icon: '🌍' },
  { id: 'technology', icon: '💻' },
]

const CATEGORY_QUERIES = {
  medicine: 'clinical trial treatment',
  biology: 'molecular biology genetics',
  physics: 'quantum physics',
  chemistry: 'organic chemistry synthesis',
  psychology: 'cognitive psychology behavior',
  environment: 'climate change environment',
  technology: 'artificial intelligence machine learning',
}

const POPULAR_SEARCHES = {
  tr: ['kanser tedavisi', 'yapay zeka', 'alzheimer', 'covid-19', 'depresyon'],
  en: ['cancer treatment', 'artificial intelligence', 'alzheimer', 'covid-19', 'depression'],
  de: ['Krebsbehandlung', 'künstliche Intelligenz', 'Alzheimer', 'covid-19', 'Depression'],
  fr: ['traitement cancer', 'intelligence artificielle', 'alzheimer', 'covid-19', 'dépression'],
  es: ['tratamiento cáncer', 'inteligencia artificial', 'alzheimer', 'covid-19', 'depresión'],
  ar: ['علاج السرطان', 'الذكاء الاصطناعي', 'الزهايمر', 'كوفيد-19', 'الاكتئاب'],
}

const translateOne = async (text, targetLang = 'tr') => {
  if (!text) return null
  if (targetLang === 'en') return text
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
    const res = await fetch(url)
    const data = await res.json()
    return data[0]?.map(t => t[0]).filter(Boolean).join('') || null
  } catch (e) {
    return null
  }
}

const sortArticles = (articles, sortBy) => {
  const arr = [...articles]
  if (sortBy === 'newest') return arr.sort((a, b) => (parseInt(b.published_date) || 0) - (parseInt(a.published_date) || 0))
  if (sortBy === 'oldest') return arr.sort((a, b) => (parseInt(a.published_date) || 0) - (parseInt(b.published_date) || 0))
  return arr
}

const AbstractDisplay = ({ text, noAbstract }) => {
  if (!text) return <p className="text-sm text-white/40 italic">{noAbstract}</p>
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

export default function Home() {
  const [query, setQuery] = useState('')
  const [articles, setArticles] = useState([])
  const articlesRef = useRef([])
  const [loading, setLoading] = useState(false)
  const [translating, setTranslating] = useState({})
  const [activeCategory, setActiveCategory] = useState('all')
  const [searched, setSearched] = useState(false)
  const [expandedId, setExpandedId] = useState(null)
  const [autoTranslating, setAutoTranslating] = useState(false)
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [favorites, setFavorites] = useState({})
  const [favLoading, setFavLoading] = useState({})
  const [readingList, setReadingList] = useState({})
  const [readLoading, setReadLoading] = useState({})
  const [sortBy, setSortBy] = useState('newest')
  const [showSort, setShowSort] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [sharePopup, setSharePopup] = useState(null)
  const [copied, setCopied] = useState(false)
  const [lang, setLang] = useState('tr')
  const [showLang, setShowLang] = useState(false)
  const [trending, setTrending] = useState([])

  const t = UI_TEXT[lang]

  useEffect(() => {
    const saved = localStorage.getItem('bilimce_lang')
    if (saved) setLang(saved)
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null)
      if (data?.user) {
        loadFavorites(data.user.id)
        loadUsername(data.user.id)
        loadReadingList(data.user.id)
      }
    })
    fetch('/api/trending').then(r => r.json()).then(d => setTrending(d.trending || []))
  }, [])

  const changeLang = (code) => {
    setLang(code)
    localStorage.setItem('bilimce_lang', code)
    setShowLang(false)
    if (articlesRef.current.length > 0) retranslateArticles(code)
  }

  const retranslateArticles = async (targetLang) => {
    setAutoTranslating(true)
    const updated = [...articlesRef.current]
    for (let g = 0; g < updated.length; g += 5) {
      const group = updated.slice(g, g + 5)
      const translated = await Promise.all(group.map(a => translateOne(a.title_en, targetLang)))
      translated.forEach((title_tr, idx) => { if (title_tr) updated[g + idx] = { ...updated[g + idx], title_tr } })
      articlesRef.current = [...updated]
      setArticles([...updated])
      await new Promise(r => setTimeout(r, 200))
    }
    setAutoTranslating(false)
  }

  const loadUsername = async (userId) => {
    const { data } = await supabase.from('profiles').select('username').eq('id', userId).single()
    if (data?.username) setUsername(data.username)
  }

  const loadFavorites = async (userId) => {
    const { data } = await supabase.from('favorites').select('pubmed_id').eq('user_id', userId)
    if (data) {
      const favMap = {}
      data.forEach(f => { favMap[f.pubmed_id] = true })
      setFavorites(favMap)
    }
  }

  const loadReadingList = async (userId) => {
    const { data } = await supabase.from('reading_list').select('pubmed_id').eq('user_id', userId)
    if (data) {
      const map = {}
      data.forEach(r => { map[r.pubmed_id] = true })
      setReadingList(map)
    }
  }

  const saveSearchHistory = async (q) => {
    if (!user) return
    await supabase.from('search_history').insert({ user_id: user.id, query: q })
  }

  const toggleFavorite = async (article) => {
    if (!user) { window.location.href = '/auth'; return }
    const isFav = favorites[article.pubmed_id]
    setFavLoading(prev => ({ ...prev, [article.pubmed_id]: true }))
    try {
      if (isFav) {
        await supabase.from('favorites').delete().eq('user_id', user.id).eq('pubmed_id', article.pubmed_id)
        setFavorites(prev => { const n = { ...prev }; delete n[article.pubmed_id]; return n })
      } else {
        await supabase.from('favorites').insert({
          user_id: user.id, pubmed_id: article.pubmed_id, title_en: article.title_en,
          title_tr: article.title_tr, abstract_en: article.abstract_en, abstract_tr: article.abstract_tr,
          journal: article.journal, published_date: article.published_date, authors: article.authors,
        })
        setFavorites(prev => ({ ...prev, [article.pubmed_id]: true }))
      }
    } catch (err) { console.error(err) }
    finally { setFavLoading(prev => ({ ...prev, [article.pubmed_id]: false })) }
  }

  const toggleReadingList = async (article) => {
    if (!user) { window.location.href = '/auth'; return }
    const isIn = readingList[article.pubmed_id]
    setReadLoading(prev => ({ ...prev, [article.pubmed_id]: true }))
    try {
      if (isIn) {
        await supabase.from('reading_list').delete().eq('user_id', user.id).eq('pubmed_id', article.pubmed_id)
        setReadingList(prev => { const n = { ...prev }; delete n[article.pubmed_id]; return n })
      } else {
        await supabase.from('reading_list').insert({
          user_id: user.id, pubmed_id: article.pubmed_id, title_en: article.title_en,
          title_tr: article.title_tr, journal: article.journal,
          published_date: article.published_date, authors: article.authors,
        })
        setReadingList(prev => ({ ...prev, [article.pubmed_id]: true }))
      }
    } catch (err) { console.error(err) }
    finally { setReadLoading(prev => ({ ...prev, [article.pubmed_id]: false })) }
  }

  const shareArticle = (article) => setSharePopup(article)
  const copyLink = (article) => {
    navigator.clipboard.writeText(`https://pubmed.ncbi.nlm.nih.gov/${article.pubmed_id}/`)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }
  const shareWhatsApp = (article) => {
    const title = article.title_tr || article.title_en
    window.open(`https://wa.me/?text=${encodeURIComponent(`*${title}*\n\nhttps://pubmed.ncbi.nlm.nih.gov/${article.pubmed_id}/\n\n_BİLİMCE ile paylaşıldı_`)}`, '_blank')
  }

  const updateArticles = (arr) => { articlesRef.current = arr; setArticles([...arr]) }

  const handleSearch = useCallback(async (searchQuery) => {
    const q = searchQuery || query
    if (!q.trim()) return
    setLoading(true); setSearched(true); setExpandedId(null); updateArticles([])
    try {
      const results = await searchPubMed(q, 50)
      const sorted = sortArticles(results, sortBy)
      updateArticles(sorted); setLoading(false); saveSearchHistory(q); setAutoTranslating(true)
      const updated = [...sorted]
      for (let g = 0; g < updated.length; g += 5) {
        const group = updated.slice(g, g + 5)
        const translated = await Promise.all(group.map(a => translateOne(a.title_en, lang)))
        translated.forEach((title_tr, idx) => { if (title_tr) updated[g + idx] = { ...updated[g + idx], title_tr } })
        updateArticles([...updated])
        await new Promise(r => setTimeout(r, 200))
      }
      setAutoTranslating(false)
    } catch (err) {
      console.error(err); setLoading(false); setAutoTranslating(false)
    }
  }, [query, sortBy, lang])

  const handleSortChange = (newSort) => {
    setSortBy(newSort); setShowSort(false)
    updateArticles(sortArticles(articlesRef.current, newSort))
  }

  const handleCategoryClick = async (cat) => {
    setActiveCategory(cat.id)
    if (cat.id === 'all') { setQuery(''); updateArticles([]); setSearched(false); return }
    const q = CATEGORY_QUERIES[cat.id] || cat.id
    setQuery(q); await handleSearch(q)
  }

  const translateArticle = async (article, index) => {
    if (article.abstract_tr) { setExpandedId(expandedId === index ? null : index); return }
    setTranslating(prev => ({ ...prev, [index]: true }))
    try {
      const res = await fetch('/api/translate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: article.title_en, abstract: article.abstract_en }),
      })
      const data = await res.json()
      const updated = [...articlesRef.current]
      updated[index] = { ...updated[index], title_tr: data.title_tr, abstract_tr: data.abstract_tr }
      updateArticles(updated); setExpandedId(index)
    } catch (err) { console.error(err) }
    finally { setTranslating(prev => ({ ...prev, [index]: false })) }
  }

  const currentLang = LANGUAGES.find(l => l.code === lang)

  return (
    <div className="min-h-screen bg-[#0a0a0f]" onClick={() => { setShowMenu(false); setShowSort(false); setShowLang(false) }}>
      <header className="border-b border-white/5 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold">B</div>
            <span className="font-bold text-lg tracking-tight">BİLİMCE</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative" onClick={e => e.stopPropagation()}>
              <button onClick={() => setShowLang(!showLang)} className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white/60 hover:text-white transition">
                <span>{currentLang?.flag}</span><span className="hidden sm:block">{currentLang?.label}</span><span>▾</span>
              </button>
              {showLang && (
                <div className="absolute right-0 top-10 bg-[#1a1a2e] border border-white/10 rounded-xl overflow-hidden z-10 min-w-36">
                  {LANGUAGES.map(l => (
                    <button key={l.code} onClick={() => changeLang(l.code)} className={`w-full flex items-center gap-3 px-4 py-3 text-left text-xs hover:bg-white/5 transition ${lang === l.code ? 'text-blue-400' : 'text-white/60'}`}>
                      <span>{l.flag}</span><span>{l.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {user ? (
              <div className="relative" onClick={e => e.stopPropagation()}>
                <button onClick={() => setShowMenu(!showMenu)} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white/60 hover:text-white transition">
                  <span>👤</span><span>{username || user.email?.split('@')[0]}</span><span>▾</span>
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-10 bg-[#1a1a2e] border border-white/10 rounded-xl overflow-hidden z-10 min-w-40">
                    <a href="/profile" className="block px-4 py-3 text-xs text-white/60 hover:text-white hover:bg-white/5 transition">👤 {t.profile}</a>
                    <a href="/favorites" className="block px-4 py-3 text-xs text-white/60 hover:text-white hover:bg-white/5 transition">❤️ {t.favorites}</a>
                    <a href="/reading-list" className="block px-4 py-3 text-xs text-white/60 hover:text-white hover:bg-white/5 transition">🔖 {t.readingList}</a>
                    <button onClick={() => { supabase.auth.signOut(); setUser(null); setFavorites({}); setReadingList({}); setShowMenu(false) }} className="w-full text-left px-4 py-3 text-xs text-red-400/60 hover:text-red-400 hover:bg-white/5 transition">{t.logout}</button>
                  </div>
                )}
              </div>
            ) : (
              <a href="/auth" className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white/60 hover:text-white hover:border-white/20 transition">{t.login}</a>
            )}
          </div>
        </div>
      </header>

      {sharePopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4" onClick={() => setSharePopup(null)}>
          <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-white font-semibold mb-2 text-sm leading-snug">{sharePopup.title_tr || sharePopup.title_en}</h3>
            <p className="text-white/30 text-xs mb-6">{sharePopup.journal} · {sharePopup.published_date?.slice(0,4)}</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => copyLink(sharePopup)} className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white/70 hover:text-white transition">
                <span>🔗</span><span>{copied ? '✓ Kopyalandı!' : 'Linki Kopyala'}</span>
              </button>
              <button onClick={() => shareWhatsApp(sharePopup)} className="flex items-center gap-3 px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-xl text-sm text-green-400 hover:bg-green-500/20 transition">
                <span>💬</span><span>WhatsApp</span>
              </button>
              <button onClick={() => setSharePopup(null)} className="px-4 py-3 text-xs text-white/30 hover:text-white transition">Kapat</button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-4 py-12" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        {!searched && (
          <div className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl font-bold mb-4 leading-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">{t.hero}</h1>
            <p className="text-white/40 text-lg max-w-xl mx-auto leading-relaxed">{t.heroSub}</p>
          </div>
        )}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <div className="relative flex gap-3 bg-white/5 border border-white/10 rounded-2xl p-2">
              <input type="text" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} placeholder={t.placeholder} className="flex-1 bg-transparent px-4 py-3 text-white placeholder-white/25 outline-none text-sm" />
              <button onClick={() => handleSearch()} disabled={loading} className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-50 whitespace-nowrap">
                {loading ? t.searching : t.search}
              </button>
            </div>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => handleCategoryClick(cat)} className={`px-4 py-2 rounded-xl text-lg whitespace-nowrap transition-all ${activeCategory === cat.id ? 'bg-blue-500/20 border border-blue-500/40' : 'bg-white/5 border border-white/5 hover:bg-white/10'}`}>
              {cat.icon}
            </button>
          ))}
        </div>

        {!searched && trending.length > 0 && (
          <div className="mb-10">
            <p className="text-white/40 text-sm font-medium mb-4">🔥 {t.trending}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {trending.map((item, i) => (
                <button key={i} onClick={() => { setQuery(item.query || item.topic); handleSearch(item.query || item.topic) }} className="bg-white/3 border border-white/5 rounded-xl p-4 text-left hover:border-blue-500/20 hover:bg-white/5 transition-all group">
                  <p className="text-sm text-white font-semibold leading-snug mb-2 group-hover:text-blue-300 transition">{item.topic}</p>
                  <p className="text-xs text-blue-400/60">{item.count}+ makale bu hafta</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="grid gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white/3 border border-white/5 rounded-2xl p-6 animate-pulse">
                <div className="h-4 bg-white/10 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-white/5 rounded w-full"></div>
              </div>
            ))}
          </div>
        )}
        {!loading && articles.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-white/30 text-sm">{articles.length} {t.found}</p>
              <div className="flex items-center gap-3" onClick={e => e.stopPropagation()}>
                {autoTranslating && <p className="text-blue-400/60 text-xs animate-pulse">{t.translating}</p>}
                <div className="relative">
                  <button onClick={() => setShowSort(!showSort)} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white/60 hover:text-white transition">
                    <span>↕</span><span>{sortBy === 'newest' ? t.newest : t.oldest}</span>
                  </button>
                  {showSort && (
                    <div className="absolute right-0 top-10 bg-[#1a1a2e] border border-white/10 rounded-xl overflow-hidden z-10 min-w-36">
                      <button onClick={() => handleSortChange('newest')} className={`w-full px-4 py-3 text-left text-xs hover:bg-white/5 transition ${sortBy === 'newest' ? 'text-blue-400' : 'text-white/60'}`}>{t.newest}</button>
                      <button onClick={() => handleSortChange('oldest')} className={`w-full px-4 py-3 text-left text-xs hover:bg-white/5 transition ${sortBy === 'oldest' ? 'text-blue-400' : 'text-white/60'}`}>{t.oldest}</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="grid gap-4">
              {articles.map((article, i) => (
                <article key={article.pubmed_id || i} className="bg-white/3 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <a href={`/article/${article.pubmed_id}`} className="font-semibold text-white leading-snug mb-1 hover:text-blue-300 transition block">{article.title_tr || article.title_en}</a>
                      {article.title_tr && lang !== 'en' && <p className="text-white/35 text-sm leading-snug mt-1">{article.title_en}</p>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => toggleFavorite(article)} disabled={favLoading[article.pubmed_id]} className="text-lg hover:scale-110 transition-transform" title="Favorilere ekle">
                        {favorites[article.pubmed_id] ? '❤️' : '🤍'}
                      </button>
                      <button onClick={() => toggleReadingList(article)} disabled={readLoading[article.pubmed_id]} className="text-lg hover:scale-110 transition-transform" title="Okuma listesine ekle">
                        {readingList[article.pubmed_id] ? '🔖' : '📌'}
                      </button>
                      <button onClick={() => shareArticle(article)} className="text-lg hover:scale-110 transition-transform">📤</button>
                      <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded-lg">PUBMED</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-white/30 mb-4">
                    {article.journal && <span>{article.journal}</span>}
                    {article.published_date && <span>{article.published_date.slice(0,4)}</span>}
                    {article.authors && <span>{article.authors}</span>}
                  </div>
                  {expandedId === i && (
                    <div className="mb-4 p-4 bg-white/3 rounded-xl border border-white/5">
                      <AbstractDisplay text={article.abstract_tr || article.abstract_en} noAbstract={t.noAbstract} />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button onClick={() => translateArticle(article, i)} disabled={translating[i]} className="px-4 py-2 bg-blue-500/20 border border-blue-500/20 text-blue-300 rounded-xl text-xs font-medium hover:bg-blue-500/30 transition disabled:opacity-50">
                      {translating[i] ? t.translatingBtn : article.abstract_tr ? (expandedId === i ? t.close : t.read) : t.translateRead}
                    </button>
                    {article.pubmed_id && (
                      <a href={`https://pubmed.ncbi.nlm.nih.gov/${article.pubmed_id}/`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-white/5 border border-white/5 text-white/40 rounded-xl text-xs hover:text-white/70 transition">
                        {t.source}
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
        {!loading && searched && articles.length === 0 && (
          <div className="text-center py-20 text-white/30">
            <div className="text-5xl mb-4">🔭</div>
            <p>{t.noResult}</p>
          </div>
        )}
        {!searched && (
          <div className="mt-8 text-center">
            <p className="text-white/25 text-sm mb-4">{t.popular}</p>
            <div className="flex flex-wrap justify-center gap-2">
              {(POPULAR_SEARCHES[lang] || POPULAR_SEARCHES.tr).map(s => (
                <button key={s} onClick={() => { setQuery(s); handleSearch(s) }} className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-sm text-white/40 hover:text-white/70 transition">{s}</button>
              ))}
            </div>
          </div>
        )}
      </main>
      <footer className="border-t border-white/5 py-8 mt-20">
        <div className="max-w-5xl mx-auto px-4 text-center text-white/20 text-xs">
          BİLİMCE - PubMed - {t.subtitle}
        </div>
      </footer>
    </div>
  )
}
