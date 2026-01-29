import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
	Box,
	Container,
	Typography,
	Paper,
	Stack,
	Button,
	Alert,
	IconButton,
	CircularProgress,
} from '@mui/material';
import {
	ArrowBack as ArrowBackIcon,
	Payment as PaymentIcon,
} from '@mui/icons-material';
import { createRazorpayOrder } from '../../services/paymentService';

const PaymentPage = () => {
	const { bookingId } = useParams();
	const navigate = useNavigate();

	const [paying, setPaying] = useState(false);
	const [error, setError] = useState(null);

	const loadRazorpayScript = () => {
		return new Promise((resolve) => {
			if (window.Razorpay) {
				resolve(true);
				return;
			}
			const script = document.createElement('script');
			script.src = 'https://checkout.razorpay.com/v1/checkout.js';
			script.onload = () => resolve(true);
			script.onerror = () => resolve(false);
			document.body.appendChild(script);
		});
	};

	const handlePayment = async () => {
		setPaying(true);
		setError(null);

		try {
			const scriptLoaded = await loadRazorpayScript();
			if (!scriptLoaded) {
				throw new Error('Failed to load payment gateway. Please try again.');
			}

			// Create Razorpay order for this booking
			const orderData = await createRazorpayOrder(Number(bookingId));

			const options = {
				key: import.meta.env.VITE_RAZORPAY_KEY_ID,
				amount: orderData.amount,
				currency: orderData.currency || 'INR',
				name: 'Movie Booking',
				description: `Booking #${bookingId}`,
				order_id: orderData.orderId || orderData.razorpayOrderId,
				handler: function (response) {
					// Payment success - DO NOT confirm booking here.
					// Backend webhook will update booking status.
					console.log('Payment successful:', response);
					navigate(`/booking/${bookingId}/ticket`);
				},
				prefill: {
					name: orderData.customerName || '',
					email: orderData.customerEmail || '',
					contact: orderData.customerPhone || '',
				},
				theme: {
					color: '#1976d2',
				},
				modal: {
					ondismiss: function () {
						setPaying(false);
					},
				},
			};

			const razorpay = new window.Razorpay(options);
			razorpay.on('payment.failed', function (response) {
				console.error('Payment failed:', response.error);
				setError(response.error?.description || 'Payment failed. Please try again.');
				setPaying(false);
			});
			razorpay.open();
		} catch (err) {
			console.error('Error initiating payment:', err);

			// Handle booking expiry (410) gracefully based on message
			if (err.message && err.message.toLowerCase().includes('expired')) {
				setError('Booking expired. Please select seats again.');
				setTimeout(() => {
					navigate(-1);
				}, 2000);
			} else if (err.message && err.message.toLowerCase().includes('login')) {
				// Handle unauthorized (401) by redirecting to login
				navigate('/login');
			} else {
				setError(err.message || 'Failed to initiate payment');
			}

			setPaying(false);
		}
	};

	return (
		<Box sx={{ py: 4, minHeight: '80vh' }}>
			<Container maxWidth="sm">
				<Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
					<IconButton onClick={() => navigate(-1)}>
						<ArrowBackIcon />
					</IconButton>
					<Box sx={{ flex: 1 }}>
						<Typography variant="h5" sx={{ fontWeight: 800 }}>
							Complete Payment
						</Typography>
						<Typography color="text.secondary">
							Booking #{bookingId}
						</Typography>
					</Box>
				</Stack>

				{error && (
					<Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
						{error}
					</Alert>
				)}

				<Paper
					elevation={0}
					sx={{
						p: 4,
						borderRadius: 3,
						border: '1px solid',
						borderColor: 'divider',
						textAlign: 'center',
					}}
				>
					<Typography variant="body1" sx={{ mb: 2 }}>
						Click the button below to pay securely using Razorpay.
						Your seats are locked for a limited time.
					</Typography>

					<Button
						variant="contained"
						size="large"
						onClick={handlePayment}
						disabled={paying}
						startIcon={paying ? <CircularProgress size={20} color="inherit" /> : <PaymentIcon />}
						sx={{ mt: 2, textTransform: 'none', minWidth: 220 }}
					>
						{paying ? 'Processing...' : 'Pay with Razorpay'}
					</Button>
				</Paper>
			</Container>
		</Box>
	);
};

export default PaymentPage;

