'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xlnnopufkjaqxjsmhtot.supabase.co',
  'sb_publishable_EbJEG5Y_81M3qM4isjXyaw_uUraIsAu'
)

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) {
        window.location.href = '/auth'
        return
      }
      setUser(data.user)
      loadFavorites(data.user.id)
    })
  }, [])

  const loadFavorites = async (userId) => {
    const { data } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    setFavorites(data || [])
    setLoading(false)
  }

  const removeFavorite = async (pubmedId) => {
    await supabase.from('favorites').delete().eq('user_id', user.id).eq('pubmed_id', pubmedId)
    setFavorites(prev => prev.filter(f => f.pubmed_id !== pubmedId))
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-white/5 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold">B</a>
            <span className="font-bold text-lg tracking-tight">BILIMCE</span>
          </div>
          <a href="/" className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white/60 hover:text-white transition">
            Ana Sayfa
          </a>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-white mb-8">❤️ Favorilerim</h1>
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
            <p>Henuz favori eklemediniz</p>
            <a href="/" className="mt-4 inline-block px-6 py-3 bg-blue-500/20 border border-blue-500/20 text-blue-300 rounded-xl text-sm hover:bg-blue-500/30 transition">
              Arastirmalara Goz At
            </a>
          </div>
        )}
        {!loading && favorites.length > 0 && (
          <div className="grid gap-4">
            {favorites.map((article, i) => (
              <article key={article.pubmed_id} className="bg-white/3 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all">
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
                    <button
                      onClick={() => removeFavorite(article.pubmed_id)}
                      className="text-lg hover:scale-110 transition-transform"
                      title="Favorilerden cikar"
                    >
                      ❤️
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
                      {article.abstract_tr || article.abstract_en || 'Ozet mevcut degil.'}
                    </p>
                  </div>
                )}
                <div className="flex gap-2">
                  {(article.abstract_tr || article.abstract_en) && (
                    <button
                      onClick={() => setExpandedId(expandedId === i ? null : i)}
                      className="px-4 py-2 bg-blue-500/20 border border-blue-500/20 text-blue-300 rounded-xl text-xs font-medium hover:bg-blue-500/30 transition"
                    >
                      {expandedId === i ? 'Kapat' : 'Ozeti Oku'}
                    </button>
                  )}
                  {article.pubmed_id && (
                    <a href={'https://pubmed.ncbi.nlm.nih.gov/' + article.pubmed_id + '/'} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-white/5 border border-white/5 text-white/40 rounded-xl text-xs hover:text-white/70 transition">
                      Kaynak
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
