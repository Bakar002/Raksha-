import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "../api/axios";
import { CircularProgress, Typography, Snackbar, Alert } from "@mui/material";

const EmailVerificationPage = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("info");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      const queryParams = new URLSearchParams(location.search);
      const token = queryParams.get("token");

      if (!token) {
        setMessage("Verification token is missing.");
        setSeverity("error");
        setSnackbarOpen(true);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `/api/auth/verify-email?token=${token}`
        );
        setMessage(response.data.message);
        setSeverity("success");
      } catch (error) {
        console.error("Verification error:", error);
        setMessage(
          error.response?.data?.message ||
            "Failed to verify email. Please try again."
        );
        setSeverity("error");
      } finally {
        setSnackbarOpen(true);
        setLoading(false);
      }
    };

    verifyEmail();
  }, [location.search]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="verification-container">
      {loading ? (
        <CircularProgress />
      ) : (
        <Typography variant="h6">{message}</Typography>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={severity}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default EmailVerificationPage;
