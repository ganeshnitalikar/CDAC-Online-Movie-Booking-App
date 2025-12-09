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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Divider,
  Alert,
  Snackbar,
  MenuItem,
} from '@mui/material';
import {
  CreditCard as CreditCardIcon,
  AccountBalance as AccountBalanceIcon,
  Wallet as WalletIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { getPaymentMethods, addPaymentMethod, removePaymentMethod } from '../../services/user';

const PaymentMethodCard = ({ method, onDelete }) => {
  const getMethodIcon = () => {
    switch (method.type) {
      case 'card':
        return <CreditCardIcon />;
      case 'upi':
        return <AccountBalanceIcon />;
      case 'wallet':
        return <WalletIcon />;
      default:
        return <CreditCardIcon />;
    }
  };

  const getMethodLabel = () => {
    switch (method.type) {
      case 'card':
        return `${method.brand} •••• ${method.last4}`;
      case 'upi':
        return method.handle;
      case 'wallet':
        return method.name || 'Wallet';
      default:
        return 'Payment Method';
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 2,
          borderColor: 'primary.main',
        },
      }}
    >
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={2} alignItems="center" sx={{ flexGrow: 1 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: 'primary.light',
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {getMethodIcon()}
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                {getMethodLabel()}
              </Typography>
              {method.type === 'card' && method.expiry && (
                <Typography variant="caption" color="text.secondary">
                  Expires {method.expiry}
                </Typography>
              )}
              {method.type === 'upi' && (
                <Typography variant="caption" color="text.secondary">
                  UPI ID
                </Typography>
              )}
            </Box>
          </Stack>
          <IconButton
            color="error"
            onClick={() => onDelete(method)}
            sx={{
              '&:hover': {
                bgcolor: 'error.light',
              },
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  );
};

const UserPayment = () => {
  const { user } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [methodToDelete, setMethodToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Form state for adding new payment method
  const [newMethod, setNewMethod] = useState({
    type: 'card',
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardholderName: '',
    upiId: '',
    walletName: '',
  });

  const fetchPaymentMethods = async () => {
    setLoading(true);
    try {
      const data = await getPaymentMethods();
      setPaymentMethods(data);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const handleAddClick = () => {
    setNewMethod({
      type: 'card',
      cardNumber: '',
      expiry: '',
      cvv: '',
      cardholderName: '',
      upiId: '',
      walletName: '',
    });
    setAddDialogOpen(true);
  };

  const handleAddConfirm = async () => {
    try {
      let methodData;
      if (newMethod.type === 'card') {
        methodData = {
          type: 'card',
          brand: newMethod.cardNumber.startsWith('4') ? 'Visa' : 'Mastercard',
          last4: newMethod.cardNumber.slice(-4),
          expiry: newMethod.expiry,
          cardholderName: newMethod.cardholderName,
        };
      } else if (newMethod.type === 'upi') {
        methodData = {
          type: 'upi',
          handle: newMethod.upiId,
        };
      } else {
        methodData = {
          type: 'wallet',
          name: newMethod.walletName,
        };
      }

      await addPaymentMethod(methodData);
      fetchPaymentMethods();
      setAddDialogOpen(false);
      setSnackbar({
        open: true,
        message: 'Payment method added successfully!',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error adding payment method:', error);
      setSnackbar({
        open: true,
        message: 'Failed to add payment method',
        severity: 'error',
      });
    }
  };

  const handleDeleteClick = (method) => {
    setMethodToDelete(method);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (methodToDelete) {
      try {
        await removePaymentMethod(methodToDelete.id);
        fetchPaymentMethods();
        setDeleteDialogOpen(false);
        setMethodToDelete(null);
        setSnackbar({
          open: true,
          message: 'Payment method removed successfully!',
          severity: 'success',
        });
      } catch (error) {
        console.error('Error removing payment method:', error);
        setSnackbar({
          open: true,
          message: 'Failed to remove payment method',
          severity: 'error',
        });
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
              Payment Methods
            </Typography>
            <Typography color="text.secondary">
              Manage your payment options for quick checkout
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchPaymentMethods}
              sx={{ textTransform: 'none' }}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddClick}
              sx={{ textTransform: 'none' }}
            >
              Add Payment Method
            </Button>
          </Stack>
        </Stack>

        {/* Payment Methods List */}
        {loading ? (
          <Grid container spacing={2}>
            {[1, 2].map((i) => (
              <Grid item xs={12} md={6} key={i}>
                <Skeleton height={120} variant="rounded" />
              </Grid>
            ))}
          </Grid>
        ) : paymentMethods.length > 0 ? (
          <Grid container spacing={2}>
            {paymentMethods.map((method) => (
              <Grid item xs={12} md={6} key={method.id}>
                <PaymentMethodCard method={method} onDelete={handleDeleteClick} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              textAlign: 'center',
            }}
          >
            <CreditCardIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              No payment methods
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Add a payment method to make booking faster and easier
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddClick}
              sx={{ textTransform: 'none' }}
            >
              Add Payment Method
            </Button>
          </Paper>
        )}

        {/* Security Notice */}
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">
            <strong>Secure Payment:</strong> Your payment information is encrypted and stored securely. 
            We never store your full card details or CVV.
          </Typography>
        </Alert>

        {/* Add Payment Method Dialog */}
        <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add Payment Method</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                select
                label="Payment Type"
                value={newMethod.type}
                onChange={(e) => setNewMethod({ ...newMethod, type: e.target.value })}
                fullWidth
                size="small"
                SelectProps={{
                  native: false,
                  renderValue: (value) => {
                    const options = {
                      card: 'Credit/Debit Card',
                      upi: 'UPI',
                      wallet: 'Digital Wallet',
                    };
                    return options[value] || value;
                  },
                }}
              >
                <MenuItem value="card">Credit/Debit Card</MenuItem>
                <MenuItem value="upi">UPI</MenuItem>
                <MenuItem value="wallet">Digital Wallet</MenuItem>
              </TextField>

              {newMethod.type === 'card' && (
                <>
                  <TextField
                    label="Card Number"
                    value={newMethod.cardNumber}
                    onChange={(e) => setNewMethod({ ...newMethod, cardNumber: e.target.value })}
                    fullWidth
                    size="small"
                    placeholder="1234 5678 9012 3456"
                    inputProps={{ maxLength: 19 }}
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        label="Expiry Date"
                        value={newMethod.expiry}
                        onChange={(e) => setNewMethod({ ...newMethod, expiry: e.target.value })}
                        fullWidth
                        size="small"
                        placeholder="MM/YY"
                        inputProps={{ maxLength: 5 }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="CVV"
                        value={newMethod.cvv}
                        onChange={(e) => setNewMethod({ ...newMethod, cvv: e.target.value })}
                        fullWidth
                        size="small"
                        type="password"
                        inputProps={{ maxLength: 3 }}
                      />
                    </Grid>
                  </Grid>
                  <TextField
                    label="Cardholder Name"
                    value={newMethod.cardholderName}
                    onChange={(e) => setNewMethod({ ...newMethod, cardholderName: e.target.value })}
                    fullWidth
                    size="small"
                  />
                </>
              )}

              {newMethod.type === 'upi' && (
                <TextField
                  label="UPI ID"
                  value={newMethod.upiId}
                  onChange={(e) => setNewMethod({ ...newMethod, upiId: e.target.value })}
                  fullWidth
                  size="small"
                  placeholder="yourname@upi"
                />
              )}

              {newMethod.type === 'wallet' && (
                <TextField
                  label="Wallet Name"
                  value={newMethod.walletName}
                  onChange={(e) => setNewMethod({ ...newMethod, walletName: e.target.value })}
                  fullWidth
                  size="small"
                  placeholder="Paytm, PhonePe, etc."
                />
              )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddDialogOpen(false)} sx={{ textTransform: 'none' }}>
              Cancel
            </Button>
            <Button
              onClick={handleAddConfirm}
              variant="contained"
              sx={{ textTransform: 'none' }}
            >
              Add Method
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Remove Payment Method</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to remove this payment method? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} sx={{ textTransform: 'none' }}>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
              sx={{ textTransform: 'none' }}
            >
              Remove
            </Button>
          </DialogActions>
        </Dialog>

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

export default UserPayment;
