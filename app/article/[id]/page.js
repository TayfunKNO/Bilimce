async function fetchArticle(pubmedId) {
  try {
    const fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${pubmedId}&retmode=xml`
    const res = await fetch(fetchUrl)
    const xml = await res.text()

    const title = xml.match(/<ArticleTitle[^>]*>([\s\S]*?)<\/ArticleTitle>/)?.[1]?.replace(/<[^>]+>/g, '') || ''
    const abstractSection = xml.match(/<Abstract>([\s\S]*?)<\/Abstract>/)?.[1] || ''
    const abstractParts = []
    const abstractTextMatches = abstractSection.match(/<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/g) || []
    for (const part of abstractTextMatches) {
      const label = part.match(/Label="([^"]+)"/)?.[1]
      const text = part.replace(/<[^>]+>/g, '').trim()
      if (text) abstractParts.push(label ? `${label}: ${text}` : text)
    }
    const abstract = abstractParts.join('\n\n')
    const journal = xml.match(/<Title>([\s\S]*?)<\/Title>/)?.[1] || ''
    const year = xml.match(/<PubDate>[\s\S]*?<Year>(\d+)<\/Year>/)?.[1] || ''
    const lastNames = xml.match(/<LastName>([\s\S]*?)<\/LastName>/g)?.slice(0, 5).map(n => n.replace(/<[^>]+>/g, '')) || []

    return { pubmed_id: pubmedId, title_en: title, abstract_en: abstract, journal, published_date: year, authors: lastNames.join(', ') }
  } catch {
    return null
  }
}

export async function generateMetadata({ params }) {
  const article = await fetchArticle(params.id)
  const title = article?.title_en || 'BİLİMCE Makale'
  const description = (article?.abstract_en || '').slice(0, 160)
  return {
    title: `${title} | BİLİMCE`,
    description,
    openGraph: { title, description, siteName: 'BİLİMCE' },
  }
}

export default async function ArticlePage({ params }) {
  const pubmedId = params.id
  const article = await fetchArticle(pubmedId)
  const abstract = article?.abstract_en || ''
  const sections = abstract.split('\n\n').filter(Boolean)

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-white/5 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">B</a>
            <span className="font-bold text-lg tracking-tight text-white">BİLİMCE</span>
          </div>
          <a href="/" className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white/60 hover:text-white transition">Ana Sayfa</a>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-12">
        {!article ? (
          <div className="text-center py-20 text-white/30">
            <div className="text-5xl mb-4">🔭</div>
            <p>Makale bulunamadı</p>
            <a href="/" className="mt-4 inline-block px-6 py-3 bg-blue-500/20 border border-blue-500/20 text-blue-300 rounded-xl text-sm hover:bg-blue-500/30 transition">Ana Sayfaya Dön</a>
          </div>
        ) : (
          <article>
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-white leading-snug mb-3">{article.title_en}</h1>
              <div className="flex flex-wrap gap-3 text-xs text-white/40">
                {article.journal && <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg">{article.journal}</span>}
                {article.published_date && <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg">{article.published_date.slice(0,4)}</span>}
                {article.authors && <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg">{article.authors}</span>}
                <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg">PubMed ID: {pubmedId}</span>
              </div>
            </div>
            {abstract ? (
              <div className="bg-white/3 border border-white/5 rounded-2xl p-6 mb-6">
                <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wide mb-4">Abstract</h2>
                {sections.length > 1 ? (
                  <div className="flex flex-col gap-4">
                    {sections.map((section, i) => {
                      const colonIdx = section.indexOf(':')
                      if (colonIdx > 0 && colonIdx < 30) {
                        const label = section.slice(0, colonIdx)
                        const content = section.slice(colonIdx + 1).trim()
                        return (
                          <div key={i}>
                            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide">{label}</span>
                            <p className="text-sm text-white/80 leading-relaxed mt-1">{content}</p>
                          </div>
                        )
                      }
                      return <p key={i} className="text-sm text-white/80 leading-relaxed">{section}</p>
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-white/80 leading-relaxed">{abstract}</p>
                )}
              </div>
            ) : (
              <div className="bg-white/3 border border-white/5 rounded-2xl p-6 mb-6">
                <p className="text-white/40 text-sm">Özet mevcut değil.</p>
              </div>
            )}
            <div className="flex gap-3">
              <a href={`https://pubmed.ncbi.nlm.nih.gov/${pubmedId}/`} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-blue-500/20 border border-blue-500/20 text-blue-300 rounded-xl text-sm font-medium hover:bg-blue-500/30 transition">
                PubMed'de Görüntüle →
              </a>
              <a href="/" className="px-6 py-3 bg-white/5 border border-white/10 text-white/60 rounded-xl text-sm hover:text-white transition">← Geri Dön</a>
            </div>
          </article>
        )}
      </main>
    </div>
  )
}
