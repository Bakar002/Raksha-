import { useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import LocationSelector from "../location/LocationSelector";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import { CustomTextField } from "../Custom";
import RecaptchaComponent from "../Recaptcha";
import { CheckCircleOutline, ContentCopy } from "@mui/icons-material";
import { handleDelete } from "../../Utils/handleDeleteImages";
import axios from "../../api/axios";
import UploadFilesDropZone from "../UploadFilesDropZone";
import { Helmet } from "react-helmet-async";

// Define validation schema using Yup
const validationSchema = Yup.object().shape({
  animalName: Yup.string().required("Animal Name is required."),
  injuryDescription: Yup.string().required(
    "Description of injury is required."
  ),
  injuryImages: Yup.array()
    .min(1, "Please upload at least 1 images")
    .required("Images of injury animal are required"),

  caseLocation: Yup.object().shape({
    lat: Yup.number().required("Location is required."),
    lng: Yup.number().required("Location is required."),
  }),
  reporterName: Yup.string().required("Your name is required."),
  reporterEmail: Yup.string()
    .email("Invalid email address")
    .required("Your email is required."),
  reporterContact: Yup.string().required("Your contact number is required."),
  recaptchaToken: Yup.string().required("Recaptcha token is required"),
});

const ReportIncidentForm = () => {
  const [openModal, setOpenModal] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [trackingId, settrackingId] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState(
    "Report has been submitted successfully!"
  );
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleSubmit = async (
    values,
    { resetForm, setSubmitting, setFieldValue }
  ) => {
    console.log(values);

    const uploadedImages = [...values.injuryImages];
    try {
      const payload = {
        ...values,
      };
      const response = await axios.post("/api/cases/reportCase", payload);
      console.log(response.data);
      if (response.status === 201) {
        settrackingId(response.data._id);
        console.log(trackingId);
        setOpenModal(true);
      }
      setSubmitting(false);
      resetForm();
    } catch (error) {
      for (const image of uploadedImages) {
        if (image.public_id) {
          await handleDelete(image);
        }
      }
      setFieldValue("injuryImages", []);

      setSubmitting(false);
      console.error("Report submission failed:", error);
      setSnackbarMessage("Report submission failed. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleCopyTrackingId = () => {
    navigator.clipboard.writeText(trackingId);
    setSnackbarMessage("Tracking ID copied to clipboard!");
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
  };

  return (
    <div id="report-section" className="report-incident">
      <Helmet>
        <title>Report Animal Incident | Raksha Animal Rescue</title>
        <meta
          name="description"
          content="Report injured animals to nearby NGOs and track the status easily with Raksha Animal Rescue."
        />
        <meta
          property="og:title"
          content="Report Animal Incident | Raksha Animal Rescue"
        />
        <meta
          property="og:description"
          content="Report injured animals to nearby NGOs and track the status easily with Raksha Animal Rescue."
        />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="website" />
      </Helmet>
      <h2 className="text-center">Report an Incident now</h2>

      <Formik
        initialValues={{
          animalName: "",
          injuryDescription: "",
          caseLocation: { lat: "", lng: "" },
          injuryImages: [],
          reporterName: "",
          reporterEmail: "",
          reporterContact: "",
          recaptchaToken: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm, setFieldValue }) => {
          handleSubmit(values, { setSubmitting, resetForm, setFieldValue });
        }}
      >
        {({ setFieldValue, isSubmitting, values }) => (
          <Form className="d-flex flex-column gap-400">
            <div className="animal-info-container">
              <h3>Animal Information</h3>
              <div className="d-flex flex-column gap-400">
                <CustomTextField name="animalName" label="Animal Name" />

                <CustomTextField
                  name="injuryDescription"
                  label="Description of injured animal"
                  multiline={true}
                />
                <div className="d-flex flex-column">
                  <label htmlFor="images">Upload injured animal pics</label>
                  <UploadFilesDropZone
                    accept={{
                      "image/*": [".jpeg", ".jpg", ".png"],
                    }}
                    onDrop={(acceptedImages) => {
                      const newImages = [
                        ...values.injuryImages,
                        ...acceptedImages,
                      ];
                      setFieldValue("injuryImages", newImages);
                    }}
                    files={values.injuryImages}
                    maxFiles={10}
                    onRemove={(fileToRemove) =>
                      setFieldValue(
                        "injuryImages",
                        values.injuryImages.filter(
                          (file) => file.public_id !== fileToRemove.public_id
                        )
                      )
                    }
                  />
                  <ErrorMessage
                    name="injuryImages"
                    component="p"
                    className="error"
                  />
                </div>
              </div>
            </div>

            <div className="location-container d-flex flex-column">
              <h3>Location of incident</h3>
              <LocationSelector
                onSelectLocation={(location) => {
                  setFieldValue("caseLocation", location);
                }}
              />
              <ErrorMessage
                name="caseLocation.lat"
                component="p"
                className="error"
              />
              <ErrorMessage
                name="caseLocation.lng"
                component="p"
                className="error"
              />
            </div>

            <div className="reporter-container d-flex flex-column gap-400">
              <h3>Reporter information</h3>
              <div className="d-flex flex-column justify-between gap-400">
                <CustomTextField name="reporterName" label="Your full name" />
                <CustomTextField
                  name="reporterEmail"
                  label="Your email address"
                />
                <CustomTextField
                  name="reporterContact"
                  label="Your Contact number"
                />
                <RecaptchaComponent
                  onVerify={(value) => {
                    setFieldValue("recaptchaToken", value);
                  }}
                />
                <Button
                  sx={{ color: "white" }}
                  variant="contained"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Submit now"
                  )}
                </Button>
              </div>
            </div>
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

      {/* Success Modal */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
          Submission Successful <CheckCircleOutline color="primary" />
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Your report has been submitted successfully! To keep yourself
            updated about the status of the animal, please copy the Id for
            future tracking!
          </Typography>
          <Typography variant="body1" sx={{ marginTop: 2 }}>
            Tracking ID: {trackingId}
            <IconButton onClick={handleCopyTrackingId} sx={{ marginLeft: 1 }}>
              <ContentCopy />
            </IconButton>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ReportIncidentForm;
