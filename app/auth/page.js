'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://lypjtxqvusqndqawugxu.supabase.co',
  'sb_publishable_rqtzTjZBNww4u56gNNCI4A_OS_ID1Bo'
)

const UI = {
  tr: {
    login: 'Hesabına giriş yap', register: 'Yeni hesap oluştur', reset: 'Şifreni sıfırla',
    email: 'Email', password: 'Şifre', emailPlaceholder: 'ornek@email.com',
    google: 'Google ile Devam Et', googleLoading: 'Yönlendiriliyor...',
    apple: 'Apple ile Devam Et',
    or: 'veya', forgot: 'Şifremi unuttum',
    loading: 'Yükleniyor...', resetBtn: 'Sıfırlama Linki Gönder',
    loginBtn: 'Giriş Yap', registerBtn: 'Kayıt Ol',
    noAccount: 'Hesabın yok mu?', hasAccount: 'Zaten hesabın var mı?',
    backBtn: '← Geri dön',
    terms: 'Kullanım Şartları', privacy: 'Gizlilik Politikası',
    termsText: 'Devam ederek', termsText2: "'nı ve", termsText3: "'nı kabul etmiş olursunuz.",
    resetSuccess: 'Şifre sıfırlama linki emailinize gönderildi.',
    regSuccess: 'Kayıt başarılı! Şimdi giriş yapabilirsiniz.',
    googleError: 'Google ile giriş başarısız.', appleError: 'Apple ile giriş başarısız.',
    errEmail: 'Email gerekli', errPass: 'Şifre gerekli',
    errInvalid: 'Email veya şifre hatalı.', errExists: 'Bu email zaten kayıtlı.',
    errPassLen: 'Şifre en az 6 karakter olmalı.',
  },
  en: {
    login: 'Sign in to your account', register: 'Create new account', reset: 'Reset your password',
    email: 'Email', password: 'Password', emailPlaceholder: 'example@email.com',
    google: 'Continue with Google', googleLoading: 'Redirecting...',
    apple: 'Sign in with Apple',
    or: 'or', forgot: 'Forgot password',
    loading: 'Loading...', resetBtn: 'Send Reset Link',
    loginBtn: 'Sign In', registerBtn: 'Register',
    noAccount: 'No account?', hasAccount: 'Already have an account?',
    backBtn: '← Back',
    terms: 'Terms of Service', privacy: 'Privacy Policy',
    termsText: 'By continuing you accept our', termsText2: ' and', termsText3: '.',
    resetSuccess: 'Password reset link sent to your email.',
    regSuccess: 'Registration successful! You can now sign in.',
    googleError: 'Google sign in failed.', appleError: 'Apple sign in failed.',
    errEmail: 'Email required', errPass: 'Password required',
    errInvalid: 'Invalid email or password.', errExists: 'This email is already registered.',
    errPassLen: 'Password must be at least 6 characters.',
  },
  nl: {
    login: 'Inloggen op uw account', register: 'Nieuw account aanmaken', reset: 'Wachtwoord opnieuw instellen',
    email: 'E-mail', password: 'Wachtwoord', emailPlaceholder: 'voorbeeld@email.com',
    google: 'Doorgaan met Google', googleLoading: 'Doorsturen...',
    apple: 'Inloggen met Apple',
    or: 'of', forgot: 'Wachtwoord vergeten',
    loading: 'Laden...', resetBtn: 'Reset link verzenden',
    loginBtn: 'Inloggen', registerBtn: 'Registreren',
    noAccount: 'Geen account?', hasAccount: 'Al een account?',
    backBtn: '← Terug',
    terms: 'Gebruiksvoorwaarden', privacy: 'Privacybeleid',
    termsText: 'Door verder te gaan accepteert u onze', termsText2: ' en', termsText3: '.',
    resetSuccess: 'Resetlink verzonden naar uw e-mail.',
    regSuccess: 'Registratie geslaagd!',
    googleError: 'Google aanmelding mislukt.', appleError: 'Apple aanmelding mislukt.',
    errEmail: 'E-mail vereist', errPass: 'Wachtwoord vereist',
    errInvalid: 'Ongeldig e-mailadres of wachtwoord.', errExists: 'Dit e-mailadres is al geregistreerd.',
    errPassLen: 'Wachtwoord moet minimaal 6 tekens zijn.',
  },
  de: {
    login: 'In Ihr Konto einloggen', register: 'Neues Konto erstellen', reset: 'Passwort zurücksetzen',
    email: 'E-Mail', password: 'Passwort', emailPlaceholder: 'beispiel@email.com',
    google: 'Mit Google fortfahren', googleLoading: 'Weiterleiten...',
    apple: 'Mit Apple anmelden',
    or: 'oder', forgot: 'Passwort vergessen',
    loading: 'Laden...', resetBtn: 'Reset-Link senden',
    loginBtn: 'Anmelden', registerBtn: 'Registrieren',
    noAccount: 'Kein Konto?', hasAccount: 'Bereits ein Konto?',
    backBtn: '← Zurück',
    terms: 'Nutzungsbedingungen', privacy: 'Datenschutzrichtlinie',
    termsText: 'Durch Fortfahren akzeptieren Sie unsere', termsText2: ' und', termsText3: '.',
    resetSuccess: 'Passwort-Reset-Link an Ihre E-Mail gesendet.',
    regSuccess: 'Registrierung erfolgreich!',
    googleError: 'Google-Anmeldung fehlgeschlagen.', appleError: 'Apple-Anmeldung fehlgeschlagen.',
    errEmail: 'E-Mail erforderlich', errPass: 'Passwort erforderlich',
    errInvalid: 'Ungültige E-Mail oder Passwort.', errExists: 'Diese E-Mail ist bereits registriert.',
    errPassLen: 'Passwort muss mindestens 6 Zeichen lang sein.',
  },
  fr: {
    login: 'Connexion à votre compte', register: 'Créer un nouveau compte', reset: 'Réinitialiser le mot de passe',
    email: 'E-mail', password: 'Mot de passe', emailPlaceholder: 'exemple@email.com',
    google: 'Continuer avec Google', googleLoading: 'Redirection...',
    apple: 'Se connecter avec Apple',
    or: 'ou', forgot: 'Mot de passe oublié',
    loading: 'Chargement...', resetBtn: 'Envoyer le lien de réinitialisation',
    loginBtn: 'Se connecter', registerBtn: "S'inscrire",
    noAccount: 'Pas de compte?', hasAccount: 'Déjà un compte?',
    backBtn: '← Retour',
    terms: "Conditions d'utilisation", privacy: 'Politique de confidentialité',
    termsText: 'En continuant, vous acceptez nos', termsText2: ' et notre', termsText3: '.',
    resetSuccess: 'Lien de réinitialisation envoyé à votre e-mail.',
    regSuccess: 'Inscription réussie!',
    googleError: 'Connexion Google échouée.', appleError: 'Connexion Apple échouée.',
    errEmail: 'E-mail requis', errPass: 'Mot de passe requis',
    errInvalid: 'E-mail ou mot de passe invalide.', errExists: 'Cet e-mail est déjà enregistré.',
    errPassLen: 'Le mot de passe doit contenir au moins 6 caractères.',
  },
  es: {
    login: 'Iniciar sesión en tu cuenta', register: 'Crear nueva cuenta', reset: 'Restablecer contraseña',
    email: 'Correo electrónico', password: 'Contraseña', emailPlaceholder: 'ejemplo@email.com',
    google: 'Continuar con Google', googleLoading: 'Redirigiendo...',
    apple: 'Iniciar sesión con Apple',
    or: 'o', forgot: 'Olvidé mi contraseña',
    loading: 'Cargando...', resetBtn: 'Enviar enlace de restablecimiento',
    loginBtn: 'Iniciar sesión', registerBtn: 'Registrarse',
    noAccount: '¿No tienes cuenta?', hasAccount: '¿Ya tienes cuenta?',
    backBtn: '← Volver',
    terms: 'Términos de servicio', privacy: 'Política de privacidad',
    termsText: 'Al continuar aceptas nuestros', termsText2: ' y', termsText3: '.',
    resetSuccess: 'Enlace de restablecimiento enviado a tu correo.',
    regSuccess: '¡Registro exitoso!',
    googleError: 'Inicio de sesión con Google fallido.', appleError: 'Inicio de sesión con Apple fallido.',
    errEmail: 'Correo requerido', errPass: 'Contraseña requerida',
    errInvalid: 'Correo o contraseña inválidos.', errExists: 'Este correo ya está registrado.',
    errPassLen: 'La contraseña debe tener al menos 6 caracteres.',
  },
  ar: {
    login: 'تسجيل الدخول إلى حسابك', register: 'إنشاء حساب جديد', reset: 'إعادة تعيين كلمة المرور',
    email: 'البريد الإلكتروني', password: 'كلمة المرور', emailPlaceholder: 'مثال@email.com',
    google: 'المتابعة مع Google', googleLoading: 'جاري التحويل...',
    apple: 'تسجيل الدخول مع Apple',
    or: 'أو', forgot: 'نسيت كلمة المرور',
    loading: 'جاري التحميل...', resetBtn: 'إرسال رابط إعادة التعيين',
    loginBtn: 'تسجيل الدخول', registerBtn: 'إنشاء حساب',
    noAccount: 'ليس لديك حساب؟', hasAccount: 'لديك حساب بالفعل؟',
    backBtn: '← رجوع',
    terms: 'شروط الخدمة', privacy: 'سياسة الخصوصية',
    termsText: 'بالمتابعة، أنت توافق على', termsText2: ' و', termsText3: '.',
    resetSuccess: 'تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني.',
    regSuccess: 'تم التسجيل بنجاح!',
    googleError: 'فشل تسجيل الدخول عبر Google.', appleError: 'فشل تسجيل الدخول عبر Apple.',
    errEmail: 'البريد الإلكتروني مطلوب', errPass: 'كلمة المرور مطلوبة',
    errInvalid: 'بريد إلكتروني أو كلمة مرور غير صحيحة.', errExists: 'هذا البريد الإلكتروني مسجل بالفعل.',
    errPassLen: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل.',
  },
}

