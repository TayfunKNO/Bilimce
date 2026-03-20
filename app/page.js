'use client'
import { useState, useCallback, useRef, useEffect, memo } from 'react'
import { createClient } from '@supabase/supabase-js'
import { searchPubMed } from '../lib/pubmed'

const supabase = createClient(
  'https://xlnnopufkjaqxjsmhtot.supabase.co',
  'sb_publishable_EbJEG5Y_81M3qM4isjXyaw_uUraIsAu'
)

const LANGUAGES = [
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
]

const TOPIC_CATEGORIES = [
  {
    id: 'health', icon: '🏥', label: 'Sağlık & Tıp',
    subcategories: [
      { label: 'Kanser', topics: [
        { slug: 'meme-kanseri', label: 'Meme Kanseri', en: 'breast cancer' },
        { slug: 'akciger-kanseri', label: 'Akciğer Kanseri', en: 'lung cancer' },
        { slug: 'kolon-kanseri', label: 'Kolon Kanseri', en: 'colon cancer' },
        { slug: 'kanser-tedavisi', label: 'Kanser Tedavisi', en: 'cancer treatment' },
        { slug: 'kanser-immunoterapi', label: 'İmmünoterapi', en: 'cancer immunotherapy' },
      ]},
      { label: 'Kalp & Damar', topics: [
        { slug: 'kalp-hastaligi', label: 'Kalp Hastalığı', en: 'cardiovascular disease' },
        { slug: 'hipertansiyon', label: 'Hipertansiyon', en: 'hypertension' },
        { slug: 'inme', label: 'İnme', en: 'stroke' },
        { slug: 'kalp-yetmezligi', label: 'Kalp Yetmezliği', en: 'heart failure' },
      ]},
      { label: 'Metabolik', topics: [
        { slug: 'diyabet', label: 'Diyabet', en: 'diabetes' },
        { slug: 'obezite', label: 'Obezite', en: 'obesity' },
        { slug: 'tiroid', label: 'Tiroid', en: 'thyroid disease' },
        { slug: 'metabolik-sendrom', label: 'Metabolik Sendrom', en: 'metabolic syndrome' },
      ]},
      { label: 'Enfeksiyon', topics: [
        { slug: 'covid-19', label: 'COVID-19', en: 'covid-19' },
        { slug: 'antibiyotik-direnci', label: 'Antibiyotik Direnci', en: 'antibiotic resistance' },
        { slug: 'asi', label: 'Aşı', en: 'vaccine immunization' },
        { slug: 'grip', label: 'Grip & İnfluenza', en: 'influenza' },
      ]},
    ]
  },
  {
    id: 'neuro', icon: '🧠', label: 'Nöroloji & Psikoloji',
    subcategories: [
      { label: 'Nörodejeneratif', topics: [
        { slug: 'alzheimer', label: 'Alzheimer', en: 'alzheimer disease' },
        { slug: 'parkinson', label: 'Parkinson', en: 'parkinson disease' },
        { slug: 'ms-hastaligi', label: 'Multiple Skleroz', en: 'multiple sclerosis' },
        { slug: 'als', label: 'ALS', en: 'amyotrophic lateral sclerosis' },
      ]},
      { label: 'Ruh Sağlığı', topics: [
        { slug: 'depresyon', label: 'Depresyon', en: 'depression' },
        { slug: 'anksiyete', label: 'Anksiyete', en: 'anxiety disorder' },
        { slug: 'bipolar', label: 'Bipolar Bozukluk', en: 'bipolar disorder' },
        { slug: 'sizofren', label: 'Şizofreni', en: 'schizophrenia' },
      ]},
      { label: 'Beyin & Davranış', topics: [
        { slug: 'uyku-bozuklugu', label: 'Uyku Bozukluğu', en: 'sleep disorder' },
        { slug: 'bagimlilik', label: 'Bağımlılık', en: 'addiction substance use' },
        { slug: 'otizm', label: 'Otizm', en: 'autism spectrum disorder' },
        { slug: 'dikkat-eksikligi', label: 'ADHD', en: 'attention deficit disorder' },
      ]},
    ]
  },
  {
    id: 'biology', icon: '🧬', label: 'Biyoloji & Genetik',
    subcategories: [
      { label: 'Genetik', topics: [
        { slug: 'crispr', label: 'CRISPR Gen Düzenleme', en: 'CRISPR gene editing' },
        { slug: 'gen-tedavisi', label: 'Gen Tedavisi', en: 'gene therapy' },
        { slug: 'genomik', label: 'Genomik', en: 'genomics' },
        { slug: 'epigenetik', label: 'Epigenetik', en: 'epigenetics' },
      ]},
      { label: 'Mikrobiyoloji', topics: [
        { slug: 'mikrobiyom', label: 'Mikrobiyom', en: 'microbiome gut bacteria' },
        { slug: 'probiyotik', label: 'Probiyotik', en: 'probiotic gut health' },
        { slug: 'viroloji', label: 'Viroloji', en: 'virology virus' },
        { slug: 'antibiyotik', label: 'Antibiyotik', en: 'antibiotic' },
      ]},
      { label: 'Hücre & Molekül', topics: [
        { slug: 'kok-hucre', label: 'Kök Hücre', en: 'stem cell' },
        { slug: 'protein-katlama', label: 'Protein Katlama', en: 'protein folding' },
        { slug: 'mitokondri', label: 'Mitokondri', en: 'mitochondria' },
        { slug: 'apoptoz', label: 'Apoptoz', en: 'apoptosis cell death' },
      ]},
    ]
  },
  {
    id: 'technology', icon: '💻', label: 'Teknoloji & Yapay Zeka',
    subcategories: [
      { label: 'Yapay Zeka', topics: [
        { slug: 'yapay-zeka-tip', label: 'AI ve Tıp', en: 'artificial intelligence medicine' },
        { slug: 'derin-ogrenme', label: 'Derin Öğrenme', en: 'deep learning neural network' },
        { slug: 'dogal-dil-isleme', label: 'NLP', en: 'natural language processing' },
        { slug: 'makine-ogrenmesi', label: 'Makine Öğrenmesi', en: 'machine learning' },
      ]},
      { label: 'Biyoteknoloji', topics: [
        { slug: 'nanoteknoloji', label: 'Nanoteknoloji', en: 'nanotechnology medicine' },
        { slug: 'biyosensor', label: 'Biyosensör', en: 'biosensor' },
        { slug: 'organ-chip', label: 'Organ-on-Chip', en: 'organ on chip' },
        { slug: '3d-biyoyazici', label: '3D Biyoyazıcı', en: '3D bioprinting' },
      ]},
      { label: 'Robotik & Cerrahi', topics: [
        { slug: 'robotik-cerrahi', label: 'Robotik Cerrahi', en: 'robotic surgery' },
        { slug: 'telesaglik', label: 'Telesağlık', en: 'telemedicine telehealth' },
        { slug: 'giyilebilir', label: 'Giyilebilir Teknoloji', en: 'wearable health technology' },
      ]},
    ]
  },
  {
    id: 'sports', icon: '💪', label: 'Spor & Beslenme',
    subcategories: [
      { label: 'Performans', topics: [
        { slug: 'kreatin', label: 'Kreatin', en: 'creatine supplementation' },
        { slug: 'spor-performans', label: 'Spor Performansı', en: 'athletic performance' },
        { slug: 'kas-hipertrofisi', label: 'Kas Hipertrofisi', en: 'muscle hypertrophy' },
        { slug: 'dayaniklilik', label: 'Dayanıklılık', en: 'endurance exercise' },
      ]},
      { label: 'Beslenme', topics: [
        { slug: 'aralıklı-oruc', label: 'Aralıklı Oruç', en: 'intermittent fasting' },
        { slug: 'omega-3', label: 'Omega-3', en: 'omega 3 fatty acids' },
        { slug: 'vitamin-d', label: 'Vitamin D', en: 'vitamin D deficiency' },
        { slug: 'magnezyum', label: 'Magnezyum', en: 'magnesium supplementation' },
      ]},
      { label: 'Yaralanma & İyileşme', topics: [
        { slug: 'spor-yaralanmasi', label: 'Spor Yaralanması', en: 'sports injury' },
        { slug: 'fizik-tedavi', label: 'Fizik Tedavi', en: 'physical therapy rehabilitation' },
        { slug: 'antrenman-toparlanma', label: 'Toparlanma', en: 'exercise recovery' },
      ]},
    ]
  },
  {
    id: 'environment', icon: '🌍', label: 'Çevre & İklim',
    subcategories: [
      { label: 'İklim', topics: [
        { slug: 'iklim-degisikligi', label: 'İklim Değişikliği', en: 'climate change' },
        { slug: 'karbondioksit', label: 'Karbon Emisyonu', en: 'carbon dioxide emissions' },
        { slug: 'yenilenebilir-enerji', label: 'Yenilenebilir Enerji', en: 'renewable energy solar' },
      ]},
      { label: 'Kirlilik', topics: [
        { slug: 'hava-kirliligi', label: 'Hava Kirliliği', en: 'air pollution health' },
        { slug: 'plastik-kirlilik', label: 'Plastik Kirliliği', en: 'microplastic pollution' },
        { slug: 'su-kirliligi', label: 'Su Kirliliği', en: 'water pollution' },
      ]},
      { label: 'Ekosistem', topics: [
        { slug: 'biodiversity', label: 'Biyoçeşitlilik', en: 'biodiversity conservation' },
        { slug: 'orman-yanginlari', label: 'Orman Yangınları', en: 'wildfire forest fire' },
        { slug: 'okyanuslar', label: 'Okyanuslar', en: 'ocean acidification coral reef' },
      ]},
    ]
  },
  {
    id: 'physics', icon: '⚛️', label: 'Fizik & Kimya',
    subcategories: [
      { label: 'Fizik', topics: [
        { slug: 'kuantum-fizik', label: 'Kuantum Fizik', en: 'quantum physics' },
        { slug: 'kuantum-bilgisayar', label: 'Kuantum Bilgisayar', en: 'quantum computing' },
        { slug: 'nükleer-fizik', label: 'Nükleer Fizik', en: 'nuclear physics' },
        { slug: 'madde-fizigi', label: 'Yoğun Madde', en: 'condensed matter physics' },
      ]},
      { label: 'Kimya', topics: [
        { slug: 'organik-kimya', label: 'Organik Kimya', en: 'organic chemistry synthesis' },
        { slug: 'ilaç-kimyasi', label: 'İlaç Kimyası', en: 'medicinal chemistry drug' },
        { slug: 'malzeme-bilimi', label: 'Malzeme Bilimi', en: 'materials science' },
        { slug: 'katalizor', label: 'Katalizör', en: 'catalysis chemical reaction' },
      ]},
    ]
  },
  {
    id: 'astronomy', icon: '🔭', label: 'Astronomi & Uzay',
    subcategories: [
      { label: 'Uzay', topics: [
        { slug: 'kara-delik', label: 'Kara Delik', en: 'black hole' },
        { slug: 'extrasolar-gezegen', label: 'Eksogezegenler', en: 'exoplanet' },
        { slug: 'kari-madde', label: 'Karanlık Madde', en: 'dark matter' },
        { slug: 'evrenin-genisleme', label: 'Evrenin Genişlemesi', en: 'universe expansion dark energy' },
      ]},
      { label: 'Uzay Tıbbı', topics: [
        { slug: 'uzay-saglik', label: 'Uzay ve Sağlık', en: 'space medicine astronaut health' },
        { slug: 'mars-arastirma', label: 'Mars Araştırması', en: 'mars exploration' },
      ]},
    ]
  },
  {
    id: 'aging', icon: '⏳', label: 'Yaşlanma & Uzun Ömür',
    subcategories: [
      { label: 'Yaşlanma', topics: [
        { slug: 'yaslanma-biyoloji', label: 'Yaşlanma Biyolojisi', en: 'aging biology longevity' },
        { slug: 'telomer', label: 'Telomer', en: 'telomere aging' },
        { slug: 'senolik', label: 'Senolitik', en: 'senolytic aging' },
        { slug: 'otofarji', label: 'Otofaji', en: 'autophagy' },
      ]},
      { label: 'Uzun Ömür', topics: [
        { slug: 'kalori-kisitlama', label: 'Kalori Kısıtlama', en: 'caloric restriction longevity' },
        { slug: 'nad-plus', label: 'NAD+', en: 'NAD+ aging' },
        { slug: 'sirutuin', label: 'Sirtuinler', en: 'sirtuin longevity' },
      ]},
    ]
  },
]

