import React, { useState } from 'react';
import {
	Box,
	Container,
	Typography,
	Grid,
	Paper,
	Stack,
	Button,
	IconButton,
} from '@mui/material';
import {
	ArrowForward as ArrowForwardIcon,
	PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import AddTheatreOwnerModal from '../../components/admin/AddTheatreOwnerModal';

const QuickActionCard = ({ title, description, onClick, color = 'primary' }) => (
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
	const [openAddOwnerModal, setOpenAddOwnerModal] = useState(false);

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
							Manage your platform from here
						</Typography>
					</Box>
					<Button
						variant="contained"
						startIcon={<PersonAddIcon />}
						onClick={() => setOpenAddOwnerModal(true)}
						sx={{ textTransform: 'none' }}
					>
						Add Theatre Owner
					</Button>
				</Stack>

				{/* Quick Actions */}
				<Paper
					elevation={0}
					sx={{
						p: 3,
						borderRadius: 3,
						border: '1px solid',
						borderColor: 'divider',
						maxWidth: 720,
					}}
				>
					<Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
						Quick Actions
					</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							<QuickActionCard
								title="Pending Movie Approvals"
								description="Review and approve pending movie requests"
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
						<Grid item xs={12} sm={6}>
							<QuickActionCard
								title="System Logs"
								description="View system and activity logs"
								onClick={() => navigate(ROUTES.ADMIN_LOGS)}
								color="info"
							/>
						</Grid>
					</Grid>
				</Paper>

				<AddTheatreOwnerModal
					open={openAddOwnerModal}
					onClose={() => setOpenAddOwnerModal(false)}
					onSuccess={() => setOpenAddOwnerModal(false)}
				/>
			</Container>
		</Box>
	);
};

export default AdminDashBoard;
