/* eslint-disable react/prop-types */
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";

import AnimalLocator from "../location/AnimalLocator";
import AnimalStatusStepper from "../AnimalStatusStepper";
import {
  Close,
  ContentCopy,
  Email,
  ExpandMore,
  LocationCity,
  LooksOne,
  LooksTwo,
  Person,
  Pets,
  Phone,
  WhatsApp,
} from "@mui/icons-material";
import ImageCarousel from "../ImageCarousel";
import { useEffect, useState } from "react";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import HealingIcon from "@mui/icons-material/Healing";
import PetsIcon from "@mui/icons-material/Pets";
import Check from "@mui/icons-material/Check";
import UploadFilesDropZone from "../UploadFilesDropZone";
import useAxiosPrivate from "../../api/axiosPrivate";

const CaseDetailsModal = ({
  open,
  onClose,
  caseData,
  onSave,
  isFullScreen,
  ngoLocation,
  isReadOnly = false,
  userIsTracking,
  isAdmin = false,
  handleDeleteNewlyDetectedCase,
}) => {
  const statusIcons = {
    "Pending Review": <PendingActionsIcon />,
    Approved: <CheckCircleIcon />,
    Rejected: <Close />,
    "Rescue In Progress": <LocalShippingIcon />,
    "Under Care": <HealingIcon />,
    Recovered: <PetsIcon />,
    Closed: <Check />,
  };
  const statusOptions = [
    "Pending Review",
    "Approved",
    "Rejected",
    "Rescue In Progress",
    "Under Care",
    "Recovered",
    "Closed",
  ];
  console.log(caseData);
  // Sync currentStatus with caseData when caseData changes
  useEffect(() => {
    setCurrentStatus(caseData?.status);
    setImagesUnderTreatment([]);
  }, [caseData]);

  const [currentStatus, setCurrentStatus] = useState(statusOptions[0]);
  const [imagesUnderTreatment, setImagesUnderTreatment] = useState([]);
  const [copySuccess, setCopySuccess] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [SelectedCaseForDeletion, setSelectedCaseForDeletion] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [DeletionResults, setDeletionResults] = useState({
    message: "",
    severity: "",
    open: false,
  });
  const axiosPrivate = useAxiosPrivate();
  const handleDelete = (id) => {
    setSelectedCaseForDeletion(id);
    setOpenDialog(true);
  };
  const cancelDelete = () => {
    setSelectedCaseForDeletion(null);
    setOpenDialog(false);
  };

  const confirmDelete = async () => {
    const caseId = SelectedCaseForDeletion;
    console.log(caseId);
    try {
      setDeleting(true);
      const response = await axiosPrivate.delete(`/api/cases/delete/${caseId}`);
      console.log(response.data);
      if (response.status === 200) {
        setDeletionResults((prev) => ({
          ...prev,
          open: true,
          message: "Deleted successfully",
          severity: "success",
        }));
        handleDeleteNewlyDetectedCase(SelectedCaseForDeletion);
        setSelectedCaseForDeletion(null);
        setTimeout(() => {
          setOpenDialog(false);
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      setDeletionResults((prev) => ({
        ...prev,
        open: true,
        message: "Failed to delete the case",
        severity: "error",
      }));
    }
    setDeleting(false);
  };

  const handleStatusChange = (event) => {
    console.log(event.target.value);
    setCurrentStatus(event.target.value);
  };
  console.log(caseData);
  const handleSave = () => {
    const updatedCaseData = {
      ...caseData,
      status: currentStatus,
      underTreatmentImages: imagesUnderTreatment,
    };
    onSave(updatedCaseData);
    setCurrentStatus();
    onClose();
  };

  const handleDrop = (acceptedFiles) => {
    setImagesUnderTreatment((prevImages) => [...prevImages, ...acceptedFiles]);
  };

  const handleRemove = (fileToRemove) => {
    setImagesUnderTreatment((prevImages) =>
      prevImages.filter((file) => file !== fileToRemove)
    );
  };
  // Google Maps link for the animal's location
  const googleMapsLink = `https://www.google.com/maps?q=${caseData?.caseLocation?.lat},${caseData?.caseLocation?.lng}`;

  // Customize the WhatsApp message without the animal image
  const whatsappMessage = `To live track ${caseData?.animalName}'s location click here: ${googleMapsLink}.`;

  // WhatsApp share link with the custom message
  const whatsappShareLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  // Function to copy the Google Maps link to the clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(googleMapsLink).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // Reset success message after 2 seconds
    });
  };

  console.log(caseData?.caseLocation);
  return (
    <Dialog
      maxWidth="xl"
      open={open}
      onClose={onClose}
      fullScreen={isFullScreen}
      fullWidth
      sx={{
        "& .MuiDialogContent-root": {
          padding: "1rem",
          paddingTop: "2rem",
          "@media (min-width: 600px)": {
            padding: "3rem",
          },
        },
        "& .MuiDialogActions-root": {
          padding: "1rem",
          "@media (max-width: 600px)": {
            padding: ".5rem",
          },
        },
      }}
    >
      <DialogTitle>
        <AnimalStatusStepper activeStep={caseData?.status} />
      </DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "3rem",
          minWidth: "300px",
          "@media (max-width: 600px)": {},
        }}
      >
        <Box>
          <Accordion elevation={4}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              Animal Info
            </AccordionSummary>
            <AccordionDetails>
              <p>
                <span style={{ fontWeight: "800" }}>Name: </span>
                {caseData?.animalName}
              </p>
              <p>
                <span style={{ fontWeight: "800" }}>Injury Details:</span>
                {caseData?.injuryDescription}
              </p>
            </AccordionDetails>
          </Accordion>
          <Accordion elevation={4}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Person />
              Reporter Information
            </AccordionSummary>
            <AccordionDetails>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <div className="d-flex items-center flex-wrap">
                  <Person />
                  <span style={{ fontWeight: "800" }}>Name:</span>{" "}
                  {caseData?.reporterInfo?.name}
                </div>
                <div className="d-flex items-center flex-wrap">
                  <Email />
                  <span style={{ fontWeight: "800" }}>Email:</span>{" "}
                  {caseData?.reporterInfo?.email}
                </div>
                <div className="d-flex items-center flex-wrap">
                  <Phone />
                  <span style={{ fontWeight: "800" }}>Contact No:</span>{" "}
                  {caseData?.reporterInfo?.contact}
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
          {userIsTracking && (
            <Accordion elevation={4}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="asigned-to-ngo"
                id="asigned-to-ngo"
              >
                <Pets />
                Assigned to NGO
              </AccordionSummary>
              <AccordionDetails>
                {!caseData.assignedToNgo ? (
                  <Typography>Not assigned to any ngo yet</Typography>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    <div className="d-flex items-center flex-wrap">
                      <Person />
                      <span style={{ fontWeight: "800" }}>NGO Name:</span>{" "}
                      {caseData?.assignedToNgo?.user?.name}
                    </div>
                    <div className="d-flex items-center flex-wrap">
                      <Email />
                      <span style={{ fontWeight: "800" }}>NGO Email:</span>{" "}
                      {caseData?.assignedToNgo?.user?.email}
                    </div>
                    <div className="d-flex items-center flex-wrap">
                      <Phone />
                      <span style={{ fontWeight: "800" }}>
                        NGO Contact No:
                      </span>{" "}
                      {caseData?.assignedToNgo?.user?.contact}
                    </div>
                    <div className="d-flex items-center flex-wrap">
                      <LocationCity />
                      <span style={{ fontWeight: "800" }}>
                        NGO Address:
                      </span>{" "}
                      {caseData?.assignedToNgo?.user?.address}
                    </div>
                  </div>
                )}
              </AccordionDetails>
            </Accordion>
          )}
        </Box>

        <div className="location-images">
          <div className="d-flex flex-column gap-400">
            <h4>
              {currentStatus === "New"
                ? "Direction of Case from your NGO"
                : "Location"}
            </h4>
            <AnimalLocator
              ngoLocation={ngoLocation}
              animalLocation={caseData?.caseLocation}
              status={caseData?.status}
            />
          </div>
          {!isReadOnly && (
            <div className="d-flex items-center justify-between flex-wrap">
              <a
                style={{ fontWeight: "bold", color: "black" }}
                href={googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Live Track Location in Google Maps
              </a>
              <div>
                <Button
                  variant="outlined"
                  startIcon={<ContentCopy />}
                  onClick={copyToClipboard}
                >
                  Copy Location Link
                </Button>
                {copySuccess && <p style={{ color: "green" }}>Link copied!</p>}
              </div>
              {/* WhatsApp share button */}
              <div className="d-flex items-center">
                <Tooltip
                  title={`Share ${caseData?.animalName}'s Location on WhatsApp`}
                >
                  <IconButton
                    color="primary"
                    href={whatsappShareLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WhatsApp />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          )}
          <div className="d-flex flex-column gap-400">
            <h4>Images of Animal Injury</h4>
            <ImageCarousel images={caseData?.injuryImages} />
          </div>
          {caseData?.underTreatmentImages?.length !== 0 && (
            <div className="d-flex flex-column gap-400">
              <h4>Images of Under Treatment</h4>
              <ImageCarousel images={caseData?.underTreatmentImages} />
            </div>
          )}
        </div>
        {!isReadOnly && (
          <FormControl fullWidth>
            <h4>Update Status</h4>
            <Select
              labelId="status-select-label"
              id="status-select"
              value={currentStatus}
              onChange={handleStatusChange}
              renderValue={(selected) => (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      backgroundImage:
                        "linear-gradient(95deg, #3acf50 0%, #03a9f4 100%)",
                      borderRadius: "100%",
                      boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
                      padding: ".5rem",
                    }}
                  >
                    {statusIcons[selected]}
                  </div>
                  {selected}
                </div>
              )}
            >
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    {statusIcons[status]}
                    {status}
                  </div>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {!isReadOnly &&
          caseData?.underTreatmentImages?.length === 0 &&
          (caseData?.status === "Under Care" ||
            caseData?.status === "Recovered") && (
            <div className="d-flex flex-column gap-400">
              <h4>Upload Images of Rescued Animal</h4>
              <UploadFilesDropZone
                accept={{
                  "image/*": [".jpeg", ".jpg", ".png"],
                }}
                onDrop={handleDrop}
                onRemove={handleRemove}
                files={imagesUnderTreatment}
                maxFiles={7}
              />
            </div>
          )}

        {isAdmin && (
          <div className="d-flex flex-column gap-400">
            <Alert severity="error">Danger zone</Alert>
            <Typography fontSize="1.2rem">
              This action cannot{" "}
              <span style={{ fontWeight: "600" }}>be undone.</span>
            </Typography>
            <Typography
              display="flex"
              alignItems="center"
              gap=".5rem"
              flexWrap="wrap"
            >
              <LooksOne color="error" />
              Once,<span style={{ fontWeight: "bold" }}>Deleted</span> this{" "}
              <span style={{ fontWeight: "bold" }}>Case</span>
              will be delete from respective{" "}
              <span style={{ fontWeight: "bold" }}>NGO</span> as well.
            </Typography>
            <Typography
              display="flex"
              alignItems="center"
              gap=".5rem"
              flexWrap="wrap"
            >
              <LooksTwo color="error" />
              <span style={{ fontWeight: "bold" }}>Reporter</span> no longer be
              able to <span style={{ fontWeight: "bold" }}>Track</span> the{" "}
              <span style={{ fontWeight: "bold" }}>Case</span>
            </Typography>
            <Button
              onClick={() => handleDelete(caseData?._id)}
              variant="contained"
              color="error"
            >
              Delete
            </Button>
            <Dialog open={openDialog} onClose={cancelDelete}>
              <DialogTitle>
                <Alert sx={{ marginBottom: "1rem" }} severity="warning">
                  Confirm Deletion
                </Alert>
                {DeletionResults.open && (
                  <Alert severity={DeletionResults.severity}>
                    {DeletionResults.message}
                  </Alert>
                )}
              </DialogTitle>
              <DialogContent>
                Are you sure you want to delete this Case?
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={cancelDelete}
                  color="primary"
                  disabled={deleting}
                >
                  Cancel
                </Button>

                <Button
                  onClick={confirmDelete}
                  color="error"
                  disabled={deleting} // Disable button while deleting
                  startIcon={
                    deleting && <CircularProgress size={20} color="inherit" />
                  } // Show CircularProgress when deleting
                >
                  {deleting ? "Deleting..." : "Delete"}
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        )}
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button onClick={onClose} color="warning">
          Cancel
        </Button>
        {!isReadOnly && (
          <Button
            disabled={!caseData?.assignedToNgo}
            onClick={handleSave}
            color="primary"
          >
            Save
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CaseDetailsModal;