const UI_TEXT = {
  tr: {
    search: 'Ara', searching: 'Aranıyor...', placeholder: 'Örn: kreatin, alzheimer, kanser tedavisi...',
    found: 'araştırma bulundu', translating: 'Başlıklar çevriliyor...', noResult: 'Sonuç bulunamadı',
    popular: 'Popüler aramalar', newest: 'En Yeni', oldest: 'En Eski',
    translateRead: 'Özeti Çevir ve Oku', read: 'Özeti Oku', close: 'Kapat', translatingBtn: 'Çevriliyor...',
    source: 'Bilimsel Kaynak', favorites: 'Favorilerim', profile: 'Profilim', logout: 'Çıkış Yap', login: 'Giriş Yap',
    subtitle: 'Bilimsel araştırmalar', hero: 'Bilimi Keşfet',
    heroSub: 'Dünya genelindeki 35M+ bilimsel araştırmaya anında erişin.',
    noAbstract: 'Özet mevcut değil.', trending: 'Bu Hafta Trend', readingList: 'Okuma Listem',
    compare: 'Karşılaştır', compareBtn: 'Karşılaştır →', compareSelect: 'Karşılaştırmak için 2 makale seç',
    collections: 'Koleksiyonlarım', community: 'Topluluk', dailyArticle: 'Günün Araştırması', readMore: 'Devamını Oku →',
    filters: 'Filtreler', allTime: 'Tüm Zamanlar', last1week: 'Son 1 Hafta', last1month: 'Son 1 Ay', last1year: 'Son 1 Yıl', last5years: 'Son 5 Yıl', last10years: 'Son 10 Yıl',
    allTypes: 'Tüm Türler', clinicalTrial: 'Klinik Çalışma', review: 'Derleme', metaAnalysis: 'Meta-Analiz',
    randomized: 'Randomize', systematicReview: 'Sistematik Derleme', caseReport: 'Vaka Raporu',
    clearFilters: 'Temizle', invite: 'Davet Et', topics: 'Araştırma Alanları',
    startSearch: 'Aramaya Başla →', back: '← Geri',
    stats: ['35M+', '6', 'Freemium'],
    statsLabel: ['PubMed Makalesi', 'Dil Desteği', ''],
    emailPlaceholder: 'email@adresin.com', emailBtn: 'Abone Ol', emailSuccess: '✓ Abone oldunuz!',
    emailTitle: '📬 Yeni özelliklerden haberdar ol', emailSub: 'Haftalık bilim özeti ve yeni özellikler için email bırak',
    searchLimit: 'Günlük arama limitine ulaştınız (10/10)', translateLimit: 'Günlük çeviri limitine ulaştınız (5/5)',
    premiumRequired: 'Bu özellik Premium üyelik gerektirir', goPremiun: '👑 Premium\'a Geç',
    searchesLeft: 'arama hakkın kaldı', translatesLeft: 'çeviri hakkın kaldı',
    sourceLabel: 'Kaynak: PubMed · NIH Ulusal Tıp Kütüphanesi · Hakemli Bilimsel Dergi',
    premiumFilters: 'Filtreler Premium özelliğidir',
    loginRequired: 'Bu özelliği kullanmak için giriş yapın',
    loginBtn: 'Giriş Yap / Kayıt Ol',
    feedbackTitle: 'Geri Bildirim',
    feedbackPlaceholder: 'Önerinizi veya sorunuzu yazın...',
    feedbackBtn: 'Gönder',
    feedbackSuccess: '✓ Teşekkürler! Geri bildiriminiz alındı.',
    feedbackLabel: 'Uygulamamızı geliştirmemize yardım edin',
    exploreTopics: 'Tüm Araştırma Alanlarını Keşfet',
    features: ['Türkçe Çeviri', 'Akıllı Arama', 'Karşılaştırma', 'Atıf Sayısı', 'Topluluk', 'Koleksiyonlar'],
  },
  en: {
    search: 'Search', searching: 'Searching...', placeholder: 'E.g: creatine, alzheimer, cancer...',
    found: 'research found', translating: 'Translating...', noResult: 'No results found',
    popular: 'Popular searches', newest: 'Newest', oldest: 'Oldest',
    translateRead: 'Translate & Read', read: 'Read Abstract', close: 'Close', translatingBtn: 'Translating...',
    source: 'Scientific Source', favorites: 'Favorites', profile: 'Profile', logout: 'Sign Out', login: 'Sign In',
    subtitle: 'Scientific research', hero: 'Discover Science',
    heroSub: 'Access 35M+ scientific research instantly.',
    noAbstract: 'No abstract available.', trending: 'Trending', readingList: 'Reading List',
    compare: 'Compare', compareBtn: 'Compare →', compareSelect: 'Select 2 articles',
    collections: 'Collections', community: 'Community', dailyArticle: 'Article of the Day', readMore: 'Read More →',
    filters: 'Filters', allTime: 'All Time', last1week: 'Last Week', last1month: 'Last Month', last1year: 'Last Year', last5years: '5 Years', last10years: '10 Years',
    allTypes: 'All Types', clinicalTrial: 'Clinical Trial', review: 'Review', metaAnalysis: 'Meta-Analysis',
    randomized: 'Randomized', systematicReview: 'Systematic Review', caseReport: 'Case Report',
    clearFilters: 'Clear', invite: 'Invite', topics: 'Research Areas',
    startSearch: 'Start Searching →', back: '← Back',
    stats: ['35M+', '6', 'Freemium'],
    statsLabel: ['PubMed Articles', 'Languages', ''],
    emailPlaceholder: 'your@email.com', emailBtn: 'Subscribe', emailSuccess: '✓ Subscribed!',
    emailTitle: '📬 Stay updated', emailSub: 'Weekly science digest and new features',
    searchLimit: 'Daily limit reached (10/10)', translateLimit: 'Translation limit reached (5/5)',
    premiumRequired: 'Premium required', goPremiun: '👑 Go Premium',
    searchesLeft: 'searches left', translatesLeft: 'translations left',
    sourceLabel: 'Source: PubMed · NIH · Peer-reviewed Journal',
    premiumFilters: 'Filters are Premium',
    loginRequired: 'Sign in to use this feature',
    loginBtn: 'Sign In / Register',
    feedbackTitle: 'Feedback',
    feedbackPlaceholder: 'Write your suggestion...',
    feedbackBtn: 'Send',
    feedbackSuccess: '✓ Thank you!',
    feedbackLabel: 'Help us improve',
    exploreTopics: 'Explore All Research Areas',
    features: ['Auto Translation', 'Smart Search', 'Comparison', 'Citations', 'Community', 'Collections'],
  },
  de: { search: 'Suchen', searching: 'Suche...', placeholder: 'Z.B: Kreatin, Alzheimer...', found: 'Studien', translating: 'Übersetzen...', noResult: 'Keine Ergebnisse', popular: 'Beliebt', newest: 'Neueste', oldest: 'Älteste', translateRead: 'Übersetzen & Lesen', read: 'Lesen', close: 'Schließen', translatingBtn: 'Übersetzen...', source: 'Quelle', favorites: 'Favoriten', profile: 'Profil', logout: 'Abmelden', login: 'Anmelden', subtitle: 'Wissenschaft', hero: 'Wissenschaft entdecken', heroSub: 'Millionen Artikel sofort abrufen.', noAbstract: 'Kein Abstract.', trending: 'Trending', readingList: 'Leseliste', compare: 'Vergleichen', compareBtn: 'Vergleichen →', compareSelect: '2 wählen', collections: 'Sammlungen', community: 'Community', dailyArticle: 'Artikel des Tages', readMore: 'Mehr →', filters: 'Filter', allTime: 'Alle', last1week: 'Letzte Woche', last1month: 'Letzter Monat', last1year: 'Letztes Jahr', last5years: '5 Jahre', last10years: '10 Jahre', allTypes: 'Alle', clinicalTrial: 'Klinisch', review: 'Übersicht', metaAnalysis: 'Meta', randomized: 'Randomisiert', systematicReview: 'Systematisch', caseReport: 'Fall', clearFilters: 'Löschen', invite: 'Einladen', topics: 'Forschungsgebiete', startSearch: 'Suchen →', back: '← Zurück', stats: ['35M+', '6', 'Freemium'], statsLabel: ['Artikel', 'Sprachen', ''], emailPlaceholder: 'ihre@email.de', emailBtn: 'Abonnieren', emailSuccess: '✓ Abonniert!', emailTitle: '📬 Neuigkeiten', emailSub: 'Wöchentliche Zusammenfassung', searchLimit: 'Limit erreicht', translateLimit: 'Limit erreicht', premiumRequired: 'Premium', goPremiun: '👑 Premium', searchesLeft: 'übrig', translatesLeft: 'übrig', sourceLabel: 'Quelle: PubMed · NIH', premiumFilters: 'Filter Premium', loginRequired: 'Anmelden', loginBtn: 'Anmelden', feedbackTitle: 'Feedback', feedbackPlaceholder: 'Vorschlag...', feedbackBtn: 'Senden', feedbackSuccess: '✓ Danke!', feedbackLabel: 'App verbessern', exploreTopics: 'Alle Gebiete', features: ['Übersetzung', 'Suche', 'Vergleich', 'Zitate', 'Community', 'Sammlungen'] },
  fr: { search: 'Rechercher', searching: 'Recherche...', placeholder: 'Ex: créatine, alzheimer...', found: 'études', translating: 'Traduction...', noResult: 'Aucun résultat', popular: 'Populaires', newest: 'Récent', oldest: 'Ancien', translateRead: 'Traduire', read: 'Lire', close: 'Fermer', translatingBtn: 'Traduction...', source: 'Source', favorites: 'Favoris', profile: 'Profil', logout: 'Déconnexion', login: 'Connexion', subtitle: 'Science', hero: 'Découvrir la science', heroSub: 'Millions de recherches instantanément.', noAbstract: 'Aucun résumé.', trending: 'Tendances', readingList: 'Liste', compare: 'Comparer', compareBtn: 'Comparer →', compareSelect: 'Sélectionner 2', collections: 'Collections', community: 'Communauté', dailyArticle: 'Article du Jour', readMore: 'Lire →', filters: 'Filtres', allTime: 'Tout', last1week: 'Semaine', last1month: 'Mois', last1year: 'Année', last5years: '5 ans', last10years: '10 ans', allTypes: 'Tous', clinicalTrial: 'Essai', review: 'Revue', metaAnalysis: 'Méta', randomized: 'Randomisé', systematicReview: 'Systématique', caseReport: 'Cas', clearFilters: 'Effacer', invite: 'Inviter', topics: 'Domaines', startSearch: 'Rechercher →', back: '← Retour', stats: ['35M+', '6', 'Freemium'], statsLabel: ['Articles', 'Langues', ''], emailPlaceholder: 'email@example.fr', emailBtn: "S'abonner", emailSuccess: '✓ Abonné!', emailTitle: '📬 Restez informé', emailSub: 'Résumé hebdomadaire', searchLimit: 'Limite atteinte', translateLimit: 'Limite atteinte', premiumRequired: 'Premium', goPremiun: '👑 Premium', searchesLeft: 'restantes', translatesLeft: 'restantes', sourceLabel: 'Source: PubMed · NIH', premiumFilters: 'Filtres Premium', loginRequired: 'Connexion', loginBtn: 'Se connecter', feedbackTitle: 'Retour', feedbackPlaceholder: 'Suggestion...', feedbackBtn: 'Envoyer', feedbackSuccess: '✓ Merci!', feedbackLabel: 'Améliorer', exploreTopics: 'Explorer', features: ['Traduction', 'Recherche', 'Comparaison', 'Citations', 'Communauté', 'Collections'] },
  es: { search: 'Buscar', searching: 'Buscando...', placeholder: 'Ej: creatina, alzheimer...', found: 'estudios', translating: 'Traduciendo...', noResult: 'Sin resultados', popular: 'Populares', newest: 'Reciente', oldest: 'Antiguo', translateRead: 'Traducir', read: 'Leer', close: 'Cerrar', translatingBtn: 'Traduciendo...', source: 'Fuente', favorites: 'Favoritos', profile: 'Perfil', logout: 'Salir', login: 'Entrar', subtitle: 'Ciencia', hero: 'Descubrir la ciencia', heroSub: 'Millones de investigaciones instantáneamente.', noAbstract: 'Sin resumen.', trending: 'Tendencias', readingList: 'Lista', compare: 'Comparar', compareBtn: 'Comparar →', compareSelect: 'Seleccionar 2', collections: 'Colecciones', community: 'Comunidad', dailyArticle: 'Artículo del Día', readMore: 'Leer →', filters: 'Filtros', allTime: 'Todo', last1week: 'Semana', last1month: 'Mes', last1year: 'Año', last5years: '5 años', last10years: '10 años', allTypes: 'Todos', clinicalTrial: 'Ensayo', review: 'Revisión', metaAnalysis: 'Meta', randomized: 'Aleatorio', systematicReview: 'Sistemático', caseReport: 'Caso', clearFilters: 'Limpiar', invite: 'Invitar', topics: 'Áreas', startSearch: 'Buscar →', back: '← Volver', stats: ['35M+', '6', 'Freemium'], statsLabel: ['Artículos', 'Idiomas', ''], emailPlaceholder: 'email@ejemplo.com', emailBtn: 'Suscribirse', emailSuccess: '✓ Suscrito!', emailTitle: '📬 Novedades', emailSub: 'Resumen semanal', searchLimit: 'Límite alcanzado', translateLimit: 'Límite alcanzado', premiumRequired: 'Premium', goPremiun: '👑 Premium', searchesLeft: 'restantes', translatesLeft: 'restantes', sourceLabel: 'Fuente: PubMed · NIH', premiumFilters: 'Filtros Premium', loginRequired: 'Iniciar sesión', loginBtn: 'Iniciar sesión', feedbackTitle: 'Comentarios', feedbackPlaceholder: 'Sugerencia...', feedbackBtn: 'Enviar', feedbackSuccess: '✓ Gracias!', feedbackLabel: 'Mejorar app', exploreTopics: 'Explorar', features: ['Traducción', 'Búsqueda', 'Comparación', 'Citas', 'Comunidad', 'Colecciones'] },
  ar: { search: 'بحث', searching: 'جاري البحث...', placeholder: 'مثال: كرياتين، الزهايمر...', found: 'دراسة', translating: 'ترجمة...', noResult: 'لا نتائج', popular: 'شائع', newest: 'الأحدث', oldest: 'الأقدم', translateRead: 'ترجمة', read: 'قراءة', close: 'إغلاق', translatingBtn: 'ترجمة...', source: 'المصدر', favorites: 'المفضلة', profile: 'الملف', logout: 'خروج', login: 'دخول', subtitle: 'العلوم', hero: 'اكتشف العلم', heroSub: 'ملايين الأبحاث فوراً.', noAbstract: 'لا ملخص.', trending: 'رائج', readingList: 'قائمة', compare: 'مقارنة', compareBtn: 'مقارنة →', compareSelect: 'اختر 2', collections: 'مجموعات', community: 'مجتمع', dailyArticle: 'بحث اليوم', readMore: 'المزيد →', filters: 'فلاتر', allTime: 'الكل', last1week: 'أسبوع', last1month: 'شهر', last1year: 'سنة', last5years: '5 سنوات', last10years: '10 سنوات', allTypes: 'الكل', clinicalTrial: 'تجربة', review: 'مراجعة', metaAnalysis: 'تحليل', randomized: 'عشوائي', systematicReview: 'منهجي', caseReport: 'حالة', clearFilters: 'مسح', invite: 'دعوة', topics: 'مجالات البحث', startSearch: 'ابدأ البحث →', back: '← رجوع', stats: ['35M+', '6', 'Freemium'], statsLabel: ['مقال', 'لغات', ''], emailPlaceholder: 'بريدك@email.com', emailBtn: 'اشترك', emailSuccess: '✓ تم!', emailTitle: '📬 ابق على اطلاع', emailSub: 'ملخص أسبوعي', searchLimit: 'تم الوصول للحد', translateLimit: 'تم الوصول للحد', premiumRequired: 'Premium', goPremiun: '👑 Premium', searchesLeft: 'متبقي', translatesLeft: 'متبقي', sourceLabel: 'المصدر: PubMed · NIH', premiumFilters: 'الفلاتر Premium', loginRequired: 'سجل الدخول', loginBtn: 'تسجيل الدخول', feedbackTitle: 'تعليقات', feedbackPlaceholder: 'اقتراح...', feedbackBtn: 'إرسال', feedbackSuccess: '✓ شكراً!', feedbackLabel: 'تحسين التطبيق', exploreTopics: 'استكشاف', features: ['ترجمة', 'بحث', 'مقارنة', 'اقتباسات', 'مجتمع', 'مجموعات'] },
}

