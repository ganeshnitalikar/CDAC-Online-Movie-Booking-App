

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  Login as LoginIcon,
} from "@mui/icons-material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../constants/routes";
import { toast } from "react-toastify";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, verifyOtp, loading, error, clearError } = useAuth();

  // ---------------- LOGIN STATE ----------------
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // ---------------- OTP STATE ----------------
  const [otpOpen, setOtpOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  useEffect(() => {
    clearError();
  }, [clearError]);


    useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // ---------------- VALIDATION ----------------
  const validateForm = () => {
    const errors = {};
    if (!formData.email) errors.email = "Email is required";
    if (!formData.password) errors.password = "Password is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ---------------- LOGIN ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const result = await login(formData);
     console.log(result)
     console.log(result.role)
    // ADMIN → OTP REQUIRED
    if (result?.success && result?.requiresOtp) {
      setOtpOpen(true);
      setOtp("");
      setOtpError("");
      return;
    }

    //  USER
    if (result?.success && result?.role?.trim().toUpperCase() === "USER") {
      console.log("hello")
      navigate(ROUTES.USER_DASHBOARD, { replace: true });
      return;
    }
 

    // OWNER
  if (result?.role?.trim().toUpperCase() === "THEATER_OWNER") {
    console.log("hello");
  navigate(ROUTES.OWNER_DASHBOARD, { replace: true }); 
  return;
}
  };

  // ---------------- VERIFY OTP ----------------
  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setOtpError("OTP is required");
      return;
    }

    const result = await verifyOtp({
      email: formData.email,
      otp_code: otp,
    });

    //  OTP SUCCESS
    if (result?.status === "success") {
      setOtpOpen(false);
      setOtp("");
      setOtpError("");
       toast.success("login successfull");
      navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
      return;
    }

    //  OTP FAILED → CLOSE POPUP & BACK TO LOGIN
  toast.error("Invalid or expired OTP ");
    setOtpOpen(false);
    setOtp("");
    setOtpError("");
  };

  // ---------------- CLOSE OTP MANUALLY ----------------
  const handleCloseOtp = () => {
    setOtpOpen(false);
    setOtp("");
    setOtpError("");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg,#667eea,#764ba2)",
      }}
    >
      <Container maxWidth="sm">
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" align="center" mb={3}>
            Welcome Back
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
              {error}
            </Alert>
          )}

          {/* ================= LOGIN FORM ================= */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              name="email"
              label="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              error={!!formErrors.email}
              helperText={formErrors.email}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              error={!!formErrors.password}
              helperText={formErrors.password}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword((p) => !p)}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
            <Typography align="right" sx={{ mt: -2, mb: 2 }}>
           <Link component={RouterLink} to={ROUTES.FORGOT_PASSWORD}>
              Forgot Password?
               </Link>
              </Typography>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              startIcon={
                loading ? <CircularProgress size={20} /> : <LoginIcon />
              }
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography align="center">
            Don't have an account?{" "}
            <Link component={RouterLink} to={ROUTES.REGISTER}>
              Register
            </Link>
          </Typography>
        </Paper>
      </Container>

      {/* ================= OTP POPUP ================= */}
      <Dialog
        open={otpOpen}
        onClose={handleCloseOtp}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle align="center">
          Admin OTP Verification
        </DialogTitle>

        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            OTP sent to admin email
          </Alert>

          <TextField
            fullWidth
            label="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            error={!!otpError}
            helperText={otpError}
          />
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleVerifyOtp}
            disabled={loading}
          >
            {loading ? <CircularProgress size={22} /> : "Verify OTP"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LoginPage;


