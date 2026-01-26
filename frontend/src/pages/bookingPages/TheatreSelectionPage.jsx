import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
	Box,
	Container,
	Typography,
	Grid,
	Card,
	CardContent,
	CardActions,
	Button,
	Stack,
	Alert,
	Skeleton,
	Paper,
	IconButton,
} from '@mui/material';
import {
	ArrowBack as ArrowBackIcon,
	LocationOn as LocationIcon,
	Phone as PhoneIcon,
	TheaterComedy as TheatreIcon,
} from '@mui/icons-material';
import { getTheatresByMovie } from '../../services/theatreService';
import { getMovieById } from '../../services/movie.public.service';

const TheatreSelectionPage = () => {
	const { movieId } = useParams();
	const navigate = useNavigate();
	const [theatres, setTheatres] = useState([]);
	const [movie, setMovie] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			setError(null);
			try {
				const [theatresData, movieData] = await Promise.all([
					getTheatresByMovie(movieId),
					getMovieById(movieId),
				]);
				setTheatres(Array.isArray(theatresData) ? theatresData : []);
				setMovie(movieData);
			} catch (err) {
				console.error('Error fetching data:', err);
				setError(err.message || 'Failed to load theatres');
				setTheatres([]);
			} finally {
				setLoading(false);
			}
		};

		if (movieId) {
			fetchData();
		}
	}, [movieId]);

	const handleSelectTheatre = (theatreId) => {
		navigate(`/movies/${movieId}/theatres/${theatreId}/screens`);
	};

	return (
		<Box sx={{ py: 4 }}>
			<Container maxWidth="lg">
				{/* Header */}
				<Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
					<IconButton onClick={() => navigate(-1)}>
						<ArrowBackIcon />
					</IconButton>
					<Box sx={{ flex: 1 }}>
						<Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
							Select Theatre
						</Typography>
						<Typography color="text.secondary">
							{movie ? `Select a theatre for ${movie.title}` : 'Choose your preferred theatre'}
						</Typography>
					</Box>
				</Stack>

				{/* Error Alert */}
				{error && (
					<Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
						{error}
					</Alert>
				)}

				{/* Loading State */}
				{loading ? (
					<Grid container spacing={3}>
						{Array.from({ length: 6 }).map((_, i) => (
							<Grid item xs={12} sm={6} md={4} key={i}>
								<Card sx={{ borderRadius: 2 }}>
									<CardContent>
										<Skeleton height={32} />
										<Skeleton height={20} width="60%" sx={{ mt: 1 }} />
										<Skeleton height={20} width="40%" sx={{ mt: 1 }} />
									</CardContent>
								</Card>
							</Grid>
						))}
					</Grid>
				) : theatres.length === 0 ? (
					<Paper
						elevation={0}
						sx={{
							p: 6,
							textAlign: 'center',
							borderRadius: 3,
							border: '1px solid',
							borderColor: 'divider',
						}}
					>
						<TheatreIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
						<Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
							No Theatres Available
						</Typography>
						<Typography variant="body2" color="text.secondary">
							No theatres are currently showing this movie.
						</Typography>
					</Paper>
				) : (
					<>
						<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
							Found <strong>{theatres.length}</strong> theatre{theatres.length !== 1 ? 's' : ''}
						</Typography>
						<Grid container spacing={3}>
							{theatres.map((theatre) => (
								<Grid item xs={12} sm={6} md={4} key={theatre.id}>
									<Card
										sx={{
											height: '100%',
											display: 'flex',
											flexDirection: 'column',
											borderRadius: 2,
											border: '1px solid',
											borderColor: 'divider',
											transition: 'transform 0.2s, box-shadow 0.2s',
											'&:hover': {
												transform: 'translateY(-4px)',
												boxShadow: 4,
											},
										}}
									>
										<CardContent sx={{ flexGrow: 1 }}>
											<Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
												<TheatreIcon color="primary" />
												<Typography variant="h6" sx={{ fontWeight: 700 }}>
													{theatre.name}
												</Typography>
											</Stack>
											<Stack spacing={1.5} sx={{ mt: 2 }}>
												{theatre.address && (
													<Stack direction="row" spacing={1} alignItems="flex-start">
														<LocationIcon fontSize="small" color="action" />
														<Typography variant="body2" color="text.secondary">
															{theatre.address}
														</Typography>
													</Stack>
												)}
												{theatre.phone && (
													<Stack direction="row" spacing={1} alignItems="center">
														<PhoneIcon fontSize="small" color="action" />
														<Typography variant="body2" color="text.secondary">
															{theatre.phone}
														</Typography>
													</Stack>
												)}
											</Stack>
										</CardContent>
										<CardActions sx={{ p: 2, pt: 0 }}>
											<Button
												fullWidth
												variant="contained"
												onClick={() => handleSelectTheatre(theatre.id)}
												sx={{ textTransform: 'none' }}
											>
												Select Theatre
											</Button>
										</CardActions>
									</Card>
								</Grid>
							))}
						</Grid>
					</>
				)}
			</Container>
		</Box>
	);
};

export default TheatreSelectionPage;
