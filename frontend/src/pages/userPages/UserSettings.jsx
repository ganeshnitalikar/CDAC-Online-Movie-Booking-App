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

const UserSettings = () => {
	const { user } = useAuth();
	const { mode, toggleMode, setThemeMode } = useCustomTheme();
	const [loading, setLoading] = useState(true);
	const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
	const [preferences, setPreferences] = useState({
		language: 'English',
		notifications: true,
		darkMode: mode === 'dark',
		favoriteGenres: ['Action', 'Drama'],
	});

	const fetchPreferences = async () => {
		setLoading(true);
		try {
			const data = await getUserPreferences();
			setPreferences(data);
			if (data.darkMode !== undefined && data.darkMode !== (mode === 'dark')) {
				setThemeMode(data.darkMode ? 'dark' : 'light');
			}
		} catch (error) {
			console.error('Error fetching preferences:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPreferences();
	}, []);

	const handlePreferenceChange = (key, value) => {
		setPreferences({ ...preferences, [key]: value });
	};

	const handleSave = async (section) => {
		try {
			await updateUserPreferences(preferences);
			setSnackbar({
				open: true,
				message: `${section} settings saved successfully!`,
				severity: 'success',
			});
		} catch (error) {
			console.error('Error updating preferences:', error);
			setSnackbar({
				open: true,
				message: 'Failed to save settings',
				severity: 'error',
			});
		}
	};

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
						Customize your MovieHub experience
					</Typography>
				</Box>

				<Grid container spacing={3}>
					{/* Notification Settings */}
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
								<NotificationsIcon color="primary" />
								<Typography variant="h6" sx={{ fontWeight: 700 }}>
									Notifications
								</Typography>
							</Stack>

							<Stack spacing={2}>
								<FormControlLabel
									control={
										<Switch
											checked={preferences.notifications}
											onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
										/>
									}
									label="Enable Notifications"
								/>
								<Typography variant="body2" color="text.secondary" sx={{ pl: 4 }}>
									Receive updates about your bookings, new movies, and special offers
								</Typography>

								<Divider sx={{ my: 1 }} />

								<FormControlLabel
									control={
										<Switch
											checked={preferences.emailNotifications !== false}
											onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
											disabled={!preferences.notifications}
										/>
									}
									label="Email Notifications"
								/>

								<FormControlLabel
									control={
										<Switch
											checked={preferences.smsNotifications || false}
											onChange={(e) => handlePreferenceChange('smsNotifications', e.target.checked)}
											disabled={!preferences.notifications}
										/>
									}
									label="SMS Notifications"
								/>

								<FormControlLabel
									control={
										<Switch
											checked={preferences.pushNotifications !== false}
											onChange={(e) => handlePreferenceChange('pushNotifications', e.target.checked)}
											disabled={!preferences.notifications}
										/>
									}
									label="Push Notifications"
								/>

								<Button
									variant="contained"
									startIcon={<SaveIcon />}
									onClick={() => handleSave('Notification')}
									sx={{ textTransform: 'none', alignSelf: 'flex-start', mt: 2 }}
								>
									Save Notification Settings
								</Button>
							</Stack>
						</Paper>
					</Grid>

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
									Theme changes are applied immediately and saved to your preferences.
								</Alert>
							</Stack>
						</Paper>
					</Grid>

					{/* Language & Region */}
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
								<LanguageIcon color="primary" />
								<Typography variant="h6" sx={{ fontWeight: 700 }}>
									Language & Region
								</Typography>
							</Stack>

							<Stack spacing={3}>
								<FormControl fullWidth size="small">
									<InputLabel>Language</InputLabel>
									<Select
										value={preferences.language}
										label="Language"
										onChange={(e) => handlePreferenceChange('language', e.target.value)}
									>
										<MenuItem value="English">English</MenuItem>
										<MenuItem value="Hindi">Hindi</MenuItem>
										<MenuItem value="Tamil">Tamil</MenuItem>
										<MenuItem value="Telugu">Telugu</MenuItem>
										<MenuItem value="Kannada">Kannada</MenuItem>
										<MenuItem value="Malayalam">Malayalam</MenuItem>
									</Select>
								</FormControl>

								<Button
									variant="contained"
									startIcon={<SaveIcon />}
									onClick={() => handleSave('Language')}
									sx={{ textTransform: 'none', alignSelf: 'flex-start' }}
								>
									Save Language Settings
								</Button>
							</Stack>
						</Paper>
					</Grid>

					{/* Preferences */}
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
								<SecurityIcon color="primary" />
								<Typography variant="h6" sx={{ fontWeight: 700 }}>
									Preferences
								</Typography>
							</Stack>

							<Stack spacing={3}>
								<Box>
									<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
										Favorite Genres
									</Typography>
									<Stack direction="row" spacing={1} flexWrap="wrap">
										{preferences.favoriteGenres?.map((genre) => (
											<Chip key={genre} label={genre} size="small" />
										))}
									</Stack>
									<Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
										Used to personalize movie recommendations
									</Typography>
								</Box>

								<FormControlLabel
									control={
										<Switch
											checked={preferences.autoPlayTrailers || false}
											onChange={(e) => handlePreferenceChange('autoPlayTrailers', e.target.checked)}
										/>
									}
									label="Auto-play Trailers"
								/>

								<FormControlLabel
									control={
										<Switch
											checked={preferences.showAdultContent || false}
											onChange={(e) => handlePreferenceChange('showAdultContent', e.target.checked)}
										/>
									}
									label="Show Adult Content"
								/>

								<Button
									variant="contained"
									startIcon={<SaveIcon />}
									onClick={() => handleSave('Preferences')}
									sx={{ textTransform: 'none', alignSelf: 'flex-start' }}
								>
									Save Preferences
								</Button>
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
									variant="outlined"
									color="warning"
									sx={{ textTransform: 'none', alignSelf: 'flex-start' }}
								>
									Change Password
								</Button>
								<Button
									variant="outlined"
									color="error"
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
