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
	AccessTime as TimeIcon,
	CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { getShowsByScreen } from '../../services/showService';
import { getMovieById } from '../../services/movie.public.service';

const ShowSelectionPage = () => {
	const { movieId, screenId } = useParams();
	const navigate = useNavigate();
	const [shows, setShows] = useState([]);
	const [movie, setMovie] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			setError(null);
			try {
				const [showsData, movieData] = await Promise.all([
					getShowsByScreen(screenId),
					getMovieById(movieId),
				]);
				
				// Backend should already return shows for this screen, render all shows
				// Only filter if backend doesn't filter by movie
				const allShows = Array.isArray(showsData) ? showsData : [];
				
				// Try to filter by movie if movieId is available, but be flexible with field names
				const movieShows = allShows.filter((show) => {
					// Check multiple possible field names and formats
					const showMovieId = show.movieId || show.movieId || show.movie?.id || show.movie_id;
					return !movieId || !showMovieId || 
						showMovieId === Number(movieId) || 
						showMovieId === String(movieId) ||
						String(showMovieId) === String(movieId);
				});
				
				// If filtering removed all shows, use all shows (backend might already filter)
				const finalShows = movieShows.length > 0 ? movieShows : allShows;
				
				console.log('Shows received from backend:', showsData);
				console.log('Filtered shows:', finalShows);
				
				setShows(finalShows);
				setMovie(movieData);
			} catch (err) {
				console.error('Error fetching data:', err);
				setError(err.message || 'Failed to load shows');
				setShows([]);
			} finally {
				setLoading(false);
			}
		};

		if (screenId && movieId) {
			fetchData();
		}
	}, [screenId, movieId]);

	const handleSelectShow = (showId) => {
		navigate(`/shows/${showId}/seats`);
	};

	const formatShowTime = (dateTimeString) => {
		if (!dateTimeString) return '';
		try {
			const date = new Date(dateTimeString);
			return date.toLocaleTimeString('en-US', {
				hour: '2-digit',
				minute: '2-digit',
				hour12: true,
			});
		} catch {
			return dateTimeString;
		}
	};

	const formatShowDate = (dateTimeString) => {
		if (!dateTimeString) return '';
		try {
			const date = new Date(dateTimeString);
			return date.toLocaleDateString('en-US', {
				weekday: 'short',
				month: 'short',
				day: 'numeric',
			});
		} catch {
			return dateTimeString;
		}
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
							Select Show
						</Typography>
						<Typography color="text.secondary">
							{movie ? `Choose a show time for ${movie.title}` : 'Select your preferred show time'}
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
				) : shows.length === 0 ? (
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
						<TimeIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
						<Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
							No Shows Available
						</Typography>
						<Typography variant="body2" color="text.secondary">
							No shows found for this screen.
						</Typography>
					</Paper>
				) : (
					<>
						<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
							Found <strong>{shows.length}</strong> show{shows.length !== 1 ? 's' : ''}
						</Typography>
						<Grid container spacing={3}>
							{shows.map((show) => (
								<Grid item xs={12} sm={6} md={4} key={show.id}>
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
											<Stack spacing={2}>
												<Stack direction="row" spacing={1} alignItems="center">
													<TimeIcon color="primary" />
													<Typography variant="h6" sx={{ fontWeight: 700 }}>
														{formatShowTime(show.showTime || show.startTime || show.show_time || show.start_time)}
													</Typography>
												</Stack>
												{(show.showTime || show.startTime || show.show_time) && (
													<Stack direction="row" spacing={1} alignItems="center">
														<CalendarIcon fontSize="small" color="action" />
														<Typography variant="body2" color="text.secondary">
															{formatShowDate(show.showTime || show.startTime || show.show_time)}
														</Typography>
													</Stack>
												)}
												{(show.price || show.ticketPrice) && (
													<Chip
														label={`₹${show.price || show.ticketPrice}`}
														color="primary"
														variant="outlined"
														size="small"
													/>
												)}
											</Stack>
										</CardContent>
										<CardActions sx={{ p: 2, pt: 0 }}>
											<Button
												fullWidth
												variant="contained"
												onClick={() => handleSelectShow(show.id)}
												sx={{ textTransform: 'none' }}
											>
												Select Show
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

export default ShowSelectionPage;
