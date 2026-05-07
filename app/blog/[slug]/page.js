'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useParams } from 'next/navigation'

const supabase = createClient(
  'https://lypjtxqvusqndqawugxu.supabase.co',
  'sb_publishable_rqtzTjZBNww4u56gNNCI4A_OS_ID1Bo'
)

export default function BlogPostPage() {
  const params = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params?.slug) loadPost()
  }, [params])

  const loadPost = async () => {
    const { data } = await supabase.from('blog_posts').select('*').eq('slug', params.slug).single()
    setPost(data)
    setLoading(false)
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
      <div className="text-white/30">Yükleniyor...</div>
    </div>
  )

  if (!post) return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
      <div className="text-center">
        <p className="text-white/40 mb-4">Yazı bulunamadı.</p>
        <a href="/blog" className="text-blue-400">← Blog'a dön</a>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <header className="border-b border-[#30363d] px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="/" className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">B</a>
            <span onClick={() => window.location.href = '/'} className="font-bold text-base tracking-tight text-white cursor-pointer">BİLİMCE</span>
          </div>
          <a href="/blog" className="px-4 py-2 bg-white/5 border border-[#30363d] rounded-xl text-xs text-white/60 hover:text-white transition">← Blog</a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-6">
          <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded-lg">{post.category}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white leading-snug mb-4">{post.title}</h1>
        <div className="flex items-center gap-3 text-xs text-white/30 mb-8">
          <span>{new Date(post.created_at).toLocaleDateString('tr-TR')}</span>
          <span>·</span>
          <span>BİLİMCE Blog</span>
        </div>

        <div className="bg-white/3 border border-[#30363d] rounded-2xl p-6 mb-8">
          <p className="text-white/60 text-sm italic">{post.summary}</p>
        </div>

        <div className="max-w-none">
          {post.content.split('\n\n').map((paragraph, i) => (
            <p key={i} className="text-white/80 text-base leading-relaxed mb-4">{paragraph}</p>
          ))}
        </div>

        {post.pubmed_ids?.length > 0 && (
          <div className="mt-12 pt-6 border-t border-[#30363d]">
            <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wide mb-4">🔬 Kaynak Araştırmalar</h3>
            <div className="flex flex-col gap-2">
              {post.pubmed_ids.map((id, i) => (
                <a key={i} href={`https://pubmed.ncbi.nlm.nih.gov/${id}/`} target="_blank" rel="noopener noreferrer"
                  className="text-blue-400/60 text-sm hover:text-blue-400 transition">
                  PubMed ID: {id} →
                </a>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
