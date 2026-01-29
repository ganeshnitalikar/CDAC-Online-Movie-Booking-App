import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { createSeats } from "../../services/ownerSeatService";

const OwnerAddSeatsModal = ({ open, onClose, screens, onCreated }) => {
  const [screenId, setScreenId] = useState("");
  const [rowLabel, setRowLabel] = useState("");
  const [seatCount, setSeatCount] = useState(0);
  const [type, setType] = useState("NORMAL");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const screenOptions = useMemo(() => (Array.isArray(screens) ? screens : []), [screens]);

  useEffect(() => {
    if (!open) return;
    setError(null);
    if (screenOptions.length > 0 && !screenId) {
      setScreenId(String(screenOptions[0].id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, screenOptions.length]);

  const handleClose = () => {
    if (submitting) return;
    setError(null);
    onClose?.();
  };

  const handleSubmit = async () => {
    setError(null);

    if (!screenId) {
      setError("Screen is required");
      return;
    }
    if (!rowLabel?.trim()) {
      setError("Row Label is required");
      return;
    }
    const count = Number(seatCount);
    if (!Number.isFinite(count) || count <= 0) {
      setError("Seat Count must be greater than 0");
      return;
    }
    if (type !== "NORMAL" && type !== "PREMIUM") {
      setError("Seat Type must be NORMAL or PREMIUM");
      return;
    }

    const row = rowLabel.trim().toUpperCase();
    const seats = Array.from({ length: count }).map((_, idx) => {
      const seatNumber = idx + 1;
      return {
        rowLabel: row,
        seatLabel: String(seatNumber),
        seatNumber,
        type,
      };
    });

    setSubmitting(true);
    try {
      await createSeats(Number(screenId), seats);
      await onCreated?.();
      onClose?.();
    } catch (e) {
      setError(e?.message || "Failed to create seats");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Seats</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          <FormControl fullWidth required>
            <InputLabel>Screen</InputLabel>
            <Select
              value={screenId}
              label="Screen"
              onChange={(e) => setScreenId(e.target.value)}
              disabled={submitting}
            >
              {screenOptions.map((s) => (
                <MenuItem key={s.id} value={String(s.id)}>
                  {s.name || `Screen ${s.id}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Row Label"
            value={rowLabel}
            onChange={(e) => setRowLabel(e.target.value)}
            required
            disabled={submitting}
            helperText="Example: A"
          />
          <TextField
            fullWidth
            label="Seat Count"
            type="number"
            value={seatCount}
            onChange={(e) => setSeatCount(e.target.value)}
            required
            disabled={submitting}
            inputProps={{ min: 1, step: 1 }}
          />
          <FormControl fullWidth required>
            <InputLabel>Seat Type</InputLabel>
            <Select
              value={type}
              label="Seat Type"
              onChange={(e) => setType(e.target.value)}
              disabled={submitting}
            >
              <MenuItem value="NORMAL">NORMAL</MenuItem>
              <MenuItem value="PREMIUM">PREMIUM</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={submitting} sx={{ textTransform: "none" }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting}
          startIcon={submitting ? <CircularProgress size={16} /> : null}
          sx={{ textTransform: "none" }}
        >
          {submitting ? "Creating..." : "Create Seats"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OwnerAddSeatsModal;

