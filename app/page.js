'use client'
import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { searchPubMed } from '../lib/pubmed'

const CATEGORIES = [
  { id: 'all', label: 'Tümü', icon: '🔬' },
  { id: 'medicine', label: 'Tıp', icon: '🩺' },
  { id: 'biology', label: 'Biyoloji', icon: '🧬' },
  { id: 'physics', label: 'Fizik', icon: '⚛️' },
  { id: 'chemistry', label: 'Kimya', icon: '🧪' },
  { id: 'psychology', label: 'Psikoloji', icon: '🧠' },
  { id: 'environment', label: 'Çevre', icon: '🌍' },
  { id: 'technology', label: 'Teknoloji', icon: '💻' },
]

const CATEGORY_QUERIES = {
  medicine: 'clinical trial treatment',
  biology: 'molecular biology genetics',
  physics: 'quantum physics',
  chemistry: 'organic chemistry synthesis',
  psychology: 'cognitive psychology behavior',
  environment: 'climate change environment',
  technology: 'artificial intelligence machine learning',
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [translating, setTranslating] = useState({})
  const [activeCategory, setActiveCategory] = useState('all')
  const [searched, setSearched] = useState(false)
  const [expandedId, setExpandedId] = useState(null)

  const handleSearch = useCallback(async (searchQuery) => {
    const q = searchQuery || query
    if (!q.trim()) return
    setLoading(true)
    setSearched(true)
    setArticles([])
    try {
      const { data: cached } = await supabase
        .from('articles')
        .select('*')
        .or(`title_en.ilike.%${q}%,keywords.cs.{${q}}`)
        .limit(10)
      if (cached && cached.length > 0) {
        setArticles(cached)
        setLoading(false)
        return
      }
      const results = await searchPubMed(q, 10)
      setArticles(results)
      if (results.length > 0) {
        for (const article of results) {
          if (article.pubmed_id) {
            await supabase.from('articles').upsert(article, {
              onConflict: 'pubmed_id',
              ignoreDuplicates: true,
            })
          }
        }
      }
      await supabase.from('search_logs').insert({
        query: q,
        result_count: results.length,
      })
    } catch (err) {
      console.error('Arama hatası:', err)
    } finally {
      setLoading(false)
    }
  }, [query])

  const handleCategoryClick = async (cat) => {
    setActiveCategory(cat.id)
    if (cat.id === 'all') {
      setQuery('')
      setArticles([])
      setSearched(false)
      return
    }
    const q = CATEGORY_QUERIES[cat.id] || cat.label
    setQuery(q)
    await handleSearch(q)
  }

  const translateArticle = async (article, index) => {
    if (article.title_tr) {
      setExpandedId(expandedId === index ? null : index)
      return
    }
    setTranslating(prev => ({ ...prev, [index]: true }))
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: article.title_en,
          abstract: article.abstract_en,
        }),
      })
      const data = await res.json()
      const updated = [...articles]
      updated[index] = {
        ...updated[index],
        title_tr: data.title_tr,
        abstract_tr: data.abstract_tr,
      }
      setArticles(updated)
      setExpandedId(index)
      if (article.pubmed_id) {
        await supabase.from('articles')
          .update({ title_tr: data.title_tr, abstract_tr: data.abstract_tr })
          .eq('pubmed_id', article.pubmed_id)
      }
    } catch (err) {
      console.error('Çeviri hatası:', err)
    } finally {
      setTranslating(prev => ({ ...prev, [index]: false }))
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-white/5 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold">B</div>
            <span className="font-bold text-lg tracking-tight">BİLİMCE</span>
          </div>
          <span className="text-xs text-white/30 hidden sm:block">Bilimsel araştırmalar · Türkçe</span>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-12">
        {!searched && (
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-sm text-blue-400 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse-slow"></span>
              Milyonlarca makaleye erişin
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold mb-4 leading-tight">
              Bilimi{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Türkçe</span>{' '}
              keşfet
            </h1>
            <p className="text-white/40 text-lg max-w-xl mx-auto leading-relaxed">
              Dünya genelindeki bilimsel araştırmaları arayın, yapay zeka ile Türkçe özetlerini okuyun.
            </p>
          </div>
        )}
        <div className={`${searched​​​​​​​​​​​​​​​​
