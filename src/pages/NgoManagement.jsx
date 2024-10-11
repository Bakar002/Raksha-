import { useEffect, useState } from "react";
import CaseManagement from "../components/Ngo/CaseManagement";
import { Link, Navigate } from "react-router-dom";
import { MoreVert, Person } from "@mui/icons-material";
import { Form, Formik } from "formik";
import VolunteerManagement from "../components/Ngo/VolunteerManagement";
import * as Yup from "yup";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
} from "@mui/material";
import useAxiosPrivate from "../api/axiosPrivate";
import { CustomTextField } from "../components/Custom";
import LocationSelector from "../components/location/LocationSelector";
import useAuth from "../hooks/useAuth";
const validationSchema = Yup.object({
  name: Yup.string().required("NGO name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  address: Yup.string().required("Address is required"),
  location: Yup.object({
    lat: Yup.number().required("Latitude is required"),
    lng: Yup.number().required("Longitude is required"),
  }).required("Location is required"),
  pincode: Yup.string().required("Pincode is required"),
  contact: Yup.string().required("Contact Number is required"),
});

function NgoManagement() {
  const [updateProfileModal, setupdateProfileModal] = useState(false);
  const [NgoProfile, setNgoProfile] = useState({
    id: "",
    location: { lng: 0, lat: 0 },
    pincode: "",
  });
  const { setAuth } = useAuth();
  const [userProfile, setUserProfile] = useState({});
  const [newDetectedCases, setNewDetectedCases] = useState([]);
  const [volunteers, setvolunteers] = useState([]);
  const [ngoAllCases, setngoAllCases] = useState([]);
  const [loading, setloading] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const [orgAlert, setOrgAlert] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const handleAlertClose = (alertType) => {
    if (alertType === "org") setOrgAlert({ ...orgAlert, open: false });
  };
  useEffect(() => {
    const getUserById = async () => {
      setloading(true);
      try {
        const response = await axiosPrivate.get("/api/user");
        console.log(response.data);
        if (response?.status === 200) {
          const lng = response?.data?.ngo?.location?.coordinates[0];
          const lat = response?.data?.ngo?.location?.coordinates[1];
          const ngoId = response?.data?.ngo?._id;

          setNgoProfile((prev) => ({
            ...prev,
            location: { lng, lat },
            pincode: response.data.ngo.pincode,
            id: ngoId,
          }));
          console.log(response.data);
          setUserProfile(response?.data?.user);
          setngoAllCases(response?.data?.ngo?.cases);
          setvolunteers(response?.data?.ngo?.volunteers);
          setNewDetectedCases(response?.data?.ngo?.newDetectedCases);
          console.log(response?.data?.ngo?.newDetectedCases);
          console.log("in useeffect...");
        }
        setloading(false);
      } catch (error) {
        console.log(error);
        setloading(false);
      }
    };
    getUserById();
  }, []);

  //volunteer state management
  const handleAddVolunteer = (newVolunteer) => {
    setvolunteers((prev) => [...prev, newVolunteer]);
  };

  const handleUpdateVolunteer = (updatedUser) => {
    console.log("update volunteer called", updatedUser._id);
    setvolunteers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === updatedUser._id ? updatedUser : user
      )
    );
  };
  const handleDeleteVolunteer = (userId) => {
    setvolunteers((prevUsers) =>
      prevUsers.filter((user) => user._id !== userId)
    );
  };

  const handleDeleteNewlyDetectedCase = (detectedCaseId) => {
    setNewDetectedCases((prev) =>
      prev.filter((newCase) => newCase?._id !== detectedCaseId)
    );
  };
  const handleAddNewCase = (newCase) => {
    setngoAllCases((prevCases) => [...prevCases, newCase]);
  };
  const handleUpdateIncidentCase = (updatedCase) => {
    setngoAllCases((prevCases) =>
      prevCases.map((incidentCase) =>
        incidentCase._id === updatedCase._id ? updatedCase : incidentCase
      )
    );
  };

  const handleNgoUpdate = async (values, { setSubmitting }) => {
    const payload = {
      ...values,
    };
    try {
      const response = await axiosPrivate.patch("/api/user", payload);
      if (response.status === 200) {
        setOrgAlert({
          open: true,
          message: "Organization info updated successfully!",
          severity: "success",
        });
        const userUpdated = response.data.user;
        setUserProfile((prev) => ({ ...prev, userUpdated }));
      }
    } catch (error) {
      console.log(error);
    }
    setSubmitting(false);
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  if (loading) return <CircularProgress />;

  return (
    <>
      <header>
        <h3 className="d-flex items-center">
          <Person />
          {userProfile?.name}
        </h3>
        <h3>Welcome back...</h3>
        <div>
          <IconButton
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <MoreVert />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={() => {
              setAnchorEl(null);
            }}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                setupdateProfileModal(true);
              }}
            >
              Profile
            </MenuItem>
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
              }}
            >
              <Link to="/" style={{ color: "black", textDecoration: "none" }}>
                Home
              </Link>
            </MenuItem>
            <MenuItem
              onClick={() => {
                localStorage.removeItem("authToken");
                localStorage.removeItem("user");
                setAuth(null);
                Navigate("/users/login");
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </div>
      </header>
      <div className="ngo-management-container">
        <div>
          <Dialog
            open={updateProfileModal}
            onClose={() => setupdateProfileModal(false)}
          >
            <DialogTitle
              sx={{
                display: "flex",
                alignContent: "center",
                justifyContent: "space-between",
              }}
            >
              <p>NGO DETAILS</p>
            </DialogTitle>
            <DialogContent>
              <Formik
                initialValues={{
                  name: userProfile?.name,
                  email: userProfile?.email,
                  address: userProfile?.address,
                  location: NgoProfile?.location,
                  pincode: NgoProfile?.pincode,
                  contact: userProfile?.contact,
                }}
                validationSchema={validationSchema}
                onSubmit={handleNgoUpdate}
              >
                {({ isSubmitting, setFieldValue }) => (
                  <Form>
                    <CustomTextField name="name" label="NGO name" />
                    <CustomTextField
                      name="contact"
                      label="Ngo Contact Number"
                    />
                    <CustomTextField name="email" label="Ngo email address" />
                    <CustomTextField name="address" label="Ngo  address" />
                    <CustomTextField name="pincode" label="Ngo Pin code" />

                    <LocationSelector
                      initialLocation={NgoProfile?.location}
                      onSelectLocation={(location) => {
                        setFieldValue("location", location);
                      }}
                    />
                    <DialogActions
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        position: "sticky",
                        bottom: 0, // Stick to the bottom of the dialog
                        background: "white", // Ensure the background is consistent when scrolling
                        zIndex: 1, // Keep it above other content
                        borderTop: "1px solid #ddd", // Optional: Add a border to separate it from content
                      }}
                    >
                      <Button
                        color="warning"
                        onClick={() => setupdateProfileModal(false)}
                      >
                        Cancel
                      </Button>

                      <Button
                        sx={{ color: "white" }}
                        variant="contained"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        Update
                      </Button>
                    </DialogActions>
                  </Form>
                )}
              </Formik>
              <Snackbar
                open={orgAlert.open}
                autoHideDuration={6000}
                onClose={() => handleAlertClose("org")}
              >
                <Alert
                  onClose={() => handleAlertClose("org")}
                  severity={orgAlert.severity}
                  sx={{ width: "100%" }}
                >
                  {orgAlert.message}
                </Alert>
              </Snackbar>
            </DialogContent>
          </Dialog>
        </div>
        <CaseManagement
          handleAddNewCase={handleAddNewCase}
          NgoProfile={NgoProfile}
          newDetectedCases={newDetectedCases}
          handleDeleteNewlyDetectedCase={handleDeleteNewlyDetectedCase}
          handleUpdateIncidentCase={handleUpdateIncidentCase}
          allCases={ngoAllCases}
        />
        <VolunteerManagement
          handleAddVolunteer={handleAddVolunteer}
          handleUpdateVolunteer={handleUpdateVolunteer}
          handleDeleteVolunteer={handleDeleteVolunteer}
          ngoId={NgoProfile.id}
          volunteers={volunteers}
        />
      </div>
    </>
  );
}

export default NgoManagement;
