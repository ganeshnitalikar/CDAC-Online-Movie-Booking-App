import React, { useState } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Stack,
	Alert,
	CircularProgress,
	Box,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import indiaCities from '../../Data/india_cities.json';
import { createOwner } from '../../services/admin';

const AddTheatreOwnerModal = ({ open, onClose, onSuccess }) => {
	const [formData, setFormData] = useState({
		full_name: '',
		email: '',
		phone_number: '',
		password: '',
		confirmPassword: '',
		city: '',
	});

	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const [successMessage, setSuccessMessage] = useState('');
	const [errorMessage, setErrorMessage] = useState('');

	// Handle input change
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
		// Clear error for this field when user starts typing
		if (errors[name]) {
			setErrors(prev => ({
				...prev,
				[name]: ''
			}));
		}
	};

	// Validate form
	const validateForm = () => {
		const newErrors = {};

		if (!formData.full_name.trim()) {
			newErrors.name = 'Name is required';
		} else if (formData.full_name.trim().length < 3) {
			newErrors.name = 'Name must be at least 3 characters';
		}

		if (!formData.email.trim()) {
			newErrors.email = 'Email is required';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			newErrors.email = 'Invalid email format';
		}

		if (!formData.phone_number.trim()) {
			newErrors.phone = 'Phone number is required';
		} else if (!/^[0-9]{10}$/.test(formData.phone_number.replace(/\D/g, ''))) {
			newErrors.phone = 'Phone number must be 10 digits';
		}

		if (!formData.password) {
			newErrors.password = 'Password is required';
		} else if (formData.password.length < 6) {
			newErrors.password = 'Password must be at least 6 characters';
		}

		if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = 'Passwords do not match';
		}

		if (!formData.city) {
			newErrors.city = 'City is required';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Handle submit
	const handleSubmit = async () => {
		if (!validateForm()) {
			return;
		}

		setLoading(true);
		setErrorMessage('');
		setSuccessMessage('');

		try {
			const response = await createOwner({
				full_name: formData.full_name.trim(),
				email: formData.email.trim(),
				phone_number: formData.phone_number.trim(),
				password: formData.password,
				city: formData.city,
			});

			if (response.success) {
				setSuccessMessage('Theatre owner created successfully!');
				// Reset form
				setFormData({
					full_name: '',
					email: '',
					phone_number: '',
					password: '',
					confirmPassword: '',
					city: '',
				});
				// Close modal after 1.5 seconds
				setTimeout(() => {
					onClose();
					if (onSuccess) onSuccess();
				}, 1500);
			} else {
				setErrorMessage(response.message || 'Failed to create theatre owner');
			}
		} catch (error) {
			setErrorMessage(error.message || 'An error occurred while creating theatre owner');
			console.error('Error creating owner:', error);
		} finally {
			setLoading(false);
		}
	};

	// Handle close
	const handleClose = () => {
		if (!loading) {
			setFormData({
				full_name: '',
				email: '',
				phone_number: '',
				password: '',
				confirmPassword: '',
				city: '',
			});
			setErrors({});
			setErrorMessage('');
			setSuccessMessage('');
			onClose();
		}
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			maxWidth="sm"
			fullWidth
			PaperProps={{
				sx: {
					borderRadius: 2,
				}
			}}
		>
			<DialogTitle sx={{ 
				fontWeight: 700, 
				fontSize: '1.25rem',
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				pb: 1
			}}>
				Add Theatre Owner
				<IconButton
					onClick={handleClose}
					disabled={loading}
					size="small"
					sx={{
						color: 'text.secondary',
						'&:hover': {
							bgcolor: 'action.hover'
						}
					}}
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>

			<DialogContent sx={{ pt: 2 }}>
				<Stack spacing={2}>
					{successMessage && (
						<Alert severity="success" onClose={() => setSuccessMessage('')}>
							{successMessage}
						</Alert>
					)}

					{errorMessage && (
						<Alert severity="error" onClose={() => setErrorMessage('')}>
							{errorMessage}
						</Alert>
					)}

					<TextField
						label="Full Name"
						name="full_name"
						value={formData.full_name}
						onChange={handleInputChange}
						fullWidth
						error={!!errors.name}
						helperText={errors.name}
						disabled={loading}
						placeholder="Enter theatre owner's full name"
						variant="outlined"
					/>

					<TextField
						label="Email Address"
						name="email"
						type="email"
						value={formData.email}
						onChange={handleInputChange}
						fullWidth
						error={!!errors.email}
						helperText={errors.email}
						disabled={loading}
						placeholder="Enter valid email address"
						variant="outlined"
					/>

					<TextField
						label="Phone Number"
						name="phone_number"
						value={formData.phone_number}
						onChange={handleInputChange}
						fullWidth
						error={!!errors.phone}
						helperText={errors.phone || 'Enter 10-digit phone number'}
						disabled={loading}
						placeholder="Enter 10-digit phone number"
						variant="outlined"
						inputProps={{
							maxLength: '15'
						}}
					/>

					<FormControl fullWidth error={!!errors.city}>
						<InputLabel>City</InputLabel>
						<Select
							name="city"
							value={formData.city}
							onChange={handleInputChange}
							label="City"
							disabled={loading}
						>
							<MenuItem value="">
								<em>Select a city</em>
							</MenuItem>
							{indiaCities.map((city) => (
								<MenuItem key={city} value={city}>
									{city}
								</MenuItem>
							))}
						</Select>
						{errors.city && (
							<Box sx={{ color: '#d32f2f', fontSize: '0.75rem', mt: 0.5 }}>
								{errors.city}
							</Box>
						)}
					</FormControl>

					<TextField
						label="Password"
						name="password"
						type="password"
						value={formData.password}
						onChange={handleInputChange}
						fullWidth
						error={!!errors.password}
						helperText={errors.password || 'Minimum 6 characters'}
						disabled={loading}
						placeholder="Enter a strong password"
						variant="outlined"
					/>

					<TextField
						label="Confirm Password"
						name="confirmPassword"
						type="password"
						value={formData.confirmPassword}
						onChange={handleInputChange}
						fullWidth
						error={!!errors.confirmPassword}
						helperText={errors.confirmPassword}
						disabled={loading}
						placeholder="Confirm your password"
						variant="outlined"
					/>
				</Stack>
			</DialogContent>

			<DialogActions sx={{ p: 2, pt: 0, gap: 1 }}>
				<Button
					onClick={handleClose}
					disabled={loading}
					sx={{ textTransform: 'none' }}
				>
					Cancel
				</Button>
				<Button
					onClick={handleSubmit}
					variant="contained"
					disabled={loading}
					sx={{ textTransform: 'none' }}
				>
					{loading ? (
						<>
							<CircularProgress size={20} sx={{ mr: 1 }} />
							Creating...
						</>
					) : (
						'Create Owner'
					)}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default AddTheatreOwnerModal;
