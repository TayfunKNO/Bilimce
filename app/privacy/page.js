'use client'
import { useEffect, useState } from 'react'

const CONTENT = {
  tr: {
    home: '← Ana Sayfa', title: 'Gizlilik Politikası', updated: 'Son güncelleme: Mart 2026',
    privacy: 'Gizlilik Politikası', terms: 'Kullanım Şartları',
    sections: [
      { title: '1. Giriş', content: 'BİLİMCE ("biz", "uygulama") olarak gizliliğinize saygı duyuyoruz. Bu politika, bilimce.vercel.app adresindeki platformumuzu kullandığınızda hangi verileri topladığımızı ve nasıl kullandığımızı açıklar.' },
      { title: '2. Topladığımız Veriler', items: [
        { bold: 'Hesap bilgileri:', text: 'Kayıt olurken e-posta adresinizi ve kullanıcı adınızı topluyoruz.' },
        { bold: 'Kullanım verileri:', text: 'Arama geçmişiniz, favorilediğiniz makaleler, okuma listeniz ve oluşturduğunuz koleksiyonlar.' },
        { bold: 'Teknik veriler:', text: 'Tarayıcı türü, cihaz bilgisi ve IP adresi gibi standart log verileri.' },
        { bold: 'Geri bildirimler:', text: 'Uygulama içinden gönderdiğiniz geri bildirim metinleri.' },
      ]},
      { title: '3. Verileri Nasıl Kullanıyoruz', bullets: ['Hizmetlerimizi sunmak ve geliştirmek için', 'Kişiselleştirilmiş deneyim sağlamak için', 'Bildirim ve e-posta göndermek için (izin vermeniz halinde)', 'Güvenlik ve dolandırıcılık önleme için'] },
      { title: '4. Üçüncü Taraf Hizmetler', items: [
        { bold: 'PubMed / NIH:', text: 'Bilimsel makale verileri ABD Ulusal Tıp Kütüphanesi\'nin açık API\'sinden alınmaktadır.' },
        { bold: 'Supabase:', text: 'Veritabanı ve kimlik doğrulama hizmeti. GDPR uyumludur.' },
        { bold: 'Google Translate:', text: 'Makale başlık ve özetlerinin çevirisi için kullanılmaktadır.' },
      ]},
      { title: '5. Veri Güvenliği', content: 'Verileriniz Supabase altyapısında şifrelenmiş olarak saklanmaktadır. Row Level Security (RLS) politikaları ile yalnızca siz kendi verilerinize erişebilirsiniz.' },
      { title: '6. Haklarınız', bullets: ['Verilerinize erişim talep edebilirsiniz', 'Hesabınızı ve tüm verilerinizi silebilirsiniz', 'E-posta bildirimlerinden istediğiniz zaman çıkabilirsiniz', 'KVKK kapsamındaki haklarınızı kullanabilirsiniz'] },
      { title: '7. Çerezler', content: 'Oturum yönetimi için zorunlu çerezler kullanılmaktadır. Dil ve tema tercihleriniz tarayıcınızın yerel depolama alanında saklanır.' },
      { title: '8. İletişim', contact: 'Gizlilik ile ilgili sorularınız için:' },
    ],
  },
  en: {
    home: '← Home', title: 'Privacy Policy', updated: 'Last updated: March 2026',
    privacy: 'Privacy Policy', terms: 'Terms of Service',
    sections: [
      { title: '1. Introduction', content: 'BİLİMCE ("we", "app") respects your privacy. This policy explains what data we collect and how we use it when you use our platform at bilimce.vercel.app.' },
      { title: '2. Data We Collect', items: [
        { bold: 'Account information:', text: 'We collect your email address and username when you register.' },
        { bold: 'Usage data:', text: 'Your search history, favorited articles, reading list, and collections you create.' },
        { bold: 'Technical data:', text: 'Standard log data such as browser type, device information, and IP address.' },
        { bold: 'Feedback:', text: 'Feedback text you send from within the app.' },
      ]},
      { title: '3. How We Use Data', bullets: ['To provide and improve our services', 'To provide a personalized experience', 'To send notifications and emails (with your permission)', 'For security and fraud prevention'] },
      { title: '4. Third-Party Services', items: [
        { bold: 'PubMed / NIH:', text: 'Scientific article data is sourced from the open API of the US National Library of Medicine.' },
        { bold: 'Supabase:', text: 'Database and authentication service. GDPR compliant.' },
        { bold: 'Google Translate:', text: 'Used for translating article titles and abstracts.' },
      ]},
      { title: '5. Data Security', content: 'Your data is stored encrypted in Supabase infrastructure. Row Level Security (RLS) policies ensure only you can access your own data.' },
      { title: '6. Your Rights', bullets: ['You can request access to your data', 'You can delete your account and all your data', 'You can unsubscribe from email notifications at any time', 'You can exercise your rights under GDPR'] },
      { title: '7. Cookies', content: 'Essential cookies are used for session management. Language and theme preferences are stored in your browser\'s local storage.' },
      { title: '8. Contact', contact: 'For privacy-related questions:' },
    ],
  },
  nl: {
    home: '← Startpagina', title: 'Privacybeleid', updated: 'Laatste update: maart 2026',
    privacy: 'Privacybeleid', terms: 'Gebruiksvoorwaarden',
    sections: [
      { title: '1. Inleiding', content: 'BİLİMCE ("wij", "app") respecteert uw privacy. Dit beleid legt uit welke gegevens we verzamelen en hoe we ze gebruiken wanneer u ons platform op bilimce.vercel.app gebruikt.' },
      { title: '2. Gegevens die we verzamelen', items: [
        { bold: 'Accountgegevens:', text: 'We verzamelen uw e-mailadres en gebruikersnaam bij registratie.' },
        { bold: 'Gebruiksgegevens:', text: 'Uw zoekgeschiedenis, favoriete artikelen, leeslijst en collecties.' },
        { bold: 'Technische gegevens:', text: 'Standaard loggegevens zoals browsertype, apparaatinformatie en IP-adres.' },
        { bold: 'Feedback:', text: 'Feedbacktekst die u vanuit de app verstuurt.' },
      ]},
      { title: '3. Hoe we gegevens gebruiken', bullets: ['Om onze diensten te leveren en te verbeteren', 'Om een gepersonaliseerde ervaring te bieden', 'Om meldingen en e-mails te sturen (met uw toestemming)', 'Voor beveiliging en fraudepreventie'] },
      { title: '4. Diensten van derden', items: [
        { bold: 'PubMed / NIH:', text: 'Wetenschappelijke artikelgegevens zijn afkomstig van de open API van de Amerikaanse Nationale Bibliotheek voor Geneeskunde.' },
        { bold: 'Supabase:', text: 'Database- en authenticatieservice. GDPR-conform.' },
        { bold: 'Google Translate:', text: 'Gebruikt voor het vertalen van artikeltitels en samenvattingen.' },
      ]},
      { title: '5. Gegevensbeveiliging', content: 'Uw gegevens worden versleuteld opgeslagen in de Supabase-infrastructuur. Row Level Security (RLS)-beleid zorgt ervoor dat alleen u toegang heeft tot uw eigen gegevens.' },
      { title: '6. Uw rechten', bullets: ['U kunt toegang tot uw gegevens aanvragen', 'U kunt uw account en alle gegevens verwijderen', 'U kunt zich op elk moment afmelden voor e-mailmeldingen', 'U kunt uw rechten uitoefenen onder de AVG'] },
      { title: '7. Cookies', content: 'Essentiële cookies worden gebruikt voor sessiebeheer. Taal- en themavoorkeuren worden opgeslagen in de lokale opslag van uw browser.' },
      { title: '8. Contact', contact: 'Voor privacygerelateerde vragen:' },
    ],
  },
  de: {
    home: '← Startseite', title: 'Datenschutzrichtlinie', updated: 'Zuletzt aktualisiert: März 2026',
    privacy: 'Datenschutzrichtlinie', terms: 'Nutzungsbedingungen',
    sections: [
      { title: '1. Einleitung', content: 'BİLİMCE ("wir", "App") respektiert Ihre Privatsphäre. Diese Richtlinie erklärt, welche Daten wir sammeln und wie wir sie verwenden, wenn Sie unsere Plattform auf bilimce.vercel.app nutzen.' },
      { title: '2. Gesammelte Daten', items: [
        { bold: 'Kontoinformationen:', text: 'Wir sammeln Ihre E-Mail-Adresse und Ihren Benutzernamen bei der Registrierung.' },
        { bold: 'Nutzungsdaten:', text: 'Ihr Suchverlauf, bevorzugte Artikel, Leseliste und erstellte Sammlungen.' },
        { bold: 'Technische Daten:', text: 'Standard-Protokolldaten wie Browsertyp, Geräteinformationen und IP-Adresse.' },
        { bold: 'Feedback:', text: 'Feedback-Texte, die Sie aus der App senden.' },
      ]},
      { title: '3. Datenverwendung', bullets: ['Zur Bereitstellung und Verbesserung unserer Dienste', 'Zur Bereitstellung einer personalisierten Erfahrung', 'Zum Senden von Benachrichtigungen und E-Mails (mit Ihrer Erlaubnis)', 'Für Sicherheit und Betrugsprävention'] },
      { title: '4. Drittanbieterdienste', items: [
        { bold: 'PubMed / NIH:', text: 'Wissenschaftliche Artikeldaten stammen aus der offenen API der US National Library of Medicine.' },
        { bold: 'Supabase:', text: 'Datenbank- und Authentifizierungsdienst. DSGVO-konform.' },
        { bold: 'Google Translate:', text: 'Wird für die Übersetzung von Artikeltiteln und Abstracts verwendet.' },
      ]},
      { title: '5. Datensicherheit', content: 'Ihre Daten werden verschlüsselt in der Supabase-Infrastruktur gespeichert. Row Level Security (RLS)-Richtlinien stellen sicher, dass nur Sie auf Ihre eigenen Daten zugreifen können.' },
      { title: '6. Ihre Rechte', bullets: ['Sie können Zugang zu Ihren Daten beantragen', 'Sie können Ihr Konto und alle Daten löschen', 'Sie können sich jederzeit von E-Mail-Benachrichtigungen abmelden', 'Sie können Ihre Rechte unter der DSGVO ausüben'] },
      { title: '7. Cookies', content: 'Notwendige Cookies werden für das Session-Management verwendet. Sprach- und Designeinstellungen werden im lokalen Speicher Ihres Browsers gespeichert.' },
      { title: '8. Kontakt', contact: 'Bei datenschutzbezogenen Fragen:' },
    ],
  },
  fr: {
    home: '← Accueil', title: 'Politique de confidentialité', updated: 'Dernière mise à jour: mars 2026',
    privacy: 'Politique de confidentialité', terms: 'Conditions d\'utilisation',
    sections: [
      { title: '1. Introduction', content: 'BİLİMCE ("nous", "application") respecte votre vie privée. Cette politique explique quelles données nous collectons et comment nous les utilisons lorsque vous utilisez notre plateforme sur bilimce.vercel.app.' },
      { title: '2. Données collectées', items: [
        { bold: 'Informations de compte:', text: 'Nous collectons votre adresse e-mail et votre nom d\'utilisateur lors de l\'inscription.' },
        { bold: 'Données d\'utilisation:', text: 'Votre historique de recherche, articles favoris, liste de lecture et collections créées.' },
        { bold: 'Données techniques:', text: 'Données de journal standard telles que le type de navigateur, les informations sur l\'appareil et l\'adresse IP.' },
        { bold: 'Commentaires:', text: 'Textes de commentaires que vous envoyez depuis l\'application.' },
      ]},
      { title: '3. Utilisation des données', bullets: ['Pour fournir et améliorer nos services', 'Pour offrir une expérience personnalisée', 'Pour envoyer des notifications et des e-mails (avec votre permission)', 'Pour la sécurité et la prévention de la fraude'] },
      { title: '4. Services tiers', items: [
        { bold: 'PubMed / NIH:', text: 'Les données d\'articles scientifiques proviennent de l\'API ouverte de la Bibliothèque nationale américaine de médecine.' },
        { bold: 'Supabase:', text: 'Service de base de données et d\'authentification. Conforme au RGPD.' },
        { bold: 'Google Translate:', text: 'Utilisé pour la traduction des titres et résumés d\'articles.' },
      ]},
      { title: '5. Sécurité des données', content: 'Vos données sont stockées de manière chiffrée dans l\'infrastructure Supabase. Les politiques de sécurité au niveau des lignes (RLS) garantissent que seul vous pouvez accéder à vos données.' },
      { title: '6. Vos droits', bullets: ['Vous pouvez demander l\'accès à vos données', 'Vous pouvez supprimer votre compte et toutes vos données', 'Vous pouvez vous désabonner des notifications e-mail à tout moment', 'Vous pouvez exercer vos droits en vertu du RGPD'] },
      { title: '7. Cookies', content: 'Des cookies essentiels sont utilisés pour la gestion des sessions. Les préférences de langue et de thème sont stockées dans le stockage local de votre navigateur.' },
      { title: '8. Contact', contact: 'Pour les questions relatives à la confidentialité:' },
    ],
  },
  es: {
    home: '← Inicio', title: 'Política de privacidad', updated: 'Última actualización: marzo 2026',
    privacy: 'Política de privacidad', terms: 'Términos de servicio',
    sections: [
      { title: '1. Introducción', content: 'BİLİMCE ("nosotros", "aplicación") respeta su privacidad. Esta política explica qué datos recopilamos y cómo los usamos cuando usa nuestra plataforma en bilimce.vercel.app.' },
      { title: '2. Datos que recopilamos', items: [
        { bold: 'Información de cuenta:', text: 'Recopilamos su dirección de correo electrónico y nombre de usuario al registrarse.' },
        { bold: 'Datos de uso:', text: 'Su historial de búsqueda, artículos favoritos, lista de lectura y colecciones creadas.' },
        { bold: 'Datos técnicos:', text: 'Datos de registro estándar como tipo de navegador, información del dispositivo y dirección IP.' },
        { bold: 'Comentarios:', text: 'Textos de comentarios que envía desde la aplicación.' },
      ]},
      { title: '3. Uso de datos', bullets: ['Para proporcionar y mejorar nuestros servicios', 'Para proporcionar una experiencia personalizada', 'Para enviar notificaciones y correos electrónicos (con su permiso)', 'Para seguridad y prevención de fraudes'] },
      { title: '4. Servicios de terceros', items: [
        { bold: 'PubMed / NIH:', text: 'Los datos de artículos científicos provienen de la API abierta de la Biblioteca Nacional de Medicina de EE.UU.' },
        { bold: 'Supabase:', text: 'Servicio de base de datos y autenticación. Compatible con GDPR.' },
        { bold: 'Google Translate:', text: 'Se usa para traducir títulos y resúmenes de artículos.' },
      ]},
      { title: '5. Seguridad de datos', content: 'Sus datos se almacenan cifrados en la infraestructura de Supabase. Las políticas de Row Level Security (RLS) garantizan que solo usted pueda acceder a sus propios datos.' },
      { title: '6. Sus derechos', bullets: ['Puede solicitar acceso a sus datos', 'Puede eliminar su cuenta y todos sus datos', 'Puede darse de baja de las notificaciones por correo electrónico en cualquier momento', 'Puede ejercer sus derechos bajo el GDPR'] },
      { title: '7. Cookies', content: 'Se utilizan cookies esenciales para la gestión de sesiones. Las preferencias de idioma y tema se almacenan en el almacenamiento local de su navegador.' },
      { title: '8. Contacto', contact: 'Para preguntas relacionadas con la privacidad:' },
    ],
  },
  ar: {
    home: '← الرئيسية', title: 'سياسة الخصوصية', updated: 'آخر تحديث: مارس 2026',
    privacy: 'سياسة الخصوصية', terms: 'شروط الخدمة',
    sections: [
      { title: '1. مقدمة', content: 'تحترم BİLİMCE ("نحن"، "التطبيق") خصوصيتك. توضح هذه السياسة البيانات التي نجمعها وكيفية استخدامها عند استخدام منصتنا على bilimce.vercel.app.' },
      { title: '2. البيانات التي نجمعها', items: [
        { bold: 'معلومات الحساب:', text: 'نجمع عنوان بريدك الإلكتروني واسم المستخدم عند التسجيل.' },
        { bold: 'بيانات الاستخدام:', text: 'سجل البحث، المقالات المفضلة، قائمة القراءة والمجموعات التي تنشئها.' },
        { bold: 'البيانات التقنية:', text: 'بيانات السجل القياسية مثل نوع المتصفح ومعلومات الجهاز وعنوان IP.' },
        { bold: 'التعليقات:', text: 'نصوص التعليقات التي ترسلها من داخل التطبيق.' },
      ]},
      { title: '3. كيف نستخدم البيانات', bullets: ['لتقديم خدماتنا وتحسينها', 'لتوفير تجربة مخصصة', 'لإرسال الإشعارات والبريد الإلكتروني (بإذنك)', 'للأمن ومنع الاحتيال'] },
      { title: '4. خدمات الطرف الثالث', items: [
        { bold: 'PubMed / NIH:', text: 'تأتي بيانات المقالات العلمية من واجهة API المفتوحة للمكتبة الوطنية الأمريكية للطب.' },
        { bold: 'Supabase:', text: 'خدمة قاعدة البيانات والمصادقة. متوافق مع GDPR.' },
        { bold: 'Google Translate:', text: 'يُستخدم لترجمة عناوين وملخصات المقالات.' },
      ]},
      { title: '5. أمان البيانات', content: 'يتم تخزين بياناتك بشكل مشفر في بنية Supabase التحتية. تضمن سياسات Row Level Security (RLS) أنك وحدك من يمكنه الوصول إلى بياناتك.' },
      { title: '6. حقوقك', bullets: ['يمكنك طلب الوصول إلى بياناتك', 'يمكنك حذف حسابك وجميع بياناتك', 'يمكنك إلغاء الاشتراك في إشعارات البريد الإلكتروني في أي وقت', 'يمكنك ممارسة حقوقك بموجب GDPR'] },
      { title: '7. ملفات تعريف الارتباط', content: 'تُستخدم ملفات تعريف الارتباط الأساسية لإدارة الجلسات. يتم تخزين تفضيلات اللغة والسمة في التخزين المحلي لمتصفحك.' },
      { title: '8. التواصل', contact: 'للأسئلة المتعلقة بالخصوصية:' },
    ],
  },
}

