'use client'
import { useState, useEffect } from 'react'

const TOPIC_INFO = {
  'kanser': { en: 'cancer', icon: '🎗️', desc: 'Kanser araştırmaları ve tedavi yöntemleri', title: 'Kanser Araştırmaları' },
  'alzheimer': { en: 'alzheimer', icon: '🧠', desc: 'Alzheimer hastalığı araştırmaları', title: 'Alzheimer Araştırmaları' },
  'diyabet': { en: 'diabetes', icon: '💉', desc: 'Diyabet ve metabolik hastalıklar araştırmaları', title: 'Diyabet Araştırmaları' },
  'depresyon': { en: 'depression', icon: '🧘', desc: 'Depresyon ve ruh sağlığı araştırmaları', title: 'Depresyon Araştırmaları' },
  'kalp': { en: 'cardiovascular', icon: '❤️', desc: 'Kardiyovasküler hastalıklar araştırmaları', title: 'Kalp Hastalıkları Araştırmaları' },
  'covid': { en: 'covid-19', icon: '🦠', desc: 'COVID-19 araştırmaları ve tedavi yöntemleri', title: 'COVID-19 Araştırmaları' },
  'obezite': { en: 'obesity', icon: '⚖️', desc: 'Obezite ve metabolizma araştırmaları', title: 'Obezite Araştırmaları' },
  'hipertansiyon': { en: 'hypertension', icon: '🩺', desc: 'Hipertansiyon araştırmaları', title: 'Hipertansiyon Araştırmaları' },
  'kanser-tedavisi': { en: 'cancer treatment', icon: '💊', desc: 'Kanser tedavi yöntemleri araştırmaları', title: 'Kanser Tedavisi Araştırmaları' },
  'yapay-zeka': { en: 'artificial intelligence medicine', icon: '🤖', desc: 'Tıpta yapay zeka uygulamaları araştırmaları', title: 'Tıpta Yapay Zeka Araştırmaları' },
}

const translateOne = async (text) => {
  if (!text) return null
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=tr&dt=t&q=${encodeURIComponent(text)}`
    const res = await fetch(url)
    const data = await res.json()
    return data[0]?.map(t => t[0]).filter(Boolean).join('') || null
  } catch { return null }
}

export default function TopicPage({ params }) {
  const topicSlug = decodeURIComponent(params.name).toLowerCase()
  const topicInfo = TOPIC_INFO[topicSlug] || { en: topicSlug, icon: '🔬', desc: `${topicSlug} araştırmaları`, title: topicSlug }
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [autoTranslating, setAutoTranslating] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const [filterType, setFilterType] = useState('')

  useEffect(() => {
    document.title = `${topicInfo.title} - BİLİMCE`
    fetchTopicArticles(topicInfo.en)
  }, [topicSlug])

  const fetchTopicArticles = async (query) => {
    try {
      let searchQuery = `${query}[Title/Abstract]`
      if (filterType) {
        const typeMap = {
          'review': 'Review[pt]',
          'clinical-trial': 'Clinical Trial[pt]',
          'meta-analysis': 'Meta-Analysis[pt]',
        }
        if (typeMap[filterType]) searchQuery += ` AND ${typeMap[filterType]}`
      }
      const searchRes = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(searchQuery)}&retmax=50&retmode=json&sort=date`)
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
        const pubTypes = article.match(/<PublicationType[^>]*>([\s\S]*?)<\/PublicationType>/g)?.map(n => n.replace(/<[^>]+>/g, '')) || []
        if (pubmedId && title) results.push({ pubmed_id: pubmedId, title_en: title, journal, published_date: year, authors: lastNames.join(', '), pub_types: pubTypes })
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
    } catch (err) { console.error(err); setLoading(false) }
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
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center text-3xl mb-4">{topicInfo.icon}</div>
          <h1 className="text-2xl font-bold text-white mb-1">{topicInfo.title || topicSlug}</h1>
          <p className="text-white/40 text-sm mb-1">{topicInfo.desc}</p>
          <p className="text-white/30 text-xs">
            {loading ? 'Yükleniyor...' : `${articles.length} makale bulundu`}
            {autoTranslating && <span className="text-blue-400/60 ml-2 animate-pulse">· Çevriliyor...</span>}
          </p>
        </div>
        <div className="flex gap-2 mb-6 flex-wrap">
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white/60 text-xs outline-none">
            <option value="newest">En Yeni</option>
            <option value="oldest">En Eski</option>
          </select>
          <select value={filterType} onChange={e => { setFilterType(e.target.value); setLoading(true); setArticles([]); fetchTopicArticles(topicInfo.en) }} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white/60 text-xs outline-none">
            <option value="">Tüm Türler</option>
            <option value="review">Derleme</option>
            <option value="clinical-trial">Klinik Çalışma</option>
            <option value="meta-analysis">Meta-Analiz</option>
          </select>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {Object.entries(TOPIC_INFO).map(([slug, info]) => (
            <a key={slug} href={`/topic/${slug}`} className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition border ${topicSlug === slug ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' : 'bg-white/5 border-white/5 text-white/40 hover:text-white'}`}>
              {info.icon} {slug}
            </a>
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
        {!loading && articles.length === 0 && (
          <div className="text-center py-20 text-white/30">
            <div className="text-5xl mb-4">🔭</div>
            <p>Bu konu için makale bulunamadı</p>
          </div>
        )}
        {!loading && sorted.length > 0 && (
          <div className="grid gap-4">
            {sorted.map(article => (
              <a key={article.pubmed_id} href={`/article/${article.pubmed_id}`} className="bg-white/3 border border-white/5 rounded-2xl p-5 hover:border-blue-500/20 transition-all block">
                <p className="font-semibold text-white leading-snug mb-1 hover:text-blue-300 transition">{article.title_tr || article.title_en}</p>
                {article.title_tr && <p className="text-white/30 text-xs leading-snug mb-2">{article.title_en}</p>}
                <div className="flex flex-wrap gap-3 text-xs text-white/40 mb-2">
                  {article.journal && <span>📖 {article.journal}</span>}
                  {article.published_date && <span>📅 {article.published_date.slice(0,4)}</span>}
                  {article.authors && <span>👤 {article.authors}</span>}
                </div>
                {article.pub_types?.slice(0,1).map((pt, j) => (
                  <span key={j} className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-lg text-xs">{pt}</span>
                ))}
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