const FEATURE_ICONS = ['🌐', '🔍', '⚖️', '📊', '💬', '📚']

const SEARCH_CATEGORIES = [
  { id: 'all', icon: '🔬' },
  { id: 'medicine', icon: '🏥' },
  { id: 'biology', icon: '🧬' },
  { id: 'neuro', icon: '🧠' },
  { id: 'technology', icon: '💻' },
  { id: 'sports', icon: '💪' },
  { id: 'environment', icon: '🌍' },
  { id: 'physics', icon: '⚛️' },
  { id: 'astronomy', icon: '🔭' },
]

const CATEGORY_QUERIES = {
  medicine: 'clinical trial treatment disease',
  biology: 'molecular biology genetics',
  neuro: 'neuroscience brain',
  technology: 'artificial intelligence machine learning',
  sports: 'exercise nutrition sports',
  environment: 'climate change environment',
  physics: 'quantum physics',
  astronomy: 'astronomy astrophysics',
}

const POPULAR_SEARCHES = {
  tr: ['kreatin', 'alzheimer', 'kanser tedavisi', 'covid-19', 'depresyon'],
  en: ['creatine', 'alzheimer', 'cancer treatment', 'covid-19', 'depression'],
  de: ['Kreatin', 'Alzheimer', 'Krebsbehandlung', 'covid-19', 'Depression'],
  fr: ['créatine', 'alzheimer', 'traitement cancer', 'covid-19', 'dépression'],
  es: ['creatina', 'alzheimer', 'tratamiento cáncer', 'covid-19', 'depresión'],
  ar: ['كرياتين', 'الزهايمر', 'علاج السرطان', 'كوفيد-19', 'الاكتئاب'],
}

