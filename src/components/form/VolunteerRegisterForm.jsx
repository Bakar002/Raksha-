/* eslint-disable react/prop-types */
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { CustomTextField } from "../Custom";
import {
  Alert,
  Button,
  CircularProgress,
  Snackbar,
  Typography,
} from "@mui/material";
import RecaptchaComponent from "../Recaptcha";
import useAxiosPrivate from "../../api/axiosPrivate";
import { Add } from "@mui/icons-material";

// Validation schema using Yup
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  address: Yup.string().required("Address is required"),
  contact: Yup.string().required("Mobile is required"),
});

const VolunteerRegisterForm = ({ ngoId, handleAddVolunteer }) => {
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const axiosPrivate = useAxiosPrivate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");

  const handleSubmit = async (values, { setSubmitting }) => {
    if (!recaptchaToken) {
      setSubmitting(false);
      return;
    }

    const payload = {
      ngoId,
      ...values,
    };

    try {
      const response = await axiosPrivate.post("/api/ngos/volunteers", payload);

      if (response.status === 201) {
        handleAddVolunteer(response.data.savedVolunteer);
        setSnackbarMessage("Volunteer created successfully");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      }
    } catch (error) {
      if (error.response.status === 409) {
        setSnackbarMessage("User already exists with this email");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } else {
        console.log(error.response.status);
        setSnackbarMessage("An error occurred while adding the volunteer");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }

      console.error("Error creating volunteer:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          name: "",
          email: "",
          address: "",
          contact: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="d-flex gap-400 flex-column">
            <Typography variant="h5" gutterBottom>
              Add NGO Volunteer
            </Typography>
            <CustomTextField name="name" label="NGO Volunteer Name" />
            <CustomTextField name="email" label="Email" />
            <CustomTextField name="address" label="Address" />
            <CustomTextField name="contact" label="Contact No." />
            <RecaptchaComponent onVerify={setRecaptchaToken} />
            <Button
              sx={{ color: "white" }}
              variant="contained"
              type="submit"
              disabled={isSubmitting}
            >
              <Add />
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "volunteer"
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
    </>
  );
};

export default VolunteerRegisterForm;
