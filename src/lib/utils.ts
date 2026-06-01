import { auth } from './firebase';
import { OperationType, FirestoreErrorInfo } from '../types';

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): FirestoreErrorInfo {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return errInfo;
}

export function asset(path: string): string {
  if (path.startsWith('http')) return path;
  const base = ((import.meta as any).env?.BASE_URL || '/').replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

export function getFallbackUrl(pathStr: string): string {
  const lowercasePath = String(pathStr || '').toLowerCase();
  
  if (lowercasePath.includes('hero')) {
    return 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80';
  }
  if (lowercasePath.includes('about-1') || lowercasePath.includes('about1')) {
    return 'https://images.unsplash.com/photo-1595959183077-5137815e4f9b?auto=format&fit=crop&w=800&q=80';
  }
  if (lowercasePath.includes('about-2') || lowercasePath.includes('about2')) {
    return 'https://images.unsplash.com/photo-1608748323381-e5926ec39d7f?auto=format&fit=crop&w=800&q=80';
  }
  if (lowercasePath.includes('contact')) {
    return 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=80';
  }
  if (lowercasePath.includes('gallery-1') || lowercasePath.includes('gallery1')) {
    return 'https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?auto=format&fit=crop&w=800&q=80';
  }
  if (lowercasePath.includes('gallery-2') || lowercasePath.includes('gallery2')) {
    return 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80';
  }
  if (lowercasePath.includes('gallery-3') || lowercasePath.includes('gallery3')) {
    return 'https://images.unsplash.com/photo-1515688594390-b649af70d282?auto=format&fit=crop&w=800&q=80';
  }
  if (lowercasePath.includes('gallery-4') || lowercasePath.includes('gallery4')) {
    return 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80';
  }
  if (lowercasePath.includes('gallery-5') || lowercasePath.includes('gallery5')) {
    return 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=800&q=80';
  }
  
  // Products
  if (lowercasePath.includes('liner')) {
    return 'https://images.unsplash.com/photo-1631730359575-38e4755d772b?auto=format&fit=crop&w=800&q=80';
  }
  if (lowercasePath.includes('glossy-1') || lowercasePath.includes('glossy1')) {
    return 'https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?auto=format&fit=crop&w=800&q=80';
  }
  if (lowercasePath.includes('glossy-2') || lowercasePath.includes('glossy2')) {
    return 'https://images.unsplash.com/photo-1595959183077-5137815e4f9b?auto=format&fit=crop&w=800&q=80';
  }
  if (lowercasePath.includes('glossy-3') || lowercasePath.includes('glossy3')) {
    return 'https://images.unsplash.com/photo-1522337040788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80';
  }
  if (lowercasePath.includes('glossy-4') || lowercasePath.includes('glossy4')) {
    return 'https://images.unsplash.com/photo-1608748323381-e5926ec39d7f?auto=format&fit=crop&w=800&q=80';
  }
  if (lowercasePath.includes('glossy-5') || lowercasePath.includes('glossy5')) {
    return 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80';
  }
  if (lowercasePath.includes('glossy-6') || lowercasePath.includes('glossy6') || lowercasePath.includes('glossy')) {
    return 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=800&q=80';
  }
  
  // Default general cosmetic photo
  return 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80';
}

export const SectionTitle = ({ html, className = "" }: { html: string, className?: string }) => {
  // We can't import this in App unless we handle the prop types, but it's a simple component
  return null; 
};
