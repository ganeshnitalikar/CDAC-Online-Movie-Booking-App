import React, { useState } from 'react';
import {
	Box,
	Container,
	Typography,
	Grid,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TablePagination,
	TextField,
	InputAdornment,
	Button,
	IconButton,
	Menu,
	MenuItem,
	Chip,
	Stack,
	Skeleton,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Select,
	FormControl,
	InputLabel,
	Avatar,
	Card,
	CardContent,
} from '@mui/material';
import {
	Search as SearchIcon,
	MoreVert as MoreVertIcon,
	Delete as DeleteIcon,
	CheckCircle as CheckCircleIcon,
	Cancel as CancelIcon,
	Refresh as RefreshIcon,
	FilterList as FilterListIcon,
	Movie as MovieIcon,
} from '@mui/icons-material';
const AdminMovies = () => {
	const [movies, setMovies] = useState([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [total, setTotal] = useState(0);
	const [search, setSearch] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [anchorEl, setAnchorEl] = useState(null);
	const [selectedMovie, setSelectedMovie] = useState(null);
	const [actionDialogOpen, setActionDialogOpen] = useState(false);
	const [actionType, setActionType] = useState(null);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleMenuOpen = (event, movie) => {
		setAnchorEl(event.currentTarget);
		setSelectedMovie(movie);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
		setSelectedMovie(null);
	};

	const handleStatusChange = (_movieId, _newStatus) => {
		handleMenuClose();
		setActionDialogOpen(false);
	};

	const handleActionClick = (type) => {
		setActionType(type);
		setActionDialogOpen(true);
		handleMenuClose();
	};

	const handleActionConfirm = () => {
		if (selectedMovie && actionType) {
			handleStatusChange(selectedMovie.id, actionType);
		}
	};

	const getStatusColor = (status) => {
		switch (status) {
			case 'approved':
				return 'success';
			case 'pending':
				return 'warning';
			case 'rejected':
				return 'error';
			default:
				return 'default';
		}
	};

	// Calculate summary stats
	const approvedMovies = movies.filter(m => m.status === 'approved').length;
	const pendingMovies = movies.filter(m => m.status === 'pending').length;
	const totalRevenue = movies.reduce((sum, m) => sum + (m.revenue || 0), 0);

  return (
		<Box sx={{ py: 4 }}>
			<Container maxWidth="lg">
				{/* Header */}
				<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
					<Box>
						<Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
							Movie Management
						</Typography>
						<Typography color="text.secondary">
							Review and manage all movies on the platform
						</Typography>
					</Box>
					<Button
						variant="outlined"
						startIcon={<RefreshIcon />}
						disabled
						sx={{ textTransform: 'none' }}
					>
						Refresh
					</Button>
				</Stack>

				{/* Summary Cards */}
				<Grid container spacing={3} sx={{ mb: 3 }}>
					<Grid item xs={12} sm={4}>
						<Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
							<CardContent>
								<Stack direction="row" spacing={2} alignItems="center">
									<Avatar sx={{ bgcolor: 'success.light', color: 'success.main' }}>
										<MovieIcon />
									</Avatar>
									<Box>
										<Typography variant="body2" color="text.secondary">
											Approved Movies
										</Typography>
										<Typography variant="h5" sx={{ fontWeight: 700 }}>
											{approvedMovies}
										</Typography>
									</Box>
								</Stack>
							</CardContent>
						</Card>
					</Grid>
					<Grid item xs={12} sm={4}>
						<Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
							<CardContent>
								<Stack direction="row" spacing={2} alignItems="center">
									<Avatar sx={{ bgcolor: 'warning.light', color: 'warning.main' }}>
										<MovieIcon />
									</Avatar>
									<Box>
										<Typography variant="body2" color="text.secondary">
											Pending Review
										</Typography>
										<Typography variant="h5" sx={{ fontWeight: 700 }}>
											{pendingMovies}
										</Typography>
									</Box>
								</Stack>
							</CardContent>
						</Card>
					</Grid>
					<Grid item xs={12} sm={4}>
						<Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
							<CardContent>
								<Stack direction="row" spacing={2} alignItems="center">
									<Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
										<MovieIcon />
									</Avatar>
									<Box>
										<Typography variant="body2" color="text.secondary">
											Total Revenue
										</Typography>
										<Typography variant="h5" sx={{ fontWeight: 700 }}>
											₹{(totalRevenue / 100000).toFixed(1)}L
										</Typography>
									</Box>
								</Stack>
							</CardContent>
						</Card>
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
								placeholder="Search movies by title..."
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
									<MenuItem value="approved">Approved</MenuItem>
									<MenuItem value="pending">Pending</MenuItem>
									<MenuItem value="rejected">Rejected</MenuItem>
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12} md={3}>
							<Typography variant="body2" color="text.secondary">
								Total Movies: <strong>{total.toLocaleString()}</strong>
							</Typography>
						</Grid>
					</Grid>
				</Paper>

				{/* Movies Table */}
				<Paper
					elevation={0}
					sx={{
						borderRadius: 3,
						border: '1px solid',
						borderColor: 'divider',
						overflow: 'hidden',
					}}
				>
					<TableContainer>
						<Table>
							<TableHead>
								<TableRow sx={{ bgcolor: 'background.surface' }}>
									<TableCell sx={{ fontWeight: 700 }}>Movie</TableCell>
									<TableCell sx={{ fontWeight: 700 }}>Genre</TableCell>
									<TableCell sx={{ fontWeight: 700 }}>Owner</TableCell>
									<TableCell sx={{ fontWeight: 700 }}>Rating</TableCell>
									<TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
									<TableCell sx={{ fontWeight: 700 }}>Bookings</TableCell>
									<TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{loading ? (
									Array.from({ length: rowsPerPage }).map((_, i) => (
										<TableRow key={i}>
											<TableCell><Skeleton height={60} /></TableCell>
											<TableCell><Skeleton height={40} /></TableCell>
											<TableCell><Skeleton height={40} /></TableCell>
											<TableCell><Skeleton height={40} width={60} /></TableCell>
											<TableCell><Skeleton height={40} width={80} /></TableCell>
											<TableCell><Skeleton height={40} width={60} /></TableCell>
											<TableCell><Skeleton height={40} width={40} /></TableCell>
										</TableRow>
									))
								) : !loading && movies.length > 0 ? (
									movies.map((movie) => (
										<TableRow key={movie.id} hover>
											<TableCell>
												<Stack direction="row" spacing={1.5} alignItems="center">
													<Avatar
														variant="rounded"
														src={movie.posterUrl}
														sx={{
															width: 48,
															height: 64,
															bgcolor: 'background.surface',
														}}
													>
														<MovieIcon />
													</Avatar>
													<Box>
														<Typography variant="body2" sx={{ fontWeight: 600 }}>
															{movie.title}
														</Typography>
														<Typography variant="caption" color="text.secondary">
															{movie.durationMins} mins
														</Typography>
													</Box>
												</Stack>
											</TableCell>
											<TableCell>
												<Chip
													label={movie.genre}
													size="small"
													sx={{ fontWeight: 600 }}
												/>
											</TableCell>
											<TableCell>
												<Typography variant="body2" color="text.secondary">
													{movie.ownerName}
												</Typography>
											</TableCell>
											<TableCell>
												<Typography variant="body2" sx={{ fontWeight: 600 }}>
													⭐ {movie.rating}
												</Typography>
											</TableCell>
											<TableCell>
												<Chip
													label={movie.status}
													size="small"
													color={getStatusColor(movie.status)}
													sx={{ textTransform: 'capitalize', fontWeight: 600 }}
												/>
											</TableCell>
											<TableCell>
												<Typography variant="body2" sx={{ fontWeight: 600 }}>
													{movie.bookingsCount}
												</Typography>
											</TableCell>
											<TableCell align="right">
												<IconButton
													size="small"
													onClick={(e) => handleMenuOpen(e, movie)}
												>
													<MoreVertIcon />
												</IconButton>
											</TableCell>
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell colSpan={7} align="center" sx={{ py: 4 }}>
											<Typography color="text.secondary">
												No movies found
											</Typography>
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</TableContainer>
					<TablePagination
						component="div"
						count={total}
						page={page}
						onPageChange={handleChangePage}
						rowsPerPage={rowsPerPage}
						onRowsPerPageChange={handleChangeRowsPerPage}
						rowsPerPageOptions={[10, 25, 50, 100]}
					/>
				</Paper>

				{/* Action Menu */}
				<Menu
					anchorEl={anchorEl}
					open={Boolean(anchorEl)}
					onClose={handleMenuClose}
					PaperProps={{
						sx: { minWidth: 200 }
					}}
				>
					{selectedMovie?.status === 'pending' && (
						<>
							<MenuItem
								onClick={() => handleActionClick('approved')}
								sx={{ color: 'success.main' }}
							>
								<CheckCircleIcon sx={{ mr: 1, fontSize: 20 }} />
								Approve
							</MenuItem>
							<MenuItem
								onClick={() => handleActionClick('rejected')}
								sx={{ color: 'error.main' }}
							>
								<CancelIcon sx={{ mr: 1, fontSize: 20 }} />
								Reject
							</MenuItem>
						</>
					)}
					{selectedMovie?.status === 'approved' && (
						<MenuItem
							onClick={() => handleActionClick('rejected')}
							sx={{ color: 'error.main' }}
						>
							<CancelIcon sx={{ mr: 1, fontSize: 20 }} />
							Reject
						</MenuItem>
					)}
					{selectedMovie?.status === 'rejected' && (
						<MenuItem
							onClick={() => handleActionClick('approved')}
							sx={{ color: 'success.main' }}
						>
							<CheckCircleIcon sx={{ mr: 1, fontSize: 20 }} />
							Approve
						</MenuItem>
					)}
				</Menu>

				{/* Action Confirmation Dialog */}
				<Dialog open={actionDialogOpen} onClose={() => setActionDialogOpen(false)}>
					<DialogTitle>
						{actionType === 'approved' ? 'Approve Movie' : 'Reject Movie'}
					</DialogTitle>
					<DialogContent>
						<Typography>
							Are you sure you want to {actionType === 'approved' ? 'approve' : 'reject'} <strong>{selectedMovie?.title}</strong>?
						</Typography>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setActionDialogOpen(false)} sx={{ textTransform: 'none' }}>
							Cancel
						</Button>
						<Button
							onClick={handleActionConfirm}
							color={actionType === 'approved' ? 'success' : 'error'}
							variant="contained"
							sx={{ textTransform: 'none' }}
						>
							{actionType === 'approved' ? 'Approve' : 'Reject'}
						</Button>
					</DialogActions>
				</Dialog>
			</Container>
		</Box>
	);
};

export default AdminMovies;
