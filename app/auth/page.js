'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xlnnopufkjaqxjsmhtot.supabase.co',
  'sb_publishable_EbJEG5Y_81M3qM4isjXyaw_uUraIsAu'
)

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [resetMode, setResetMode] = useState(false)

  const handleAuth = async () => {
    if (!email.trim()) { setError('Email gerekli'); return }
    if (!resetMode && !password.trim()) { setError('Şifre gerekli'); return }
    setLoading(true); setError(''); setSuccess('')
    try {
      if (resetMode) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: 'https://bilimce.vercel.app/auth'
        })
        if (error) throw error
        setSuccess('Şifre sıfırlama linki emailinize gönderildi.')
        setResetMode(false)
      } else if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        window.location.href = '/'
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setSuccess('Kayıt başarılı! Lütfen emailinizi doğrulayın.')
        setIsLogin(true)
      }
    } catch (err) {
      const msg = err.message
      if (msg.includes('Invalid login')) setError('Email veya şifre hatalı.')
      else if (msg.includes('already registered')) setError('Bu email zaten kayıtlı.')
      else if (msg.includes('Password should be')) setError('Şifre en az 6 karakter olmalı.')
      else setError(msg)
    } finally { setLoading(false) }
  }

  const handleGoogle = async () => {
    setGoogleLoading(true); setError('')
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: 'https://bilimce.vercel.app' }
      })
      if (error) throw error
    } catch (err) {
      setError('Google ile giriş başarısız.')
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/">
            <img src="/icon-192.png" alt="BİLİMCE" className="w-16 h-16 rounded-2xl mx-auto mb-4 shadow-lg shadow-blue-500/20" />
          </a>
          <h1 className="text-2xl font-bold text-white tracking-tight">BİLİMCE</h1>
          <p className="text-white/40 text-sm mt-1">
            {resetMode ? 'Şifreni sıfırla' : isLogin ? 'Hesabına giriş yap' : 'Yeni hesap oluştur'}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          {error && <p className="text-red-400 text-sm mb-4 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>}
          {success && <p className="text-green-400 text-sm mb-4 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">{success}</p>}

          {/* Google ile giriş */}
          {!resetMode && (
            <>
              <button onClick={handleGoogle} disabled={googleLoading} className="w-full flex items-center justify-center gap-3 py-3 bg-white/10 border border-white/15 rounded-xl text-sm font-medium text-white hover:bg-white/15 transition disabled:opacity-50 mb-4">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {googleLoading ? 'Yönlendiriliyor...' : 'Google ile Devam Et'}
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-white/10"></div>
                <span className="text-white/30 text-xs">veya</span>
                <div className="flex-1 h-px bg-white/10"></div>
              </div>
            </>
          )}

          {/* Email */}
          <div className="mb-4">
            <label className="text-white/50 text-xs mb-2 block">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ornek@email.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 outline-none text-sm focus:border-blue-500/50 transition" />
          </div>

          {/* Şifre */}
          {!resetMode && (
            <div className="mb-2">
              <label className="text-white/50 text-xs mb-2 block">Şifre</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                onKeyDown={e => e.key === 'Enter' && handleAuth()}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 outline-none text-sm focus:border-blue-500/50 transition" />
            </div>
          )}

          {/* Şifremi unuttum */}
          {isLogin && !resetMode && (
            <div className="flex justify-end mb-4">
              <button onClick={() => { setResetMode(true); setError(''); setSuccess('') }} className="text-xs text-white/30 hover:text-blue-400 transition">
                Şifremi unuttum
              </button>
            </div>
          )}

          {!isLogin && <div className="mb-4" />}

          <button onClick={handleAuth} disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition disabled:opacity-50">
            {loading ? 'Yükleniyor...' : resetMode ? 'Sıfırlama Linki Gönder' : isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
          </button>

          {resetMode ? (
            <p className="text-center text-white/40 text-sm mt-4">
              <button onClick={() => { setResetMode(false); setError(''); setSuccess('') }} className="text-blue-400 hover:text-blue-300">
                ← Geri dön
              </button>
            </p>
          ) : (
            <p className="text-center text-white/40 text-sm mt-4">
              {isLogin ? 'Hesabın yok mu?' : 'Zaten hesabın var mı?'}{' '}
              <button onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess('') }} className="text-blue-400 hover:text-blue-300">
                {isLogin ? 'Kayıt Ol' : 'Giriş Yap'}
              </button>
            </p>
          )}
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          Devam ederek <a href="/terms" className="hover:text-white/40 transition">Kullanım Şartları</a>'nı ve{' '}
          <a href="/privacy" className="hover:text-white/40 transition">Gizlilik Politikası</a>'nı kabul etmiş olursunuz.
        </p>
      </div>
    </div>
  )
}
