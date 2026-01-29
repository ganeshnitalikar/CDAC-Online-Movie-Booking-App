import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
	Box,
	Container,
	Typography,
	Paper,
	Button,
	Stack,
	Alert,
	IconButton,
	Divider,
	Grid,
} from '@mui/material';
import {
	ArrowBack as ArrowBackIcon,
	Movie as MovieIcon,
	LocationOn as LocationIcon,
	AccessTime as TimeIcon,
	EventSeat as SeatIcon,
	Payment as PaymentIcon,
} from '@mui/icons-material';

const BookingConfirmationPage = () => {
	const { bookingId } = useParams();
	const navigate = useNavigate();
	const location = useLocation();

	const state = location.state || {};
	const { show, selectedSeats = [], totalAmount = 0 } = state;

	const handleProceedToPayment = () => {
		navigate(`/booking/${bookingId}/payment`, { state });
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

	const missingState = !show || selectedSeats.length === 0;

	return (
		<Box sx={{ py: 4, minHeight: '80vh' }}>
			<Container maxWidth="md">
				<Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
					<IconButton onClick={() => navigate(-1)}>
						<ArrowBackIcon />
					</IconButton>
					<Box sx={{ flex: 1 }}>
						<Typography variant="h5" sx={{ fontWeight: 800 }}>
							Booking Confirmation
						</Typography>
						<Typography color="text.secondary">
							{missingState
								? 'Booking details are not available. Please re-select your seats.'
								: 'Review your booking details before proceeding to payment.'}
						</Typography>
					</Box>
				</Stack>

				{missingState && (
					<Alert severity="warning" sx={{ mb: 3 }}>
						We could not load your booking summary. Please go back and select your seats again.
					</Alert>
				)}

				{!missingState && (
					<Grid container spacing={3}>
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
										value={show?.movieTitle || show?.movie?.title || 'N/A'}
									/>
									<InfoRow
										icon={LocationIcon}
										label="Theatre"
										value={
											show?.theatreName
												? `${show.theatreName} - ${show.screenName || ''}`
												: show?.theatre?.name
												? `${show.theatre.name} - ${show.screen?.name || ''}`
												: 'N/A'
										}
									/>
									<InfoRow
										icon={TimeIcon}
										label="Show Time"
										value={formatDateTime(show?.showTime || show?.startTime || show?.show_time)}
									/>
									<InfoRow
										icon={SeatIcon}
										label="Seats"
										value={selectedSeats
											.map(
												(seat) =>
													`${seat.rowLabel || seat.row || seat.row_label}${
														seat.seatLabel || seat.seat || seat.seat_label
													}`
											)
											.join(', ')}
									/>
								</Stack>
							</Paper>
						</Grid>

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
											Tickets ({selectedSeats.length})
										</Typography>
										<Typography>₹{totalAmount}</Typography>
									</Stack>
									<Divider />
									<Stack direction="row" justifyContent="space-between">
										<Typography sx={{ fontWeight: 700 }}>Total Amount</Typography>
										<Typography sx={{ fontWeight: 700, color: 'primary.main' }}>
											₹{totalAmount}
										</Typography>
									</Stack>
								</Stack>

								<Button
									fullWidth
									variant="contained"
									size="large"
									onClick={handleProceedToPayment}
									startIcon={<PaymentIcon />}
									sx={{ mt: 3, textTransform: 'none' }}
									disabled={selectedSeats.length === 0}
								>
									Proceed to Payment
								</Button>
							</Paper>
						</Grid>
					</Grid>
				)}
			</Container>
		</Box>
	);
};

export default BookingConfirmationPage;

