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
	Movie as MovieIcon,
	TheaterComedy as ScreenIcon,
	AccessTime as ShowIcon,
	Receipt as ReceiptIcon,
	TrendingUp as TrendingUpIcon,
	TrendingDown as TrendingDownIcon,
	ArrowForward as ArrowForwardIcon,
	Refresh as RefreshIcon,
	Add as AddIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { getOwnerMovies } from '../../services/movie.owner.service';
import { getOwnerScreens } from '../../services/ownerScreenService';
import { getOwnerShows } from '../../services/ownerShowService';

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
					{typeof value === 'string' ? value : value?.toLocaleString() || '0'}
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

const QuickActionCard = ({ title, description, count, onClick, color = 'primary', icon }) => (
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
				<Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
					{icon}
					<Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
						{title}
					</Typography>
				</Stack>
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

const OwnerDashboard = () => {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [stats, setStats] = useState({
		totalMovies: 0,
		totalScreens: 0,
		totalRevenue: 0,
		pendingMovies: 0,
	});
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	const fetchData = async (isRefresh = false) => {
		if (isRefresh) setRefreshing(true);
		else setLoading(true);

		try {
			// Fetch all data in parallel
			const [moviesData, screensData, showsData] = await Promise.all([
				getOwnerMovies().catch(() => []),
				getOwnerScreens().catch(() => []),
				getOwnerShows().catch(() => []),
			]);

			const movies = Array.isArray(moviesData) ? moviesData : [];
			const screens = Array.isArray(screensData) ? screensData : [];
			const shows = Array.isArray(showsData) ? showsData : [];

			// Calculate stats
			const pendingMovies = movies.filter(
				(m) => m.approved === null || m.approved === undefined
			).length;

			// Calculate revenue from shows (if shows have booking data)
			// For now, we'll set it to 0 or calculate from shows if available
			const totalRevenue = 0; // TODO: Calculate from actual booking data

			setStats({
				totalMovies: movies.length,
				totalScreens: screens.length,
				totalRevenue: totalRevenue,
				pendingMovies: pendingMovies,
			});
		} catch (error) {
			console.error('Error fetching dashboard data:', error);
			// Set default values on error
			setStats({
				totalMovies: 0,
				totalScreens: 0,
				totalRevenue: 0,
				pendingMovies: 0,
			});
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
							Welcome back, {user?.name || 'Owner'} 👋
						</Typography>
						<Typography color="text.secondary">
							Manage your theater and movies from here
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
							title="Total Movies"
							value={stats.totalMovies}
							icon={<MovieIcon />}
							color="primary"
							onClick={() => navigate(ROUTES.OWNER_MOVIES)}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<StatCard
							title="Total Screens"
							value={stats.totalScreens}
							icon={<ScreenIcon />}
							color="secondary"
							onClick={() => navigate(ROUTES.OWNER_SCREENS)}
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<StatCard
							title="Total Revenue"
							value={`₹${(stats.totalRevenue / 1000).toFixed(1)}K`}
							change={12.5}
							changeType="up"
							icon={<ReceiptIcon />}
							color="success"
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<StatCard
							title="Pending Movies"
							value={stats.pendingMovies}
							icon={<MovieIcon />}
							color="warning"
							onClick={() => navigate(ROUTES.OWNER_MOVIES)}
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
										title="Add New Movie"
										description="Create and submit a new movie for approval"
										icon={<AddIcon sx={{ fontSize: 20 }} />}
										onClick={() => navigate(`${ROUTES.OWNER_MOVIES}/new`)}
										color="primary"
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<QuickActionCard
										title="Manage Screens"
										description="Add or update theater screens"
										icon={<ScreenIcon sx={{ fontSize: 20 }} />}
										onClick={() => navigate(ROUTES.OWNER_SCREENS)}
										color="secondary"
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<QuickActionCard
										title="Schedule Shows"
										description="Schedule movies for your screens"
										icon={<ShowIcon sx={{ fontSize: 20 }} />}
										onClick={() => navigate(ROUTES.OWNER_SHOWS)}
										color="info"
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<QuickActionCard
										title="My Movies"
										description="View and manage all your movies"
										count={stats.totalMovies}
										icon={<MovieIcon sx={{ fontSize: 20 }} />}
										onClick={() => navigate(ROUTES.OWNER_MOVIES)}
										color="warning"
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<QuickActionCard
										title="Update Profile"
										description="Manage your theater information"
										icon={<ArrowForwardIcon sx={{ fontSize: 20 }} />}
										onClick={() => navigate(ROUTES.OWNER_SETTINGS)}
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
							<Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
								Recent Activity
							</Typography>
							<Stack spacing={2}>
								{stats.pendingMovies > 0 ? (
									<Box
										sx={{
											p: 2,
											borderRadius: 2,
											bgcolor: 'warning.light',
											border: '1px solid',
											borderColor: 'warning.main',
										}}
									>
										<Typography variant="body2" sx={{ fontWeight: 600 }}>
											You have {stats.pendingMovies} movie{stats.pendingMovies !== 1 ? 's' : ''} pending approval
										</Typography>
										<Button
											size="small"
											variant="outlined"
											onClick={() => navigate(ROUTES.OWNER_MOVIES)}
											sx={{ mt: 1, textTransform: 'none' }}
										>
											View Movies
										</Button>
									</Box>
								) : (
									<Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
										No recent activity
									</Typography>
								)}
							</Stack>
						</Paper>
					</Grid>

					{/* Right Column - Additional Info */}
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
									Theater Overview
								</Typography>
								<Stack spacing={2}>
									<Box>
										<Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
											<Typography variant="body2" color="text.secondary">
												Active Movies
											</Typography>
											<Typography variant="body2" sx={{ fontWeight: 600 }}>
												{stats.totalMovies - stats.pendingMovies}
											</Typography>
										</Stack>
										<LinearProgress
											variant="determinate"
											value={((stats.totalMovies - stats.pendingMovies) / stats.totalMovies) * 100 || 0}
											sx={{ height: 6, borderRadius: 1 }}
										/>
									</Box>
									<Box>
										<Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
											<Typography variant="body2" color="text.secondary">
												Total Screens
											</Typography>
											<Typography variant="body2" sx={{ fontWeight: 600 }}>
												{stats.totalScreens}
											</Typography>
										</Stack>
										<LinearProgress
											variant="determinate"
											value={75}
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
												+12.5%
											</Typography>
										</Stack>
										<LinearProgress
											variant="determinate"
											value={12.5}
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
									Account Status
								</Typography>
								<Stack spacing={1.5}>
									<Stack direction="row" justifyContent="space-between" alignItems="center">
										<Typography variant="body2">Account Type</Typography>
										<Chip label="Theater Owner" size="small" color="primary" />
									</Stack>
									<Stack direction="row" justifyContent="space-between" alignItems="center">
										<Typography variant="body2">Verification</Typography>
										<Chip label="Verified" size="small" color="success" />
									</Stack>
									<Stack direction="row" justifyContent="space-between" alignItems="center">
										<Typography variant="body2">Status</Typography>
										<Chip label="Active" size="small" color="success" />
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

export default OwnerDashboard;
