import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
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
	Grid,
	Chip,
	Table,
	TableBody,
	TableCell,
	TableRow,
	TableContainer,
} from '@mui/material';
import {
	ArrowBack as ArrowBackIcon,
	Movie as MovieIcon,
	LocationOn as LocationOnIcon,
	AccessTime as TimeIcon,
	EventSeat as SeatIcon,
	CheckCircle as CheckCircleIcon,
	Download as DownloadIcon,
	ConfirmationNumber as TicketIcon,
} from '@mui/icons-material';
import { getTicket } from '../../services/bookingService';
import { getMovieById } from '../../services/movie.public.service';

const formatDateTime = (dateString) => {
	if (!dateString) return '—';
	try {
		const date = new Date(dateString);
		return date.toLocaleString('en-IN', {
			weekday: 'long',
			day: '2-digit',
			month: 'long',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			hour12: true,
		});
	} catch {
		return String(dateString);
	}
};

const TicketPage = () => {
	const theme = useTheme();
	const { bookingId } = useParams();
	const navigate = useNavigate();
	const [ticket, setTicket] = useState(null);
	const [movieName, setMovieName] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchTicket = async () => {
		try {
			const ticketData = await getTicket(bookingId);
			setTicket(ticketData);
			setError(null);
			// Fetch movie name by movieId so we show title, not ID
			if (ticketData?.movieId) {
				try {
					const movie = await getMovieById(ticketData.movieId);
					setMovieName(movie?.title ?? movie?.name ?? null);
				} catch (movieErr) {
					console.error('Error fetching movie details:', movieErr);
					setMovieName(null);
				}
			} else {
				setMovieName(null);
			}
		} catch (err) {
			console.error('Error fetching ticket:', err);
			setError(err.message || 'Failed to load ticket');
			setTicket(null);
			setMovieName(null);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (bookingId) fetchTicket();
	}, [bookingId]);

	const handleDownload = () => {
		window.print();
	};

	const isConfirmed =
		ticket?.status === 'CONFIRMED' || ticket?.bookingStatus === 'CONFIRMED';

	// Movie name: from fetched movie details, or ticket payload, never raw movieId
	const movieTitle =
		movieName ||
		ticket?.movieTitle ||
		ticket?.movie?.title ||
		'—';
	const theatreName = ticket?.theatreName || '—';
	const screenName = ticket?.screenName || '—';
	const showTime = formatDateTime(ticket?.showStartTime || ticket?.show?.showTime);
	const seatsList = Array.isArray(ticket?.seats) ? ticket.seats : [];
	const seatsDisplay = seatsList.length > 0 ? seatsList.join(', ') : '—';
	const totalAmount = ticket?.totalAmount ?? ticket?.total ?? null;
	const bookingIdDisplay = ticket?.bookingId ?? bookingId;

	// Extra fields on ticket (for "full data") – exclude already-rendered keys
	const displayKeys = [
		'bookingId',
		'movieId',
		'movieTitle',
		'theatreName',
		'screenName',
		'seats',
		'showStartTime',
		'totalAmount',
		'total',
		'status',
		'bookingStatus',
		'movie',
		'show',
	];
	const extraTicketKeys = ticket
		? Object.keys(ticket).filter((k) => !displayKeys.includes(k))
		: [];

	if (loading) {
		return (
			<Box sx={{ py: 4, minHeight: '80vh' }}>
				<Container maxWidth="md">
					<Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
						<IconButton onClick={() => navigate('/')} size="large">
							<ArrowBackIcon />
						</IconButton>
						<Box sx={{ flex: 1 }}>
							<Typography variant="h5" sx={{ fontWeight: 800 }}>
								Your Ticket
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Booking #{bookingId}
							</Typography>
						</Box>
					</Stack>
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
						<CircularProgress sx={{ color: 'primary.main' }} />
						<Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
							Loading ticket...
						</Typography>
					</Paper>
				</Container>
			</Box>
		);
	}

	return (
		<Box sx={{ py: 4, minHeight: '80vh' }} className="ticket-page">
			<Container maxWidth="md">
				{/* Page header */}
				<Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }} className="no-print">
					<IconButton onClick={() => navigate('/')} size="large">
						<ArrowBackIcon />
					</IconButton>
					<Box sx={{ flex: 1 }}>
						<Typography variant="h5" sx={{ fontWeight: 800 }}>
							Your Ticket
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Booking #{bookingId}
						</Typography>
					</Box>
					{isConfirmed && (
						<Chip
							icon={<CheckCircleIcon />}
							label="Confirmed"
							color="success"
							variant="filled"
							sx={{ fontWeight: 600 }}
						/>
					)}
				</Stack>

				{error && (
					<Alert
						severity="error"
						sx={{ mb: 3 }}
						onClose={() => setError(null)}
						className="no-print"
					>
						{error}
					</Alert>
				)}

				{!ticket ? (
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
							Ticket not found
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Unable to load ticket details.
						</Typography>
					</Paper>
				) : (
					<Paper
						elevation={0}
						sx={{
							overflow: 'hidden',
							borderRadius: 3,
							border: '1px solid',
							borderColor: 'divider',
							backgroundColor: 'background.paper',
							boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
						}}
						className="ticket-card"
					>
						{/* Ticket header strip – theme primary */}
						<Box
							sx={{
								px: 3,
								py: 2.5,
								background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
								color: theme.palette.primary.contrastText,
							}}
						>
							<Stack direction="row" alignItems="center" spacing={2}>
								<Box
									sx={{
										width: 48,
										height: 48,
										borderRadius: 2,
										bgcolor: 'rgba(255,255,255,0.2)',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<TicketIcon sx={{ fontSize: 28 }} />
								</Box>
								<Box sx={{ flex: 1 }}>
									<Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
										{movieTitle}
									</Typography>
									<Typography variant="body2" sx={{ opacity: 0.95, mt: 0.25 }}>
										Booking ID: {bookingIdDisplay}
									</Typography>
								</Box>
								{isConfirmed && (
									<Chip
										icon={<CheckCircleIcon />}
										label="Confirmed"
										size="medium"
										sx={{
											bgcolor: 'rgba(255,255,255,0.25)',
											color: 'inherit',
											fontWeight: 600,
											'& .MuiChip-icon': { color: 'inherit' },
										}}
									/>
								)}
							</Stack>
						</Box>

						{/* Main ticket body */}
						<Box sx={{ px: 3, py: 3 }}>
							<Grid container spacing={3}>
								<Grid item xs={12} md={6}>
									<Stack spacing={2.5}>
										<Stack direction="row" spacing={2} alignItems="flex-start">
											<Box
												sx={{
													width: 40,
													height: 40,
													borderRadius: 2,
													bgcolor: 'primary.light',
													color: 'primary.main',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
												}}
											>
												<LocationOnIcon sx={{ fontSize: 20 }} />
											</Box>
											<Box>
												<Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
													Theatre
												</Typography>
												<Typography variant="body1" sx={{ fontWeight: 600 }}>
													{theatreName}
												</Typography>
												<Typography variant="body2" color="text.secondary">
													Screen: {screenName}
												</Typography>
											</Box>
										</Stack>
										<Stack direction="row" spacing={2} alignItems="flex-start">
											<Box
												sx={{
													width: 40,
													height: 40,
													borderRadius: 2,
													bgcolor: 'secondary.light',
													color: 'secondary.main',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
												}}
											>
												<TimeIcon sx={{ fontSize: 20 }} />
											</Box>
											<Box>
												<Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
													Show time
												</Typography>
												<Typography variant="body1" sx={{ fontWeight: 600 }}>
													{showTime}
												</Typography>
											</Box>
										</Stack>
									</Stack>
								</Grid>
								<Grid item xs={12} md={6}>
									<Stack spacing={2.5}>
										<Stack direction="row" spacing={2} alignItems="flex-start">
											<Box
												sx={{
													width: 40,
													height: 40,
													borderRadius: 2,
													bgcolor: 'success.light',
													color: 'success.main',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
												}}
											>
												<SeatIcon sx={{ fontSize: 20 }} />
											</Box>
											<Box>
												<Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
													Seats
												</Typography>
												<Typography variant="body1" sx={{ fontWeight: 600 }}>
													{seatsDisplay}
												</Typography>
												{seatsList.length > 0 && (
													<Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ mt: 0.5 }}>
														{seatsList.map((s) => (
															<Chip key={s} label={s} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
														))}
													</Stack>
												)}
											</Box>
										</Stack>
										{totalAmount != null && (
											<Stack direction="row" spacing={2} alignItems="flex-start">
												<Box
													sx={{
														width: 40,
														height: 40,
														borderRadius: 2,
														bgcolor: 'primary.light',
														color: 'primary.main',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
													}}
												>
													<MovieIcon sx={{ fontSize: 20 }} />
												</Box>
												<Box>
													<Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
														Total amount
													</Typography>
													<Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
														₹{totalAmount}
													</Typography>
												</Box>
											</Stack>
										)}
									</Stack>
								</Grid>
							</Grid>

							{/* Full ticket data table – all keys */}
							{extraTicketKeys.length > 0 && (
								<Box sx={{ mt: 4 }}>
									<Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 600 }}>
										All ticket data
									</Typography>
									<TableContainer
										component={Paper}
										variant="outlined"
										elevation={0}
										sx={{
											borderRadius: 2,
											border: '1px solid',
											borderColor: 'divider',
											overflow: 'hidden',
										}}
									>
										<Table size="small">
											<TableBody>
												{[
													{ key: 'Booking ID', value: bookingIdDisplay },
													{ key: 'Movie', value: movieTitle },
													{ key: 'Theatre', value: theatreName },
													{ key: 'Screen', value: screenName },
													{ key: 'Show time', value: showTime },
													{ key: 'Seats', value: seatsDisplay },
													...(totalAmount != null ? [{ key: 'Total amount', value: `₹${totalAmount}` }] : []),
													...(ticket.status ? [{ key: 'Status', value: ticket.status }] : []),
													...(ticket.bookingStatus ? [{ key: 'Booking status', value: ticket.bookingStatus }] : []),
													...extraTicketKeys.map((k) => ({
														key: k,
														value: typeof ticket[k] === 'object' ? JSON.stringify(ticket[k]) : String(ticket[k] ?? '—'),
													})),
												].map(({ key, value }) => (
													<TableRow key={key}>
														<TableCell sx={{ fontWeight: 600, width: '40%' }}>{key}</TableCell>
														<TableCell>{value}</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</TableContainer>
								</Box>
							)}

							{/* If no extra keys, still show a compact "all data" list */}
							{extraTicketKeys.length === 0 && (
								<Box sx={{ mt: 4 }}>
									<Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 600 }}>
										Ticket summary
									</Typography>
									<TableContainer
										component={Paper}
										variant="outlined"
										elevation={0}
										sx={{
											borderRadius: 2,
											border: '1px solid',
											borderColor: 'divider',
											overflow: 'hidden',
										}}
									>
										<Table size="small">
											<TableBody>
												<TableRow><TableCell sx={{ fontWeight: 600 }}>Booking ID</TableCell><TableCell>{bookingIdDisplay}</TableCell></TableRow>
												<TableRow><TableCell sx={{ fontWeight: 600 }}>Movie</TableCell><TableCell>{movieTitle}</TableCell></TableRow>
												<TableRow><TableCell sx={{ fontWeight: 600 }}>Theatre</TableCell><TableCell>{theatreName}</TableCell></TableRow>
												<TableRow><TableCell sx={{ fontWeight: 600 }}>Screen</TableCell><TableCell>{screenName}</TableCell></TableRow>
												<TableRow><TableCell sx={{ fontWeight: 600 }}>Show time</TableCell><TableCell>{showTime}</TableCell></TableRow>
												<TableRow><TableCell sx={{ fontWeight: 600 }}>Seats</TableCell><TableCell>{seatsDisplay}</TableCell></TableRow>
												{totalAmount != null && (
													<TableRow><TableCell sx={{ fontWeight: 600 }}>Total amount</TableCell><TableCell>₹{totalAmount}</TableCell></TableRow>
												)}
												{ticket.status && <TableRow><TableCell sx={{ fontWeight: 600 }}>Status</TableCell><TableCell>{ticket.status}</TableCell></TableRow>}
												{ticket.bookingStatus && <TableRow><TableCell sx={{ fontWeight: 600 }}>Booking status</TableCell><TableCell>{ticket.bookingStatus}</TableCell></TableRow>}
											</TableBody>
										</Table>
									</TableContainer>
								</Box>
							)}
						</Box>

						{/* Actions */}
						<Box
							sx={{
								px: 3,
								py: 2,
								borderTop: '1px solid',
								borderColor: 'divider',
								bgcolor: 'background.default',
							}}
							className="no-print"
						>
							<Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
								<Button
									variant="outlined"
									startIcon={<DownloadIcon />}
									onClick={handleDownload}
									sx={{ textTransform: 'none', fontWeight: 600 }}
								>
									Download / Print
								</Button>
								<Button
									variant="contained"
									onClick={() => navigate('/')}
									sx={{ textTransform: 'none', fontWeight: 600 }}
								>
									Back to Home
								</Button>
							</Stack>
						</Box>
					</Paper>
				)}
			</Container>

			{/* Print-only: hide nav, show ticket only */}
			<style>{`
				@media print {
					.ticket-page .no-print { display: none !important; }
					.ticket-page .ticket-card { box-shadow: none !important; }
					.ticket-page { padding: 0 !important; }
				}
			`}</style>

