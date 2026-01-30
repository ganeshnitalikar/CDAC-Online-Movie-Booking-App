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
	Chip,
	Stack,
	Skeleton,
	Select,
	FormControl,
	InputLabel,
	MenuItem,
	Card,
	CardContent,
	Avatar,
	LinearProgress,
} from '@mui/material';
import {
	Search as SearchIcon,
	Refresh as RefreshIcon,
	FilterList as FilterListIcon,
	Receipt as ReceiptIcon,
	TrendingUp as TrendingUpIcon,
	AccountBalance as AccountBalanceIcon,
	Payment as PaymentIcon,
} from '@mui/icons-material';
const AdminPayment = () => {
	const [payments, setPayments] = useState([]);
	const [stats, setStats] = useState(null);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [total, setTotal] = useState(0);
	const [search, setSearch] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const getStatusColor = (status) => {
		switch (status) {
			case 'completed':
				return 'success';
			case 'pending':
				return 'warning';
			case 'failed':
				return 'error';
			case 'refunded':
				return 'default';
			default:
				return 'default';
		}
	};

	const getPaymentMethodIcon = (method) => {
		switch (method) {
			case 'card':
				return <PaymentIcon />;
			case 'upi':
				return <AccountBalanceIcon />;
			default:
				return <ReceiptIcon />;
		}
	};

	return (
		<Box sx={{ py: 4 }}>
			<Container maxWidth="lg">
				{/* Header */}
				<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
					<Box>
						<Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
							Payment Management
						</Typography>
						<Typography color="text.secondary">
							Monitor transactions and revenue analytics
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

				{/* Statistics Cards */}
				{stats && (
					<Grid container spacing={3} sx={{ mb: 3 }}>
						<Grid item xs={12} sm={6} md={3}>
							<Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
								<CardContent>
									<Stack direction="row" spacing={2} alignItems="center">
										<Avatar sx={{ bgcolor: 'success.light', color: 'success.main' }}>
											<ReceiptIcon />
										</Avatar>
										<Box>
											<Typography variant="body2" color="text.secondary">
												Total Revenue
											</Typography>
											<Typography variant="h5" sx={{ fontWeight: 700 }}>
												₹{(stats.totalRevenue / 100000).toFixed(1)}L
											</Typography>
										</Box>
									</Stack>
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
								<CardContent>
									<Stack direction="row" spacing={2} alignItems="center">
										<Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
											<PaymentIcon />
										</Avatar>
										<Box>
											<Typography variant="body2" color="text.secondary">
												Total Transactions
											</Typography>
											<Typography variant="h5" sx={{ fontWeight: 700 }}>
												{stats.totalTransactions?.toLocaleString()}
											</Typography>
										</Box>
									</Stack>
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
								<CardContent>
									<Stack direction="row" spacing={2} alignItems="center">
										<Avatar sx={{ bgcolor: 'success.light', color: 'success.main' }}>
											<TrendingUpIcon />
										</Avatar>
										<Box>
											<Typography variant="body2" color="text.secondary">
												Successful
											</Typography>
											<Typography variant="h5" sx={{ fontWeight: 700 }}>
												{stats.successfulTransactions?.toLocaleString()}
											</Typography>
										</Box>
									</Stack>
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
								<CardContent>
									<Stack direction="row" spacing={2} alignItems="center">
										<Avatar sx={{ bgcolor: 'warning.light', color: 'warning.main' }}>
											<ReceiptIcon />
										</Avatar>
										<Box>
											<Typography variant="body2" color="text.secondary">
												Avg. Transaction
											</Typography>
											<Typography variant="h5" sx={{ fontWeight: 700 }}>
												₹{stats.averageTransactionValue}
											</Typography>
										</Box>
									</Stack>
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				)}

				{/* Payment Method Breakdown */}
				{stats?.revenueByMethod && (
					<Grid container spacing={3} sx={{ mb: 3 }}>
						<Grid item xs={12} md={6}>
							<Paper
								elevation={0}
								sx={{
									p: 3,
									borderRadius: 3,
									border: '1px solid',
									borderColor: 'divider',
								}}
							>
								<Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
									Revenue by Payment Method
								</Typography>
								<Stack spacing={2}>
									{Object.entries(stats.revenueByMethod).map(([method, revenue]) => {
										const percentage = (revenue / stats.totalRevenue) * 100;
  return (
											<Box key={method}>
												<Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
													<Typography variant="body2" sx={{ textTransform: 'capitalize', fontWeight: 600 }}>
														{method}
													</Typography>
													<Typography variant="body2" sx={{ fontWeight: 600 }}>
														₹{(revenue / 100000).toFixed(1)}L ({percentage.toFixed(1)}%)
													</Typography>
												</Stack>
												<LinearProgress
													variant="determinate"
													value={percentage}
													sx={{ height: 8, borderRadius: 1 }}
												/>
											</Box>
										);
									})}
								</Stack>
							</Paper>
						</Grid>
						<Grid item xs={12} md={6}>
							<Paper
								elevation={0}
								sx={{
									p: 3,
									borderRadius: 3,
									border: '1px solid',
									borderColor: 'divider',
								}}
							>
								<Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
									Transaction Summary
								</Typography>
								<Stack spacing={2}>
									<Stack direction="row" justifyContent="space-between" alignItems="center">
										<Typography variant="body2" color="text.secondary">
											Successful Transactions
										</Typography>
										<Chip
											label={stats.successfulTransactions?.toLocaleString()}
											color="success"
											size="small"
											sx={{ fontWeight: 600 }}
										/>
									</Stack>
									<Stack direction="row" justifyContent="space-between" alignItems="center">
										<Typography variant="body2" color="text.secondary">
											Failed Transactions
										</Typography>
										<Chip
											label={stats.failedTransactions?.toLocaleString()}
											color="error"
											size="small"
											sx={{ fontWeight: 600 }}
										/>
									</Stack>
									<Stack direction="row" justifyContent="space-between" alignItems="center">
										<Typography variant="body2" color="text.secondary">
											Success Rate
										</Typography>
										<Typography variant="body2" sx={{ fontWeight: 700, color: 'success.main' }}>
											{((stats.successfulTransactions / stats.totalTransactions) * 100).toFixed(1)}%
										</Typography>
									</Stack>
								</Stack>
							</Paper>
						</Grid>
					</Grid>
				)}

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
								placeholder="Search by transaction ID, user, or movie..."
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
									<MenuItem value="completed">Completed</MenuItem>
									<MenuItem value="pending">Pending</MenuItem>
									<MenuItem value="failed">Failed</MenuItem>
									<MenuItem value="refunded">Refunded</MenuItem>
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12} md={3}>
							<Typography variant="body2" color="text.secondary">
								Total: <strong>{total.toLocaleString()}</strong>
							</Typography>
						</Grid>
					</Grid>
				</Paper>

				{/* Payments Table */}
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
									<TableCell sx={{ fontWeight: 700 }}>Transaction ID</TableCell>
									<TableCell sx={{ fontWeight: 700 }}>User</TableCell>
									<TableCell sx={{ fontWeight: 700 }}>Movie</TableCell>
									<TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
									<TableCell sx={{ fontWeight: 700 }}>Method</TableCell>
									<TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
									<TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{loading ? (
									Array.from({ length: rowsPerPage }).map((_, i) => (
										<TableRow key={i}>
											<TableCell><Skeleton height={40} /></TableCell>
											<TableCell><Skeleton height={40} /></TableCell>
											<TableCell><Skeleton height={40} /></TableCell>
											<TableCell><Skeleton height={40} width={80} /></TableCell>
											<TableCell><Skeleton height={40} width={80} /></TableCell>
											<TableCell><Skeleton height={40} width={80} /></TableCell>
											<TableCell><Skeleton height={40} width={100} /></TableCell>
										</TableRow>
									))
								) : !loading && payments.length > 0 ? (
									payments.map((payment) => (
										<TableRow key={payment.id} hover>
											<TableCell>
												<Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
													{payment.transactionId}
												</Typography>
											</TableCell>
											<TableCell>
												<Typography variant="body2" sx={{ fontWeight: 600 }}>
													{payment.userName}
												</Typography>
											</TableCell>
											<TableCell>
												<Typography variant="body2" color="text.secondary">
													{payment.movieTitle}
												</Typography>
											</TableCell>
											<TableCell>
												<Typography variant="body2" sx={{ fontWeight: 700 }}>
													₹{payment.amount}
												</Typography>
											</TableCell>
											<TableCell>
												<Chip
													icon={getPaymentMethodIcon(payment.paymentMethod)}
													label={payment.paymentMethod.toUpperCase()}
													size="small"
													sx={{ fontWeight: 600 }}
												/>
											</TableCell>
											<TableCell>
												<Chip
													label={payment.status}
													size="small"
													color={getStatusColor(payment.status)}
													sx={{ textTransform: 'capitalize', fontWeight: 600 }}
												/>
											</TableCell>
											<TableCell>
												<Typography variant="body2" color="text.secondary">
													{new Date(payment.createdAt).toLocaleDateString()}
												</Typography>
												<Typography variant="caption" color="text.secondary">
													{new Date(payment.createdAt).toLocaleTimeString()}
												</Typography>
											</TableCell>
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell colSpan={7} align="center" sx={{ py: 4 }}>
											<Typography color="text.secondary">
												No payments found
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
			</Container>
		</Box>
	);
};

export default AdminPayment;
