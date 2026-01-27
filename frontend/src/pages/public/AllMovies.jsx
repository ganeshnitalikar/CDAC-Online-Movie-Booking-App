import React, { useEffect, useState } from 'react'
import {
	Box,
	Container,
	Typography,
	Grid,
	Skeleton,
	Stack
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { getPublicMovies } from '../../services/movie.public.service'
import MovieCard from '../../components/public/MovieCard' 

const AllMoviesPage = () => {
	const navigate = useNavigate()
	const [movies, setMovies] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		let mounted = true

		getPublicMovies()
			.then((data) => {
				if (!mounted) return
				setMovies(data || [])
			})
			.catch((err) => {
				console.error('Failed to load movies', err)
				setMovies([])
			})
			.finally(() => mounted && setLoading(false))

		return () => {
			mounted = false
		}
	}, [])

	const handleSelectMovie = (movie) => {
		navigate(`/movie/${movie.id}`)
	}

	return (
		<Box sx={{ pb: 6 }}>
			<Container maxWidth="lg" sx={{ pt: 3 }}>
				{/* Page Header */}
				<Stack spacing={1} sx={{ mb: 3 }}>
					<Typography variant="h4" fontWeight={700}>
						All Movies
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Browse all available movies
					</Typography>
				</Stack>

				{/* Movies Grid */}
				<Grid container spacing={2}>
					{(loading ? Array.from({ length: 12 }) : movies).map((movie, index) => (
						<Grid item xs={6} sm={4} md={3} key={movie?.id || index}>
							{loading ? (
								<Skeleton
									variant="rectangular"
									height={320}
									sx={{ borderRadius: 2 }}
								/>
							) : (
								<MovieCard movie={movie} onClick={handleSelectMovie} />
							)}
						</Grid>
					))}

					{/* Empty State */}
					{!loading && movies.length === 0 && (
						<Grid item xs={12}>
							<Typography
								align="center"
								color="text.secondary"
								sx={{ mt: 6 }}
							>
								No movies available at the moment
							</Typography>
						</Grid>
					)}
				</Grid>
			</Container>
		</Box>
	)
}

export default AllMoviesPage
