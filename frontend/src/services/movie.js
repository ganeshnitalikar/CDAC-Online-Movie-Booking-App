export const getFeaturedMovies = async () => {
	await new Promise(r => setTimeout(r, 400));
	return [
		{
			id: 'mv_101',
			title: 'Eternal Horizon',
			genre: ['Sci-Fi', 'Adventure'],
			rating: 8.6,
			releaseDate: '2025-11-10',
			durationMins: 142,
			posterUrl: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=1200&auto=format&fit=crop',
			backdropUrl: 'https://images.unsplash.com/photo-1529101091764-c3526daf38fe?q=80&w=1600&auto=format&fit=crop',
			overview: 'A crew ventures beyond known space to uncover a signal that could rewrite human history.'
		},
		{
			id: 'mv_102',
			title: 'Neon Nights',
			genre: ['Action', 'Thriller'],
			rating: 7.9,
			releaseDate: '2025-09-02',
			durationMins: 128,
			posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&auto=format&fit=crop',
			backdropUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1600&auto=format&fit=crop',
			overview: 'In a city of lights and shadows, a former cop hunts a ghost from his past.'
		},
		{
			id: 'mv_103',
			title: 'Starlit Sonata',
			genre: ['Romance', 'Drama'],
			rating: 8.1,
			releaseDate: '2025-08-18',
			durationMins: 115,
			posterUrl: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=1200&auto=format&fit=crop',
			backdropUrl: 'https://images.unsplash.com/photo-1502139214984-458d87318791?q=80&w=1600&auto=format&fit=crop',
			overview: 'Two artists find love under city lights while chasing their biggest dreams.'
		}
	];
};

export const getRecommendedMovies = async () => {
	await new Promise(r => setTimeout(r, 350));
	return Array.from({ length: 12 }).map((_, i) => ({
		id: `rec_${i + 1}`,
		title: `Recommended ${i + 1}`,
		genre: i % 2 ? ['Drama'] : ['Action'],
		rating: (Math.random() * 2 + 7).toFixed(1),
		releaseDate: '2025-07-01',
		posterUrl: `https://picsum.photos/seed/reco${i}/400/600`,
		backdropUrl: `https://picsum.photos/seed/reco_bg${i}/1200/600`,
		overview: 'Hand-picked for you based on your recent activity.'
	}));
};

export const getTrendingSearches = async () => {
	await new Promise(r => setTimeout(r, 200));
	return [
		'Joker 2', 'Deadpool & Wolverine', 'Dune 3', 'Spider-Verse', 'Avatar 3',
		'Pushpa 2', 'Devara', 'Bhool Bhulaiyaa 3', 'Jawan 2', 'Salaar 2'
	];
};

export const getMovieById = async (id) => {
	await new Promise(r => setTimeout(r, 300));
	return {
		id,
		title: 'Eternal Horizon',
		genre: ['Sci-Fi', 'Adventure'],
		rating: 8.6,
		releaseDate: '2025-11-10',
		durationMins: 142,
		language: 'English',
		certificate: 'U/A',
		posterUrl: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=1200&auto=format&fit=crop',
		backdropUrl: 'https://images.unsplash.com/photo-1529101091764-c3526daf38fe?q=80&w=1600&auto=format&fit=crop',
		overview: 'A crew ventures beyond known space to uncover a signal that could rewrite human history.',
		cast: [
			{ id: 'c1', name: 'Ava Sinclair', role: 'Captain Mira Hawke' },
			{ id: 'c2', name: 'Liam Carter', role: 'Dr. Orion Wells' },
			{ id: 'c3', name: 'Maya Chen', role: 'Navigator Lyra' },
		],
		crew: [
			{ id: 'cr1', name: 'R. Nolan', role: 'Director' },
			{ id: 'cr2', name: 'H. Zimmer', role: 'Music' },
		],
		trailers: [
			{ id: 't1', title: 'Official Trailer', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
		]
	};
};