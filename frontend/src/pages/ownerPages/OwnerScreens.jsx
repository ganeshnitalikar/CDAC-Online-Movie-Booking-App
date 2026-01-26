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
} from '@mui/material';
import {
	Add as AddIcon,
	Edit as EditIcon,
	Delete as DeleteIcon,
	TheaterComedy as ScreenIcon,
	Refresh as RefreshIcon,
} from '@mui/icons-material';
import {
	getOwnerScreens,
	createScreen,
	updateScreen,
	deleteScreen,
} from '../../services/ownerScreenService';

const OwnerScreens = () => {
	const [screens, setScreens] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingScreen, setEditingScreen] = useState(null);
	const [formData, setFormData] = useState({
		name: '',
		capacity: '',
		features: '',
	});
	const [submitting, setSubmitting] = useState(false);

	const fetchScreens = async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await getOwnerScreens();
			setScreens(Array.isArray(data) ? data : []);
		} catch (err) {
			console.error('Error fetching screens:', err);
			setError(err.message || 'Failed to load screens');
			setScreens([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchScreens();
	}, []);

	const handleOpenDialog = (screen = null) => {
		if (screen) {
			setEditingScreen(screen);
			setFormData({
				name: screen.name || '',
				capacity: screen.capacity?.toString() || '',
				features: screen.features || '',
			});
		} else {
			setEditingScreen(null);
			setFormData({ name: '', capacity: '', features: '' });
		}
		setError(null);
		setDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setDialogOpen(false);
		setEditingScreen(null);
		setFormData({ name: '', capacity: '', features: '' });
	};

	const handleSubmit = async () => {
		if (!formData.name || !formData.capacity) {
			setError('Name and capacity are required');
			return;
		}

		setSubmitting(true);
		setError(null);

		try {
			if (editingScreen) {
				await updateScreen(editingScreen.id, formData);
			} else {
				await createScreen(formData);
			}
			
			// Refresh the list
			await fetchScreens();
			setSubmitting(false);
			handleCloseDialog();
		} catch (err) {
			console.error('Error saving screen:', err);
			setError(err.message || 'Failed to save screen');
			setSubmitting(false);
		}
	};

	const handleDelete = async (screenId) => {
		if (!window.confirm('Are you sure you want to delete this screen?')) {
			return;
		}

		try {
			await deleteScreen(screenId);
			// Refresh the list
			await fetchScreens();
		} catch (err) {
			console.error('Error deleting screen:', err);
			setError(err.message || 'Failed to delete screen');
		}
	};

	return (
		<Box sx={{ py: 4 }}>
			<Container maxWidth="lg">
				{/* Header */}
				<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
					<Box>
						<Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
							Theater Screens
						</Typography>
						<Typography color="text.secondary">
							Manage your theater screens and capacities
						</Typography>
					</Box>
					<Stack direction="row" spacing={2}>
						<Button
							variant="outlined"
							startIcon={<RefreshIcon />}
							onClick={fetchScreens}
							disabled={loading}
							sx={{ textTransform: 'none' }}
						>
							Refresh
						</Button>
						<Button
							variant="contained"
							startIcon={<AddIcon />}
							onClick={() => handleOpenDialog()}
							sx={{ textTransform: 'none' }}
						>
							Add Screen
						</Button>
					</Stack>
				</Stack>

				{/* Error Alert */}
				{error && (
					<Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
						{error}
					</Alert>
				)}

				{/* Screens Grid */}
				{loading ? (
					<Grid container spacing={3}>
						{[1, 2, 3].map((i) => (
							<Grid item xs={12} sm={6} md={4} key={i}>
								<Skeleton height={200} variant="rounded" />
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
						<ScreenIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
						<Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
							No Screens Added
						</Typography>
						<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
							Add your first screen to start managing your theater
						</Typography>
						<Button
							variant="contained"
							startIcon={<AddIcon />}
							onClick={() => handleOpenDialog()}
							sx={{ textTransform: 'none' }}
						>
							Add Screen
						</Button>
					</Paper>
				) : (
					<Grid container spacing={3}>
						{screens.map((screen) => (
							<Grid item xs={12} sm={6} md={4} key={screen.id}>
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
											<ScreenIcon sx={{ fontSize: 40, color: 'primary.main' }} />
											<Typography variant="h6" sx={{ fontWeight: 700 }}>
												{screen.name}
											</Typography>
										</Stack>
										<Stack spacing={1.5}>
											<Box>
												<Typography variant="body2" color="text.secondary">
													Capacity
												</Typography>
												<Typography variant="h6" sx={{ fontWeight: 600 }}>
													{screen.capacity} seats
												</Typography>
											</Box>
											<Box>
												<Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
													Features
												</Typography>
												<Chip
													label={screen.features}
													size="small"
													sx={{ fontWeight: 600 }}
												/>
											</Box>
										</Stack>
									</CardContent>
									<CardActions sx={{ p: 2, pt: 0 }}>
										<Button
											size="small"
											startIcon={<EditIcon />}
											onClick={() => handleOpenDialog(screen)}
											sx={{ textTransform: 'none' }}
										>
											Edit
										</Button>
										<Button
											size="small"
											color="error"
											startIcon={<DeleteIcon />}
											onClick={() => handleDelete(screen.id)}
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
						{editingScreen ? 'Edit Screen' : 'Add New Screen'}
					</DialogTitle>
					<DialogContent>
						<Stack spacing={3} sx={{ mt: 1 }}>
							<TextField
								fullWidth
								label="Screen Name"
								value={formData.name}
								onChange={(e) => setFormData({ ...formData, name: e.target.value })}
								required
								disabled={submitting}
							/>
							<TextField
								fullWidth
								label="Capacity"
								type="number"
								value={formData.capacity}
								onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
								required
								inputProps={{ min: 1 }}
								disabled={submitting}
								helperText="Number of seats"
							/>
							<TextField
								fullWidth
								label="Features"
								value={formData.features}
								onChange={(e) => setFormData({ ...formData, features: e.target.value })}
								disabled={submitting}
								helperText="e.g., Dolby Atmos, IMAX, 3D, 4K"
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
							{submitting ? 'Saving...' : editingScreen ? 'Update' : 'Add'}
						</Button>
					</DialogActions>
				</Dialog>
			</Container>
		</Box>
	);
};

export default OwnerScreens;
