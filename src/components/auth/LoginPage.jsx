import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { CustomTextField } from "../Custom";
import {
  Alert,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Snackbar,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/axios";

// Validation schema using Yup
const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const location = useLocation();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");

  const from = location?.state?.from?.pathname || "/";

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLoginSubmit = async (values, { setSubmitting }) => {
    try {
      const payload = { ...values };
      const response = await axios.post("/api/auth/login", payload);
      if (response.status === 200) {
        setSnackbarMessage("Login successful!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        const { accessToken, user } = response.data;

        localStorage.setItem("authToken", accessToken);
        localStorage.setItem("user", JSON.stringify(user));

        setAuth({ accessToken, user });
        navigate(from, { replace: true });
      }
    } catch (error) {
      let errorMessage = "An unexpected error occurred. Please try again.";

      if (error.response) {
        if (error.response.status === 400) {
          errorMessage =
            error.response.data.error === "Invalid credentials"
              ? "Invalid email or password. Please try again."
              : error.response.data.message || errorMessage;
        } else if (error.response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      } else if (error.request) {
        // No response from server
        errorMessage =
          "No response from the server. Please check your connection.";
      } else {
        errorMessage = error.message || errorMessage;
      }

      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page-container">
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={loginValidationSchema}
        onSubmit={handleLoginSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="login-form">
            <Typography variant="h5" gutterBottom>
              Login
            </Typography>
            <CustomTextField name="email" label="Email" />
            <CustomTextField
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {!showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              sx={{ color: "white" }}
              variant="contained"
              fullWidth
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Login"
              )}
            </Button>
          </Form>
        )}
      </Formik>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default LoginPage;
