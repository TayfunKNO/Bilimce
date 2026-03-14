'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xlnnopufkjaqxjsmhtot.supabase.co',
  'sb_publishable_EbJEG5Y_81M3qM4isjXyaw_uUraIsAu'
)

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [newUsername, setNewUsername] = useState('')
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) { window.location.href = '/auth'; return }
      setUser(data.user)
      loadProfile(data.user.id)
      loadHistory(data.user.id)
    })
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
          <a href="/" className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white/60 hover:text-white transition">
            Ana Sayfa
          </a>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-white mb-8">👤 Profilim</h1>

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
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 outline-none text-sm focus:border-blue-500/50"
            />
            <button
              onClick={saveUsername}
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
          {success && <p className="text-green-400 text-xs mt-3">{success}</p>}
        </div>

        <div className="bg-white/3 border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white/60">Arama Geçmişi</h2>
            {history.length > 0 && (
              <button onClick={clearAllHistory} className="text-xs text-red-400/60 hover:text-red-400 transition">
                Tümünü Sil
              </button>
            )}
          </div>
          {history.length === 0 ? (
            <p className="text-white/30 text-sm">Henüz arama yapılmadı.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {history.map(h => (
                <div key={h.id} className="flex items-center justify-between px-4 py-3 bg-white/3 border border-white/5 rounded-xl">
                  <a href={`/?q=${encodeURIComponent(h.query)}`} className="text-sm text-white/70 hover:text-white transition">
                    🔍 {h.query}
                  </a>
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
