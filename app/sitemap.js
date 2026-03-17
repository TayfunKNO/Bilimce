export const revalidate = 0
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

  const topicUrls = topics.map(topic => ({
    url: `https://bilimce.vercel.app/topic/${encodeURIComponent(topic)}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  }))

  const journalUrls = journals.map(journal => ({
    url: `https://bilimce.vercel.app/journal/${encodeURIComponent(journal)}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  return [
    {
      url: 'https://bilimce.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://bilimce.vercel.app/community',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://bilimce.vercel.app/collections',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: 'https://bilimce.vercel.app/auth',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: 'https://bilimce.vercel.app/favorites',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: 'https://bilimce.vercel.app/reading-list',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: 'https://bilimce.vercel.app/profile',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.4,
    },
    ...topicUrls,
    ...journalUrls,
  ]
}
