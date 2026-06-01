import React, { ReactNode, useState, useEffect, forwardRef } from 'react';
import { motion } from 'motion/react';
import { getFallbackUrl } from '../lib/utils';

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

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}

export const SafeImage = forwardRef<HTMLImageElement, SafeImageProps>(
  ({ src, alt = "", className = "", ...props }, ref) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
      setImgSrc(src);
      setHasError(false);
    }, [src]);

    const handleError = () => {
      if (!hasError) {
        setHasError(true);
        // Only trigger the mock/stock fallback if it's a local static asset (doesn't start with http/https)
        if (src && !src.startsWith('http://') && !src.startsWith('https://')) {
          const fallback = getFallbackUrl(src);
          if (fallback !== src) {
            setImgSrc(fallback);
          }
        }
      }
    };

    return (
      <img
        ref={ref}
        src={imgSrc}
        alt={alt}
        className={className}
        onError={handleError}
        {...props}
      />
    );
  }
);
SafeImage.displayName = 'SafeImage';

