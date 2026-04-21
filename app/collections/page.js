'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://lypjtxqvusqndqawugxu.supabase.co',
  'sb_publishable_rqtzTjZBNww4u56gNNCI4A_OS_ID1Bo'
)

const UI = {
  tr: {
    loading: 'Yükleniyor...', home: 'Ana Sayfa', title: '📚 Koleksiyonlarım',
    newCollection: '+ Yeni Koleksiyon', newCollectionTitle: 'Yeni Koleksiyon',
    namePlaceholder: 'Koleksiyon adı', descPlaceholder: 'Açıklama (isteğe bağlı)',
    creating: 'Oluşturuluyor...', create: 'Oluştur', cancel: 'İptal',
    empty: 'Henüz koleksiyon yok', emptyDesc: 'Makalelerinizi düzenlemek için koleksiyonlar oluşturun',
    public: '🌐 Herkese Açık', private: '🔒 Gizli', articles: 'makale',
    copyLink: '🔗 Linki Kopyala', copied: '✓ Kopyalandı!',
    back: '← Koleksiyonlar', emptyArticles: 'Bu koleksiyonda makale yok',
    browse: 'Araştırmalara Göz At', readArticle: 'Makaleyi Oku →',
  },
  en: {
    loading: 'Loading...', home: 'Home', title: '📚 My Collections',
    newCollection: '+ New Collection', newCollectionTitle: 'New Collection',
    namePlaceholder: 'Collection name', descPlaceholder: 'Description (optional)',
    creating: 'Creating...', create: 'Create', cancel: 'Cancel',
    empty: 'No collections yet', emptyDesc: 'Create collections to organize your articles',
    public: '🌐 Public', private: '🔒 Private', articles: 'articles',
    copyLink: '🔗 Copy Link', copied: '✓ Copied!',
    back: '← Collections', emptyArticles: 'No articles in this collection',
    browse: 'Browse Research', readArticle: 'Read Article →',
  },
  nl: {
    loading: 'Laden...', home: 'Startpagina', title: '📚 Mijn Collecties',
    newCollection: '+ Nieuwe Collectie', newCollectionTitle: 'Nieuwe Collectie',
    namePlaceholder: 'Collectienaam', descPlaceholder: 'Beschrijving (optioneel)',
    creating: 'Aanmaken...', create: 'Aanmaken', cancel: 'Annuleren',
    empty: 'Nog geen collecties', emptyDesc: 'Maak collecties om uw artikelen te ordenen',
    public: '🌐 Openbaar', private: '🔒 Privé', articles: 'artikelen',
    copyLink: '🔗 Link kopiëren', copied: '✓ Gekopieerd!',
    back: '← Collecties', emptyArticles: 'Geen artikelen in deze collectie',
    browse: 'Onderzoek bekijken', readArticle: 'Artikel lezen →',
  },
  de: {
    loading: 'Laden...', home: 'Startseite', title: '📚 Meine Sammlungen',
    newCollection: '+ Neue Sammlung', newCollectionTitle: 'Neue Sammlung',
    namePlaceholder: 'Sammlungsname', descPlaceholder: 'Beschreibung (optional)',
    creating: 'Erstellen...', create: 'Erstellen', cancel: 'Abbrechen',
    empty: 'Noch keine Sammlungen', emptyDesc: 'Erstellen Sie Sammlungen, um Ihre Artikel zu organisieren',
    public: '🌐 Öffentlich', private: '🔒 Privat', articles: 'Artikel',
    copyLink: '🔗 Link kopieren', copied: '✓ Kopiert!',
    back: '← Sammlungen', emptyArticles: 'Keine Artikel in dieser Sammlung',
    browse: 'Forschung durchsuchen', readArticle: 'Artikel lesen →',
  },
  fr: {
    loading: 'Chargement...', home: 'Accueil', title: '📚 Mes Collections',
    newCollection: '+ Nouvelle Collection', newCollectionTitle: 'Nouvelle Collection',
    namePlaceholder: 'Nom de la collection', descPlaceholder: 'Description (optionnel)',
    creating: 'Création...', create: 'Créer', cancel: 'Annuler',
    empty: 'Pas encore de collections', emptyDesc: 'Créez des collections pour organiser vos articles',
    public: '🌐 Public', private: '🔒 Privé', articles: 'articles',
    copyLink: '🔗 Copier le lien', copied: '✓ Copié!',
    back: '← Collections', emptyArticles: 'Aucun article dans cette collection',
    browse: 'Parcourir les recherches', readArticle: 'Lire l\'article →',
  },
  es: {
    loading: 'Cargando...', home: 'Inicio', title: '📚 Mis Colecciones',
    newCollection: '+ Nueva Colección', newCollectionTitle: 'Nueva Colección',
    namePlaceholder: 'Nombre de la colección', descPlaceholder: 'Descripción (opcional)',
    creating: 'Creando...', create: 'Crear', cancel: 'Cancelar',
    empty: 'Sin colecciones aún', emptyDesc: 'Crea colecciones para organizar tus artículos',
    public: '🌐 Público', private: '🔒 Privado', articles: 'artículos',
    copyLink: '🔗 Copiar enlace', copied: '✓ Copiado!',
    back: '← Colecciones', emptyArticles: 'No hay artículos en esta colección',
    browse: 'Ver investigaciones', readArticle: 'Leer artículo →',
  },
  ar: {
    loading: 'جاري التحميل...', home: 'الرئيسية', title: '📚 مجموعاتي',
    newCollection: '+ مجموعة جديدة', newCollectionTitle: 'مجموعة جديدة',
    namePlaceholder: 'اسم المجموعة', descPlaceholder: 'وصف (اختياري)',
    creating: 'جاري الإنشاء...', create: 'إنشاء', cancel: 'إلغاء',
    empty: 'لا توجد مجموعات بعد', emptyDesc: 'أنشئ مجموعات لتنظيم مقالاتك',
    public: '🌐 عام', private: '🔒 خاص', articles: 'مقالات',
    copyLink: '🔗 نسخ الرابط', copied: '✓ تم النسخ!',
    back: '← المجموعات', emptyArticles: 'لا توجد مقالات في هذه المجموعة',
    browse: 'تصفح الأبحاث', readArticle: 'قراءة المقال →',
  },
}

