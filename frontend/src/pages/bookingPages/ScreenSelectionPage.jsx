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
	Chip,
} from '@mui/material';
import {
	ArrowBack as ArrowBackIcon,
	TheaterComedy as ScreenIcon,
	EventSeat as SeatIcon,
} from '@mui/icons-material';
import { getScreensByTheatre } from '../../services/screenService';
import { getMovieById } from '../../services/movie.public.service';

const ScreenSelectionPage = () => {
	const { movieId, theatreId } = useParams();
	const navigate = useNavigate();
	const [screens, setScreens] = useState([]);
	const [movie, setMovie] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			setError(null);
			try {
				const [screensData, movieData] = await Promise.all([
					getScreensByTheatre(theatreId),
					getMovieById(movieId),
				]);
				setScreens(Array.isArray(screensData) ? screensData : []);
				setMovie(movieData);
			} catch (err) {
				console.error('Error fetching data:', err);
				setError(err.message || 'Failed to load screens');
				setScreens([]);
			} finally {
				setLoading(false);
			}
		};

		if (theatreId && movieId) {
			fetchData();
		}
	}, [theatreId, movieId]);

	const handleSelectScreen = (screenId) => {
		navigate(`/movies/${movieId}/theatres/${theatreId}/screens/${screenId}/shows`);
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
							Select Screen
						</Typography>
						<Typography color="text.secondary">
							{movie ? `Choose a screen for ${movie.title}` : 'Select your preferred screen'}
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
									</CardContent>
								</Card>
							</Grid>
						))}
					</Grid>
				) : screens.length === 0 ? (
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
						<ScreenIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
						<Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
							No Screens Available
						</Typography>
						<Typography variant="body2" color="text.secondary">
							No screens found for this theatre.
						</Typography>
					</Paper>
				) : (
					<>
						<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
							Found <strong>{screens.length}</strong> screen{screens.length !== 1 ? 's' : ''}
						</Typography>
						<Grid container spacing={3}>
							{screens.map((screen) => (
								<Grid item xs={12} sm={6} md={4} key={screen.id}>
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
											<Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
												<ScreenIcon color="primary" />
												<Typography variant="h6" sx={{ fontWeight: 700 }}>
													{screen.name}
												</Typography>
											</Stack>
											<Stack spacing={1.5}>
												{screen.capacity && (
													<Stack direction="row" spacing={1} alignItems="center">
														<SeatIcon fontSize="small" color="action" />
														<Typography variant="body2" color="text.secondary">
															Capacity: {screen.capacity} seats
														</Typography>
													</Stack>
												)}
												{screen.features && screen.features.length > 0 && (
													<Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
														{screen.features.map((feature, idx) => (
															<Chip key={idx} label={feature} size="small" variant="outlined" />
														))}
													</Stack>
												)}
											</Stack>
										</CardContent>
										<CardActions sx={{ p: 2, pt: 0 }}>
											<Button
												fullWidth
												variant="contained"
												onClick={() => handleSelectScreen(screen.id)}
												sx={{ textTransform: 'none' }}
											>
												View Shows
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

export default ScreenSelectionPage;
