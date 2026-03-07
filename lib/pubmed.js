const PUBMED_BASE = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils'

export async function searchPubMed(query, maxResults = 10) {
  try {
    const searchUrl = `${PUBMED_BASE}/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=${maxResults}&retmode=json&sort=date`
    const searchRes = await fetch(searchUrl)
    const searchData = await searchRes.json()
    const ids = searchData.esearchresult?.idlist || []

    if (ids.length === 0) return []

    const fetchUrl = `${PUBMED_BASE}/efetch.fcgi?db=pubmed&id=${ids.join(',')}&retmode=xml`
    const fetchRes = await fetch(fetchUrl)
    const xmlText = await fetchRes.text()

    return parsePubMedXML(xmlText, ids)
  } catch (error) {
    console.error('PubMed API hatası:', error)
    return []
  }
}

function parsePubMedXML(xmlText, ids) {
  const articles = []
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(xmlText, 'text/xml')
    const articleNodes = doc.querySelectorAll('PubmedArticle')

    articleNodes.forEach((node, index) => {
      const title = node.querySelector('ArticleTitle')?.textContent || ''
      const abstract = node.querySelector('AbstractText')?.textContent || ''
      const journal = node.querySelector('Title')?.textContent || ''
      const pubDate = node.querySelector('PubDate Year')?.textContent || ''

      const authorNodes = node.querySelectorAll('Author')
      const authors = []
      authorNodes.forEach(author => {
        const lastName = author.querySelector('LastName')?.textContent || ''
        const foreName = author.querySelector('ForeName')?.textContent || ''
        if (lastName) authors.push(`${lastName} ${foreName}`.trim())
      })

      const meshNodes = node.querySelectorAll('MeshHeading DescriptorName')
      const keywords = []
      meshNodes.forEach(mesh => keywords.push(mesh.textContent))

      articles.push({
        pubmed_id: ids[index],
        title_en: title,
        abstract_en: abstract,
        journal,
        authors,
        keywords: keywords.slice(0, 5),
        published_date: pubDate ? `${pubDate}-01-01` : null,
        source: 'pubmed',
      })
    })
  } catch (e) {
    console.error('XML parse hatası:', e)
  }
  return articles
}
