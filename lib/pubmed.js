const buildPubMedQuery = async (query, filters = {}) => {
  try {
    // Türkçe → İngilizce çevir
    const encoded = encodeURIComponent(query.slice(0, 490))
    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encoded}`)
    const data = await res.json()
    let translated = data[0]?.map(t => t[0]).filter(Boolean).join('') || query

    // Medikal terimler sözlüğü
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
      'vitamin': 'vitamin', 'mineral': 'mineral', 'protein': 'protein',
      'kreatin': 'creatine', 'omega': 'omega', 'probiyotik': 'probiotic',
      'mikrobiyom': 'microbiome', 'genetik': 'genetics', 'gen': 'gene',
      'crispr': 'CRISPR', 'yapay': 'artificial', 'zeka': 'intelligence',
      'covid': 'COVID-19', 'grip': 'influenza', 'alerji': 'allergy',
    }

    // Kelimeyi medikal sözlükten önce dene, yoksa çeviriyi kullan
    const queryLower = query.toLowerCase().trim()
    let mainTerm = medicalTerms[queryLower] || translated.trim()

    // Stop words temizle
    const stopWords = new Set(['the', 'for', 'of', 'in', 'on', 'a', 'an', 'to', 'is', 'are',
      'was', 'were', 'and', 'or', 'its', 'this', 'that', 'which', 'how', 'with',
      'from', 'by', 'at', 'as', 'be', 'has', 'have', 'had', 'do', 'does', 'did',
      'will', 'would', 'could', 'should', 'may', 'research', 'studies', 'about'])

    // Ana sorguyu oluştur — Title/Abstract ile geniş arama
    let mainQuery
    const words = mainTerm.split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w.toLowerCase()))

    if (words.length === 0) {
      mainQuery = `${mainTerm}[Title/Abstract]`
    } else if (words.length === 1) {
      // Tek kelime — hem Title hem Abstract
      mainQuery = `${words[0]}[Title/Abstract]`
    } else if (words.length === 2) {
      // İki kelime — ikisi de Title/Abstract'ta olsun
      mainQuery = `(${words[0]}[Title/Abstract] AND ${words[1]}[Title/Abstract])`
    } else {
      // Çok kelime — ilk 2 kelime Title'da, diğerleri Title/Abstract'ta
      const core = words.slice(0, 2).map(w => `${w}[Title/Abstract]`).join(' AND ')
      mainQuery = `(${core})`
    }

    // Makale türü filtresi
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

    return {
      query: mainQuery,
      originalWords: words.length > 0 ? words : [mainTerm],
      minDate: filters.minDate,
      maxDate: filters.maxDate
    }
  } catch {
    return { query, minDate: filters.minDate, maxDate: filters.maxDate }
  }
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

export async function searchPubMed(query, limit = 100, filters = {}) {
  try {
    const { query: pubmedQuery, originalWords, minDate, maxDate } = await buildPubMedQuery(query, filters)

    // İlk arama — Title/Abstract
    let searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(pubmedQuery)}&retmax=${limit}&retmode=json&sort=relevance`
    if (minDate) searchUrl += `&mindate=${minDate}&datetype=pdat`
    if (maxDate) searchUrl += `&maxdate=${maxDate}&datetype=pdat`

    const searchRes = await fetch(searchUrl)
    const searchData = await searchRes.json()
    let ids = searchData.esearchresult?.idlist || []

    // Sonuç az geldiyse — AND yerine OR ile dene
    if (ids.length < 15 && originalWords?.length >= 2) {
      const orQuery = originalWords.slice(0, 3).map(w => `${w}[Title/Abstract]`).join(' OR ')
      let orUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(orQuery)}&retmax=${limit}&retmode=json&sort=relevance`
      if (minDate) orUrl += `&mindate=${minDate}&datetype=pdat`
      if (maxDate) orUrl += `&maxdate=${maxDate}&datetype=pdat`
      const orRes = await fetch(orUrl)
      const orData = await orRes.json()
      const orIds = orData.esearchresult?.idlist || []
      if (orIds.length > ids.length) ids = orIds
    }

    // Hala az ise — sadece ilk kelime ile geniş arama
    if (ids.length < 10 && originalWords?.length > 0) {
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

    // Makale detaylarını çek
    const batchSize = 50
    const allArticles = []

    for (let i = 0; i < Math.min(ids.length, limit); i += batchSize) {
      const batchIds = ids.slice(i, i + batchSize)
      const fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${batchIds.join(',')}&retmode=xml`
      const fetchRes = await fetch(fetchUrl)
      const xml = await fetchRes.text()

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
          allArticles.push({
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
    }

    // Akıllı sıralama
    allArticles.forEach(a => { a._score = scoreArticle(a, originalWords || []) })
    allArticles.sort((a, b) => b._score - a._score)

    return allArticles
  } catch (err) {
    console.error('PubMed error:', err)
    return []
  }
}
