// import React, { useEffect, useState } from 'react';
// import {
//   Box,
//   Container,
//   Typography,
//   Grid,
//   Paper,
//   TextField,
//   Button,
//   Stack,
//   Avatar,
//   Divider,
//   Alert,
//   Snackbar,
//   Card,
//   CardContent,
//   Skeleton,
// } from '@mui/material';
// import {
//   Save as SaveIcon,
//   Edit as EditIcon,
//   Person as PersonIcon,
//   Email as EmailIcon,
//   Phone as PhoneIcon,
//   LocationOn as LocationIcon,
//   CameraAlt as CameraIcon,
// } from '@mui/icons-material';
// import { useAuth } from '../../hooks/useAuth';
// import { getUserProfile, updateUserProfile } from '../../services/user';

// const UserProfile = () => {
//   const { user } = useAuth();
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [editing, setEditing] = useState(false);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     location: '',
//   });

//   const fetchProfile = async () => {
//     setLoading(true);
//     try {
//       const data = await getUserProfile();
//       setProfile(data);
//       setFormData({
//         name: data.name || '',
//         email: data.email || '',
//         phone: data.phone || '',
//         location: data.location || '',
//       });
//     } catch (error) {
//       console.error('Error fetching profile:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const handleInputChange = (field, value) => {
//     setFormData({ ...formData, [field]: value });
//   };

