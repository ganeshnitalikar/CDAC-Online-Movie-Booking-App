import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Box,
	Container,
	Typography,
	Grid,
	Card,
	CardMedia,
	CardContent,
	CardActions,
	Button,
	Stack,
	Chip,
	Alert,
	Skeleton,
	IconButton,
	Paper,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	CircularProgress,
} from '@mui/material';
import {
	Add as AddIcon,
	Edit as EditIcon,
	Delete as DeleteIcon,
	Refresh as RefreshIcon,
	Movie as MovieIcon,
} from '@mui/icons-material';
import { getOwnerMovies, deleteMovie } from '../../services/movie.owner.service';

const OwnerMoviesPage = () => {
	const navigate = useNavigate();
	const [movies, setMovies] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedMovie, setSelectedMovie] = useState(null);
	const [deleting, setDeleting] = useState(false);

	const fetchMovies = async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await getOwnerMovies();
			setMovies(Array.isArray(data) ? data : []);
		} catch (err) {
			console.error('Error fetching movies:', err);
			setError(err.message || 'Failed to load your movies');
			setMovies([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchMovies();
	}, []);

	const handleEdit = (movieId) => {
		navigate(`/owner/movies/${movieId}/edit`);
	};

	const handleOpenDeleteDialog = (movie) => {
		setSelectedMovie(movie);
		setDeleteDialogOpen(true);
	};

	const handleCloseDeleteDialog = () => {
		setDeleteDialogOpen(false);
		setSelectedMovie(null);
	};

	const handleDelete = async () => {
		if (!selectedMovie) return;

		setDeleting(true);
		try {
			await deleteMovie(selectedMovie.id);
			setMovies((prev) => prev.filter((m) => m.id !== selectedMovie.id));
			handleCloseDeleteDialog();
		} catch (err) {
			console.error('Error deleting movie:', err);
			setError(err.message || 'Failed to delete movie');
		} finally {
			setDeleting(false);
		}
	};

	const getStatusChip = (movie) => {
		if (movie.approved === true) {
			return <Chip label="Approved" color="success" size="small" />;
		} else if (movie.approved === false) {
			return <Chip label="Rejected" color="error" size="small" />;
		} else {
			return <Chip label="Pending Approval" color="warning" size="small" />;
		}
	};

	const MovieCard = ({ movie }) => (
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
			<CardMedia
				component="img"
				image={movie.posterUrl || '/placeholder-poster.jpg'}
				alt={movie.title}
				sx={{
					height: 280,
					objectFit: 'cover',
				}}
			/>
			<CardContent sx={{ flexGrow: 1 }}>
				<Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
					<Typography variant="h6" sx={{ fontWeight: 700, flex: 1 }} noWrap>
						{movie.title}
					</Typography>
				</Stack>
				<Box sx={{ mb: 2 }}>
					{getStatusChip(movie)}
				</Box>
				<Typography
					variant="body2"
					color="text.secondary"
					sx={{
						mb: 2,
						minHeight: 40,
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						display: '-webkit-box',
						WebkitLineClamp: 2,
						WebkitBoxOrient: 'vertical',
					}}
				>
					{movie.description || movie.overview || 'No description available'}
				</Typography>
				<Stack direction="row" spacing={1} sx={{ mb: 1 }} flexWrap="wrap" gap={0.5}>
					{Array.isArray(movie.genre)
						? movie.genre.slice(0, 3).map((g) => (
								<Chip key={g} label={g} size="small" variant="outlined" />
						  ))
						: movie.genre && <Chip label={movie.genre} size="small" variant="outlined" />}
				</Stack>
				<Stack spacing={0.5}>
					<Typography variant="caption" color="text.secondary">
						Duration: {movie.durationMinutes || movie.durationMins || 'N/A'} mins
					</Typography>
					{movie.releaseDate && (
						<Typography variant="caption" color="text.secondary">
							Release: {new Date(movie.releaseDate).toLocaleDateString()}
						</Typography>
					)}
					{movie.language && (
						<Typography variant="caption" color="text.secondary">
							Language: {movie.language}
						</Typography>
					)}
				</Stack>
			</CardContent>
			<CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
				<Button
					fullWidth
					variant="contained"
					color="primary"
					startIcon={<EditIcon />}
					onClick={() => handleEdit(movie.id)}
					sx={{ textTransform: 'none' }}
				>
					Edit
				</Button>
				<Button
					fullWidth
					variant="outlined"
					color="error"
					startIcon={<DeleteIcon />}
					onClick={() => handleOpenDeleteDialog(movie)}
					sx={{ textTransform: 'none' }}
				>
					Delete
				</Button>
			</CardActions>
		</Card>
	);

	return (
		<Box sx={{ py: 4 }}>
			<Container maxWidth="lg">
				{/* Header */}
				<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
					<Box>
						<Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
							My Movies
						</Typography>
						<Typography color="text.secondary">
							Manage your movie listings
						</Typography>
					</Box>
					<Stack direction="row" spacing={2}>
						<Button
							variant="outlined"
							startIcon={<RefreshIcon />}
							onClick={fetchMovies}
							disabled={loading}
							sx={{ textTransform: 'none' }}
						>
							Refresh
						</Button>
						<Button
							variant="contained"
							startIcon={<AddIcon />}
							onClick={() => navigate('/owner/movies/new')}
							sx={{ textTransform: 'none' }}
						>
							Add New Movie
						</Button>
					</Stack>
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
									<Skeleton variant="rectangular" height={280} />
									<CardContent>
										<Skeleton height={32} />
										<Skeleton height={20} width="40%" sx={{ mb: 1 }} />
										<Skeleton height={60} />
									</CardContent>
								</Card>
							</Grid>
						))}
					</Grid>
				) : movies.length === 0 ? (
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
						<MovieIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
						<Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
							No Movies Yet
						</Typography>
						<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
							You haven't added any movies. Start by adding your first movie.
						</Typography>
						<Button
							variant="contained"
							startIcon={<AddIcon />}
							onClick={() => navigate('/owner/movies/new')}
							sx={{ textTransform: 'none' }}
						>
							Add Your First Movie
						</Button>
					</Paper>
				) : (
					<>
						<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
							You have <strong>{movies.length}</strong> movie{movies.length !== 1 ? 's' : ''}
						</Typography>
						<Grid container spacing={3}>
							{movies.map((movie) => (
								<Grid item xs={12} sm={6} md={4} key={movie.id}>
									<MovieCard movie={movie} />
								</Grid>
							))}
						</Grid>
					</>
				)}

				{/* Delete Confirmation Dialog */}
				<Dialog
					open={deleteDialogOpen}
					onClose={handleCloseDeleteDialog}
					maxWidth="sm"
					fullWidth
				>
					<DialogTitle>Delete Movie</DialogTitle>
					<DialogContent>
						{selectedMovie && (
							<>
								<Alert severity="warning" sx={{ mb: 2 }}>
									This action cannot be undone. The movie will be permanently deleted.
								</Alert>
								<Typography variant="body1">
									Are you sure you want to delete <strong>{selectedMovie.title}</strong>?
								</Typography>
							</>
						)}
					</DialogContent>
					<DialogActions>
						<Button
							onClick={handleCloseDeleteDialog}
							disabled={deleting}
							sx={{ textTransform: 'none' }}
						>
							Cancel
						</Button>
						<Button
							onClick={handleDelete}
							variant="contained"
							color="error"
							disabled={deleting}
							startIcon={deleting ? <CircularProgress size={16} /> : <DeleteIcon />}
							sx={{ textTransform: 'none' }}
						>
							{deleting ? 'Deleting...' : 'Delete'}
						</Button>
					</DialogActions>
				</Dialog>
			</Container>
		</Box>
	);
};

export default OwnerMoviesPage;
