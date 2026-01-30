

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
  CameraAlt as CameraIcon,
} from '@mui/icons-material';

import { getUserProfile, updateUserProfile } from '../../services/user';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
 const [formData, setFormData] = useState({
    phone: '',
    location: '',
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await getUserProfile();
      setProfile(data);
      setFormData({
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      // ONLY send editable fields
      await updateUserProfile({
        phone: formData.phone,
        location: formData.location,
      });

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
      phone: profile?.phone || '',
      location: profile?.location || '',
    });
    setEditing(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

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
            {/* NAME - READ ONLY */}
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" fontWeight={600}>
                Full Name
              </Typography>
              <TextField fullWidth value={profile?.name || ''} disabled />
            </Grid>

            {/* EMAIL - READ ONLY */}
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" fontWeight={600}>
                Email
              </Typography>
              <TextField fullWidth value={profile?.email || ''} disabled />
            </Grid>

            {/* PHONE - EDITABLE */}
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" fontWeight={600}>
                Phone
              </Typography>
              <TextField
                fullWidth
                value={formData.phone}
                disabled={!editing}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </Grid>

            {/* LOCATION - EDITABLE */}
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" fontWeight={600}>
                Location
              </Typography>
              <TextField
                fullWidth
                value={formData.location}
                disabled={!editing}
                onChange={(e) => handleInputChange('location', e.target.value)}
              />
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
