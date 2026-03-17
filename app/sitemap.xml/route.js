export const dynamic = 'force-dynamic'

export async function GET() {
  const topics = [
    'kanser', 'alzheimer', 'diyabet', 'depresyon', 'kalp',
    'covid', 'obezite', 'hipertansiyon', 'kanser-tedavisi', 'yapay-zeka'
  ]

  const journals = [
    'Nature', 'The Lancet', 'New England Journal of Medicine',
    'JAMA', 'BMJ', 'Cell', 'Science', 'Nature Medicine',
    'Journal of Clinical Oncology', 'Circulation',
    'Annals of Internal Medicine', 'PLOS ONE',
    'Nature Communications', 'Gut', 'Diabetes Care'
  ]

  const now = new Date().toISOString()

  const staticPages = [
    { url: 'https://bilimce.vercel.app', priority: '1.0', freq: 'daily' },
    { url: 'https://bilimce.vercel.app/community', priority: '0.8', freq: 'daily' },
    { url: 'https://bilimce.vercel.app/collections', priority: '0.6', freq: 'weekly' },
    { url: 'https://bilimce.vercel.app/favorites', priority: '0.5', freq: 'weekly' },
    { url: 'https://bilimce.vercel.app/reading-list', priority: '0.5', freq: 'weekly' },
    { url: 'https://bilimce.vercel.app/profile', priority: '0.4', freq: 'weekly' },
    { url: 'https://bilimce.vercel.app/auth', priority: '0.3', freq: 'monthly' },
  ]

  const topicPages = topics.map(t => ({
    url: `https://bilimce.vercel.app/topic/${encodeURIComponent(t)}`,
    priority: '0.9', freq: 'daily'
  }))

  const journalPages = journals.map(j => ({
    url: `https://bilimce.vercel.app/journal/${encodeURIComponent(j)}`,
    priority: '0.8', freq: 'daily'
  }))

  const allPages = [...staticPages, ...topicPages, ...journalPages]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(p => `  <url>
    <loc>${p.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${p.freq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  })
}
