export const dynamic = 'force-dynamic'

export default function sitemap() {
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

  const now = new Date()

  return [
    { url: 'https://bilimce.vercel.app', lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: 'https://bilimce.vercel.app/community', lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: 'https://bilimce.vercel.app/collections', lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: 'https://bilimce.vercel.app/favorites', lastModified: now, changeFrequency: 'weekly', priority: 0.5 },
    { url: 'https://bilimce.vercel.app/reading-list', lastModified: now, changeFrequency: 'weekly', priority: 0.5 },
    { url: 'https://bilimce.vercel.app/profile', lastModified: now, changeFrequency: 'weekly', priority: 0.4 },
    { url: 'https://bilimce.vercel.app/auth', lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    ...topics.map(t => ({ url: `https://bilimce.vercel.app/topic/${t}`, lastModified: now, changeFrequency: 'daily', priority: 0.9 })),
    ...journals.map(j => ({ url: `https://bilimce.vercel.app/journal/${encodeURIComponent(j)}`, lastModified: now, changeFrequency: 'daily', priority: 0.8 })),
  ]
}
