'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xlnnopufkjaqxjsmhtot.supabase.co',
  'sb_publishable_EbJEG5Y_81M3qM4isjXyaw_uUraIsAu'
)

const GEMINI_KEY = 'AIzaSyCcGlFkV4ixx3xnWCRp3MaWJ4mo1s9ICU8'

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

const printArticle = (article, titleTr, abstractTr) => {
  const title = titleTr || article.title_en
  const abstract = abstractTr || article.abstract_en || 'Özet mevcut değil.'
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${title}</title>
<style>body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;padding:20px;color:#1a1a1a;line-height:1.6}.header{border-bottom:2px solid #3b82f6;padding-bottom:16px;margin-bottom:24px}.badge{background:#eff6ff;color:#1d4ed8;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:bold;display:inline-block;margin-bottom:12px}h1{font-size:20px;font-weight:bold;color:#111827;margin:0 0 12px;line-height:1.4}.meta{display:flex;flex-wrap:wrap;gap:8px;font-size:13px;color:#6b7280}.meta span{background:#f3f4f6;padding:3px 10px;border-radius:12px}.section{margin:24px 0}.section-title{font-size:11px;font-weight:bold;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px}.abstract-part{margin-bottom:12px;font-size:14px;color:#374151}.abstract-label{font-size:11px;font-weight:bold;color:#3b82f6;text-transform:uppercase;display:block;margin-bottom:4px}.footer{margin-top:32px;padding-top:16px;border-top:1px solid #e5e7eb;font-size:12px;color:#9ca3af;text-align:center}@media print{body{margin:20px}}</style>
</head><body>
<div class="header"><div class="badge">BİLİMCE</div><h1>${title}</h1>
<div class="meta">${article.journal ? `<span>📖 ${article.journal}</span>` : ''} ${article.published_date ? `<span>📅 ${article.published_date.slice(0,4)}</span>` : ''} ${article.authors ? `<span>👤 ${article.authors}</span>` : ''}<span>🔬 PubMed ID: ${article.pubmed_id}</span></div></div>
<div class="section"><div class="section-title">${titleTr ? 'Özet (Türkçe)' : 'Abstract'}</div>
${abstract.split('\n\n').map(s => { const c = s.indexOf(':'); if (c > 0 && c < 30) { return `<div class="abstract-part"><span class="abstract-label">${s.slice(0,c)}</span>${s.slice(c+1).trim()}</div>` } return `<div class="abstract-part">${s}</div>` }).join('')}
</div>
<div class="footer"><p>Kaynak: https://pubmed.ncbi.nlm.nih.gov/${article.pubmed_id}/</p><p>BİLİMCE - bilimce.vercel.app | ${new Date().toLocaleDateString('tr-TR')}</p></div>
</body></html>`
  const w = window.open('', '_blank')
  if (!w) { alert('Pop-up engelleyiciyi kapatın'); return }
  w.document.write(html); w.document.close(); w.focus()
  setTimeout(() => w.print(), 600)
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
  const [aiSummary, setAiSummary] = useState(null)
  const [translating, setTranslating] = useState(false)
  const [loadingAI, setLoadingAI] = useState(false)
  const [showTr, setShowTr] = useState(false)
  const [showAI, setShowAI] = useState(false)

  useEffect(() => {
    fetchArticle(pubmedId).then(a => {
      setArticle(a); setLoading(false)
      if (a?.searchTerms) fetchRelated(a.searchTerms, pubmedId).then(setRelated)
      if (a) {
        const schema = { '@context': 'https://schema.org', '@type': 'ScholarlyArticle', headline: a.title_en, description: a.abstract_en?.slice(0, 200), author: a.authors ? a.authors.split(', ').map(name => ({ '@type': 'Person', name })) : [], datePublished: a.published_date, isPartOf: { '@type': 'Periodical', name: a.journal }, url: `https://pubmed.ncbi.nlm.nih.gov/${pubmedId}/` }
        const script = document.createElement('script'); script.type = 'application/ld+json'; script.text = JSON.stringify(schema); document.head.appendChild(script)
      }
    })
    fetchCitationCount(pubmedId).then(setCitationCount)
    loadComments(); loadRatings()
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
    if (abstractTr) { setShowTr(!showTr); setShowAI(false); return }
    setTranslating(true)
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: article.title_en, abstract: article.abstract_en }),
      })
      const data = await res.json()
      setTitleTr(data.title_tr)
      setAbstractTr(data.abstract_tr)
      setShowTr(true)
      setShowAI(false)
    } catch (err) { console.error(err) }
    finally { setTranslating(false) }
  }

  const loadAISummary = async () => {
    if (aiSummary) { setShowAI(!showAI); if (!showAI) setShowTr(false); else setShowTr(true); return }
    setLoadingAI(true)
    setShowAI(true)
    setShowTr(false)
    try {
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Bilimsel makale özetini Türkçe olarak 3 bölümde özetle. Her bölüm 2-3 cümle olsun.\n\n🎯 ANA AMAÇ: [amaç]\n\n🔬 BULGULAR: [bulgular]\n\n✅ SONUÇ: [sonuç]\n\nÖzet:\n${article.abstract_en?.slice(0, 2000)}`
              }]
            }],
            generationConfig: { maxOutputTokens: 400, temperature: 0.1 }
          })
        }
      )
      const data = await geminiRes.json()
      const summary = data.candidates?.[0]?.content?.parts?.[0]?.text || null
      setAiSummary(summary || 'Özet oluşturulamadı.')
    } catch (err) {
      console.error(err)
      setAiSummary('Özet oluşturulamadı.')
    }
    finally { setLoadingAI(false) }
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

  if (loading) return <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center"><div className="text-white/30">Yükleniyor...</div></div>

  const abstract = article?.abstract_en || ''
  const displayAbstract = showTr && abstractTr ? abstractTr : abstract
  const sections = displayAbstract.split('\n\n').filter(Boolean)

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-white/5 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="/" className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">B</a>
            <span className="font-bold text-base tracking-tight text-white">BİLİMCE</span>
          </div>
          <button onClick={() => window.history.back()} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white/60 hover:text-white transition">← Geri Dön</button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        {!article ? (
          <div className="text-center py-20 text-white/30">
            <div className="text-5xl mb-4">🔭</div><p>Makale bulunamadı</p>
            <button onClick={() => window.history.back()} className="mt-4 inline-block px-6 py-3 bg-blue-500/20 border border-blue-500/20 text-blue-300 rounded-xl text-sm hover:bg-blue-500/30 transition">Geri Dön</button>
          </div>
        ) : (
          <>
            <article>
              <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-white leading-snug mb-2">{showTr && titleTr ? titleTr : article.title_en}</h1>
                {showTr && titleTr && <p className="text-white/40 text-sm mb-3">{article.title_en}</p>}
                <div className="flex flex-wrap gap-2 text-xs text-white/40 mb-4">
                  {article.journal && <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg">{article.journal}</span>}
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
                      📊 {citationCount} atıf
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
                <div className="bg-white/3 border border-white/5 rounded-2xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wide">
                      {showAI ? '🤖 AI Özeti' : showTr ? 'Özet (Türkçe)' : 'Abstract'}
                    </h2>
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={translateAbstract} disabled={translating} className="px-3 py-1.5 bg-blue-500/20 border border-blue-500/20 text-blue-300 rounded-xl text-xs font-medium hover:bg-blue-500/30 transition disabled:opacity-50">
                        {translating ? 'Çevriliyor...' : showTr ? 'İngilizce' : 'Türkçe'}
                      </button>
                      <button onClick={loadAISummary} disabled={loadingAI} className={`px-3 py-1.5 border rounded-xl text-xs font-medium transition disabled:opacity-50 ${showAI ? 'bg-purple-500/30 border-purple-500/50 text-purple-200' : 'bg-purple-500/20 border-purple-500/20 text-purple-300 hover:bg-purple-500/30'}`}>
                        {loadingAI ? '⏳ Yükleniyor...' : '🤖 AI Özet'}
                      </button>
                    </div>
                  </div>

                  {showAI ? (
                    <div className="flex flex-col gap-3">
                      {loadingAI ? (
                        <div className="flex items-center gap-3 py-4">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay:'0.15s'}}></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay:'0.3s'}}></div>
                          </div>
                          <span className="text-white/40 text-sm">AI özeti hazırlanıyor...</span>
                        </div>
                      ) : (
                        aiSummary?.split('\n').filter(Boolean).map((line, i) => (
                          <p key={i} className="text-sm text-white/80 leading-relaxed">{line}</p>
                        ))
                      )}
                    </div>
                  ) : (
                    sections.length > 1 ? (
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
                    )
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
                          <button onClick={handleRate} className="px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 rounded-xl text-xs font-medium hover:bg-yellow-500/30 transition">Onayla ✓</button>
                        )}
                        {ratingSuccess && <span className="text-green-400 text-xs">Puanlandı!</span>}
                        {totalRatings > 0 && <span className="text-xs text-white/40">Ortalama: <span className="text-yellow-400 font-semibold">{avgRating.toFixed(1)}</span> ({totalRatings} oy)</span>}
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

              <div className="flex flex-wrap gap-3 mb-12">
                <a href={`https://pubmed.ncbi.nlm.nih.gov/${pubmedId}/`} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-blue-500/20 border border-blue-500/20 text-blue-300 rounded-xl text-sm font-medium hover:bg-blue-500/30 transition">PubMed'de Görüntüle →</a>
                <button onClick={() => printArticle(article, titleTr, abstractTr)} className="px-5 py-2.5 bg-green-500/20 border border-green-500/20 text-green-300 rounded-xl text-sm font-medium hover:bg-green-500/30 transition">📄 PDF Kaydet</button>
                <button onClick={() => window.history.back()} className="px-5 py-2.5 bg-white/5 border border-white/10 text-white/60 rounded-xl text-sm hover:text-white transition">← Geri Dön</button>
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
