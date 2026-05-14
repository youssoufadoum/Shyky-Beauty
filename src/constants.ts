import { Language, TranslationSet, Product } from './types';

export const AUTHORIZED_USERS = ['y.adamabakar81@gmail.com', 'shykybeauty@yahoo.com'];

export const INITIAL_PRODUCTS: Product[] = [
  {
    name: "Lip Gloss",
    price: 9000,
    sub: "Glossy Collection — Duo 9.000 Fcfa",
    img: "/glossy-1.jpeg",
    imgs: [
      "/glossy-1.jpeg",
      "/glossy-2.png",
      "/glossy-3.jpeg",
      "/glossy-4.png",
      "/glossy-5.jpeg",
      "/glossy-6.png"
    ],
    swatches: ["#FFC0CB", "#FFB6C1", "#7B3F00", "#F5F5DC", "#FFF8DC"],
    desc: {
      fr: "Un gloss ultra-brillant qui nourrit vos lèvres tout en leur donnant un éclat incomparable. Texture non collante et longue tenue. Couleurs: Pink, Light Pink, Chocolate, Beige, Light Beige.",
      en: "An ultra-shiny gloss that nourishes your lips while giving them an incomparable glow. Non-sticky texture and long lasting. Colors: Pink, Light Pink, Chocolate, Beige, Light Beige.",
      ar: "جلوس فائق اللمعان يغذي شفتيك ويمنحهما توهجاً لا مثيل له. ملمس غير لزج ويدوم طويلاً. الألوان: وردي، وردي فاتح، شوكولاتة، بيج، بيج فاتح."
    },
    createdAt: "2024-01-01T00:00:00Z"
  },
  {
    name: "Lip Liner",
    price: 9000,
    sub: "5 shades — Long Lasting",
    img: "/liner-1.jpg",
    swatches: ["#3D2B1F", "#CD7F32", "#DC143C", "#E6A8D7", "#3B2F2F"],
    desc: {
      fr: "Un traceur de lèvres précis et longue tenue pour définir parfaitement votre sourire. Couleurs: Dunk, Bronze, Crimson, Petal, Espresso.",
      en: "A precise, long-lasting lip liner to perfectly define your smile. Colors: Dunk, Bronze, Crimson, Petal, Espresso.",
      ar: "محدد شفاه دقيق ويدوم طويلاً لتحديد ابتسامتك بشكل مثالي. الألوان: دانك، برونزي، قرمزي، بيتال، إسبريسو."
    },
    createdAt: "2024-01-01T00:00:00Z"
  }
];

