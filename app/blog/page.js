'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://lypjtxqvusqndqawugxu.supabase.co',
  'sb_publishable_rqtzTjZBNww4u56gNNCI4A_OS_ID1Bo'
)

export default function BlogPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(20)
    setPosts(data || [])
    setLoading(false)
  }

  const generatePost = async () => {
  setGenerating(true)
  try {
    const res = await fetch('/api/blog-generate')
    const data = await res.json()
    console.log('Blog generate result:', data)
    if (data.success) loadPosts()
    else alert(JSON.stringify(data))
  } catch (err) {
    alert(err.message)
  }
  setGenerating(false)
}


  return (
    <div className="min-h-screen bg-[#0d1117]">
      <header className="border-b border-[#30363d] px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="/" className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">B</a>
            <span className="font-bold text-base tracking-tight text-white cursor-pointer" onClick={() => window.location.href = '/'}>BİLİMCE</span>
          </div>
          <a href="/" className="px-4 py-2 bg-white/5 border border-[#30363d] rounded-xl text-xs text-white/60 hover:text-white transition">← Ana Sayfa</a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">📝 Bilim Blogu</h1>
            <p className="text-white/40 text-sm">En güncel bilimsel araştırmalar, sade Türkçe ile</p>
          </div>
          <button onClick={generatePost} disabled={generating}
            className="px-4 py-2 bg-purple-500/20 border border-purple-500/20 text-purple-300 rounded-xl text-xs font-medium hover:bg-purple-500/30 transition disabled:opacity-50">
            {generating ? '⏳ Oluşturuluyor...' : '✨ Yeni Yazı Üret'}
          </button>
        </div>

        {loading ? (
          <div className="grid gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white/3 border border-[#30363d] rounded-2xl p-6 animate-pulse">
                <div className="h-4 bg-white/10 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-white/5 rounded w-full mb-2"></div>
                <div className="h-3 bg-white/5 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📝</div>
            <p className="text-white/40 text-sm mb-6">Henüz blog yazısı yok.</p>
            <button onClick={generatePost} disabled={generating}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition disabled:opacity-50">
              {generating ? '⏳ Oluşturuluyor...' : '✨ İlk Yazıyı Oluştur'}
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {posts.map(post => (
              <a key={post.id} href={`/blog/${post.slug}`} className="bg-white/3 border border-[#30363d] rounded-2xl p-6 hover:border-blue-500/30 transition-all block group">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h2 className="font-semibold text-white leading-snug group-hover:text-blue-400 transition">{post.title}</h2>
                  <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded-lg shrink-0">{post.category}</span>
                </div>
                <p className="text-white/50 text-sm leading-relaxed mb-3">{post.summary}</p>
                <div className="flex items-center gap-3 text-xs text-white/30">
                  <span>{new Date(post.created_at).toLocaleDateString('tr-TR')}</span>
                  <span>·</span>
                  <span className="text-blue-400/60">Devamını oku →</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

