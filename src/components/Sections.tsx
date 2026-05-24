import { Language, TranslationSet, Product } from '../types';
import { SectionTitle, Reveal } from './UI';
import { MessageSquare, Instagram, MessageCircle } from 'lucide-react';
import { asset } from '../lib/utils';

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
        <img className="w-full h-full object-cover" src={asset('/hero.jpg')} alt="Hero" />
      </Reveal>
      <div className={`absolute bottom-10 ${isAr ? 'right-10' : 'left-10'} bg-white/95 p-6 border-brand-pink ${isAr ? 'border-r-4' : 'border-l-4'}`}>
        <div className="font-serif text-4xl text-brand-pink leading-none">New</div>
        <div className="text-[11px] tracking-[2px] uppercase text-gray-400 mt-1">Lip Duo Collection</div>
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
      <img className="w-full h-[320px] object-cover self-end" src={asset('/about-1.jpg')} alt="About 1" />
      <img className="w-full h-[260px] object-cover mt-10" src={asset('/about-2.jpg')} alt="About 2" />
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
              <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={asset(prod.img)} alt={prod.name} />
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
      {[asset('/gallery-1.jpg'), asset('/gallery-2.jpg'), asset('/gallery-3.jpg'), asset('/gallery-4.jpg'), asset('/gallery-5.jpg')].map((src, i) => (
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
    <div className="hidden lg:block overflow-hidden"><img className="w-full h-full object-cover" src={asset('/contact.jpg')} alt="Contact" /></div>
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
        <div className="logo text-white/90 flex items-baseline">
          Shyky
          <span className="text-xs font-light tracking-[2px] uppercase text-white/40 ml-1.5">Beauty</span>
        </div>
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
          <a
            href="https://www.instagram.com/shykybeauty?igsh=dGpteTcwbXU4MWFx&utm_source=ig_contact_invit"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand-pink transition-colors"
            title="Instagram"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a
            href="https://www.tiktok.com/@shykybeauty?_r=1&_t=ZS-96YM4mJQH1m"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand-pink transition-colors"
            title="TikTok"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.94-1.74a8.03 8.03 0 0 1-1.52-2.02v9.39c-.04 2.11-.74 4.21-2.15 5.79-1.58 1.83-4.04 2.82-6.49 2.55-2.61-.22-5.11-1.87-6.25-4.27a9.23 9.23 0 0 1-.95-4.14c-.05-2.63 1.2-5.26 3.35-6.81 1.76-1.32 4.07-1.85 6.25-1.42v4.09c-1.22-.38-2.58-.17-3.62.54-1.09.73-1.72 2.01-1.64 3.32.06 1.27.74 2.47 1.8 3.14 1.11.72 2.54.83 3.73.27 1.05-.48 1.7-1.56 1.73-2.73.01-3.03.01-6.06.01-9.09V.02z" />
            </svg>
          </a>
          <a
            href="https://snapchat.com/t/5EyfcsS1"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand-pink transition-colors"
            title="Snapchat"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2A5.25 5.25 0 0 0 6.75 7.25c0 .9 0 1.76.2 2.5a3.81 3.81 0 0 1-1.65 1.63c-.45.24-.75.68-.75 1.2 0 1 .8 1.41 1.46 1.41a3 3 0 0 1 .49-.06 5.86 5.86 0 0 0 .53 1.13c-.66.33-.94.75-.94 1.25 0 .22.1.42.27.57a3.86 3.86 0 0 0 2.21.31c.07.6-.09.9-.94.9-1 0-1.25-.45-1.25-.45s-.85.3-.85 1.05c0 .7.85 1.5 4.75 1.5s4.75-.8 4.75-1.5c0-.75-.85-1.05-.85-1.05s-.3.5-1.25.5c-.85 0-1-.3-.93-.9a3.86 3.86 0 0 0 2.21-.31c.17-.15.27-.35.27-.57 0-.5-.28-.92-.94-1.25a5.86 5.86 0 0 0 .53-1.13 3 3 0 0 1 .49.06c.66 0 1.46-.41 1.46-1.41a1.2 1.2 0 0 0-.75-1.2 3.81 3.81 0 0 1-1.65-1.63c.2-.74.2-1.6.2-2.5A5.25 5.25 0 0 0 12 2z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
    <div className="bg-brand-deep border-t border-white/5 py-6 text-center text-[10px] tracking-[1px] text-white/20">
      {t.footer.copyright}
    </div>
  </>
);
