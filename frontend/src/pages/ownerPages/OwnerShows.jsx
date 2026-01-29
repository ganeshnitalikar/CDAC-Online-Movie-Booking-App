import React, { useEffect, useState } from 'react';
import {
	Box,
	Container,
	Typography,
	Grid,
	Paper,
	Button,
	Stack,
	Card,
	CardContent,
	CardActions,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Alert,
	Skeleton,
	Chip,
	CircularProgress,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from '@mui/material';
import {
	Add as AddIcon,
	Edit as EditIcon,
	Delete as DeleteIcon,
	AccessTime as ShowIcon,
	Refresh as RefreshIcon,
	TheaterComedy as ScreenIcon,
} from '@mui/icons-material';
import {
	getOwnerShows,
	createShow,
	updateShow,
	deleteShow,
} from '../../services/ownerShowService';
import { getOwnerScreens, getOwnerTheatres } from '../../services/ownerScreenService';
import { getPublicMovies } from '../../services/movie.public.service';
import { toast } from 'react-toastify';

const OwnerShows = () => {
	// Data state
	const [shows, setShows] = useState([]);
	const [screens, setScreens] = useState([]);
	const [theatres, setTheatres] = useState([]);
	const [movies, setMovies] = useState([]);

	// Selection state (store raw IDs like OwnerScreens)
	const [selectedTheatreId, setSelectedTheatreId] = useState(null);
	const [selectedScreenId, setSelectedScreenId] = useState(null);

	// UI state
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingShow, setEditingShow] = useState(null);
	const [submitting, setSubmitting] = useState(false);

	// Form state
	const [formData, setFormData] = useState({
		movieId: '',
		screenId: '',
		startTime: '',
		endTime: '',
	});

	// Fetch shows
	const fetchShows = async () => {
		try {
			const data = await getOwnerShows();
			setShows(Array.isArray(data) ? data : []);
		} catch (err) {
			console.error('Error fetching shows:', err);
			setError(err.message || 'Failed to load shows');
			setShows([]);
		}
	};

	// Fetch screens
	const fetchScreens = async () => {
		try {
			const data = await getOwnerScreens();
			setScreens(Array.isArray(data) ? data : []);
		} catch (err) {
			console.error('Error fetching screens:', err);
			setScreens([]);
		}
	};

	// Fetch theatres
	const fetchTheatres = async (autoSelect = true) => {
		try {
			const theatresList = await getOwnerTheatres();
			setTheatres(Array.isArray(theatresList) ? theatresList : []);

			// Auto-select first theatre if available and none selected
			if (autoSelect && theatresList && theatresList.length > 0) {
				setSelectedTheatreId((currentId) => {
					if (!currentId) {
						const firstTheatre = Array.isArray(theatresList) ? theatresList[0] : theatresList;
						if (firstTheatre && firstTheatre.id) {
							return firstTheatre.id;
						}
					}
					return currentId;
				});
			}
		} catch (err) {
			console.error('Error fetching theatres:', err);
		}
	};

	// Fetch movies from public API
	const fetchMovies = async () => {
		try {
			const data = await getPublicMovies();
			setMovies(Array.isArray(data) ? data : []);
		} catch (err) {
			console.error('Error fetching movies:', err);
			setMovies([]);
		}
	};

	// Fetch all data
	const fetchAllData = async () => {
		setLoading(true);
		setError(null);
		try {
			await Promise.all([
				fetchTheatres(),
				fetchScreens(),
				fetchShows(),
				fetchMovies(),
			]);
		} catch (err) {
			console.error('Error fetching data:', err);
			setError(err.message || 'Failed to load data');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAllData();
		
	}, []);

	// Auto-select first screen when theatre changes
	useEffect(() => {
		if (selectedTheatreId && screens.length > 0) {
			const theatreScreens = screens.filter(
				(screen) =>
					screen.theatreId === selectedTheatreId ||
					screen.theatre?.id === selectedTheatreId
			);
			if (theatreScreens.length > 0) {
				setSelectedScreenId(theatreScreens[0].id);
			} else {
				setSelectedScreenId(null);
			}
		} else {
			setSelectedScreenId(null);
		}
	}, [selectedTheatreId, screens]);

	// Filter screens by selected theatre (same pattern as OwnerScreens)
	const filteredScreens = selectedTheatreId
		? screens.filter(
				(screen) =>
					screen.theatreId === selectedTheatreId ||
					screen.theatre?.id === selectedTheatreId
		  )
		: [];

	// Filter shows by selected screen
	const filteredShows = selectedScreenId
		? shows.filter(
				(show) =>
					show.screenId === selectedScreenId ||
					show.screen?.id === selectedScreenId
		  )
		: [];

	// Handlers
	const handleTheatreChange = (e) => {
		setSelectedTheatreId(e.target.value);
	};

	const handleScreenChange = (e) => {
		setSelectedScreenId(e.target.value);
	};

	const handleOpenDialog = (show = null) => {
		console.log("Opening Dialog with show:", show);
		if (show) {
			setEditingShow(show);
			const formattedStart = show.startTime
				? new Date(show.startTime).toISOString().slice(0, 16)
				: '';
			const formattedEnd = show.endTime
				? new Date(show.endTime).toISOString().slice(0, 16)
				: '';
			setFormData({
				movieId: (show.movieId || show.movie?.id || '').toString(),
				screenId: (show.screenId || show.screen?.id || '').toString(),
				startTime: formattedStart,
				endTime: formattedEnd,
			});
		} else {
			// CREATE mode
			setEditingShow(null);
			setFormData({
				movieId: movies[0].id.toString(),
				screenId: selectedScreenId ? selectedScreenId.toString() : screens[0].id.toString(),
				startTime: '',
				endTime: '',
			});
		}
		setError(null);
		setDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setDialogOpen(false);
		setEditingShow(null);
		setFormData({
			movieId: '',
			screenId: '',
			startTime: '',
			endTime: '',
		});
	};

	const handleSubmit = async () => {
		if (!formData.movieId || !formData.screenId || !formData.startTime || !formData.endTime) {
			setError('All fields are required');
			return;
		}

		setSubmitting(true);
		setError(null);

		try {
			const startTimeISO = new Date(formData.startTime).toISOString();
			const endTimeISO = new Date(formData.endTime).toISOString();

			if (editingShow && editingShow.showId) {
				// UPDATE - showId comes from editingShow, sent in URL
				console.log("Editing Show:", editingShow);
				await updateShow({
					showId: editingShow.showId,
					movieId: formData.movieId,
					screenId: formData.screenId,
					startTime: startTimeISO,
					endTime: endTimeISO,
				});
				toast.success('Show updated successfully!');
			} else {
				// CREATE - no showId
				await createShow({
					movieId: formData.movieId,
					screenId: formData.screenId,
					startTime: startTimeISO,
					endTime: endTimeISO,
				});
				toast.success('Show scheduled successfully!');
			}

			await fetchShows();
			handleCloseDialog();
		} catch (err) {
			console.error('Error saving show:', err);
			const errorMessage = err.message || 'Failed to save show';
			setError(errorMessage);
			toast.error(errorMessage);
		} finally {
			setSubmitting(false);
		}
	};

	const handleDelete = async (showId) => {
		if (!window.confirm('Are you sure you want to delete this show?')) {
			return;
		}

		try {
			console.log(showId);
			await deleteShow(showId);
			toast.success('Show deleted successfully!');
			await fetchShows();
		} catch (err) {
			console.error('Error deleting show:', err);
			setError(err.message || 'Failed to delete show');
			toast.error(err.message || 'Failed to delete show');
		}
	};

	// Helpers
	const formatShowTime = (dateTimeString) => {
		if (!dateTimeString) return 'N/A';
		try {
			const date = new Date(dateTimeString);
			return date.toLocaleString('en-US', {
				weekday: 'short',
				month: 'short',
				day: 'numeric',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
				hour12: true,
			});
		} catch {
			return dateTimeString;
		}
	};

	const getMovieName = (movieId) => {
		const movie = movies.find(
			(m) => m.id === Number(movieId) || m.id === movieId
		);
		return movie?.title || `Movie ${movieId || ''}`;
	};

	const getScreenName = (screenId) => {
		const screen = screens.find(
			(s) => s.id === Number(screenId) || s.id === screenId
		);
		return screen?.name || 'Unknown Screen';
	};

	const canScheduleShow = selectedTheatreId && selectedScreenId && movies.length > 0;

	return (
		<Box sx={{ py: 4 }}>
			<Container maxWidth="lg">
				{/* Header */}
				<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
					<Box>
						<Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
							Manage Shows
						</Typography>
						<Typography color="text.secondary">
							Schedule movies for your screens
						</Typography>
					</Box>
					<Stack direction="row" spacing={2}>
						<Button
							variant="outlined"
							startIcon={<RefreshIcon />}
							onClick={fetchAllData}
							disabled={loading}
							sx={{ textTransform: 'none' }}
						>
							Refresh
						</Button>
						<Button
							variant="contained"
							startIcon={<AddIcon />}
							onClick={() => handleOpenDialog()}
							disabled={!canScheduleShow}
							sx={{ textTransform: 'none' }}
						>
							Schedule Show
						</Button>
					</Stack>
				</Stack>

				{/* Theatre & Screen Selectors */}
				<Paper
					elevation={0}
					sx={{
						p: 2,
						mb: 3,
						borderRadius: 2,
						border: '1px solid',
						borderColor: 'divider',
					}}
				>
					<Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
						{/* Theatre Selector */}
						<Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }}>
							Select Theatre:
						</Typography>
						<FormControl size="small" sx={{ minWidth: 250 }}>
							<InputLabel>Theatre</InputLabel>
							<Select
								value={selectedTheatreId || ''}
								label="Theatre"
								onChange={handleTheatreChange}
							>
								{theatres.map((theatre) => (
									<MenuItem key={theatre.id} value={theatre.id}>
										{theatre.name || `Theatre ${theatre.id}`}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						{/* Screen Selector */}
						<Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }}>
							Select Screen:
						</Typography>
						<FormControl size="small" sx={{ minWidth: 250 }} disabled={!selectedTheatreId}>
							<InputLabel>Screen</InputLabel>
							<Select
								value={selectedScreenId || ''}
								label="Screen"
								onChange={handleScreenChange}
							>
								{filteredScreens.map((screen) => (
									<MenuItem key={screen.id} value={screen.id}>
										{screen.name} ({screen.capacity || 0} seats)
									</MenuItem>
								))}
							</Select>
						</FormControl>

						{selectedScreenId && (
							<Chip
								label={`${filteredShows.length} show(s)`}
								size="small"
								color="primary"
								variant="outlined"
							/>
						)}
					</Stack>
				</Paper>

				{/* Error Alert */}
				{error && (
					<Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
						{error}
					</Alert>
				)}

				{/* Info Alerts */}
				{theatres.length === 0 && !loading && (
					<Alert severity="info" sx={{ mb: 2 }}>
						Please add a theatre first from the Screens page.
					</Alert>
				)}
				{selectedTheatreId && filteredScreens.length === 0 && !loading && (
					<Alert severity="info" sx={{ mb: 2 }}>
						No screens found for this theatre. Please add screens first.
					</Alert>
				)}
				{movies.length === 0 && !loading && (
					<Alert severity="info" sx={{ mb: 2 }}>
						No movies available. Please wait for movies to be approved.
					</Alert>
				)}

				{/* Content Area */}
				{loading ? (
					<Grid container spacing={3}>
						{[1, 2, 3].map((i) => (
							<Grid item xs={12} sm={6} md={4} key={i}>
								<Skeleton height={200} variant="rounded" />
							</Grid>
						))}
					</Grid>
				) : !selectedTheatreId ? (
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
						<ScreenIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
						<Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
							Select a Theatre
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Please select a theatre from the dropdown above to view and manage screens
						</Typography>
					</Paper>
				) : !selectedScreenId ? (
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
						<ScreenIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
						<Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
							Select a Screen
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Please select a screen from the dropdown above to view and manage shows
						</Typography>
					</Paper>
				) : filteredShows.length === 0 ? (
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
						<ShowIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
						<Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
							No Shows Scheduled
						</Typography>
						<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
							Start scheduling shows for this screen
						</Typography>
						<Button
							variant="contained"
							startIcon={<AddIcon />}
							onClick={() => handleOpenDialog()}
							disabled={!canScheduleShow}
							sx={{ textTransform: 'none' }}
						>
							Schedule Your First Show
						</Button>
					</Paper>
				) : (
					<Grid container spacing={3}>
						{filteredShows.map((show) => (
							<Grid item xs={12} sm={6} md={4} key={show.showId}>
								<Card
									elevation={0}
									sx={{
										height: '100%',
										display: 'flex',
										flexDirection: 'column',
										borderRadius: 2,
										border: '1px solid',
										borderColor: 'divider',
									}}
								>
									<CardContent sx={{ flexGrow: 1 }}>
										<Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
											<ShowIcon sx={{ fontSize: 40, color: 'primary.main' }} />
											<Box sx={{ flexGrow: 1 }}>
												<Typography variant="h6" sx={{ fontWeight: 700 }}>
													{getMovieName(show.movieId || show.movie?.id)}
												</Typography>
												<Typography variant="body2" color="text.secondary">
													{getScreenName(show.screenId || show.screen?.id)}
												</Typography>
											</Box>
										</Stack>
										<Stack spacing={1.5}>
											<Box>
												<Typography variant="body2" color="text.secondary">
													Start Time
												</Typography>
												<Typography variant="body1" sx={{ fontWeight: 600 }}>
													{formatShowTime(show.startTime)}
												</Typography>
											</Box>
											<Box>
												<Typography variant="body2" color="text.secondary">
													End Time
												</Typography>
												<Typography variant="body1" sx={{ fontWeight: 600 }}>
													{formatShowTime(show.endTime)}
												</Typography>
											</Box>
										</Stack>
									</CardContent>
									<CardActions sx={{ p: 2, pt: 0 }}>
										<Button
											size="small"
											startIcon={<EditIcon />}
											onClick={() => handleOpenDialog(show)}
											sx={{ textTransform: 'none' }}
										>
											Edit
										</Button>
										<Button
											size="small"
											color="error"
											startIcon={<DeleteIcon />}
											onClick={() => handleDelete(show.showId)}
											sx={{ textTransform: 'none' }}
										>
											Delete
										</Button>
									</CardActions>
								</Card>
							</Grid>
						))}
					</Grid>
				)}

				{/* Add/Edit Dialog */}
				<Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
					<DialogTitle>
						{editingShow ? 'Edit Show' : 'Schedule New Show'}
					</DialogTitle>
					<DialogContent>
						<Stack spacing={3} sx={{ mt: 1 }}>
							{error && (
								<Alert severity="error" onClose={() => setError(null)}>
									{error}
								</Alert>
							)}

							<FormControl fullWidth required>
								<InputLabel>Movie</InputLabel>
								<Select
									value={formData.movieId}
									onChange={(e) => setFormData({ ...formData, movieId: e.target.value })}
									label="Movie"
									disabled={submitting || movies.length === 0}
								>
									{movies.map((movie) => (
										<MenuItem key={movie.id} value={movie.id.toString()}>
											{movie.title}
										</MenuItem>
									))}
								</Select>
							</FormControl>

							<FormControl fullWidth required>
								<InputLabel>Screen</InputLabel>
								<Select
									value={formData.screenId}
									onChange={(e) => setFormData({ ...formData, screenId: e.target.value })}
									label="Screen"
									disabled={submitting}
								>
									{filteredScreens.map((screen) => (
										<MenuItem key={screen.id} value={screen.id.toString()}>
											{screen.name} ({screen.capacity || 0} seats)
										</MenuItem>
									))}
								</Select>
							</FormControl>

							<TextField
								fullWidth
								label="Start Time"
								type="datetime-local"
								value={formData.startTime}
								onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
								InputLabelProps={{ shrink: true }}
								required
								disabled={submitting}
							/>

							<TextField
								fullWidth
								label="End Time"
								type="datetime-local"
								value={formData.endTime}
								onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
								InputLabelProps={{ shrink: true }}
								required
								disabled={submitting}
							/>
						</Stack>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleCloseDialog} disabled={submitting} sx={{ textTransform: 'none' }}>
							Cancel
						</Button>
						<Button
							onClick={handleSubmit}
							variant="contained"
							disabled={submitting}
							startIcon={submitting ? <CircularProgress size={16} /> : null}
							sx={{ textTransform: 'none' }}
						>
							{submitting ? 'Saving...' : editingShow ? 'Update' : 'Schedule'}
						</Button>
					</DialogActions>
				</Dialog>
			</Container>
		</Box>
	);
};

export default OwnerShows;
