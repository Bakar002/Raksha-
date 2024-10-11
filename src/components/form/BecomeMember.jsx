import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { CustomTextField } from "../Custom";
import {
  Button,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import RecaptchaComponent from "../Recaptcha";
import axios from "../../api/axios";
import { Link } from "react-router-dom";

// Validation schema using Yup
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  address: Yup.string().required("Address is required"),
  pincode: Yup.string().required("Pincode is required"),
  contact: Yup.string().required("Contact Number is required"),
  description: Yup.string().required("Description is required"),
});

const BecomeMember = () => {
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    if (!recaptchaToken) {
      setSubmitting(false);
      return;
    }
    const role = "member";
    console.log(values);
    const payload = {
      ...values,
      role,
      recaptchaToken,
    };

    try {
      const response = await axios.post("/api/membership", payload);
      console.log("Registration successful:", response.data);
      if (response.status === 200) {
        setSnackbarMessage(
          "Membership Form submitted successfully.You will be informed soon."
        );
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        resetForm();
      }
    } catch (error) {
      console.error("Registration error:", error?.response?.data?.message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      if (error.response.status === 409)
        setSnackbarMessage(error?.response?.data.message);
      else {
        setSnackbarMessage("Registration failed. Please try again.");
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="registration-container">
      <Typography variant="h4" gutterBottom>
        Become A Member
      </Typography>
      <Formik
        initialValues={{
          name: "",
          email: "",
          address: "",
          pincode: "",
          contact: "",
          description: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="registration-form">
            <div className="details-inputs">
              <CustomTextField name="name" label="Name" />
              <CustomTextField name="email" label="Email" />
              <CustomTextField name="address" label="Address" />
              <CustomTextField name="pincode" label="Pincode" />
              <CustomTextField name="contact" label="Contact Number" />
              <CustomTextField
                name="description"
                label="Description"
                multiline
                rows={4}
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
            </Button>{" "}
            <p className="text-center">Or</p>
            <Link style={{ textAlign: "center" }} to="/becomeVolunteer">
              Become A Volunteer
            </Link>
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

export default BecomeMember;
