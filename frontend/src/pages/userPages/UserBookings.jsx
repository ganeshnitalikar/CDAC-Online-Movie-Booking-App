import React, { useEffect, useState } from 'react';
import {
	Box,
	Container,
	Typography,
	Grid,
	Paper,
	Card,
	CardContent,
	Stack,
	Button,
	Chip,
	Skeleton,
	TextField,
	InputAdornment,
	Select,
	FormControl,
	InputLabel,
	MenuItem,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Divider,
	Avatar,
	IconButton,
} from '@mui/material';
import {
	Search as SearchIcon,
	Movie as MovieIcon,
	LocationOn as LocationIcon,
	AccessTime as TimeIcon,
	Cancel as CancelIcon,
	Download as DownloadIcon,
	Refresh as RefreshIcon,
	FilterList as FilterListIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { getUserBookings, cancelBooking } from '../../services/user';

const BookingCard = ({ booking, onCancel, onDownload }) => {
	const isUpcoming = booking.status === 'UPCOMING';
	const isCompleted = booking.status === 'COMPLETED';
	const isCancelled = booking.status === 'CANCELLED';

	return (
		<Card
			elevation={0}
			sx={{
				border: '1px solid',
				borderColor: 'divider',
				borderRadius: 3,
				overflow: 'hidden',
				transition: 'all 0.2s ease-in-out',
				'&:hover': {
					boxShadow: 2,
					transform: 'translateY(-2px)',
				},
			}}
		>
			<CardContent>
				<Stack spacing={2}>
					{/* Header */}
					<Stack direction="row" justifyContent="space-between" alignItems="flex-start">
						<Stack direction="row" spacing={2} alignItems="center" sx={{ flexGrow: 1 }}>
							<Avatar
								sx={{
									width: 56,
									height: 56,
									bgcolor: 'primary.light',
									color: 'primary.main',
								}}
							>
								<MovieIcon />
							</Avatar>
							<Box sx={{ flexGrow: 1 }}>
								<Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
									{booking.movieTitle}
								</Typography>
								<Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
									<LocationIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
									<Typography variant="body2" color="text.secondary">
										{booking.theater}
									</Typography>
								</Stack>
								<Stack direction="row" spacing={1} alignItems="center">
									<TimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
									<Typography variant="body2" color="text.secondary">
										{new Date(booking.showTime).toLocaleString()}
									</Typography>
								</Stack>
							</Box>
						</Stack>
						<Chip
							label={booking.status}
							size="small"
							color={
								isUpcoming ? 'primary' :
								isCompleted ? 'success' :
								isCancelled ? 'error' : 'default'
							}
							sx={{ textTransform: 'capitalize', fontWeight: 600 }}
						/>
					</Stack>

					<Divider />

					{/* Booking Details */}
					<Grid container spacing={2}>
						<Grid item xs={6} sm={3}>
							<Typography variant="caption" color="text.secondary">
								Booking ID
							</Typography>
							<Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
								{booking.id}
							</Typography>
						</Grid>
						<Grid item xs={6} sm={3}>
							<Typography variant="caption" color="text.secondary">
								Seats
							</Typography>
							<Typography variant="body2" sx={{ fontWeight: 600 }}>
								{booking.seats.join(', ')}
							</Typography>
						</Grid>
						<Grid item xs={6} sm={3}>
							<Typography variant="caption" color="text.secondary">
								Total Amount
							</Typography>
							<Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
								₹{booking.total}
							</Typography>
						</Grid>
						<Grid item xs={6} sm={3}>
							<Typography variant="caption" color="text.secondary">
								Date
							</Typography>
							<Typography variant="body2" sx={{ fontWeight: 600 }}>
								{new Date(booking.showTime).toLocaleDateString()}
							</Typography>
						</Grid>
					</Grid>

					{/* Actions */}
					<Stack direction="row" spacing={1} sx={{ pt: 1 }}>
						{isUpcoming && (
							<Button
								variant="outlined"
								color="error"
								size="small"
								startIcon={<CancelIcon />}
								onClick={() => onCancel(booking)}
								sx={{ textTransform: 'none' }}
							>
								Cancel Booking
							</Button>
						)}
						{(isUpcoming || isCompleted) && (
							<Button
								variant="outlined"
								size="small"
								startIcon={<DownloadIcon />}
								onClick={() => onDownload(booking)}
								sx={{ textTransform: 'none', ml: 'auto' }}
							>
								Download Ticket
							</Button>
						)}
					</Stack>
				</Stack>
			</CardContent>
		</Card>
	);
};

const UserBookings = () => {
	const { user } = useAuth();
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
	const [bookingToCancel, setBookingToCancel] = useState(null);

	const fetchBookings = async () => {
		setLoading(true);
		try {
			const data = await getUserBookings();
			setBookings(data);
		} catch (error) {
			console.error('Error fetching bookings:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchBookings();
	}, []);

	const handleCancelClick = (booking) => {
		setBookingToCancel(booking);
		setCancelDialogOpen(true);
	};

	const handleCancelConfirm = async () => {
		if (bookingToCancel) {
			try {
				await cancelBooking(bookingToCancel.id);
				fetchBookings();
				setCancelDialogOpen(false);
				setBookingToCancel(null);
			} catch (error) {
				console.error('Error cancelling booking:', error);
			}
		}
	};

	const handleDownload = (booking) => {
		// Simulate ticket download
		console.log('Downloading ticket for:', booking.id);
		// In a real app, this would generate and download a PDF
	};

	const filteredBookings = bookings.filter(booking => {
		const matchesSearch = search === '' || 
			booking.movieTitle.toLowerCase().includes(search.toLowerCase()) ||
			booking.theater.toLowerCase().includes(search.toLowerCase()) ||
			booking.id.toLowerCase().includes(search.toLowerCase());
		
		const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
		
		return matchesSearch && matchesStatus;
	});

	const upcomingBookings = filteredBookings.filter(b => b.status === 'UPCOMING');
	const completedBookings = filteredBookings.filter(b => b.status === 'COMPLETED');
	const cancelledBookings = filteredBookings.filter(b => b.status === 'CANCELLED');

	return (
		<Box sx={{ py: 4 }}>
			<Container maxWidth="lg">
				{/* Header */}
				<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
					<Box>
						<Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
							My Bookings
						</Typography>
						<Typography color="text.secondary">
							View and manage your movie tickets
						</Typography>
					</Box>
					<Button
						variant="outlined"
						startIcon={<RefreshIcon />}
						onClick={fetchBookings}
						sx={{ textTransform: 'none' }}
					>
						Refresh
					</Button>
				</Stack>

				{/* Summary Cards */}
				<Grid container spacing={2} sx={{ mb: 3 }}>
					<Grid item xs={6} sm={3}>
						<Paper
							elevation={0}
							sx={{
								p: 2,
								borderRadius: 2,
								border: '1px solid',
								borderColor: 'divider',
								textAlign: 'center',
							}}
						>
							<Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
								{bookings.length}
							</Typography>
							<Typography variant="caption" color="text.secondary">
								Total Bookings
							</Typography>
						</Paper>
					</Grid>
					<Grid item xs={6} sm={3}>
						<Paper
							elevation={0}
							sx={{
								p: 2,
								borderRadius: 2,
								border: '1px solid',
								borderColor: 'divider',
								textAlign: 'center',
							}}
						>
							<Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
								{upcomingBookings.length}
							</Typography>
							<Typography variant="caption" color="text.secondary">
								Upcoming
							</Typography>
						</Paper>
					</Grid>
					<Grid item xs={6} sm={3}>
						<Paper
							elevation={0}
							sx={{
								p: 2,
								borderRadius: 2,
								border: '1px solid',
								borderColor: 'divider',
								textAlign: 'center',
							}}
						>
							<Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
								{completedBookings.length}
							</Typography>
							<Typography variant="caption" color="text.secondary">
								Completed
							</Typography>
						</Paper>
					</Grid>
					<Grid item xs={6} sm={3}>
						<Paper
							elevation={0}
							sx={{
								p: 2,
								borderRadius: 2,
								border: '1px solid',
								borderColor: 'divider',
								textAlign: 'center',
							}}
						>
							<Typography variant="h5" sx={{ fontWeight: 700, color: 'error.main' }}>
								{cancelledBookings.length}
							</Typography>
							<Typography variant="caption" color="text.secondary">
								Cancelled
							</Typography>
						</Paper>
					</Grid>
				</Grid>

				{/* Filters */}
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
					<Grid container spacing={2} alignItems="center">
						<Grid item xs={12} md={6}>
							<TextField
								fullWidth
								placeholder="Search by movie, theater, or booking ID..."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<SearchIcon />
										</InputAdornment>
									),
								}}
								size="small"
							/>
						</Grid>
						<Grid item xs={12} md={3}>
							<FormControl fullWidth size="small">
								<InputLabel>Status</InputLabel>
								<Select
									value={statusFilter}
									label="Status"
									onChange={(e) => setStatusFilter(e.target.value)}
									startAdornment={<FilterListIcon sx={{ mr: 1, color: 'text.secondary' }} />}
								>
									<MenuItem value="all">All Status</MenuItem>
									<MenuItem value="UPCOMING">Upcoming</MenuItem>
									<MenuItem value="COMPLETED">Completed</MenuItem>
									<MenuItem value="CANCELLED">Cancelled</MenuItem>
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12} md={3}>
							<Typography variant="body2" color="text.secondary">
								Showing: <strong>{filteredBookings.length}</strong> bookings
							</Typography>
						</Grid>
					</Grid>
				</Paper>

				{/* Bookings List */}
				{loading ? (
					<Stack spacing={2}>
						{[1, 2, 3].map((i) => (
							<Paper key={i} elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
								<Skeleton height={60} />
								<Skeleton height={40} width="60%" sx={{ mt: 2 }} />
							</Paper>
						))}
					</Stack>
				) : filteredBookings.length > 0 ? (
					<Stack spacing={2}>
						{filteredBookings.map((booking) => (
							<BookingCard
								key={booking.id}
								booking={booking}
								onCancel={handleCancelClick}
								onDownload={handleDownload}
							/>
						))}
					</Stack>
				) : (
					<Paper
						elevation={0}
						sx={{
							p: 6,
							borderRadius: 3,
							border: '1px solid',
							borderColor: 'divider',
							textAlign: 'center',
						}}
					>
						<MovieIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
						<Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
							No bookings found
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{search || statusFilter !== 'all'
								? 'Try adjusting your search or filters'
								: 'Start booking movies to see them here!'}
						</Typography>
					</Paper>
				)}

				{/* Cancel Confirmation Dialog */}
				<Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
					<DialogTitle>Cancel Booking</DialogTitle>
					<DialogContent>
						<Typography>
							Are you sure you want to cancel your booking for <strong>{bookingToCancel?.movieTitle}</strong>?
						</Typography>
						<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
							This action cannot be undone. Refunds will be processed according to our cancellation policy.
						</Typography>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setCancelDialogOpen(false)} sx={{ textTransform: 'none' }}>
							Keep Booking
						</Button>
						<Button
							onClick={handleCancelConfirm}
							color="error"
							variant="contained"
							sx={{ textTransform: 'none' }}
						>
							Cancel Booking
						</Button>
					</DialogActions>
				</Dialog>
			</Container>
		</Box>
	);
};

export default UserBookings;
