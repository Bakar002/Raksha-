/* eslint-disable react/no-unescaped-entities */
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { CustomTextField } from "../components/Custom";
import {
  Button,
  IconButton,
  InputAdornment,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import {
  Check,
  ContentCopy,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import LocationSelector from "../components/location/LocationSelector";
import RecaptchaComponent from "../components/Recaptcha";
import axios from "../api/axios";

// Validation schema using Yup
const validationSchema = Yup.object({
  name: Yup.string().required("NGO name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
  address: Yup.string().required("Address is required"),
  location: Yup.object({
    lat: Yup.number().required("Latitude is required"),
    lng: Yup.number().required("Longitude is required"),
  }).required("Location is required"),
  pincode: Yup.string().required("Pincode is required"),
  contact: Yup.string().required("Contact Number is required"),
});

const NGORegistrationPage = () => {
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [showPassword, setShowPassword] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [submittedValues, setSubmittedValues] = useState({});
  const [IsPasswordMessageCopied, setIsPasswordMessageCopied] = useState(false);
  const [IsEmailMessageCopied, setIsEmailMessageCopied] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const [openModal, setOpenModal] = useState(false);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    if (!recaptchaToken) {
      setSubmitting(false);
      return;
    }
    const role = "ngo";
    const payload = {
      ...values,
      role,
      recaptchaToken,
    };

    try {
      const response = await axios.post("/api/auth/signup", payload);
      console.log("Registration successful:", response.data);
      setSubmittedValues(values);
      setSnackbarMessage("Registration successful!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setOpenModal(true);
      resetForm();
    } catch (error) {
      console.error("Registration error:", error?.response?.data.message);
      if (error?.response.data.message === "Ngo already registered") {
        setSnackbarMessage("NGO is already registered! please log in");
      } else if (error?.response.data.message === "User already exists") {
        setSnackbarMessage("User is already registered! please log in");
      } else if (error?.message === "reCAPTCHA verification failed") {
        setSnackbarMessage("Recaptcha verification failed! Please try again");
      }
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
    setSubmitting(false);
  };
  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email);
    setIsEmailMessageCopied(true);
  };
  const handleCopyPassword = (password) => {
    navigator.clipboard.writeText(password);
    setIsPasswordMessageCopied(true);
  };

  return (
    <div className="registration-container">
      <Typography variant="h5" gutterBottom>
        Register your NGO now
      </Typography>
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          address: "",
          location: { lat: "", lng: "" },
          pincode: "",
          contact: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form className="registration-form">
            <div className="details-inputs">
              <CustomTextField name="name" label="NGO Name" />
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
              <CustomTextField name="address" label="Address" />
              <CustomTextField name="pincode" label="Pincode" />
              <CustomTextField name="contact" label="Contact Number" />
            </div>
            <div>
              <LocationSelector
                onSelectLocation={(location) => {
                  setFieldValue("location", location);
                }}
              />
              <ErrorMessage
                name="location.lat"
                component="p"
                className="error"
              />
              <ErrorMessage
                name="location.lng"
                component="p"
                className="error"
              />
            </div>
            <RecaptchaComponent onVerify={setRecaptchaToken} />
            <Button
              sx={{ color: "white" }}
              variant="contained"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Register now"
              )}
            </Button>
            <Dialog maxWidth="sm" open={openModal} onClose={handleCloseModal}>
              <DialogTitle
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <Alert severity="error">Important Security Notice</Alert>
              </DialogTitle>
              <DialogContent>
                <Typography sx={{ marginTop: 4 }}>
                  <span style={{ fontWeight: "600" }}>Raksha Animal</span> does
                  not offer a{" "}
                  <span style={{ fontWeight: "600" }}>'Forgot Password'</span>{" "}
                  option for enhanced security. To ensure uninterrupted access:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ marginTop: 2, fontWeight: "600" }}
                >
                  Secure Your Login Credentials:
                </Typography>

                <Typography variant="body1" sx={{ marginTop: 2 }}>
                  <span style={{ fontWeight: "600" }}>1.</span> Take a
                  screenshot of your login details: Or
                  <br />
                  <Typography variant="body1" sx={{ marginTop: 2 }}>
                    Copy email:
                    <span style={{ fontWeight: "600" }}>
                      {submittedValues.email}
                    </span>
                    <IconButton
                      onClick={() => handleCopyEmail(submittedValues?.email)}
                      sx={{ marginLeft: 1 }}
                    >
                      <ContentCopy />
                    </IconButton>
                    {IsEmailMessageCopied && (
                      <Typography fontSize=".8rem" icon={<Check />}>
                        Email copied successfully
                      </Typography>
                    )}
                  </Typography>
                  <Typography variant="body1" sx={{ marginTop: 2 }}>
                    Copy Password:
                    <span style={{ fontWeight: "600" }}>
                      {submittedValues.password}
                    </span>
                    <IconButton
                      onClick={() =>
                        handleCopyPassword(submittedValues?.password)
                      }
                      sx={{ marginLeft: 1 }}
                    >
                      <ContentCopy />
                    </IconButton>
                    {IsPasswordMessageCopied && (
                      <Typography fontSize=".8rem" icon={<Check />}>
                        Password copied successfully
                      </Typography>
                    )}
                  </Typography>
                </Typography>
                <Typography variant="body1" sx={{ marginTop: 2 }}>
                  <span style={{ fontWeight: "600" }}>2.</span> Save the
                  screenshot in a secure location.
                  <br />
                  <span style={{ fontWeight: "600" }}>3.</span>{" "}
                  <span style={{ fontWeight: "600" }}>Alternatively</span>, Copy
                  and Save your login credentials in a safe place.
                </Typography>
                <Typography variant="body1" sx={{ marginTop: 2 }}>
                  <strong>Forgotten Credentials:</strong>
                </Typography>
                <Typography variant="body1" sx={{ marginTop: 2 }}>
                  1. Email{" "}
                  <a href="mailto:help.rakshaanimal@gmail.com">
                    help.rakshaanimal@gmail.com
                  </a>
                  <br />
                  2. Provide your NGO name and organizational details.
                  <br /> 3. Our team will delete old records and allow new login
                  creation.
                  <br />
                </Typography>
                <Typography variant="body1" sx={{ marginTop: 2 }}>
                  By following these steps, you'll maintain continuous access to
                  your Raksha Animal account.
                </Typography>
              </DialogContent>

              <DialogActions>
                <Button onClick={handleCloseModal} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </Form>
        )}
      </Formik>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default NGORegistrationPage;
