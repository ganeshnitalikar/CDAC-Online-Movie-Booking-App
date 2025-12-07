import React, { useState } from 'react';
import {
	Box,
	Container,
	Typography,
	Grid,
	Paper,
	TextField,
	Button,
	Switch,
	FormControlLabel,
	Stack,
	Divider,
	Alert,
	Snackbar,
	Select,
	FormControl,
	InputLabel,
	MenuItem,
	Card,
	CardContent,
} from '@mui/material';
import {
	Save as SaveIcon,
	Security as SecurityIcon,
	Notifications as NotificationsIcon,
	Settings as SettingsIcon,
	Palette as PaletteIcon,
} from '@mui/icons-material';
import { useTheme as useCustomTheme } from '../../hooks/useTheme';

const AdminSettings = () => {
	const { mode, toggleMode, setThemeMode } = useCustomTheme();
	const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
	
	// General Settings
	const [siteName, setSiteName] = useState('MovieHub');
	const [siteEmail, setSiteEmail] = useState('admin@moviehub.com');
	const [maintenanceMode, setMaintenanceMode] = useState(false);
	
	// Notification Settings
	const [emailNotifications, setEmailNotifications] = useState(true);
	const [newUserNotifications, setNewUserNotifications] = useState(true);
	const [paymentNotifications, setPaymentNotifications] = useState(true);
	const [errorNotifications, setErrorNotifications] = useState(true);
	
	// Security Settings
	const [twoFactorAuth, setTwoFactorAuth] = useState(false);
	const [sessionTimeout, setSessionTimeout] = useState('30');
	const [passwordPolicy, setPasswordPolicy] = useState('medium');
	
	// System Settings
	const [autoBackup, setAutoBackup] = useState(true);
	const [backupFrequency, setBackupFrequency] = useState('daily');
	const [logRetention, setLogRetention] = useState('30');

	const handleSave = (section) => {
		// Simulate save action
		setSnackbar({
			open: true,
			message: `${section} settings saved successfully!`,
			severity: 'success',
		});
	};

	const handleCloseSnackbar = () => {
		setSnackbar({ ...snackbar, open: false });
	};

  return (
		<Box sx={{ py: 4 }}>
			<Container maxWidth="lg">
				{/* Header */}
				<Box sx={{ mb: 4 }}>
					<Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
						Admin Settings
					</Typography>
					<Typography color="text.secondary">
						Manage system settings and preferences
					</Typography>
				</Box>

				<Grid container spacing={3}>
					{/* General Settings */}
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
								<SettingsIcon color="primary" />
								<Typography variant="h6" sx={{ fontWeight: 700 }}>
									General Settings
								</Typography>
							</Stack>

							<Stack spacing={3}>
								<TextField
									fullWidth
									label="Site Name"
									value={siteName}
									onChange={(e) => setSiteName(e.target.value)}
									variant="outlined"
									size="small"
								/>

								<TextField
									fullWidth
									label="Admin Email"
									value={siteEmail}
									onChange={(e) => setSiteEmail(e.target.value)}
									variant="outlined"
									size="small"
									type="email"
								/>

								<FormControlLabel
									control={
										<Switch
											checked={maintenanceMode}
											onChange={(e) => setMaintenanceMode(e.target.checked)}
											color="warning"
										/>
									}
									label="Maintenance Mode"
								/>

								<Button
									variant="contained"
									startIcon={<SaveIcon />}
									onClick={() => handleSave('General')}
									sx={{ textTransform: 'none', alignSelf: 'flex-start' }}
								>
									Save General Settings
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
									Theme Settings
								</Typography>
							</Stack>

							<Stack spacing={3}>
								<FormControl fullWidth size="small">
									<InputLabel>Theme Mode</InputLabel>
									<Select
										value={mode}
										label="Theme Mode"
										onChange={(e) => setThemeMode(e.target.value)}
									>
										<MenuItem value="light">Light</MenuItem>
										<MenuItem value="dark">Dark</MenuItem>
									</Select>
								</FormControl>

								<FormControlLabel
									control={
										<Switch
											checked={mode === 'dark'}
											onChange={toggleMode}
										/>
									}
									label="Dark Mode"
								/>

								<Alert severity="info" sx={{ mt: 2 }}>
									Theme changes are applied immediately and saved to your browser.
								</Alert>
							</Stack>
						</Paper>
					</Grid>

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
									Notification Settings
								</Typography>
							</Stack>

							<Stack spacing={2}>
								<FormControlLabel
									control={
										<Switch
											checked={emailNotifications}
											onChange={(e) => setEmailNotifications(e.target.checked)}
										/>
									}
									label="Enable Email Notifications"
								/>

								<Divider />

								<FormControlLabel
									control={
										<Switch
											checked={newUserNotifications}
											onChange={(e) => setNewUserNotifications(e.target.checked)}
											disabled={!emailNotifications}
										/>
									}
									label="New User Registrations"
								/>

								<FormControlLabel
									control={
										<Switch
											checked={paymentNotifications}
											onChange={(e) => setPaymentNotifications(e.target.checked)}
											disabled={!emailNotifications}
										/>
									}
									label="Payment Transactions"
								/>

								<FormControlLabel
									control={
										<Switch
											checked={errorNotifications}
											onChange={(e) => setErrorNotifications(e.target.checked)}
											disabled={!emailNotifications}
										/>
									}
									label="System Errors"
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

					{/* Security Settings */}
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
									Security Settings
								</Typography>
							</Stack>

							<Stack spacing={3}>
								<FormControlLabel
									control={
										<Switch
											checked={twoFactorAuth}
											onChange={(e) => setTwoFactorAuth(e.target.checked)}
										/>
									}
									label="Enable Two-Factor Authentication"
								/>

								<FormControl fullWidth size="small">
									<InputLabel>Session Timeout</InputLabel>
									<Select
										value={sessionTimeout}
										label="Session Timeout"
										onChange={(e) => setSessionTimeout(e.target.value)}
									>
										<MenuItem value="15">15 minutes</MenuItem>
										<MenuItem value="30">30 minutes</MenuItem>
										<MenuItem value="60">1 hour</MenuItem>
										<MenuItem value="120">2 hours</MenuItem>
									</Select>
								</FormControl>

								<FormControl fullWidth size="small">
									<InputLabel>Password Policy</InputLabel>
									<Select
										value={passwordPolicy}
										label="Password Policy"
										onChange={(e) => setPasswordPolicy(e.target.value)}
									>
										<MenuItem value="low">Low (6+ characters)</MenuItem>
										<MenuItem value="medium">Medium (8+ characters, mixed case)</MenuItem>
										<MenuItem value="high">High (12+ characters, special chars)</MenuItem>
									</Select>
								</FormControl>

								<Button
									variant="contained"
									startIcon={<SaveIcon />}
									onClick={() => handleSave('Security')}
									sx={{ textTransform: 'none', alignSelf: 'flex-start' }}
								>
									Save Security Settings
								</Button>
							</Stack>
						</Paper>
					</Grid>

					{/* System Settings */}
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
							<Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
								<SettingsIcon color="primary" />
								<Typography variant="h6" sx={{ fontWeight: 700 }}>
									System Settings
								</Typography>
							</Stack>

							<Grid container spacing={3}>
								<Grid item xs={12} md={6}>
									<Stack spacing={3}>
										<FormControlLabel
											control={
												<Switch
													checked={autoBackup}
													onChange={(e) => setAutoBackup(e.target.checked)}
												/>
											}
											label="Automatic Backups"
										/>

										<FormControl fullWidth size="small" disabled={!autoBackup}>
											<InputLabel>Backup Frequency</InputLabel>
											<Select
												value={backupFrequency}
												label="Backup Frequency"
												onChange={(e) => setBackupFrequency(e.target.value)}
											>
												<MenuItem value="hourly">Hourly</MenuItem>
												<MenuItem value="daily">Daily</MenuItem>
												<MenuItem value="weekly">Weekly</MenuItem>
											</Select>
										</FormControl>
									</Stack>
								</Grid>

								<Grid item xs={12} md={6}>
									<Stack spacing={3}>
										<FormControl fullWidth size="small">
											<InputLabel>Log Retention Period</InputLabel>
											<Select
												value={logRetention}
												label="Log Retention Period"
												onChange={(e) => setLogRetention(e.target.value)}
											>
												<MenuItem value="7">7 days</MenuItem>
												<MenuItem value="30">30 days</MenuItem>
												<MenuItem value="90">90 days</MenuItem>
												<MenuItem value="365">1 year</MenuItem>
											</Select>
										</FormControl>

										<Button
											variant="contained"
											startIcon={<SaveIcon />}
											onClick={() => handleSave('System')}
											sx={{ textTransform: 'none', alignSelf: 'flex-start' }}
										>
											Save System Settings
										</Button>
									</Stack>
								</Grid>
							</Grid>
						</Paper>
					</Grid>

					{/* System Info Card */}
					<Grid item xs={12}>
						<Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
							<CardContent>
								<Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
									System Information
								</Typography>
								<Grid container spacing={2}>
									<Grid item xs={12} sm={6} md={3}>
										<Typography variant="body2" color="text.secondary">
											Platform Version
										</Typography>
										<Typography variant="body1" sx={{ fontWeight: 600 }}>
											v1.0.0
										</Typography>
									</Grid>
									<Grid item xs={12} sm={6} md={3}>
										<Typography variant="body2" color="text.secondary">
											Last Backup
										</Typography>
										<Typography variant="body1" sx={{ fontWeight: 600 }}>
											{new Date().toLocaleDateString()}
										</Typography>
									</Grid>
									<Grid item xs={12} sm={6} md={3}>
										<Typography variant="body2" color="text.secondary">
											Database Status
										</Typography>
										<Typography variant="body1" sx={{ fontWeight: 600, color: 'success.main' }}>
											Healthy
										</Typography>
									</Grid>
									<Grid item xs={12} sm={6} md={3}>
										<Typography variant="body2" color="text.secondary">
											Server Status
										</Typography>
										<Typography variant="body1" sx={{ fontWeight: 600, color: 'success.main' }}>
											Online
										</Typography>
									</Grid>
								</Grid>
							</CardContent>
						</Card>
					</Grid>
				</Grid>

				{/* Snackbar for notifications */}
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

export default AdminSettings;
