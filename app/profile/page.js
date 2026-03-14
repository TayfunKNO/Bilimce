'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xlnnopufkjaqxjsmhtot.supabase.co',
  'sb_publishable_EbJEG5Y_81M3qM4isjXyaw_uUraIsAu'
)

const VAPID_PUBLIC_KEY = 'BEtOdaXxiV3Bl4TNOO42Ir1s1quGBR0QePpK3iHg2b4T5Mvpl6i4qCj15PDD54eJ78j0l8VrONIC2F5WWcThUzo'

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [newUsername, setNewUsername] = useState('')
  const [history, setHistory] = useState([])
  const [subscriptions, setSubscriptions] = useState([])
  const [newTopic, setNewTopic] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [notifPermission, setNotifPermission] = useState('default')
  const [notifLoading, setNotifLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) { window.location.href = '/auth'; return }
      setUser(data.user)
      loadProfile(data.user.id)
      loadHistory(data.user.id)
      loadSubscriptions(data.user.id)
    })
    if ('Notification' in window) {
      setNotifPermission(Notification.permission)
    }
  }, [])

  const loadProfile = async (userId) => {
    const { data } = await supabase.from('profiles').select('username').eq('id', userId).single()
    if (data?.username) {
      setUsername(data.username)
      setNewUsername(data.username)
    }
    setLoading(false)
  }

  const loadHistory = async (userId) => {
    const { data } = await supabase
      .from('search_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)
    setHistory(data || [])
  }

  const loadSubscriptions = async (userId) => {
    const { data } = await supabase
      .from('topic_subscriptions')
      .select('*')
      .eq('user_id', userId)
    setSubscriptions(data || [])
  }

  const saveUsername = async () => {
    if (!newUsername.trim()) return
    setSaving(true)
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      username: newUsername.trim(),
      email: user.email,
    })
    if (!error) {
      setUsername(newUsername.trim())
      setSuccess('Kullanıcı adı kaydedildi!')
      setTimeout(() => setSuccess(''), 3000)
    }
    setSaving(false)
  }

  const enableNotifications = async () => {
    setNotifLoading(true)
    try {
      const permission = await Notification.requestPermission()
      setNotifPermission(permission)
      if (permission === 'granted') {
        const reg = await navigator.serviceWorker.register('/sw.js')
        await navigator.serviceWorker.ready
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        })
        await supabase.from('push_subscriptions').upsert({
          user_id: user.id,
          subscription: sub.toJSON(),
        })
        setSuccess('Bildirimler aktif!')
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (err) {
      console.error('Bildirim hatasi:', err)
    }
    setNotifLoading(false)
  }

  const addTopic = async () => {
    if (!newTopic.trim()) return
    const { error } = await supabase.from('topic_subscriptions').insert({
      user_id: user.id,
      topic: newTopic.trim().toLowerCase(),
    })
    if (!error) {
      setSubscriptions(prev => [...prev, { topic: newTopic.trim().toLowerCase() }])
      setNewTopic('')
    }
  }

  const removeTopic = async (topic) => {
    await supabase.from('topic_subscriptions').delete().eq('user_id', user.id).eq('topic', topic)
    setSubscriptions(prev => prev.filter(s => s.topic !== topic))
  }

  const deleteHistory = async (id) => {
    await supabase.from('search_history').delete().eq('id', id)
    setHistory(prev => prev.filter(h => h.id !== id))
  }

  const clearAllHistory = async () => {
    await supabase.from('search_history').delete().eq('user_id', user.id)
    setHistory([])
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="text-white/30">Yükleniyor...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-white/5 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold">B</a>
            <span className="font-bold text-lg tracking-tight">BİLİMCE</span>
          </div>
          <a href="/" className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white/60 hover:text-white transition">Ana Sayfa</a>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-white mb-8">👤 Profilim</h1>

        {success && <p className="text-green-400 text-sm mb-4 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">{success}</p>}

        <div className="bg-white/3 border border-white/5 rounded-2xl p-6 mb-6">
          <h2 className="text-sm font-semibold text-white/60 mb-4">Hesap Bilgileri</h2>
          <p className="text-white/40 text-xs mb-4">{user?.email}</p>
          <label className="text-white/50 text-xs mb-2 block">Kullanıcı Adı</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={newUsername}
              onChange={e => setNewUsername(e.target.value)}
              placeholder="kullanici_adi"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 outline-none text-sm"
            />
            <button onClick={saveUsername} disabled={saving} className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-50">
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </div>

        <div className="bg-white/3 border border-white/5 rounded-2xl p-6 mb-6">
          <h2 className="text-sm font-semibold text-white/60 mb-4">🔔 Bildirimler</h2>
          {notifPermission === 'granted' ? (
            <p className="text-green-400 text-sm mb-4">✓ Bildirimler aktif</p>
          ) : (
            <button
              onClick={enableNotifications}
              disabled={notifLoading}
              className="w-full py-3 bg-blue-500/20 border border-blue-500/20 text-blue-300 rounded-xl text-sm hover:bg-blue-500/30 transition disabled:opacity-50 mb-4"
            >
              {notifLoading ? 'Aktif ediliyor...' : '🔔 Bildirimleri Aç'}
            </button>
          )}
          <label className="text-white/50 text-xs mb-2 block">Konu Takip Et</label>
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={newTopic}
              onChange={e => setNewTopic(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTopic()}
              placeholder="kanser, alzheimer..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 outline-none text-sm"
            />
            <button onClick={addTopic} className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-sm font-semibold hover:opacity-90 transition">
              Ekle
            </button>
          </div>
          {subscriptions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {subscriptions.map(s => (
                <div key={s.topic} className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <span className="text-blue-300 text-xs">{s.topic}</span>
                  <button onClick={() => removeTopic(s.topic)} className="text-white/30 hover:text-red-400 transition text-xs">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white/3 border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white/60">Arama Geçmişi</h2>
            {history.length > 0 && (
              <button onClick={clearAllHistory} className="text-xs text-red-400/60 hover:text-red-400 transition">Tümünü Sil</button>
            )}
          </div>
          {history.length === 0 ? (
            <p className="text-white/30 text-sm">Henüz arama yapılmadı.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {history.map(h => (
                <div key={h.id} className="flex items-center justify-between px-4 py-3 bg-white/3 border border-white/5 rounded-xl">
                  <a href={`/?q=${encodeURIComponent(h.query)}`} className="text-sm text-white/70 hover:text-white transition">🔍 {h.query}</a>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-white/25">{new Date(h.created_at).toLocaleDateString('tr-TR')}</span>
                    <button onClick={() => deleteHistory(h.id)} className="text-white/25 hover:text-red-400 transition text-xs">✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
