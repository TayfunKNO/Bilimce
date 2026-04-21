'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://lypjtxqvusqndqawugxu.supabase.co',
  'sb_publishable_rqtzTjZBNww4u56gNNCI4A_OS_ID1Bo'
)

export default function PublicCollectionPage({ params }) {
  const [collection, setCollection] = useState(null)
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    loadCollection()
  }, [params.id])

  const loadCollection = async () => {
    const { data: col } = await supabase.from('collections').select('*').eq('id', params.id).eq('is_public', true).single()
    if (!col) { setLoading(false); return }
    setCollection(col)

    const { data: arts } = await supabase.from('collection_articles').select('*').eq('collection_id', params.id).order('created_at', { ascending: false })
    setArticles(arts || [])
    setLoading(false)
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="text-white/30">Yükleniyor...</div>
    </div>
  )

  if (!collection) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h1 className="text-xl font-bold text-white mb-2">Koleksiyon Bulunamadı</h1>
        <p className="text-white/40 text-sm mb-6">Bu koleksiyon mevcut değil veya herkese açık değil.</p>
        <a href="/" className="px-6 py-3 bg-blue-500/20 border border-blue-500/20 text-blue-300 rounded-xl text-sm hover:bg-blue-500/30 transition">Ana Sayfaya Dön</a>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-white/5 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="/" className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">B</a>
            <span className="font-bold text-base tracking-tight text-white">BİLİMCE</span>
          </div>
          <a href="/" className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white/60 hover:text-white transition">Ana Sayfa</a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-6 mb-8">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-xs">🌐 Herkese Açık Koleksiyon</span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">{collection.name}</h1>
              {collection.description && <p className="text-white/50 text-sm">{collection.description}</p>}
            </div>
            <button onClick={copyLink} className="px-4 py-2 bg-blue-500/20 border border-blue-500/20 text-blue-300 rounded-xl text-xs hover:bg-blue-500/30 transition whitespace-nowrap shrink-0">
              {copied ? '✓ Kopyalandı!' : '🔗 Paylaş'}
            </button>
          </div>
          <p className="text-xs text-white/30">{articles.length} makale</p>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-20 text-white/30">
            <div className="text-5xl mb-4">📄</div>
            <p>Bu koleksiyonda henüz makale yok</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {articles.map(article => (
              <a key={article.pubmed_id} href={`/article/${article.pubmed_id}`} className="bg-white/3 border border-white/5 rounded-2xl p-5 hover:border-blue-500/20 transition-all block">
                <p className="font-semibold text-white leading-snug mb-2 hover:text-blue-300 transition">
                  {article.title_tr || article.title_en}
                </p>
                <div className="flex flex-wrap gap-3 text-xs text-white/30 mb-3">
                  {article.journal && <span>{article.journal}</span>}
                  {article.published_date && <span>{article.published_date.slice(0,4)}</span>}
                  {article.authors && <span>{article.authors}</span>}
                </div>
                <span className="text-xs text-blue-400 hover:text-blue-300 transition">Makaleyi Oku →</span>
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
