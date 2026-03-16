'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xlnnopufkjaqxjsmhtot.supabase.co',
  'sb_publishable_EbJEG5Y_81M3qM4isjXyaw_uUraIsAu'
)

export default function JoinPage({ params }) {
  const [status, setStatus] = useState('loading')
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null)
      if (data?.user) {
        processInvite(data.user.id)
      } else {
        setStatus('login')
      }
    })
  }, [])

  const processInvite = async (userId) => {
    const { data: invite } = await supabase.from('invites').select('*').eq('invite_code', params.code.toUpperCase()).single()
    if (!invite) { setStatus('invalid'); return }
    if (invite.used_by) { setStatus('used'); return }
    if (invite.inviter_id === userId) { setStatus('own'); return }

    // Daveti kullan
    await supabase.from('invites').update({ used_by: userId, used_at: new Date().toISOString() }).eq('id', invite.id)

    // Davet edene rozet ver
    await supabase.from('badges').upsert({ user_id: invite.inviter_id, badge_key: 'inviter' })

    // Davet edilene rozet ver
    await supabase.from('badges').upsert({ user_id: userId, badge_key: 'invited' })

    setStatus('success')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white mx-auto mb-6">B</div>

        {status === 'loading' && (
          <>
            <div className="text-4xl mb-4">⏳</div>
            <h1 className="text-xl font-bold text-white mb-2">Davet İşleniyor...</h1>
          </>
        )}

        {status === 'login' && (
          <>
            <div className="text-4xl mb-4">🎁</div>
            <h1 className="text-xl font-bold text-white mb-2">Davet Linki</h1>
            <p className="text-white/40 text-sm mb-6">BİLİMCE'ye katılmak için giriş yap veya hesap oluştur.</p>
            <a href={`/auth?redirect=/join/${params.code}`} className="block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition mb-3">
              Giriş Yap / Kayıt Ol
            </a>
            <a href="/" className="block px-6 py-3 bg-white/5 border border-white/10 text-white/60 rounded-xl text-sm hover:text-white transition">
              Ana Sayfaya Dön
            </a>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-4xl mb-4">🎉</div>
            <h1 className="text-xl font-bold text-white mb-2">Hoş Geldin!</h1>
            <p className="text-white/40 text-sm mb-2">Davet başarıyla kabul edildi.</p>
            <p className="text-yellow-400 text-sm mb-6">🏆 "Davetli" rozeti kazandın!</p>
            <a href="/" className="block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition">
              BİLİMCE'yi Keşfet →
            </a>
          </>
        )}

        {status === 'invalid' && (
          <>
            <div className="text-4xl mb-4">❌</div>
            <h1 className="text-xl font-bold text-white mb-2">Geçersiz Davet</h1>
            <p className="text-white/40 text-sm mb-6">Bu davet linki geçerli değil.</p>
            <a href="/" className="block px-6 py-3 bg-white/5 border border-white/10 text-white/60 rounded-xl text-sm hover:text-white transition">Ana Sayfaya Dön</a>
          </>
        )}

        {status === 'used' && (
          <>
            <div className="text-4xl mb-4">⚠️</div>
            <h1 className="text-xl font-bold text-white mb-2">Davet Kullanılmış</h1>
            <p className="text-white/40 text-sm mb-6">Bu davet linki daha önce kullanıldı.</p>
            <a href="/" className="block px-6 py-3 bg-white/5 border border-white/10 text-white/60 rounded-xl text-sm hover:text-white transition">Ana Sayfaya Dön</a>
          </>
        )}

        {status === 'own' && (
          <>
            <div className="text-4xl mb-4">😄</div>
            <h1 className="text-xl font-bold text-white mb-2">Kendi Davetiniz</h1>
            <p className="text-white/40 text-sm mb-6">Kendi davet linkinizi kullanamazsınız. Arkadaşlarınızla paylaşın!</p>
            <a href="/" className="block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition">Ana Sayfaya Dön</a>
          </>
        )}
      </div>
    </div>
  )
}
