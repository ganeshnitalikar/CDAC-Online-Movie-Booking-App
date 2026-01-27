import React, { useEffect, useMemo, useState } from 'react'
import {
	Box,
	Container,
	Typography,
	Grid,
	Card,
	CardActionArea,
	CardMedia,
	CardContent,
	Chip,
	IconButton,
	Skeleton,
	Button,
	Stack
} from '@mui/material'
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material'
import { getPublicMovies } from '../../services/movie.public.service'
import { useNavigate } from 'react-router-dom'

const Carousel = ({ items = [], onSelect }) => {
	const [index, setIndex] = useState(0)

	useEffect(() => {
		if (!items.length) return
		const id = setInterval(() => setIndex((prev) => (prev + 1) % items.length), 5000)
		return () => clearInterval(id)
	}, [items]);

	if (!items.length) {
		return (
			<Box sx={{ position: 'relative', height: { xs: 220, sm: 320, md: 420 }, borderRadius: 2, overflow: 'hidden', mb: 4 }}>
				<Skeleton variant="rectangular" width="100%" height="100%" />
			</Box>
		)
	}

	const current = items[index]

	return (
		<Box sx={{ position: 'relative', height: { xs: 220, sm: 320, md: 420 }, borderRadius: 2, overflow: 'hidden', mb: 4 }}>
			<Box
				role="img"
				aria-label={current.title}
				onClick={() => onSelect?.(current)}
				sx={{
					cursor: 'pointer',
					width: '100%',
					height: '100%',
					backgroundImage: `linear-gradient(to top, rgba(0,0,0,.65), rgba(0,0,0,.2)), url(${current.backdropUrl})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					display: 'flex',
					alignItems: 'flex-end'
				}}
			>
				<Box sx={{ p: { xs: 2, sm: 3 } }}>
					<Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,.5)' }}>
						{current.title}
					</Typography>
					<Stack direction="row" spacing={1} sx={{ mt: 1 }}>
						{current.genre.map((g) => (
							<Chip key={g} size="small" label={g} sx={{ bgcolor: 'rgba(255,255,255,.15)', color: '#fff' }} />
						))}
					</Stack>
					<Stack direction="row" spacing={2} sx={{ mt: 2 }}>
						<Button variant="contained" onClick={() => onSelect?.(current)}>Book Now</Button>
						<Button variant="outlined" color="inherit" onClick={() => onSelect?.(current)}>View Details</Button>
					</Stack>
				</Box>
			</Box>

			<IconButton aria-label="Previous" onClick={() => setIndex((index - 1 + items.length) % items.length)} sx={{ position: 'absolute', top: '50%', left: 8, transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,.35)', color: '#fff', '&:hover': { bgcolor: 'rgba(0,0,0,.55)' } }}>
				<ArrowBackIosNew fontSize="small" />
			</IconButton>
			<IconButton aria-label="Next" onClick={() => setIndex((index + 1) % items.length)} sx={{ position: 'absolute', top: '50%', right: 8, transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,.35)', color: '#fff', '&:hover': { bgcolor: 'rgba(0,0,0,.55)' } }}>
				<ArrowForwardIos fontSize="small" />
			</IconButton>

			<Stack direction="row" spacing={1} sx={{ position: 'absolute', bottom: 12, left: 0, right: 0, justifyContent: 'center' }}>
				{items.map((_, i) => (
					<Box key={i} sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: i === index ? 'primary.main' : 'rgba(255,255,255,.55)' }} />
				))}
			</Stack>
		</Box>
	)
}

const MovieCard = ({ movie, onClick }) => {
	return (
		<Card sx={{ height: '100%', borderRadius: 2 }}>
			<CardActionArea onClick={() => onClick?.(movie)}>
				<CardMedia component="img" image={movie.posterUrl} alt={movie.title} sx={{ height: 240, objectFit: 'cover' }} />
				<CardContent>
					<Typography variant="subtitle1" sx={{ fontWeight: 600 }} noWrap>{movie.title}</Typography>
					<Stack direction="row" spacing={1} sx={{ mt: .5 }}>
						{(movie.genre || []).slice(0, 2).map((g) => (
							<Chip key={g} size="small" label={g} />
						))}
					</Stack>
					<Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: .5 }}>⭐ {movie.rating} • {movie.releaseDate?.slice(0,4)}</Typography>
				</CardContent>
			</CardActionArea>
		</Card>
	)
}

const HomePage = () => {
	const navigate = useNavigate()
	const [featured, setFeatured] = useState([])
	const [recommended, setRecommended] = useState([])
	const [trending, setTrending] = useState([])
	const [loading, setLoading] = useState(true)

	const recommendedRef = React.useRef(null)

const scrollRecommended = (direction) => {
	if (!recommendedRef.current) return
	const scrollAmount = 300
	recommendedRef.current.scrollBy({
		left: direction === 'left' ? -scrollAmount : scrollAmount,
		behavior: 'smooth'
	})
}


	useEffect(() => {
		let mounted = true
		getPublicMovies()
			.then((movies) => {
				if (!mounted) return
				// Use first 3 movies as featured
				setFeatured(movies.slice(0, 3) || [])
				// Use remaining movies as recommended
				setRecommended(movies.slice(3) || [])
				// Generate trending searches from movie titles
				setTrending(movies.slice(0, 10).map(m => m.title) || [])
			})
			.catch((error) => {
				console.error('Error loading movies:', error)
				if (mounted) {
					setFeatured([])
					setRecommended([])
					setTrending([])
				}
			})
			.finally(() => mounted && setLoading(false))
		return () => { mounted = false }
	}, [])

	const handleSelectMovie = (m) => navigate(`/movie/${m.id}`)

	return (
		<Box sx={{ pb: 6 }}>
			<Container maxWidth="lg" sx={{ pt: 3 }}>
				{/* Featured Carousel */}
				<Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Featured</Typography>
				<Carousel items={featured} onSelect={handleSelectMovie} />

				{/* Recommended Grid */}
				{/* Recommended Movies */}
<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
	<Typography variant="h5" sx={{ fontWeight: 700 }}>
		Recommended For You
	</Typography>

	<Button variant="text" onClick={() => navigate('/movies')}>
		See all
	</Button>
</Stack>

<Box sx={{ position: 'relative' }}>
	{/* Left Arrow */}
	<IconButton
		onClick={() => scrollRecommended('left')}
		sx={{
			position: 'absolute',
			left: -16,
			top: '40%',
			zIndex: 2,
			bgcolor: 'background.paper',
			boxShadow: 2,
			'&:hover': { bgcolor: 'grey.100' }
		}}
	>
		<ArrowBackIosNew fontSize="small" />
	</IconButton>

	{/* Movies Row */}
	<Box
		ref={recommendedRef}
		sx={{
			display: 'flex',
			gap: 2,
			overflowX: 'auto',
			scrollBehavior: 'smooth',
			pb: 1,
			'&::-webkit-scrollbar': { display: 'none' }
		}}
	>
		{(loading ? Array.from({ length: 10 }) : recommended).map((m, i) => (
			<Box key={m?.id || i} sx={{ minWidth: 220 }}>
				{loading ? (
					<Card sx={{ borderRadius: 2 }}>
						<Skeleton variant="rectangular" height={240} />
						<CardContent>
							<Skeleton width="80%" />
							<Skeleton width="60%" />
						</CardContent>
					</Card>
				) : (
					<MovieCard movie={m} onClick={handleSelectMovie} />
				)}
			</Box>
		))}
	</Box>

	{/* Right Arrow */}
	<IconButton
		onClick={() => scrollRecommended('right')}
		sx={{
			position: 'absolute',
			right: -16,
			top: '40%',
			zIndex: 2,
			bgcolor: 'background.paper',
			boxShadow: 2,
			'&:hover': { bgcolor: 'grey.100' }
		}}
	>
		<ArrowForwardIos fontSize="small" />
	</IconButton>
</Box>


				{/* Trending Searches */}
				<Typography variant="h5" sx={{ fontWeight: 700, mt: 5, mb: 2 }}>Trending Searches</Typography>
				<Stack direction="row" flexWrap="wrap" gap={1.2}>
					{(loading ? Array.from({ length: 10 }) : trending).map((term, i) => (
						loading ? (
							<Skeleton key={i} variant="rounded" width={100} height={32} />
						) : (
							<Chip key={term} label={term} variant="outlined" onClick={() => navigate(`/search?q=${encodeURIComponent(term)}`)} />
						)
					))}
				</Stack>
			</Container>
		</Box>
	)
}

export default HomePage