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
	Tooltip,
} from '@mui/material';
import {
	Search as SearchIcon,
	MoreVert as MoreVertIcon,
	Edit as EditIcon,
	Delete as DeleteIcon,
	Block as BlockIcon,
	CheckCircle as CheckCircleIcon,
	Refresh as RefreshIcon,
	FilterList as FilterListIcon,
} from '@mui/icons-material';
const AdminUsers = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [total, setTotal] = useState(0);
	const [search, setSearch] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [anchorEl, setAnchorEl] = useState(null);
	const [selectedUser, setSelectedUser] = useState(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [userToDelete, setUserToDelete] = useState(null);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleMenuOpen = (event, user) => {
		setAnchorEl(event.currentTarget);
		setSelectedUser(user);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
		setSelectedUser(null);
	};

	const handleStatusChange = (_userId, _newStatus) => {
		handleMenuClose();
	};

	const handleDeleteClick = (user) => {
		setUserToDelete(user);
		setDeleteDialogOpen(true);
		handleMenuClose();
	};

	const handleDeleteConfirm = () => {
		setDeleteDialogOpen(false);
		setUserToDelete(null);
	};

	const getStatusColor = (status) => {
		switch (status) {
			case 'active':
				return 'success';
			case 'inactive':
				return 'default';
			default:
				return 'default';
		}
	};

  return (
		<Box sx={{ py: 4 }}>
			<Container maxWidth="lg">
				{/* Header */}
				<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
					<Box>
						<Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
							User Management
						</Typography>
						<Typography color="text.secondary">
							Manage and monitor all user accounts
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
								placeholder="Search users by name or email..."
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
									<MenuItem value="active">Active</MenuItem>
									<MenuItem value="inactive">Inactive</MenuItem>
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12} md={3}>
							<Typography variant="body2" color="text.secondary">
								Total Users: <strong>{total.toLocaleString()}</strong>
							</Typography>
						</Grid>
					</Grid>
				</Paper>

				{/* Users Table */}
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
									<TableCell sx={{ fontWeight: 700 }}>User</TableCell>
									<TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
									<TableCell sx={{ fontWeight: 700 }}>Phone</TableCell>
									<TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
									<TableCell sx={{ fontWeight: 700 }}>Bookings</TableCell>
									<TableCell sx={{ fontWeight: 700 }}>Joined</TableCell>
									<TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{loading ? (
									Array.from({ length: rowsPerPage }).map((_,i) =>
									(
										<TableRow key={i}>
											<TableCell><Skeleton height={40} /></TableCell>
											<TableCell><Skeleton height={40} /></TableCell>
											<TableCell><Skeleton height={40} /></TableCell>
											<TableCell><Skeleton height={40} width={80} /></TableCell>
											<TableCell><Skeleton height={40} width={60} /></TableCell>
											<TableCell><Skeleton height={40} width={100} /></TableCell>
											<TableCell><Skeleton height={40} width={40} /></TableCell>
										</TableRow>
									))
								) : !loading && users.length > 0 ? (
									users.map((user) => (
										<TableRow key={user.id} hover>
											<TableCell>
												<Stack direction="row" spacing={1.5} alignItems="center">
													<Avatar
														sx={{
															width: 36,
															height: 36,
															bgcolor: 'primary.main',
															fontSize: '0.875rem',
														}}
													>
														{user.name?.charAt(0) || 'U'}
													</Avatar>
													<Typography variant="body2" sx={{ fontWeight: 600 }}>
														{user.name}
													</Typography>
												</Stack>
											</TableCell>
											<TableCell>
												<Typography variant="body2" color="text.secondary">
													{user.email}
												</Typography>
											</TableCell>
											<TableCell>
												<Typography variant="body2" color="text.secondary">
													{user.phone}
												</Typography>
											</TableCell>
											<TableCell>
												<Chip
													label={user.status}
													size="small"
													color={getStatusColor(user.status)}
													sx={{ textTransform: 'capitalize', fontWeight: 600 }}
												/>
											</TableCell>
											<TableCell>
												<Typography variant="body2" sx={{ fontWeight: 600 }}>
													{user.bookingsCount}
												</Typography>
											</TableCell>
											<TableCell>
												<Typography variant="body2" color="text.secondary">
													{new Date(user.joinedDate).toLocaleDateString()}
												</Typography>
											</TableCell>
											<TableCell align="right">
												<IconButton
													size="small"
													onClick={(e) => handleMenuOpen(e, user)}
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
												No users found
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
					{selectedUser?.status === 'active' ? (
						<MenuItem
							onClick={() => handleStatusChange(selectedUser.id, 'inactive')}
							sx={{ color: 'warning.main' }}
						>
							<BlockIcon sx={{ mr: 1, fontSize: 20 }} />
							Deactivate
						</MenuItem>
					) : (
						<MenuItem
							onClick={() => handleStatusChange(selectedUser.id, 'active')}
							sx={{ color: 'success.main' }}
						>
							<CheckCircleIcon sx={{ mr: 1, fontSize: 20 }} />
							Activate
						</MenuItem>
					)}
					<MenuItem
						onClick={() => handleDeleteClick(selectedUser)}
						sx={{ color: 'error.main' }}
					>
						<DeleteIcon sx={{ mr: 1, fontSize: 20 }} />
						Delete
					</MenuItem>
				</Menu>

				{/* Delete Confirmation Dialog */}
				<Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
					<DialogTitle>Delete User</DialogTitle>
					<DialogContent>
						<Typography>
							Are you sure you want to delete <strong>{userToDelete?.name}</strong>? This action cannot be undone.
						</Typography>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setDeleteDialogOpen(false)} sx={{ textTransform: 'none' }}>
							Cancel
						</Button>
						<Button
							onClick={handleDeleteConfirm}
							color="error"
							variant="contained"
							sx={{ textTransform: 'none' }}
						>
							Delete
						</Button>
					</DialogActions>
				</Dialog>
			</Container>
		</Box>
	);
};

export default AdminUsers;
