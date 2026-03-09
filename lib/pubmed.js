export async function searchPubMed(query, limit = 50) {
  try {
    const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=${limit}&retmode=json`
    const res = await fetch(url)
    const data = await res.json()
    const ids = data.esearchresult?.idlist || []
    if (ids.length === 0) return []
    const fetchRes = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${ids.join(',')}&retmode=xml`)
    const xml = await fetchRes.text()
    const articles = []
    const matches = xml.match(/<PubmedArticle>[\s\S]*?<\/PubmedArticle>/g) || []
    for (const article of matches) {
      const pubmedId = article.match(/<PMID[^>]*>(\d+)<\/PMID>/)?.[1]
      const title = article.match(/<ArticleTitle[^>]*>([\s\S]*?)<\/ArticleTitle>/)?.[1]?.replace(/<[^>]+>/g, '') || ''
      const abstractTexts = article.match(/<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/g) || []
      const abstract = abstractTexts.map(t => t.replace(/<[^>]+>/g, '')).join(' ')
      const journal = article.match(/<Title>([\s\S]*?)<\/Title>/)?.[1] || ''
      const year = article.match(/<PubDate>[\s\S]*?<Year>(\d+)<\/Year>/)?.[1] || ''
      const lastNames = article.match(/<LastName>([\s\S]*?)<\/LastName>/g)?.slice(0,3).map(n => n.replace(/<[^>]+>/g,'')) || []
      if (pubmedId && title) {
        articles.push({ pubmed_id: pubmedId, title_en: title, abstract_en: abstract, journal, published_date: year, authors: lastNames.join(', '), source: 'pubmed' })
      }
    }
    return articles
  } catch (err) {
    return []
  }
}
