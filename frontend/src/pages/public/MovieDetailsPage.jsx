import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getMovieById } from '../../services/movie.public.service'
import { Box, Container, Typography, Chip, Grid, Paper, Button, Stack, Skeleton, Alert } from '@mui/material'

const MetaItem = ({ label, value }) => (
	<Stack spacing={0.5}>
		<Typography variant="caption" color="text.secondary">{label}</Typography>
		<Typography variant="body1" sx={{ fontWeight: 600 }}>{value}</Typography>
	</Stack>
)

const MovieDetailsPage = () => {
	const { id } = useParams()
	const navigate = useNavigate()
	const [movie, setMovie] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		let mounted = true
		setLoading(true)
		setError(null)
		getMovieById(id)
			.then((m) => {
				if (mounted) setMovie(m)
			})
			.catch((err) => {
				if (mounted) setError(err.message || 'Failed to load movie details')
			})
			.finally(() => {
				if (mounted) setLoading(false)
			})
		return () => { mounted = false }
	}, [id])

	return (
		<Box>
			{/* Hero */}
			<Box sx={{
				height: { xs: 260, sm: 340, md: 420 },
				backgroundImage: loading ? 'none' : `linear-gradient(to top, rgba(0,0,0,.8), rgba(0,0,0,.2)), url(${movie?.backdropUrl})`,
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				display: 'flex',
				alignItems: 'flex-end'
			}}>
				<Container maxWidth="lg" sx={{ pb: 3 }}>
					{loading ? (
						<Skeleton variant="text" width={260} height={48} />
					) : (
						<Typography variant="h3" sx={{ fontWeight: 800, color: '#fff' }}>{movie.title}</Typography>
					)}
					{loading ? (
						<Skeleton width={160} />
					) : (
						<Stack direction="row" spacing={1} sx={{ mt: 1 }}>
							{movie.genre.map((g) => <Chip key={g} label={g} size="small" />)}
						</Stack>
					)}
				</Container>
			</Box>

			{/* Content */}
			<Container maxWidth="lg" sx={{ py: 4 }}>
				{error && (
					<Alert severity="error" sx={{ mb: 3 }}>
						{error}
					</Alert>
				)}
				{!loading && !error && !movie && (
					<Alert severity="info" sx={{ mb: 3 }}>
						Movie not found
					</Alert>
				)}
				<Grid container spacing={3}>
					<Grid item xs={12} md={8}>
						<Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
							<Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Synopsis</Typography>
							{loading ? (
								<>
									<Skeleton />
									<Skeleton width="80%" />
								</>
							) : (
								<Typography color="text.secondary">{movie.overview}</Typography>
							)}
							<Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mt: 3 }}>
								<MetaItem label="Rating" value={loading ? '-' : `⭐ ${movie.rating}`} />
								<MetaItem label="Duration" value={loading ? '-' : `${movie.durationMins} mins`} />
								<MetaItem label="Language" value={loading ? '-' : movie.language} />
								<MetaItem label="Certificate" value={loading ? '-' : movie.certificate} />
							</Stack>
						</Paper>

						<Paper elevation={0} sx={{ mt: 3, p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
							<Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Cast</Typography>
							<Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
								{loading ? Array.from({ length: 6 }).map((_, i) => (
									<Skeleton key={i} variant="rounded" width={140} height={60} />
								)) : movie.cast.map((c) => (
									<Paper key={c.id} elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider', minWidth: 160 }}>
										<Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{c.name}</Typography>
										<Typography variant="caption" color="text.secondary">as {c.role}</Typography>
									</Paper>
								))}
							</Stack>
						</Paper>

						<Paper elevation={0} sx={{ mt: 3, p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
							<Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Crew</Typography>
							<Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
								{loading ? Array.from({ length: 4 }).map((_, i) => (
									<Skeleton key={i} variant="rounded" width={140} height={60} />
								)) : movie.crew.map((c) => (
									<Paper key={c.id} elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider', minWidth: 160 }}>
										<Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{c.name}</Typography>
										<Typography variant="caption" color="text.secondary">{c.role}</Typography>
									</Paper>
								))}
							</Stack>
						</Paper>
					</Grid>
					<Grid item xs={12} md={4}>
						<Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', position: 'sticky', top: 16 }}>
							<Typography variant="h6" sx={{ fontWeight: 700 }}>Book Tickets</Typography>
							<Typography variant="body2" color="text.secondary" sx={{ mt: .5 }}>Select your date, time and seats on the next step.</Typography>
							<Button 
								fullWidth 
								size="large" 
								variant="contained" 
								sx={{ mt: 2 }}
								onClick={() => navigate(`/movies/${id}/theatres`)}
							>
								Continue
							</Button>
							<Button fullWidth size="large" variant="outlined" sx={{ mt: 1 }}>Watch Trailer</Button>
						</Paper>
					</Grid>
				</Grid>
			</Container>
		</Box>
	)
}

export default MovieDetailsPage