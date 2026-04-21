'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://lypjtxqvusqndqawugxu.supabase.co',
  'sb_publishable_rqtzTjZBNww4u56gNNCI4A_OS_ID1Bo'
)

const UI = {
  tr: { home: 'Ana Sayfa', title: '🔖 Okuma Listem', empty: 'Okuma listesi boş', browse: 'Araştırmalara Göz At', read: 'Makaleyi Oku', source: 'Kaynak' },
  en: { home: 'Home', title: '🔖 Reading List', empty: 'Reading list is empty', browse: 'Browse Research', read: 'Read Article', source: 'Source' },
  nl: { home: 'Startpagina', title: '🔖 Leeslijst', empty: 'Leeslijst is leeg', browse: 'Onderzoek bekijken', read: 'Artikel lezen', source: 'Bron' },
  de: { home: 'Startseite', title: '🔖 Leseliste', empty: 'Leseliste ist leer', browse: 'Forschung durchsuchen', read: 'Artikel lesen', source: 'Quelle' },
  fr: { home: 'Accueil', title: '🔖 Liste de lecture', empty: 'Liste de lecture vide', browse: 'Parcourir les recherches', read: 'Lire l\'article', source: 'Source' },
  es: { home: 'Inicio', title: '🔖 Lista de lectura', empty: 'Lista de lectura vacía', browse: 'Ver investigaciones', read: 'Leer artículo', source: 'Fuente' },
  ar: { home: 'الرئيسية', title: '🔖 قائمة القراءة', empty: 'قائمة القراءة فارغة', browse: 'تصفح الأبحاث', read: 'قراءة المقال', source: 'المصدر' },
}

export default function ReadingListPage() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [lang, setLang] = useState('tr')

  useEffect(() => {
    const savedLang = localStorage.getItem('bilimce_lang') || 'tr'
    setLang(savedLang)
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) { window.location.href = '/auth'; return }
      setUser(data.user)
      loadReadingList(data.user.id)
    })
  }, [])

  const t = UI[lang] || UI.tr

  const loadReadingList = async (userId) => {
    const { data } = await supabase.from('reading_list').select('*').eq('user_id', userId).order('created_at', { ascending: false })
    setArticles(data || [])
    setLoading(false)
  }

  const removeFromList = async (pubmedId) => {
    await supabase.from('reading_list').delete().eq('user_id', user.id).eq('pubmed_id', pubmedId)
    setArticles(prev => prev.filter(a => a.pubmed_id !== pubmedId))
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-white/5 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="/" className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">B</a>
            <span className="font-bold text-base tracking-tight text-white">BİLİMCE</span>
          </div>
          <a href="/" className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white/60 hover:text-white transition">{t.home}</a>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-white mb-8">{t.title}</h1>
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
        {!loading && articles.length === 0 && (
          <div className="text-center py-20 text-white/30">
            <div className="text-5xl mb-4">🔖</div>
            <p className="mb-4">{t.empty}</p>
            <a href="/" className="inline-block px-6 py-3 bg-blue-500/20 border border-blue-500/20 text-blue-300 rounded-xl text-sm hover:bg-blue-500/30 transition">{t.browse}</a>
          </div>
        )}
        {!loading && articles.length > 0 && (
          <div className="grid gap-4">
            {articles.map((article) => (
              <article key={article.pubmed_id} className="bg-white/3 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <a href={`/article/${article.pubmed_id}`} className="font-semibold text-white leading-snug mb-1 hover:text-blue-300 transition block">
                      {article.title_tr || article.title_en}
                    </a>
                    {article.title_tr && <p className="text-white/35 text-sm leading-snug mt-1">{article.title_en}</p>}
                  </div>
                  <button onClick={() => removeFromList(article.pubmed_id)} className="text-white/25 hover:text-red-400 transition text-xs shrink-0 mt-1">✕</button>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-white/30 mb-4">
                  {article.journal && <span>{article.journal}</span>}
                  {article.published_date && <span>{article.published_date.slice(0,4)}</span>}
                  {article.authors && <span>{article.authors}</span>}
                </div>
                <div className="flex gap-2">
                  <a href={`/article/${article.pubmed_id}`} className="px-4 py-2 bg-blue-500/20 border border-blue-500/20 text-blue-300 rounded-xl text-xs font-medium hover:bg-blue-500/30 transition">{t.read}</a>
                  <a href={`https://pubmed.ncbi.nlm.nih.gov/${article.pubmed_id}/`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-white/5 border border-white/5 text-white/40 rounded-xl text-xs hover:text-white/70 transition">🔬 {t.source}</a>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
