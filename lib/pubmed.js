const decodeHTML = (str) => {
  if (!str) return str
  return str
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
}

const buildPubMedQuery = async (query, filters = {}) => {
  try {
    const encoded = encodeURIComponent(query.slice(0, 490))
    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encoded}`)
    const data = await res.json()
    let translated = data[0]?.map(t => t[0]).filter(Boolean).join('') || query

    const medicalTerms = {
      'kanser': 'cancer', 'diyabet': 'diabetes', 'alzheimer': 'alzheimer',
      'depresyon': 'depression', 'obezite': 'obesity', 'hipertansiyon': 'hypertension',
      'kalp': 'heart', 'beyin': 'brain', 'karaciğer': 'liver', 'böbrek': 'kidney',
      'akciğer': 'lung', 'meme': 'breast', 'prostat': 'prostate', 'kolon': 'colon',
      'deri': 'skin', 'kemik': 'bone', 'kan': 'blood', 'bağışıklık': 'immune',
      'iltihap': 'inflammation', 'enfeksiyon': 'infection', 'antibiyotik': 'antibiotic',
      'aşı': 'vaccine', 'terapi': 'therapy', 'tedavi': 'treatment', 'ilaç': 'drug',
      'cerrahi': 'surgery', 'kemoterapi': 'chemotherapy', 'parkinson': 'parkinson',
      'şeker': 'diabetes', 'tansiyon': 'hypertension', 'felç': 'stroke',
      'inme': 'stroke', 'astım': 'asthma', 'migren': 'migraine',
      'uyku': 'sleep', 'anksiyete': 'anxiety', 'stres': 'stress',
      'kreatin': 'creatine', 'omega': 'omega', 'probiyotik': 'probiotic',
      'mikrobiyom': 'microbiome', 'genetik': 'genetics', 'gen': 'gene',
      'crispr': 'CRISPR', 'covid': 'COVID-19', 'grip': 'influenza',
    }

    const queryLower = query.toLowerCase().trim()
    let mainTerm = medicalTerms[queryLower] || translated.trim()

    const stopWords = new Set(['the', 'for', 'of', 'in', 'on', 'a', 'an', 'to', 'is', 'are',
      'was', 'were', 'and', 'or', 'this', 'that', 'with', 'from', 'by', 'at',
      'will', 'would', 'could', 'should', 'may', 'research', 'studies', 'about'])

    const words = mainTerm.split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w.toLowerCase()))

    let mainQuery
    if (words.length === 0) {
      mainQuery = `${mainTerm}[Title/Abstract]`
    } else if (words.length === 1) {
      mainQuery = `${words[0]}[Title/Abstract]`
    } else {
      mainQuery = `(${words.slice(0, 2).map(w => `${w}[Title/Abstract]`).join(' AND ')})`
    }

    if (filters.articleType) {
      const typeMap = {
        'clinical-trial': 'Clinical Trial[pt]',
        'review': 'Review[pt]',
        'meta-analysis': 'Meta-Analysis[pt]',
        'randomized': 'Randomized Controlled Trial[pt]',
        'systematic-review': 'Systematic Review[pt]',
        'case-report': 'Case Reports[pt]',
      }
      if (typeMap[filters.articleType]) mainQuery += ` AND ${typeMap[filters.articleType]}`
    }

    return { query: mainQuery, originalWords: words.length > 0 ? words : [mainTerm], minDate: filters.minDate, maxDate: filters.maxDate }
  } catch {
    return { query, minDate: filters.minDate, maxDate: filters.maxDate }
  }
}

const parseArticles = (xml) => {
  const articles = []
  const matches = xml.match(/<PubmedArticle>[\s\S]*?<\/PubmedArticle>/g) || []
  for (const article of matches) {
    const pubmedId = article.match(/<PMID[^>]*>(\d+)<\/PMID>/)?.[1]
    const titleRaw = article.match(/<ArticleTitle[^>]*>([\s\S]*?)<\/ArticleTitle>/)?.[1]?.replace(/<[^>]+>/g, '') || ''
    const title = decodeHTML(titleRaw)
    const abstractSection = article.match(/<Abstract>([\s\S]*?)<\/Abstract>/)?.[1] || ''
    const abstractParts = []
    const abstractTextMatches = abstractSection.match(/<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/g) || []
    for (const part of abstractTextMatches) {
      const label = part.match(/Label="([^"]+)"/)?.[1]
      const text = decodeHTML(part.replace(/<[^>]+>/g, '').trim())
      if (text) abstractParts.push(label ? `${label}: ${text}` : text)
    }
    const journalRaw = article.match(/<Title>([\s\S]*?)<\/Title>/)?.[1] || ''
    const journal = decodeHTML(journalRaw)
    const year = article.match(/<PubDate>[\s\S]*?<Year>(\d+)<\/Year>/)?.[1] || ''
    const lastNames = article.match(/<LastName>([\s\S]*?)<\/LastName>/g)?.slice(0, 3).map(n => decodeHTML(n.replace(/<[^>]+>/g, ''))) || []
    const pubTypes = article.match(/<PublicationType[^>]*>([\s\S]*?)<\/PublicationType>/g)?.map(n => n.replace(/<[^>]+>/g, '')) || []
    if (pubmedId && title) {
      articles.push({
        pubmed_id: pubmedId, title_en: title,
        abstract_en: abstractParts.join('\n\n'),
        journal, published_date: year,
        authors: lastNames.join(', '),
        pub_types: pubTypes, source: 'pubmed',
      })
    }
  }
  return articles
}

const scoreArticle = (article, keywords = []) => {
  let score = 0
  const title = article.title_en?.toLowerCase() || ''
  const abstract = article.abstract_en?.toLowerCase() || ''
  for (const kw of keywords) {
    const kl = kw.toLowerCase()
    if (title.includes(kl)) score += 10
    if (abstract.includes(kl)) score += 3
  }
  const pubTypes = article.pub_types || []
  if (pubTypes.some(t => t.includes('Meta-Analysis'))) score += 8
  if (pubTypes.some(t => t.includes('Systematic Review'))) score += 7
  if (pubTypes.some(t => t.includes('Randomized Controlled'))) score += 6
  if (pubTypes.some(t => t.includes('Clinical Trial'))) score += 5
  if (pubTypes.some(t => t.includes('Review'))) score += 3
  const year = parseInt(article.published_date) || 0
  const currentYear = new Date().getFullYear()
  if (year >= currentYear) score += 5
  else if (year >= currentYear - 2) score += 3
  else if (year >= currentYear - 5) score += 1
  if (article.abstract_en && article.abstract_en.length > 200) score += 2
  return score
}

export async function searchPubMed(query, limit = 20, filters = {}) {
  try {
    const { query: pubmedQuery, originalWords, minDate, maxDate } = await buildPubMedQuery(query, filters)

    let searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(pubmedQuery)}&retmax=${limit}&retmode=json&sort=relevance`
    if (minDate) searchUrl += `&mindate=${minDate}&datetype=pdat`
    if (maxDate) searchUrl += `&maxdate=${maxDate}&datetype=pdat`

    const searchRes = await fetch(searchUrl)
    const searchData = await searchRes.json()
    let ids = searchData.esearchresult?.idlist || []
    const totalCount = parseInt(searchData.esearchresult?.count || 0)

    if (ids.length < 10 && originalWords?.length >= 2) {
      const orQuery = originalWords.slice(0, 3).map(w => `${w}[Title/Abstract]`).join(' OR ')
      let orUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(orQuery)}&retmax=${limit}&retmode=json&sort=relevance`
      if (minDate) orUrl += `&mindate=${minDate}&datetype=pdat`
      if (maxDate) orUrl += `&maxdate=${maxDate}&datetype=pdat`
      const orRes = await fetch(orUrl)
      const orData = await orRes.json()
      const orIds = orData.esearchresult?.idlist || []
      if (orIds.length > ids.length) ids = orIds
    }

    if (ids.length === 0) return []

    const fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${ids.join(',')}&retmode=xml`
    const fetchRes = await fetch(fetchUrl)
    const xml = await fetchRes.text()

    const articles = parseArticles(xml)
    articles.forEach(a => { a._score = scoreArticle(a, originalWords || []) })
    articles.sort((a, b) => b._score - a._score)
    articles.forEach(a => { a._totalCount = totalCount })

    return articles
  } catch (err) {
    console.error('PubMed error:', err)
    return []
  }
}

