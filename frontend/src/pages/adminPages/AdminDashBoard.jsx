import React, { useEffect, useState } from 'react';
import {
	Box,
	Container,
	Typography,
	Grid,
	Paper,
	Card,
	CardContent,
	Stack,
	Button,
	Chip,
	Skeleton,
	LinearProgress,
	Avatar,
	IconButton,
} from '@mui/material';
import {
	People as PeopleIcon,
	Business as BusinessIcon,
	Movie as MovieIcon,
	Receipt as ReceiptIcon,
	TrendingUp as TrendingUpIcon,
	TrendingDown as TrendingDownIcon,
	CheckCircle as CheckCircleIcon,
	ArrowForward as ArrowForwardIcon,
	Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { getAdminStats, getRecentActivity } from '../../services/admin';

const StatCard = ({ title, value, change, changeType, icon, color, onClick }) => (
	<Card
		elevation={0}
		sx={{
			p: 2.5,
			borderRadius: 2,
			border: '1px solid',
			borderColor: 'divider',
			cursor: onClick ? 'pointer' : 'default',
			transition: 'all 0.2s ease-in-out',
			'&:hover': onClick ? {
				transform: 'translateY(-2px)',
				boxShadow: 2,
				borderColor: 'primary.main',
			} : {},
		}}
		onClick={onClick}
	>
		<Stack direction="row" spacing={2} alignItems="center">
			<Avatar
				sx={{
					bgcolor: `${color}.light`,
					color: `${color}.main`,
					width: 56,
					height: 56,
				}}
			>
				{icon}
			</Avatar>
			<Box sx={{ flexGrow: 1 }}>
				<Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
					{title}
				</Typography>
				<Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
					{value?.toLocaleString() || '0'}
				</Typography>
				{change !== undefined && (
					<Stack direction="row" spacing={0.5} alignItems="center">
						{changeType === 'up' ? (
							<TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
						) : (
							<TrendingDownIcon sx={{ fontSize: 16, color: 'error.main' }} />
						)}
						<Typography
							variant="caption"
							sx={{
								color: changeType === 'up' ? 'success.main' : 'error.main',
								fontWeight: 600,
							}}
						>
							{change > 0 ? '+' : ''}{change}%
						</Typography>
					</Stack>
				)}
			</Box>
		</Stack>
	</Card>
);

const QuickActionCard = ({ title, description, count, onClick, color = 'primary' }) => (
	<Paper
		elevation={0}
		sx={{
			p: 2.5,
			borderRadius: 2,
			border: '1px solid',
			borderColor: 'divider',
			cursor: 'pointer',
			transition: 'all 0.2s ease-in-out',
			'&:hover': {
				transform: 'translateY(-2px)',
				boxShadow: 2,
				borderColor: `${color}.main`,
			},
		}}
		onClick={onClick}
	>
		<Stack direction="row" justifyContent="space-between" alignItems="flex-start">
			<Box sx={{ flexGrow: 1 }}>
				<Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
					{title}
				</Typography>
				<Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
					{description}
				</Typography>
				{count !== undefined && (
					<Chip
						label={count}
						size="small"
						color={color}
						sx={{ fontWeight: 600 }}
					/>
				)}
			</Box>
			<IconButton
				size="small"
				sx={{
					color: `${color}.main`,
					'&:hover': { bgcolor: `${color}.light` },
				}}
			>
				<ArrowForwardIcon />
			</IconButton>
		</Stack>
	</Paper>
);

const AdminDashBoard = () => {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [stats, setStats] = useState(null);
	const [recentActivity, setRecentActivity] = useState([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	const fetchData = async (isRefresh = false) => {
		if (isRefresh) setRefreshing(true);
		else setLoading(true);

		try {
			const [statsData, activityData] = await Promise.all([
				getAdminStats(),
				getRecentActivity(5),
			]);
			setStats(statsData);
			setRecentActivity(activityData);
		} catch (error) {
			console.error('Error fetching dashboard data:', error);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handleRefresh = () => {
		fetchData(true);
	};

	if (loading) {
  return (
			<Box sx={{ py: 4 }}>
				<Container maxWidth="lg">
					<Skeleton height={48} width="40%" sx={{ mb: 2 }} />
					<Skeleton height={24} width="60%" sx={{ mb: 4 }} />
					<Grid container spacing={3}>
						{[1, 2, 3, 4].map((i) => (
							<Grid item xs={12} sm={6} md={3} key={i}>
								<Skeleton height={120} />
							</Grid>
						))}
					</Grid>
				</Container>
			</Box>
		);
	}

	return (
		<Box sx={{ py: 4 }}>
			<Container maxWidth="lg">
				{/* Header */}
				<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
					<Box>
						<Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
							Welcome back, {user?.name || 'Admin'} 👋
						</Typography>
						<Typography color="text.secondary">
							Here's an overview of your platform
						</Typography>
					</Box>
					<Button
						variant="outlined"
						startIcon={<RefreshIcon />}
						onClick={handleRefresh}
						disabled={refreshing}
						sx={{ textTransform: 'none' }}
					>
						Refresh
					</Button>
				</Stack>

				{refreshing && (
					<LinearProgress sx={{ mb: 3, borderRadius: 1 }} />
				)}

				{/* Statistics Cards */}
				<Grid container spacing={3} sx={{ mb: 4 }}>
					<Grid item xs={12} sm={6} md={3}>
						<StatCard
							title="Total Users"
							value={stats?.totalUsers}
							change={stats?.activeUsersChange}
							changeType="up"
							icon={<PeopleIcon />}
							color="primary"
							onClick={() => navigate(ROUTES.ADMIN_USERS)}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<StatCard
							title="Total Owners"
							value={stats?.totalOwners}
							icon={<BusinessIcon />}
							color="secondary"
							onClick={() => navigate(ROUTES.ADMIN_OWNERS)}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<StatCard
							title="Total Movies"
							value={stats?.totalMovies}
							icon={<MovieIcon />}
							color="warning"
							onClick={() => navigate(ROUTES.ADMIN_MOVIES)}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<StatCard
							title="Total Revenue"
							value={`₹${(stats?.revenue / 100000).toFixed(1)}L`}
							change={stats?.revenueChange}
							changeType="up"
							icon={<ReceiptIcon />}
							color="success"
							onClick={() => navigate(ROUTES.ADMIN_PAYMENTS)}
						/>
					</Grid>
				</Grid>

				{/* Main Content Grid */}
				<Grid container spacing={3}>
					{/* Left Column - Quick Actions */}
					<Grid item xs={12} md={8}>
						<Paper
							elevation={0}
							sx={{
								p: 3,
								borderRadius: 3,
								border: '1px solid',
								borderColor: 'divider',
								mb: 3,
							}}
						>
							<Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
								Quick Actions
							</Typography>
							<Grid container spacing={2}>
								<Grid item xs={12} sm={6}>
									<QuickActionCard
										title="Pending Approvals"
										description="Review and approve pending requests"
										count={stats?.pendingApprovals}
										onClick={() => navigate(ROUTES.ADMIN_MOVIES)}
										color="warning"
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<QuickActionCard
										title="View All Users"
										description="Manage user accounts and permissions"
										onClick={() => navigate(ROUTES.ADMIN_USERS)}
										color="primary"
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<QuickActionCard
										title="Manage Owners"
										description="Verify and manage theater owners"
										onClick={() => navigate(ROUTES.ADMIN_OWNERS)}
										color="secondary"
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<QuickActionCard
										title="Payment Analytics"
										description="View revenue and transaction reports"
										onClick={() => navigate(ROUTES.ADMIN_PAYMENTS)}
										color="success"
									/>
								</Grid>
							</Grid>
						</Paper>

						{/* Recent Activity */}
						<Paper
							elevation={0}
							sx={{
								p: 3,
								borderRadius: 3,
								border: '1px solid',
								borderColor: 'divider',
							}}
						>
							<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
								<Typography variant="h6" sx={{ fontWeight: 700 }}>
									Recent Activity
								</Typography>
								<Button
									size="small"
									endIcon={<ArrowForwardIcon />}
									onClick={() => navigate(ROUTES.ADMIN_LOGS)}
									sx={{ textTransform: 'none' }}
								>
									View All
								</Button>
							</Stack>
							<Stack spacing={2}>
								{recentActivity.length > 0 ? (
									recentActivity.map((activity) => (
										<Box
											key={activity.id}
											sx={{
												p: 2,
												borderRadius: 2,
												bgcolor: 'background.surface',
												border: '1px solid',
												borderColor: 'divider',
											}}
										>
											<Stack direction="row" spacing={2} alignItems="center">
												<Avatar
													sx={{
														width: 40,
														height: 40,
														bgcolor: 'primary.light',
														color: 'primary.main',
													}}
												>
													<CheckCircleIcon />
												</Avatar>
												<Box sx={{ flexGrow: 1 }}>
													<Typography variant="body2" sx={{ fontWeight: 600 }}>
														{activity.message}
													</Typography>
													<Typography variant="caption" color="text.secondary">
														{new Date(activity.timestamp).toLocaleString()}
													</Typography>
												</Box>
											</Stack>
										</Box>
									))
								) : (
									<Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
										No recent activity
									</Typography>
								)}
							</Stack>
						</Paper>
					</Grid>

					{/* Right Column - Additional Stats */}
					<Grid item xs={12} md={4}>
						<Stack spacing={3}>
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
									Platform Overview
								</Typography>
								<Stack spacing={2}>
									<Box>
										<Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
											<Typography variant="body2" color="text.secondary">
												Active Users
											</Typography>
											<Typography variant="body2" sx={{ fontWeight: 600 }}>
												{stats?.activeUsers?.toLocaleString()}
											</Typography>
										</Stack>
										<LinearProgress
											variant="determinate"
											value={75}
											sx={{ height: 6, borderRadius: 1 }}
										/>
									</Box>
									<Box>
										<Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
											<Typography variant="body2" color="text.secondary">
												Total Bookings
											</Typography>
											<Typography variant="body2" sx={{ fontWeight: 600 }}>
												{stats?.totalBookings?.toLocaleString()}
											</Typography>
										</Stack>
										<LinearProgress
											variant="determinate"
											value={60}
											color="secondary"
											sx={{ height: 6, borderRadius: 1 }}
										/>
									</Box>
									<Box>
										<Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
											<Typography variant="body2" color="text.secondary">
												Revenue Growth
											</Typography>
											<Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
												+{stats?.revenueChange}%
											</Typography>
										</Stack>
										<LinearProgress
											variant="determinate"
											value={stats?.revenueChange || 0}
											color="success"
											sx={{ height: 6, borderRadius: 1 }}
										/>
									</Box>
								</Stack>
							</Paper>

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
									System Status
								</Typography>
								<Stack spacing={1.5}>
									<Stack direction="row" justifyContent="space-between" alignItems="center">
										<Typography variant="body2">Server Status</Typography>
										<Chip label="Online" size="small" color="success" />
									</Stack>
									<Stack direction="row" justifyContent="space-between" alignItems="center">
										<Typography variant="body2">Database</Typography>
										<Chip label="Healthy" size="small" color="success" />
									</Stack>
									<Stack direction="row" justifyContent="space-between" alignItems="center">
										<Typography variant="body2">API Status</Typography>
										<Chip label="Operational" size="small" color="success" />
									</Stack>
								</Stack>
							</Paper>
						</Stack>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
};

export default AdminDashBoard;
