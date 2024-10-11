import { Form, Formik } from "formik";
import * as Yup from "yup";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Snackbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { PendingActionsOutlined, Visibility } from "@mui/icons-material";
import StatusBadge from "./Ngo/StatusBadge";
import CaseDetailsModal from "./Ngo/CaseDetailsModal";
import { CustomTextField } from "./Custom";
import axios from "../api/axios";

const TrackCurrentStatusPage = () => {
  const [caseDetailsModalOpen, setcaseDetailsModalOpen] = useState(false);
  const [selectedCase, setselectedCase] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [fetchedCase, setfetchedCase] = useState({}); // Use null initially
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Validation schema using Yup
  const validationSchema = Yup.object({
    trackingId: Yup.string().required("Tracking ID is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    setIsLoading(true); // Start loading
    try {
      // Make the request to your backend
      const response = await axios.post("/api/cases/track-case", {
        trackingId: values.trackingId,
      });
      if (response.status === 200) {
        setSnackbarMessage("Successfully fetched...");
        setSnackbarOpen(true);
        if (!response.data.assignedToNgo) {
          console.log("Not assignedToNgo");
        }
        setSnackbarSeverity("success");
        console.log(response.data);
        setfetchedCase(response.data); // Set the fetched case
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 400) {
        setSnackbarMessage("Invalid tracking Id");
        setSnackbarOpen(true);
        setSnackbarSeverity("error");
      }
      if (error.response.status === 404) {
        setSnackbarMessage("Couldn't find case with this ID");
        setSnackbarOpen(true);
        setSnackbarSeverity("error");
      }
    } finally {
      setSubmitting(false);
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="section-padding-class">
      <Box paddingTop="6rem">
        <Typography variant="h5">
          Search by ID you were provided when you Reported the Injured Animal
        </Typography>
        <Formik
          initialValues={{ trackingId: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <CustomTextField name="trackingId" label="Tracking ID" />
              <Button
                variant="contained"
                type="submit"
                disabled={isSubmitting || isLoading}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Track Now"
                )}
              </Button>
            </Form>
          )}
        </Formik>
      </Box>

      {/* Case Details Section */}
      {fetchedCase.status && (
        <div className="incident-case-card" style={{ marginTop: "2rem" }}>
          <PendingActionsOutlined />
          <div className="badge-container">
            <StatusBadge status={fetchedCase.status} />
          </div>
          {fetchedCase?.injuryImages?.[0]?.url ? (
            <img src={fetchedCase.injuryImages[0].url} alt="Injury" />
          ) : (
            <Typography>No image available</Typography>
          )}
          <div className="d-flex justify-between">
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                setselectedCase(fetchedCase);
                setcaseDetailsModalOpen(true);
              }}
              fullWidth
              sx={{ color: "white" }}
            >
              <Visibility fontSize="small" />
              View
            </Button>
          </div>
        </div>
      )}

      {/* Case Details Modal */}
      {selectedCase && (
        <CaseDetailsModal
          isReadOnly
          userIsTracking={true}
          caseData={selectedCase}
          open={caseDetailsModalOpen}
          onClose={() => setcaseDetailsModalOpen(false)}
        />
      )}

      {/* Snackbar for success/error messages */}
      <Snackbar
        sx={{ zIndex: 9999999 }}
        open={snackbarOpen}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
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

export default TrackCurrentStatusPage;
