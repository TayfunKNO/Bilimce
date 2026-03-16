'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xlnnopufkjaqxjsmhtot.supabase.co',
  'sb_publishable_EbJEG5Y_81M3qM4isjXyaw_uUraIsAu'
)

const BADGES = [
  { key: 'first_favorite', icon: '❤️', label: 'İlk Favori', desc: 'İlk makaleyi favorile' },
  { key: 'first_comment', icon: '💬', label: 'İlk Yorum', desc: 'İlk yorumu yap' },
  { key: 'first_rating', icon: '⭐', label: 'İlk Puan', desc: 'İlk makaleyi puanla' },
  { key: 'researcher', icon: '🔬', label: 'Araştırmacı', desc: '10+ arama yap' },
  { key: 'collector', icon: '📚', label: 'Koleksiyoncu', desc: 'Koleksiyon oluştur' },
  { key: 'social', icon: '🌐', label: 'Sosyal', desc: 'Toplulukta gönderi paylaş' },
  { key: 'bookworm', icon: '🔖', label: 'Okur', desc: '5+ makale okuma listesine ekle' },
  { key: 'expert', icon: '🏆', label: 'Uzman', desc: '50+ favori makale' },
]

const AVATARS = ['🧬', '🔬', '⚛️', '🧪', '🧠', '🩺', '💊', '🌍', '🧑‍🔬', '👩‍🔬', '📊', '🔭']

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [newUsername, setNewUsername] = useState('')
  const [savingUsername, setSavingUsername] = useState(false)
  const [stats, setStats] = useState({ favorites: 0, readingList: 0, searches: 0, comments: 0, ratings: 0 })
  const [badges, setBadges] = useState([])
  const [avatar, setAvatar] = useState('🧬')
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)
  const [notifications, setNotifications] = useState(false)
  const [pushSub, setPushSub] = useState(null)
  const [topics, setTopics] = useState([])
  const [newTopic, setNewTopic] = useState('')
  const [searchHistory, setSearchHistory] = useState([])
  const [activityData, setActivityData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) { window.location.href = '/auth'; return }
      setUser(data.user)
      loadProfile(data.user.id)
    })
  }, [])

  const loadProfile = async (userId) => {
    const [
      { data: profile },
      { count: favCount },
      { count: readCount },
      { count: searchCount },
      { count: commentCount },
      { count: ratingCount },
      { data: badgeData },
      { data: avatarData },
      { data: topicData },
      { data: historyData },
      { data: searchActivity },
    ] = await Promise.all([
      supabase.from('profiles').select('username').eq('id', userId).single(),
      supabase.from('favorites').select('id', { count: 'exact' }).eq('user_id', userId),
      supabase.from('reading_list').select('id', { count: 'exact' }).eq('user_id', userId),
      supabase.from('search_history').select('id', { count: 'exact' }).eq('user_id', userId),
      supabase.from('comments').select('id', { count: 'exact' }).eq('user_id', userId),
      supabase.from('ratings').select('id', { count: 'exact' }).eq('user_id', userId),
      supabase.from('badges').select('badge_key').eq('user_id', userId),
      supabase.from('user_avatars').select('avatar').eq('user_id', userId).single(),
      supabase.from('topic_subscriptions').select('topic').eq('user_id', userId),
      supabase.from('search_history').select('query, created_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(10),
      supabase.from('search_history').select('created_at').eq('user_id', userId).gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
    ])

    if (profile?.username) { setUsername(profile.username); setNewUsername(profile.username) }
    if (avatarData?.avatar) setAvatar(avatarData.avatar)

    const s = { favorites: favCount || 0, readingList: readCount || 0, searches: searchCount || 0, comments: commentCount || 0, ratings: ratingCount || 0 }
    setStats(s)
    setBadges(badgeData?.map(b => b.badge_key) || [])
    setTopics(topicData?.map(t => t.topic) || [])
    setSearchHistory(historyData || [])

    // Aktivite grafiği — son 30 gün
    const activity = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date(); date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const count = (searchActivity || []).filter(a => a.created_at.startsWith(dateStr)).length
      activity.push({ date: dateStr, count })
    }
    setActivityData(activity)

    // Rozet kontrolü
    await checkAndAwardBadges(userId, s, badgeData?.map(b => b.badge_key) || [])

    // Push bildirimi kontrolü
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      setPushSub(sub); setNotifications(!!sub)
    }

    setLoading(false)
  }

  const checkAndAwardBadges = async (userId, s, existingBadges) => {
    const newBadges = []
    if (s.favorites >= 1 && !existingBadges.includes('first_favorite')) newBadges.push('first_favorite')
    if (s.comments >= 1 && !existingBadges.includes('first_comment')) newBadges.push('first_comment')
    if (s.ratings >= 1 && !existingBadges.includes('first_rating')) newBadges.push('first_rating')
    if (s.searches >= 10 && !existingBadges.includes('researcher')) newBadges.push('researcher')
    if (s.readingList >= 5 && !existingBadges.includes('bookworm')) newBadges.push('bookworm')
    if (s.favorites >= 50 && !existingBadges.includes('expert')) newBadges.push('expert')

    const { data: collData } = await supabase.from('collections').select('id', { count: 'exact' }).eq('user_id', userId)
    if ((collData?.length || 0) >= 1 && !existingBadges.includes('collector')) newBadges.push('collector')

    const { data: postData } = await supabase.from('community_posts').select('id', { count: 'exact' }).eq('user_id', userId)
    if ((postData?.length || 0) >= 1 && !existingBadges.includes('social')) newBadges.push('social')

    if (newBadges.length > 0) {
      await supabase.from('badges').upsert(newBadges.map(key => ({ user_id: userId, badge_key: key })))
      setBadges(prev => [...prev, ...newBadges])
    }
  }

  const saveUsername = async () => {
    if (!newUsername.trim() || !user) return
    setSavingUsername(true)
    await supabase.from('profiles').upsert({ id: user.id, username: newUsername.trim() })
    setUsername(newUsername.trim())
    setSavingUsername(false)
  }

  const saveAvatar = async (emoji) => {
    setAvatar(emoji); setShowAvatarPicker(false)
    await supabase.from('user_avatars').upsert({ user_id: user.id, avatar: emoji })
  }

  const toggleNotifications = async () => {
    if (notifications) {
      if (pushSub) { await pushSub.unsubscribe(); setPushSub(null) }
      await supabase.from('push_subscriptions').delete().eq('user_id', user.id)
      setNotifications(false)
    } else {
      try {
        const reg = await navigator.serviceWorker.ready
        const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: 'BEtOdaXxiV3Bl4TNOO42Ir1s1quGBR0QePpK3iHg2b4T5Mvpl6i4qCj15PDD54eJ78j0l8VrONIC2F5WWcThUzo' })
        await supabase.from('push_subscriptions').upsert({ user_id: user.id, subscription: JSON.stringify(sub) })
        setPushSub(sub); setNotifications(true)
      } catch {}
    }
  }

  const addTopic = async () => {
    if (!newTopic.trim() || topics.includes(newTopic.trim())) return
    await supabase.from('topic_subscriptions').insert({ user_id: user.id, topic: newTopic.trim() })
    setTopics(prev => [...prev, newTopic.trim()]); setNewTopic('')
  }

  const removeTopic = async (topic) => {
    await supabase.from('topic_subscriptions').delete().eq('user_id', user.id).eq('topic', topic)
    setTopics(prev => prev.filter(t => t !== topic))
  }

  const maxActivity = Math.max(...activityData.map(d => d.count), 1)

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="text-white/30">Yükleniyor...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-white/5 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="/" className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">B</a>
            <span className="font-bold text-base tracking-tight text-white">BİLİMCE</span>
          </div>
          <a href="/" className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white/60 hover:text-white transition">Ana Sayfa</a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Profil başlığı */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <button onClick={() => setShowAvatarPicker(!showAvatarPicker)} className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-4xl hover:bg-white/20 transition">
                {avatar}
              </button>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white">✎</div>
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white">{username || 'Kullanıcı'}</h1>
              <p className="text-white/40 text-sm">{user?.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-blue-400">{badges.length} rozet</span>
                <span className="text-white/20">·</span>
                <span className="text-xs text-white/40">{stats.favorites} favori</span>
              </div>
            </div>
          </div>

          {showAvatarPicker && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
              <p className="text-xs text-white/40 mb-3">Avatar seç</p>
              <div className="grid grid-cols-6 gap-2">
                {AVATARS.map(emoji => (
                  <button key={emoji} onClick={() => saveAvatar(emoji)} className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl hover:bg-white/10 transition ${avatar === emoji ? 'bg-blue-500/30 border border-blue-500/50' : ''}`}>
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <input type="text" value={newUsername} onChange={e => setNewUsername(e.target.value)} placeholder="Kullanıcı adı" maxLength={20} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-white/25 outline-none text-sm" />
            <button onClick={saveUsername} disabled={savingUsername || newUsername === username} className="px-4 py-2 bg-blue-500/20 border border-blue-500/20 text-blue-300 rounded-xl text-sm hover:bg-blue-500/30 transition disabled:opacity-50">
              {savingUsername ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </div>

        {/* İstatistikler */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          {[
            { label: 'Favori', value: stats.favorites, icon: '❤️', href: '/favorites' },
            { label: 'Okuma', value: stats.readingList, icon: '🔖', href: '/reading-list' },
            { label: 'Arama', value: stats.searches, icon: '🔍', href: null },
            { label: 'Yorum', value: stats.comments, icon: '💬', href: null },
            { label: 'Puan', value: stats.ratings, icon: '⭐', href: null },
          ].map((stat, i) => (
            stat.href ? (
              <a key={i} href={stat.href} className="bg-white/3 border border-white/5 rounded-xl p-3 text-center hover:border-white/10 transition">
                <div className="text-xl mb-1">{stat.icon}</div>
                <div className="text-lg font-bold text-white">{stat.value}</div>
                <div className="text-xs text-white/40">{stat.label}</div>
              </a>
            ) : (
              <div key={i} className="bg-white/3 border border-white/5 rounded-xl p-3 text-center">
                <div className="text-xl mb-1">{stat.icon}</div>
                <div className="text-lg font-bold text-white">{stat.value}</div>
                <div className="text-xs text-white/40">{stat.label}</div>
              </div>
            )
          ))}
        </div>

        {/* Aktivite grafiği */}
        <div className="bg-white/3 border border-white/5 rounded-2xl p-5 mb-6">
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wide mb-4">📈 Son 30 Gün Aktivite</h2>
          <div className="flex items-end gap-1 h-16">
            {activityData.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full" title={`${day.date}: ${day.count} arama`}>
                <div
                  className="w-full rounded-sm transition-all"
                  style={{
                    height: day.count === 0 ? '4px' : `${Math.max(8, (day.count / maxActivity) * 56)}px`,
                    background: day.count === 0 ? 'rgba(255,255,255,0.05)' : `rgba(59,130,246,${0.3 + (day.count / maxActivity) * 0.7})`,
                  }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-white/20 mt-2">
            <span>30 gün önce</span>
            <span>Bugün</span>
          </div>
        </div>

        {/* Rozetler */}
        <div className="bg-white/3 border border-white/5 rounded-2xl p-5 mb-6">
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wide mb-4">🏅 Rozetler ({badges.length}/{BADGES.length})</h2>
          <div className="grid grid-cols-2 gap-3">
            {BADGES.map(badge => {
              const earned = badges.includes(badge.key)
              return (
                <div key={badge.key} className={`flex items-center gap-3 p-3 rounded-xl border transition ${earned ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-white/3 border-white/5 opacity-40'}`}>
                  <div className="text-2xl">{badge.icon}</div>
                  <div>
                    <div className={`text-sm font-semibold ${earned ? 'text-yellow-300' : 'text-white/50'}`}>{badge.label}</div>
                    <div className="text-xs text-white/30">{badge.desc}</div>
                  </div>
                  {earned && <div className="ml-auto text-green-400 text-xs">✓</div>}
                </div>
              )
            })}
          </div>
        </div>

        {/* Bildirimler */}
        <div className="bg-white/3 border border-white/5 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wide">🔔 Bildirimler</h2>
            <button onClick={toggleNotifications} className={`px-4 py-2 rounded-xl text-xs font-medium transition ${notifications ? 'bg-green-500/20 border border-green-500/20 text-green-300' : 'bg-white/5 border border-white/10 text-white/50 hover:text-white'}`}>
              {notifications ? '✓ Açık' : 'Aç'}
            </button>
          </div>

          <div className="mb-3">
            <p className="text-xs text-white/40 mb-2">Takip ettiğin konular</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {topics.map(topic => (
                <span key={topic} className="flex items-center gap-1 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-300 rounded-lg text-xs">
                  {topic}
                  <button onClick={() => removeTopic(topic)} className="text-white/30 hover:text-red-400 transition ml-1">✕</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" value={newTopic} onChange={e => setNewTopic(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTopic()} placeholder="Konu ekle (örn: kanser, alzheimer)" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-white/25 outline-none text-sm" />
              <button onClick={addTopic} className="px-4 py-2 bg-blue-500/20 border border-blue-500/20 text-blue-300 rounded-xl text-sm hover:bg-blue-500/30 transition">Ekle</button>
            </div>
          </div>
        </div>

        {/* Arama geçmişi */}
        {searchHistory.length > 0 && (
          <div className="bg-white/3 border border-white/5 rounded-2xl p-5 mb-6">
            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wide mb-4">🕐 Arama Geçmişi</h2>
            <div className="flex flex-col gap-2">
              {searchHistory.map((item, i) => (
                <a key={i} href={`/?q=${encodeURIComponent(item.query)}`} className="flex items-center justify-between px-3 py-2 bg-white/3 rounded-xl hover:bg-white/5 transition">
                  <span className="text-sm text-white/70">{item.query}</span>
                  <span className="text-xs text-white/25">{new Date(item.created_at).toLocaleDateString('tr-TR')}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Çıkış */}
        <button onClick={async () => { await supabase.auth.signOut(); window.location.href = '/' }} className="w-full px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm hover:bg-red-500/20 transition">
          Çıkış Yap
        </button>
      </main>
    </div>
  )
}
