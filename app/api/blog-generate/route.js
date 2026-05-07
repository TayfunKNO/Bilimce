import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://lypjtxqvusqndqawugxu.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || 'sb_publishable_rqtzTjZBNww4u56gNNCI4A_OS_ID1Bo'
)

export async function GET(req) {
  try {
    const topics = ['cancer treatment', 'alzheimer', 'diabetes', 'artificial intelligence medicine', 'covid-19']
    const topic = topics[Math.floor(Math.random() * topics.length)]

    const searchRes = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(topic)}&retmax=3&sort=date&retmode=json`)
    const searchData = await searchRes.json()
    const ids = searchData.esearchresult?.idlist || []
    if (ids.length === 0) return Response.json({ error: 'No articles found' }, { status: 404 })

    const fetchRes = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${ids.join(',')}&retmode=xml`)
    const xml = await fetchRes.text()

    const articles = []
    const matches = xml.match(/<PubmedArticle>[\s\S]*?<\/PubmedArticle>/g) || []
    for (const art of matches.slice(0, 3)) {
      const title = art.match(/<ArticleTitle[^>]*>([\s\S]*?)<\/ArticleTitle>/)?.[1]?.replace(/<[^>]+>/g, '') || ''
      const abstractSection = art.match(/<Abstract>([\s\S]*?)<\/Abstract>/)?.[1] || ''
      const abstract = abstractSection.match(/<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/g)?.map(t => t.replace(/<[^>]+>/g, '').trim()).join(' ') || ''
      const year = art.match(/<PubDate>[\s\S]*?<Year>(\d+)<\/Year>/)?.[1] || ''
      const pubmedId = art.match(/<PMID[^>]*>(\d+)<\/PMID>/)?.[1] || ''
      if (title && abstract) articles.push({ title, abstract: abstract.slice(0, 500), year, pubmedId })
    }

    if (articles.length === 0) return Response.json({ error: 'No abstracts found' }, { status: 404 })

    const prompt = `You are a science journalist. Write an engaging blog post in Turkish about recent scientific research on "${topic}".

Based on these studies:
${articles.map((a, i) => `${i+1}. ${a.title} (${a.year}): ${a.abstract}`).join('\n\n')}

Write a blog post with:
- An engaging Turkish title
- 3-4 paragraphs in Turkish
- Accessible language for general audience
- Mention key findings
- End with implications for everyday life

Respond ONLY in JSON: {"title":"...","slug":"...","content":"...","summary":"...","category":"${topic}"}`

    const aiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }]
      })
    })

    const aiData = await aiRes.json()
    const text = aiData.content?.[0]?.text || '{}'
    const clean = text.replace(/```json|```/g, '').trim()
    const blog = JSON.parse(clean)

    blog.slug = blog.slug || blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50)
    blog.pubmed_ids = articles.map(a => a.pubmedId)
    blog.lang = 'tr'

    blog.slug = blog.slug + '-' + Date.now()
const { data, error } = await supabase.from('blog_posts').insert(blog).select().single()
if (error) throw error


    return Response.json({ success: true, post: data })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

