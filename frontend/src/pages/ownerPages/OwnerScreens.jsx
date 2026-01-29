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
	TheaterComedy as ScreenIcon,
	Refresh as RefreshIcon,
} from '@mui/icons-material';
import {
	getOwnerScreens,
	createScreen,
	updateScreen,
	deleteScreen,
	getOwnerTheatre,
	getOwnerTheatres,
	createOwnerTheatre,
	createScreenForTheatre,
} from '../../services/ownerScreenService';
import { toast } from 'react-toastify';
import OwnerAddSeatsModal from './OwnerAddSeatsModal';

const OwnerScreens = () => {
	const [screens, setScreens] = useState([]);
	const [theatres, setTheatres] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [theatreDialogOpen, setTheatreDialogOpen] = useState(false);
	const [seatsDialogOpen, setSeatsDialogOpen] = useState(false);
	const [editingScreen, setEditingScreen] = useState(null);
	const [selectedTheatreId, setSelectedTheatreId] = useState(null);
	const [formData, setFormData] = useState({
		name: '',
		capacity: 0,
		features: [],
	});
	const [theatreFormData, setTheatreFormData] = useState({
		name: '',
		city: '',
		phone: '',
	});
	const [submitting, setSubmitting] = useState(false);
	const [submittingTheatre, setSubmittingTheatre] = useState(false);

	const fetchScreens = async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await getOwnerScreens();
			setScreens(Array.isArray(data) ? data : []);
			console.log("Screens:", data);
		} catch (err) {
			console.error('Error fetching screens:', err);
			setError(err.message || 'Failed to load screens');
			setScreens([]);
		} finally {
			setLoading(false);
		}
	};

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

	useEffect(() => {
		fetchTheatres();
		fetchScreens();
	}, []);

	// Update selectedTheatreId from screens if not set
	useEffect(() => {
		if (!selectedTheatreId && screens.length > 0) {
			// Try to extract theatreId from screen data
			const firstScreen = screens[0];
			if (firstScreen.theatreId) {
				setSelectedTheatreId(firstScreen.theatreId);
			} else if (firstScreen.theatre?.id) {
				setSelectedTheatreId(firstScreen.theatre.id);
			}
		}
	}, [screens, selectedTheatreId]);

	// Filter screens by selected theatre
	const filteredScreens = selectedTheatreId
		? screens.filter(screen => 
			screen.theatreId === selectedTheatreId || 
			screen.theatre?.id === selectedTheatreId
		)
		: screens;

	const handleOpenDialog = (screen = null) => {
		if (screen) {
			setEditingScreen(screen);
			setFormData({
				name: screen.name || '',
				capacity: screen.capacity || 0,
				features: screen.features || '',
			});
		} else {
			setEditingScreen(null);
			setFormData({ name: '', capacity: 0, features: [] });
		}
		setError(null);
		setDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setDialogOpen(false);
		setEditingScreen(null);
		setFormData({ name: '', capacity: 0, features: [] });
	};

	const handleSubmit = async () => {
		// For adding new screen, validate name and theatre selection
		if (!editingScreen) {
			if (!formData.name?.trim()) {
				setError('Screen name is required');
				return;
			}
			if (!selectedTheatreId) {
				setError('Please select a theatre first.');
				return;
			}
		}

		// For editing, keep existing validation
		if (editingScreen && (!formData.name || !formData.capacity)) {
			setError('Name and capacity are required');
			return;
		}

		setSubmitting(true);
		setError(null);

		try {
			if (editingScreen) {
				await updateScreen(editingScreen.id, formData);
				toast.success('Screen updated successfully!');
			} else {
				await createScreen({
					name: formData.name,
					capacity: formData.capacity,
					features: formData.features,
					theatreId: selectedTheatreId,
				});
				toast.success('Screen added successfully!');
			}
			
			// Refresh the list
			await fetchScreens();
			setSubmitting(false);
			handleCloseDialog();
		} catch (err) {
			console.error('Error saving screen:', err);
			const errorMessage = err.message || 'Failed to save screen';
			setError(errorMessage);
			toast.error(errorMessage);
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

	const handleOpenSeatsDialog = (screen = null) => {
		if (screen?.id) {
			setSelectedTheatreId((current) => current || screen.theatreId || screen.theatre?.id || current);
		}
		setError(null);
		setSeatsDialogOpen(true);
	};

	const handleCloseSeatsDialog = () => {
		setSeatsDialogOpen(false);
	};

	const handleOpenTheatreDialog = () => {
		setTheatreFormData({ name: '', city: '', phone: '' });
		setError(null);
		setTheatreDialogOpen(true);
	};

	const handleCloseTheatreDialog = () => {
		setTheatreDialogOpen(false);
		setTheatreFormData({ name: '', city: '', phone: '' });
		setError(null);
	};

	const handleSubmitTheatre = async () => {
		if (!theatreFormData.name?.trim()) {
			setError('Theatre name is required');
			return;
		}

		setSubmittingTheatre(true);
		setError(null);

		try {
			const newTheatre = await createOwnerTheatre(theatreFormData);
			toast.success('Theatre added successfully!');
			
			await fetchTheatres(false);
			
			if (newTheatre && newTheatre.id) {
				setSelectedTheatreId(newTheatre.id);
			}
			
			setSubmittingTheatre(false);
			handleCloseTheatreDialog();
		} catch (err) {
			console.error('Error creating theatre:', err);
			const errorMessage = err.message || 'Failed to create theatre';
			setError(errorMessage);
			toast.error(errorMessage);
			setSubmittingTheatre(false);
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
							disabled={!selectedTheatreId}
							sx={{ textTransform: 'none' }}
						>
							Add Screen
						</Button>
					</Stack>
				</Stack>

				{/* Theatre Selector */}
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
						<Button
							variant="outlined"
							size="small"
							startIcon={<AddIcon />}
							onClick={handleOpenTheatreDialog}
							sx={{ textTransform: 'none' }}
						>
							Add Theatre
						</Button>
						{selectedTheatreId && (
							<Chip
								label={`${filteredScreens.length} screen${filteredScreens.length !== 1 ? 's' : ''}`}
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

				{/* Screens Grid */}
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
				) : filteredScreens.length === 0 ? (
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
						{filteredScreens.map((screen) => (
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

												{
												 screen.features && screen.features.length > 0 &&	screen.features.map((feature) => (
														<Chip
															key={feature}
															label={feature}
															size="small"
															sx={{ fontWeight: 600 }}
														/>
													))
}
												{/* <Chip
													label={screen.features}
													size="small"
													sx={{ fontWeight: 600 }}
												/> */}
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
										onClick={() => handleOpenSeatsDialog(screen)}
										sx={{ textTransform: 'none' }}
									>
										Add Seats
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
							{error && (
								<Alert severity="error" onClose={() => setError(null)}>
									{error}
								</Alert>
							)}
							<TextField
								fullWidth
								label="Screen Name"
								value={formData.name}
								onChange={(e) => setFormData({ ...formData, name: e.target.value })}
								required
								disabled={submitting}
								error={!!error && !formData.name?.trim()}
								helperText={error && !formData.name?.trim() ? 'Screen name cannot be empty' : ''}
							/>
							{/* Only show capacity and features when editing */}
							
								<>
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
										onChange={(e) => setFormData({ ...formData, features: e.target.value.split(',').map(f => f.trim()) })}
										disabled={submitting}
										helperText="e.g., Dolby Atmos, IMAX, 3D, 4K"
									/>
								</>
							
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

				<OwnerAddSeatsModal
					open={seatsDialogOpen}
					onClose={handleCloseSeatsDialog}
					screens={filteredScreens}
					onCreated={fetchScreens}
				/>

				{/* Add Theatre Dialog */}
				<Dialog
					open={theatreDialogOpen}
					onClose={handleCloseTheatreDialog}
					maxWidth="sm"
					fullWidth
				>
					<DialogTitle>Add New Theatre</DialogTitle>
					<DialogContent>
						<Stack spacing={3} sx={{ mt: 1 }}>
							{error && (
								<Alert severity="error" onClose={() => setError(null)}>
									{error}
								</Alert>
							)}
							<TextField
								fullWidth
								label="Theatre Name"
								value={theatreFormData.name}
								onChange={(e) => setTheatreFormData({ ...theatreFormData, name: e.target.value })}
								required
								disabled={submittingTheatre}
								error={!!error && !theatreFormData.name?.trim()}
								helperText={error && !theatreFormData.name?.trim() ? 'Theatre name cannot be empty' : ''}
							/>
							<TextField
								fullWidth
								label="city"
								multiline
								rows={2}
								value={theatreFormData.city}
								onChange={(e) => setTheatreFormData({ ...theatreFormData, city: e.target.value })}
								disabled={submittingTheatre}
								helperText="Theatre location address"
							/>
							<TextField
								fullWidth
								label="Phone Number"
								type="tel"
								value={theatreFormData.phone}
								onChange={(e) => setTheatreFormData({ ...theatreFormData, phone: e.target.value })}
								disabled={submittingTheatre}
								helperText="Contact number for the theatre"
							/>
						</Stack>
					</DialogContent>
					<DialogActions>
						<Button
							onClick={handleCloseTheatreDialog}
							disabled={submittingTheatre}
							sx={{ textTransform: 'none' }}
						>
							Cancel
						</Button>
						<Button
							onClick={handleSubmitTheatre}
							variant="contained"
							disabled={submittingTheatre}
							startIcon={submittingTheatre ? <CircularProgress size={16} /> : <AddIcon />}
							sx={{ textTransform: 'none' }}
						>
							{submittingTheatre ? 'Creating...' : 'Add Theatre'}
						</Button>
					</DialogActions>
				</Dialog>
			</Container>
		</Box>
	);
};

export default OwnerScreens;
