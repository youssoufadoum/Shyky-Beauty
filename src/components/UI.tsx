import { ReactNode } from 'react';
import { motion } from 'motion/react';

export const SectionTitle = ({ html, className = "" }: { html: string, className?: string }) => (
  <h2 
    className={`font-serif text-4xl md:text-5xl font-light leading-tight mb-6 ${className}`}
    dangerouslySetInnerHTML={{ __html: html.replace(/<em>/g, '<em class="italic text-brand-pink">') }}
  />
);

export const Reveal = ({ children, className = "", ...props }: { children: ReactNode, className?: string, [key: string]: any }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.7, ease: "easeOut" }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);
