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
	CheckCircle as CheckCircleIcon,
	Download as DownloadIcon,
} from '@mui/icons-material';
import { getTicket } from '../../services/bookingService';

const TicketPage = () => {
	const { bookingId } = useParams();
	const navigate = useNavigate();
	const [ticket, setTicket] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [polling, setPolling] = useState(true);
	const fetchTicket = async () => {
		try {
			const ticketData = await getTicket(bookingId);
			setTicket(ticketData);
			// if (mounted) {
			// 	setTicket(ticketData);
			// 	// Stop polling if booking is confirmed
			// 	if (ticketData.status === 'CONFIRMED' || ticketData.bookingStatus === 'CONFIRMED') {
			// 		setPolling(false);
			// 		setLoading(false);
			// 	}
			// }
		} catch (err) {
			console.error('Error fetching ticket:', err);
			// if (mounted) {
			// 	setError(err.message || 'Failed to load ticket');
			// 	setLoading(false);
			// 	setPolling(false);
			// }
		}
	};

	useEffect(() => {
		// let pollInterval;
		// let mounted = true;

		

		fetchTicket();
		setLoading(false);
		// Poll every 3 seconds if booking is not confirmed
		// if (polling) {
		// 	pollInterval = setInterval(() => {
		// 		if (mounted && polling) {
		// 			fetchTicket();
		// 		}
		// 	}, 3000);
		// }

		// return () => {
		// 	mounted = false;
		// 	if (pollInterval) {
		// 		clearInterval(pollInterval);
		// 	}
		// };
	}, [bookingId, polling]);

	const formatDateTime = (dateString) => {
		if (!dateString) return '';
		try {
			const date = new Date(dateString);
			return date.toLocaleString('en-US', {
				weekday: 'long',
				month: 'long',
				day: 'numeric',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
				hour12: true,
			});
		} catch {
			return dateString;
		}
	};

	const handleDownload = () => {
		// TODO: Implement ticket download functionality
		window.print();
	};

	const isConfirmed = ticket?.status === 'CONFIRMED' || ticket?.bookingStatus === 'CONFIRMED';

	const InfoRow = ({ icon: Icon, label, value }) => (
		<Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
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
					<IconButton onClick={() => navigate('/')}>
						<ArrowBackIcon />
					</IconButton>
					<Box sx={{ flex: 1 }}>
						<Typography variant="h5" sx={{ fontWeight: 800 }}>
							Your Ticket
						</Typography>
						<Typography color="text.secondary">
							Booking #{bookingId}
						</Typography>
					</Box>
					{isConfirmed && (
						<Chip
							icon={<CheckCircleIcon />}
							label="Confirmed"
							color="success"
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

				{loading  ? (
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
							{loading
								? 'Loading ticket details...'
								: 'Waiting for payment confirmation...'}
						</Typography>
						{!isConfirmed && (
							<Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
								This may take a few moments
							</Typography>
						)}
					</Paper>
				) : ticket ? (
					<Paper
						elevation={0}
						sx={{
							p: 4,
							borderRadius: 3,
							border: '2px solid',
							borderColor: 'primary.main',
							background: 'linear-gradient(to bottom,rgb(237, 76, 76) ,rgb(231, 0, 0))',
						}}
					>
						{/* Ticket Header */}
						<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
							<Box>
								<Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
									{ticket.movieTitle || ticket.movie?.title || 'Movie Ticket'}
								</Typography>
								<Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
									Booking ID: {bookingId}
								</Typography>
							</Box>
							<Chip
								icon={<CheckCircleIcon />}
								label="Confirmed"
								color="success"
								sx={{ fontWeight: 600 }}
							/>
						</Stack>

						<Divider sx={{ my: 3 }} />

						{/* Ticket Details */}
						<Grid container spacing={3}>
							<Grid item xs={12} md={6}>
								<InfoRow
									icon={LocationIcon}
									label="Theatre"
									value={
										ticket.theatreName
											? `${ticket.theatreName} - ${ticket.screenName || ''}`
											: 'N/A'
									}
								/>
								<InfoRow
									icon={TimeIcon}
									label="Show Time"
									value={formatDateTime(ticket.showStartTime || ticket.show?.showTime)}
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<InfoRow
									icon={SeatIcon}
									label="Seats"
									value={
										ticket.seats.join(" , ")
											 || 'N/A'
									}
								/>
								{ticket.totalAmount && (
									<InfoRow
										icon={MovieIcon}
										label="Total Amount"
										value={`₹${ticket.totalAmount}`}
									/>
								)}
							</Grid>
						</Grid>

						<Divider sx={{ my: 3 }} />

						{/* Actions */}
						<Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
							<Button
								variant="outlined"
								startIcon={<DownloadIcon />}
								onClick={handleDownload}
								sx={{ textTransform: 'none' }}
							>
								Download Ticket
							</Button>
							<Button
								variant="contained"
								onClick={() => navigate('/')}
								sx={{ textTransform: 'none' }}
							>
								Back to Home
							</Button>
						</Stack>
					</Paper>
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
							Ticket Not Found
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Unable to load ticket details.
						</Typography>
					</Paper>
				)}
			</Container>
		</Box>
	);
};

export default TicketPage;