export default function PrivacyPage() {
  const [lang, setLang] = useState('tr')
  useEffect(() => { setLang(localStorage.getItem('bilimce_lang') || 'tr') }, [])
  const t = CONTENT[lang] || CONTENT.tr

  return (
    <div className="min-h-screen bg-[#0a0a0f]" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <header className="border-b border-white/5 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="/"><img src="/logo.svg" alt="B" className="w-7 h-7" /></a>
            <span className="font-bold text-base tracking-tight text-white">BİLİMCE</span>
          </div>
          <a href="/" className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white/60 hover:text-white transition">{t.home}</a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-2">{t.title}</h1>
        <p className="text-white/40 text-sm mb-10">{t.updated}</p>
        <div className="flex flex-col gap-8 text-white/70 text-sm leading-relaxed">
          {t.sections.map((section, i) => (
            <section key={i}>
              <h2 className="text-lg font-bold text-white mb-3">{section.title}</h2>
              {section.content && <p>{section.content}</p>}
              {section.items && section.items.map((item, j) => (
                <p key={j} className="mb-2"><strong className="text-white">{item.bold}</strong> {item.text}</p>
              ))}
              {section.bullets && section.bullets.map((b, j) => (
                <p key={j} className="mb-2">• {b}</p>
              ))}
              {section.contact && (
                <p>{section.contact} <a href="mailto:bilimceapp@gmail.com" className="text-blue-400 hover:text-blue-300 transition">bilimceapp@gmail.com</a></p>
              )}
            </section>
          ))}
        </div>
      </main>

      <footer className="border-t border-white/5 py-8 mt-12">
        <div className="max-w-3xl mx-auto px-4 flex gap-6 justify-center text-xs text-white/30">
          <a href="/privacy" className="hover:text-white transition">{t.privacy}</a>
          <a href="/terms" className="hover:text-white transition">{t.terms}</a>
          <a href="/" className="hover:text-white transition">{t.home}</a>
        </div>
      </footer>
    </div>
  )
}
