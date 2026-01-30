import React, { useEffect, useState } from 'react';
import {
	Box,
	Container,
	Typography,
	Grid,
	Paper,
	Switch,
	FormControlLabel,
	Stack,
	Button,
	Select,
	FormControl,
	InputLabel,
	MenuItem,
	Divider,
	Alert,
	Snackbar,
	Chip,
	Skeleton,
} from '@mui/material';
import {
	Save as SaveIcon,
	Notifications as NotificationsIcon,
	Palette as PaletteIcon,
	Language as LanguageIcon,
	Security as SecurityIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useTheme as useCustomTheme } from '../../hooks/useTheme';
import { getUserPreferences, updateUserPreferences } from '../../services/user';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { deleteUserAccount } from '../../services/user';
import { useNavigate } from 'react-router-dom';


const UserSettings = () => {
	const { user } = useAuth();
	const { mode, toggleMode, setThemeMode } = useCustomTheme();
	const [loading, setLoading] = useState(true);
	const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
   const navigate = useNavigate();

const handleDeleteAccount = async () => {
  const confirmDelete = window.confirm(
    "Are your sure you want to logout?"
  );

  if (!confirmDelete) return;

  try {
    await deleteUserAccount();

    localStorage.removeItem("authToken");


    alert("Account deleted successfully");

    navigate(ROUTES.HOME);
  } catch (err) {
    alert("Failed to delete account");
  }
};

	

	useEffect(() => {
		setLoading(false);
	}, []);


	const handleThemeChange = (isDark) => {
		setThemeMode(isDark ? 'dark' : 'light');
		handlePreferenceChange('darkMode', isDark);
	};

	const handleCloseSnackbar = () => {
		setSnackbar({ ...snackbar, open: false });
	};

	if (loading) {
  return (
			<Box sx={{ py: 4 }}>
				<Container maxWidth="lg">
					<Skeleton height={48} width="40%" sx={{ mb: 3 }} />
					<Skeleton height={300} variant="rounded" />
				</Container>
			</Box>
		);
	}

	return (
		<Box sx={{ py: 4 }}>
			<Container maxWidth="lg">
				{/* Header */}
				<Box sx={{ mb: 4 }}>
					<Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
						Settings
					</Typography>
					<Typography color="text.secondary">
						Customize your Cineverse experience
					</Typography>
				</Box>

				<Grid container spacing={3}>
					

					{/* Theme Settings */}
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
							<Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
								<PaletteIcon color="primary" />
								<Typography variant="h6" sx={{ fontWeight: 700 }}>
									Appearance
								</Typography>
							</Stack>

							<Stack spacing={3}>
								<FormControl fullWidth size="small">
									<InputLabel>Theme Mode</InputLabel>
									<Select
										value={mode}
										label="Theme Mode"
										onChange={(e) => {
											const isDark = e.target.value === 'dark';
											handleThemeChange(isDark);
										}}
									>
										<MenuItem value="light">Light</MenuItem>
										<MenuItem value="dark">Dark</MenuItem>
									</Select>
								</FormControl>

								<FormControlLabel
									control={
										<Switch
											checked={mode === 'dark'}
											onChange={(e) => {
												handleThemeChange(e.target.checked);
											}}
										/>
									}
									label="Dark Mode"
								/>

								<Alert severity="info">
									Theme changes are applied immediately.
								</Alert>
							</Stack>
						</Paper>
					</Grid>

					

					{/* Account Actions */}
					<Grid item xs={12}>
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
								Account Actions
							</Typography>
							<Stack spacing={2}>
							    <Button
									component={RouterLink}
									to={ROUTES.FORGOT_PASSWORD}
									variant="outlined"
									color="warning"
									sx={{
										textTransform: 'none',
										alignSelf: 'flex-start',
									}}
									>
									Change Password
							     </Button>
								<Button
								variant="outlined"
								color="error"
								onClick={handleDeleteAccount}
								sx={{ textTransform: 'none', alignSelf: 'flex-start' }}
								>
								Delete Account
								</Button>
								<Typography variant="caption" color="text.secondary">
									These actions are permanent and cannot be undone.
								</Typography>
							</Stack>
						</Paper>
					</Grid>
				</Grid>

				{/* Snackbar */}
				<Snackbar
					open={snackbar.open}
					autoHideDuration={3000}
					onClose={handleCloseSnackbar}
					anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				>
					<Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
						{snackbar.message}
					</Alert>
				</Snackbar>
			</Container>
		</Box>
	);
};

export default UserSettings;
