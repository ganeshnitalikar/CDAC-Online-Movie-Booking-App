import React, { useEffect, useState, useMemo, useCallback } from 'react';
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
import { toast } from 'react-toastify';

// Services
import {
	getOwnerShows,
	createShow,
	updateShow,
	deleteShow,
} from '../../services/ownerShowService';
import { getOwnerScreens, getOwnerTheatres } from '../../services/ownerScreenService';
import { getPublicMovies } from '../../services/movie.public.service';

// Constants
const INITIAL_FORM_STATE = {
	movieId: '',
	screenId: '',
	startTime: '',
	endTime: '',
};

// Helper functions
const formatShowTime = (dateTimeString) => {
	if (!dateTimeString) return 'N/A';
	try {
		return new Date(dateTimeString).toLocaleString('en-US', {
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

const formatDateTimeLocal = (dateString) => {
	if (!dateString) return '';
	try {
		return new Date(dateString).toISOString().slice(0, 16);
	} catch {
		return '';
	}
};

const getEntityId = (entity, idField = 'id') => {
	return entity?.[idField] || entity?.id || null;
};

// Reusable Empty State Component
const EmptyState = ({ icon: Icon, title, description, action }) => (
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
		<Icon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
		<Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
			{title}
		</Typography>
		<Typography variant="body2" color="text.secondary" sx={{ mb: action ? 3 : 0 }}>
			{description}
		</Typography>
		{action}
	</Paper>
);

// Show Card Component
const ShowCard = ({ show, movieName, screenName, onEdit, onDelete }) => (
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
						{movieName}
					</Typography>
					<Typography variant="body2" color="text.secondary">
						{screenName}
					</Typography>
				</Box>
			</Stack>
			<Stack spacing={1.5}>
				<Box>
					<Typography variant="body2" color="text.secondary">Start Time</Typography>
					<Typography variant="body1" sx={{ fontWeight: 600 }}>
						{formatShowTime(show.startTime)}
					</Typography>
				</Box>
				<Box>
					<Typography variant="body2" color="text.secondary">End Time</Typography>
					<Typography variant="body1" sx={{ fontWeight: 600 }}>
						{formatShowTime(show.endTime)}
					</Typography>
				</Box>
			</Stack>
		</CardContent>
		<CardActions sx={{ p: 2, pt: 0 }}>
			<Button size="small" startIcon={<EditIcon />} onClick={onEdit} sx={{ textTransform: 'none' }}>
				Edit
			</Button>
			<Button size="small" color="error" startIcon={<DeleteIcon />} onClick={onDelete} sx={{ textTransform: 'none' }}>
				Delete
			</Button>
		</CardActions>
	</Card>
);

const OwnerShows = () => {
	// Data state
	const [shows, setShows] = useState([]);
	const [screens, setScreens] = useState([]);
	const [theatres, setTheatres] = useState([]);
	const [movies, setMovies] = useState([]);

	// Selection state
	const [selectedTheatreId, setSelectedTheatreId] = useState(null);
	const [selectedScreenId, setSelectedScreenId] = useState(null);

	// UI state
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingShow, setEditingShow] = useState(null);
	const [submitting, setSubmitting] = useState(false);

	// Form state
	const [formData, setFormData] = useState(INITIAL_FORM_STATE);

	// Memoized filtered data
	const filteredScreens = useMemo(() => {
		if (!selectedTheatreId) return [];
		return screens.filter((screen) => {
			const theatreId = getEntityId(screen, 'theatreId') || getEntityId(screen.theatre);
			return theatreId === selectedTheatreId;
		});
	}, [selectedTheatreId, screens]);

	const filteredShows = useMemo(() => {
		if (!selectedScreenId) return [];
		return shows.filter((show) => {
			const screenId = getEntityId(show, 'screenId') || getEntityId(show.screen);
			return screenId === selectedScreenId;
		});
	}, [selectedScreenId, shows]);

	// Lookup helpers
	const getMovieName = useCallback((movieId) => {
		const movie = movies.find((m) => m.id === Number(movieId) || m.id === movieId);
		return movie?.title || `Movie ${movieId || ''}`;
	}, [movies]);

	const getScreenName = useCallback((screenId) => {
		const screen = screens.find((s) => s.id === Number(screenId) || s.id === screenId);
		return screen?.name || 'Unknown Screen';
	}, [screens]);

	// API calls
	const fetchAllData = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const [theatresData, screensData, showsData, moviesData] = await Promise.all([
				getOwnerTheatres(),
				getOwnerScreens(),
				getOwnerShows(),
				getPublicMovies(),
			]);

			const theatresList = Array.isArray(theatresData) ? theatresData : [];
			setTheatres(theatresList);
			setScreens(Array.isArray(screensData) ? screensData : []);
			setShows(Array.isArray(showsData) ? showsData : []);
			setMovies(Array.isArray(moviesData) ? moviesData : []);

			// Auto-select first theatre if none selected
			if (theatresList.length > 0 && !selectedTheatreId) {
				setSelectedTheatreId(theatresList[0].id);
			}
		} catch (err) {
			console.error('Error fetching data:', err);
			setError(err.message || 'Failed to load data');
		} finally {
			setLoading(false);
		}
	}, [selectedTheatreId]);

	const refreshShows = useCallback(async () => {
		try {
			const data = await getOwnerShows();
			setShows(Array.isArray(data) ? data : []);
		} catch (err) {
			console.error('Error refreshing shows:', err);
		}
	}, []);

	// Auto-select first screen when theatre changes
	useEffect(() => {
		if (filteredScreens.length > 0) {
			setSelectedScreenId(filteredScreens[0].id);
		} else {
			setSelectedScreenId(null);
		}
	}, [selectedTheatreId, filteredScreens.length]);

	// Initial data fetch
	useEffect(() => {
		fetchAllData();
	}, []);

	// Form handlers
	const updateFormField = useCallback((field, value) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	}, []);

	const openDialog = useCallback((show = null) => {
		if (show) {
			// Edit mode
			setEditingShow(show);
			setFormData({
				movieId: String(getEntityId(show, 'movieId') || getEntityId(show.movie) || ''),
				screenId: String(getEntityId(show, 'screenId') || getEntityId(show.screen) || ''),
				startTime: formatDateTimeLocal(show.startTime),
				endTime: formatDateTimeLocal(show.endTime),
			});
		} else {
			// Create mode
			setEditingShow(null);
			setFormData({
				movieId: movies.length > 0 ? String(movies[0].id) : '',
				screenId: selectedScreenId ? String(selectedScreenId) : '',
				startTime: '',
				endTime: '',
			});
		}
		setError(null);
		setDialogOpen(true);
	}, [movies, selectedScreenId]);

	const closeDialog = useCallback(() => {
		setDialogOpen(false);
		setEditingShow(null);
		setFormData(INITIAL_FORM_STATE);
		setError(null);
	}, []);

	const handleSubmit = useCallback(async () => {
		// Validation
		const { movieId, screenId, startTime, endTime } = formData;

		if (!movieId) {
			setError('Please select a movie');
			return;
		}
		if (!screenId) {
			setError('Please select a screen');
			return;
		}
		if (!startTime || !endTime) {
			setError('Start time and end time are required');
			return;
		}

		setSubmitting(true);
		setError(null);

		try {
			const payload = {
				movieId: parseInt(movieId, 10),
				screenId: parseInt(screenId, 10),
				startTime: new Date(startTime).toISOString(),
				endTime: new Date(endTime).toISOString(),
			};

			if (editingShow?.id) {
				await updateShow({ showId: editingShow.id, ...payload });
				toast.success('Show updated successfully!');
			} else {
				await createShow(payload);
				toast.success('Show scheduled successfully!');
			}

			await refreshShows();
			closeDialog();
		} catch (err) {
			const errorMsg = err.message || 'Failed to save show';
			setError(errorMsg);
			toast.error(errorMsg);
		} finally {
			setSubmitting(false);
		}
	}, [formData, editingShow, refreshShows, closeDialog]);

	const handleDelete = useCallback(async (showId) => {
		if (!window.confirm('Are you sure you want to delete this show?')) return;

		try {
			await deleteShow(showId);
			toast.success('Show deleted successfully!');
			await refreshShows();
		} catch (err) {
			const errorMsg = err.message || 'Failed to delete show';
			setError(errorMsg);
			toast.error(errorMsg);
		}
	}, [refreshShows]);

	// Derived state
	const canScheduleShow = selectedTheatreId && selectedScreenId && movies.length > 0;

	// Render helpers
	const renderContent = () => {
		if (loading) {
			return (
				<Grid container spacing={3}>
					{[1, 2, 3].map((i) => (
						<Grid item xs={12} sm={6} md={4} key={i}>
							<Skeleton height={200} variant="rounded" />
						</Grid>
					))}
				</Grid>
			);
		}

		if (!selectedTheatreId) {
			return (
				<EmptyState
					icon={ScreenIcon}
					title="Select a Theatre"
					description="Please select a theatre from the dropdown above to view and manage screens"
				/>
			);
		}

		if (!selectedScreenId) {
			return (
				<EmptyState
					icon={ScreenIcon}
					title="Select a Screen"
					description="Please select a screen from the dropdown above to view and manage shows"
				/>
			);
		}

		if (filteredShows.length === 0) {
			return (
				<EmptyState
					icon={ShowIcon}
					title="No Shows Scheduled"
					description="Start scheduling shows for this screen"
					action={
						<Button
							variant="contained"
							startIcon={<AddIcon />}
							onClick={() => openDialog()}
							disabled={!canScheduleShow}
							sx={{ textTransform: 'none' }}
						>
							Schedule Your First Show
						</Button>
					}
				/>
			);
		}

		return (
			<Grid container spacing={3}>
				{filteredShows.map((show) => (
					<Grid item xs={12} sm={6} md={4} key={show.id}>
						<ShowCard
							show={show}
							movieName={getMovieName(getEntityId(show, 'movieId') || getEntityId(show.movie))}
							screenName={getScreenName(getEntityId(show, 'screenId') || getEntityId(show.screen))}
							onEdit={() => openDialog(show)}
							onDelete={() => handleDelete(show.id)}
						/>
					</Grid>
				))}
			</Grid>
		);
	};

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
							onClick={() => openDialog()}
							disabled={!canScheduleShow}
							sx={{ textTransform: 'none' }}
						>
							Schedule Show
						</Button>
					</Stack>
				</Stack>

				{/* Theatre & Screen Selectors */}
				<Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
					<Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
						<Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }}>
							Select Theatre:
						</Typography>
						<FormControl size="small" sx={{ minWidth: 250 }}>
							<InputLabel>Theatre</InputLabel>
							<Select
								value={selectedTheatreId || ''}
								label="Theatre"
								onChange={(e) => setSelectedTheatreId(e.target.value)}
							>
								{theatres.map((theatre) => (
									<MenuItem key={theatre.id} value={theatre.id}>
										{theatre.name || `Theatre ${theatre.id}`}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						<Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }}>
							Select Screen:
						</Typography>
						<FormControl size="small" sx={{ minWidth: 250 }} disabled={!selectedTheatreId}>
							<InputLabel>Screen</InputLabel>
							<Select
								value={selectedScreenId || ''}
								label="Screen"
								onChange={(e) => setSelectedScreenId(e.target.value)}
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

				{/* Alerts */}
				{error && (
					<Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
						{error}
					</Alert>
				)}
				{!loading && theatres.length === 0 && (
					<Alert severity="info" sx={{ mb: 2 }}>
						Please add a theatre first from the Screens page.
					</Alert>
				)}
				{!loading && selectedTheatreId && filteredScreens.length === 0 && (
					<Alert severity="info" sx={{ mb: 2 }}>
						No screens found for this theatre. Please add screens first.
					</Alert>
				)}
				{!loading && movies.length === 0 && (
					<Alert severity="info" sx={{ mb: 2 }}>
						No movies available. Please wait for movies to be approved.
					</Alert>
				)}

				{/* Content */}
				{renderContent()}

				{/* Add/Edit Dialog */}
				<Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
					<DialogTitle>{editingShow ? 'Edit Show' : 'Schedule New Show'}</DialogTitle>
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
									onChange={(e) => updateFormField('movieId', e.target.value)}
									label="Movie"
									disabled={submitting || movies.length === 0}
								>
									{movies.map((movie) => (
										<MenuItem key={movie.id} value={String(movie.id)}>
											{movie.title}
										</MenuItem>
									))}
								</Select>
							</FormControl>

							<FormControl fullWidth required>
								<InputLabel>Screen</InputLabel>
								<Select
									value={formData.screenId}
									onChange={(e) => updateFormField('screenId', e.target.value)}
									label="Screen"
									disabled={submitting}
								>
									{filteredScreens.map((screen) => (
										<MenuItem key={screen.id} value={String(screen.id)}>
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
								onChange={(e) => updateFormField('startTime', e.target.value)}
								InputLabelProps={{ shrink: true }}
								required
								disabled={submitting}
							/>

							<TextField
								fullWidth
								label="End Time"
								type="datetime-local"
								value={formData.endTime}
								onChange={(e) => updateFormField('endTime', e.target.value)}
								InputLabelProps={{ shrink: true }}
								required
								disabled={submitting}
							/>
						</Stack>
					</DialogContent>
					<DialogActions>
						<Button onClick={closeDialog} disabled={submitting} sx={{ textTransform: 'none' }}>
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
