export interface SampleImage {
  id: string;
  title: string;
  category: string;
  url: string;
  author: string;
}

export const SAMPLE_IMAGES: SampleImage[] = [
  {
    id: 'nature-mountain',
    title: 'Alpine Vista',
    category: 'Landscape',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85',
    author: 'Bailey Zindel',
  },
  {
    id: 'architecture-city',
    title: 'Neon Skyline',
    category: 'City & Architecture',
    url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1600&q=85',
    author: 'Aleksandar Pasaric',
  },
  {
    id: 'portrait-street',
    title: 'Golden Hour Portrait',
    category: 'Portrait',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=85',
    author: 'Aiony Haust',
  },
  {
    id: 'texture-abstract',
    title: 'Minimalist Dunes',
    category: 'Abstract & Texture',
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1600&q=85',
    author: 'Jeremy Bishop',
  },
];