export const translations: Record<Language, TranslationSet> = {
  fr: {
    nav: { about: 'À Propos', products: 'Produits', gallery: 'Galerie', contact: 'Contact' },
    hero: {
      tag: '✦ Glossy Collection',
      title: 'Votre <em>Éclat</em>,<br>Votre Pouvoir',
      sub: 'Des lèvres qui racontent une histoire. Duo Lip Gloss & Lip Liner de luxe, conçu pour sublimer toutes les teintes de peau. 9.000 Fcfa le duo + 1.000 Fcfa livraison.',
      discover: 'Découvrir',
      story: 'Notre Histoire',
      shades: 'Teintes Signature'
    },
    about: {
      tag: '✦ Notre Histoire',
      title: 'La beauté<br><em>sans limites</em>',
      text: "Shyky Beauty est née d'une passion pour l'inclusion et l'élégance. Notre Glossy Collection — Lip Duo associe un Lip Gloss ultra-brillant à un Lip Liner précis, créant un duo idéal pour toutes les femmes du monde à seulement 9.000 Fcfa (Frais d'expédition 1.000 Fcfa).",
      contact: 'Nous Contacter'
    },
    products: {
      tag: '✦ Boutique',
      title: 'La Collection <em>Signature</em>',
      view: 'Voir Produit',
      glossShades: 'Lip Gloss — Partie du Duo à 9.000 Fcfa',
      linerShades: 'Lip Liner — Partie du Duo à 9.000 Fcfa',
      rusticCharm: 'Lip Duo Bundle — Gloss & Liner (9.000 Fcfa)'
    },
    gallery: { tag: '✦ Galerie', title: 'Le Monde <em>Shyky</em>' },
    stats: { shades: 'Teintes Signature', crueltyFree: 'Cruelty Free', inclusive: 'Beauté Inclusive' },
    testimonial: {
      tag: '✦ Ce Qu\'elles Disent',
      quote: "« Ce Lip Duo a changé ma routine beauté. Le gloss tient toute la journée et le liner est ultra précis. Je ne peux plus m'en passer ! »",
      cite: '— Sofia M., Paris'
    },
    contact: {
      tag: '✦ Nous Contacter',
      title: 'On vous <em>répond</em>',
      namePh: 'Votre nom',
      msgPh: 'Votre message...',
      send: 'Envoyer →'
    },
    footer: {
      desc: 'La beauté est un droit, pas un privilège. Shyky Beauty célèbre chaque femme dans sa singularité.',
      collections: 'Collections',
      new: 'Nouveautés',
      copyright: '©️ 2025 Shyky Beauty. Tous droits réservés.'
    }
  },
  en: {
    nav: { about: 'About', products: 'Products', gallery: 'Gallery', contact: 'Contact' },
    hero: {
      tag: '✦ Glossy Collection',
      title: 'Your <em>Glow</em>,<br>Your Power',
      sub: 'Lips that tell a story. High quality Lip Gloss & Lip Liner, designed to enhance every skin tone. The perfect duo for 9,000 Fcfa.',
      discover: 'Discover',
      story: 'Our Story',
      shades: 'Signature Shades'
    },
    about: {
      tag: '✦ Our Story',
      title: 'Beauty<br><em>without limits</em>',
      text: 'Shyky Beauty was born from a passion for inclusion and elegance. Our Glossy Collection — Lip Duo combines an ultra-shiny Lip Gloss with a precise Lip Liner, creating the perfect duo for women everywhere at just 9,000 Fcfa.',
      contact: 'Contact Us'
    },
    products: {
      tag: '✦ Our Products',
      title: 'The <em>Signature</em> Collection',
      view: 'View Product',
      glossShades: 'Glossy Collection — Duo 9,000 Fcfa',
      linerShades: '5 shades — Long Lasting',
      rusticCharm: 'Lip Duo — Gloss & Liner (9,000 Fcfa)'
    },
    gallery: { tag: '✦ Gallery', title: 'The <em>Shyky</em> World' },
    stats: { shades: 'Signature Shades', crueltyFree: 'Cruelty Free', inclusive: 'Inclusive Beauty' },
    testimonial: {
      tag: '✦ What They Say',
      quote: "“This Lip Duo changed my beauty routine. The gloss lasts all day and the liner is ultra precise. I can't live without it!”",
      cite: '— Sofia M., Paris'
    },
    contact: {
      tag: '✦ Contact Us',
      title: 'We\'ll <em>reply</em>',
      namePh: 'Your name',
      msgPh: 'Your message...',
      send: 'Send →'
    },
    footer: {
      desc: 'Beauty is a right, not a privilege. Shyky Beauty celebrates every woman in her uniqueness.',
      collections: 'Collections',
      new: 'New Arrivals',
      copyright: '©️ 2025 Shyky Beauty. All rights reserved.'
    }
  },
  ar: {
    nav: { about: 'من نحن', products: 'المنتجات', gallery: 'المعرض', contact: 'تواصل' },
    hero: {
      tag: '✦ مجموعة لامعة',
      title: 'توهجك<br><em>قوّتك</em>',
      sub: 'شفاه تحكي قصة. جلوس الشفاه وتحديد الشفاه عالي الجودة، مصمم لتعزيز كل لون بشرة. الثنائي المثالي بـ 9000 فرنك أفريقي.',
      discover: 'اكتشفي',
      story: 'قصتنا',
      shades: 'ألوان مميزة'
    },
    about: {
      tag: '✦ قصتنا',
      title: 'الجمال<br><em>بلا حدود</em>',
      text: 'وُلدت Shyky Beauty من شغف بالشمولية والأناقة. تجمع مجموعتنا اللامعة — Lip Duo بين جلوس شفاه فائق اللمعان ومحدد شفاه دقيق، لخلق ثنائي مثالي لكل نساء العالم بـ 9000 فرنك أفريقي فقط.',
      contact: 'تواصلي معنا'
    },
    products: {
      tag: '✦ منتجاتنا',
      title: 'المجموعة <em>المميزة</em>',
      view: 'عرض المنتج',
      glossShades: 'مجموعة لامعة — ثنائي بـ 9000 فرنك',
      linerShades: '5 ألوان — طويل الأمد',
      rusticCharm: 'Lip Duo — جلوس ومحدد (9000 فرنك)'
    },
    gallery: { tag: '✦ معرض', title: 'عالم <em>Shyky</em>' },
    stats: { shades: 'ألوان مميزة', crueltyFree: 'خالٍ من القسوة', inclusive: 'جمال شامل' },
    testimonial: {
      tag: '✦ ما يقلنه',
      quote: "« لقد غيّر هذا الثنائي روتين جمالي تمامًا. الجلوس يدوم طوال اليوم والمحدد دقيق للغاية. لا أستطيع الاستغناء عنه! »",
      cite: '— صوفيا م.، باريس'
    },
    contact: {
      tag: '✦ تواصلي معنا',
      title: 'سنرد <em>عليك</em>',
      namePh: 'اسمك',
      msgPh: 'رسالتك...',
      send: 'إرسال →'
    },
    footer: {
      desc: 'الجمال حق، وليس امتيازاً. تحتفل Shyky Beauty بكل امرأة في تفردها.',
      collections: 'المجموعات',
      new: 'وصل حديثاً',
      copyright: '©️ 2025 Shyky Beauty. جميع الحقوق محفوظة.'
    }
  }
};
