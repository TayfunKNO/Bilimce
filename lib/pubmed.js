const buildPubMedQuery = async (query, filters = {}) => {
  try {
    // İngilizceye çevir
    const encoded = encodeURIComponent(query.slice(0, 490))
    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encoded}`)
    const data = await res.json()
    let translated = data[0]?.map(t => t[0]).filter(Boolean).join('') || query

    // Stop words temizle
    const stopWords = [
      'related', 'regarding', 'concerning', 'about', 'the', 'for',
      'of', 'in', 'on', 'a', 'an', 'to', 'is', 'are', 'was', 'were',
      'research', 'studies', 'articles', 'information', 'papers', 'paper',
      'and', 'or', 'its', 'their', 'this', 'that', 'which', 'how',
    ]

    let words = translated.toLowerCase().split(/\s+/)
    words = words.filter(w => w.length > 2 && !stopWords.includes(w)).slice(0, 4)
    if (words.length === 0) return { query: translated, filters }

    // Her kelimeyi Title filtresiyle sorgu oluştur
    const mainQuery = words.map(w => `${w}[Title]`).join(' AND ')

    // Filtreler ekle
    let fullQuery = mainQuery
    
    if (filters.articleType) {
      const typeMap = {
        'clinical-trial': 'Clinical Trial[pt]',
        'review': 'Review[pt]',
        'meta-analysis': 'Meta-Analysis[pt]',
        'randomized': 'Randomized Controlled Trial[pt]',
        'systematic-review': 'Systematic Review[pt]',
        'case-report': 'Case Reports[pt]',
      }
      if (typeMap[filters.articleType]) fullQuery += ` AND ${typeMap[filters.articleType]}`
    }

    return { query: fullQuery, minDate: filters.minDate, maxDate: filters.maxDate }
  } catch {
    return { query, minDate: filters.minDate, maxDate: filters.maxDate }
  }
}

export async function searchPubMed(query, limit = 100, filters = {}) {
  try {
    const { query: pubmedQuery, minDate, maxDate } = await buildPubMedQuery(query, filters)

    let searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(pubmedQuery)}&retmax=${limit}&retmode=json`

    if (minDate) searchUrl += `&mindate=${minDate}&datetype=pdat`
    if (maxDate) searchUrl += `&maxdate=${maxDate}&datetype=pdat`

    const searchRes = await fetch(searchUrl)
    const searchData = await searchRes.json()
    let ids = searchData.esearchresult?.idlist || []

    // Sonuç az geldiyse Title/Abstract ile tekrar dene
    if (ids.length < 5 && pubmedQuery.includes('[Title]')) {
      const fallbackQuery = pubmedQuery.replace(/\[Title\]/g, '[Title/Abstract]')
      let fallbackUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(fallbackQuery)}&retmax=${limit}&retmode=json`
      if (minDate) fallbackUrl += `&mindate=${minDate}&datetype=pdat`
      if (maxDate) fallbackUrl += `&maxdate=${maxDate}&datetype=pdat`
      const fallbackRes = await fetch(fallbackUrl)
      const fallbackData = await fallbackRes.json()
      if ((fallbackData.esearchresult?.idlist || []).length > ids.length) {
        ids = fallbackData.esearchresult.idlist
      }
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

    articles.sort((a, b) => (parseInt(b.published_date) || 0) - (parseInt(a.published_date) || 0))
    return articles
  } catch (err) {
    console.error('PubMed error:', err)
    return []
  }
}
