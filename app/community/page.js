'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xlnnopufkjaqxjsmhtot.supabase.co',
  'sb_publishable_EbJEG5Y_81M3qM4isjXyaw_uUraIsAu'
)

const CATEGORIES = [
  { id: 'genel', label: 'Genel', icon: '💬' },
  { id: 'kanser', label: 'Kanser', icon: '🎗️' },
  { id: 'nöroloji', label: 'Nöroloji', icon: '🧠' },
  { id: 'beslenme', label: 'Beslenme', icon: '🥗' },
  { id: 'spor', label: 'Spor & Fitness', icon: '💪' },
  { id: 'kardiyoloji', label: 'Kardiyoloji', icon: '❤️' },
  { id: 'psikoloji', label: 'Psikoloji', icon: '🧘' },
  { id: 'ilaç', label: 'İlaç & Tedavi', icon: '💊' },
]

export default function CommunityPage() {
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedPost, setSelectedPost] = useState(null)
  const [replies, setReplies] = useState([])
  const [repliesLoading, setRepliesLoading] = useState(false)
  const [newReply, setNewReply] = useState('')
  const [submittingReply, setSubmittingReply] = useState(false)
  const [showNewPost, setShowNewPost] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [newCategory, setNewCategory] = useState('genel')
  const [submittingPost, setSubmittingPost] = useState(false)
  const [userLikes, setUserLikes] = useState({})

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null)
      if (data?.user) { loadUsername(data.user.id); loadUserLikes(data.user.id) }
    })
    loadPosts()
  }, [])

  const loadUsername = async (userId) => {
    const { data } = await supabase.from('profiles').select('username').eq('id', userId).single()
    if (data?.username) setUsername(data.username)
  }

  const loadUserLikes = async (userId) => {
    const { data } = await supabase.from('community_likes').select('post_id').eq('user_id', userId)
    if (data) { const m = {}; data.forEach(l => { m[l.post_id] = true }); setUserLikes(m) }
  }

  const loadPosts = async (category = null) => {
    setLoading(true)
    let query = supabase.from('community_posts').select('*').order('created_at', { ascending: false })
    if (category && category !== 'all') query = query.eq('category', category)
    const { data } = await query
    setPosts(data || [])
    setLoading(false)
  }

  const openPost = async (post) => {
    setSelectedPost(post)
    setRepliesLoading(true)
    const { data } = await supabase.from('community_replies').select('*').eq('post_id', post.id).order('created_at', { ascending: true })
    setReplies(data || [])
    setRepliesLoading(false)
  }

  const submitPost = async () => {
    if (!newTitle.trim() || !newContent.trim() || !user) return
    setSubmittingPost(true)
    const name = username || user.email?.split('@')[0]
    const { error } = await supabase.from('community_posts').insert({
      user_id: user.id, username: name, title: newTitle.trim(), content: newContent.trim(), category: newCategory
    })
    if (!error) {
      setNewTitle(''); setNewContent(''); setNewCategory('genel'); setShowNewPost(false)
      loadPosts(activeCategory === 'all' ? null : activeCategory)
    }
    setSubmittingPost(false)
  }

  const submitReply = async () => {
    if (!newReply.trim() || !user || !selectedPost) return
    setSubmittingReply(true)
    const name = username || user.email?.split('@')[0]
    const { error } = await supabase.from('community_replies').insert({
      post_id: selectedPost.id, user_id: user.id, username: name, content: newReply.trim()
    })
    if (!error) {
      setNewReply('')
      const { data } = await supabase.from('community_replies').select('*').eq('post_id', selectedPost.id).order('created_at', { ascending: true })
      setReplies(data || [])
      // Güncelle reply sayısı
      await supabase.from('community_posts').update({ likes: selectedPost.likes }).eq('id', selectedPost.id)
    }
    setSubmittingReply(false)
  }

  const toggleLike = async (post) => {
    if (!user) { window.location.href = '/auth'; return }
    const isLiked = userLikes[post.id]
    if (isLiked) {
      await supabase.from('community_likes').delete().eq('user_id', user.id).eq('post_id', post.id)
      await supabase.from('community_posts').update({ likes: Math.max(0, post.likes - 1) }).eq('id', post.id)
      setUserLikes(prev => { const n = { ...prev }; delete n[post.id]; return n })
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, likes: Math.max(0, p.likes - 1) } : p))
      if (selectedPost?.id === post.id) setSelectedPost(prev => ({ ...prev, likes: Math.max(0, prev.likes - 1) }))
    } else {
      await supabase.from('community_likes').insert({ user_id: user.id, post_id: post.id })
      await supabase.from('community_posts').update({ likes: post.likes + 1 }).eq('id', post.id)
      setUserLikes(prev => ({ ...prev, [post.id]: true }))
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, likes: p.likes + 1 } : p))
      if (selectedPost?.id === post.id) setSelectedPost(prev => ({ ...prev, likes: prev.likes + 1 }))
    }
  }

  const deletePost = async (postId) => {
    await supabase.from('community_posts').delete().eq('id', postId)
    setPosts(prev => prev.filter(p => p.id !== postId))
    if (selectedPost?.id === postId) setSelectedPost(null)
  }

  const deleteReply = async (replyId) => {
    await supabase.from('community_replies').delete().eq('id', replyId)
    setReplies(prev => prev.filter(r => r.id !== replyId))
  }

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat)
    setSelectedPost(null)
    loadPosts(cat === 'all' ? null : cat)
  }

  const getCategoryInfo = (id) => CATEGORIES.find(c => c.id === id) || { label: id, icon: '💬' }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-white/5 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="/" className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">B</a>
            <span className="font-bold text-base tracking-tight text-white">BİLİMCE</span>
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <button onClick={() => setShowNewPost(!showNewPost)} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-xs font-semibold text-white hover:opacity-90 transition">
                + Yeni Gönderi
              </button>
            ) : (
              <a href="/auth" className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white/60 hover:text-white transition">Giriş Yap</a>
            )}
            <a href="/" className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white/60 hover:text-white transition">Ana Sayfa</a>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">🌐 Topluluk</h1>
          <p className="text-white/40 text-sm">Bilim meraklılarıyla tartış, soru sor, paylaş</p>
        </div>

        {/* Yeni gönderi formu */}
        {showNewPost && user && (
          <div className="bg-white/3 border border-white/10 rounded-2xl p-6 mb-6">
            <h2 className="text-sm font-semibold text-white/60 mb-4">Yeni Gönderi</h2>
            <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Başlık..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 outline-none text-sm mb-3" />
            <textarea value={newContent} onChange={e => setNewContent(e.target.value)} placeholder="Ne düşünüyorsun? Bir araştırma paylaş, soru sor..." rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 outline-none text-sm resize-none mb-3" />
            <div className="flex flex-wrap gap-2 mb-4">
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setNewCategory(cat.id)} className={`px-3 py-1.5 rounded-xl text-xs transition ${newCategory === cat.id ? 'bg-blue-500/30 border border-blue-500/50 text-blue-200' : 'bg-white/5 border border-white/10 text-white/50 hover:text-white'}`}>
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={submitPost} disabled={submittingPost || !newTitle.trim() || !newContent.trim()} className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition disabled:opacity-50">
                {submittingPost ? 'Gönderiliyor...' : 'Paylaş'}
              </button>
              <button onClick={() => setShowNewPost(false)} className="px-6 py-2.5 bg-white/5 border border-white/10 text-white/50 rounded-xl text-sm hover:text-white transition">İptal</button>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          {/* Sol — kategoriler */}
          <div className="hidden sm:block w-44 shrink-0">
            <div className="bg-white/3 border border-white/5 rounded-2xl p-3">
              <button onClick={() => handleCategoryChange('all')} className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs transition mb-1 ${activeCategory === 'all' ? 'bg-blue-500/20 text-blue-300' : 'text-white/50 hover:text-white hover:bg-white/5'}`}>
                <span>🌐</span><span>Tümü</span>
              </button>
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => handleCategoryChange(cat.id)} className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs transition mb-1 ${activeCategory === cat.id ? 'bg-blue-500/20 text-blue-300' : 'text-white/50 hover:text-white hover:bg-white/5'}`}>
                  <span>{cat.icon}</span><span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sağ — gönderiler veya gönderi detayı */}
          <div className="flex-1 min-w-0">
            {/* Mobil kategori */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4 sm:hidden">
              <button onClick={() => handleCategoryChange('all')} className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition ${activeCategory === 'all' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-white/5 border border-white/5 text-white/50'}`}>🌐 Tümü</button>
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => handleCategoryChange(cat.id)} className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition ${activeCategory === cat.id ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-white/5 border border-white/5 text-white/50'}`}>{cat.icon} {cat.label}</button>
              ))}
            </div>

            {!selectedPost ? (
              <>
                {loading && (
                  <div className="grid gap-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="bg-white/3 border border-white/5 rounded-2xl p-5 animate-pulse">
                        <div className="h-4 bg-white/10 rounded w-3/4 mb-3"></div>
                        <div className="h-3 bg-white/5 rounded w-full"></div>
                      </div>
                    ))}
                  </div>
                )}
                {!loading && posts.length === 0 && (
                  <div className="text-center py-20 text-white/30">
                    <div className="text-5xl mb-4">💬</div>
                    <p>Henüz gönderi yok</p>
                    <p className="text-xs mt-2">İlk gönderiyi sen yap!</p>
                  </div>
                )}
                {!loading && posts.length > 0 && (
                  <div className="grid gap-3">
                    {posts.map(post => {
                      const cat = getCategoryInfo(post.category)
                      return (
                        <div key={post.id} className="bg-white/3 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white/40">{cat.icon} {cat.label}</span>
                              </div>
                              <button onClick={() => openPost(post)} className="text-left">
                                <h2 className="font-semibold text-white leading-snug hover:text-blue-300 transition mb-1">{post.title}</h2>
                                <p className="text-white/50 text-sm line-clamp-2">{post.content}</p>
                              </button>
                            </div>
                            {user && user.id === post.user_id && (
                              <button onClick={() => deletePost(post.id)} className="text-white/20 hover:text-red-400 transition text-xs shrink-0">✕</button>
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-3 text-xs text-white/30">
                              <span>👤 {post.username}</span>
                              <span>{new Date(post.created_at).toLocaleDateString('tr-TR')}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <button onClick={() => openPost(post)} className="text-xs text-white/30 hover:text-white/60 transition">
                                💬 Yanıtla
                              </button>
                              <button onClick={() => toggleLike(post)} className={`flex items-center gap-1 text-xs transition ${userLikes[post.id] ? 'text-red-400' : 'text-white/30 hover:text-white/60'}`}>
                                {userLikes[post.id] ? '❤️' : '🤍'} {post.likes}
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </>
            ) : (
              <div>
                <button onClick={() => setSelectedPost(null)} className="text-white/40 hover:text-white transition text-sm mb-4 block">← Gönderiler</button>
                
                {/* Gönderi detayı */}
                <div className="bg-white/3 border border-white/10 rounded-2xl p-6 mb-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white/40">
                          {getCategoryInfo(selectedPost.category).icon} {getCategoryInfo(selectedPost.category).label}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-white mb-3">{selectedPost.title}</h2>
                      <p className="text-white/70 text-sm leading-relaxed">{selectedPost.content}</p>
                    </div>
                    {user && user.id === selectedPost.user_id && (
                      <button onClick={() => deletePost(selectedPost.id)} className="text-white/20 hover:text-red-400 transition text-xs shrink-0">✕</button>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-3 text-xs text-white/30">
                      <span>👤 {selectedPost.username}</span>
                      <span>{new Date(selectedPost.created_at).toLocaleDateString('tr-TR')}</span>
                    </div>
                    <button onClick={() => toggleLike(selectedPost)} className={`flex items-center gap-1 text-sm transition ${userLikes[selectedPost.id] ? 'text-red-400' : 'text-white/30 hover:text-white/60'}`}>
                      {userLikes[selectedPost.id] ? '❤️' : '🤍'} {selectedPost.likes}
                    </button>
                  </div>
                </div>

                {/* Yanıtlar */}
                <h3 className="text-sm font-semibold text-white/50 mb-3">💬 Yanıtlar ({replies.length})</h3>
                
                {repliesLoading && <div className="text-white/30 text-sm py-4">Yükleniyor...</div>}
                
                {!repliesLoading && replies.length > 0 && (
                  <div className="flex flex-col gap-3 mb-4">
                    {replies.map(reply => (
                      <div key={reply.id} className="bg-white/3 border border-white/5 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-blue-400 text-xs font-semibold">👤 {reply.username}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-white/25 text-xs">{new Date(reply.created_at).toLocaleDateString('tr-TR')}</span>
                            {user && user.id === reply.user_id && (
                              <button onClick={() => deleteReply(reply.id)} className="text-white/25 hover:text-red-400 transition text-xs">✕</button>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-white/70 leading-relaxed">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {user ? (
                  <div>
                    <textarea value={newReply} onChange={e => setNewReply(e.target.value)} placeholder="Yanıtını yaz..." rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 outline-none text-sm resize-none mb-3" />
                    <button onClick={submitReply} disabled={submittingReply || !newReply.trim()} className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition disabled:opacity-50">
                      {submittingReply ? 'Gönderiliyor...' : 'Yanıtla'}
                    </button>
                  </div>
                ) : (
                  <div className="p-4 bg-white/3 border border-white/5 rounded-xl text-center">
                    <p className="text-white/40 text-sm mb-3">Yanıtlamak için giriş yapın</p>
                    <a href="/auth" className="px-6 py-2 bg-blue-500/20 border border-blue-500/20 text-blue-300 rounded-xl text-sm hover:bg-blue-500/30 transition">Giriş Yap</a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
