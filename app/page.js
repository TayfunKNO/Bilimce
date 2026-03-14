'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { searchPubMed } from '../lib/pubmed'

const supabase = createClient(
  'https://xlnnopufkjaqxjsmhtot.supabase.co',
  'sb_publishable_EbJEG5Y_81M3qM4isjXyaw_uUraIsAu'
)

const CATEGORIES = [
  { id: 'all', label: 'Tumu', icon: '🔬' },
  { id: 'medicine', label: 'Tip', icon: '🩺' },
  { id: 'biology', label: 'Biyoloji', icon: '🧬' },
  { id: 'physics', label: 'Fizik', icon: '⚛️' },
  { id: 'chemistry', label: 'Kimya', icon: '🧪' },
  { id: 'psychology', label: 'Psikoloji', icon: '🧠' },
  { id: 'environment', label: 'Cevre', icon: '🌍' },
  { id: 'technology', label: 'Teknoloji', icon: '💻' },
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

const translateOne = async (text) => {
  if (!text) return null
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=tr&dt=t&q=${encodeURIComponent(text)}`
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
  const [sortBy, setSortBy] = useState('newest')
  const [showSort, setShowSort] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null)
      if (data?.user) {
        loadFavorites(data.user.id)
        loadUsername(data.user.id)
      }
    })
  }, [])

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
          user_id: user.id,
          pubmed_id: article.pubmed_id,
          title_en: article.title_en,
          title_tr: article.title_tr,
          abstract_en: article.abstract_en,
          abstract_tr: article.abstract_tr,
          journal: article.journal,
          published_date: article.published_date,
          authors: article.authors,
        })
        setFavorites(prev => ({ ...prev, [article.pubmed_id]: true }))
      }
    } catch (err) {
      console.error('Favori hatasi:', err)
    } finally {
      setFavLoading(prev => ({ ...prev, [article.pubmed_id]: false }))
    }
  }

  const updateArticles = (arr) => {
    articlesRef.current = arr
    setArticles([...arr])
  }

  const handleSearch = useCallback(async (searchQuery) => {
    const q = searchQuery || query
    if (!q.trim()) return
    setLoading(true)
    setSearched(true)
    setExpandedId(null)
    updateArticles([])
    try {
      const results = await searchPubMed(q, 50)
      const sorted = sortArticles(results, sortBy)
      updateArticles(sorted)
      setLoading(false)
      saveSearchHistory(q)
      setAutoTranslating(true)

      const updated = [...sorted]
      for (let g = 0; g < updated.length; g += 5) {
        const group = updated.slice(g, g + 5)
        const translated = await Promise.all(group.map(a => translateOne(a.title_en)))
        translated.forEach((title_tr, idx) => {
          if (title_tr) updated[g + idx] = { ...updated[g + idx], title_tr }
        })
        updateArticles([...updated])
        await new Promise(r => setTimeout(r, 200))
      }
      setAutoTranslating(false)
    } catch (err) {
      console.error('Arama hatasi:', err)
      setLoading(false)
      setAutoTranslating(false)
    }
  }, [query, sortBy])

  const handleSortChange = (newSort) => {
    setSortBy(newSort)
    setShowSort(false)
    const sorted = sortArticles(articlesRef.current, newSort)
    updateArticles(sorted)
  }

  const handleCategoryClick = async (cat) => {
    setActiveCategory(cat.id)
    if (cat.id === 'all') {
      setQuery('')
      updateArticles([])
      setSearched(false)
      return
    }
    const q = CATEGORY_QUERIES[cat.id] || cat.label
    setQuery(q)
    await handleSearch(q)
  }

  const translateArticle = async (article, index) => {
    if (article.abstract_tr) {
      setExpandedId(expandedId === index ? null : index)
      return
    }
    setTranslating(prev => ({ ...prev, [index]: true }))
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: article.title_en, abstract: article.abstract_en }),
      })
      const data = await res.json()
      const updated = [...articlesRef.current]
      updated[index] = { ...updated[index], title_tr: data.title_tr, abstract_tr: data.abstract_tr }
      updateArticles(updated)
      setExpandedId(index)
    } catch (err) {
      console.error('Ceviri hatasi:', err)
    } finally {
      setTranslating(prev => ({ ...prev, [index]: false }))
    }
  }

  const sortLabels = { newest: 'En Yeni', oldest: 'En Eski' }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-white/5 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold">B</div>
            <span className="font-bold text-lg tracking-tight">BİLİMCE</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/30 hidden sm:block">Bilimsel araştırmalar Türkçe</span>
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white/60 hover:text-white transition"
                >
                  <span>👤</span>
                  <span>{username || user.email?.split('@')[0]}</span>
                  <span>▾</span>
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-10 bg-[#1a1a2e] border border-white/10 rounded-xl overflow-hidden z-10 min-w-40">
                    <a href="/profile" className="block px-4 py-3 text-xs text-white/60 hover:text-white hover:bg-white/5 transition">👤 Profilim</a>
                    <a href="/favorites" className="block px-4 py-3 text-xs text-white/60 hover:text-white hover:bg-white/5 transition">❤️ Favorilerim</a>
                    <button onClick={() => { supabase.auth.signOut(); setUser(null); setFavorites({}); setShowMenu(false) }} className="w-full text-left px-4 py-3 text-xs text-red-400/60 hover:text-red-400 hover:bg-white/5 transition">Çıkış Yap</button>
                  </div>
                )}
              </div>
            ) : (
              <a href="/auth" className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white/60 hover:text-white hover:border-white/20 transition">Giriş Yap</a>
            )}
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-12">
        {!searched && (
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl font-bold mb-4 leading-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Bilimi Türkçe Keşfet
            </h1>
            <p className="text-white/40 text-lg max-w-xl mx-auto leading-relaxed">
              Dünya genelindeki bilimsel araştırmaları arayın, yapay zeka ile Türkçe özetlerini okuyun.
            </p>
          </div>
        )}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <div className="relative flex gap-3 bg-white/5 border border-white/10 rounded-2xl p-2">
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Konu, hastalık, molekül..."
                className="flex-1 bg-transparent px-4 py-3 text-white placeholder-white/25 outline-none text-sm"
              />
              <button
                onClick={() => handleSearch()}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-50 whitespace-nowrap"
              >
                {loading ? 'Aranıyor...' : 'Ara'}
              </button>
            </div>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all ${activeCategory === cat.id ? 'bg-blue-500/20 border border-blue-500/40 text-blue-300' : 'bg-white/5 border border-white/5 text-white/50 hover:text-white/80'}`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
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
              <p className="text-white/30 text-sm">{articles.length} araştırma bulundu</p>
              <div className="flex items-center gap-3">
                {autoTranslating && <p className="text-blue-400/60 text-xs animate-pulse">Başlıklar çevriliyor...</p>}
                <div className="relative">
                  <button
                    onClick={() => setShowSort(!showSort)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white/60 hover:text-white transition"
                  >
                    <span>↕</span>
                    <span>{sortLabels[sortBy]}</span>
                  </button>
                  {showSort && (
                    <div className="absolute right-0 top-10 bg-[#1a1a2e] border border-white/10 rounded-xl overflow-hidden z-10 min-w-36">
                      {Object.entries(sortLabels).map(([key, label]) => (
                        <button
                          key={key}
                          onClick={() => handleSortChange(key)}
                          className={`w-full px-4 py-3 text-left text-xs hover:bg-white/5 transition ${sortBy === key ? 'text-blue-400' : 'text-white/60'}`}
                        >
                          {label}
                        </button>
                      ))}
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
                      <h2 className="font-semibold text-white leading-snug mb-1">
                        {article.title_tr || article.title_en}
                      </h2>
                      {article.title_tr && (
                        <p className="text-white/35 text-sm leading-snug">{article.title_en}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => toggleFavorite(article)} disabled={favLoading[article.pubmed_id]} className="text-lg hover:scale-110 transition-transform">
                        {favorites[article.pubmed_id] ? '❤️' : '🤍'}
                      </button>
                      <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded-lg">PUBMED</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-white/30 mb-4">
                    {article.journal && <span>{article.journal}</span>}
                    {article.published_date && <span>{article.published_date.slice(0,4)}</span>}
                  </div>
                  {expandedId === i && (
                    <div className="mb-4 p-4 bg-white/3 rounded-xl border border-white/5">
                      <p className="text-sm text-white/80 leading-relaxed">
                        {article.abstract_tr || article.abstract_en || 'Özet mevcut değil.'}
                      </p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => translateArticle(article, i)}
                      disabled={translating[i]}
                      className="px-4 py-2 bg-blue-500/20 border border-blue-500/20 text-blue-300 rounded-xl text-xs font-medium hover:bg-blue-500/30 transition disabled:opacity-50"
                    >
                      {translating[i] ? 'Çevriliyor...' : article.abstract_tr ? (expandedId === i ? 'Kapat' : 'Özeti Oku') : 'Özeti Çevir ve Oku'}
                    </button>
                    {article.pubmed_id && (
                      <a href={'https://pubmed.ncbi.nlm.nih.gov/' + article.pubmed_id + '/'} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-white/5 border border-white/5 text-white/40 rounded-xl text-xs hover:text-white/70 transition">
                        Kaynak
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
            <p>Sonuç bulunamadı</p>
          </div>
        )}
        {!searched && (
          <div className="mt-8 text-center">
            <p className="text-white/25 text-sm mb-4">Popüler aramalar</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['kanser tedavisi','yapay zeka','alzheimer','covid-19','depresyon'].map(s => (
                <button key={s} onClick={() => { setQuery(s); handleSearch(s) }} className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-sm text-white/40 hover:text-white/70 transition">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
      <footer className="border-t border-white/5 py-8 mt-20">
        <div className="max-w-5xl mx-auto px-4 text-center text-white/20 text-xs">
          BİLİMCE - PubMed verileri - Türk araştırmacılar için
        </div>
      </footer>
    </div>
  )
}