const SUGGESTIONS_BASE = {
  tr: ['kanser', 'alzheimer', 'depresyon', 'diyabet', 'hipertansiyon', 'kalp hastalığı', 'obezite', 'covid', 'grip', 'antibiyotik', 'vitamin d', 'omega 3', 'probiyotik', 'kreatin', 'magnezyum', 'demir eksikliği', 'tiroid', 'gut hastalığı', 'migren', 'astım', 'parkinson', 'ms hastalığı', 'crispr', 'yapay zeka', 'nanoteknoloji'],
  en: ['cancer', 'alzheimer', 'depression', 'diabetes', 'hypertension', 'heart disease', 'obesity', 'covid', 'influenza', 'antibiotic', 'vitamin d', 'omega 3', 'probiotic', 'creatine', 'magnesium', 'iron deficiency', 'thyroid', 'gout', 'migraine', 'asthma', 'parkinson', 'crispr', 'artificial intelligence'],
}

const getDateFilter = (period) => {
  const now = new Date()
  const pad = n => String(n).padStart(2, '0')
  const fmt = d => `${d.getFullYear()}/${pad(d.getMonth()+1)}/${pad(d.getDate())}`
  const today = fmt(now)
  if (period === 'last1week') { const d = new Date(); d.setDate(d.getDate()-7); return { minDate: fmt(d), maxDate: today } }
  if (period === 'last1month') { const d = new Date(); d.setMonth(d.getMonth()-1); return { minDate: fmt(d), maxDate: today } }
  if (period === 'last1year') return { minDate: `${now.getFullYear()-1}/01/01`, maxDate: `${now.getFullYear()}/12/31` }
  if (period === 'last5years') return { minDate: `${now.getFullYear()-5}/01/01`, maxDate: `${now.getFullYear()}/12/31` }
  if (period === 'last10years') return { minDate: `${now.getFullYear()-10}/01/01`, maxDate: `${now.getFullYear()}/12/31` }
  return {}
}

const translateOne = async (text, targetLang = 'tr') => {
  if (!text) return null
  if (targetLang === 'en') return text
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
    const res = await fetch(url)
    const data = await res.json()
    return data[0]?.map(t => t[0]).filter(Boolean).join('') || null
  } catch { return null }
}

const sortArticles = (articles, sortBy) => {
  const arr = [...articles]
  if (sortBy === 'newest') return arr.sort((a, b) => (parseInt(b.published_date)||0) - (parseInt(a.published_date)||0))
  if (sortBy === 'oldest') return arr.sort((a, b) => (parseInt(a.published_date)||0) - (parseInt(b.published_date)||0))
  return arr
}

const AbstractDisplay = memo(({ text, noAbstract, dark }) => {
  if (!text) return <p className={`text-sm italic ${dark ? 'text-white/40' : 'text-black/40'}`}>{noAbstract}</p>
  const sections = text.split('\n\n').filter(Boolean)
  if (sections.length <= 1) return <p className={`text-sm leading-relaxed ${dark ? 'text-white/80' : 'text-black/80'}`}>{text}</p>
  return (
    <div className="flex flex-col gap-3">
      {sections.map((section, i) => {
        const colonIdx = section.indexOf(':')
        if (colonIdx > 0 && colonIdx < 30) {
          const label = section.slice(0, colonIdx)
          const content = section.slice(colonIdx+1).trim()
          return <div key={i}><span className="text-xs font-semibold text-blue-400 uppercase tracking-wide">{label}</span><p className={`text-sm leading-relaxed mt-1 ${dark ? 'text-white/80' : 'text-black/80'}`}>{content}</p></div>
        }
        return <p key={i} className={`text-sm leading-relaxed ${dark ? 'text-white/80' : 'text-black/80'}`}>{section}</p>
      })}
    </div>
  )
})

const SCHEMA = {
  '@context': 'https://schema.org', '@type': 'WebSite', name: 'BİLİMCE',
  url: 'https://bilimce.vercel.app', description: 'Dünya genelindeki bilimsel araştırmaları Türkçe okuyun.',
  potentialAction: { '@type': 'SearchAction', target: 'https://bilimce.vercel.app/?q={search_term_string}', 'query-input': 'required name=search_term_string' }
}

function EmailForm({ dark, t }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const handleSubmit = async () => {
    if (!email.trim() || !email.includes('@')) return
    setLoading(true)
    try { await supabase.from('email_subscribers').upsert({ email: email.trim() }); setStatus('success'); setEmail('') } catch {}
    setLoading(false)
  }
  return (
    <div className="flex gap-2 max-w-sm mx-auto">
      {status === 'success' ? <p className="text-green-400 text-sm font-medium w-full text-center py-3">{t.emailSuccess}</p> : (
        <>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} placeholder={t.emailPlaceholder} className={`flex-1 ${dark ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/10 text-black'} border rounded-xl px-4 py-2.5 placeholder-white/25 outline-none text-sm`} />
          <button onClick={handleSubmit} disabled={loading || !email.trim()} className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition disabled:opacity-50 whitespace-nowrap">{loading ? '...' : t.emailBtn}</button>
        </>
      )}
    </div>
  )
}

function FeedbackForm({ dark, t }) {
  const [feedback, setFeedback] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)
  const handleSubmit = async () => {
    if (!feedback.trim()) return
    setLoading(true)
    try {
      await supabase.from('feedback').insert({ content: feedback.trim(), created_at: new Date().toISOString() })
      setStatus('success'); setFeedback('')
      setTimeout(() => { setStatus(''); setShow(false) }, 3000)
    } catch {}
    setLoading(false)
  }
  return (
    <div className="fixed bottom-6 right-6 z-40">
      {show ? (
        <div className={`${dark ? 'bg-[#1a1a2e] border-white/10' : 'bg-white border-black/10'} border rounded-2xl p-5 w-72 shadow-2xl`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={`text-sm font-bold ${dark ? 'text-white' : 'text-black'}`}>💬 {t.feedbackTitle}</h3>
            <button onClick={() => setShow(false)} className="text-white/30 hover:text-white transition text-xs">✕</button>
          </div>
          <p className={`text-xs ${dark ? 'text-white/40' : 'text-black/40'} mb-3`}>{t.feedbackLabel}</p>
          {status === 'success' ? (
            <p className="text-green-400 text-sm text-center py-2">{t.feedbackSuccess}</p>
          ) : (
            <>
              <textarea value={feedback} onChange={e => setFeedback(e.target.value)} placeholder={t.feedbackPlaceholder} rows={3} className={`w-full ${dark ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/10 text-black'} border rounded-xl px-3 py-2 text-sm outline-none resize-none mb-3 placeholder-white/25`} />
              <button onClick={handleSubmit} disabled={loading || !feedback.trim()} className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition disabled:opacity-50">
                {loading ? '...' : t.feedbackBtn}
              </button>
            </>
          )}
        </div>
      ) : (
        <button onClick={() => setShow(true)} className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-xl hover:opacity-90 transition text-xl">
          💬
        </button>
      )}
    </div>
  )
}

