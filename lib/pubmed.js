const buildPubMedQuery = async (query, filters = {}) => {
  try {
    const encoded = encodeURIComponent(query.slice(0, 490))
    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encoded}`)
    const data = await res.json()
    let translated = data[0]?.map(t => t[0]).filter(Boolean).join('') || query

    const stopWords = [
      'related', 'regarding', 'concerning', 'about', 'the', 'for',
      'of', 'in', 'on', 'a', 'an', 'to', 'is', 'are', 'was', 'were',
      'research', 'studies', 'articles', 'information', 'papers', 'paper',
      'and', 'or', 'its', 'their', 'this', 'that', 'which', 'how',
      'with', 'from', 'by', 'at', 'as', 'be', 'has', 'have', 'had',
      'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may',
    ]

    let words = translated.toLowerCase().split(/\s+/)
    words = words.filter(w => w.length > 2 && !stopWords.includes(w))

    // Medikal terimler için özel eşleştirme
    const medicalTerms = {
      'kanser': 'cancer', 'diyabet': 'diabetes', 'alzheimer': 'alzheimer',
      'depresyon': 'depression', 'obezite': 'obesity', 'hipertansiyon': 'hypertension',
      'kalp': 'cardiac', 'beyin': 'brain', 'karaciğer': 'liver', 'böbrek': 'kidney',
      'akciğer': 'lung', 'meme': 'breast', 'prostat': 'prostate', 'kolon': 'colon',
      'deri': 'skin', 'kemik': 'bone', 'kan': 'blood', 'bağışıklık': 'immune',
      'iltihap': 'inflammation', 'enfeksiyon': 'infection', 'antibiyotik': 'antibiotic',
      'aşı': 'vaccine', 'terapi': 'therapy', 'tedavi': 'treatment', 'ilaç': 'drug',
      'cerrahi': 'surgery', 'kemoterapi': 'chemotherapy', 'radyoterapi': 'radiotherapy',
    }

    // Türkçe kelimeleri İngilizce karşılıklarıyla zenginleştir
    const enrichedWords = words.map(w => medicalTerms[w] || w)
    const uniqueWords = [...new Set(enrichedWords)].slice(0, 5)

    if (uniqueWords.length === 0) return { query: translated, filters }

    // Ana sorgu — ilk 3 kelime Title ile, geri kalanlar Title/Abstract ile
    const titleWords = uniqueWords.slice(0, 3)
    const extraWords = uniqueWords.slice(3)

    let mainQuery
    if (uniqueWords.length === 1) {
      mainQuery = `${uniqueWords[0]}[Title]`
    } else if (uniqueWords.length === 2) {
      mainQuery = `(${titleWords.map(w => `${w}[Title]`).join(' AND ')})`
    } else {
      // 3+ kelime: Title'da AND, ama OR fallback hazır
      mainQuery = `(${titleWords.map(w => `${w}[Title]`).join(' AND ')})`
      if (extraWords.length > 0) {
        mainQuery += ` AND (${extraWords.map(w => `${w}[Title/Abstract]`).join(' OR ')})`
      }
    }

    // Filtreler
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

    return { query: mainQuery, originalWords: uniqueWords, minDate: filters.minDate, maxDate: filters.maxDate }
  } catch {
    return { query, minDate: filters.minDate, maxDate: filters.maxDate }
  }
}

const scoreArticle = (article, keywords = []) => {
  let score = 0
  const title = article.title_en?.toLowerCase() || ''
  const abstract = article.abstract_en?.toLowerCase() || ''

  // Anahtar kelime eşleşmesi
  for (const kw of keywords) {
    const kl = kw.toLowerCase()
    if (title.includes(kl)) score += 10
    if (abstract.includes(kl)) score += 3
  }

  // Yayın türü bonusu
  const pubTypes = article.pub_types || []
  if (pubTypes.some(t => t.includes('Meta-Analysis'))) score += 8
  if (pubTypes.some(t => t.includes('Systematic Review'))) score += 7
  if (pubTypes.some(t => t.includes('Randomized Controlled'))) score += 6
  if (pubTypes.some(t => t.includes('Clinical Trial'))) score += 5
  if (pubTypes.some(t => t.includes('Review'))) score += 3

  // Yenilik bonusu
  const year = parseInt(article.published_date) || 0
  const currentYear = new Date().getFullYear()
  if (year >= currentYear) score += 5
  else if (year >= currentYear - 2) score += 3
  else if (year >= currentYear - 5) score += 1

  // Abstract varlığı
  if (article.abstract_en && article.abstract_en.length > 200) score += 2

  return score
}

export async function searchPubMed(query, limit = 100, filters = {}) {
  try {
    const { query: pubmedQuery, originalWords, minDate, maxDate } = await buildPubMedQuery(query, filters)

    let searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(pubmedQuery)}&retmax=${limit}&retmode=json&sort=relevance`
    if (minDate) searchUrl += `&mindate=${minDate}&datetype=pdat`
    if (maxDate) searchUrl += `&maxdate=${maxDate}&datetype=pdat`

    const searchRes = await fetch(searchUrl)
    const searchData = await searchRes.json()
    let ids = searchData.esearchresult?.idlist || []

    // Sonuç az geldiyse Title/Abstract ile dene
    if (ids.length < 10 && pubmedQuery.includes('[Title]')) {
      const fallbackQuery = pubmedQuery.replace(/\[Title\]/g, '[Title/Abstract]')
      let fallbackUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(fallbackQuery)}&retmax=${limit}&retmode=json&sort=relevance`
      if (minDate) fallbackUrl += `&mindate=${minDate}&datetype=pdat`
      if (maxDate) fallbackUrl += `&maxdate=${maxDate}&datetype=pdat`
      const fallbackRes = await fetch(fallbackUrl)
      const fallbackData = await fallbackRes.json()
      const fallbackIds = fallbackData.esearchresult?.idlist || []
      if (fallbackIds.length > ids.length) ids = fallbackIds
    }

    // Hala az ise sadece ana terimi dene
    if (ids.length < 5 && originalWords?.length > 0) {
      const simpleQuery = `${originalWords[0]}[Title/Abstract]`
      let simpleUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(simpleQuery)}&retmax=${limit}&retmode=json&sort=relevance`
      if (minDate) simpleUrl += `&mindate=${minDate}&datetype=pdat`
      if (maxDate) simpleUrl += `&maxdate=${maxDate}&datetype=pdat`
      const simpleRes = await fetch(simpleUrl)
      const simpleData = await simpleRes.json()
      const simpleIds = simpleData.esearchresult?.idlist || []
      if (simpleIds.length > ids.length) ids = simpleIds
    }

    if (ids.length === 0) return []

    const fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${ids.join(',')}&retmode=xml`
    const fetchRes = await fetch(fetchUrl)
    const xml = await fetchRes.text()

    const articles = []
    const matches = xml.match(/<PubmedArticle>[\s\S]*?<\/PubmedArticle>/g) || []

    for (const article of matches) {
      const pubmedId = article.match(/<PMID[^>]*>(\d+)<\/PMID>/)?.[1]
      const title = article.match(/<ArticleTitle[^>]*>([\s\S]*?)<\/ArticleTitle>/)?.[1]?.replace(/<[^>]+>/g, '') || ''
      const abstractSection = article.match(/<Abstract>([\s\S]*?)<\/Abstract>/)?.[1] || ''
      const abstractParts = []
      const abstractTextMatches = abstractSection.match(/<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/g) || []
      for (const part of abstractTextMatches) {
        const label = part.match(/Label="([^"]+)"/)?.[1]
        const text = part.replace(/<[^>]+>/g, '').trim()
        if (text) abstractParts.push(label ? `${label}: ${text}` : text)
      }
      const abstract = abstractParts.join('\n\n')
      const journal = article.match(/<Title>([\s\S]*?)<\/Title>/)?.[1] || ''
      const year = article.match(/<PubDate>[\s\S]*?<Year>(\d+)<\/Year>/)?.[1] || ''
      const lastNames = article.match(/<LastName>([\s\S]*?)<\/LastName>/g)?.slice(0, 3).map(n => n.replace(/<[^>]+>/g, '')) || []
      const pubTypes = article.match(/<PublicationType[^>]*>([\s\S]*?)<\/PublicationType>/g)?.map(n => n.replace(/<[^>]+>/g, '')) || []

      if (pubmedId && title) {
        articles.push({
          pubmed_id: pubmedId,
          title_en: title,
          abstract_en: abstract,
          journal,
          published_date: year,
          authors: lastNames.join(', '),
          pub_types: pubTypes,
          source: 'pubmed',
        })
      }
    }

    // Akıllı sıralama — relevance skoru + yenilik
    articles.forEach(a => { a._score = scoreArticle(a, originalWords || []) })
    articles.sort((a, b) => b._score - a._score)

    return articles
  } catch (err) {
    console.error('PubMed error:', err)
    return []
  }
}
