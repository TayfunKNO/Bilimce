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
    or: 'veya', forgot: 'Şifremi unuttum',
    loading: 'Yükleniyor...', resetBtn: 'Sıfırlama Linki Gönder',
    loginBtn: 'Giriş Yap', registerBtn: 'Kayıt Ol',
    noAccount: 'Hesabın yok mu?', hasAccount: 'Zaten hesabın var mı?',
    backBtn: '← Geri dön',
    terms: 'Kullanım Şartları', privacy: 'Gizlilik Politikası',
    termsText: 'Devam ederek', termsText2: "'nı ve", termsText3: "'nı kabul etmiş olursunuz.",
    resetSuccess: 'Şifre sıfırlama linki emailinize gönderildi.',
    regSuccess: 'Kayıt başarılı! Şimdi giriş yapabilirsiniz.',
    errEmail: 'Email gerekli', errPass: 'Şifre gerekli',
    errInvalid: 'Email veya şifre hatalı.', errExists: 'Bu email zaten kayıtlı.',
    errPassLen: 'Şifre en az 6 karakter olmalı.',
  },
  en: {
    login: 'Sign in to your account', register: 'Create new account', reset: 'Reset your password',
    email: 'Email', password: 'Password', emailPlaceholder: 'example@email.com',
    or: 'or', forgot: 'Forgot password',
    loading: 'Loading...', resetBtn: 'Send Reset Link',
    loginBtn: 'Sign In', registerBtn: 'Register',
    noAccount: 'No account?', hasAccount: 'Already have an account?',
    backBtn: '← Back',
    terms: 'Terms of Service', privacy: 'Privacy Policy',
    termsText: 'By continuing you accept our', termsText2: ' and', termsText3: '.',
    resetSuccess: 'Password reset link sent to your email.',
    regSuccess: 'Registration successful! You can now sign in.',
    errEmail: 'Email required', errPass: 'Password required',
    errInvalid: 'Invalid email or password.', errExists: 'This email is already registered.',
    errPassLen: 'Password must be at least 6 characters.',
  },
  nl: {
    login: 'Inloggen op uw account', register: 'Nieuw account aanmaken', reset: 'Wachtwoord opnieuw instellen',
    email: 'E-mail', password: 'Wachtwoord', emailPlaceholder: 'voorbeeld@email.com',
    or: 'of', forgot: 'Wachtwoord vergeten',
    loading: 'Laden...', resetBtn: 'Reset link verzenden',
    loginBtn: 'Inloggen', registerBtn: 'Registreren',
    noAccount: 'Geen account?', hasAccount: 'Al een account?',
    backBtn: '← Terug',
    terms: 'Gebruiksvoorwaarden', privacy: 'Privacybeleid',
    termsText: 'Door verder te gaan accepteert u onze', termsText2: ' en', termsText3: '.',
    resetSuccess: 'Resetlink verzonden naar uw e-mail.',
    regSuccess: 'Registratie geslaagd!',
    errEmail: 'E-mail vereist', errPass: 'Wachtwoord vereist',
    errInvalid: 'Ongeldig e-mailadres of wachtwoord.', errExists: 'Dit e-mailadres is al geregistreerd.',
    errPassLen: 'Wachtwoord moet minimaal 6 tekens zijn.',
  },
  de: {
    login: 'In Ihr Konto einloggen', register: 'Neues Konto erstellen', reset: 'Passwort zurücksetzen',
    email: 'E-Mail', password: 'Passwort', emailPlaceholder: 'beispiel@email.com',
    or: 'oder', forgot: 'Passwort vergessen',
    loading: 'Laden...', resetBtn: 'Reset-Link senden',
    loginBtn: 'Anmelden', registerBtn: 'Registrieren',
    noAccount: 'Kein Konto?', hasAccount: 'Bereits ein Konto?',
    backBtn: '← Zurück',
    terms: 'Nutzungsbedingungen', privacy: 'Datenschutzrichtlinie',
    termsText: 'Durch Fortfahren akzeptieren Sie unsere', termsText2: ' und', termsText3: '.',
    resetSuccess: 'Passwort-Reset-Link an Ihre E-Mail gesendet.',
    regSuccess: 'Registrierung erfolgreich!',
    errEmail: 'E-Mail erforderlich', errPass: 'Passwort erforderlich',
    errInvalid: 'Ungültige E-Mail oder Passwort.', errExists: 'Diese E-Mail ist bereits registriert.',
    errPassLen: 'Passwort muss mindestens 6 Zeichen lang sein.',
  },
  fr: {
    login: 'Connexion à votre compte', register: 'Créer un nouveau compte', reset: 'Réinitialiser le mot de passe',
    email: 'E-mail', password: 'Mot de passe', emailPlaceholder: 'exemple@email.com',
    or: 'ou', forgot: 'Mot de passe oublié',
    loading: 'Chargement...', resetBtn: 'Envoyer le lien de réinitialisation',
    loginBtn: 'Se connecter', registerBtn: "S'inscrire",
    noAccount: 'Pas de compte?', hasAccount: 'Déjà un compte?',
    backBtn: '← Retour',
    terms: "Conditions d'utilisation", privacy: 'Politique de confidentialité',
    termsText: 'En continuant, vous acceptez nos', termsText2: ' et notre', termsText3: '.',
    resetSuccess: 'Lien de réinitialisation envoyé à votre e-mail.',
    regSuccess: 'Inscription réussie!',
    errEmail: 'E-mail requis', errPass: 'Mot de passe requis',
    errInvalid: 'E-mail ou mot de passe invalide.', errExists: 'Cet e-mail est déjà enregistré.',
    errPassLen: 'Le mot de passe doit contenir au moins 6 caractères.',
  },
  es: {
    login: 'Iniciar sesión en tu cuenta', register: 'Crear nueva cuenta', reset: 'Restablecer contraseña',
    email: 'Correo electrónico', password: 'Contraseña', emailPlaceholder: 'ejemplo@email.com',
    or: 'o', forgot: 'Olvidé mi contraseña',
    loading: 'Cargando...', resetBtn: 'Enviar enlace de restablecimiento',
    loginBtn: 'Iniciar sesión', registerBtn: 'Registrarse',
    noAccount: '¿No tienes cuenta?', hasAccount: '¿Ya tienes cuenta?',
    backBtn: '← Volver',
    terms: 'Términos de servicio', privacy: 'Política de privacidad',
    termsText: 'Al continuar aceptas nuestros', termsText2: ' y', termsText3: '.',
    resetSuccess: 'Enlace de restablecimiento enviado a tu correo.',
    regSuccess: '¡Registro exitoso!',
    errEmail: 'Correo requerido', errPass: 'Contraseña requerida',
    errInvalid: 'Correo o contraseña inválidos.', errExists: 'Este correo ya está registrado.',
    errPassLen: 'La contraseña debe tener al menos 6 caracteres.',
  },
  ar: {
    login: 'تسجيل الدخول إلى حسابك', register: 'إنشاء حساب جديد', reset: 'إعادة تعيين كلمة المرور',
    email: 'البريد الإلكتروني', password: 'كلمة المرور', emailPlaceholder: 'مثال@email.com',
    or: 'أو', forgot: 'نسيت كلمة المرور',
    loading: 'جاري التحميل...', resetBtn: 'إرسال رابط إعادة التعيين',
    loginBtn: 'تسجيل الدخول', registerBtn: 'إنشاء حساب',
    noAccount: 'ليس لديك حساب؟', hasAccount: 'لديك حساب بالفعل؟',
    backBtn: '← رجوع',
    terms: 'شروط الخدمة', privacy: 'سياسة الخصوصية',
    termsText: 'بالمتابعة، أنت توافق على', termsText2: ' و', termsText3: '.',
    resetSuccess: 'تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني.',
    regSuccess: 'تم التسجيل بنجاح!',
    errEmail: 'البريد الإلكتروني مطلوب', errPass: 'كلمة المرور مطلوبة',
    errInvalid: 'بريد إلكتروني أو كلمة مرور غير صحيحة.', errExists: 'هذا البريد الإلكتروني مسجل بالفعل.',
    errPassLen: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل.',
  },
}

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [resetMode, setResetMode] = useState(false)
  const [lang, setLang] = useState('en')

  useEffect(() => {
    const savedLang = localStorage.getItem('bilimce_lang') || 'en'
    setLang(savedLang)
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
