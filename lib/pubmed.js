const decodeHTML = (str) => {
  if (!str) return str
  return str
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
}

const MEDICAL_TERMS = {
  'kanser': 'cancer', 'meme kanseri': 'breast cancer', 'akciğer kanseri': 'lung cancer',
  'kolon kanseri': 'colon cancer', 'prostat kanseri': 'prostate cancer',
  'cilt kanseri': 'skin cancer', 'beyin tümörü': 'brain tumor',
  'lösemi': 'leukemia', 'lenfoma': 'lymphoma', 'melanom': 'melanoma',
  'kanser tedavisi': 'cancer treatment', 'kemoterapi': 'chemotherapy',
  'radyoterapi': 'radiotherapy', 'immünoterapi': 'immunotherapy',
  'kanser tarama': 'cancer screening', 'metastaz': 'metastasis',
  'kalp hastalığı': 'cardiovascular disease', 'kalp yetmezliği': 'heart failure',
  'kalp krizi': 'myocardial infarction', 'koroner': 'coronary artery disease',
  'ateroskleroz': 'atherosclerosis', 'tromboz': 'thrombosis',
  'hipertansiyon': 'hypertension', 'tansiyon': 'hypertension',
  'yüksek tansiyon': 'high blood pressure', 'inme': 'stroke', 'felç': 'stroke',
  'kalp': 'heart disease', 'aritmi': 'arrhythmia', 'atrial fibrilasyon': 'atrial fibrillation',
  'diyabet': 'diabetes mellitus', 'şeker hastalığı': 'diabetes mellitus',
  'tip 1 diyabet': 'type 1 diabetes', 'tip 2 diyabet': 'type 2 diabetes',
  'insülin': 'insulin resistance', 'obezite': 'obesity', 'aşırı kilo': 'overweight',
  'metabolik sendrom': 'metabolic syndrome', 'tiroid': 'thyroid disease',
  'hipotiroid': 'hypothyroidism', 'hipertiroid': 'hyperthyroidism',
  'şeker': 'diabetes', 'kolesterol': 'cholesterol', 'trigliserit': 'triglycerides',
  'alzheimer': 'alzheimer disease', 'alzheimer hastalığı': 'alzheimer disease',
  'parkinson': 'parkinson disease', 'demans': 'dementia', 'bunama': 'dementia',
  'multiple skleroz': 'multiple sclerosis', 'epilepsi': 'epilepsy', 'sara': 'epilepsy',
  'migren': 'migraine', 'baş ağrısı': 'headache', 'beyin': 'brain',
  'sinir sistemi': 'nervous system', 'nöropati': 'neuropathy',
  'als': 'amyotrophic lateral sclerosis', 'motor nöron': 'motor neuron disease',
  'depresyon': 'depression', 'anksiyete': 'anxiety disorder',
  'bipolar': 'bipolar disorder', 'şizofreni': 'schizophrenia',
  'otizm': 'autism spectrum disorder', 'adhd': 'attention deficit hyperactivity disorder',
  'dikkat eksikliği': 'attention deficit disorder', 'uyku bozukluğu': 'sleep disorder',
  'insomnia': 'insomnia', 'uyku': 'sleep', 'stres': 'stress',
  'travma': 'post traumatic stress disorder', 'ptsd': 'post traumatic stress disorder',
  'bağımlılık': 'addiction', 'alkol': 'alcohol use disorder',
  'covid': 'COVID-19', 'covid-19': 'COVID-19', 'koronavirüs': 'coronavirus',
  'grip': 'influenza', 'influenza': 'influenza', 'pnömoni': 'pneumonia',
  'zatürre': 'pneumonia', 'tüberküloz': 'tuberculosis', 'verem': 'tuberculosis',
  'hiv': 'HIV AIDS', 'aids': 'HIV AIDS', 'hepatit': 'hepatitis',
  'antibiyotik': 'antibiotic', 'antibiyotik direnci': 'antibiotic resistance',
  'aşı': 'vaccine', 'bağışıklık': 'immune system', 'enfeksiyon': 'infection',
  'genetik': 'genetics', 'gen': 'gene expression', 'gen tedavisi': 'gene therapy',
  'crispr': 'CRISPR gene editing', 'dna': 'DNA repair', 'rna': 'RNA',
  'genomik': 'genomics', 'epigenetik': 'epigenetics', 'kök hücre': 'stem cell',
  'protein': 'protein folding', 'mikrobiyom': 'microbiome gut bacteria',
  'probiyotik': 'probiotic gut health', 'prebiyotik': 'prebiotic',
  'kreatin': 'creatine supplementation', 'protein tozu': 'protein supplement',
  'kas': 'muscle hypertrophy', 'egzersiz': 'exercise training',
  'spor': 'athletic performance', 'dayanıklılık': 'endurance exercise',
  'omega 3': 'omega-3 fatty acids', 'omega-3': 'omega-3 fatty acids',
  'vitamin d': 'vitamin D deficiency', 'magnezyum': 'magnesium supplementation',
  'demir eksikliği': 'iron deficiency anemia', 'b12': 'vitamin B12 deficiency',
  'aralıklı oruç': 'intermittent fasting', 'ketojenik': 'ketogenic diet',
  'beslenme': 'nutrition', 'diyet': 'diet health',
  'yapay zeka': 'artificial intelligence medicine',
  'makine öğrenmesi': 'machine learning healthcare',
  'derin öğrenme': 'deep learning medical imaging',
  'nanoteknoloji': 'nanotechnology drug delivery',
  'robotik cerrahi': 'robotic surgery', 'telemedicine': 'telemedicine',
  'yaşlanma': 'aging longevity', 'uzun ömür': 'longevity',
  'telomer': 'telomere aging', 'otofaji': 'autophagy',
  'nad': 'NAD+ aging', 'sirtuinler': 'sirtuin longevity',
  'astım': 'asthma', 'alerjik': 'allergic rhinitis', 'alerji': 'allergy',
  'romatizma': 'rheumatoid arthritis', 'gut': 'gout uric acid',
  'osteoporoz': 'osteoporosis bone density', 'fibromiyalji': 'fibromyalgia',
  'karaciğer': 'liver disease', 'böbrek': 'kidney disease',
  'böbrek yetmezliği': 'renal failure', 'karaciğer yetmezliği': 'liver failure',
  'anemi': 'anemia', 'demir': 'iron deficiency', 'akne': 'acne',
  'sedef': 'psoriasis', 'egzama': 'eczema atopic dermatitis',
  'ibs': 'irritable bowel syndrome', 'crohn': 'crohn disease',
  'kolit': 'ulcerative colitis', 'reflü': 'gastroesophageal reflux',
  'miom': 'uterine fibroid', 'endometriozis': 'endometriosis',
  'pcos': 'polycystic ovary syndrome', 'kısırlık': 'infertility',
}

