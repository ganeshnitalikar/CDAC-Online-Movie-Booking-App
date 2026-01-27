import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
	Box,
	Container,
	Typography,
	Paper,
	TextField,
	Button,
	Stack,
	Grid,
	Alert,
	CircularProgress,
	MenuItem,
	FormControl,
	InputLabel,
	Select,
	Chip,
	IconButton,
	Skeleton,
} from '@mui/material';
import {
	ArrowBack as ArrowBackIcon,
	Delete as DeleteIcon,
} from '@mui/icons-material';
import {
	createMovie,
	updateMovie,
	deleteMovie,
	getOwnerMovieById,
} from '../../services/movie.owner.service';

const GENRES = [
	'Action',
	'Adventure',
	'Comedy',
	'Drama',
	'Horror',
	'Sci-Fi',
	'Thriller',
	'Romance',
	'Fantasy',
	'Animation',
	'Documentary',
	'Crime',
	'Mystery',
	'Family',
];

const CERTIFICATES = ['U', 'U/A', 'A', 'S'];

const OwnerMovieFormPage = () => {
	const navigate = useNavigate();
	const { movieId } = useParams();
	const isEditMode = !!movieId;

	const [formData, setFormData] = useState({
		title: '',
		description: '',
		genre: [],
		releaseDate: '',
		durationMinutes: '',
		language: '',
		certificate: '',
		posterUrl: '',
		backdropUrl: '',
		rating: '',
	});

	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [deleting, setDeleting] = useState(false);

	// Load movie data if in edit mode
	useEffect(() => {
		const fetchMovieData = async () => {
			if (!isEditMode || !movieId) return;

			setLoading(true);
			setError(null);
			try {
				const movie = await getOwnerMovieById(movieId);
				setFormData({
					title: movie.title || '',
					description: movie.description || movie.overview || '',
					genre: Array.isArray(movie.genre) ? movie.genre : [],
					releaseDate: movie.releaseDate ? movie.releaseDate.split('T')[0] : '',
					durationMinutes: movie.durationMinutes || movie.durationMins || '',
					language: movie.language || '',
					certificate: movie.certificate || '',
					posterUrl: movie.posterUrl || '',
					backdropUrl: movie.backdropUrl || '',
					rating: movie.rating || '',
				});
			} catch (err) {
				console.error('Error fetching movie:', err);
				setError(err.message || 'Failed to load movie data');
			} finally {
				setLoading(false);
			}
		};

		fetchMovieData();
	}, [isEditMode, movieId]);

	const handleChange = (field) => (event) => {
		const value = event.target.value;
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
		setError(null);
		setSuccess(null);
	};

	const handleGenreChange = (event) => {
		const value = event.target.value;
		setFormData((prev) => ({
			...prev,
			genre: typeof value === 'string' ? value.split(',') : value,
		}));
	};

	const handleRemoveGenre = (genreToRemove) => {
		setFormData((prev) => ({
			...prev,
			genre: prev.genre.filter((g) => g !== genreToRemove),
		}));
	};

	const validateForm = () => {
		if (!formData.title?.trim()) {
			setError('Title is required');
			return false;
		}
		if (formData.title.trim().length < 2 || formData.title.trim().length > 100) {
			setError('Title must be between 2 and 100 characters');
			return false;
		}
		if (!formData.description?.trim()) {
			setError('Description is required');
			return false;
		}
		if (formData.description.trim().length < 10 || formData.description.trim().length > 1000) {
			setError('Description must be between 10 and 1000 characters');
			return false;
		}
		if (!formData.genre || formData.genre.length === 0) {
			setError('At least one genre is required');
			return false;
		}
		if (!formData.releaseDate) {
			setError('Release date is required');
			return false;
		}
		// Check if release date is not in the future
		const releaseDate = new Date(formData.releaseDate);
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		// if (releaseDate < today) {
		// 	setError('Release date cannot be in the Past');
		// 	return false;
		// }
		if (!formData.durationMinutes || formData.durationMinutes <= 0) {
			setError('Duration must be at least 1 minute');
			return false;
		}
		if (!formData.language?.trim()) {
			setError('Language is required');
			return false;
		}
		if (!formData.certificate) {
			setError('Certificate is required');
			return false;
		}
		if (!formData.posterUrl?.trim()) {
			setError('Poster URL is required');
			return false;
		}
		return true;
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setError(null);
		setSuccess(null);

		if (!validateForm()) {
			return;
		}

		setSubmitting(true);

		try {
			const payload = {
				title: formData.title.trim(),
				description: formData.description.trim(),
				genre: formData.genre,
				releaseDate: formData.releaseDate, // Format: YYYY-MM-DD (ISO date format)
				durationMinutes: parseInt(formData.durationMinutes, 10),
				language: formData.language.trim(),
				certificate: formData.certificate,
				posterUrl: formData.posterUrl.trim(),
				backdropUrl: formData.backdropUrl?.trim() || null,
			};

			// Add rating if provided (optional field)
			if (formData.rating) {
				const ratingValue = parseFloat(formData.rating);
				if (ratingValue >= 0 && ratingValue <= 10) {
					payload.rating = ratingValue;
				}
			}

			let result;
			if (isEditMode) {
				result = await updateMovie(movieId, payload);
				setSuccess('Movie updated successfully!');
			} else {
				result = await createMovie(payload);
				setSuccess('Movie created successfully!');
			}

			// Redirect after a short delay
			setTimeout(() => {
				navigate('/owner/movies');
			}, 1500);
		} catch (err) {
			console.error('Error saving movie:', err);
			setError(err.message || 'Failed to save movie. Please try again.');
		} finally {
			setSubmitting(false);
		}
	};

	const handleDelete = async () => {
		if (!movieId) return;

		setDeleting(true);
		setError(null);

		try {
			await deleteMovie(movieId);
			setSuccess('Movie deleted successfully!');
			setTimeout(() => {
				navigate('/owner/movies');
			}, 1500);
		} catch (err) {
			console.error('Error deleting movie:', err);
			setError(err.message || 'Failed to delete movie. Please try again.');
		} finally {
			setDeleting(false);
			setDeleteDialogOpen(false);
		}
	};

	// Show loading skeleton when fetching movie data
	if (loading && isEditMode) {
		return (
			<Box sx={{ py: 4 }}>
				<Container maxWidth="md">
					<Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
						<IconButton onClick={() => navigate(-1)}>
							<ArrowBackIcon />
						</IconButton>
						<Box>
							<Skeleton width={200} height={40} />
							<Skeleton width={300} height={24} />
						</Box>
					</Stack>
					<Paper
						elevation={0}
						sx={{
							p: 4,
							borderRadius: 3,
							border: '1px solid',
							borderColor: 'divider',
						}}
					>
						<Grid container spacing={3}>
							{Array.from({ length: 8 }).map((_, i) => (
								<Grid item xs={12} md={i < 2 ? 12 : 6} key={i}>
									<Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
								</Grid>
							))}
						</Grid>
					</Paper>
				</Container>
			</Box>
		);
	}

	return (
		<Box sx={{ py: 4 }}>
			<Container maxWidth="md">
				{/* Header */}
				<Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
					<IconButton onClick={() => navigate(-1)}>
						<ArrowBackIcon />
					</IconButton>
					<Box>
						<Typography variant="h4" sx={{ fontWeight: 800 }}>
							{isEditMode ? 'Edit Movie' : 'Create New Movie'}
						</Typography>
						<Typography color="text.secondary">
							{isEditMode
								? 'Update movie information'
								: 'Add a new movie to the platform'}
						</Typography>
					</Box>
				</Stack>

				{/* Alerts */}
				{error && (
					<Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
						{error}
					</Alert>
				)}
				{success && (
					<Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
						{success}
					</Alert>
				)}

				{/* Form */}
				<Paper
					elevation={0}
					sx={{
						p: 4,
						borderRadius: 3,
						border: '1px solid',
						borderColor: 'divider',
					}}
				>
					<form onSubmit={handleSubmit}>
						<Grid container spacing={3}>
							{/* Title */}
							<Grid item xs={12}>
								<TextField
									fullWidth
									label="Movie Title"
									value={formData.title}
									onChange={handleChange('title')}
									required
									disabled={submitting}
									helperText="Must be between 2 and 100 characters"
								/>
							</Grid>

							{/* Description */}
							<Grid item xs={12}>
								<TextField
									fullWidth
									multiline
									rows={4}
									label="Description / Synopsis"
									value={formData.description}
									onChange={handleChange('description')}
									required
									disabled={submitting}
									helperText="Must be between 10 and 1000 characters"
								/>
							</Grid>

							{/* Genre */}
							<Grid item xs={12} md={6}>
								<FormControl fullWidth>
									<InputLabel>Genre</InputLabel>
									<Select
										multiple
										value={formData.genre}
										onChange={handleGenreChange}
										label="Genre"
										renderValue={(selected) => (
											<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
												{selected.map((value) => (
													<Chip key={value} label={value} size="small" />
												))}
											</Box>
										)}
										disabled={submitting}
									>
										{GENRES.map((genre) => (
											<MenuItem key={genre} value={genre}>
												{genre}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>

							{/* Release Date */}
							<Grid item xs={12} md={6}>
								<TextField
									fullWidth
									label="Release Date"
									type="date"
									value={formData.releaseDate}
									onChange={handleChange('releaseDate')}
									InputLabelProps={{
										shrink: true,
									}}
									required
									disabled={submitting}
								/>
							</Grid>

							{/* Duration */}
							<Grid item xs={12} md={4}>
								<TextField
									fullWidth
									label="Duration (minutes)"
									type="number"
									value={formData.durationMinutes}
									onChange={handleChange('durationMinutes')}
									required
									inputProps={{ min: 1 }}
									disabled={submitting}
									helperText="Must be at least 1 minute"
								/>
							</Grid>

							{/* Language */}
							<Grid item xs={12} md={4}>
								<TextField
									fullWidth
									label="Language"
									value={formData.language}
									onChange={handleChange('language')}
									required
									disabled={submitting}
								/>
							</Grid>

							{/* Certificate */}
							<Grid item xs={12} md={4}>
								<FormControl fullWidth required>
									<InputLabel>Certificate</InputLabel>
									<Select
										value={formData.certificate}
										onChange={handleChange('certificate')}
										label="Certificate"
										disabled={submitting}
									>
										{CERTIFICATES.map((cert) => (
											<MenuItem key={cert} value={cert}>
												{cert}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>

							{/* Rating (Optional) */}
							<Grid item xs={12} md={6}>
								<TextField
									fullWidth
									label="Rating (Optional)"
									type="number"
									value={formData.rating}
									onChange={handleChange('rating')}
									inputProps={{ min: 0, max: 10, step: 0.1 }}
									disabled={submitting}
									helperText="Rating out of 10"
								/>
							</Grid>

							{/* Poster URL */}
							<Grid item xs={12} md={6}>
								<TextField
									fullWidth
									label="Poster Image URL"
									value={formData.posterUrl}
									onChange={handleChange('posterUrl')}
									required
									disabled={submitting}
									helperText="URL for movie poster image (required)"
								/>
							</Grid>

							{/* Backdrop URL */}
							<Grid item xs={12}>
								<TextField
									fullWidth
									label="Backdrop Image URL"
									value={formData.backdropUrl}
									onChange={handleChange('backdropUrl')}
									disabled={submitting}
									helperText="URL for movie backdrop/hero image"
								/>
							</Grid>

							{/* Actions */}
							<Grid item xs={12}>
								<Stack direction="row" spacing={2} justifyContent="space-between">
									{isEditMode && (
										<Button
											variant="outlined"
											color="error"
											startIcon={<DeleteIcon />}
											onClick={() => setDeleteDialogOpen(true)}
											disabled={submitting || deleting}
											sx={{ textTransform: 'none' }}
										>
											Delete Movie
										</Button>
									)}
									<Stack direction="row" spacing={2} sx={{ ml: 'auto' }}>
										<Button
											variant="outlined"
											onClick={() => navigate(-1)}
											disabled={submitting}
											sx={{ textTransform: 'none' }}
										>
											Cancel
										</Button>
										<Button
											type="submit"
											variant="contained"
											disabled={submitting}
											startIcon={submitting ? <CircularProgress size={16} /> : null}
											sx={{ textTransform: 'none' }}
										>
											{submitting
												? 'Saving...'
												: isEditMode
												? 'Update Movie'
												: 'Create Movie'}
										</Button>
									</Stack>
								</Stack>
							</Grid>
						</Grid>
					</form>
				</Paper>

				{/* Delete Confirmation Dialog */}
				{deleteDialogOpen && (
					<Paper
						elevation={3}
						sx={{
							position: 'fixed',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
							p: 4,
							borderRadius: 2,
							minWidth: 300,
							zIndex: 1300,
						}}
					>
						<Typography variant="h6" sx={{ mb: 2 }}>
							Delete Movie?
						</Typography>
						<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
							Are you sure you want to delete this movie? This action cannot be undone.
						</Typography>
						<Stack direction="row" spacing={2} justifyContent="flex-end">
							<Button
								onClick={() => setDeleteDialogOpen(false)}
								disabled={deleting}
								sx={{ textTransform: 'none' }}
							>
								Cancel
							</Button>
							<Button
								variant="contained"
								color="error"
								onClick={handleDelete}
								disabled={deleting}
								startIcon={deleting ? <CircularProgress size={16} /> : null}
								sx={{ textTransform: 'none' }}
							>
								{deleting ? 'Deleting...' : 'Delete'}
							</Button>
						</Stack>
					</Paper>
				)}
			</Container>
		</Box>
	);
};

export default OwnerMovieFormPage;
