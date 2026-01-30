// import React, { useEffect, useState } from 'react';
// import {
// 	Box,
// 	Container,
// 	Typography,
// 	Grid,
// 	Paper,
// 	TextField,
// 	Button,
// 	Stack,
// 	Avatar,
// 	Divider,
// 	Alert,
// 	Snackbar,
// 	Card,
// 	CardContent,
// 	Skeleton,
// } from '@mui/material';
// import {
// 	Save as SaveIcon,
// 	Edit as EditIcon,
// 	Business as BusinessIcon,
// 	Email as EmailIcon,
// 	Phone as PhoneIcon,
// 	LocationOn as LocationIcon,
// 	CameraAlt as CameraIcon,
// } from '@mui/icons-material';
// import { useAuth } from '../../hooks/useAuth';

// const OwnerProfile = () => {
// 	const { user } = useAuth();
// 	const [profile, setProfile] = useState(null);
// 	const [loading, setLoading] = useState(true);
// 	const [editing, setEditing] = useState(false);
// 	const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
// 	const [formData, setFormData] = useState({
// 		name: '',
// 		email: '',
// 		phone: '',
// 		theaterName: '',
// 		location: '',
// 		address: '',
// 	});

// 	const fetchProfile = async () => {
// 		setLoading(true);
// 		try {
// 			// TODO: Replace with actual API call
// 			// const data = await getOwnerProfile();
// 			// setProfile(data);
			
// 			// Mock data using logged in user
// 			setTimeout(() => {
// 				const mockProfile = {
// 					name: user?.name || 'Theater Owner',
// 					email: user?.email || 'owner@example.com',
// 					phone: '+91 9876543210',
// 					theaterName: 'Grand Cinema',
// 					location: 'Mumbai',
// 					address: '123 Cinema Street, Mumbai, Maharashtra 400001',
// 				};
// 				setProfile(mockProfile);
// 				setFormData(mockProfile);
// 				setLoading(false);
// 			}, 500);
// 		} catch (error) {
// 			console.error('Error fetching profile:', error);
// 			setLoading(false);
// 		}
// 	};

// 	useEffect(() => {
// 		fetchProfile();
// 	}, [user]);

// 	const handleInputChange = (field, value) => {
// 		setFormData({ ...formData, [field]: value });
// 	};

// 	const handleSave = async () => {
// 		try {
// 			// TODO: Replace with actual API call
// 			// const response = await updateOwnerProfile(formData);
// 			// setProfile(response);
			
// 			// Mock success
// 			setProfile(formData);
// 			setEditing(false);
// 			setSnackbar({
// 				open: true,
// 				message: 'Profile updated successfully!',
// 				severity: 'success',
// 			});
// 		} catch (error) {
// 			console.error('Error updating profile:', error);
// 			setSnackbar({
// 				open: true,
// 				message: 'Failed to update profile',
// 				severity: 'error',
// 			});
// 		}
// 	};

// 	const handleCancel = () => {
// 		setFormData({
// 			name: profile?.name || '',
// 			email: profile?.email || '',
// 			phone: profile?.phone || '',
// 			theaterName: profile?.theaterName || '',
// 			location: profile?.location || '',
// 			address: profile?.address || '',
// 		});
// 		setEditing(false);
// 	};

// 	const handleCloseSnackbar = () => {
// 		setSnackbar({ ...snackbar, open: false });
// 	};

// 	if (loading) {
// 		return (
// 			<Box sx={{ py: 4 }}>
// 				<Container maxWidth="md">
// 					<Skeleton height={48} width="40%" sx={{ mb: 3 }} />
// 					<Skeleton height={200} variant="rounded" />
// 				</Container>
// 			</Box>
// 		);
// 	}

// 	return (
// 		<Box sx={{ py: 4 }}>
// 			<Container maxWidth="md">
// 				{/* Header */}
// 				<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
// 					<Box>
// 						<Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
// 							Theater Profile
// 						</Typography>
// 						<Typography color="text.secondary">
// 							Manage your theater and personal information
// 						</Typography>
// 					</Box>
// 					{!editing && (
// 						<Button
// 							variant="contained"
// 							startIcon={<EditIcon />}
// 							onClick={() => setEditing(true)}
// 							sx={{ textTransform: 'none' }}
// 						>
// 							Edit Profile
// 						</Button>
// 					)}
// 				</Stack>

