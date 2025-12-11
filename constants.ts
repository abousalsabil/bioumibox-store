import { Product, Category } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Huile d\'Olive Vierge Extra',
    category: Category.OIL,
    price: 22.500,
    image: 'https://picsum.photos/seed/oliveoil/400/400',
    description: 'Une huile d\'olive extra vierge, pressée à froid, issue des meilleures oliveraies du Sahel tunisien. Riche en polyphénols et au goût fruité intense.',
    producer: 'Domaine Ben Amor',
    benefits: ['Riche en antioxydants', 'Santé cardiovasculaire', 'Anti-inflammatoire'],
    ingredients: ['100% Olives Chemlali'],
    isOrganic: true,
    isArtisanal: false,
    rating: 4.8,
    reviews: 124
  },
  {
    id: '2',
    name: 'Miel de Thym Sauvage',
    category: Category.HONEY,
    price: 35.000,
    image: 'https://picsum.photos/seed/honey/400/400',
    description: 'Miel de thym pur récolté dans les montagnes de Zaghouan. Une couleur ambrée et un arôme puissant caractérisent ce miel d\'exception.',
    producer: 'Api-Culture Tunis',
    benefits: ['Cicatrisant puissant', 'Antiseptique naturel', 'Apaise la toux'],
    ingredients: ['100% Miel de Thym'],
    isOrganic: true,
    isArtisanal: true,
    rating: 4.9,
    reviews: 89
  },
  {
    id: '3',
    name: 'Dattes Deglet Nour (Branche)',
    category: Category.DATES,
    price: 12.000,
    image: 'https://picsum.photos/seed/dates/400/400',
    description: 'La reine des dattes, Deglet Nour, présentée en branches. Translucide, mielleuse et fondante. Origine Tozeur.',
    producer: 'Oasis Bio',
    benefits: ['Source d\'énergie immédiate', 'Riche en fibres', 'Potassium et Magnésium'],
    ingredients: ['100% Dattes Deglet Nour'],
    isOrganic: true,
    isArtisanal: false,
    rating: 4.7,
    reviews: 250
  },
  {
    id: '4',
    name: 'Harissa Traditionnelle',
    category: Category.SPICES,
    price: 8.500,
    image: 'https://picsum.photos/seed/harissa/400/400',
    description: 'Harissa préparée à l\'ancienne, séchée au soleil, avec de l\'ail frais, carvi et coriandre. Un piquant équilibré.',
    producer: 'Femmes Rurales Nabeul',
    benefits: ['Stimule le métabolisme', 'Riche en vitamines C et E'],
    ingredients: ['Piments rouges séchés', 'Ail', 'Carvi', 'Coriandre', 'Sel', 'Huile d\'olive'],
    isOrganic: false,
    isArtisanal: true,
    rating: 5.0,
    reviews: 67
  },
  {
    id: '5',
    name: 'Bsissa Blé & Fruits Secs',
    category: Category.GRAINS,
    price: 18.000,
    image: 'https://picsum.photos/seed/bsissa/400/400',
    description: 'Mélange traditionnel de blé torréfié, épices et fruits secs. Le petit-déjeuner idéal pour une journée pleine d\'énergie.',
    producer: 'Saveurs du Sud',
    benefits: ['Énergétique', 'Nutritif', 'Digestif'],
    ingredients: ['Blé dur', 'Pois chiches', 'Amandes', 'Sésame', 'Fenouil', 'Anis'],
    isOrganic: false,
    isArtisanal: true,
    rating: 4.6,
    reviews: 45
  },
  {
    id: '6',
    name: 'Robb de Dattes',
    category: Category.DATES,
    price: 15.000,
    image: 'https://picsum.photos/seed/robb/400/400',
    description: 'Sirop de dattes naturel, substitut idéal au sucre raffiné. Utilisé traditionnellement pour sucrer la Bsissa ou le yaourt.',
    producer: 'Oasis Bio',
    benefits: ['Alternative au sucre', 'Riche en fer'],
    ingredients: ['100% Jus de dattes concentré'],
    isOrganic: true,
    isArtisanal: true,
    rating: 4.8,
    reviews: 32
  }
];

export const CATEGORIES = Object.values(Category);
