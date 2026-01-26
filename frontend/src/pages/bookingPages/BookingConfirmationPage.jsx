import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
	Box,
	Container,
	Typography,
	Paper,
	Button,
	Stack,
	Alert,
	IconButton,
	CircularProgress,
	Divider,
	Grid,
	Chip,
} from '@mui/material';
import {
	ArrowBack as ArrowBackIcon,
	Movie as MovieIcon,
	LocationOn as LocationIcon,
	AccessTime as TimeIcon,
	EventSeat as SeatIcon,
	Payment as PaymentIcon,
	Timer as TimerIcon,
} from '@mui/icons-material';
import { getTicket } from '../../services/bookingService';

const BookingConfirmationPage = () => {
	const { bookingId } = useParams();
	const navigate = useNavigate();
	const [booking, setBooking] = useState(null);
	const [countdown, setCountdown] = useState(600); // 10 minutes default
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchBooking = async () => {
			setLoading(true);
			setError(null);
			try {
				const bookingData = await getTicket(bookingId);
				setBooking(bookingData);
				// Calculate countdown from lockExpiry
				if (bookingData.lockExpiry) {
					const expiryTime = new Date(bookingData.lockExpiry).getTime();
					const now = Date.now();
					const remaining = Math.max(0, Math.floor((expiryTime - now) / 1000));
					setCountdown(remaining);
				}
			} catch (err) {
				console.error('Error fetching booking:', err);
				setError(err.message || 'Failed to load booking details');
			} finally {
				setLoading(false);
			}
		};

		if (bookingId) {
			fetchBooking();
		}
	}, [bookingId]);

	// Countdown timer
	useEffect(() => {
		if (countdown <= 0) return;

		const timer = setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					clearInterval(timer);
					setError('Booking session expired. Please try again.');
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [countdown]);

	const formatCountdown = (seconds) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

	const formatDateTime = (dateString) => {
		if (!dateString) return '';
		try {
			const date = new Date(dateString);
			return date.toLocaleString('en-US', {
				weekday: 'short',
				month: 'short',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
				hour12: true,
			});
		} catch {
			return dateString;
		}
	};

	const handleProceedToPayment = () => {
		navigate(`/booking/${bookingId}/payment`);
	};

	const InfoRow = ({ icon: Icon, label, value }) => (
		<Stack direction="row" spacing={2} alignItems="flex-start">
			<Icon color="action" fontSize="small" />
			<Box>
				<Typography variant="caption" color="text.secondary">
					{label}
				</Typography>
				<Typography variant="body1" sx={{ fontWeight: 500 }}>
					{value}
				</Typography>
			</Box>
		</Stack>
	);

	return (
		<Box sx={{ py: 4, minHeight: '80vh' }}>
			<Container maxWidth="md">
				{/* Header */}
				<Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
					<IconButton onClick={() => navigate(-1)}>
						<ArrowBackIcon />
					</IconButton>
					<Box sx={{ flex: 1 }}>
						<Typography variant="h5" sx={{ fontWeight: 800 }}>
							Booking Confirmation
						</Typography>
						<Typography color="text.secondary">
							Review your booking details
						</Typography>
					</Box>
					{countdown > 0 && (
						<Chip
							icon={<TimerIcon />}
							label={formatCountdown(countdown)}
							color={countdown < 60 ? 'error' : 'warning'}
							variant="outlined"
						/>
					)}
				</Stack>

				{/* Error Alert */}
				{error && (
					<Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
						{error}
					</Alert>
				)}

				{loading ? (
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
						<CircularProgress />
						<Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
							Loading booking details...
						</Typography>
					</Paper>
				) : booking ? (
					<Grid container spacing={3}>
						{/* Booking Details */}
						<Grid item xs={12} md={8}>
							<Paper
								elevation={0}
								sx={{
									p: 3,
									borderRadius: 3,
									border: '1px solid',
									borderColor: 'divider',
								}}
							>
								<Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
									Booking Details
								</Typography>

								<Stack spacing={3}>
									<InfoRow
										icon={MovieIcon}
										label="Movie"
										value={booking.movieTitle || booking.movie?.title || 'N/A'}
									/>
									<InfoRow
										icon={LocationIcon}
										label="Theatre"
										value={
											booking.theatreName
												? `${booking.theatreName} - ${booking.screenName || ''}`
												: 'N/A'
										}
									/>
									<InfoRow
										icon={TimeIcon}
										label="Show Time"
										value={formatDateTime(booking.showTime || booking.show?.showTime)}
									/>
									<InfoRow
										icon={SeatIcon}
										label="Seats"
										value={
											booking.seats
												?.map((s) => `${s.row}${s.number}`)
												.join(', ') || booking.seatIds?.join(', ') || 'N/A'
										}
									/>
								</Stack>
							</Paper>
						</Grid>

						{/* Payment Summary */}
						<Grid item xs={12} md={4}>
							<Paper
								elevation={0}
								sx={{
									p: 3,
									borderRadius: 3,
									border: '1px solid',
									borderColor: 'divider',
									position: 'sticky',
									top: 16,
								}}
							>
								<Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
									Payment Summary
								</Typography>

								<Stack spacing={1.5}>
									<Stack direction="row" justifyContent="space-between">
										<Typography color="text.secondary">
											Tickets ({booking.seats?.length || booking.seatIds?.length || 0})
										</Typography>
										<Typography>
											₹{booking.totalAmount || 0}
										</Typography>
									</Stack>
									<Divider />
									<Stack direction="row" justifyContent="space-between">
										<Typography sx={{ fontWeight: 700 }}>Total Amount</Typography>
										<Typography sx={{ fontWeight: 700, color: 'primary.main' }}>
											₹{booking.totalAmount || 0}
										</Typography>
									</Stack>
								</Stack>

								<Button
									fullWidth
									variant="contained"
									size="large"
									onClick={handleProceedToPayment}
									disabled={countdown <= 0}
									startIcon={<PaymentIcon />}
									sx={{ mt: 3, textTransform: 'none' }}
								>
									Proceed to Payment
								</Button>

								{countdown > 0 && (
									<Typography
										variant="caption"
										color="text.secondary"
										sx={{ display: 'block', mt: 2, textAlign: 'center' }}
									>
										Complete payment within {formatCountdown(countdown)}
									</Typography>
								)}
							</Paper>
						</Grid>
					</Grid>
				) : (
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
							Booking Not Found
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Unable to load booking details.
						</Typography>
					</Paper>
				)}
			</Container>
		</Box>
	);
};

export default BookingConfirmationPage;
