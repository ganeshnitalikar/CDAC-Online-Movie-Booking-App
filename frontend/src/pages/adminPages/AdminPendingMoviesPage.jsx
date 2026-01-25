import React, { useEffect, useState } from 'react';
import {
	Box,
	Container,
	Typography,
	Grid,
	Paper,
	Card,
	CardMedia,
	CardContent,
	CardActions,
	Button,
	Stack,
	Chip,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	FormControlLabel,
	Switch,
	Alert,
	Skeleton,
	CircularProgress,
} from '@mui/material';
import {
	CheckCircle as CheckCircleIcon,
	Cancel as CancelIcon,
	Refresh as RefreshIcon,
} from '@mui/icons-material';
import { getPendingMovies, approveMovie } from '../../services/movie.admin.service';

const AdminPendingMoviesPage = () => {
	const [movies, setMovies] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedMovie, setSelectedMovie] = useState(null);
	const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
	const [approvalData, setApprovalData] = useState({ approved: true, remarks: '' });
	const [submitting, setSubmitting] = useState(false);

	const fetchPendingMovies = async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await getPendingMovies();
			setMovies(Array.isArray(data) ? data : []);
		} catch (err) {
			console.error('Error fetching pending movies:', err);
			setError(err.message || 'Failed to load pending movies');
			setMovies([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPendingMovies();
	}, []);

	const handleOpenApprovalDialog = (movie, approved = true) => {
		setSelectedMovie(movie);
		setApprovalData({ approved, remarks: '' });
		setApprovalDialogOpen(true);
	};

	const handleCloseApprovalDialog = () => {
		setApprovalDialogOpen(false);
		setSelectedMovie(null);
		setApprovalData({ approved: true, remarks: '' });
	};

	const handleSubmitApproval = async () => {
		if (!selectedMovie) return;

		setSubmitting(true);
		setError(null);
		try {
			await approveMovie(selectedMovie.id, approvalData);
			setMovies((prevMovies) => prevMovies.filter((m) => m.id !== selectedMovie.id));
			handleCloseApprovalDialog();
		} catch (err) {
			console.error('Error updating movie approval:', err);
			setError(err.message || 'Failed to update movie approval');
		} finally {
			setSubmitting(false);
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
			}}
		>
			<CardMedia
				component="img"
				image={movie.posterUrl || '/placeholder-poster.jpg'}
				alt={movie.title}
				sx={{
					height: 300,
					objectFit: 'cover',
				}}
			/>
			<CardContent sx={{ flexGrow: 1 }}>
				<Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }} noWrap>
					{movie.title}
				</Typography>
				<Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 60 }}>
					{movie.description || movie.overview || 'No description available'}
				</Typography>
				<Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap" gap={1}>
					{Array.isArray(movie.genre) ? (
						movie.genre.map((g) => (
							<Chip key={g} label={g} size="small" />
						))
					) : (
						<Chip label={movie.genre || 'N/A'} size="small" />
					)}
				</Stack>
				<Stack spacing={1}>
					<Typography variant="caption" color="text.secondary">
						Duration: {movie.durationMinutes || movie.durationMins || 'N/A'} mins
					</Typography>
					{movie.releaseDate && (
						<Typography variant="caption" color="text.secondary">
							Release: {new Date(movie.releaseDate).toLocaleDateString()}
						</Typography>
					)}
					{movie.rating && (
						<Typography variant="caption" color="text.secondary">
							Rating: ⭐ {movie.rating}
						</Typography>
					)}
				</Stack>
			</CardContent>
			<CardActions sx={{ p: 2, pt: 0 }}>
				<Button
					fullWidth
					variant="contained"
					color="success"
					startIcon={<CheckCircleIcon />}
					onClick={() => handleOpenApprovalDialog(movie, true)}
					sx={{ textTransform: 'none', mb: 1 }}
				>
					Approve
				</Button>
				<Button
					fullWidth
					variant="outlined"
					color="error"
					startIcon={<CancelIcon />}
					onClick={() => handleOpenApprovalDialog(movie, false)}
					sx={{ textTransform: 'none' }}
				>
					Reject
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
							Pending Movie Approvals
						</Typography>
						<Typography color="text.secondary">
							Review and approve movies submitted by owners
						</Typography>
					</Box>
					<Button
						variant="outlined"
						startIcon={<RefreshIcon />}
						onClick={fetchPendingMovies}
						disabled={loading}
						sx={{ textTransform: 'none' }}
					>
						Refresh
					</Button>
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
									<Skeleton variant="rectangular" height={300} />
									<CardContent>
										<Skeleton height={32} />
										<Skeleton height={20} width="60%" />
										<Skeleton height={60} sx={{ mt: 2 }} />
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
						<Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
							No Pending Movies
						</Typography>
						<Typography variant="body2" color="text.secondary">
							All movies have been reviewed. Check back later for new submissions.
						</Typography>
					</Paper>
				) : (
					<>
						<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
							Found <strong>{movies.length}</strong> movie{movies.length !== 1 ? 's' : ''} pending approval
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

				{/* Approval Dialog */}
				<Dialog
					open={approvalDialogOpen}
					onClose={handleCloseApprovalDialog}
					maxWidth="sm"
					fullWidth
				>
					<DialogTitle>
						{approvalData.approved ? 'Approve Movie' : 'Reject Movie'}
					</DialogTitle>
					<DialogContent>
						{selectedMovie && (
							<>
								<Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
									{selectedMovie.title}
								</Typography>
								<FormControlLabel
									control={
										<Switch
											checked={approvalData.approved}
											onChange={(e) =>
												setApprovalData({ ...approvalData, approved: e.target.checked })
											}
										/>
									}
									label={approvalData.approved ? 'Approve' : 'Reject'}
									sx={{ mb: 2 }}
								/>
								<TextField
									fullWidth
									multiline
									rows={4}
									label="Remarks (Optional)"
									placeholder={
										approvalData.approved
											? 'Add any notes about this approval...'
											: 'Provide reason for rejection...'
									}
									value={approvalData.remarks}
									onChange={(e) =>
										setApprovalData({ ...approvalData, remarks: e.target.value })
									}
									sx={{ mt: 1 }}
								/>
							</>
						)}
					</DialogContent>
					<DialogActions>
						<Button
							onClick={handleCloseApprovalDialog}
							disabled={submitting}
							sx={{ textTransform: 'none' }}
						>
							Cancel
						</Button>
						<Button
							onClick={handleSubmitApproval}
							variant="contained"
							color={approvalData.approved ? 'success' : 'error'}
							disabled={submitting}
							startIcon={submitting ? <CircularProgress size={16} /> : null}
							sx={{ textTransform: 'none' }}
						>
							{submitting ? 'Processing...' : approvalData.approved ? 'Approve' : 'Reject'}
						</Button>
					</DialogActions>
				</Dialog>
			</Container>
		</Box>
	);
};

export default AdminPendingMoviesPage;
