'use client'
import { useEffect, useState } from 'react'

const CONTENT = {
  tr: {
    home: '← Ana Sayfa', title: 'Kullanım Şartları', updated: 'Son güncelleme: Mart 2026',
    privacy: 'Gizlilik Politikası', terms: 'Kullanım Şartları',
    sections: [
      { title: '1. Kabul', content: 'BİLİMCE\'yi kullanarak bu kullanım şartlarını kabul etmiş olursunuz. Şartları kabul etmiyorsanız platformu kullanmayınız.' },
      { title: '2. Hizmet Tanımı', content: 'BİLİMCE, PubMed veritabanındaki bilimsel makaleleri Türkçe ve diğer dillerde erişilebilir kılan ücretsiz bir platformdur. Makale içerikleri NIH Ulusal Tıp Kütüphanesi\'ne aittir.' },
      { title: '3. Hesap Sorumlulukları', bullets: ['Hesap bilgilerinizin güvenliğinden siz sorumlusunuz', 'Gerçek ve doğru bilgiler sağlamakla yükümlüsünüz', 'Hesabınızın yetkisiz kullanımını derhal bildirmeniz gerekmektedir'] },
      { title: '4. Kabul Edilemez Kullanım', intro: 'Aşağıdaki kullanımlar yasaktır:', bullets: ['Platformu otomatik araçlarla aşırı yüklemek', 'Diğer kullanıcıların verilerine yetkisiz erişim sağlamak', 'Yanıltıcı veya zararlı içerik paylaşmak', 'Telif hakkı ihlali oluşturacak şekilde içerik kopyalamak'] },
      { title: '5. Tıbbi Sorumluluk Reddi', warning: 'BİLİMCE tıbbi tavsiye vermez. Platform üzerindeki bilimsel makaleler yalnızca bilgi amaçlıdır. Sağlık kararlarınız için mutlaka bir doktora danışınız.' },
      { title: '6. Ücretsiz Model', content: 'BİLİMCE ücretsiz kullanılabilir. İleride eklenen premium özellikler için fiyatlandırma ayrıca duyurulacaktır.' },
      { title: '7. Fikri Mülkiyet', content: 'BİLİMCE\'nin tasarımı, kodu ve özgün içeriği telif hakkı ile korunmaktadır. Makale içerikleri NIH/PubMed\'e aittir ve açık erişim politikaları kapsamında sunulmaktadır.' },
      { title: '8. Hizmet Değişiklikleri', content: 'BİLİMCE, hizmetleri önceden bildirimde bulunmaksızın değiştirme, askıya alma veya sonlandırma hakkını saklı tutar.' },
      { title: '9. Uygulanacak Hukuk', content: 'Bu şartlar Türkiye Cumhuriyeti yasalarına tabidir.' },
      { title: '10. İletişim', contact: 'Sorularınız için:' },
    ],
  },
  en: {
    home: '← Home', title: 'Terms of Service', updated: 'Last updated: March 2026',
    privacy: 'Privacy Policy', terms: 'Terms of Service',
    sections: [
      { title: '1. Acceptance', content: 'By using BİLİMCE, you agree to these terms of service. If you do not agree, please do not use the platform.' },
      { title: '2. Service Description', content: 'BİLİMCE is a free platform that makes scientific articles from the PubMed database accessible in Turkish and other languages. Article content belongs to the NIH National Library of Medicine.' },
      { title: '3. Account Responsibilities', bullets: ['You are responsible for the security of your account information', 'You are required to provide true and accurate information', 'You must immediately report any unauthorized use of your account'] },
      { title: '4. Prohibited Use', intro: 'The following uses are prohibited:', bullets: ['Overloading the platform with automated tools', 'Unauthorized access to other users\' data', 'Sharing misleading or harmful content', 'Copying content in a way that infringes copyright'] },
      { title: '5. Medical Disclaimer', warning: 'BİLİMCE does not provide medical advice. Scientific articles on the platform are for informational purposes only. Always consult a doctor for health decisions.' },
      { title: '6. Free Model', content: 'BİLİMCE is free to use. Pricing for premium features added in the future will be announced separately.' },
      { title: '7. Intellectual Property', content: 'The design, code, and original content of BİLİMCE are protected by copyright. Article content belongs to NIH/PubMed and is provided under open access policies.' },
      { title: '8. Service Changes', content: 'BİLİMCE reserves the right to modify, suspend, or terminate services without prior notice.' },
      { title: '9. Governing Law', content: 'These terms are subject to the laws of the Republic of Turkey.' },
      { title: '10. Contact', contact: 'For questions:' },
    ],
  },
  nl: {
    home: '← Startpagina', title: 'Gebruiksvoorwaarden', updated: 'Laatste update: maart 2026',
    privacy: 'Privacybeleid', terms: 'Gebruiksvoorwaarden',
    sections: [
      { title: '1. Acceptatie', content: 'Door BİLİMCE te gebruiken, gaat u akkoord met deze gebruiksvoorwaarden. Als u niet akkoord gaat, gebruik het platform dan niet.' },
      { title: '2. Servicebeschrijving', content: 'BİLİMCE is een gratis platform dat wetenschappelijke artikelen uit de PubMed-database toegankelijk maakt in het Nederlands en andere talen. Artikelinhoud behoort toe aan de NIH National Library of Medicine.' },
      { title: '3. Accountverantwoordelijkheden', bullets: ['U bent verantwoordelijk voor de beveiliging van uw accountgegevens', 'U bent verplicht juiste en accurate informatie te verstrekken', 'U moet ongeautoriseerd gebruik van uw account onmiddellijk melden'] },
      { title: '4. Verboden gebruik', intro: 'Het volgende gebruik is verboden:', bullets: ['Het platform overbelasten met geautomatiseerde tools', 'Ongeautoriseerde toegang tot gegevens van andere gebruikers', 'Misleidende of schadelijke inhoud delen', 'Inhoud kopiëren op een manier die auteursrechten schendt'] },
      { title: '5. Medische disclaimer', warning: 'BİLİMCE geeft geen medisch advies. Wetenschappelijke artikelen op het platform zijn uitsluitend bedoeld voor informatieve doeleinden. Raadpleeg altijd een arts voor gezondheidsbeslissingen.' },
      { title: '6. Gratis model', content: 'BİLİMCE is gratis te gebruiken. Prijzen voor premium functies die in de toekomst worden toegevoegd, worden apart aangekondigd.' },
      { title: '7. Intellectueel eigendom', content: 'Het ontwerp, de code en de originele inhoud van BİLİMCE zijn beschermd door auteursrecht. Artikelinhoud behoort toe aan NIH/PubMed en wordt aangeboden onder open access beleid.' },
      { title: '8. Servicewijzigingen', content: 'BİLİMCE behoudt zich het recht voor om services te wijzigen, op te schorten of te beëindigen zonder voorafgaande kennisgeving.' },
      { title: '9. Toepasselijk recht', content: 'Deze voorwaarden zijn onderworpen aan de wetten van de Republiek Turkije.' },
      { title: '10. Contact', contact: 'Voor vragen:' },
    ],
  },
  de: {
    home: '← Startseite', title: 'Nutzungsbedingungen', updated: 'Zuletzt aktualisiert: März 2026',
    privacy: 'Datenschutzrichtlinie', terms: 'Nutzungsbedingungen',
    sections: [
      { title: '1. Annahme', content: 'Durch die Nutzung von BİLİMCE stimmen Sie diesen Nutzungsbedingungen zu. Wenn Sie nicht zustimmen, nutzen Sie die Plattform bitte nicht.' },
      { title: '2. Servicebeschreibung', content: 'BİLİMCE ist eine kostenlose Plattform, die wissenschaftliche Artikel aus der PubMed-Datenbank auf Türkisch und anderen Sprachen zugänglich macht. Artikelinhalte gehören der NIH National Library of Medicine.' },
      { title: '3. Kontoverantwortlichkeiten', bullets: ['Sie sind für die Sicherheit Ihrer Kontoinformationen verantwortlich', 'Sie sind verpflichtet, echte und korrekte Informationen bereitzustellen', 'Sie müssen eine unbefugte Nutzung Ihres Kontos sofort melden'] },
      { title: '4. Verbotene Nutzung', intro: 'Folgende Nutzungen sind verboten:', bullets: ['Die Plattform mit automatisierten Tools zu überlasten', 'Unbefugter Zugriff auf Daten anderer Benutzer', 'Irreführende oder schädliche Inhalte teilen', 'Inhalte auf eine Weise zu kopieren, die das Urheberrecht verletzt'] },
      { title: '5. Medizinischer Haftungsausschluss', warning: 'BİLİMCE gibt keine medizinischen Ratschläge. Wissenschaftliche Artikel auf der Plattform dienen nur zu Informationszwecken. Konsultieren Sie immer einen Arzt für Gesundheitsentscheidungen.' },
      { title: '6. Kostenloses Modell', content: 'BİLİMCE ist kostenlos nutzbar. Die Preisgestaltung für in Zukunft hinzugefügte Premium-Funktionen wird separat bekannt gegeben.' },
      { title: '7. Geistiges Eigentum', content: 'Das Design, der Code und die originalen Inhalte von BİLİMCE sind urheberrechtlich geschützt. Artikelinhalte gehören NIH/PubMed und werden unter Open-Access-Richtlinien bereitgestellt.' },
      { title: '8. Serviceänderungen', content: 'BİLİMCE behält sich das Recht vor, Dienste ohne vorherige Ankündigung zu ändern, auszusetzen oder einzustellen.' },
      { title: '9. Anwendbares Recht', content: 'Diese Bedingungen unterliegen den Gesetzen der Republik Türkei.' },
      { title: '10. Kontakt', contact: 'Für Fragen:' },
    ],
  },
  fr: {
    home: '← Accueil', title: 'Conditions d\'utilisation', updated: 'Dernière mise à jour: mars 2026',
    privacy: 'Politique de confidentialité', terms: 'Conditions d\'utilisation',
    sections: [
      { title: '1. Acceptation', content: 'En utilisant BİLİMCE, vous acceptez ces conditions d\'utilisation. Si vous n\'acceptez pas, veuillez ne pas utiliser la plateforme.' },
      { title: '2. Description du service', content: 'BİLİMCE est une plateforme gratuite qui rend les articles scientifiques de la base de données PubMed accessibles en français et dans d\'autres langues. Le contenu des articles appartient à la Bibliothèque nationale américaine de médecine (NIH).' },
      { title: '3. Responsabilités du compte', bullets: ['Vous êtes responsable de la sécurité de vos informations de compte', 'Vous êtes tenu de fournir des informations vraies et exactes', 'Vous devez signaler immédiatement toute utilisation non autorisée de votre compte'] },
      { title: '4. Utilisations interdites', intro: 'Les utilisations suivantes sont interdites:', bullets: ['Surcharger la plateforme avec des outils automatisés', 'Accès non autorisé aux données d\'autres utilisateurs', 'Partager du contenu trompeur ou nuisible', 'Copier du contenu de manière à violer les droits d\'auteur'] },
      { title: '5. Avertissement médical', warning: 'BİLİMCE ne fournit pas de conseils médicaux. Les articles scientifiques sur la plateforme sont à des fins d\'information uniquement. Consultez toujours un médecin pour les décisions de santé.' },
      { title: '6. Modèle gratuit', content: 'BİLİMCE est gratuit à utiliser. La tarification des fonctionnalités premium ajoutées à l\'avenir sera annoncée séparément.' },
      { title: '7. Propriété intellectuelle', content: 'La conception, le code et le contenu original de BİLİMCE sont protégés par le droit d\'auteur. Le contenu des articles appartient à NIH/PubMed et est fourni dans le cadre des politiques d\'accès libre.' },
      { title: '8. Modifications du service', content: 'BİLİMCE se réserve le droit de modifier, suspendre ou mettre fin aux services sans préavis.' },
      { title: '9. Droit applicable', content: 'Ces conditions sont soumises aux lois de la République de Turquie.' },
      { title: '10. Contact', contact: 'Pour toute question:' },
    ],
  },
  es: {
    home: '← Inicio', title: 'Términos de servicio', updated: 'Última actualización: marzo 2026',
    privacy: 'Política de privacidad', terms: 'Términos de servicio',
    sections: [
      { title: '1. Aceptación', content: 'Al usar BİLİMCE, acepta estos términos de servicio. Si no está de acuerdo, por favor no use la plataforma.' },
      { title: '2. Descripción del servicio', content: 'BİLİMCE es una plataforma gratuita que hace accesibles los artículos científicos de la base de datos PubMed en español y otros idiomas. El contenido de los artículos pertenece a la Biblioteca Nacional de Medicina de EE.UU. (NIH).' },
      { title: '3. Responsabilidades de la cuenta', bullets: ['Usted es responsable de la seguridad de la información de su cuenta', 'Está obligado a proporcionar información verdadera y precisa', 'Debe reportar inmediatamente cualquier uso no autorizado de su cuenta'] },
      { title: '4. Usos prohibidos', intro: 'Los siguientes usos están prohibidos:', bullets: ['Sobrecargar la plataforma con herramientas automatizadas', 'Acceso no autorizado a los datos de otros usuarios', 'Compartir contenido engañoso o dañino', 'Copiar contenido de manera que infrinja derechos de autor'] },
      { title: '5. Descargo de responsabilidad médica', warning: 'BİLİMCE no proporciona consejos médicos. Los artículos científicos en la plataforma son solo para fines informativos. Siempre consulte a un médico para decisiones de salud.' },
      { title: '6. Modelo gratuito', content: 'BİLİMCE es de uso gratuito. Los precios de las funciones premium añadidas en el futuro se anunciarán por separado.' },
      { title: '7. Propiedad intelectual', content: 'El diseño, código y contenido original de BİLİMCE están protegidos por derechos de autor. El contenido de los artículos pertenece a NIH/PubMed y se proporciona bajo políticas de acceso abierto.' },
      { title: '8. Cambios en el servicio', content: 'BİLİMCE se reserva el derecho de modificar, suspender o terminar los servicios sin previo aviso.' },
      { title: '9. Ley aplicable', content: 'Estos términos están sujetos a las leyes de la República de Turquía.' },
      { title: '10. Contacto', contact: 'Para preguntas:' },
    ],
  },
  ar: {
    home: '← الرئيسية', title: 'شروط الخدمة', updated: 'آخر تحديث: مارس 2026',
    privacy: 'سياسة الخصوصية', terms: 'شروط الخدمة',
    sections: [
      { title: '1. القبول', content: 'باستخدام BİLİMCE، فإنك توافق على شروط الخدمة هذه. إذا كنت لا توافق، يرجى عدم استخدام المنصة.' },
      { title: '2. وصف الخدمة', content: 'BİLİMCE منصة مجانية تجعل المقالات العلمية من قاعدة بيانات PubMed متاحة بالعربية ولغات أخرى. محتوى المقالات يخص المكتبة الوطنية الأمريكية للطب (NIH).' },
      { title: '3. مسؤوليات الحساب', bullets: ['أنت مسؤول عن أمان معلومات حسابك', 'أنت ملزم بتقديم معلومات صحيحة ودقيقة', 'يجب الإبلاغ فوراً عن أي استخدام غير مصرح به لحسابك'] },
      { title: '4. الاستخدامات المحظورة', intro: 'الاستخدامات التالية محظورة:', bullets: ['إرهاق المنصة بأدوات آلية', 'الوصول غير المصرح به إلى بيانات المستخدمين الآخرين', 'مشاركة محتوى مضلل أو ضار', 'نسخ المحتوى بطريقة تنتهك حقوق الطبع والنشر'] },
      { title: '5. إخلاء المسؤولية الطبية', warning: 'لا تقدم BİLİMCE مشورة طبية. المقالات العلمية على المنصة لأغراض المعلومات فقط. استشر دائماً طبيباً للقرارات الصحية.' },
      { title: '6. النموذج المجاني', content: 'BİLİMCE مجانية الاستخدام. سيتم الإعلان عن أسعار الميزات المميزة المضافة في المستقبل بشكل منفصل.' },
      { title: '7. الملكية الفكرية', content: 'تصميم BİLİMCE وكودها ومحتواها الأصلي محمي بحقوق الطبع والنشر. محتوى المقالات يخص NIH/PubMed ويُقدم بموجب سياسات الوصول المفتوح.' },
      { title: '8. تغييرات الخدمة', content: 'تحتفظ BİLİMCE بالحق في تعديل الخدمات أو تعليقها أو إنهائها دون إشعار مسبق.' },
      { title: '9. القانون المطبق', content: 'تخضع هذه الشروط لقوانين جمهورية تركيا.' },
      { title: '10. التواصل', contact: 'للأسئلة:' },
    ],
  },
}

export default function TermsPage() {
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
              {section.intro && <p className="mb-2">{section.intro}</p>}
              {section.bullets && section.bullets.map((b, j) => (
                <p key={j} className="mb-2">• {b}</p>
              ))}
              {section.warning && <p className="text-yellow-400/80">{section.warning}</p>}
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
