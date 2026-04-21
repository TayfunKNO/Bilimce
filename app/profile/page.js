'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://lypjtxqvusqndqawugxu.supabase.co',
  'sb_publishable_rqtzTjZBNww4u56gNNCI4A_OS_ID1Bo'
)

const BADGES = {
  tr: [
    { key: 'first_favorite', icon: '❤️', label: 'İlk Favori', desc: 'İlk makaleyi favorile' },
    { key: 'first_comment', icon: '💬', label: 'İlk Yorum', desc: 'İlk yorumu yap' },
    { key: 'first_rating', icon: '⭐', label: 'İlk Puan', desc: 'İlk makaleyi puanla' },
    { key: 'researcher', icon: '🔬', label: 'Araştırmacı', desc: '10+ arama yap' },
    { key: 'collector', icon: '📚', label: 'Koleksiyoncu', desc: 'Koleksiyon oluştur' },
    { key: 'social', icon: '🌐', label: 'Sosyal', desc: 'Toplulukta gönderi paylaş' },
    { key: 'bookworm', icon: '🔖', label: 'Okur', desc: '5+ makale okuma listesine ekle' },
    { key: 'expert', icon: '🏆', label: 'Uzman', desc: '50+ favori makale' },
  ],
  en: [
    { key: 'first_favorite', icon: '❤️', label: 'First Favorite', desc: 'Favorite your first article' },
    { key: 'first_comment', icon: '💬', label: 'First Comment', desc: 'Make your first comment' },
    { key: 'first_rating', icon: '⭐', label: 'First Rating', desc: 'Rate your first article' },
    { key: 'researcher', icon: '🔬', label: 'Researcher', desc: 'Make 10+ searches' },
    { key: 'collector', icon: '📚', label: 'Collector', desc: 'Create a collection' },
    { key: 'social', icon: '🌐', label: 'Social', desc: 'Share a post in community' },
    { key: 'bookworm', icon: '🔖', label: 'Bookworm', desc: 'Add 5+ articles to reading list' },
    { key: 'expert', icon: '🏆', label: 'Expert', desc: '50+ favorite articles' },
  ],
  nl: [
    { key: 'first_favorite', icon: '❤️', label: 'Eerste Favoriet', desc: 'Favoriet je eerste artikel' },
    { key: 'first_comment', icon: '💬', label: 'Eerste Reactie', desc: 'Plaats je eerste reactie' },
    { key: 'first_rating', icon: '⭐', label: 'Eerste Beoordeling', desc: 'Beoordeel je eerste artikel' },
    { key: 'researcher', icon: '🔬', label: 'Onderzoeker', desc: 'Doe 10+ zoekopdrachten' },
    { key: 'collector', icon: '📚', label: 'Verzamelaar', desc: 'Maak een collectie' },
    { key: 'social', icon: '🌐', label: 'Sociaal', desc: 'Deel een bericht in de gemeenschap' },
    { key: 'bookworm', icon: '🔖', label: 'Boekenwormpje', desc: 'Voeg 5+ artikelen toe aan leeslijst' },
    { key: 'expert', icon: '🏆', label: 'Expert', desc: '50+ favoriete artikelen' },
  ],
  de: [
    { key: 'first_favorite', icon: '❤️', label: 'Erster Favorit', desc: 'Ersten Artikel favorisieren' },
    { key: 'first_comment', icon: '💬', label: 'Erster Kommentar', desc: 'Ersten Kommentar schreiben' },
    { key: 'first_rating', icon: '⭐', label: 'Erste Bewertung', desc: 'Ersten Artikel bewerten' },
    { key: 'researcher', icon: '🔬', label: 'Forscher', desc: '10+ Suchen durchführen' },
    { key: 'collector', icon: '📚', label: 'Sammler', desc: 'Sammlung erstellen' },
    { key: 'social', icon: '🌐', label: 'Sozial', desc: 'Beitrag in Community teilen' },
    { key: 'bookworm', icon: '🔖', label: 'Bücherwurm', desc: '5+ Artikel zur Leseliste hinzufügen' },
    { key: 'expert', icon: '🏆', label: 'Experte', desc: '50+ Lieblingsartikel' },
  ],
  fr: [
    { key: 'first_favorite', icon: '❤️', label: 'Premier Favori', desc: 'Ajouter votre premier article en favori' },
    { key: 'first_comment', icon: '💬', label: 'Premier Commentaire', desc: 'Faire votre premier commentaire' },
    { key: 'first_rating', icon: '⭐', label: 'Première Note', desc: 'Noter votre premier article' },
    { key: 'researcher', icon: '🔬', label: 'Chercheur', desc: 'Faire 10+ recherches' },
    { key: 'collector', icon: '📚', label: 'Collectionneur', desc: 'Créer une collection' },
    { key: 'social', icon: '🌐', label: 'Social', desc: 'Partager dans la communauté' },
    { key: 'bookworm', icon: '🔖', label: 'Lecteur', desc: 'Ajouter 5+ articles à la liste' },
    { key: 'expert', icon: '🏆', label: 'Expert', desc: '50+ articles favoris' },
  ],
  es: [
    { key: 'first_favorite', icon: '❤️', label: 'Primer Favorito', desc: 'Marca tu primer artículo como favorito' },
    { key: 'first_comment', icon: '💬', label: 'Primer Comentario', desc: 'Haz tu primer comentario' },
    { key: 'first_rating', icon: '⭐', label: 'Primera Valoración', desc: 'Valora tu primer artículo' },
    { key: 'researcher', icon: '🔬', label: 'Investigador', desc: 'Realiza 10+ búsquedas' },
    { key: 'collector', icon: '📚', label: 'Coleccionista', desc: 'Crea una colección' },
    { key: 'social', icon: '🌐', label: 'Social', desc: 'Comparte en la comunidad' },
    { key: 'bookworm', icon: '🔖', label: 'Lector', desc: 'Añade 5+ artículos a la lista' },
    { key: 'expert', icon: '🏆', label: 'Experto', desc: '50+ artículos favoritos' },
  ],
  ar: [
    { key: 'first_favorite', icon: '❤️', label: 'أول مفضلة', desc: 'أضف مقالك الأول إلى المفضلة' },
    { key: 'first_comment', icon: '💬', label: 'أول تعليق', desc: 'اكتب تعليقك الأول' },
    { key: 'first_rating', icon: '⭐', label: 'أول تقييم', desc: 'قيّم مقالك الأول' },
    { key: 'researcher', icon: '🔬', label: 'باحث', desc: 'أجرِ 10+ عمليات بحث' },
    { key: 'collector', icon: '📚', label: 'جامع', desc: 'أنشئ مجموعة' },
    { key: 'social', icon: '🌐', label: 'اجتماعي', desc: 'شارك في المجتمع' },
    { key: 'bookworm', icon: '🔖', label: 'قارئ', desc: 'أضف 5+ مقالات لقائمة القراءة' },
    { key: 'expert', icon: '🏆', label: 'خبير', desc: '50+ مقال مفضل' },
  ],
}

