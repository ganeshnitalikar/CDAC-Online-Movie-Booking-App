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
	Avatar,
} from '@mui/material';
import {
	Search as SearchIcon,
	Refresh as RefreshIcon,
	FilterList as FilterListIcon,
	Info as InfoIcon,
	Warning as WarningIcon,
	Error as ErrorIcon,
	CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
const AdminLogs = () => {
	const [logs, setLogs] = useState([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(50);
	const [total, setTotal] = useState(0);
	const [search, setSearch] = useState('');
	const [levelFilter, setLevelFilter] = useState('all');

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const getLevelColor = (level) => {
		switch (level) {
			case 'info':
				return 'info';
			case 'success':
				return 'success';
			case 'warning':
				return 'warning';
			case 'error':
				return 'error';
			default:
				return 'default';
		}
	};

	const getLevelIcon = (level) => {
		switch (level) {
			case 'info':
				return <InfoIcon />;
			case 'success':
				return <CheckCircleIcon />;
			case 'warning':
				return <WarningIcon />;
			case 'error':
				return <ErrorIcon />;
			default:
				return <InfoIcon />;
		}
	};

	// Calculate level counts
	const levelCounts = {
		info: logs.filter(l => l.level === 'info').length,
		success: logs.filter(l => l.level === 'success').length,
		warning: logs.filter(l => l.level === 'warning').length,
		error: logs.filter(l => l.level === 'error').length,
	};

	return (
		<Box sx={{ py: 4 }}>
			<Container maxWidth="lg">
				{/* Header */}
				<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
					<Box>
						<Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
							System Logs
						</Typography>
						<Typography color="text.secondary">
							Monitor system activity and events
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

				{/* Level Summary */}
				<Grid container spacing={2} sx={{ mb: 3 }}>
					<Grid item xs={6} sm={3}>
						<Paper
							elevation={0}
							sx={{
								p: 2,
								borderRadius: 2,
								border: '1px solid',
								borderColor: 'divider',
								textAlign: 'center',
							}}
						>
							<Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ mb: 1 }}>
								<InfoIcon color="info" />
								<Typography variant="h5" sx={{ fontWeight: 700 }}>
									{levelCounts.info}
								</Typography>
							</Stack>
							<Typography variant="caption" color="text.secondary">
								Info
							</Typography>
						</Paper>
					</Grid>
					<Grid item xs={6} sm={3}>
						<Paper
							elevation={0}
							sx={{
								p: 2,
								borderRadius: 2,
								border: '1px solid',
								borderColor: 'divider',
								textAlign: 'center',
							}}
						>
							<Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ mb: 1 }}>
								<CheckCircleIcon color="success" />
								<Typography variant="h5" sx={{ fontWeight: 700 }}>
									{levelCounts.success}
								</Typography>
							</Stack>
							<Typography variant="caption" color="text.secondary">
								Success
							</Typography>
						</Paper>
					</Grid>
					<Grid item xs={6} sm={3}>
						<Paper
							elevation={0}
							sx={{
								p: 2,
								borderRadius: 2,
								border: '1px solid',
								borderColor: 'divider',
								textAlign: 'center',
							}}
						>
							<Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ mb: 1 }}>
								<WarningIcon color="warning" />
								<Typography variant="h5" sx={{ fontWeight: 700 }}>
									{levelCounts.warning}
								</Typography>
							</Stack>
							<Typography variant="caption" color="text.secondary">
								Warning
							</Typography>
						</Paper>
					</Grid>
					<Grid item xs={6} sm={3}>
						<Paper
							elevation={0}
							sx={{
								p: 2,
								borderRadius: 2,
								border: '1px solid',
								borderColor: 'divider',
								textAlign: 'center',
							}}
						>
							<Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ mb: 1 }}>
								<ErrorIcon color="error" />
								<Typography variant="h5" sx={{ fontWeight: 700 }}>
									{levelCounts.error}
								</Typography>
							</Stack>
							<Typography variant="caption" color="text.secondary">
								Error
							</Typography>
						</Paper>
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
								placeholder="Search logs by message or action..."
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
								<InputLabel>Level</InputLabel>
								<Select
									value={levelFilter}
									label="Level"
									onChange={(e) => setLevelFilter(e.target.value)}
									startAdornment={<FilterListIcon sx={{ mr: 1, color: 'text.secondary' }} />}
								>
									<MenuItem value="all">All Levels</MenuItem>
									<MenuItem value="info">Info</MenuItem>
									<MenuItem value="success">Success</MenuItem>
									<MenuItem value="warning">Warning</MenuItem>
									<MenuItem value="error">Error</MenuItem>
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12} md={3}>
							<Typography variant="body2" color="text.secondary">
								Total Logs: <strong>{total.toLocaleString()}</strong>
							</Typography>
						</Grid>
					</Grid>
				</Paper>

				{/* Logs Table */}
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
									<TableCell sx={{ fontWeight: 700 }}>Level</TableCell>
									<TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
									<TableCell sx={{ fontWeight: 700 }}>Message</TableCell>
									<TableCell sx={{ fontWeight: 700 }}>User</TableCell>
									<TableCell sx={{ fontWeight: 700 }}>IP Address</TableCell>
									<TableCell sx={{ fontWeight: 700 }}>Timestamp</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{loading ? (
									Array.from({ length: rowsPerPage }).map((_, i) => (
										<TableRow key={i}>
											<TableCell><Skeleton height={40} width={60} /></TableCell>
											<TableCell><Skeleton height={40} /></TableCell>
											<TableCell><Skeleton height={40} /></TableCell>
											<TableCell><Skeleton height={40} /></TableCell>
											<TableCell><Skeleton height={40} width={120} /></TableCell>
											<TableCell><Skeleton height={40} width={150} /></TableCell>
										</TableRow>
									))
								) : !loading && logs.length > 0 ? (
									logs.map((log) => (
										<TableRow key={log.id} hover>
											<TableCell>
												<Chip
													icon={getLevelIcon(log.level)}
													label={log.level}
													size="small"
													color={getLevelColor(log.level)}
													sx={{ textTransform: 'capitalize', fontWeight: 600 }}
												/>
											</TableCell>
											<TableCell>
												<Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
													{log.action?.replace('_', ' ')}
												</Typography>
											</TableCell>
											<TableCell>
												<Typography variant="body2" color="text.secondary">
													{log.message}
												</Typography>
											</TableCell>
											<TableCell>
												<Stack direction="row" spacing={1} alignItems="center">
													<Avatar
														sx={{
															width: 24,
															height: 24,
															bgcolor: 'primary.light',
															color: 'primary.main',
															fontSize: '0.75rem',
														}}
													>
														{log.userName?.charAt(0) || 'U'}
													</Avatar>
													<Typography variant="body2" color="text.secondary">
														{log.userName}
													</Typography>
												</Stack>
											</TableCell>
											<TableCell>
												<Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
													{log.ipAddress}
												</Typography>
											</TableCell>
											<TableCell>
												<Typography variant="body2" color="text.secondary">
													{new Date(log.timestamp).toLocaleString()}
												</Typography>
											</TableCell>
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell colSpan={6} align="center" sx={{ py: 4 }}>
											<Typography color="text.secondary">
												No logs found
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
						rowsPerPageOptions={[25, 50, 100, 200]}
					/>
				</Paper>
			</Container>
		</Box>
	);
};

export default AdminLogs;