function TopicExplorer({ dark, t, onSearch }) {
  const [expandedCategory, setExpandedCategory] = useState(null)

  const bg = dark ? 'bg-white/3' : 'bg-black/3'
  const border = dark ? 'border-white/5' : 'border-black/10'
  const text = dark ? 'text-white' : 'text-black'
  const textMuted = dark ? 'text-white/50' : 'text-black/50'

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-lg font-bold ${text}`}>🗺️ {t.topics}</h2>
      </div>
      <div className="grid gap-3">
        {TOPIC_CATEGORIES.map(cat => (
          <div key={cat.id} className={`${bg} border ${expandedCategory === cat.id ? 'border-blue-500/30' : border} rounded-2xl overflow-hidden transition-all`}>
            <button
              onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/3 transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{cat.icon}</span>
                <span className={`font-semibold ${text}`}>{cat.label}</span>
                <span className={`text-xs ${textMuted}`}>
                  {cat.subcategories.reduce((acc, sub) => acc + sub.topics.length, 0)} konu
                </span>
              </div>
              <span className={`text-xs ${textMuted} transition-transform ${expandedCategory === cat.id ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {expandedCategory === cat.id && (
              <div className="px-5 pb-5 border-t border-white/5">
                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  {cat.subcategories.map((sub, si) => (
                    <div key={si}>
                      <p className={`text-xs font-bold ${textMuted} uppercase tracking-wide mb-2`}>{sub.label}</p>
                      <div className="flex flex-wrap gap-2">
                        {sub.topics.map(topic => (
                          <button
                            key={topic.slug}
                            onClick={() => onSearch(topic.en, topic.label)}
                            className={`px-3 py-1.5 ${dark ? 'bg-white/5 border-white/10 text-white/70 hover:bg-blue-500/20 hover:border-blue-500/30 hover:text-blue-300' : 'bg-black/5 border-black/10 text-black/70 hover:bg-blue-500/10'} border rounded-xl text-xs transition`}
                          >
                            {topic.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [articles, setArticles] = useState([])
  const articlesRef = useRef([])
  const [loading, setLoading] = useState(false)
  const [translating, setTranslating] = useState({})
  const [activeCategory, setActiveCategory] = useState('all')
  const [searched, setSearched] = useState(false)
  const [expandedId, setExpandedId] = useState(null)
  const [autoTranslating, setAutoTranslating] = useState(false)
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [favorites, setFavorites] = useState({})
  const [favLoading, setFavLoading] = useState({})
  const [readingList, setReadingList] = useState({})
  const [readLoading, setReadLoading] = useState({})
  const [sortBy, setSortBy] = useState('newest')
  const [showSort, setShowSort] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [sharePopup, setSharePopup] = useState(null)
  const [copied, setCopied] = useState(false)
  const [lang, setLang] = useState('tr')
  const [showLang, setShowLang] = useState(false)
  const [trending, setTrending] = useState([])
  const [dark, setDark] = useState(true)
  const [notifCount, setNotifCount] = useState(0)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [recentSearches, setRecentSearches] = useState([])
  const [compareList, setCompareList] = useState([])
  const [collections, setCollections] = useState([])
  const [collectionPopup, setCollectionPopup] = useState(null)
  const [addingToCollection, setAddingToCollection] = useState(false)
  const [dailyArticle, setDailyArticle] = useState(null)
  const [dailyTitleTr, setDailyTitleTr] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filterPeriod, setFilterPeriod] = useState('allTime')
  const [filterType, setFilterType] = useState('')
  const [isPremium, setIsPremium] = useState(false)
  const [searchCount, setSearchCount] = useState(0)
  const [translateCount, setTranslateCount] = useState(0)
  const [limitPopup, setLimitPopup] = useState(null)
  const [userLoaded, setUserLoaded] = useState(false)
  const [searchLabel, setSearchLabel] = useState('')
  const inputRef = useRef(null)

  const t = UI_TEXT[lang]
  const hasActiveFilters = filterPeriod !== 'allTime' || filterType !== ''
  const SEARCH_LIMIT = 10
  const TRANSLATE_LIMIT = 5
  const canUseFilters = userLoaded && isPremium

  useEffect(() => {
    const savedLang = localStorage.getItem('bilimce_lang')
    if (savedLang) setLang(savedLang)
    const savedTheme = localStorage.getItem('bilimce_theme')
    if (savedTheme === 'light') { setDark(false); document.documentElement.classList.add('light') }
    const savedRecent = localStorage.getItem('bilimce_recent')
    if (savedRecent) setRecentSearches(JSON.parse(savedRecent))
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null)
      setUserLoaded(true)
      if (data?.user) { loadFavorites(data.user.id); loadUsername(data.user.id); loadReadingList(data.user.id); checkNotifications(data.user.id); loadCollections(data.user.id); loadUsage(data.user.id) }
    })
    fetch('/api/trending').then(r => r.json()).then(d => setTrending(d.trending || []))
    fetch('/api/daily').then(r => r.json()).then(async d => {
      if (d.article) { setDailyArticle(d.article); const titleTr = await translateOne(d.article.title_en, savedLang || 'tr'); setDailyTitleTr(titleTr) }
    })
    const handlePopState = (e) => {
      if (e.state?.searched) { setSearched(true) }
      else { setSearched(false); setQuery(''); setSearchLabel(''); articlesRef.current = []; setArticles([]) }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const loadUsage = async (userId) => {
    try {
      const res = await fetch(`/api/usage?userId=${userId}`)
      const data = await res.json()
      setIsPremium(data.isPremium || false)
      setSearchCount(data.searchCount || 0)
      setTranslateCount(data.translateCount || 0)
    } catch {}
  }

  const incrementUsage = async (type) => {
    if (!user) return
    try {
      const res = await fetch('/api/usage', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: user.id, type }) })
      const data = await res.json()
      if (type === 'search') setSearchCount(data.count || 0)
      if (type === 'translate') setTranslateCount(data.count || 0)
    } catch {}
  }

  const loadCollections = async (userId) => {
    const { data } = await supabase.from('collections').select('*').eq('user_id', userId).order('created_at', { ascending: false })
    setCollections(data || [])
  }

  const addToCollection = async (collectionId, article) => {
    setAddingToCollection(true)
    await supabase.from('collection_articles').upsert({ collection_id: collectionId, user_id: user.id, pubmed_id: article.pubmed_id, title_en: article.title_en, title_tr: article.title_tr, journal: article.journal, published_date: article.published_date, authors: article.authors })
    setAddingToCollection(false); setCollectionPopup(null)
  }

  const toggleCompare = (article) => {
    setCompareList(prev => {
      if (prev.find(a => a.pubmed_id === article.pubmed_id)) return prev.filter(a => a.pubmed_id !== article.pubmed_id)
      if (prev.length >= 2) return prev
      return [...prev, article]
    })
  }

  const goCompare = () => { if (compareList.length === 2) window.location.href = `/compare?id1=${compareList[0].pubmed_id}&id2=${compareList[1].pubmed_id}` }

  const updateSuggestions = (value) => {
    if (!value.trim()) { setSuggestions([]); return }
    const base = SUGGESTIONS_BASE[lang] || SUGGESTIONS_BASE.tr
    const filtered = base.filter(s => s.toLowerCase().includes(value.toLowerCase()) && s.toLowerCase() !== value.toLowerCase()).slice(0, 5)
    const recentFiltered = recentSearches.filter(s => s.toLowerCase().includes(value.toLowerCase()) && s.toLowerCase() !== value.toLowerCase()).slice(0, 3)
    setSuggestions([...new Set([...recentFiltered, ...filtered])].slice(0, 6))
  }

  const handleQueryChange = (e) => { setQuery(e.target.value); updateSuggestions(e.target.value); setShowSuggestions(true) }
  const selectSuggestion = (s) => { setQuery(s); setShowSuggestions(false); setSuggestions([]); handleSearch(s) }
  const saveRecentSearch = (q) => { const updated = [q, ...recentSearches.filter(s => s !== q)].slice(0, 10); setRecentSearches(updated); localStorage.setItem('bilimce_recent', JSON.stringify(updated)) }

  const goBack = () => {
    setSearched(false); setQuery(''); setSearchLabel(''); articlesRef.current = []; setArticles([])
    window.history.pushState({}, '', '/')
  }

  const checkNotifications = async (userId) => {
    try {
      const { data: subs } = await supabase.from('topic_subscriptions').select('topic').eq('user_id', userId)
      if (!subs || subs.length === 0) return
      const lastWeek = new Date(); lastWeek.setDate(lastWeek.getDate()-7)
      const dateStr = lastWeek.toISOString().split('T')[0].replace(/-/g, '/')
      let total = 0
      for (const sub of subs) {
        try {
          const res = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(sub.topic)}[Title]&mindate=${dateStr}&datetype=pdat&retmode=json&retmax=1`)
          const data = await res.json()
          total += parseInt(data.esearchresult?.count || 0)
        } catch {}
      }
      setNotifCount(total)
    } catch {}
  }

  const toggleTheme = () => {
    const newDark = !dark; setDark(newDark)
    if (newDark) { document.documentElement.classList.remove('light'); localStorage.setItem('bilimce_theme', 'dark') }
    else { document.documentElement.classList.add('light'); localStorage.setItem('bilimce_theme', 'light') }
  }

  const bg = dark ? 'bg-[#0a0a0f]' : 'bg-[#f8f9ff]'
  const border = dark ? 'border-white/5' : 'border-black/10'
  const text = dark ? 'text-white' : 'text-black'
  const textMuted = dark ? 'text-white/60' : 'text-black/60'
  const cardBg = dark ? 'bg-white/3' : 'bg-black/3'
  const inputBg = dark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'

  const changeLang = (code) => { setLang(code); localStorage.setItem('bilimce_lang', code); setShowLang(false); if (articlesRef.current.length > 0) retranslateArticles(code) }

  const retranslateArticles = async (targetLang) => {
    setAutoTranslating(true)
    const updated = [...articlesRef.current]
    for (let g = 0; g < updated.length; g += 5) {
      const group = updated.slice(g, g + 5)
      const translated = await Promise.all(group.map(a => translateOne(a.title_en, targetLang)))
      translated.forEach((title_tr, idx) => { if (title_tr) updated[g+idx] = { ...updated[g+idx], title_tr } })
      articlesRef.current = [...updated]; setArticles([...updated])
      await new Promise(r => setTimeout(r, 200))
    }
    setAutoTranslating(false)
  }

  const loadUsername = async (userId) => { const { data } = await supabase.from('profiles').select('username').eq('id', userId).single(); if (data?.username) setUsername(data.username) }
  const loadFavorites = async (userId) => { const { data } = await supabase.from('favorites').select('pubmed_id').eq('user_id', userId); if (data) { const m = {}; data.forEach(f => { m[f.pubmed_id] = true }); setFavorites(m) } }
  const loadReadingList = async (userId) => { const { data } = await supabase.from('reading_list').select('pubmed_id').eq('user_id', userId); if (data) { const m = {}; data.forEach(r => { m[r.pubmed_id] = true }); setReadingList(m) } }
  const saveSearchHistory = async (q) => { if (!user) return; await supabase.from('search_history').insert({ user_id: user.id, query: q }) }

  const toggleFavorite = async (article) => {
    if (!user) { window.location.href = '/auth'; return }
    const isFav = favorites[article.pubmed_id]
    setFavLoading(prev => ({ ...prev, [article.pubmed_id]: true }))
    try {
      if (isFav) { await supabase.from('favorites').delete().eq('user_id', user.id).eq('pubmed_id', article.pubmed_id); setFavorites(prev => { const n = { ...prev }; delete n[article.pubmed_id]; return n }) }
      else { await supabase.from('favorites').insert({ user_id: user.id, pubmed_id: article.pubmed_id, title_en: article.title_en, title_tr: article.title_tr, abstract_en: article.abstract_en, abstract_tr: article.abstract_tr, journal: article.journal, published_date: article.published_date, authors: article.authors }); setFavorites(prev => ({ ...prev, [article.pubmed_id]: true })) }
    } catch {}
    finally { setFavLoading(prev => ({ ...prev, [article.pubmed_id]: false })) }
  }

  const toggleReadingList = async (article) => {
    if (!user) { window.location.href = '/auth'; return }
    const isIn = readingList[article.pubmed_id]
    setReadLoading(prev => ({ ...prev, [article.pubmed_id]: true }))
    try {
      if (isIn) { await supabase.from('reading_list').delete().eq('user_id', user.id).eq('pubmed_id', article.pubmed_id); setReadingList(prev => { const n = { ...prev }; delete n[article.pubmed_id]; return n }) }
      else { await supabase.from('reading_list').insert({ user_id: user.id, pubmed_id: article.pubmed_id, title_en: article.title_en, title_tr: article.title_tr, journal: article.journal, published_date: article.published_date, authors: article.authors }); setReadingList(prev => ({ ...prev, [article.pubmed_id]: true })) }
    } catch {}
    finally { setReadLoading(prev => ({ ...prev, [article.pubmed_id]: false })) }
  }

  const shareArticle = (article) => setSharePopup(article)
  const copyLink = (article) => { navigator.clipboard.writeText(`https://pubmed.ncbi.nlm.nih.gov/${article.pubmed_id}/`); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  const shareWhatsApp = (article) => { window.open(`https://wa.me/?text=${encodeURIComponent(`*${article.title_tr || article.title_en}*\n\nhttps://pubmed.ncbi.nlm.nih.gov/${article.pubmed_id}/\n\n_BİLİMCE ile paylaşıldı_`)}`, '_blank') }
  const updateArticles = (arr) => { articlesRef.current = arr; setArticles([...arr]) }

  const handleSearch = useCallback(async (searchQuery, label) => {
    const q = searchQuery || query
    if (!q.trim()) return
    if (userLoaded && !user) { setLimitPopup('login'); return }
    if (userLoaded && user && !isPremium && searchCount >= SEARCH_LIMIT) { setLimitPopup('search'); return }
    setShowSuggestions(false); setLoading(true); setSearched(true); setExpandedId(null); updateArticles([])
    if (label) setSearchLabel(label)
    saveRecentSearch(q)
    window.history.pushState({ searched: true, query: q }, '', `/?q=${encodeURIComponent(q)}`)
    const hasAdvancedFilters = filterPeriod !== 'allTime' || filterType !== ''
    if (hasAdvancedFilters && !isPremium) { setLimitPopup('filters'); setLoading(false); return }
    const activeFilters = { ...getDateFilter(filterPeriod), articleType: filterType || undefined }
    const resultLimit = isPremium ? 100 : 20
    try {
      const results = await searchPubMed(q, resultLimit, activeFilters)
      const sorted = sortArticles(results, sortBy)
      updateArticles(sorted); setLoading(false); saveSearchHistory(q)
      if (user) await incrementUsage('search')
      if (lang !== 'en') {
        setAutoTranslating(true)
        const updated = [...sorted]
        for (let g = 0; g < updated.length; g += 5) {
          const group = updated.slice(g, g + 5)
          const translated = await Promise.all(group.map(a => translateOne(a.title_en, lang)))
          translated.forEach((title_tr, idx) => { if (title_tr) updated[g+idx] = { ...updated[g+idx], title_tr } })
          updateArticles([...updated]); await new Promise(r => setTimeout(r, 150))
        }
        setAutoTranslating(false)
      }
    } catch (err) { console.error(err); setLoading(false); setAutoTranslating(false) }
  }, [query, sortBy, lang, recentSearches, filterPeriod, filterType, user, isPremium, searchCount, userLoaded])

  const handleSortChange = (newSort) => { setSortBy(newSort); setShowSort(false); updateArticles(sortArticles(articlesRef.current, newSort)) }
  const handleCategoryClick = async (cat) => {
    setActiveCategory(cat.id)
    if (cat.id === 'all') { goBack(); return }
    const q = CATEGORY_QUERIES[cat.id] || cat.id
    setQuery(q); await handleSearch(q)
  }

  const translateArticle = async (article, index) => {
    if (article.abstract_tr) { setExpandedId(expandedId === index ? null : index); return }
    if (userLoaded && !user) { setLimitPopup('login'); return }
    if (userLoaded && user && !isPremium && translateCount >= TRANSLATE_LIMIT) { setLimitPopup('translate'); return }
    setTranslating(prev => ({ ...prev, [index]: true }))
    try {
      const res = await fetch('/api/translate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: article.title_en, abstract: article.abstract_en }) })
      const data = await res.json()
      const updated = [...articlesRef.current]
      updated[index] = { ...updated[index], title_tr: data.title_tr, abstract_tr: data.abstract_tr }
      updateArticles(updated); setExpandedId(index)
      if (user) await incrementUsage('translate')
    } catch {}
    finally { setTranslating(prev => ({ ...prev, [index]: false })) }
  }

  const currentLang = LANGUAGES.find(l => l.code === lang)
  const displayName = (username || user?.email?.split('@')[0] || '').slice(0, 10)

  const PERIOD_OPTIONS = [
    { id: 'allTime', label: t.allTime },
    { id: 'last1week', label: t.last1week },
    { id: 'last1month', label: t.last1month },
    { id: 'last1year', label: t.last1year },
    { id: 'last5years', label: t.last5years },
    { id: 'last10years', label: t.last10years },
  ]

  const TYPE_OPTIONS = [
    { id: '', label: t.allTypes },
    { id: 'clinical-trial', label: t.clinicalTrial },
    { id: 'review', label: t.review },
    { id: 'meta-analysis', label: t.metaAnalysis },
    { id: 'randomized', label: t.randomized },
    { id: 'systematic-review', label: t.systematicReview },
    { id: 'case-report', label: t.caseReport },
  ]

  return (
    <div className={`min-h-screen ${bg}`} onClick={() => { setShowMenu(false); setShowSort(false); setShowLang(false); setShowSuggestions(false) }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      {limitPopup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4" onClick={() => setLimitPopup(null)}>
          <div className="bg-[#1a1a2e] border border-yellow-500/30 rounded-2xl p-8 max-w-sm w-full text-center" onClick={e => e.stopPropagation()}>
            <div className="text-4xl mb-4">{limitPopup === 'login' ? '🔐' : '👑'}</div>
            <h2 className="text-xl font-bold text-white mb-2">
              {limitPopup === 'login' ? t.loginRequired : limitPopup === 'search' ? t.searchLimit : limitPopup === 'translate' ? t.translateLimit : limitPopup === 'filters' ? t.premiumFilters : t.premiumRequired}
            </h2>
            <p className="text-white/50 text-sm mb-6">
              {limitPopup === 'login' ? 'Ücretsiz hesap oluşturun ve araştırmaları keşfetmeye başlayın.' : 'Premium üyelik ile sınırsız kullanım yapabilirsiniz.'}
            </p>
            {limitPopup === 'login' ? (
              <a href="/auth" className="block w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-sm font-bold text-white hover:opacity-90 transition mb-3">{t.loginBtn}</a>
            ) : (
              <a href="/premium" className="block w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl text-sm font-bold text-black hover:opacity-90 transition mb-3">{t.goPremiun}</a>
            )}
            <button onClick={() => setLimitPopup(null)} className="text-white/30 text-sm hover:text-white transition">Kapat</button>
          </div>
        </div>
      )}

      <header className={`border-b ${border} px-3 py-3 sticky top-0 z-30`} style={{ background: dark ? 'rgba(10,10,15,0.97)' : 'rgba(248,249,255,0.97)' }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 shrink-0">
            <img src="/logo.svg" alt="B" className="w-7 h-7 shrink-0" />
            <span className={`font-bold text-base tracking-tight ${text} whitespace-nowrap`}>BİLİMCE</span>
          </div>
          <div className="flex items-center gap-1.5">
            {userLoaded && user && !isPremium && <a href="/premium" className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-xl text-xs font-semibold hover:bg-yellow-500/20 transition">👑 Premium</a>}
            {isPremium && <span className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-xl text-xs font-semibold">👑 Premium</span>}
            <button onClick={toggleTheme} className={`w-8 h-8 flex items-center justify-center shrink-0 ${dark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'} border rounded-lg text-sm transition`}>{dark ? '🌤' : '🌑'}</button>
            <div className="relative" onClick={e => e.stopPropagation()}>
              <button onClick={() => setShowLang(!showLang)} className={`flex items-center gap-1 px-2 py-1.5 ${dark ? 'bg-white/5 border-white/10 text-white/60 hover:text-white' : 'bg-black/5 border-black/10 text-black/60 hover:text-black'} border rounded-xl text-xs transition`}>
                <span>{currentLang?.flag}</span><span className="hidden sm:block">{currentLang?.label}</span><span>▾</span>
              </button>
              {showLang && (
                <div className={`absolute right-0 top-10 ${dark ? 'bg-[#1a1a2e] border-white/10' : 'bg-white border-black/10'} border rounded-xl overflow-hidden z-10 min-w-36 shadow-xl`}>
                  {LANGUAGES.map(l => (
                    <button key={l.code} onClick={() => changeLang(l.code)} className={`w-full flex items-center gap-3 px-4 py-3 text-left text-xs hover:bg-white/5 transition ${lang === l.code ? 'text-blue-400' : dark ? 'text-white/60' : 'text-black/60'}`}>
                      <span>{l.flag}</span><span>{l.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {userLoaded && user ? (
              <div className="relative" onClick={e => e.stopPropagation()}>
                <button onClick={() => setShowMenu(!showMenu)} className={`flex items-center gap-1.5 px-2.5 py-1.5 ${dark ? 'bg-white/5 border-white/10 text-white/60 hover:text-white' : 'bg-black/5 border-black/10 text-black/60 hover:text-black'} border rounded-xl text-xs transition max-w-[140px]`}>
                  <span>👤</span><span className="truncate">{displayName}</span>
                  {notifCount > 0 && <span className="bg-red-500 text-white text-xs rounded-full px-1 py-0.5 min-w-[16px] text-center leading-none shrink-0">{notifCount > 99 ? '99+' : notifCount}</span>}
                  <span className="shrink-0">▾</span>
                </button>
                {showMenu && (
                  <div className={`absolute right-0 top-10 ${dark ? 'bg-[#1a1a2e] border-white/10' : 'bg-white border-black/10'} border rounded-xl overflow-hidden z-10 min-w-40 shadow-xl`}>
                    <a href="/profile" className={`flex items-center justify-between px-4 py-3 text-xs ${dark ? 'text-white/60 hover:text-white hover:bg-white/5' : 'text-black/60 hover:text-black hover:bg-black/5'} transition`}>
                      <span>👤 {t.profile}</span>
                      {notifCount > 0 && <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{notifCount > 99 ? '99+' : notifCount}</span>}
                    </a>
                    <a href="/favorites" className={`block px-4 py-3 text-xs ${dark ? 'text-white/60 hover:text-white hover:bg-white/5' : 'text-black/60 hover:text-black hover:bg-black/5'} transition`}>❤️ {t.favorites}</a>
                    <a href="/reading-list" className={`block px-4 py-3 text-xs ${dark ? 'text-white/60 hover:text-white hover:bg-white/5' : 'text-black/60 hover:text-black hover:bg-black/5'} transition`}>🔖 {t.readingList}</a>
                    <a href="/collections" className={`block px-4 py-3 text-xs ${dark ? 'text-white/60 hover:text-white hover:bg-white/5' : 'text-black/60 hover:text-black hover:bg-black/5'} transition`}>📚 {t.collections}</a>
                    <a href="/community" className={`block px-4 py-3 text-xs ${dark ? 'text-white/60 hover:text-white hover:bg-white/5' : 'text-black/60 hover:text-black hover:bg-black/5'} transition`}>🌐 {t.community}</a>
                    <a href="/invite" className={`block px-4 py-3 text-xs ${dark ? 'text-white/60 hover:text-white hover:bg-white/5' : 'text-black/60 hover:text-black hover:bg-black/5'} transition`}>🎁 {t.invite}</a>
                    <a href="/premium" className="block px-4 py-3 text-xs text-yellow-400/70 hover:text-yellow-400 hover:bg-white/5 transition">👑 Premium</a>
                    <div className={`border-t ${border}`} />
                    <button onClick={() => { supabase.auth.signOut(); setUser(null); setFavorites({}); setReadingList({}); setNotifCount(0); setShowMenu(false) }} className="w-full text-left px-4 py-3 text-xs text-red-400/60 hover:text-red-400 hover:bg-white/5 transition">{t.logout}</button>
                  </div>
                )}
              </div>
            ) : userLoaded ? (
              <a href="/auth" className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-xs font-semibold text-white hover:opacity-90 transition shadow-lg shadow-blue-500/20">{t.login}</a>
            ) : null}
          </div>
        </div>
      </header>

      {collectionPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4" onClick={() => setCollectionPopup(null)}>
          <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-white font-semibold mb-1 text-sm">Koleksiyon Seç</h3>
            <p className="text-white/40 text-xs mb-4 truncate">{collectionPopup.title_tr || collectionPopup.title_en}</p>
            {collections.length === 0 ? (
              <div className="text-center py-4"><p className="text-white/30 text-sm mb-3">Henüz koleksiyon yok</p><a href="/collections" className="text-blue-400 text-xs">Koleksiyon oluştur →</a></div>
            ) : (
              <div className="flex flex-col gap-2 mb-4">
                {collections.map(col => (
                  <button key={col.id} onClick={() => addToCollection(col.id, collectionPopup)} disabled={addingToCollection} className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white/70 hover:bg-white/10 hover:text-white transition text-left">
                    <span>📚</span><span>{col.name}</span>
                  </button>
                ))}
              </div>
            )}
            <button onClick={() => setCollectionPopup(null)} className="w-full px-4 py-2 text-xs text-white/30 hover:text-white transition">Kapat</button>
          </div>
        </div>
      )}

      {compareList.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 px-3 pb-3">
          <div className="max-w-2xl mx-auto bg-[#1a1a2e] border border-blue-500/30 rounded-2xl p-3 shadow-xl">
            <div className="flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/40 mb-1.5">{t.compareSelect}</p>
                <div className="flex gap-2">
                  {compareList.map((a, i) => (
                    <div key={a.pubmed_id} className="flex items-center gap-1 px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <span className={`text-xs font-bold shrink-0 ${i === 0 ? 'text-blue-300' : 'text-purple-300'}`}>#{i+1}</span>
                      <button onClick={() => toggleCompare(a)} className="text-white/30 hover:text-red-400 transition text-xs shrink-0">✕</button>
                    </div>
                  ))}
                  {compareList.length === 1 && <div className="flex items-center px-2 py-1 bg-white/5 border border-white/10 border-dashed rounded-lg"><span className="text-white/30 text-xs">+1</span></div>}
                </div>
              </div>
              {compareList.length === 2 && <button onClick={goCompare} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-xs font-semibold text-white hover:opacity-90 transition whitespace-nowrap shrink-0">{t.compareBtn}</button>}
            </div>
          </div>
        </div>
      )}

      {sharePopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4" onClick={() => setSharePopup(null)}>
          <div className={`${dark ? 'bg-[#1a1a2e] border-white/10' : 'bg-white border-black/10'} border rounded-2xl p-6 max-w-sm w-full`} onClick={e => e.stopPropagation()}>
            <h3 className={`${text} font-semibold mb-2 text-sm leading-snug`}>{sharePopup.title_tr || sharePopup.title_en}</h3>
            <p className={`${textMuted} text-xs mb-6`}>{sharePopup.journal} · {sharePopup.published_date?.slice(0,4)}</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => copyLink(sharePopup)} className={`flex items-center gap-3 px-4 py-3 ${dark ? 'bg-white/5 border-white/10 text-white/70 hover:text-white' : 'bg-black/5 border-black/10 text-black/70 hover:text-black'} border rounded-xl text-sm transition`}>
                <span>🔗</span><span>{copied ? '✓ Kopyalandı!' : 'Linki Kopyala'}</span>
              </button>
              <button onClick={() => shareWhatsApp(sharePopup)} className="flex items-center gap-3 px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-xl text-sm text-green-400 hover:bg-green-500/20 transition">
                <span>💬</span><span>WhatsApp</span>
              </button>
              <button onClick={() => setSharePopup(null)} className={`px-4 py-3 text-xs ${textMuted} transition`}>Kapat</button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-4 py-12" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        {!searched && (
          <>
            {/* Hero */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-medium mb-6">
                <span>🔬</span><span>35M+ PubMed Makalesi</span>
                <span className="w-1 h-1 bg-blue-400 rounded-full"></span><span>Freemium</span>
              </div>
              <h1 className="text-5xl sm:text-6xl font-bold mb-4 leading-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">{t.hero}</h1>
              <p className={`${textMuted} text-lg max-w-xl mx-auto leading-relaxed mb-8`}>{t.heroSub}</p>
              <div className="flex justify-center gap-8 mb-10">
                {t.stats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className={`text-2xl font-bold ${text}`}>{stat}</div>
                    <div className={`text-xs ${textMuted}`}>{t.statsLabel[i]}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 max-w-2xl mx-auto mb-8">
                {t.features.map((feature, i) => (
                  <div key={i} className={`${cardBg} border ${border} rounded-xl p-3 text-center`}>
                    <div className="text-2xl mb-1">{FEATURE_ICONS[i]}</div>
                    <div className={`text-xs ${textMuted} leading-tight`}>{feature}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => inputRef.current?.focus()} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-sm font-semibold text-white hover:opacity-90 transition shadow-lg shadow-blue-500/25">{t.startSearch}</button>
            </div>
          </>
        )}

        {/* Arama kutusu */}
        <div className="mb-6">
          <div className="relative max-w-2xl mx-auto" onClick={e => e.stopPropagation()}>
            <div className={`relative flex gap-3 ${inputBg} border rounded-2xl p-2`}>
              <input ref={inputRef} type="text" value={query} onChange={handleQueryChange} onKeyDown={e => { if (e.key === 'Enter') handleSearch(); if (e.key === 'Escape') setShowSuggestions(false) }} onFocus={() => { if (query) setShowSuggestions(true) }} placeholder={t.placeholder} className={`flex-1 bg-transparent px-4 py-3 ${text} outline-none text-sm`} />
              <button onClick={() => { if (!isPremium) { setLimitPopup('filters'); return }; setShowFilters(!showFilters) }} className={`px-3 py-2 border rounded-xl text-xs transition ${hasActiveFilters ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' : dark ? 'bg-white/5 border-white/10 text-white/40 hover:text-white' : 'bg-black/5 border-black/10 text-black/40 hover:text-black'}`}>
                {!isPremium ? '👑' : '⚙️'} {hasActiveFilters ? '●' : t.filters}
              </button>
              <button onClick={() => handleSearch()} disabled={loading} className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition disabled:opacity-50 whitespace-nowrap">
                {loading ? t.searching : t.search}
              </button>
            </div>
            {showSuggestions && suggestions.length > 0 && (
              <div className={`absolute top-full left-0 right-0 mt-2 ${dark ? 'bg-[#1a1a2e] border-white/10' : 'bg-white border-black/10'} border rounded-2xl overflow-hidden z-20 shadow-xl`}>
                {recentSearches.filter(s => s.toLowerCase().includes(query.toLowerCase()) && s !== query).slice(0, 3).map((s, i) => (
                  <button key={`r-${i}`} onClick={() => selectSuggestion(s)} className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm ${dark ? 'text-white/70 hover:bg-white/5' : 'text-black/70 hover:bg-black/5'} transition`}>
                    <span className="text-white/30">🕐</span><span>{s}</span>
                  </button>
                ))}
                {suggestions.filter(s => !recentSearches.includes(s)).map((s, i) => (
                  <button key={`s-${i}`} onClick={() => selectSuggestion(s)} className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm ${dark ? 'text-white/70 hover:bg-white/5' : 'text-black/70 hover:bg-black/5'} transition`}>
                    <span className="text-white/30">🔍</span><span>{s}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {showFilters && canUseFilters && (
            <div className={`max-w-2xl mx-auto mt-2 ${dark ? 'bg-[#1a1a2e] border-white/10' : 'bg-white border-black/10'} border rounded-2xl p-4`} onClick={e => e.stopPropagation()}>
              <div className="mb-4">
                <p className={`text-xs font-semibold ${textMuted} mb-2`}>📅 Yayın Tarihi</p>
                <div className="flex flex-wrap gap-2">
                  {PERIOD_OPTIONS.map(opt => (
                    <button key={opt.id} onClick={() => setFilterPeriod(opt.id)} className={`px-3 py-1.5 rounded-xl text-xs transition ${filterPeriod === opt.id ? 'bg-blue-500/30 border border-blue-500/50 text-blue-200' : `${dark ? 'bg-white/5 border-white/10 text-white/50 hover:text-white' : 'bg-black/5 border-black/10 text-black/50'} border`}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <p className={`text-xs font-semibold ${textMuted} mb-2`}>📄 Makale Türü</p>
                <div className="flex flex-wrap gap-2">
                  {TYPE_OPTIONS.map(opt => (
                    <button key={opt.id} onClick={() => setFilterType(opt.id)} className={`px-3 py-1.5 rounded-xl text-xs transition ${filterType === opt.id ? 'bg-purple-500/30 border border-purple-500/50 text-purple-200' : `${dark ? 'bg-white/5 border-white/10 text-white/50 hover:text-white' : 'bg-black/5 border-black/10 text-black/50'} border`}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              {hasActiveFilters && <button onClick={() => { setFilterPeriod('allTime'); setFilterType('') }} className="text-xs text-red-400/60 hover:text-red-400 transition">✕ {t.clearFilters}</button>}
            </div>
          )}
        </div>

        {/* Kategori butonları */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
          {SEARCH_CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => handleCategoryClick(cat)} className={`px-4 py-2 rounded-xl text-lg whitespace-nowrap transition-all ${activeCategory === cat.id ? 'bg-blue-500/20 border border-blue-500/40' : `${dark ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-black/5 border-black/5 hover:bg-black/10'} border`}`}>
              {cat.icon}
            </button>
          ))}
        </div>

        {/* Limit göstergesi */}
        {userLoaded && user && !isPremium && searched && (
          <div className="max-w-2xl mx-auto mb-4 flex items-center justify-between px-1">
            <div className="flex items-center gap-4 text-xs text-white/30">
              <span>🔍 {SEARCH_LIMIT - searchCount} {t.searchesLeft}</span>
              <span>📝 {TRANSLATE_LIMIT - translateCount} {t.translatesLeft}</span>
            </div>
            <a href="/premium" className="text-xs text-yellow-400/60 hover:text-yellow-400 transition">👑 Premium →</a>
          </div>
        )}

        {/* Ana sayfa içerikleri */}
        {!searched && (
          <>
            {/* Günün araştırması */}
            {dailyArticle && (
              <div className="mb-8">
                <p className={`${textMuted} text-sm font-medium mb-3`}>⭐ {t.dailyArticle}</p>
                <a href={`/article/${dailyArticle.pubmed_id}`} className="block bg-gradient-to-r from-blue-500/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-5 hover:border-blue-500/40 transition-all group">
                  <p className="font-semibold text-white leading-snug mb-2 group-hover:text-blue-300 transition">{dailyTitleTr || dailyArticle.title_en}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-white/40 mb-3">
                    {dailyArticle.journal && <span>{dailyArticle.journal}</span>}
                    {dailyArticle.published_date && <span>{dailyArticle.published_date.slice(0,4)}</span>}
                  </div>
                  <span className="text-xs text-blue-400 group-hover:text-blue-300 transition">{t.readMore}</span>
                </a>
              </div>
            )}

            {/* Trending */}
            {trending.length > 0 && (
              <div className="mb-10">
                <p className={`${textMuted} text-sm font-medium mb-4`}>🔥 {t.trending}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {trending.map((item, i) => (
                    <button key={i} onClick={() => handleSearch(item.query || item.topic)} className={`relative overflow-hidden ${cardBg} border ${border} rounded-2xl p-5 text-left hover:border-blue-500/30 transition-all group`}>
                      <div className="absolute top-3 right-3 text-2xl opacity-20 group-hover:opacity-40 transition">{['🧬', '⚛️', '🔬', '🧪', '🧠', '💊'][i % 6]}</div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${i === 0 ? 'bg-yellow-500/20 text-yellow-400' : i === 1 ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>#{i+1}</span>
                        <span className="text-xs text-white/30">Bu hafta</span>
                      </div>
                      <p className={`text-sm ${text} font-semibold leading-snug mb-2 group-hover:text-blue-400 transition`}>{item.topic}</p>
                      <p className="text-xs text-blue-400/60">{item.count}+ yeni makale</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Araştırma alanları explorer */}
            <TopicExplorer dark={dark} t={t} onSearch={(enQuery, label) => { setQuery(enQuery); handleSearch(enQuery, label) }} />

            {/* Popüler aramalar */}
            <div className="mt-4 text-center">
              <p className={`${textMuted} text-sm mb-4`}>{t.popular}</p>
              <div className="flex flex-wrap justify-center gap-2">
                {(POPULAR_SEARCHES[lang] || POPULAR_SEARCHES.tr).map(s => (
                  <button key={s} onClick={() => { setQuery(s); handleSearch(s) }} className={`px-4 py-2 ${dark ? 'bg-white/5 border-white/5 text-white/40 hover:text-white/70' : 'bg-black/5 border-black/5 text-black/40 hover:text-black/70'} border rounded-xl text-sm transition`}>{s}</button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Arama sonuçları */}
        {loading && (
          <div className="grid gap-4">
            {[1,2,3].map(i => (
              <div key={i} className={`${cardBg} border ${border} rounded-2xl p-6 animate-pulse`}>
                <div className={`h-4 ${dark ? 'bg-white/10' : 'bg-black/10'} rounded w-3/4 mb-3`}></div>
                <div className={`h-3 ${dark ? 'bg-white/5' : 'bg-black/5'} rounded w-full`}></div>
              </div>
            ))}
          </div>
        )}

        {!loading && articles.length > 0 && (
          <div className={compareList.length > 0 ? 'pb-28' : ''}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <button onClick={goBack} className={`px-3 py-1.5 ${dark ? 'bg-white/5 border-white/10 text-white/50 hover:text-white' : 'bg-black/5 border-black/10 text-black/50 hover:text-black'} border rounded-xl text-xs transition`}>{t.back}</button>
                <div>
                  {searchLabel && <p className={`text-xs ${textMuted} mb-0.5`}>{searchLabel}</p>}
                  <p className={`${textMuted} text-sm`}>{articles.length} {t.found}</p>
                  {userLoaded && user && !isPremium && <p className="text-xs text-yellow-400/50 mt-0.5">Max 20 · <a href="/premium" className="hover:text-yellow-400 transition">Premium'da 100 →</a></p>}
                </div>
              </div>
              <div className="flex items-center gap-3" onClick={e => e.stopPropagation()}>
                {autoTranslating && <p className="text-blue-400/60 text-xs animate-pulse">{t.translating}</p>}
                <div className="relative">
                  <button onClick={() => setShowSort(!showSort)} className={`flex items-center gap-2 px-4 py-2 ${dark ? 'bg-white/5 border-white/10 text-white/60 hover:text-white' : 'bg-black/5 border-black/10 text-black/60 hover:text-black'} border rounded-xl text-xs transition`}>
                    <span>↕</span><span>{sortBy === 'newest' ? t.newest : t.oldest}</span>
                  </button>
                  {showSort && (
                    <div className={`absolute right-0 top-10 ${dark ? 'bg-[#1a1a2e] border-white/10' : 'bg-white border-black/10'} border rounded-xl overflow-hidden z-10 min-w-36`}>
                      <button onClick={() => handleSortChange('newest')} className={`w-full px-4 py-3 text-left text-xs hover:bg-white/5 transition ${sortBy === 'newest' ? 'text-blue-400' : dark ? 'text-white/60' : 'text-black/60'}`}>{t.newest}</button>
                      <button onClick={() => handleSortChange('oldest')} className={`w-full px-4 py-3 text-left text-xs hover:bg-white/5 transition ${sortBy === 'oldest' ? 'text-blue-400' : dark ? 'text-white/60' : 'text-black/60'}`}>{t.oldest}</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="grid gap-4">
              {articles.map((article, i) => {
                const isInCompare = compareList.find(a => a.pubmed_id === article.pubmed_id)
                return (
                  <article key={article.pubmed_id || i} className={`${cardBg} border ${isInCompare ? 'border-blue-500/40' : border} rounded-2xl p-6 hover:border-blue-500/20 transition-all`}>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <a href={`/article/${article.pubmed_id}`} className={`font-semibold ${text} leading-snug mb-1 hover:text-blue-400 transition block`}>{article.title_tr || article.title_en}</a>
                        {article.title_tr && lang !== 'en' && <p className={`${textMuted} text-sm leading-snug mt-1`}>{article.title_en}</p>}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => toggleFavorite(article)} disabled={favLoading[article.pubmed_id]} className="text-lg hover:scale-110 transition-transform">{favorites[article.pubmed_id] ? '❤️' : '🤍'}</button>
                        <button onClick={() => toggleReadingList(article)} disabled={readLoading[article.pubmed_id]} className="text-lg hover:scale-110 transition-transform">{readingList[article.pubmed_id] ? '🔖' : '📌'}</button>
                        <button onClick={() => shareArticle(article)} className="text-lg hover:scale-110 transition-transform">📤</button>
                        <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded-lg">PUBMED</span>
                      </div>
                    </div>
                    <div className={`flex flex-wrap gap-2 text-xs ${textMuted} mb-1`}>
                      {article.journal && <span>{article.journal}</span>}
                      {article.published_date && <span>{article.published_date.slice(0,4)}</span>}
                      {article.authors && <span>{article.authors}</span>}
                      {article.pub_types?.slice(0,1).map((pt, j) => (
                        <span key={j} className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-lg">{pt}</span>
                      ))}
                    </div>
                    <p className="text-xs text-white/20 mb-4">🔬 {t.sourceLabel}</p>
                    {expandedId === i && (
                      <div className={`mb-4 p-4 ${cardBg} rounded-xl border ${border}`}>
                        <AbstractDisplay text={article.abstract_tr || article.abstract_en} noAbstract={t.noAbstract} dark={dark} />
                      </div>
                    )}
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={() => translateArticle(article, i)} disabled={translating[i]} className="px-4 py-2 bg-blue-500/20 border border-blue-500/20 text-blue-300 rounded-xl text-xs font-medium hover:bg-blue-500/30 transition disabled:opacity-50">
                        {translating[i] ? t.translatingBtn : article.abstract_tr ? (expandedId === i ? t.close : t.read) : t.translateRead}
                      </button>
                      {article.pubmed_id && (
                        <a href={`https://pubmed.ncbi.nlm.nih.gov/${article.pubmed_id}/`} target="_blank" rel="noopener noreferrer" className={`px-4 py-2 ${dark ? 'bg-white/5 border-white/5 text-white/40 hover:text-white/70' : 'bg-black/5 border-black/5 text-black/40 hover:text-black/70'} border rounded-xl text-xs transition`}>
                          🔬 {t.source} →
                        </a>
                      )}
                      {user && (
                        <button onClick={() => setCollectionPopup(article)} className="px-4 py-2 bg-white/5 border border-white/10 text-white/40 hover:text-white/70 rounded-xl text-xs transition">📚</button>
                      )}
                      <button onClick={() => toggleCompare(article)} disabled={!isInCompare && compareList.length >= 2} className={`px-4 py-2 border rounded-xl text-xs transition disabled:opacity-30 ${isInCompare ? 'bg-blue-500/30 border-blue-500/50 text-blue-200' : 'bg-white/5 border-white/10 text-white/40 hover:text-white/70'}`}>
                        {isInCompare ? '✓ Seçildi' : `⚖️ ${t.compare}`}
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        )}

        {!loading && searched && articles.length === 0 && (
          <div className={`text-center py-20 ${textMuted}`}>
            <div className="text-5xl mb-4">🔭</div>
            <p>{t.noResult}</p>
          </div>
        )}
      </main>

      <footer className={`border-t ${border} py-12 mt-20`}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <h3 className={`text-xl font-bold ${text} mb-2`}>{t.emailTitle}</h3>
            <p className={`${textMuted} text-sm mb-5`}>{t.emailSub}</p>
            <EmailForm dark={dark} t={t} />
          </div>
          <div className={`text-center ${textMuted} text-xs border-t ${border} pt-6`}>
            <p className="mb-3">BİLİMCE - PubMed - {t.subtitle}</p>
            <div className="flex justify-center gap-6 flex-wrap">
              <a href="/about" className="hover:text-white transition">Hakkında</a>
              <a href="/privacy" className="hover:text-white transition">Gizlilik Politikası</a>
              <a href="/terms" className="hover:text-white transition">Kullanım Şartları</a>
              <a href="/premium" className="hover:text-white transition">Premium</a>
              <a href="/community" className="hover:text-white transition">Topluluk</a>
            </div>
          </div>
        </div>
      </footer>

      <FeedbackForm dark={dark} t={t} />
    </div>
  )
}
