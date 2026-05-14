import { Language, TranslationSet, Product } from '../types';
import { SectionTitle, Reveal } from './UI';
import { MessageSquare, Instagram, MessageCircle } from 'lucide-react';

export const Hero = ({ t, isAr }: { t: TranslationSet; isAr: boolean }) => (
  <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2 pt-20">
    <div className="flex flex-col justify-center px-10 md:px-20 py-20 bg-brand-light">
      <Reveal><p className="text-[11px] tracking-[4px] uppercase text-brand-gold mb-6">{t.hero.tag}</p></Reveal>
      <Reveal transition={{ delay: 0.1 }}>
        <SectionTitle html={t.hero.title} />
      </Reveal>
      <Reveal transition={{ delay: 0.2 }}>
        <p className="text-sm leading-relaxed text-gray-500 max-w-sm mb-10">{t.hero.sub}</p>
      </Reveal>
      <Reveal transition={{ delay: 0.3 }} className="flex flex-wrap gap-4">
        <a href="#products" className="bg-brand-pink text-white px-10 py-4 text-[12px] tracking-[3px] uppercase hover:bg-brand-dark-pink transition-colors">
          {t.hero.discover}
        </a>
        <a href="#about" className="border border-brand-deep text-brand-deep px-10 py-4 text-[12px] tracking-[3px] uppercase hover:bg-brand-deep hover:text-white transition-all">
          {t.hero.story}
        </a>
      </Reveal>
    </div>
    <div className="relative overflow-hidden bg-[#f0dae2] aspect-[4/5] lg:aspect-auto">
      <Reveal className="w-full h-full object-cover">
        <img className="w-full h-full object-cover" src="/hero.jpg" alt="Hero" />
      </Reveal>
      <div className={`absolute bottom-10 ${isAr ? 'right-10' : 'left-10'} bg-white/95 p-6 border-brand-pink ${isAr ? 'border-r-4' : 'border-l-4'}`}>
        <div className="font-serif text-4xl text-brand-pink leading-none">9k</div>
        <div className="text-[11px] tracking-[2px] uppercase text-gray-400 mt-1">Fcfa / Lip Duo</div>
      </div>
    </div>
  </section>
);

