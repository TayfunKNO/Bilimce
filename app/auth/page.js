'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleAuth = async () => {
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        window.location.href = '/'
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setSuccess('Kayit basarili! Giris yapabilirsiniz.')
        setIsLogin(true)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl font-bold mx-auto mb-4">B</div>
          <h1 className="text-2xl font-bold text-white">BILIMCE</h1>
          <p className="text-white/40 text-sm mt-1">{isLogin ? 'Hesabina giris yap' : 'Yeni hesap olustur'}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          {error && <p className="text-red-400 text-sm mb-4 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>}
          {success && <p className="text-green-400 text-sm mb-4 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">{success}</p>}
          <div className="mb-4">
            <label className="text-white/50 text-xs mb-2 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="ornek@email.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 outline-none text-sm focus:border-blue-500/50"
            />
          </div>
          <div className="mb-6">
            <label className="text-white/50 text-xs mb-2 block">Sifre</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              onKeyDown={e => e.key === 'Enter' && handleAuth()}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 outline-none text-sm focus:border-blue-500/50"
            />
          </div>
          <button
            onClick={handleAuth}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Yukleniyor...' : isLogin ? 'Giris Yap' : 'Kayit Ol'}
          </button>
          <p className="text-center text-white/40 text-sm mt-4">
            {isLogin ? 'Hesabin yok mu?' : 'Zaten hesabin var mi?'}{' '}
            <button onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess('') }} className="text-blue-400 hover:text-blue-300">
              {isLogin ? 'Kayit Ol' : 'Giris Yap'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
