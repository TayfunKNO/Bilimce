'use client'
import { useState, useEffect } from 'react'

const translateOne = async (text) => {
  if (!text) return null
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=tr&dt=t&q=${encodeURIComponent(text)}`
    const res = await fetch(url)
    const data = await res.json()
    return data[0]?.map(t => t[0]).filter(Boolean).join('') || null
  } catch { return null }
}

export default function JournalPage({ params }) {
  const journalName = decodeURIComponent(params.name)
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [autoTranslating, setAutoTranslating] = useState(false)
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    document.title = `${journalName} - Bilimsel Makaleler | BİLİMCE`
    fetchJournalArticles(journalName)
  }, [journalName])

  const fetchJournalArticles = async (name) => {
    try {
      const searchRes = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(name)}[Journal]&retmax=50&retmode=json&sort=date`)
      const searchData = await searchRes.json()
      const ids = searchData.esearchresult?.idlist || []
      if (ids.length === 0) { setLoading(false); return }

      const fetchRes = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${ids.join(',')}&retmode=xml`)
      const xml = await fetchRes.text()
      const articleMatches = xml.match(/<PubmedArticle>[\s\S]*?<\/PubmedArticle>/g) || []
      const results = []

      for (const article of articleMatches) {
        const pubmedId = article.match(/<PMID[^>]*>(\d+)<\/PMID>/)?.[1]
        const title = article.match(/<ArticleTitle[^>]*>([\s\S]*?)<\/ArticleTitle>/)?.[1]?.replace(/<[^>]+>/g, '') || ''
        const journal = article.match(/<Title>([\s\S]*?)<\/Title>/)?.[1] || ''
        const year = article.match(/<PubDate>[\s\S]*?<Year>(\d+)<\/Year>/)?.[1] || ''
        const lastNames = article.match(/<LastName>([\s\S]*?)<\/LastName>/g)?.slice(0, 3).map(n => n.replace(/<[^>]+>/g, '')) || []
        if (pubmedId && title) results.push({ pubmed_id: pubmedId, title_en: title, journal, published_date: year, authors: lastNames.join(', ') })
      }

      results.sort((a, b) => (parseInt(b.published_date) || 0) - (parseInt(a.published_date) || 0))
      setArticles(results)
      setLoading(false)

      setAutoTranslating(true)
      const updated = [...results]
      for (let g = 0; g < updated.length; g += 5) {
        const group = updated.slice(g, g + 5)
        const translated = await Promise.all(group.map(a => translateOne(a.title_en)))
        translated.forEach((title_tr, idx) => { if (title_tr) updated[g + idx] = { ...updated[g + idx], title_tr } })
        setArticles([...updated])
        await new Promise(r => setTimeout(r, 150))
      }
      setAutoTranslating(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  const sorted = [...articles].sort((a, b) => {
    if (sortBy === 'newest') return (parseInt(b.published_date) || 0) - (parseInt(a.published_date) || 0)
    if (sortBy === 'oldest') return (parseInt(a.published_date) || 0) - (parseInt(b.published_date) || 0)
    return 0
  })

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-white/5 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="/"><img src="/logo.svg" alt="B" className="w-7 h-7" /></a>
            <span className="font-bold text-base tracking-tight text-white">BİLİMCE</span>
          </div>
          <button onClick={() => window.history.back()} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white/60 hover:text-white transition">← Geri Dön</button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500/20 to-blue-600/20 border border-white/10 flex items-center justify-center text-2xl mb-4">📖</div>
          <h1 className="text-2xl font-bold text-white mb-1">{journalName}</h1>
          <p className="text-white/40 text-sm">
            {loading ? 'Yükleniyor...' : `${articles.length} makale bulundu`}
            {autoTranslating && <span className="text-blue-400/60 ml-2 animate-pulse">· Çevriliyor...</span>}
          </p>
        </div>

        {!loading && articles.length > 0 && (
          <div className="flex justify-end mb-4">
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white/60 text-xs outline-none">
              <option value="newest">En Yeni</option>
              <option value="oldest">En Eski</option>
            </select>
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

        {!loading && articles.length === 0 && (
          <div className="text-center py-20 text-white/30">
            <div className="text-5xl mb-4">📖</div>
            <p>Bu dergi için makale bulunamadı</p>
          </div>
        )}

        {!loading && sorted.length > 0 && (
          <div className="grid gap-4">
            {sorted.map(article => (
              <a key={article.pubmed_id} href={`/article/${article.pubmed_id}`} className="bg-white/3 border border-white/5 rounded-2xl p-5 hover:border-blue-500/20 transition-all block">
                <p className="font-semibold text-white leading-snug mb-1 hover:text-blue-300 transition">{article.title_tr || article.title_en}</p>
                {article.title_tr && <p className="text-white/30 text-xs leading-snug mb-2">{article.title_en}</p>}
                <div className="flex flex-wrap gap-3 text-xs text-white/40">
                  {article.published_date && <span>📅 {article.published_date.slice(0,4)}</span>}
                  {article.authors && <span>👤 {article.authors}</span>}
                </div>
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