export const Marquee = () => (
  <div className="bg-brand-pink py-4 overflow-hidden whitespace-nowrap">
    <div className="inline-flex animate-marquee">
      {Array(4).fill(0).map((_, i) => (
        <div key={i} className="flex">
          {['Lip Duo', '✦', 'Glossy Collection', '✦', 'Lip Liner', '✦', 'Your Glow, Your Power', '✦'].map((text, idx) => (
            <span key={idx} className="text-[11px] tracking-[3px] uppercase text-white px-10">{text}</span>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const About = ({ t }: { t: TranslationSet }) => (
  <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 py-20 px-10 md:px-20" id="about">
    <Reveal className="grid grid-cols-2 gap-2">
      <img className="w-full h-[320px] object-cover self-end" src="/about-1.jpg" alt="About 1" />
      <img className="w-full h-[260px] object-cover mt-10" src="/about-2.jpg" alt="About 2" />
    </Reveal>
    <Reveal className="flex flex-col justify-center">
      <p className="text-[11px] tracking-[4px] uppercase text-brand-gold mb-5">{t.about.tag}</p>
      <SectionTitle html={t.about.title} />
      <p className="text-sm leading-relaxed text-gray-500 mb-8">{t.about.text}</p>
      <a href="#contact" className="bg-brand-pink text-white self-start px-10 py-4 text-[12px] tracking-[3px] uppercase hover:bg-brand-dark-pink transition-colors">
        {t.about.contact}
      </a>
    </Reveal>
  </section>
);

export const ProductGrid = ({ t, products, onProductClick }: { t: TranslationSet; products: Product[]; onProductClick: (p: Product) => void }) => (
  <section className="py-20 px-10 md:px-20 bg-brand-light" id="products">
    <div className="text-center mb-16">
      <p className="text-[11px] tracking-[4px] uppercase text-brand-gold mb-5">{t.products.tag}</p>
      <SectionTitle html={t.products.title} className="text-center" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
      {products.map((prod, idx) => (
        <div key={prod.id || idx} onClick={() => onProductClick(prod)}>
          <Reveal className="group relative bg-white overflow-hidden cursor-pointer h-full">
            <div className="overflow-hidden aspect-[4/5]">
              <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={prod.img} alt={prod.name} />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                <p className="text-white font-serif text-2xl italic mb-4">{prod.name}</p>
                <span className="text-white text-[11px] tracking-[3px] uppercase border border-white px-7 py-3 hover:bg-white hover:text-brand-deep transition-all">
                  {t.products.view}
                </span>
              </div>
            </div>
            <div className="p-6">
              <p className="font-serif text-xl mb-1">{prod.name}</p>
              <p className="text-[11px] tracking-[2px] uppercase text-gray-400 mb-3">{prod.sub}</p>
              <div className="flex gap-1.5">
                {prod.swatches.map((color, i) => (
                  <div key={i} className="w-4 h-4 rounded-full border border-white ring-1 ring-black/10" style={{ background: color }} />
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      ))}
    </div>
  </section>
);

export const Gallery = ({ t }: { t: TranslationSet }) => (
  <section className="py-20 px-10 md:px-20" id="gallery">
    <div className="text-center mb-12">
      <p className="text-[11px] tracking-[4px] uppercase text-brand-gold mb-5">{t.gallery.tag}</p>
      <SectionTitle html={t.gallery.title} />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
      {['/gallery-1.jpg', '/gallery-2.jpg', '/gallery-3.jpg', '/gallery-4.jpg', '/gallery-5.jpg'].map((src, i) => (
        <Reveal key={i} className={`${i === 0 ? 'lg:row-span-2' : ''} overflow-hidden`}>
          <img className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 aspect-[4/5]" src={src} alt={`Gallery ${i+1}`} />
        </Reveal>
      ))}
    </div>
  </section>
);

export const Stats = ({ t }: { t: TranslationSet }) => (
  <section className="bg-brand-deep py-20 px-10 md:px-20 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
    {[
      { num: '5', label: t.stats.shades },
      { num: '100%', label: t.stats.crueltyFree },
      { num: '∞', label: t.stats.inclusive },
    ].map((stat, i) => (
      <div key={i} className="md:border-r last:border-0 border-white/10 py-5">
        <div className="font-serif text-6xl text-brand-pink leading-none mb-3">{stat.num}</div>
        <div className="text-[11px] tracking-[3px] uppercase text-white/50">{stat.label}</div>
      </div>
    ))}
  </section>
);

export const Testimonial = ({ t }: { t: TranslationSet }) => (
  <section className="bg-brand-blush py-24 px-10 md:px-20 text-center">
    <Reveal>
      <p className="text-[11px] tracking-[4px] uppercase text-brand-gold mb-8">{t.testimonial.tag}</p>
      <blockquote className="font-serif text-2xl md:text-3xl italic font-light text-brand-deep max-w-2xl mx-auto leading-relaxed mb-6">
        {t.testimonial.quote}
      </blockquote>
      <cite className="text-[11px] tracking-[3px] uppercase text-brand-pink">{t.testimonial.cite}</cite>
    </Reveal>
  </section>
);

export const Contact = ({ t }: { t: TranslationSet }) => (
  <section className="grid grid-cols-1 lg:grid-cols-2" id="contact">
    <div className="hidden lg:block overflow-hidden"><img className="w-full h-full object-cover" src="/contact.jpg" alt="Contact" /></div>
    <Reveal className="p-10 md:p-20 bg-brand-light flex flex-col justify-center">
      <p className="text-[11px] tracking-[4px] uppercase text-brand-gold mb-5">{t.contact.tag}</p>
      <SectionTitle html={t.contact.title} />
      <div className="bg-brand-pink/5 border border-brand-pink/20 p-4 mb-8 text-brand-pink text-sm tracking-wide flex items-center gap-3">
        <MessageSquare className="w-5 h-5" /> shykybeauty@yahoo.com
      </div>
      <form className="space-y-6">
        <input name="name" required className="w-full bg-transparent border-b border-gray-200 py-3 text-sm focus:border-brand-pink outline-none transition-colors" placeholder={t.contact.namePh} />
        <input name="contact" required className="w-full bg-transparent border-b border-gray-200 py-3 text-sm focus:border-brand-pink outline-none transition-colors" placeholder="Contact" />
        <textarea name="message" required className="w-full bg-transparent border-b border-gray-200 py-3 text-sm focus:border-brand-pink outline-none transition-colors min-h-[100px] resize-none" placeholder={t.contact.msgPh} />
        <button className="bg-brand-pink text-white px-10 py-4 text-[12px] tracking-[3px] uppercase hover:bg-brand-dark-pink transition-colors">
          {t.contact.send}
        </button>
      </form>
    </Reveal>
  </section>
);

export const Footer = ({ t }: { t: TranslationSet }) => (
  <>
    <footer className="bg-brand-deep py-20 px-10 md:px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-white/40">
      <div className="lg:col-span-2">
        <div className="logo text-white/90">Shyky<span className="text-white/30">Beauty</span></div>
        <p className="text-sm leading-relaxed mt-6 max-w-sm">{t.footer.desc}</p>
      </div>
      <div>
        <h4 className="text-[11px] tracking-[3px] uppercase text-white/20 mb-6">{t.footer.collections}</h4>
        <ul className="space-y-3 list-none p-0 text-[13px]">
          {['Lip Gloss', 'Lip Liner', 'Lip Duo', t.footer.new].map((item, i) => (
            <li key={i}><a href="#products" className="hover:text-brand-pink transition-colors">{item}</a></li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="text-[11px] tracking-[3px] uppercase text-white/20 mb-6">{t.contact.tag}</h4>
        <span className="text-[13px] text-brand-pink font-medium block mb-4">shykybeauty@yahoo.com</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-brand-pink transition-colors"><Instagram className="w-5 h-5" /></a>
          <a href="#" className="hover:text-brand-pink transition-colors"><MessageCircle className="w-5 h-5" /></a>
        </div>
      </div>
    </footer>
    <div className="bg-brand-deep border-t border-white/5 py-6 text-center text-[10px] tracking-[1px] text-white/20">
      {t.footer.copyright}
    </div>
  </>
);