export default function CollectionsPage() {
  const [user, setUser] = useState(null)
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [creating, setCreating] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [selectedCollection, setSelectedCollection] = useState(null)
  const [collectionArticles, setCollectionArticles] = useState([])
  const [articlesLoading, setArticlesLoading] = useState(false)
  const [copied, setCopied] = useState(null)
  const [lang, setLang] = useState('tr')

  useEffect(() => {
    const savedLang = localStorage.getItem('bilimce_lang') || 'tr'
    setLang(savedLang)
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) { window.location.href = '/auth'; return }
      setUser(data.user)
      loadCollections(data.user.id)
    })
  }, [])

  const t = UI[lang] || UI.tr

  const loadCollections = async (userId) => {
    const { data } = await supabase.from('collections').select('*').eq('user_id', userId).order('created_at', { ascending: false })
    if (data) {
      const withCounts = await Promise.all(data.map(async (col) => {
        const { count } = await supabase.from('collection_articles').select('id', { count: 'exact' }).eq('collection_id', col.id)
        return { ...col, article_count: count || 0 }
      }))
      setCollections(withCounts)
    }
    setLoading(false)
  }

  const createCollection = async () => {
    if (!newName.trim()) return
    setCreating(true)
    const { error } = await supabase.from('collections').insert({ user_id: user.id, name: newName.trim(), description: newDesc.trim() || null })
    if (!error) { setNewName(''); setNewDesc(''); setShowCreate(false); loadCollections(user.id) }
    setCreating(false)
  }

  const deleteCollection = async (id) => {
    await supabase.from('collections').delete().eq('id', id)
    setCollections(prev => prev.filter(c => c.id !== id))
    if (selectedCollection?.id === id) setSelectedCollection(null)
  }

  const togglePublic = async (col) => {
    const newVal = !col.is_public
    await supabase.from('collections').update({ is_public: newVal }).eq('id', col.id)
    setCollections(prev => prev.map(c => c.id === col.id ? { ...c, is_public: newVal } : c))
    if (selectedCollection?.id === col.id) setSelectedCollection(prev => ({ ...prev, is_public: newVal }))
  }

  const copyShareLink = (col) => {
    const link = `${window.location.origin}/collection/${col.id}`
    navigator.clipboard.writeText(link)
    setCopied(col.id)
    setTimeout(() => setCopied(null), 2000)
  }

  const openCollection = async (col) => {
    setSelectedCollection(col)
    setArticlesLoading(true)
    const { data } = await supabase.from('collection_articles').select('*').eq('collection_id', col.id).order('created_at', { ascending: false })
    setCollectionArticles(data || [])
    setArticlesLoading(false)
  }

  const removeArticle = async (pubmedId) => {
    await supabase.from('collection_articles').delete().eq('collection_id', selectedCollection.id).eq('pubmed_id', pubmedId)
    setCollectionArticles(prev => prev.filter(a => a.pubmed_id !== pubmedId))
    setCollections(prev => prev.map(c => c.id === selectedCollection.id ? { ...c, article_count: (c.article_count || 1) - 1 } : c))
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="text-white/30">{t.loading}</div>
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
          <a href="/" className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white/60 hover:text-white transition">{t.home}</a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        {!selectedCollection ? (
          <>
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-white">{t.title}</h1>
              <button onClick={() => setShowCreate(!showCreate)} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-xs font-semibold text-white hover:opacity-90 transition">
                {t.newCollection}
              </button>
            </div>

            {showCreate && (
              <div className="bg-white/3 border border-white/10 rounded-2xl p-6 mb-6">
                <h2 className="text-sm font-semibold text-white/60 mb-4">{t.newCollectionTitle}</h2>
                <input type="text" value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === 'Enter' && createCollection()} placeholder={t.namePlaceholder} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 outline-none text-sm mb-3" />
                <input type="text" value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder={t.descPlaceholder} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 outline-none text-sm mb-4" />
                <div className="flex gap-3">
                  <button onClick={createCollection} disabled={creating || !newName.trim()} className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition disabled:opacity-50">
                    {creating ? t.creating : t.create}
                  </button>
                  <button onClick={() => setShowCreate(false)} className="px-6 py-2.5 bg-white/5 border border-white/10 text-white/50 rounded-xl text-sm hover:text-white transition">{t.cancel}</button>
                </div>
              </div>
            )}

            {collections.length === 0 ? (
              <div className="text-center py-20 text-white/30">
                <div className="text-5xl mb-4">📚</div>
                <p className="mb-2">{t.empty}</p>
                <p className="text-xs">{t.emptyDesc}</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {collections.map(col => (
                  <div key={col.id} className="bg-white/3 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <button onClick={() => openCollection(col)} className="flex-1 text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="font-semibold text-white hover:text-blue-300 transition">{col.name}</h2>
                          {col.is_public && <span className="px-2 py-0.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-xs">{t.public}</span>}
                        </div>
                        {col.description && <p className="text-white/40 text-sm mb-1">{col.description}</p>}
                        <p className="text-xs text-blue-400/60">{col.article_count} {t.articles}</p>
                      </button>
                      <button onClick={() => deleteCollection(col.id)} className="text-white/20 hover:text-red-400 transition text-xs shrink-0">✕</button>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={() => togglePublic(col)} className={`px-3 py-1.5 rounded-xl text-xs transition border ${col.is_public ? 'bg-green-500/20 border-green-500/30 text-green-300 hover:bg-green-500/30' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}>
                        {col.is_public ? t.public : t.private}
                      </button>
                      {col.is_public && (
                        <button onClick={() => copyShareLink(col)} className="px-3 py-1.5 bg-blue-500/20 border border-blue-500/20 text-blue-300 rounded-xl text-xs hover:bg-blue-500/30 transition">
                          {copied === col.id ? t.copied : t.copyLink}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <button onClick={() => setSelectedCollection(null)} className="text-white/40 hover:text-white transition text-sm">{t.back}</button>
              <span className="text-white/20">/</span>
              <h1 className="text-xl font-bold text-white">{selectedCollection.name}</h1>
              {selectedCollection.is_public && <span className="px-2 py-0.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-xs">{t.public}</span>}
            </div>

            <div className="flex gap-2 mb-6 flex-wrap">
              <button onClick={() => togglePublic(selectedCollection)} className={`px-4 py-2 rounded-xl text-xs transition border ${selectedCollection.is_public ? 'bg-green-500/20 border-green-500/30 text-green-300' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}>
                {selectedCollection.is_public ? t.public : t.private}
              </button>
              {selectedCollection.is_public && (
                <button onClick={() => copyShareLink(selectedCollection)} className="px-4 py-2 bg-blue-500/20 border border-blue-500/20 text-blue-300 rounded-xl text-xs hover:bg-blue-500/30 transition">
                  {copied === selectedCollection.id ? t.copied : t.copyLink}
                </button>
              )}
            </div>

            {articlesLoading && (
              <div className="grid gap-4">
                {[1,2,3].map(i => (
                  <div key={i} className="bg-white/3 border border-white/5 rounded-2xl p-6 animate-pulse">
                    <div className="h-4 bg-white/10 rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-white/5 rounded w-full"></div>
                  </div>
                ))}
              </div>
            )}

            {!articlesLoading && collectionArticles.length === 0 && (
              <div className="text-center py-20 text-white/30">
                <div className="text-5xl mb-4">📄</div>
                <p className="mb-4">{t.emptyArticles}</p>
                <a href="/" className="inline-block px-6 py-3 bg-blue-500/20 border border-blue-500/20 text-blue-300 rounded-xl text-sm hover:bg-blue-500/30 transition">{t.browse}</a>
              </div>
            )}

            {!articlesLoading && collectionArticles.length > 0 && (
              <div className="grid gap-4">
                {collectionArticles.map(article => (
                  <div key={article.pubmed_id} className="bg-white/3 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <a href={`/article/${article.pubmed_id}`} className="flex-1 font-semibold text-white leading-snug hover:text-blue-300 transition block">
                        {article.title_tr || article.title_en}
                      </a>
                      <button onClick={() => removeArticle(article.pubmed_id)} className="text-white/25 hover:text-red-400 transition text-xs shrink-0">✕</button>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-white/30 mb-3">
                      {article.journal && <span>{article.journal}</span>}
                      {article.published_date && <span>{article.published_date.slice(0,4)}</span>}
                      {article.authors && <span>{article.authors}</span>}
                    </div>
                    <a href={`/article/${article.pubmed_id}`} className="text-xs text-blue-400 hover:text-blue-300 transition">{t.readArticle}</a>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
