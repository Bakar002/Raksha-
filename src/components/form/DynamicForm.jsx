/* eslint-disable react/prop-types */
import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Alert,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  Snackbar,
  Typography,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import RecaptchaComponent from "../Recaptcha";
import { CustomTextField } from "../Custom";
import useAxiosPrivate from "../../api/axiosPrivate";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  address: Yup.string().required("Address is required"),
  pincode: Yup.string().required("Pincode is required"),
  contact: Yup.string().required("Contact is required"),
  recaptchaToken: Yup.string().required("Recaptcha token is required"),
});

const DynamicForm = ({ setacceptedApplications, setallAcceptedVolunteers }) => {
  const [selectedForm, setSelectedForm] = useState("volunteer");
  const axiosPrivate = useAxiosPrivate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  console.log(selectedForm);

  const handleSubmit = async (values, { setSubmitting }) => {
    const endpoint =
      selectedForm === "volunteer" ? "/api/volunteership" : "/api/membership";

    const payload = {
      status: "accepted",
      ...values,
    };

    try {
      const response = await axiosPrivate.post(endpoint, payload);

      if (response.status === 200) {
        setSnackbarMessage(
          selectedForm === "volunteer"
            ? "Volunteer created successfully"
            : "Member registered successfully"
        );
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        console.log(response.data);
        if (selectedForm === "volunteer") {
          setallAcceptedVolunteers((prev) => [...prev, response?.data]);
        } else {
          setacceptedApplications((prev) => [...prev, response?.data]);
        }
      }
    } catch (error) {
      console.log(error.response.data.message);
      if (error.response.status == 409) {
        setSnackbarMessage(error.response.data.message);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Select
        value={selectedForm}
        onChange={(e) => setSelectedForm(e.target.value)}
        variant="outlined"
        sx={{ marginBottom: 2 }}
      >
        <MenuItem value="volunteer">Add Volunteer</MenuItem>
        <MenuItem value="member">Add Member</MenuItem>
      </Select>
      <Formik
        initialValues={{
          name: "",
          email: "",
          address: "",
          pincode: "",
          contact: "",
          recaptchaToken: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form className="d-flex gap-400 flex-column">
            <Typography variant="h5" gutterBottom>
              {selectedForm === "volunteer" ? "Volunteer Form" : "Member Form"}
            </Typography>
            <CustomTextField name="name" label="Name" />
            <CustomTextField name="email" label="Email" />
            <CustomTextField name="address" label="Address" />
            <CustomTextField name="pincode" label="Pincode" />
            <CustomTextField name="contact" label="Contact" />
            <RecaptchaComponent
              onVerify={(recaptchaToken) => {
                setFieldValue("recaptchaToken", recaptchaToken);
              }}
            />
            <Button
              sx={{ color: "white" }}
              variant="contained"
              type="submit"
              disabled={isSubmitting}
            >
              <Add />
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : selectedForm === "volunteer" ? (
                "Volunteer"
              ) : (
                "Member"
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

export default DynamicForm;
