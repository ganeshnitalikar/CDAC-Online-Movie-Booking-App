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
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  Login as LoginIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../constants/routes";

const LoginPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();

  const { login, loading, error, clearError, isAuthenticated } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || ROUTES.USER_DASHBOARD;
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const result = await login(formData);

    if (result.success) {
      const from = location.state?.from?.pathname || ROUTES.USER_DASHBOARD;
      navigate(from, { replace: true });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            background: "background.paper",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: 2,
                background: "linear-gradient(45deg, #6366F1, #EC4899)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "bold",
                fontSize: "1.5rem",
                mx: "auto",
                mb: 2,
              }}
            >
              M
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                background: "linear-gradient(45deg, #6366F1, #EC4899)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
              }}
            >
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to your MovieHub account
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
            {/* Email Field */}
            <TextField
              fullWidth
              name="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
              disabled={loading}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            {/* Password Field */}
            <TextField
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleInputChange}
              error={!!formErrors.password}
              helperText={formErrors.password}
              disabled={loading}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={
                loading ? <CircularProgress size={20} /> : <LoginIcon />
              }
              sx={{
                py: 1.5,
                mb: 3,
                background: "linear-gradient(45deg, #6366F1, #EC4899)",
                "&:hover": {
                  background: "linear-gradient(45deg, #5B5BD6, #D946EF)",
                },
                "&:disabled": {
                  background: "action.disabledBackground",
                },
              }}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </Box>

          {/* Divider */}
          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          {/* Demo Accounts */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{ mb: 2, textAlign: "center", fontWeight: "bold" }}
            >
              Try Demo Accounts
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() =>
                  setFormData({
                    email: "admin@moviehub.com",
                    password: "admin123",
                  })
                }
                disabled={loading}
                sx={{ textTransform: "none" }}
              >
                Admin Account
              </Button>

              <Button
                variant="outlined"
                size="small"
                onClick={() =>
                  setFormData({
                    email: "user@moviehub.com",
                    password: "user123",
                  })
                }
                disabled={loading}
                sx={{ textTransform: "none" }}
              >
                User Account
              </Button>
            </Box>
          </Box>

          {/* Footer Links */}
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{" "}
              <Link
                component={RouterLink}
                to={ROUTES.REGISTER}
                sx={{
                  color: "primary.main",
                  textDecoration: "none",
                  fontWeight: "bold",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Sign up here
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
