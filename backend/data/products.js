const products = [
    {
        id: 'GOLD-001',
        name: 'Royal Temple Necklace',
        type: 'gold',
        images: [
            'https://placehold.co/600x600/gold/white?text=Royal+Necklace+1',
            'https://placehold.co/600x600/gold/white?text=Royal+Necklace+2',
            'https://placehold.co/600x600/gold/white?text=Royal+Necklace+Close'
        ],
        baseWeight: 45,
        purities: ['22'],
        makingChargesPercent: 18,
        gstPercent: 3,
        description: 'Exquisite handcrafted necklace inspired by temple architecture. Perfect for weddings and grand occasions.'
    },
    {
        id: 'GOLD-002',
        name: 'Minimalist Gold Chain',
        type: 'gold',
        images: [
            'https://placehold.co/600x600/gold/white?text=Chain+Main',
            'https://placehold.co/600x600/gold/white?text=Chain+Detail'
        ],
        baseWeight: 12,
        purities: ['22', '18'],
        makingChargesPercent: 8,
        gstPercent: 3,
        description: 'A sleek everyday chain that adds a touch of elegance to any outfit.'
    },
    {
        id: 'GOLD-003',
        name: 'Antique Jhumka Earrings',
        type: 'gold',
        images: [
            'https://placehold.co/600x600/DAA520/white?text=Jhumka+Earrings',
            'https://placehold.co/600x600/DAA520/white?text=Jhumka+Detail'
        ],
        baseWeight: 22,
        purities: ['22'],
        makingChargesPercent: 15,
        gstPercent: 3,
        description: 'Traditional Jhumka earrings with intricate gold work.'
    },
    {
        id: 'GOLD-004',
        name: 'Hammered Gold Bangles',
        type: 'gold',
        images: [
            'https://placehold.co/600x600/gold/white?text=Bangles+Pair',
            'https://placehold.co/600x600/gold/white?text=Bangle+Side'
        ],
        baseWeight: 30,
        purities: ['22', '18'],
        makingChargesPercent: 12,
        gstPercent: 3,
        description: 'Set of 2 hammered finish bangles. Modern yet timeless.'
    },
    {
        id: 'DIAMOND-001',
        name: 'Solitaire Diamond Ring',
        type: 'diamond',
        images: [
            'https://placehold.co/600x600/E6E6FA/black?text=Solitaire+Main',
            'https://placehold.co/600x600/E6E6FA/black?text=Solitaire+Side',
            'https://placehold.co/600x600/E6E6FA/black?text=Solitaire+Finger'
        ],
        baseWeight: 0.75, // Carats
        purities: [],
        makingChargesPercent: 15,
        gstPercent: 3,
        description: 'A brilliant cut solitaire diamond set in 18K White Gold (Base).'
    },
    {
        id: 'DIAMOND-002',
        name: 'Diamond Tennis Bracelet',
        type: 'diamond',
        images: [
            'https://placehold.co/600x600/E6E6FA/black?text=Tennis+Bracelet',
            'https://placehold.co/600x600/E6E6FA/black?text=Bracelet+Clasp'
        ],
        baseWeight: 2.5, // Total Carat Weight
        purities: [],
        makingChargesPercent: 20,
        gstPercent: 3,
        description: 'Classic tennis bracelet featuring 50 round diamonds.'
    }
];

module.exports = products;