// 				{/* Profile Card */}
// 				<Paper
// 					elevation={0}
// 					sx={{
// 						p: 4,
// 						borderRadius: 3,
// 						border: '1px solid',
// 						borderColor: 'divider',
// 					}}
// 				>
// 					{/* Avatar Section */}
// 					<Stack spacing={3} alignItems="center" sx={{ mb: 4 }}>
// 						<Box sx={{ position: 'relative' }}>
// 							<Avatar
// 								sx={{
// 									width: 120,
// 									height: 120,
// 									bgcolor: 'primary.main',
// 									fontSize: '3rem',
// 									fontWeight: 'bold',
// 								}}
// 							>
// 								{profile?.name?.charAt(0)?.toUpperCase() || 'O'}
// 							</Avatar>
// 							{editing && (
// 								<Button
// 									component="label"
// 									variant="contained"
// 									size="small"
// 									startIcon={<CameraIcon />}
// 									sx={{
// 										position: 'absolute',
// 										bottom: 0,
// 										right: 0,
// 										minWidth: 'auto',
// 										width: 40,
// 										height: 40,
// 										borderRadius: '50%',
// 										textTransform: 'none',
// 									}}
// 								>
// 									<input type="file" hidden accept="image/*" />
// 								</Button>
// 							)}
// 						</Box>
// 						<Box sx={{ textAlign: 'center' }}>
// 							<Typography variant="h5" sx={{ fontWeight: 700 }}>
// 								{profile?.theaterName || 'Theater Name'}
// 							</Typography>
// 							<Typography variant="body2" color="text.secondary">
// 								{profile?.name || 'Owner Name'}
// 							</Typography>
// 						</Box>
// 					</Stack>

// 					<Divider sx={{ my: 3 }} />

// 					{/* Profile Information */}
// 					<Stack spacing={3}>
// 						<Typography variant="h6" sx={{ fontWeight: 700 }}>
// 							Personal Information
// 						</Typography>
// 						<Grid container spacing={3}>
// 							<Grid item xs={12} sm={6}>
// 								<Stack spacing={1}>
// 									<Stack direction="row" spacing={1} alignItems="center">
// 										<BusinessIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
// 										<Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
// 											Owner Name
// 										</Typography>
// 									</Stack>
// 									{editing ? (
// 										<TextField
// 											fullWidth
// 											value={formData.name}
// 											onChange={(e) => handleInputChange('name', e.target.value)}
// 											placeholder="Enter your name"
// 											size="small"
// 											variant="outlined"
// 										/>
// 									) : (
// 										<Typography variant="body1" sx={{ fontWeight: 600 }}>
// 											{profile?.name || 'Not set'}
// 										</Typography>
// 									)}
// 								</Stack>
// 							</Grid>

// 							<Grid item xs={12} sm={6}>
// 								<Stack spacing={1}>
// 									<Stack direction="row" spacing={1} alignItems="center">
// 										<EmailIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
// 										<Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
// 											Email Address
// 										</Typography>
// 									</Stack>
// 									{editing ? (
// 										<TextField
// 											fullWidth
// 											type="email"
// 											value={formData.email}
// 											onChange={(e) => handleInputChange('email', e.target.value)}
// 											placeholder="Enter your email"
// 											size="small"
// 											variant="outlined"
// 										/>
// 									) : (
// 										<Typography variant="body1" sx={{ fontWeight: 600 }}>
// 											{profile?.email || 'Not set'}
// 										</Typography>
// 									)}
// 								</Stack>
// 							</Grid>

// 							<Grid item xs={12} sm={6}>
// 								<Stack spacing={1}>
// 									<Stack direction="row" spacing={1} alignItems="center">
// 										<PhoneIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
// 										<Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
// 											Phone Number
// 										</Typography>
// 									</Stack>
// 									{editing ? (
// 										<TextField
// 											fullWidth
// 											type="tel"
// 											value={formData.phone}
// 											onChange={(e) => handleInputChange('phone', e.target.value)}
// 											placeholder="Enter your phone number"
// 											size="small"
// 											variant="outlined"
// 										/>
// 									) : (
// 										<Typography variant="body1" sx={{ fontWeight: 600 }}>
// 											{profile?.phone || 'Not set'}
// 										</Typography>
// 									)}
// 								</Stack>
// 							</Grid>
// 						</Grid>

