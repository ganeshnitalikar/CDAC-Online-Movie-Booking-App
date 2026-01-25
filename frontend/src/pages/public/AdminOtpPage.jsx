

import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ROUTES } from "../../constants/routes";

const AdminOtpPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  // Email passed from LoginPage
  const email = state?.email;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setError("OTP is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await verifyOtp({
    email,
    otp_code: otp,
  });

      if (res.data.status === "success") {
        localStorage.setItem("authToken", res.data.data.token);
        localStorage.setItem(
          "authUser",
          JSON.stringify({ role: "ADMIN", email })
        );

        navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
      } else {
        setError(res.data.error || "Invalid OTP");
      }
    } catch (err) {
      setError("OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
      }}
    >
      <Container maxWidth="sm">
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" align="center" mb={2}>
            Admin OTP Verification
          </Typography>

          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            mb={3}
          >
            Enter the OTP sent to your email
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={handleVerifyOtp}
            disabled={loading}
          >
            {loading ? <CircularProgress size={22} /> : "Verify OTP"}
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminOtpPage;