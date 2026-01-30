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
import { getSeatsByShow, getShowById } from '../../services/showService';
import { initiateBooking } from '../../services/bookingService';

const SeatSelectionPage = () => {
	const { showId } = useParams();
	const navigate = useNavigate();
	const [show, setShow] = useState(null);
	const [selectedSeats, setSelectedSeats] = useState([]);
	const [selectedSeatDetails, setSelectedSeatDetails] = useState([]);
	const [availableSeats, setAvailableSeats] = useState([]);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchShowAndSeats = async () => {
			setLoading(true);
			setError(null);
			try {
				const [showData, seatsData] = await Promise.all([
					getShowById(showId),
					getSeatsByShow(showId),
				]);
				setShow(showData);
				const seats = Array.isArray(seatsData) ? seatsData : [];
				setAvailableSeats(seats);
			} catch (err) {
				console.error('Error fetching show:', err);
				setError(err.message || 'Failed to load show details');
			} finally {
				setLoading(false);
			}
		};

		if (showId) {
			fetchShowAndSeats();
		}
	}, [showId]);

	const getSeatRows = () => {
		if (!availableSeats || availableSeats.length === 0) return [];
		const rows = [...new Set(availableSeats.map((seat) => seat.rowLabel))];
		return rows.sort();
	};

	const getSeatsForRow = (row) => {
		if (!availableSeats || availableSeats.length === 0) return [];
		return availableSeats
			.filter((seat) => seat.rowLabel === row)
			.sort((a, b) => {
				const aNum = parseInt(a.seatLabel || '0', 10);
				const bNum = parseInt(b.seatLabel || '0', 10);
				return aNum - bNum;
			});
	};

	const isSeatBooked = (seat) =>
		seat.status === 'BOOKED' || seat.status === 'LOCKED';

	const getSeatPrice = (seat) => {
		if (!seat) return show?.price || 0;
		if (seat.type === 'PREMIUM') {
			return show?.premiumPrice || show?.premium_price || show?.price || 300;
		}
		return show?.normalPrice || show?.normal_price || show?.price || 200;
	};

	const toggleSeat = (seat) => {
		if (isSeatBooked(seat)) return;

		const seatId = seat.seatId;

		setSelectedSeats((prev) => {
			if (prev.includes(seatId)) {
				setSelectedSeatDetails((prevDetails) =>
					prevDetails.filter((s) => s.seatId !== seatId)
				);
				return prev.filter((id) => id !== seatId);
			}
			setSelectedSeatDetails((prevDetails) => [...prevDetails, seat]);
			return [...prev, seatId];
		});
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
			// Ensure seatIds is always an array
			const seatIdsArray = Array.isArray(selectedSeats) ? selectedSeats : [selectedSeats];
			const bookingData = await initiateBooking(Number(showId), seatIdsArray);

			// Prepare summary data for confirmation page
			const totalAmount = selectedSeatDetails.reduce(
				(total, seat) => total + getSeatPrice(seat),
				0
			);

			// After initiating booking, navigate to confirmation page first
			navigate(`/booking/${bookingData.bookingId}/confirm`, {
				state: {
					show,
					selectedSeats: selectedSeatDetails,
					totalAmount,
				},
			});
		} catch (err) {
			console.error('Error initiating booking:', err);
			if (err.message.includes('409') || err.message.includes('already locked')) {
				setError('Some seats are already locked. Please select different seats.');
				const seatsData = await getSeatsByShow(showId);
				const seats = Array.isArray(seatsData) ? seatsData : [];
				setAvailableSeats(seats);
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

	const SeatButton = ({ seat }) => {
		const seatId = seat.seatId;
		const selected = selectedSeats.includes(seatId);
		const booked = isSeatBooked(seat);
		const isPremium = seat.type === 'PREMIUM';

		return (
			<Button
				variant={selected ? 'contained' : 'outlined'}
				color={
					booked
						? 'error'
						: selected
							? 'primary'
							: isPremium
								? 'secondary'
								: 'inherit'
				}
				disabled={booked}
				onClick={() => toggleSeat(seat)}
				sx={{
					minWidth: 40,
					width: 40,
					height: 40,
					p: 0,
					fontSize: '0.75rem',
					textTransform: 'none',
					opacity: booked ? 0.6 : 1,
					cursor: booked ? 'not-allowed' : 'pointer',
				}}
				title={
					booked
						? seat.status === 'BOOKED'
							? 'Already Booked'
							: 'Temporarily Locked'
						: isPremium
							? 'Premium Seat'
							: 'Normal Seat'
				}
			>
				{seat.seatLabel}
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
									{availableSeats.length > 0 ? (
										getSeatRows().map((row) => {
											const rowSeats = getSeatsForRow(row);
											return (
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
													{rowSeats.map((seat) => (
														<SeatButton
															key={seat.seatId}
															seat={seat}
														/>
													))}
												</Stack>
											);
										})
									) : (
										<Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
											No seats available for this show
										</Typography>
									)}
								</Stack>

								{/* Legend */}
								<Stack direction="row" spacing={3} justifyContent="center" flexWrap="wrap" sx={{ mt: 4, gap: 2 }}>
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
												borderColor: 'secondary.main',
											}}
										/>
										<Typography variant="caption">Premium</Typography>
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
											Show Time: {new Date(show.showTime || show.startTime || show.show_time).toLocaleString()}
										</Typography>
										{show.normalPrice && (
											<Typography variant="body2" color="text.secondary">
												Normal: ₹{show.normalPrice || show.normal_price}
											</Typography>
										)}
										{show.premiumPrice && (
											<Typography variant="body2" color="text.secondary">
												Premium: ₹{show.premiumPrice || show.premium_price}
											</Typography>
										)}
										{!show.normalPrice && !show.premiumPrice && show.price && (
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
											{selectedSeatDetails.map((seat) => (
												<Chip
													key={seat.seatId}
													label={`${seat.rowLabel}${seat.seatLabel}`}
													size="small"
													color={seat.type === 'PREMIUM' ? 'secondary' : 'default'}
												/>
											))}
										</Stack>
									) : (
										<Typography variant="caption" color="text.secondary">
											No seats selected
										</Typography>
									)}
								</Stack>

								{selectedSeats.length > 0 && (
									<>
										<Divider sx={{ my: 2 }} />
										<Stack spacing={1.5} sx={{ mb: 2 }}>
											{selectedSeatDetails.map((seat) => (
												<Stack key={seat.seatId} direction="row" justifyContent="space-between">
													<Typography variant="body2">
														{seat.rowLabel}{seat.seatLabel}{' '}
														{seat.type === 'PREMIUM' && (
															<Chip label="Premium" size="small" color="secondary" sx={{ ml: 0.5, height: 18 }} />
														)}
													</Typography>
													<Typography variant="body2" sx={{ fontWeight: 600 }}>
														₹{getSeatPrice(seat)}
													</Typography>
												</Stack>
											))}
										</Stack>
										<Divider sx={{ my: 1 }} />
										<Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
											<Typography variant="body1" sx={{ fontWeight: 600 }}>
												Total Amount
											</Typography>
											<Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
												₹{selectedSeatDetails.reduce((total, seat) => total + getSeatPrice(seat), 0)}
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