// 						<Divider sx={{ my: 2 }} />

// 						<Typography variant="h6" sx={{ fontWeight: 700 }}>
// 							Theater Information
// 						</Typography>
// 						<Grid container spacing={3}>
// 							<Grid item xs={12}>
// 								<Stack spacing={1}>
// 									<Stack direction="row" spacing={1} alignItems="center">
// 										<BusinessIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
// 										<Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
// 											Theater Name
// 										</Typography>
// 									</Stack>
// 									{editing ? (
// 										<TextField
// 											fullWidth
// 											value={formData.theaterName}
// 											onChange={(e) => handleInputChange('theaterName', e.target.value)}
// 											placeholder="Enter theater name"
// 											size="small"
// 											variant="outlined"
// 										/>
// 									) : (
// 										<Typography variant="body1" sx={{ fontWeight: 600 }}>
// 											{profile?.theaterName || 'Not set'}
// 										</Typography>
// 									)}
// 								</Stack>
// 							</Grid>

// 							<Grid item xs={12} sm={6}>
// 								<Stack spacing={1}>
// 									<Stack direction="row" spacing={1} alignItems="center">
// 										<LocationIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
// 										<Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
// 											Location
// 										</Typography>
// 									</Stack>
// 									{editing ? (
// 										<TextField
// 											fullWidth
// 											value={formData.location}
// 											onChange={(e) => handleInputChange('location', e.target.value)}
// 											placeholder="Enter location"
// 											size="small"
// 											variant="outlined"
// 										/>
// 									) : (
// 										<Typography variant="body1" sx={{ fontWeight: 600 }}>
// 											{profile?.location || 'Not set'}
// 										</Typography>
// 									)}
// 								</Stack>
// 							</Grid>

// 							<Grid item xs={12} sm={6}>
// 								<Stack spacing={1}>
// 									<Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
// 										Full Address
// 									</Typography>
// 									{editing ? (
// 										<TextField
// 											fullWidth
// 											multiline
// 											rows={2}
// 											value={formData.address}
// 											onChange={(e) => handleInputChange('address', e.target.value)}
// 											placeholder="Enter full address"
// 											size="small"
// 											variant="outlined"
// 										/>
// 									) : (
// 										<Typography variant="body1" sx={{ fontWeight: 600 }}>
// 											{profile?.address || 'Not set'}
// 										</Typography>
// 									)}
// 								</Stack>
// 							</Grid>
// 						</Grid>

// 						{/* Action Buttons */}
// 						{editing && (
// 							<Stack direction="row" spacing={2} sx={{ mt: 2 }}>
// 								<Button
// 									variant="outlined"
// 									onClick={handleCancel}
// 									sx={{ textTransform: 'none' }}
// 								>
// 									Cancel
// 								</Button>
// 								<Button
// 									variant="contained"
// 									startIcon={<SaveIcon />}
// 									onClick={handleSave}
// 									sx={{ textTransform: 'none' }}
// 								>
// 									Save Changes
// 								</Button>
// 							</Stack>
// 						)}
// 					</Stack>
// 				</Paper>

// 				{/* Account Info Card */}
// 				<Card
// 					elevation={0}
// 					sx={{
// 						mt: 3,
// 						border: '1px solid',
// 						borderColor: 'divider',
// 					}}
// 				>
// 					<CardContent>
// 						<Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
// 							Account Information
// 						</Typography>
// 						<Grid container spacing={2}>
// 							<Grid item xs={12} sm={6}>
// 								<Typography variant="body2" color="text.secondary">
// 									Account Type
// 								</Typography>
// 								<Typography variant="body1" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
// 									Theater Owner
// 								</Typography>
// 							</Grid>
// 							<Grid item xs={12} sm={6}>
// 								<Typography variant="body2" color="text.secondary">
// 									Member Since
// 								</Typography>
// 								<Typography variant="body1" sx={{ fontWeight: 600 }}>
// 									{new Date().toLocaleDateString()}
// 								</Typography>
// 							</Grid>
// 						</Grid>
// 					</CardContent>
// 				</Card>