const MESH_TERMS = {
  'kalp krizi': '"Myocardial Infarction"[MeSH]',
  'kalp hastalığı': '"Cardiovascular Diseases"[MeSH]',
  'kalp yetmezliği': '"Heart Failure"[MeSH]',
  'inme': '"Stroke"[MeSH]', 'felç': '"Stroke"[MeSH]',
  'hipertansiyon': '"Hypertension"[MeSH]', 'tansiyon': '"Hypertension"[MeSH]',
  'diyabet': '"Diabetes Mellitus"[MeSH]',
  'tip 2 diyabet': '"Diabetes Mellitus, Type 2"[MeSH]',
  'tip 1 diyabet': '"Diabetes Mellitus, Type 1"[MeSH]',
  'obezite': '"Obesity"[MeSH]',
  'kanser': '"Neoplasms"[MeSH]',
  'meme kanseri': '"Breast Neoplasms"[MeSH]',
  'akciğer kanseri': '"Lung Neoplasms"[MeSH]',
  'kolon kanseri': '"Colonic Neoplasms"[MeSH]',
  'prostat kanseri': '"Prostatic Neoplasms"[MeSH]',
  'lösemi': '"Leukemia"[MeSH]', 'lenfoma': '"Lymphoma"[MeSH]',
  'alzheimer': '"Alzheimer Disease"[MeSH]',
  'parkinson': '"Parkinson Disease"[MeSH]',
  'demans': '"Dementia"[MeSH]',
  'multiple skleroz': '"Multiple Sclerosis"[MeSH]',
  'epilepsi': '"Epilepsy"[MeSH]',
  'migren': '"Migraine Disorders"[MeSH]',
  'depresyon': '"Depression"[MeSH]',
  'anksiyete': '"Anxiety Disorders"[MeSH]',
  'bipolar': '"Bipolar Disorder"[MeSH]',
  'şizofreni': '"Schizophrenia"[MeSH]',
  'otizm': '"Autism Spectrum Disorder"[MeSH]',
  'adhd': '"Attention Deficit Disorder with Hyperactivity"[MeSH]',
  'uyku bozukluğu': '"Sleep Wake Disorders"[MeSH]',
  'covid': '"COVID-19"[MeSH]', 'covid-19': '"COVID-19"[MeSH]',
  'grip': '"Influenza, Human"[MeSH]',
  'pnömoni': '"Pneumonia"[MeSH]',
  'tüberküloz': '"Tuberculosis"[MeSH]',
  'hiv': '"HIV Infections"[MeSH]',
  'hepatit': '"Hepatitis"[MeSH]',
  'antibiyotik direnci': '"Drug Resistance, Bacterial"[MeSH]',
  'aşı': '"Vaccines"[MeSH]',
  'omega 3': '"Fatty Acids, Omega-3"[MeSH]',
  'omega-3': '"Fatty Acids, Omega-3"[MeSH]',
  'kreatin': '"Creatine"[MeSH]',
  'probiyotik': '"Probiotics"[MeSH]',
  'mikrobiyom': '"Microbiota"[MeSH]',
  'kök hücre': '"Stem Cells"[MeSH]',
  'crispr': '"CRISPR-Cas Systems"[MeSH]',
  'gen tedavisi': '"Genetic Therapy"[MeSH]',
  'kemoterapi': '"Drug Therapy"[MeSH]',
  'immünoterapi': '"Immunotherapy"[MeSH]',
  'romatizma': '"Arthritis, Rheumatoid"[MeSH]',
  'osteoporoz': '"Osteoporosis"[MeSH]',
  'astım': '"Asthma"[MeSH]',
  'alerji': '"Hypersensitivity"[MeSH]',
  'böbrek yetmezliği': '"Renal Insufficiency"[MeSH]',
  'karaciğer yetmezliği': '"Liver Failure"[MeSH]',
  'anemi': '"Anemia"[MeSH]',
  'demir eksikliği': '"Anemia, Iron-Deficiency"[MeSH]',
  'vitamin d': '"Vitamin D Deficiency"[MeSH]',
  'aralıklı oruç': '"Intermittent Fasting"[MeSH]',
  'yapay zeka': '"Artificial Intelligence"[MeSH]',
  'makine öğrenmesi': '"Machine Learning"[MeSH]',
  'yaşlanma': '"Aging"[MeSH]',
  'telomer': '"Telomere"[MeSH]',
  'otofaji': '"Autophagy"[MeSH]',
}