//   const handleSave = async () => {
//     try {
//       const response = await updateUserProfile(formData);
//       setProfile(response.user);
//       setEditing(false);
//       setSnackbar({
//         open: true,
//         message: 'Profile updated successfully!',
//         severity: 'success',
//       });
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       setSnackbar({
//         open: true,
//         message: 'Failed to update profile',
//         severity: 'error',
//       });
//     }
//   };

//   const handleCancel = () => {
//     setFormData({
//       name: profile?.name || '',
//       email: profile?.email || '',
//       phone: profile?.phone || '',
//       location: profile?.location || '',
//     });
//     setEditing(false);
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbar({ ...snackbar, open: false });
//   };

//   if (loading) {
//   return (
//       <Box sx={{ py: 4 }}>
//         <Container maxWidth="md">
//           <Skeleton height={48} width="40%" sx={{ mb: 3 }} />
//           <Skeleton height={200} variant="rounded" />
//         </Container>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ py: 4 }}>
//       <Container maxWidth="md">
//         {/* Header */}
//         <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
//           <Box>
//             <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
//               My Profile
//             </Typography>
//             <Typography color="text.secondary">
//               Manage your personal information
//             </Typography>
//           </Box>
//           {!editing && (
//             <Button
//               variant="contained"
//               startIcon={<EditIcon />}
//               onClick={() => setEditing(true)}
//               sx={{ textTransform: 'none' }}
//             >
//               Edit Profile
//             </Button>
//           )}
//         </Stack>

//         {/* Profile Card */}
//         <Paper
//           elevation={0}
//           sx={{
//             p: 4,
//             borderRadius: 3,
//             border: '1px solid',
//             borderColor: 'divider',
//           }}
//         >
//           {/* Avatar Section */}
//           <Stack spacing={3} alignItems="center" sx={{ mb: 4 }}>
//             <Box sx={{ position: 'relative' }}>
//               <Avatar
//                 sx={{
//                   width: 120,
//                   height: 120,
//                   bgcolor: 'primary.main',
//                   fontSize: '3rem',
//                   fontWeight: 'bold',
//                 }}
//               >
//                 {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
//               </Avatar>
//               {editing && (
//                 <Button
//                   component="label"
//                   variant="contained"
//                   size="small"
//                   startIcon={<CameraIcon />}
//                   sx={{
//                     position: 'absolute',
//                     bottom: 0,
//                     right: 0,
//                     minWidth: 'auto',
//                     width: 40,
//                     height: 40,
//                     borderRadius: '50%',
//                     textTransform: 'none',
//                   }}
//                 >
//                   <input type="file" hidden accept="image/*" />
//                 </Button>
//               )}
//             </Box>
//             <Typography variant="h5" sx={{ fontWeight: 700 }}>
//               {profile?.name || 'User'}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               {profile?.email || 'No email'}
//             </Typography>
//           </Stack>

//           <Divider sx={{ my: 3 }} />

//           {/* Profile Information */}
//           <Stack spacing={3}>
//             <Grid container spacing={3}>
//               <Grid item xs={12} sm={6}>
//                 <Stack spacing={1}>
//                   <Stack direction="row" spacing={1} alignItems="center">
//                     <PersonIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
//                     <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
//                       Full Name
//                     </Typography>
//                   </Stack>
//                   {editing ? (
//                     <TextField
//                       fullWidth
//                       value={formData.name}
//                       onChange={(e) => handleInputChange('name', e.target.value)}
//                       placeholder="Enter your full name"
//                       size="small"
//                       variant="outlined"
//                     />
//                   ) : (
//                     <Typography variant="body1" sx={{ fontWeight: 600 }}>
//                       {profile?.name || 'Not set'}
//                     </Typography>
//                   )}
//                 </Stack>
//               </Grid>

//               <Grid item xs={12} sm={6}>
//                 <Stack spacing={1}>
//                   <Stack direction="row" spacing={1} alignItems="center">
//                     <EmailIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
//                     <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
//                       Email Address
//                     </Typography>
//                   </Stack>
//                   {editing ? (
//                     <TextField
//                       fullWidth
//                       type="email"
//                       value={formData.email}
//                       onChange={(e) => handleInputChange('email', e.target.value)}
//                       placeholder="Enter your email"
//                       size="small"
//                       variant="outlined"
//                     />
//                   ) : (
//                     <Typography variant="body1" sx={{ fontWeight: 600 }}>
//                       {profile?.email || 'Not set'}
//                     </Typography>
//                   )}
//                 </Stack>
//               </Grid>

//               <Grid item xs={12} sm={6}>
//                 <Stack spacing={1}>
//                   <Stack direction="row" spacing={1} alignItems="center">
//                     <PhoneIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
//                     <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
//                       Phone Number
//                     </Typography>
//                   </Stack>
//                   {editing ? (
//                     <TextField
//                       fullWidth
//                       type="tel"
//                       value={formData.phone}
//                       onChange={(e) => handleInputChange('phone', e.target.value)}
//                       placeholder="Enter your phone number"
//                       size="small"
//                       variant="outlined"
//                     />
//                   ) : (
//                     <Typography variant="body1" sx={{ fontWeight: 600 }}>
//                       {profile?.phone || 'Not set'}
//                     </Typography>
//                   )}
//                 </Stack>
//               </Grid>

//               <Grid item xs={12} sm={6}>
//                 <Stack spacing={1}>
//                   <Stack direction="row" spacing={1} alignItems="center">
//                     <LocationIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
//                     <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
//                       Location
//                     </Typography>
//                   </Stack>
//                   {editing ? (
//                     <TextField
//                       fullWidth
//                       value={formData.location}
//                       onChange={(e) => handleInputChange('location', e.target.value)}
//                       placeholder="Enter your location"
//                       size="small"
//                       variant="outlined"
//                     />
//                   ) : (
//                     <Typography variant="body1" sx={{ fontWeight: 600 }}>
//                       {profile?.location || 'Not set'}
//                     </Typography>
//                   )}
//                 </Stack>
//               </Grid>
//             </Grid>

//             {/* Action Buttons */}
//             {editing && (
//               <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
//                 <Button
//                   variant="outlined"
//                   onClick={handleCancel}
//                   sx={{ textTransform: 'none' }}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   variant="contained"
//                   startIcon={<SaveIcon />}
//                   onClick={handleSave}
//                   sx={{ textTransform: 'none' }}
//                 >
//                   Save Changes
//                 </Button>
//               </Stack>
//             )}
//           </Stack>
//         </Paper>

//         {/* Account Info Card */}
//         <Card
//           elevation={0}
//           sx={{
//             mt: 3,
//             border: '1px solid',
//             borderColor: 'divider',
//           }}
//         >
//           <CardContent>
//             <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
//               Account Information
//             </Typography>
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="body2" color="text.secondary">
//                   Account Type
//                 </Typography>
//                 <Typography variant="body1" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
//                   {profile?.role || 'USER'}
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="body2" color="text.secondary">
//                   Member Since
//                 </Typography>
//                 <Typography variant="body1" sx={{ fontWeight: 600 }}>
//                   {new Date().toLocaleDateString()}
//                 </Typography>
//               </Grid>
//             </Grid>
//           </CardContent>
//         </Card>

//         {/* Snackbar */}
//         <Snackbar
//           open={snackbar.open}
//           autoHideDuration={3000}
//           onClose={handleCloseSnackbar}
//           anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//         >
//           <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
//             {snackbar.message}
//           </Alert>
//         </Snackbar>
//       </Container>
//     </Box>
//   );
// };

// export default UserProfile;

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
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CameraAlt as CameraIcon,
} from '@mui/icons-material';

import { getUserProfile, updateUserProfile } from '../../services/user';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // =========================
  // FETCH PROFILE
  // =========================
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await getUserProfile();
      setProfile(data);
      setFormData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        location: data.location || '',
      });
    } catch (err) {
      console.error('Profile fetch error:', err);
      setSnackbar({
        open: true,
        message: 'Failed to load profile',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // =========================
  // HANDLERS
  // =========================
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await updateUserProfile(formData);
      setEditing(false);
      fetchProfile();
      setSnackbar({
        open: true,
        message: 'Profile updated successfully',
        severity: 'success',
      });
    } catch (err) {
      console.error('Update error:', err);
      setSnackbar({
        open: true,
        message: 'Failed to update profile',
        severity: 'error',
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profile?.name || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      location: profile?.location || '',
    });
    setEditing(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // =========================
  // LOADING UI
  // =========================
  if (loading) {
    return (
      <Box sx={{ py: 4 }}>
        <Container maxWidth="md">
          <Skeleton height={40} width="30%" sx={{ mb: 2 }} />
          <Skeleton height={250} variant="rounded" />
        </Container>
      </Box>
    );
  }

  // =========================
  // MAIN UI
  // =========================
  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="md">
        {/* HEADER */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h4" fontWeight={800}>
              My Profile
            </Typography>
            <Typography color="text.secondary">
              Manage your personal information
            </Typography>
          </Box>

          {!editing && (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => setEditing(true)}
              sx={{ textTransform: 'none' }}
            >
              Edit Profile
            </Button>
          )}
        </Stack>

        {/* PROFILE CARD */}
        <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
          {/* AVATAR */}
          <Stack spacing={2} alignItems="center">
            <Box sx={{ position: 'relative' }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: 'primary.main',
                  fontSize: '3rem',
                  fontWeight: 'bold',
                }}
              >
                {profile?.name?.charAt(0)?.toUpperCase()}
              </Avatar>

              {editing && (
                <Button
                  component="label"
                  variant="contained"
                  size="small"
                  startIcon={<CameraIcon />}
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    minWidth: 36,
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                  }}
                >
                  <input hidden type="file" accept="image/*" />
                </Button>
              )}
            </Box>

            <Typography variant="h5" fontWeight={700}>
              {profile?.name}
            </Typography>
            <Typography color="text.secondary">{profile?.email}</Typography>
          </Stack>

          <Divider sx={{ my: 4 }} />

          {/* DETAILS */}
          <Grid container spacing={3}>
            {/* NAME */}
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" fontWeight={600}>
                Full Name
              </Typography>
              {editing ? (
                <TextField
                  fullWidth
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              ) : (
                <Typography>{profile?.name}</Typography>
              )}
            </Grid>

            {/* EMAIL */}
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" fontWeight={600}>
                Email
              </Typography>
              {editing ? (
                <TextField
                  fullWidth
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              ) : (
                <Typography>{profile?.email}</Typography>
              )}
            </Grid>

            {/* PHONE */}
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" fontWeight={600}>
                Phone
              </Typography>
              {editing ? (
                <TextField
                  fullWidth
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              ) : (
                <Typography>{profile?.phone}</Typography>
              )}
            </Grid>

            {/* LOCATION */}
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" fontWeight={600}>
                Location
              </Typography>
              {editing ? (
                <TextField
                  fullWidth
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
              ) : (
                <Typography>{profile?.location}</Typography>
              )}
            </Grid>
          </Grid>

          {/* ACTION BUTTONS */}
          {editing && (
            <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
              <Button variant="outlined" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>
                Save Changes
              </Button>
            </Stack>
          )}
        </Paper>

        {/* ACCOUNT INFO */}
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700}>
              Account Information
            </Typography>
            <Typography sx={{ mt: 1 }}>
              Role: <strong>{profile?.role}</strong>
            </Typography>
          </CardContent>
        </Card>

        {/* SNACKBAR */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
        >
          <Alert severity={snackbar.severity} onClose={handleCloseSnackbar}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default UserProfile;