// 				{/* Snackbar */}
// 				<Snackbar
// 					open={snackbar.open}
// 					autoHideDuration={3000}
// 					onClose={handleCloseSnackbar}
// 					anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
// 				>
// 					<Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
// 						{snackbar.message}
// 					</Alert>
// 				</Snackbar>
// 			</Container>
// 		</Box>
// 	);
// };

// export default OwnerProfile;
import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Stack,
  Avatar,
  Divider,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Skeleton,
} from '@mui/material';
import {
  Save as SaveIcon,
  Edit as EditIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CameraAlt as CameraIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { updateUserProfile, getUserProfile } from '../../services/user';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const OwnerProfile = () => {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [formData, setFormData] = useState({
    phone: '',
    location: '',
  });

  //  Load user profile from backend
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const backendUser = await getUserProfile();
        console.log("user profile",backendUser); 
        const profileData = {
          full_name: backendUser.full_name,
          email: backendUser.email,
          phone_number: backendUser.phone_number || '',
          city: backendUser.city || '',
        };

        setProfile(profileData);
        setFormData({
          phone: profileData.phone_number,
          location: profileData.city,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) loadProfile();
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await updateUserProfile(formData);

      setProfile((prev) => ({
        ...prev,
        phone_number: formData.phone,
        city: formData.location,
      }));

      setEditing(false);
      setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Update failed', severity: 'error' });
    }
  };

  const handleCancel = () => {
    setFormData({
      phone_number: profile.phone_number,
      city: profile.city,
    });
    setEditing(false);
  };

  if (loading) {
    return (
      <Box sx={{ py: 4 }}>
        <Container maxWidth="md">
          <Skeleton height={48} width="40%" sx={{ mb: 3 }} />
          <Skeleton height={200} variant="rounded" />
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="md">

        {/* HEADER */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>Theater Profile</Typography>
            <Typography color="text.secondary">Manage your theater and personal information</Typography>
          </Box>
          {!editing && (
            <Button variant="contained" startIcon={<EditIcon />} onClick={() => setEditing(true)}>
              Edit Profile
            </Button>
          )}

		  
		  
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

        </Stack>

        <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>

          {/* AVATAR */}
          <Stack spacing={3} alignItems="center" sx={{ mb: 4 }}>
            <Avatar sx={{ width: 120, height: 120, bgcolor: 'primary.main', fontSize: '3rem' }}>
              {profile.full_name?.charAt(0)?.toUpperCase()}
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>{profile.full_name}</Typography>
            <Typography>{profile.full_name}</Typography>
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* PERSONAL INFO */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Personal Information</Typography>
          <Grid container spacing={3}>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">Owner Name</Typography>
              <Typography sx={{ fontWeight: 600 }}>{profile.full_name}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">Email</Typography>
              <Typography sx={{ fontWeight: 600 }}>{profile.email}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">Phone</Typography>
              {editing ? (
                <TextField fullWidth size="small"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              ) : (
                <Typography sx={{ fontWeight: 600 }}>{profile.phone_number}</Typography>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">City</Typography>
              {editing ? (
                <TextField fullWidth size="small"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
              ) : (
                <Typography sx={{ fontWeight: 600 }}>{profile.city}</Typography>
              )}
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* THEATER INFO */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Theater Information</Typography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <BusinessIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Theater Name
                  </Typography>
                </Stack>
                <Typography sx={{ fontWeight: 600 }}>{profile.full_name}</Typography>
              </Stack>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <LocationIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Location
                  </Typography>
                </Stack>
                <Typography sx={{ fontWeight: 600 }}>{profile.city}</Typography>
              </Stack>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Full Address
                </Typography>
                  <Typography sx={{ fontWeight: 600 }}>{profile.full_name}</Typography>
              </Stack>
            </Grid>
          </Grid>

          {editing && (
            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
              <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>
                Save Changes
              </Button>
            </Stack>
          )}
        </Paper>

        {/* ACCOUNT INFO */}
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6">Account Information</Typography>
            <Typography variant="body2" color="text.secondary">Account Type</Typography>
            <Typography sx={{ fontWeight: 600 }}>Theater Owner</Typography>
          </CardContent>
        </Card>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>

      </Container>
    </Box>
  );
};

export default OwnerProfile;