const buildPubMedQuery = async (query, filters = {}) => {
  try {
    const queryLower = query.toLowerCase().trim()

    // 1. MeSH terimi var mı? En nokta atışı yöntem
    if (MESH_TERMS[queryLower]) {
      const meshQuery = MESH_TERMS[queryLower]
      const translated = MEDICAL_TERMS[queryLower] || queryLower
      const words = translated.split(/\s+/).filter(w => w.length > 2)
      if (filters.articleType) {
        const typeMap = {
          'clinical-trial': 'Clinical Trial[pt]',
          'review': 'Review[pt]',
          'meta-analysis': 'Meta-Analysis[pt]',
          'randomized': 'Randomized Controlled Trial[pt]',
          'systematic-review': 'Systematic Review[pt]',
          'case-report': 'Case Reports[pt]',
        }
        if (typeMap[filters.articleType]) {
          return { query: `${meshQuery} AND ${typeMap[filters.articleType]}`, originalWords: words, minDate: filters.minDate, maxDate: filters.maxDate }
        }
      }
      return { query: meshQuery, originalWords: words, minDate: filters.minDate, maxDate: filters.maxDate }
    }

    // 2. Uzun sorgu (3+ kelime) → AI ile optimize et
    if (query.split(' ').length > 3) {
      try {
        const res = await fetch('/api/search-query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query })
        })
        const data = await res.json()
        if (data.terms && data.terms !== query) {
          const words = data.terms.split(/\s+/).filter(w => w.length > 2)
          // AI sonucunu da MeSH ile zenginleştir
          const mainQuery = words.map(w => `${w}[Title]`).join(' AND ')
          return { query: mainQuery, originalWords: words, minDate: filters.minDate, maxDate: filters.maxDate }
        }
      } catch {}
    }

    // 3. Kısa sorgu → Tıbbi terim sözlüğü
    let translated = null
    if (MEDICAL_TERMS[queryLower]) {
      translated = MEDICAL_TERMS[queryLower]
    }

    // 4. Kısmi eşleşme - en uzun eşleşmeyi bul
    if (!translated) {
      let longestMatch = ''
      let result = queryLower
      for (const [tr, en] of Object.entries(MEDICAL_TERMS)) {
        if (queryLower.includes(tr) && tr.length > longestMatch.length) {
          longestMatch = tr
          result = queryLower.replace(tr, en)
        }
      }
      if (longestMatch) translated = result
    }

    // 5. Google Translate ile çevir
    if (!translated) {
      try {
        const encoded = encodeURIComponent(query.slice(0, 490))
        const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encoded}`)
        const data = await res.json()
        translated = data[0]?.map(t => t[0]).filter(Boolean).join('') || query
      } catch {
        translated = query
      }
    }

    const stopWords = new Set([
      'the', 'for', 'of', 'in', 'on', 'a', 'an', 'to', 'is', 'are',
      'was', 'were', 'and', 'or', 'this', 'that', 'with', 'from', 'by',
      'at', 'will', 'would', 'could', 'should', 'may', 'about', 'what',
      'which', 'how', 'when', 'where', 'who', 'research', 'studies', 'study'
    ])

    const words = translated.split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w.toLowerCase()))

    let mainQuery
    if (words.length === 0) {
      mainQuery = `${translated}[Title]`
    } else if (words.length === 1) {
      mainQuery = `${words[0]}[Title]`
    } else if (words.length === 2) {
      mainQuery = `${words[0]}[Title] AND ${words[1]}[Title]`
    } else {
      mainQuery = words.slice(0, 3).map(w => `${w}[Title]`).join(' AND ')
    }

    if (filters.articleType) {
      const typeMap = {
        'clinical-trial': 'Clinical Trial[pt]',
        'review': 'Review[pt]',
        'meta-analysis': 'Meta-Analysis[pt]',
        'randomized': 'Randomized Controlled Trial[pt]',
        'systematic-review': 'Systematic Review[pt]',
        'case-report': 'Case Reports[pt]',
      }
      if (typeMap[filters.articleType]) mainQuery += ` AND ${typeMap[filters.articleType]}`
    }

    return {
      query: mainQuery,
      originalWords: words.length > 0 ? words : [translated],
      minDate: filters.minDate,
      maxDate: filters.maxDate
    }
  } catch {
    return { query, minDate: filters.minDate, maxDate: filters.maxDate }
  }
}

const parseArticles = (xml) => {
  const articles = []
  const matches = xml.match(/<PubmedArticle>[\s\S]*?<\/PubmedArticle>/g) || []
  for (const article of matches) {
    const pubmedId = article.match(/<PMID[^>]*>(\d+)<\/PMID>/)?.[1]
    const titleRaw = article.match(/<ArticleTitle[^>]*>([\s\S]*?)<\/ArticleTitle>/)?.[1]?.replace(/<[^>]+>/g, '') || ''
    const title = decodeHTML(titleRaw)
    const abstractSection = article.match(/<Abstract>([\s\S]*?)<\/Abstract>/)?.[1] || ''
    const abstractParts = []
    const abstractTextMatches = abstractSection.match(/<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/g) || []
    for (const part of abstractTextMatches) {
      const label = part.match(/Label="([^"]+)"/)?.[1]
      const text = decodeHTML(part.replace(/<[^>]+>/g, '').trim())
      if (text) abstractParts.push(label ? `${label}: ${text}` : text)
    }
    const journalRaw = article.match(/<Title>([\s\S]*?)<\/Title>/)?.[1] || ''
    const journal = decodeHTML(journalRaw)
    const year = article.match(/<PubDate>[\s\S]*?<Year>(\d+)<\/Year>/)?.[1] || ''
    const lastNames = article.match(/<LastName>([\s\S]*?)<\/LastName>/g)?.slice(0, 3).map(n => decodeHTML(n.replace(/<[^>]+>/g, ''))) || []
    const pubTypes = article.match(/<PublicationType[^>]*>([\s\S]*?)<\/PublicationType>/g)?.map(n => n.replace(/<[^>]+>/g, '')) || []
    if (pubmedId && title) {
      articles.push({
        pubmed_id: pubmedId, title_en: title,
        abstract_en: abstractParts.join('\n\n'),
        journal, published_date: year,
        authors: lastNames.join(', '),
        pub_types: pubTypes, source: 'pubmed',
      })
    }
  }
  return articles
}

const scoreArticle = (article, keywords = []) => {
  let score = 0
  const title = article.title_en?.toLowerCase() || ''
  const abstract = article.abstract_en?.toLowerCase() || ''

  for (const kw of keywords) {
    const kl = kw.toLowerCase()
    if (title.startsWith(kl)) score += 25
    else if (title.includes(kl)) score += 15
    if (abstract.includes(kl)) score += 5
  }

  const pubTypes = article.pub_types || []
  if (pubTypes.some(t => t.includes('Meta-Analysis'))) score += 10
  if (pubTypes.some(t => t.includes('Systematic Review'))) score += 9
  if (pubTypes.some(t => t.includes('Randomized Controlled'))) score += 8
  if (pubTypes.some(t => t.includes('Clinical Trial'))) score += 6
  if (pubTypes.some(t => t.includes('Review'))) score += 4

  const year = parseInt(article.published_date) || 0
  const currentYear = new Date().getFullYear()
  if (year >= currentYear) score += 6
  else if (year >= currentYear - 2) score += 4
  else if (year >= currentYear - 5) score += 2

  if (article.abstract_en && article.abstract_en.length > 300) score += 3

  return score
}

export async function searchPubMed(query, limit = 20, filters = {}) {
  try {
    const { query: pubmedQuery, originalWords, minDate, maxDate } = await buildPubMedQuery(query, filters)

    let searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(pubmedQuery)}&retmax=${limit}&retmode=json&sort=relevance`
    if (minDate) searchUrl += `&mindate=${minDate}&datetype=pdat`
    if (maxDate) searchUrl += `&maxdate=${maxDate}&datetype=pdat`

    const searchRes = await fetch(searchUrl)
    const searchData = await searchRes.json()
    let ids = searchData.esearchresult?.idlist || []
    const totalCount = parseInt(searchData.esearchresult?.count || 0)

    // Sonuç azsa Title/Abstract ile genişlet
    if (ids.length < 5 && originalWords?.length >= 1) {
      const fallbackQuery = originalWords.slice(0, 2).map(w => `${w}[Title/Abstract]`).join(' AND ')
      let fallbackUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(fallbackQuery)}&retmax=${limit}&retmode=json&sort=relevance`
      if (minDate) fallbackUrl += `&mindate=${minDate}&datetype=pdat`
      if (maxDate) fallbackUrl += `&maxdate=${maxDate}&datetype=pdat`
      const fallbackRes = await fetch(fallbackUrl)
      const fallbackData = await fallbackRes.json()
      const fallbackIds = fallbackData.esearchresult?.idlist || []
      if (fallbackIds.length > ids.length) ids = fallbackIds
    }

    if (ids.length === 0) return []

    const fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${ids.join(',')}&retmode=xml`
    const fetchRes = await fetch(fetchUrl)
    const xml = await fetchRes.text()

    const articles = parseArticles(xml)
    articles.forEach(a => { a._score = scoreArticle(a, originalWords || []) })
    articles.sort((a, b) => b._score - a._score)
    articles.forEach(a => { a._totalCount = totalCount })

    return articles
  } catch (err) {
    console.error('PubMed error:', err)
    return []
  }
}

