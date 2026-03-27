'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xlnnopufkjaqxjsmhtot.supabase.co',
  'sb_publishable_EbJEG5Y_81M3qM4isjXyaw_uUraIsAu'
)

const UI = {
  tr: { home: 'Ana Sayfa', title: '❤️ Favorilerim', empty: 'Henüz favori eklemediniz', browse: 'Araştırmalara Göz At', read: 'Özeti Oku', close: 'Kapat', source: 'Kaynak', noAbstract: 'Özet mevcut değil.' },
  en: { home: 'Home', title: '❤️ My Favorites', empty: 'No favorites yet', browse: 'Browse Research', read: 'Read Abstract', close: 'Close', source: 'Source', noAbstract: 'No abstract available.' },
  nl: { home: 'Startpagina', title: '❤️ Mijn Favorieten', empty: 'Nog geen favorieten', browse: 'Onderzoek bekijken', read: 'Samenvatting lezen', close: 'Sluiten', source: 'Bron', noAbstract: 'Geen samenvatting.' },
  de: { home: 'Startseite', title: '❤️ Meine Favoriten', empty: 'Noch keine Favoriten', browse: 'Forschung durchsuchen', read: 'Abstract lesen', close: 'Schließen', source: 'Quelle', noAbstract: 'Kein Abstract.' },
  fr: { home: 'Accueil', title: '❤️ Mes Favoris', empty: 'Pas encore de favoris', browse: 'Parcourir les recherches', read: 'Lire le résumé', close: 'Fermer', source: 'Source', noAbstract: 'Aucun résumé.' },
  es: { home: 'Inicio', title: '❤️ Mis Favoritos', empty: 'Sin favoritos aún', browse: 'Ver investigaciones', read: 'Leer resumen', close: 'Cerrar', source: 'Fuente', noAbstract: 'Sin resumen.' },
  ar: { home: 'الرئيسية', title: '❤️ المفضلة', empty: 'لا توجد مفضلة بعد', browse: 'تصفح الأبحاث', read: 'قراءة الملخص', close: 'إغلاق', source: 'المصدر', noAbstract: 'لا يوجد ملخص.' },
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [lang, setLang] = useState('tr')

  useEffect(() => {
    const savedLang = localStorage.getItem('bilimce_lang') || 'tr'
    setLang(savedLang)
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) { window.location.href = '/auth'; return }
      setUser(data.user)
      loadFavorites(data.user.id)
    })
  }, [])

  const t = UI[lang] || UI.tr

  const loadFavorites = async (userId) => {
    const { data } = await supabase.from('favorites').select('*').eq('user_id', userId).order('created_at', { ascending: false })
    setFavorites(data || [])
    setLoading(false)
  }

  const removeFavorite = async (pubmedId) => {
    await supabase.from('favorites').delete().eq('user_id', user.id).eq('pubmed_id', pubmedId)
    setFavorites(prev => prev.filter(f => f.pubmed_id !== pubmedId))
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-white/5 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="/" className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">B</a>
            <span className="font-bold text-base tracking-tight text-white">BİLİMCE</span>
          </div>
          <a href="/" className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white/60 hover:text-white transition">{t.home}</a>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-12">
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
        {!loading && favorites.length === 0 && (
          <div className="text-center py-20 text-white/30">
            <div className="text-5xl mb-4">🤍</div>
            <p className="mb-4">{t.empty}</p>
            <a href="/" className="inline-block px-6 py-3 bg-blue-500/20 border border-blue-500/20 text-blue-300 rounded-xl text-sm hover:bg-blue-500/30 transition">{t.browse}</a>
          </div>
        )}
        {!loading && favorites.length > 0 && (
          <div className="grid gap-4">
            {favorites.map((article, i) => (
              <article key={article.pubmed_id} className="bg-white/3 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <a href={`/article/${article.pubmed_id}`} className="font-semibold text-white leading-snug mb-1 hover:text-blue-300 transition block">{article.title_tr || article.title_en}</a>
                    {article.title_tr && <p className="text-white/35 text-sm leading-snug mt-1">{article.title_en}</p>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => removeFavorite(article.pubmed_id)} className="text-lg hover:scale-110 transition-transform">❤️</button>
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
                    <p className="text-sm text-white/80 leading-relaxed">{article.abstract_tr || article.abstract_en || t.noAbstract}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  {(article.abstract_tr || article.abstract_en) && (
                    <button onClick={() => setExpandedId(expandedId === i ? null : i)} className="px-4 py-2 bg-blue-500/20 border border-blue-500/20 text-blue-300 rounded-xl text-xs font-medium hover:bg-blue-500/30 transition">
                      {expandedId === i ? t.close : t.read}
                    </button>
                  )}
                  {article.pubmed_id && (
                    <a href={`https://pubmed.ncbi.nlm.nih.gov/${article.pubmed_id}/`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-white/5 border border-white/5 text-white/40 rounded-xl text-xs hover:text-white/70 transition">
                      🔬 {t.source}
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
