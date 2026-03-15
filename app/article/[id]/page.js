'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xlnnopufkjaqxjsmhtot.supabase.co',
  'sb_publishable_EbJEG5Y_81M3qM4isjXyaw_uUraIsAu'
)

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
    const lastNames = xml.match(/<LastName>([\s\S]*?)<\/LastName>/g)?.slice(0, 5).map(n => n.replace(/<[^>]+>/g, '')) || []
    const meshTerms = xml.match(/<DescriptorName[^>]*>([\s\S]*?)<\/DescriptorName>/g)?.slice(0, 3).map(n => n.replace(/<[^>]+>/g, '')) || []
    const keywords = xml.match(/<Keyword[^>]*>([\s\S]*?)<\/Keyword>/g)?.slice(0, 3).map(n => n.replace(/<[^>]+>/g, '')) || []
    const allKeywords = [...new Set([...meshTerms, ...keywords])].slice(0, 3)
    const searchTerms = allKeywords.length > 0 ? allKeywords : title.split(' ').slice(0, 3).join(' ')
    return { pubmed_id: pubmedId, title_en: title, abstract_en: abstract, journal, published_date: year, authors: lastNames.join(', '), keywords: allKeywords, searchTerms }
  } catch {
    return null
  }
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
      const title = article.match(/<ArticleTitle[^>]*>([\s\S]*?)<\/ArticleTitle>/)?.[1]?.replace(/<[^>]+>/g, '') || ''
      const journal = article.match(/<Title>([\s\S]*?)<\/Title>/)?.[1] || ''
      const year = article.match(/<PubDate>[\s\S]*?<Year>(\d+)<\/Year>/)?.[1] || ''
      if (pubmedId && title) articles.push({ pubmed_id: pubmedId, title_en: title, journal, published_date: year })
    }
    return articles
  } catch {
    return []
  }
}