export async function searchPubMedPage(query, page = 1, filters = {}) {
  try {
    const { query: pubmedQuery, originalWords, minDate, maxDate } = await buildPubMedQuery(query, filters)
    const retstart = (page - 1) * 20

    let searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(pubmedQuery)}&retmax=20&retstart=${retstart}&retmode=json&sort=relevance`
    if (minDate) searchUrl += `&mindate=${minDate}&datetype=pdat`
    if (maxDate) searchUrl += `&maxdate=${maxDate}&datetype=pdat`

    const searchRes = await fetch(searchUrl)
    const searchData = await searchRes.json()
    const ids = searchData.esearchresult?.idlist || []
    const totalCount = parseInt(searchData.esearchresult?.count || 0)

    if (ids.length === 0) return { articles: [], totalCount, hasMore: false }

    const fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${ids.join(',')}&retmode=xml`
    const fetchRes = await fetch(fetchUrl)
    const xml = await fetchRes.text()

    const articles = parseArticles(xml)
    articles.forEach(a => { a._score = scoreArticle(a, originalWords || []) })

    return { articles, totalCount, hasMore: retstart + 20 < totalCount }
  } catch (err) {
    console.error('PubMed page error:', err)
    return { articles: [], totalCount: 0, hasMore: false }
  }
}
