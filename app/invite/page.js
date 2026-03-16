'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xlnnopufkjaqxjsmhtot.supabase.co',
  'sb_publishable_EbJEG5Y_81M3qM4isjXyaw_uUraIsAu'
)

export default function InvitePage() {
  const [user, setUser] = useState(null)
  const [inviteCode, setInviteCode] = useState(null)
  const [invites, setInvites] = useState([])
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) { window.location.href = '/auth'; return }
      setUser(data.user)
      loadInvites(data.user.id)
    })
  }, [])

  const loadInvites = async (userId) => {
    const { data } = await supabase.from('invites').select('*').eq('inviter_id', userId).order('created_at', { ascending: false })
    setInvites(data || [])
    setLoading(false)
  }

  const generateInvite = async () => {
    setGenerating(true)
    const code = Math.random().toString(36).substring(2, 10).toUpperCase()
    const { error } = await supabase.from('invites').insert({ inviter_id: user.id, invite_code: code })
    if (!error) { setInviteCode(code); loadInvites(user.id) }
    setGenerating(false)
  }

  const copyInvite = (code) => {
    const link = `${window.location.origin}/join/${code}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareWhatsApp = (code) => {
    const link = `${window.location.origin}/join/${code}`
    window.open(`https://wa.me/?text=${encodeURIComponent(`BİLİMCE'ye katıl! Türkçe bilim platformu.\n\n${link}`)}`, '_blank')
  }

  const usedCount = invites.filter(i => i.used_by).length

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

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🎁</div>
          <h1 className="text-2xl font-bold text-white mb-2">Arkadaşını Davet Et</h1>
          <p className="text-white/40 text-sm">Her başarılı davet için sen ve arkadaşın rozet kazanır!</p>
        </div>

        {/* İstatistikler */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/3 border border-white/5 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{invites.length}</div>
            <div className="text-xs text-white/40">Davet Oluşturuldu</div>
          </div>
          <div className="bg-white/3 border border-white/5 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{usedCount}</div>
            <div className="text-xs text-white/40">Kabul Edildi</div>
          </div>
          <div className="bg-white/3 border border-white/5 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{usedCount}</div>
            <div className="text-xs text-white/40">Rozet Kazanıldı</div>
          </div>
        </div>

        {/* Davet oluştur */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-6 mb-8">
          <h2 className="text-sm font-semibold text-white mb-4">🔗 Davet Linki Oluştur</h2>
          <button onClick={generateInvite} disabled={generating} className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition disabled:opacity-50 mb-4">
            {generating ? 'Oluşturuluyor...' : '+ Yeni Davet Linki Oluştur'}
          </button>

          {inviteCode && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-xs text-white/40 mb-2">Davet linkin hazır!</p>
              <p className="text-blue-300 text-sm font-mono mb-3 break-all">{window.location.origin}/join/{inviteCode}</p>
              <div className="flex gap-2">
                <button onClick={() => copyInvite(inviteCode)} className="flex-1 px-4 py-2 bg-blue-500/20 border border-blue-500/20 text-blue-300 rounded-xl text-xs hover:bg-blue-500/30 transition">
                  {copied ? '✓ Kopyalandı!' : '🔗 Kopyala'}
                </button>
                <button onClick={() => shareWhatsApp(inviteCode)} className="flex-1 px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-xs hover:bg-green-500/20 transition">
                  💬 WhatsApp
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Davet geçmişi */}
        {invites.length > 0 && (
          <div className="bg-white/3 border border-white/5 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wide mb-4">Davet Geçmişi</h2>
            <div className="flex flex-col gap-3">
              {invites.map(invite => (
                <div key={invite.id} className="flex items-center justify-between p-3 bg-white/3 rounded-xl">
                  <div>
                    <p className="text-sm font-mono text-white/60">{invite.invite_code}</p>
                    <p className="text-xs text-white/25">{new Date(invite.created_at).toLocaleDateString('tr-TR')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {invite.used_by ? (
                      <span className="px-2 py-1 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-xs">✓ Kabul Edildi</span>
                    ) : (
                      <button onClick={() => copyInvite(invite.invite_code)} className="px-3 py-1 bg-white/5 border border-white/10 text-white/40 hover:text-white rounded-lg text-xs transition">
                        🔗 Kopyala
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rozet bilgisi */}
        <div className="mt-8 p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl">
          <p className="text-xs text-yellow-400/60 text-center">🏆 Her başarılı davet için "Sosyal" rozeti kazanırsın!</p>
        </div>
      </main>
    </div>
  )
}