export default function ArticlePage({ params }) {
  const pubmedId = params.id
  const [article, setArticle] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
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

  useEffect(() => {
    fetchArticle(pubmedId).then(a => {
      setArticle(a)
      setLoading(false)
      if (a?.searchTerms) fetchRelated(a.searchTerms, pubmedId).then(setRelated)
    })
    loadComments()
    loadRatings()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null)
      if (data?.user) { loadUsername(data.user.id); loadUserRating(data.user.id) }
    })
  }, [pubmedId])

  const loadUsername = async (userId) => {
    const { data } = await supabase.from('profiles').select('username').eq('id', userId).single()
    if (data?.username) setUsername(data.username)
  }

  const loadRatings = async () => {
    const { data } = await supabase.from('ratings').select('rating').eq('pubmed_id', pubmedId)
    if (data && data.length > 0) {
      const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length
      setAvgRating(avg); setTotalRatings(data.length)
    }
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

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="text-white/30">Yükleniyor...</div>
    </div>
  )

  const abstract = article?.abstract_en || ''
  const sections = abstract.split('\n\n').filter(Boolean)

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-white/5 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">B</a>
            <span className="font-bold text-lg tracking-tight text-white">BİLİMCE</span>
          </div>
          <button onClick={() => window.history.back()} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white/60 hover:text-white transition">
            ← Geri Dön
          </button>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-12">
        {!article ? (
          <div className="text-center py-20 text-white/30">
            <div className="text-5xl mb-4">🔭</div>
            <p>Makale bulunamadı</p>
            <button onClick={() => window.history.back()} className="mt-4 inline-block px-6 py-3 bg-blue-500/20 border border-blue-500/20 text-blue-300 rounded-xl text-sm hover:bg-blue-500/30 transition">Geri Dön</button>
          </div>
        ) : (
          <>
            <article>
              <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-white leading-snug mb-3">{article.title_en}</h1>
                <div className="flex flex-wrap gap-3 text-xs text-white/40 mb-4">
                  {article.journal && <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg">{article.journal}</span>}
                  {article.published_date && <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg">{article.published_date.slice(0,4)}</span>}
                  {article.authors && <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg">{article.authors}</span>}
                  <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg">PubMed ID: {pubmedId}</span>
                </div>
                {article.keywords?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {article.keywords.map((k, i) => (
                      <span key={i} className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-lg text-xs">{k}</span>
                    ))}
                  </div>
                )}
              </div>

              {abstract ? (
                <div className="bg-white/3 border border-white/5 rounded-2xl p-6 mb-6">
                  <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wide mb-4">Abstract</h2>
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
                    <p className="text-sm text-white/80 leading-relaxed">{abstract}</p>
                  )}

                  <div className="mt-6 pt-4 border-t border-white/5">
                    <p className="text-xs text-white/40 mb-3">Bu araştırmayı puanlayın</p>
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
                          <button onClick={handleRate} className="px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 rounded-xl text-xs font-medium hover:bg-yellow-500/30 transition cursor-pointer">
                            Onayla ✓
                          </button>
                        )}
                        {ratingSuccess && <span className="text-green-400 text-xs">Puanlandı!</span>}
                        {totalRatings > 0 && (
                          <span className="text-xs text-white/40">
                            Ortalama: <span className="text-yellow-400 font-semibold">{avgRating.toFixed(1)}</span> ({totalRatings} oy)
                          </span>
                        )}
                      </div>
                    ) : (
                      <a href="/auth" className="text-xs text-blue-400 hover:text-blue-300 transition">Puan vermek için giriş yapın →</a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white/3 border border-white/5 rounded-2xl p-6 mb-6">
                  <p className="text-white/40 text-sm">Özet mevcut değil.</p>
                </div>
              )}

              <div className="flex gap-3 mb-12">
                <a href={`https://pubmed.ncbi.nlm.nih.gov/${pubmedId}/`} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-blue-500/20 border border-blue-500/20 text-blue-300 rounded-xl text-sm font-medium hover:bg-blue-500/30 transition">
                  PubMed'de Görüntüle →
                </a>
                <button onClick={() => window.history.back()} className="px-6 py-3 bg-white/5 border border-white/10 text-white/60 rounded-xl text-sm hover:text-white transition">
                  ← Geri Dön
                </button>
              </div>
            </article>

            {related.length > 0 && (
              <div className="border-t border-white/5 pt-8 mb-8">
                <h2 className="text-lg font-semibold text-white mb-4">🔗 İlgili Makaleler</h2>
                <div className="grid gap-3">
                  {related.map(r => (
                    <a key={r.pubmed_id} href={`/article/${r.pubmed_id}`} className="bg-white/3 border border-white/5 rounded-xl p-4 hover:border-white/15 transition-all block">
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

            <div className="border-t border-white/5 pt-8">
              <h2 className="text-lg font-semibold text-white mb-6">💬 Yorumlar ({comments.length})</h2>
              {user ? (
                <div className="mb-6">
                  <textarea value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Bu araştırma hakkında görüşünüzü paylaşın..." rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 outline-none text-sm focus:border-blue-500/50 resize-none mb-3" />
                  <button onClick={submitComment} disabled={submitting || !newComment.trim()} className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-50">
                    {submitting ? 'Gönderiliyor...' : 'Yorum Yap'}
                  </button>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-white/3 border border-white/5 rounded-xl text-center">
                  <p className="text-white/40 text-sm mb-3">Yorum yapmak için giriş yapın</p>
                  <a href="/auth" className="px-6 py-2 bg-blue-500/20 border border-blue-500/20 text-blue-300 rounded-xl text-sm hover:bg-blue-500/30 transition">Giriş Yap</a>
                </div>
              )}
              {comments.length === 0 ? (
                <p className="text-white/30 text-sm">Henüz yorum yok. İlk yorumu siz yapın!</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {comments.map(comment => (
                    <div key={comment.id} className="bg-white/3 border border-white/5 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-blue-400 text-xs font-semibold">👤 {comment.username}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-white/25 text-xs">{new Date(comment.created_at).toLocaleDateString('tr-TR')}</span>
                          {user && user.id === comment.user_id && (
                            <button onClick={() => deleteComment(comment.id)} className="text-white/25 hover:text-red-400 transition text-xs">✕</button>
                          )}
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
