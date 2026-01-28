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
	IconButton,
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
	Movie as MovieIcon,
	TheaterComedy as ScreenIcon,
} from '@mui/icons-material';
import {
	getOwnerShows,
	createShow,
	updateShow,
	deleteShow,
} from '../../services/ownerShowService';
import { getOwnerScreens } from '../../services/ownerScreenService';

const OwnerShows = () => {
	const [shows, setShows] = useState([]);
	const [screens, setScreens] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingShow, setEditingShow] = useState(null);
	const [formData, setFormData] = useState({
		movieId: '',
		screenId: '',
		startTime: '',
		endTime: '',
	});
	const [submitting, setSubmitting] = useState(false);

	const fetchData = async () => {
		setLoading(true);
		setError(null);
		try {
			const [showsData, screensData] = await Promise.all([
				getOwnerShows(),
				getOwnerScreens(),
			]);
			setShows(Array.isArray(showsData) ? showsData : []);
			setScreens(Array.isArray(screensData) ? screensData : []);
		} catch (err) {
			console.error('Error fetching data:', err);
			setError(err.message || 'Failed to load data');
			setShows([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handleOpenDialog = (show = null) => {
		if (show) {
			setEditingShow(show);
			const formattedStart = show.startTime ? new Date(show.startTime).toISOString().slice(0, 16) : '';
			const formattedEnd = show.endTime ? new Date(show.endTime).toISOString().slice(0, 16) : '';
			setFormData({
				movieId: show.movieId?.toString() || show.movie?.id?.toString() || '',
				screenId: show.screenId?.toString() || show.screen?.id?.toString() || '',
				startTime: formattedStart,
				endTime: formattedEnd,
			});
		} else {
			setEditingShow(null);
			setFormData({
				movieId: '',
				screenId: '',
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
			
			const payload = {
				movieId: formData.movieId,
				screenId: formData.screenId,
				startTime: startTimeISO,
				endTime: endTimeISO,
			};

			if (editingShow) {
				await updateShow({
					showId: editingShow.id,
					...payload,
				});
			} else {
				await createShow(payload);
			}
			
			await fetchData();
			setSubmitting(false);
			handleCloseDialog();
		} catch (err) {
			console.error('Error saving show:', err);
			setError(err.message || 'Failed to save show');
			setSubmitting(false);
		}
	};

	const handleDelete = async (showId) => {
		if (!window.confirm('Are you sure you want to delete this show?')) {
			return;
		}

		try {
			await deleteShow(showId);
			await fetchData();
		} catch (err) {
			console.error('Error deleting show:', err);
			setError(err.message || 'Failed to delete show');
		}
	};

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
		return movieId ? `Movie ${movieId}` : 'Unknown Movie';
	};

	const getScreenName = (screenId) => {
		const screen = screens.find((s) => s.id === Number(screenId) || s.id === screenId);
		return screen?.name || 'Unknown Screen';
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
							onClick={fetchData}
							disabled={loading}
							sx={{ textTransform: 'none' }}
						>
							Refresh
						</Button>
						<Button
							variant="contained"
							startIcon={<AddIcon />}
							onClick={() => handleOpenDialog()}
							disabled={screens.length === 0}
							sx={{ textTransform: 'none' }}
						>
							Schedule Show
						</Button>
					</Stack>
				</Stack>

				{/* Error Alert */}
				{error && (
					<Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
						{error}
					</Alert>
				)}

				{/* Info Alert */}
				{screens.length === 0 && (
					<Alert severity="info" sx={{ mb: 3 }}>
						Please add screens before scheduling shows.
					</Alert>
				)}

				{/* Shows Grid */}
				{loading ? (
					<Grid container spacing={3}>
						{[1, 2, 3].map((i) => (
							<Grid item xs={12} sm={6} md={4} key={i}>
								<Skeleton height={200} variant="rounded" />
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
						<ShowIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
						<Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
							No Shows Scheduled
						</Typography>
						<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
							Start scheduling shows for your movies and screens
						</Typography>
						<Button
							variant="contained"
							startIcon={<AddIcon />}
							onClick={() => handleOpenDialog()}
							disabled={screens.length === 0}
							sx={{ textTransform: 'none' }}
						>
							Schedule Your First Show
						</Button>
					</Paper>
				) : (
					<Grid container spacing={3}>
						{shows.map((show) => (
							<Grid item xs={12} sm={6} md={4} key={show.id}>
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
											onClick={() => handleDelete(show.id)}
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
				<Dialog
					open={dialogOpen}
					onClose={handleCloseDialog}
					maxWidth="sm"
					fullWidth
				>
					<DialogTitle>
						{editingShow ? 'Edit Show' : 'Schedule New Show'}
					</DialogTitle>
					<DialogContent>
						<Stack spacing={3} sx={{ mt: 1 }}>
							<TextField
								fullWidth
								label="Movie ID"
								value={formData.movieId}
								onChange={(e) => setFormData({ ...formData, movieId: e.target.value })}
								required
								disabled={submitting}
							/>

							<FormControl fullWidth required>
								<InputLabel>Screen</InputLabel>
								<Select
									value={formData.screenId}
									onChange={(e) => setFormData({ ...formData, screenId: e.target.value })}
									label="Screen"
									disabled={submitting}
								>
									{screens.map((screen) => (
										<MenuItem key={screen.id} value={screen.id.toString()}>
											{screen.name} ({screen.capacity} seats)
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
								InputLabelProps={{
									shrink: true,
								}}
								required
								disabled={submitting}
							/>

							<TextField
								fullWidth
								label="End Time"
								type="datetime-local"
								value={formData.endTime}
								onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
								InputLabelProps={{
									shrink: true,
								}}
								required
								disabled={submitting}
							/>
						</Stack>
					</DialogContent>
					<DialogActions>
						<Button
							onClick={handleCloseDialog}
							disabled={submitting}
							sx={{ textTransform: 'none' }}
						>
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