const isCapacitor = () => {
  if (typeof window === 'undefined') return false
  return window.Capacitor !== undefined
}

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [appleLoading, setAppleLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [resetMode, setResetMode] = useState(false)
  const [lang, setLang] = useState('en')
  const [isNative, setIsNative] = useState(false)

  useEffect(() => {
    const savedLang = localStorage.getItem('bilimce_lang') || 'en'
    setLang(savedLang)
    setIsNative(isCapacitor())
  }, [])

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) window.location.href = '/'
    })
    const check = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) window.location.href = '/'
    }
    check()
    return () => subscription.unsubscribe()
  }, [])

  const t = UI[lang] || UI.en

  const handleAuth = async () => {
    if (!email.trim()) { setError(t.errEmail); return }
    if (!resetMode && !password.trim()) { setError(t.errPass); return }
    setLoading(true); setError(''); setSuccess('')
    try {
      if (resetMode) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: 'https://bilimce.vercel.app/auth' })
        if (error) throw error
        setSuccess(t.resetSuccess); setResetMode(false)
      } else if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        window.location.href = '/'
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setSuccess(t.regSuccess); setIsLogin(true)
      }
    } catch (err) {
      const msg = err.message
      if (msg.includes('Invalid login')) setError(t.errInvalid)
      else if (msg.includes('already registered')) setError(t.errExists)
      else if (msg.includes('Password should be')) setError(t.errPassLen)
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
      setError(t.googleError); setGoogleLoading(false)
    }
  }

  const handleApple = async () => {
    setAppleLoading(true); setError('')
    try {
      if (isNative) {
        const { SignInWithApple } = await import('@capacitor-community/apple-sign-in')

        const result = await SignInWithApple.authorize({
          clientId: 'com.bilimce.app',
          redirectURI: 'https://bilimce.vercel.app',
          scopes: 'email name',
        })
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'apple',
          token: result.response.identityToken,
        })
        if (error) throw error
        window.location.href = '/'
      } else {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'apple',
          options: { redirectTo: 'https://bilimce.vercel.app' }
        })
        if (error) throw error
      }
    } catch (err) {
      if (err.message !== 'The user canceled the operation.') {
        setError(t.appleError)
      }
      setAppleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center px-4 py-8" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/"><img src="/logo.svg" alt="BİLİMCE" className="w-20 h-20 mx-auto mb-4" /></a>
          <h1 className="text-3xl font-bold text-white tracking-tight">BİLİMCE</h1>
          <p className="text-white/40 text-base mt-2">
            {resetMode ? t.reset : isLogin ? t.login : t.register}
          </p>
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8">
          {error && <p className="text-red-400 text-sm mb-4 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>}
          {success && <p className="text-green-400 text-sm mb-4 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">{success}</p>}

          {!resetMode && (
            <>
              <button onClick={handleGoogle} disabled={googleLoading} className="w-full flex items-center justify-center gap-3 py-4 bg-white/10 border border-white/15 rounded-xl text-base font-medium text-white hover:bg-white/15 transition disabled:opacity-50 mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {googleLoading ? t.googleLoading : t.google}
              </button>

              <button onClick={handleApple} disabled={appleLoading} className="w-full flex items-center justify-center gap-3 py-4 bg-white border border-white/15 rounded-xl text-base font-medium text-black hover:bg-white/90 transition disabled:opacity-50 mb-5">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="black">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                {appleLoading ? t.googleLoading : t.apple}
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-white/10"></div>
                <span className="text-white/30 text-sm">{t.or}</span>
                <div className="flex-1 h-px bg-white/10"></div>
              </div>
            </>
          )}

          <div className="mb-4">
            <label className="text-white/50 text-sm mb-2 block">{t.email}</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t.emailPlaceholder}
              className="w-full bg-white/5 border border-[#30363d] rounded-xl px-4 py-4 text-white placeholder-white/25 outline-none text-base focus:border-blue-500/50 transition" />
          </div>

          {!resetMode && (
            <div className="mb-2">
              <label className="text-white/50 text-sm mb-2 block">{t.password}</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                onKeyDown={e => e.key === 'Enter' && handleAuth()}
                className="w-full bg-white/5 border border-[#30363d] rounded-xl px-4 py-4 text-white placeholder-white/25 outline-none text-base focus:border-blue-500/50 transition" />
            </div>
          )}

          {isLogin && !resetMode && (
            <div className="flex justify-end mb-5">
              <button onClick={() => { setResetMode(true); setError(''); setSuccess('') }} className="text-sm text-white/30 hover:text-blue-400 transition">
                {t.forgot}
              </button>
            </div>
          )}

          {!isLogin && <div className="mb-5" />}

          <button onClick={handleAuth} disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-base font-semibold text-white hover:opacity-90 transition disabled:opacity-50">
            {loading ? t.loading : resetMode ? t.resetBtn : isLogin ? t.loginBtn : t.registerBtn}
          </button>

          {resetMode ? (
            <p className="text-center text-white/40 text-sm mt-5">
              <button onClick={() => { setResetMode(false); setError(''); setSuccess('') }} className="text-blue-400 hover:text-blue-300">{t.backBtn}</button>
            </p>
          ) : (
            <p className="text-center text-white/40 text-sm mt-5">
              {isLogin ? t.noAccount : t.hasAccount}{' '}
              <button onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess('') }} className="text-blue-400 hover:text-blue-300">
                {isLogin ? t.registerBtn : t.loginBtn}
              </button>
            </p>
          )}
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          {t.termsText}{' '}
          <a href="/terms" className="hover:text-white/40 transition">{t.terms}</a>
          {t.termsText2}{' '}
          <a href="/privacy" className="hover:text-white/40 transition">{t.privacy}</a>
          {t.termsText3}
        </p>
      </div>
    </div>
  )
}