const AVATARS = ['🧬', '🔬', '⚛️', '🧪', '🧠', '🩺', '💊', '🌍', '🧑‍🔬', '👩‍🔬', '📊', '🔭']

const UI = {
  tr: {
    home: 'Ana Sayfa', loading: 'Yükleniyor...', user: 'Kullanıcı',
    badges: 'rozet', favorites: 'favori', saveUser: 'Kaydet', saving: 'Kaydediliyor...',
    userPlaceholder: 'Kullanıcı adı', selectAvatar: 'Avatar seç',
    stats: ['Favori', 'Okuma', 'Arama', 'Yorum', 'Puan'],
    activity: '📈 Son 30 Gün Aktivite', daysAgo: '30 gün önce', today: 'Bugün',
    badgesTitle: '🏅 Rozetler', notifications: '🔔 Bildirimler',
    notifOn: '✓ Açık', notifOff: 'Aç', followedTopics: 'Takip ettiğin konular',
    topicPlaceholder: 'Konu ekle (örn: kanser, alzheimer)', add: 'Ekle',
    history: '🕐 Arama Geçmişi', logout: 'Çıkış Yap',
    searches: 'arama',
  },
  en: {
    home: 'Home', loading: 'Loading...', user: 'User',
    badges: 'badges', favorites: 'favorites', saveUser: 'Save', saving: 'Saving...',
    userPlaceholder: 'Username', selectAvatar: 'Select avatar',
    stats: ['Favorites', 'Reading', 'Searches', 'Comments', 'Ratings'],
    activity: '📈 Last 30 Days Activity', daysAgo: '30 days ago', today: 'Today',
    badgesTitle: '🏅 Badges', notifications: '🔔 Notifications',
    notifOn: '✓ On', notifOff: 'Enable', followedTopics: 'Followed topics',
    topicPlaceholder: 'Add topic (e.g: cancer, alzheimer)', add: 'Add',
    history: '🕐 Search History', logout: 'Sign Out',
    searches: 'searches',
  },
  nl: {
    home: 'Startpagina', loading: 'Laden...', user: 'Gebruiker',
    badges: 'badges', favorites: 'favorieten', saveUser: 'Opslaan', saving: 'Opslaan...',
    userPlaceholder: 'Gebruikersnaam', selectAvatar: 'Avatar kiezen',
    stats: ['Favorieten', 'Leeslijst', 'Zoekopdrachten', 'Reacties', 'Beoordelingen'],
    activity: '📈 Activiteit laatste 30 dagen', daysAgo: '30 dagen geleden', today: 'Vandaag',
    badgesTitle: '🏅 Badges', notifications: '🔔 Meldingen',
    notifOn: '✓ Aan', notifOff: 'Inschakelen', followedTopics: 'Gevolgde onderwerpen',
    topicPlaceholder: 'Onderwerp toevoegen (bijv: kanker)', add: 'Toevoegen',
    history: '🕐 Zoekgeschiedenis', logout: 'Uitloggen',
    searches: 'zoekopdrachten',
  },
  de: {
    home: 'Startseite', loading: 'Laden...', user: 'Benutzer',
    badges: 'Abzeichen', favorites: 'Favoriten', saveUser: 'Speichern', saving: 'Speichern...',
    userPlaceholder: 'Benutzername', selectAvatar: 'Avatar auswählen',
    stats: ['Favoriten', 'Leseliste', 'Suchen', 'Kommentare', 'Bewertungen'],
    activity: '📈 Aktivität letzte 30 Tage', daysAgo: 'vor 30 Tagen', today: 'Heute',
    badgesTitle: '🏅 Abzeichen', notifications: '🔔 Benachrichtigungen',
    notifOn: '✓ An', notifOff: 'Aktivieren', followedTopics: 'Verfolgte Themen',
    topicPlaceholder: 'Thema hinzufügen (z.B: Krebs)', add: 'Hinzufügen',
    history: '🕐 Suchverlauf', logout: 'Abmelden',
    searches: 'Suchen',
  },
  fr: {
    home: 'Accueil', loading: 'Chargement...', user: 'Utilisateur',
    badges: 'badges', favorites: 'favoris', saveUser: 'Sauvegarder', saving: 'Sauvegarde...',
    userPlaceholder: 'Nom d\'utilisateur', selectAvatar: 'Choisir un avatar',
    stats: ['Favoris', 'Lecture', 'Recherches', 'Commentaires', 'Notes'],
    activity: '📈 Activité des 30 derniers jours', daysAgo: 'il y a 30 jours', today: 'Aujourd\'hui',
    badgesTitle: '🏅 Badges', notifications: '🔔 Notifications',
    notifOn: '✓ Activé', notifOff: 'Activer', followedTopics: 'Sujets suivis',
    topicPlaceholder: 'Ajouter un sujet (ex: cancer)', add: 'Ajouter',
    history: '🕐 Historique de recherche', logout: 'Déconnexion',
    searches: 'recherches',
  },
  es: {
    home: 'Inicio', loading: 'Cargando...', user: 'Usuario',
    badges: 'insignias', favorites: 'favoritos', saveUser: 'Guardar', saving: 'Guardando...',
    userPlaceholder: 'Nombre de usuario', selectAvatar: 'Seleccionar avatar',
    stats: ['Favoritos', 'Lectura', 'Búsquedas', 'Comentarios', 'Valoraciones'],
    activity: '📈 Actividad últimos 30 días', daysAgo: 'hace 30 días', today: 'Hoy',
    badgesTitle: '🏅 Insignias', notifications: '🔔 Notificaciones',
    notifOn: '✓ Activado', notifOff: 'Activar', followedTopics: 'Temas seguidos',
    topicPlaceholder: 'Añadir tema (ej: cáncer)', add: 'Añadir',
    history: '🕐 Historial de búsqueda', logout: 'Cerrar sesión',
    searches: 'búsquedas',
  },
  ar: {
    home: 'الرئيسية', loading: 'جاري التحميل...', user: 'مستخدم',
    badges: 'شارات', favorites: 'مفضلة', saveUser: 'حفظ', saving: 'جاري الحفظ...',
    userPlaceholder: 'اسم المستخدم', selectAvatar: 'اختر الصورة الرمزية',
    stats: ['المفضلة', 'القراءة', 'البحث', 'التعليقات', 'التقييمات'],
    activity: '📈 نشاط آخر 30 يوم', daysAgo: 'منذ 30 يوماً', today: 'اليوم',
    badgesTitle: '🏅 الشارات', notifications: '🔔 الإشعارات',
    notifOn: '✓ مفعّل', notifOff: 'تفعيل', followedTopics: 'المواضيع المتابعة',
    topicPlaceholder: 'أضف موضوعاً (مثل: السرطان)', add: 'إضافة',
    history: '🕐 سجل البحث', logout: 'تسجيل الخروج',
    searches: 'عمليات بحث',
  },
}

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
  const [lang, setLang] = useState('tr')

  useEffect(() => {
    const savedLang = localStorage.getItem('bilimce_lang') || 'tr'
    setLang(savedLang)
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) { window.location.href = '/auth'; return }
      setUser(data.user)
      loadProfile(data.user.id)
    })
  }, [])

  const t = UI[lang] || UI.tr
  const badgeList = BADGES[lang] || BADGES.tr

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

    const activity = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date(); date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const count = (searchActivity || []).filter(a => a.created_at.startsWith(dateStr)).length
      activity.push({ date: dateStr, count })
    }
    setActivityData(activity)

    await checkAndAwardBadges(userId, s, badgeData?.map(b => b.badge_key) || [])

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
      <div className="text-white/30">{t.loading}</div>
    </div>
  )

  const statItems = [
    { label: t.stats[0], value: stats.favorites, icon: '❤️', href: '/favorites' },
    { label: t.stats[1], value: stats.readingList, icon: '🔖', href: '/reading-list' },
    { label: t.stats[2], value: stats.searches, icon: '🔍', href: null },
    { label: t.stats[3], value: stats.comments, icon: '💬', href: null },
    { label: t.stats[4], value: stats.ratings, icon: '⭐', href: null },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-white/5 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="/" className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">B</a>
            <span className="font-bold text-base tracking-tight text-white">BİLİMCE</span>
          </div>
          <a href="/" className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white/60 hover:text-white transition">{t.home}</a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <button onClick={() => setShowAvatarPicker(!showAvatarPicker)} className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-4xl hover:bg-white/20 transition">
                {avatar}
              </button>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white">✎</div>
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white">{username || t.user}</h1>
              <p className="text-white/40 text-sm">{user?.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-blue-400">{badges.length} {t.badges}</span>
                <span className="text-white/20">·</span>
                <span className="text-xs text-white/40">{stats.favorites} {t.favorites}</span>
              </div>
            </div>
          </div>

          {showAvatarPicker && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
              <p className="text-xs text-white/40 mb-3">{t.selectAvatar}</p>
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
            <input type="text" value={newUsername} onChange={e => setNewUsername(e.target.value)} placeholder={t.userPlaceholder} maxLength={20} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-white/25 outline-none text-sm" />
            <button onClick={saveUsername} disabled={savingUsername || newUsername === username} className="px-4 py-2 bg-blue-500/20 border border-blue-500/20 text-blue-300 rounded-xl text-sm hover:bg-blue-500/30 transition disabled:opacity-50">
              {savingUsername ? t.saving : t.saveUser}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-3 mb-6">
          {statItems.map((stat, i) => (
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

        <div className="bg-white/3 border border-white/5 rounded-2xl p-5 mb-6">
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wide mb-4">{t.activity}</h2>
          <div className="flex items-end gap-1 h-16">
            {activityData.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full" title={`${day.date}: ${day.count} ${t.searches}`}>
                <div className="w-full rounded-sm transition-all" style={{
                  height: day.count === 0 ? '4px' : `${Math.max(8, (day.count / maxActivity) * 56)}px`,
                  background: day.count === 0 ? 'rgba(255,255,255,0.05)' : `rgba(59,130,246,${0.3 + (day.count / maxActivity) * 0.7})`,
                }} />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-white/20 mt-2">
            <span>{t.daysAgo}</span>
            <span>{t.today}</span>
          </div>
        </div>

        <div className="bg-white/3 border border-white/5 rounded-2xl p-5 mb-6">
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wide mb-4">{t.badgesTitle} ({badges.length}/{badgeList.length})</h2>
          <div className="grid grid-cols-2 gap-3">
            {badgeList.map(badge => {
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

        <div className="bg-white/3 border border-white/5 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wide">{t.notifications}</h2>
            <button onClick={toggleNotifications} className={`px-4 py-2 rounded-xl text-xs font-medium transition ${notifications ? 'bg-green-500/20 border border-green-500/20 text-green-300' : 'bg-white/5 border border-white/10 text-white/50 hover:text-white'}`}>
              {notifications ? t.notifOn : t.notifOff}
            </button>
          </div>
          <div className="mb-3">
            <p className="text-xs text-white/40 mb-2">{t.followedTopics}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {topics.map(topic => (
                <span key={topic} className="flex items-center gap-1 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-300 rounded-lg text-xs">
                  {topic}
                  <button onClick={() => removeTopic(topic)} className="text-white/30 hover:text-red-400 transition ml-1">✕</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" value={newTopic} onChange={e => setNewTopic(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTopic()} placeholder={t.topicPlaceholder} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-white/25 outline-none text-sm" />
              <button onClick={addTopic} className="px-4 py-2 bg-blue-500/20 border border-blue-500/20 text-blue-300 rounded-xl text-sm hover:bg-blue-500/30 transition">{t.add}</button>
            </div>
          </div>
        </div>

        {searchHistory.length > 0 && (
          <div className="bg-white/3 border border-white/5 rounded-2xl p-5 mb-6">
            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wide mb-4">{t.history}</h2>
            <div className="flex flex-col gap-2">
              {searchHistory.map((item, i) => (
                <a key={i} href={`/?q=${encodeURIComponent(item.query)}`} className="flex items-center justify-between px-3 py-2 bg-white/3 rounded-xl hover:bg-white/5 transition">
                  <span className="text-sm text-white/70">{item.query}</span>
                  <span className="text-xs text-white/25">{new Date(item.created_at).toLocaleDateString(lang === 'tr' ? 'tr-TR' : lang === 'ar' ? 'ar-SA' : 'en-GB')}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        <button onClick={async () => { await supabase.auth.signOut(); window.location.href = '/' }} className="w-full px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm hover:bg-red-500/20 transition">
          {t.logout}
        </button>
      </main>
    </div>
  )
}
