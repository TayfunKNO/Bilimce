const buildPubMedQuery = async (query) => {
  try {
    const encoded = encodeURIComponent(query.slice(0, 490))
    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encoded}`)
    const data = await res.json()
    let translated = data[0]?.map(t => t[0]).filter(Boolean).join('') || query

    // Sadece gerçekten gereksiz kelimeleri temizle
    translated = translated
      .replace(/\b(related|regarding|concerning|about|the|for|of|in|on|a|an|to|is|are|was|were|research|studies|articles|information|papers|paper)\b/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    return translated || query
  } catch {
    return query
  }
}

export async function searchPubMed(query, limit = 50) {
  try {
    const pubmedQuery = await buildPubMedQuery(query)
    
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(pubmedQuery)}&retmax=${limit}&retmode=json`
    const searchRes = await fetch(searchUrl)
    const searchData = await searchRes.json()
    const ids = searchData.esearchresult?.idlist || []

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

      if (pubmedId && title) {
        articles.push({
          pubmed_id: pubmedId,
          title_en: title,
          abstract_en: abstract,
          journal,
          published_date: year,
          authors: lastNames.join(', '),
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
