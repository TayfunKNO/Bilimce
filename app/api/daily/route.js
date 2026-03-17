import { NextResponse } from 'next/server'

const DAILY_TOPICS = [
  'cancer immunotherapy', 'alzheimer treatment', 'artificial intelligence medicine',
  'microbiome health', 'longevity aging', 'mental health depression',
  'diabetes type 2', 'cardiovascular disease', 'covid long term effects',
  'gut brain axis', 'sleep disorder', 'obesity metabolism',
  'gene therapy', 'stem cell', 'antibiotic resistance',
]

let dailyCache = null
let dailyCacheDate = null

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0]

    // Cache kontrolü — günde bir kez güncelle
    if (dailyCache && dailyCacheDate === today) {
      return NextResponse.json({ article: dailyCache }, {
        headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800' }
      })
    }

    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
    const topic = DAILY_TOPICS[dayOfYear % DAILY_TOPICS.length]

    const lastMonth = new Date()
    lastMonth.setDate(lastMonth.getDate() - 30)
    const dateStr = lastMonth.toISOString().split('T')[0].replace(/-/g, '/')

    const searchRes = await fetch(
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(topic)}[Title/Abstract]&mindate=${dateStr}&datetype=pdat&retmax=5&retmode=json&sort=relevance`,
      { next: { revalidate: 86400 } }
    )
    const searchData = await searchRes.json()
    const ids = searchData.esearchresult?.idlist || []
    if (ids.length === 0) return NextResponse.json({ article: null })

    const fetchRes = await fetch(
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${ids[0]}&retmode=xml`,
      { next: { revalidate: 86400 } }
    )
    const xml = await fetchRes.text()

    const title = xml.match(/<ArticleTitle[^>]*>([\s\S]*?)<\/ArticleTitle>/)?.[1]?.replace(/<[^>]+>/g, '') || ''
    const abstractSection = xml.match(/<Abstract>([\s\S]*?)<\/Abstract>/)?.[1] || ''
    const abstractParts = []
    const abstractTextMatches = abstractSection.match(/<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/g) || []
    for (const part of abstractTextMatches) {
      const label = part.match(/Label="([^"]+)"/)?.[1]
      const text = part.replace(/<[^>]+>/g, '').trim()
      if (text) abstractParts.push(label ? `${label}: ${text}` : text)
    }
    const journal = xml.match(/<Title>([\s\S]*?)<\/Title>/)?.[1] || ''
    const year = xml.match(/<PubDate>[\s\S]*?<Year>(\d+)<\/Year>/)?.[1] || ''
    const lastNames = xml.match(/<LastName>([\s\S]*?)<\/LastName>/g)?.slice(0, 3).map(n => n.replace(/<[^>]+>/g, '')) || []

    const article = {
      pubmed_id: ids[0],
      title_en: title,
      abstract_en: abstractParts.join('\n\n'),
      journal,
      published_date: year,
      authors: lastNames.join(', '),
      topic,
    }

    // Cache'e kaydet
    dailyCache = article
    dailyCacheDate = today

    return NextResponse.json({ article }, {
      headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800' }
    })
  } catch (err) {
    return NextResponse.json({ article: null })
  }
}
