import { ReactNode } from 'react';

export type Language = 'fr' | 'en' | 'ar';

export interface TranslationSet {
  nav: { about: string; products: string; gallery: string; contact: string };
  hero: { tag: string; title: string; sub: string; discover: string; story: string; shades: string };
  about: { tag: string; title: string; text: string; contact: string };
  products: { tag: string; title: string; view: string; glossShades: string; linerShades: string; rusticCharm: string };
  gallery: { tag: string; title: string };
  stats: { shades: string; crueltyFree: string; inclusive: string };
  testimonial: { tag: string; quote: string; cite: string };
  contact: { tag: string; title: string; namePh: string; msgPh: string; send: string };
  footer: { desc: string; collections: string; new: string; copyright: string };
}

export interface Product {
  id?: string;
  name: string;
  price: number;
  sub: string;
  img: string;
  imgs?: string[];
  swatches: string[];
  desc: {
    fr: string;
    en: string;
    ar: string;
  };
  createdAt?: any;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}
