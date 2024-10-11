import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { CustomTextField } from "../components/Custom";
import {
  Button,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  Box,
} from "@mui/material";
import RecaptchaComponent from "../components/Recaptcha";
import axios from "../api/axios";

// Validation schema using Yup
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  contact: Yup.string().required("Contact Number is required"),
  message: Yup.string().required("Message is required"),
});

const ContactUs = () => {
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
    console.log(values);
    const payload = {
      ...values,
      recaptchaToken,
    };

    try {
      const response = await axios.post("/api/contact", payload);
      console.log("Contact form submitted:", response.data);
      if (response.status === 200) {
        setSnackbarMessage(
          "Message sent successfully. We will get back to you soon."
        );
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        resetForm();
      }
    } catch (error) {
      console.error(
        "Error submitting contact form:",
        error?.response?.data?.message
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      if (error.response.status === 409)
        setSnackbarMessage(error?.response?.data.message);
      else {
        setSnackbarMessage("Failed to send message. Please try again.");
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="contact-us-container section-padding-class">
      <Box paddingTop={10}>
        <Typography variant="h4" gutterBottom>
          Contact Us
        </Typography>
        <Formik
          initialValues={{
            name: "",
            email: "",
            contact: "",
            message: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="contact-form">
              <div className="details-inputs">
                <CustomTextField name="name" label="Name" />
                <CustomTextField name="email" label="Email" />
                <CustomTextField name="contact" label="Contact Number" />
                <CustomTextField
                  name="message"
                  label="Message"
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
                  "Send Message"
                )}
              </Button>
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
      </Box>
    </div>
  );
};

export default ContactUs;