export async function searchPubMedPage(query, page = 1, filters = {}) {
  try {
    const { query: pubmedQuery, originalWords, minDate, maxDate } = await buildPubMedQuery(query, filters)
    const retstart = (page - 1) * 20

    let searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(pubmedQuery)}&retmax=20&retstart=${retstart}&retmode=json&sort=relevance`
    if (minDate) searchUrl += `&mindate=${minDate}&datetype=pdat`
    if (maxDate) searchUrl += `&maxdate=${maxDate}&datetype=pdat`

    const searchRes = await fetch(searchUrl)
    const searchData = await searchRes.json()
    const ids = searchData.esearchresult?.idlist || []
    const totalCount = parseInt(searchData.esearchresult?.count || 0)

    if (ids.length === 0) return { articles: [], totalCount, hasMore: false }

    const fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${ids.join(',')}&retmode=xml`
    const fetchRes = await fetch(fetchUrl)
    const xml = await fetchRes.text()

    const articles = parseArticles(xml)
    articles.forEach(a => { a._score = scoreArticle(a, originalWords || []) })

    return { articles, totalCount, hasMore: retstart + 20 < totalCount }
  } catch (err) {
    console.error('PubMed page error:', err)
    return { articles: [], totalCount: 0, hasMore: false }
  }
}
