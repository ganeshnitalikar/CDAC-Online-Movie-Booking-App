import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
	Box,
	Container,
	Typography,
	Paper,
	Stack,
	Button,
	Alert,
	IconButton,
	Chip,
	Divider,
	Grid,
	CircularProgress,
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
import { createPaymentOrder } from '../../services/paymentService';
import { getTicket } from '../../services/bookingService';

const PaymentPage = () => {
	const { bookingId } = useParams();
	const navigate = useNavigate();
	const [bookingData, setBookingData] = useState(null);
	const [countdown, setCountdown] = useState(600); // 10 minutes default
	const [paying, setPaying] = useState(false);
	const [error, setError] = useState(null);

	// Fetch booking data from backend
	useEffect(() => {
		const fetchBooking = async () => {
			try {
				const bookingData = await getTicket(bookingId);
				setBookingData(bookingData);
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

	const loadRazorpayScript = () => {
		return new Promise((resolve) => {
			if (window.Razorpay) {
				resolve(true);
				return;
			}
			const script = document.createElement('script');
			script.src = 'https://checkout.razorpay.com/v1/checkout.js';
			script.onload = () => resolve(true);
			script.onerror = () => resolve(false);
			document.body.appendChild(script);
		});
	};

	const handlePayment = async () => {
		setPaying(true);
		setError(null);

		try {
			// Load Razorpay script
			const scriptLoaded = await loadRazorpayScript();
			if (!scriptLoaded) {
				throw new Error('Failed to load payment gateway. Please try again.');
			}

			// Create payment order
			const orderData = await createPaymentOrder(Number(bookingId));

			// Configure Razorpay options
			const options = {
				key: orderData.razorpayKeyId || orderData.key,
				amount: orderData.amount,
				currency: orderData.currency || 'INR',
				name: 'Movie Booking',
				description: `Booking #${bookingId}`,
				order_id: orderData.orderId || orderData.razorpayOrderId,
				handler: function (response) {
					// Payment successful - navigate to ticket page
					// Backend webhook will confirm the booking
					console.log('Payment successful:', response);
					navigate(`/booking/${bookingId}/ticket`);
				},
				prefill: {
					name: orderData.customerName || '',
					email: orderData.customerEmail || '',
					contact: orderData.customerPhone || '',
				},
				theme: {
					color: '#1976d2',
				},
				modal: {
					ondismiss: function () {
						setPaying(false);
					},
				},
			};

			const razorpay = new window.Razorpay(options);
			razorpay.on('payment.failed', function (response) {
				console.error('Payment failed:', response.error);
				setError(response.error.description || 'Payment failed. Please try again.');
				setPaying(false);
			});
			razorpay.open();
		} catch (err) {
			console.error('Error initiating payment:', err);
			setError(err.message || 'Failed to initiate payment');
			setPaying(false);
		}
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
							Complete Payment
						</Typography>
						<Typography color="text.secondary">
							Review your booking and proceed to payment
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

				{bookingData ? (
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
										value={bookingData.movieTitle || bookingData.movie?.title || 'N/A'}
									/>
									<InfoRow
										icon={LocationIcon}
										label="Theatre"
										value={`${bookingData.theatreName || 'N/A'} - ${bookingData.screenName || ''}`}
									/>
									<InfoRow
										icon={TimeIcon}
										label="Show Time"
										value={formatDateTime(bookingData.showTime || bookingData.show?.showTime)}
									/>
									<InfoRow
										icon={SeatIcon}
										label="Seats"
										value={
											bookingData.seats?.map((s) => `${s.row}${s.number}`).join(', ') ||
											bookingData.seatIds?.join(', ') ||
											'N/A'
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
											Tickets ({bookingData.seats?.length || bookingData.seatIds?.length || 0})
										</Typography>
										<Typography>
											₹{bookingData.totalAmount || 0}
										</Typography>
									</Stack>
									<Divider />
									<Stack direction="row" justifyContent="space-between">
										<Typography sx={{ fontWeight: 700 }}>Total Amount</Typography>
										<Typography sx={{ fontWeight: 700, color: 'primary.main' }}>
											₹{bookingData.totalAmount || 0}
										</Typography>
									</Stack>
								</Stack>

								<Button
									fullWidth
									variant="contained"
									size="large"
									onClick={handlePayment}
									disabled={paying || countdown <= 0}
									startIcon={paying ? <CircularProgress size={20} color="inherit" /> : <PaymentIcon />}
									sx={{ mt: 3, textTransform: 'none' }}
								>
									{paying ? 'Processing...' : `Pay ₹${bookingData.totalAmount || 0}`}
								</Button>

								{countdown > 0 && (
									<Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, textAlign: 'center' }}>
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
						<CircularProgress />
						<Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
							Loading booking details...
						</Typography>
					</Paper>
				)}
			</Container>
		</Box>
	);
};

export default PaymentPage;
