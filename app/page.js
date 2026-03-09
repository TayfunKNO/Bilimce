'use client'
import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { searchPubMed } from '../lib/pubmed'

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

const translateText = async (text, langpair = 'en|tr') => {
  if (!text) return null
  try {
    const encoded = encodeURIComponent(text.slice(0, 490))
    const res = await fetch(`https://api.mymemory.translated.net/get?q=${encoded}&langpair=${langpair}`)
    const data = await res.json()
    return data.responseData?.translatedText || null
  } catch {
    return null
  }
}

const autoTranslateArticles = async (articles) => {
  return Promise.all(articles.map(async (article) => {
    if (article.title_tr) return article
    const title_tr = await translateText(article.title_en)
    return { ...article, title_tr }
  }))
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [translating, setTranslating] = useState({})
  const [activeCategory, setActiveCategory] = useState('all')
  const [searched, setSearched] = useState(false)
  const [expandedId, setExpandedId] = useState(null)
  const [autoTranslating, setAutoTranslating] = useState(false)

  const handleSearch = useCallback(async (searchQuery) => {
    const q = searchQuery || query
    if (!q.trim()) return
    setLoading(true)
    setSearched(true)
    setArticles([])
    try {
      const { data: cached } = await supabase
        .from('articles')
        .select('*')
        .ilike('title_en', '%' + q + '%')
        .limit(50)
      
      let results = []
      if (cached && cached.length > 0) {
        results = cached
      } else {
        results = await searchPubMed(q, 50)
        if (results.length > 0) {
          for (const article of results) {
            if (article.pubmed_id) {
              await supabase.from('articles').upsert(article, {
                onConflict: 'pubmed_id',
                ignoreDuplicates: true,
              })
            }
          }
        }
        await supabase.from('search_logs').insert({ query: q, result_count: results.length })
      }

      setArticles(results)
      setLoading(false)
      
      setAutoTranslating(true)
      const translated = await autoTranslateArticles(results)
      setArticles(translated)
      setAutoTranslating(false)

    } catch (err) {
      console.error('Arama hatasi:', err)
    } finally {
      setLoading(false)
      setAutoTranslating(false)
    }
  }, [query])

  const handleCategoryClick = async (cat) => {
    setActiveCategory(cat.id)
    if (cat.id === 'all') {
      setQuery('')
      setArticles([])
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
      const updated = [...articles]
      updated[index] = { ...updated[index], title_tr: data.title_tr, abstract_tr: data.abstract_tr }
      setArticles(updated)
      setExpandedId(index)
      if (article.pubmed_id) {
        await supabase.from('articles')
          .update({ title_tr: data.title_tr, abstract_tr: data.abstract_tr })
          .eq('pubmed_id', article.pubmed_id)
      }
    } catch (err) {
      console.error('Ceviri hatasi:', err)
    } finally {
      setTranslating(prev => ({ ...prev, [index]: false }))
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-white/5 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold">B</div>
            <span className="font-bold text-lg tracking-tight">BILIMCE</span>
          </div>
          <span className="text-xs text-white/30 hidden sm:block">Bilimsel arastirmalar Turkce</span>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-12">
        {!searched && (
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl font-bold mb-4 leading-tight">
              Bilimi{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Turkce</span>{' '}
              kesfet
            </h1>
            <p className="text-white/40 text-lg max-w-xl mx-auto leading-relaxed">
              Dunya genelindeki bilimsel arastirmalari arayin, yapay zeka ile Turkce ozetlerini okuyun.
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
                placeholder="Konu, hastalik, molekul..."
                className="flex-1 bg-transparent px-4 py-3 text-white placeholder-white/25 outline-none text-sm"
              />
              <button
                onClick={() => handleSearch()}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-50 whitespace-nowrap"
              >
                {loading ? 'Araniyor...' : 'Ara'}
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
              <p className="text-white/30 text-sm">{articles.length} arastirma bulundu</p>
              {autoTranslating && <p className="text-blue-400/60 text-xs">Basliklar cevrilior...</p>}
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
                    <span className="shrink-0 text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded-lg">PUBMED</span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-white/30 mb-4">
                    {article.journal && <span>{article.journal}</span>}
                    {article.published_date && <span>{article.published_date.slice(0,4)}</span>}
                  </div>
                  {expandedId === i && (
                    <div className="mb-4 p-4 bg-white/3 rounded-xl border border-white/5">
                      <p className="text-sm text-white/80 leading-relaxed">
                        {article.abstract_tr || article.abstract_en || 'Ozet mevcut degil.'}
                      </p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => translateArticle(article, i)}
                      disabled={translating[i]}
                      className="px-4 py-2 bg-blue-500/20 border border-blue-500/20 text-blue-300 rounded-xl text-xs font-medium hover:bg-blue-500/30 transition disabled:opacity-50"
                    >
                      {translating[i] ? 'Cevrilior...' : article.abstract_tr ? (expandedId === i ? 'Kapat' : 'Ozeti Oku') : 'Ozeti Cevir ve Oku'}
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
            <p>Sonuc bulunamadi</p>
          </div>
        )}
        {!searched && (
          <div className="mt-8 text-center">
            <p className="text-white/25 text-sm mb-4">Populer aramalar</p>
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
          BILIMCE - PubMed verileri - Turk arastirmacilar icin
        </div>
      </footer>
    </div>
  )
}
