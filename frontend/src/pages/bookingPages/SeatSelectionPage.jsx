import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
	Box,
	Container,
	Typography,
	Grid,
	Paper,
	Button,
	Stack,
	Alert,
	Skeleton,
	IconButton,
	CircularProgress,
	Divider,
	Chip,
} from '@mui/material';
import {
	ArrowBack as ArrowBackIcon,
	EventSeat as SeatIcon,
} from '@mui/icons-material';
import { getShowById } from '../../services/showService';
import { initiateBooking } from '../../services/bookingService';

const SeatSelectionPage = () => {
	const { showId } = useParams();
	const navigate = useNavigate();
	const [show, setShow] = useState(null);
	const [selectedSeats, setSelectedSeats] = useState([]);
	const [bookedSeats, setBookedSeats] = useState([]);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchShow = async () => {
			setLoading(true);
			setError(null);
			try {
				const showData = await getShowById(showId);
				setShow(showData);
				// Extract booked seats from show data
				if (showData.bookedSeats) {
					setBookedSeats(showData.bookedSeats);
				} else if (showData.seats) {
					const booked = showData.seats
						.filter((seat) => seat.status === 'BOOKED' || seat.status === 'LOCKED')
						.map((seat) => seat.id);
					setBookedSeats(booked);
				}
			} catch (err) {
				console.error('Error fetching show:', err);
				setError(err.message || 'Failed to load show details');
			} finally {
				setLoading(false);
			}
		};

		if (showId) {
			fetchShow();
		}
	}, [showId]);

	// Mock seat layout - 10 rows x 12 seats
	const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
	const SEATS_PER_ROW = 12;

	const isSeatBooked = (seatId) => {
		return bookedSeats.includes(seatId);
	};

	const isSeatSelected = (seatId) => {
		return selectedSeats.includes(seatId);
	};

	const toggleSeat = (seatId) => {
		if (isSeatBooked(seatId)) return;
		setSelectedSeats((prev) =>
			prev.includes(seatId)
				? prev.filter((id) => id !== seatId)
				: [...prev, seatId]
		);
		setError(null);
	};

	const handleProceed = async () => {
		if (selectedSeats.length === 0) {
			setError('Please select at least one seat');
			return;
		}

		setSubmitting(true);
		setError(null);

		try {
			const bookingData = await initiateBooking(Number(showId), selectedSeats);
			navigate(`/booking/${bookingData.bookingId}/confirm`);
		} catch (err) {
			console.error('Error initiating booking:', err);
			if (err.message.includes('409') || err.message.includes('already locked')) {
				setError('Some seats are already locked. Please select different seats.');
				// Refresh show data to get updated seat status
				const showData = await getShowById(showId);
				if (showData.seats) {
					const booked = showData.seats
						.filter((seat) => seat.status === 'BOOKED' || seat.status === 'LOCKED')
						.map((seat) => seat.id);
					setBookedSeats(booked);
				}
			} else if (err.message.includes('410')) {
				setError('Booking session expired. Redirecting...');
				setTimeout(() => {
					navigate(`/shows/${showId}/seats`);
				}, 2000);
			} else {
				setError(err.message || 'Failed to initiate booking');
			}
		} finally {
			setSubmitting(false);
		}
	};

	const SeatButton = ({ seatId, row, number }) => {
		const booked = isSeatBooked(seatId);
		const selected = isSeatSelected(seatId);

		return (
			<Button
				variant={selected ? 'contained' : booked ? 'outlined' : 'outlined'}
				color={selected ? 'primary' : booked ? 'error' : 'inherit'}
				disabled={booked}
				onClick={() => toggleSeat(seatId)}
				sx={{
					minWidth: 40,
					width: 40,
					height: 40,
					p: 0,
					fontSize: '0.75rem',
					textTransform: 'none',
					'&:disabled': {
						opacity: 0.5,
					},
				}}
			>
				{number}
			</Button>
		);
	};

	return (
		<Box sx={{ py: 4 }}>
			<Container maxWidth="lg">
				{/* Header */}
				<Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
					<IconButton onClick={() => navigate(-1)}>
						<ArrowBackIcon />
					</IconButton>
					<Box sx={{ flex: 1 }}>
						<Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
							Select Seats
						</Typography>
						<Typography color="text.secondary">
							{show ? `Choose your seats for the show` : 'Select your preferred seats'}
						</Typography>
					</Box>
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
							Loading seat layout...
						</Typography>
					</Paper>
				) : (
					<Grid container spacing={3}>
						{/* Seat Layout */}
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
								<Typography variant="h6" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
									Screen
								</Typography>
								<Box
									sx={{
										width: '100%',
										height: 4,
										background: 'linear-gradient(to right, transparent, #1976d2, transparent)',
										mb: 4,
										borderRadius: 2,
									}}
								/>

								<Stack spacing={2} sx={{ mb: 3 }}>
									{ROWS.map((row) => (
										<Stack
											key={row}
											direction="row"
											spacing={1}
											justifyContent="center"
											alignItems="center"
										>
											<Typography
												variant="body2"
												sx={{ minWidth: 24, fontWeight: 600 }}
											>
												{row}
											</Typography>
											{Array.from({ length: SEATS_PER_ROW }, (_, i) => {
												const seatNumber = i + 1;
												const seatId = `${row}${seatNumber}`;
												// Use actual seat ID if available, otherwise use generated ID
												const actualSeatId = show?.seats?.find(
													(s) => s.row === row && s.number === seatNumber
												)?.id || seatId;
												return (
													<SeatButton
														key={seatNumber}
														seatId={actualSeatId}
														row={row}
														number={seatNumber}
													/>
												);
											})}
										</Stack>
									))}
								</Stack>

								{/* Legend */}
								<Stack direction="row" spacing={3} justifyContent="center" sx={{ mt: 4 }}>
									<Stack direction="row" spacing={1} alignItems="center">
										<Box
											sx={{
												width: 24,
												height: 24,
												borderRadius: 1,
												border: '1px solid',
												borderColor: 'divider',
											}}
										/>
										<Typography variant="caption">Available</Typography>
									</Stack>
									<Stack direction="row" spacing={1} alignItems="center">
										<Box
											sx={{
												width: 24,
												height: 24,
												borderRadius: 1,
												bgcolor: 'primary.main',
											}}
										/>
										<Typography variant="caption">Selected</Typography>
									</Stack>
									<Stack direction="row" spacing={1} alignItems="center">
										<Box
											sx={{
												width: 24,
												height: 24,
												borderRadius: 1,
												border: '1px solid',
												borderColor: 'error.main',
											}}
										/>
										<Typography variant="caption">Booked</Typography>
									</Stack>
								</Stack>
							</Paper>
						</Grid>

						{/* Booking Summary */}
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
									Booking Summary
								</Typography>

								{show && (
									<Stack spacing={1.5} sx={{ mb: 3 }}>
										<Typography variant="body2" color="text.secondary">
											Show Time: {new Date(show.showTime || show.startTime).toLocaleString()}
										</Typography>
										{show.price && (
											<Typography variant="body2" color="text.secondary">
												Price per seat: ₹{show.price}
											</Typography>
										)}
									</Stack>
								)}

								<Divider sx={{ my: 2 }} />

								<Stack spacing={1.5} sx={{ mb: 3 }}>
									<Typography variant="body2" color="text.secondary">
										Selected Seats ({selectedSeats.length})
									</Typography>
									{selectedSeats.length > 0 ? (
										<Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
											{selectedSeats.map((seatId) => (
												<Chip key={seatId} label={seatId} size="small" />
											))}
										</Stack>
									) : (
										<Typography variant="caption" color="text.secondary">
											No seats selected
										</Typography>
									)}
								</Stack>

								{show?.price && selectedSeats.length > 0 && (
									<>
										<Divider sx={{ my: 2 }} />
										<Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
											<Typography variant="body1" sx={{ fontWeight: 600 }}>
												Total Amount
											</Typography>
											<Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
												₹{show.price * selectedSeats.length}
											</Typography>
										</Stack>
									</>
								)}

								<Button
									fullWidth
									variant="contained"
									size="large"
									onClick={handleProceed}
									disabled={submitting || selectedSeats.length === 0}
									startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SeatIcon />}
									sx={{ textTransform: 'none', mt: 2 }}
								>
									{submitting ? 'Processing...' : 'Proceed to Booking'}
								</Button>
							</Paper>
						</Grid>
					</Grid>
				)}
			</Container>
		</Box>
	);
};

export default SeatSelectionPage;
