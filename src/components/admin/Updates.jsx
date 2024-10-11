import {
  Alert,
  Badge,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  AlternateEmail,
  Block,
  Check,
  PendingActionsOutlined,
  Place,
  Visibility,
} from "@mui/icons-material";
import useAxiosPrivate from "../../api/axiosPrivate";
import CaseDetailsModal from "../Ngo/CaseDetailsModal";
import StatusBadge from "../Ngo/StatusBadge";
import ApplicationsTable from "./Tables/ApplicationsTable";
import { Form, Formik } from "formik";
import { CustomTextField } from "../Custom";
import * as Yup from "yup";
import ContactUsCard from "./ContactUsCard";

const updateValidationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  address: Yup.string().required("Address is required"),
  contact: Yup.string().required("Mobile is required"),
  pincode: Yup.string().required("Phone number is required"),
});

const Updates = () => {
  const [pendingApplications, setPendingApplications] = useState([]);
  const [acceptedApplications, setacceptedApplications] = useState([]);
  const [pendingVolunteersApplications, setpendingVolunteersApplications] =
    useState([]);
  const [allAcceptedVolunteers, setallAcceptedVolunteers] = useState([]);
  const [newlyDetectedCases, setnewlyDetectedCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [SelectedTableItem, setSelectedTableItem] = useState(null);
  const [caseDetailsModalOpen, setcaseDetailsModalOpen] = useState(false);
  const [selectedCase, setselectedCase] = useState(null);
  const [IsModalopen, setIsModalopen] = useState(false);
  const [deleteloading, setdeleteloading] = useState(false);
  const [updateAlert, setUpdateAlert] = useState({
    message: "",
    severity: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const [contactUsUpdates, setcontactUsUpdates] = useState([]);
  dayjs.extend(relativeTime);
  const axiosPrivate = useAxiosPrivate();
  useEffect(() => {
    fetchPendingApplications();
  }, []);
  useEffect(() => {
    const getAllContactus = async () => {
      try {
        const response = await axiosPrivate.get("/api/contact");
        if (response.status === 200) {
          setcontactUsUpdates(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getAllContactus();
  }, []);
  useEffect(() => {
    setLoading(true);
    const getAllVolunteerPendingApplications = async () => {
      try {
        const response = await axiosPrivate.get("/api/volunteership");
        setallAcceptedVolunteers(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getAllVolunteerPendingApplications();
  }, []);
  useEffect(() => {
    setLoading(true);
    const fetchAllacceptedApplications = async () => {
      try {
        const response = await axiosPrivate.get("/api/membership");
        console.log(response.data);
        setacceptedApplications(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllacceptedApplications();
  }, []);
  useEffect(() => {
    const newlyDetectedCases = async () => {
      try {
        const response = await axiosPrivate.get("/api/cases");
        if (response.status === 200) {
          setnewlyDetectedCases(response.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    newlyDetectedCases();
  }, []);
  useEffect(() => {
    const getVolunteersPendingApplications = async () => {
      setLoading(true);
      try {
        const response = await axiosPrivate.get("/api/volunteership/pending");
        if (response.status === 200) {
          setpendingVolunteersApplications(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getVolunteersPendingApplications();
  }, []);

  const fetchPendingApplications = async () => {
    setLoading(true);
    try {
      const response = await axiosPrivate.get("/api/membership/pending");
      setPendingApplications(response.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to fetch applications",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleVolunteerApplicationAccept = async (id) => {
    try {
      const response = await axiosPrivate.put(
        `/api/volunteership/${id}/accept`
      );
      const acceptedvolunteer = response.data;
      setpendingVolunteersApplications((prev) =>
        prev.filter((a) => a._id !== acceptedvolunteer._id)
      );
      setallAcceptedVolunteers((prev) => [...prev, acceptedvolunteer]);
      setSnackbar({
        open: true,
        message: "Application accepted",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to accept application",
        severity: "error",
      });
    }
  };

  const handleAccept = async (id) => {
    try {
      const response = await axiosPrivate.put(`/api/membership/${id}/accept`);
      const acceptedMember = response.data;
      setPendingApplications((prev) =>
        prev.filter((a) => a._id !== acceptedMember._id)
      );
      setacceptedApplications((prev) => [...prev, acceptedMember]);
      console.log(acceptedMember);
      setSnackbar({
        open: true,
        message: "Application accepted",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to accept application",
        severity: "error",
      });
    }
  };
  const handleVolunteerApplicationReject = async (id) => {
    try {
      const response = await axiosPrivate.put(
        `/api/volunteership/${id}/reject`
      );
      if (response.status === 200) {
        setpendingVolunteersApplications((prev) =>
          prev.filter((app) => app._id !== id)
        );
        setSnackbar({
          open: true,
          message: "Application rejected",
          severity: "success",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to reject application",
        severity: "error",
      });
    }
  };
  const hanldeViewTableItem = (item) => {
    setSelectedTableItem(item);
    setIsModalopen(true);
  };

  const handleReject = async (id) => {
    try {
      const response = await axiosPrivate.put(`/api/membership/${id}/reject`);
      if (response.status === 200) {
        setPendingApplications((prev) => prev.filter((app) => app._id !== id));
        setSnackbar({
          open: true,
          message: "Application rejected",
          severity: "success",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to reject application",
        severity: "error",
      });
    }
  };

  const handleDelete = async (setSubmitting) => {
    const id = SelectedTableItem._id;
    console.log(id);
    try {
      setdeleteloading(true);
      const response = await axiosPrivate.delete(
        `api/volunteership/delete-volunteer-or-admin/${id}`
      );
      if (response.status === 200) {
        if (response.data.type === "volunteer") {
          setallAcceptedVolunteers((prev) =>
            prev.filter((vl) => vl._id !== id)
          );
        } else {
          setacceptedApplications((prev) => prev.filter((vl) => vl._id !== id));
        }
        setIsModalopen(false);
        setSnackbar((prev) => ({
          ...prev,
          open: true,
          severity: "success",
          message: "Deleted successfully",
        }));
      }
      setdeleteloading(false);
      console.log(response.data);
    } catch (error) {
      setdeleteloading(false);
      setSnackbar((prev) => ({
        ...prev,
        open: true,
        severity: "error",
        message: "Internal server error",
      }));
      console.log(error);
    }
    setSubmitting(false);
  };

  const hanldeUpdate = async (values, { setSubmitting }) => {
    const id = SelectedTableItem._id;
    try {
      const response = await axiosPrivate.put(
        `/api/volunteership/update-volunteer-or-admin/${id}`,
        values
      );
      if (response.status === 200) {
        setSnackbar((prev) => ({
          ...prev,
          open: true,
          message: "Updated successfully",
          severity: "success",
        }));
        if (response?.data?.type === "Volunteer") {
          setallAcceptedVolunteers((prev) =>
            prev.map((vl) => (vl._id === id ? response?.data?.data : vl))
          );
        } else {
          setacceptedApplications((prev) =>
            prev.map((vl) => (vl._id === id ? response?.data?.data : vl))
          );
        }
        setIsModalopen(false);
      }
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
    setSubmitting(false);
  };

  const handleContactUsDelete = async (contactId) => {
    const id = contactId;
    try {
      const response = await axiosPrivate.delete(`/api/contact/${id}`);
      if (response.status === 200) {
        setcontactUsUpdates((prev) =>
          prev.filter((contact) => contact._id !== id)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteNewlyDetectedCase = (caseId) => {
    setnewlyDetectedCases((prev) =>
      prev.filter((animalCase) => animalCase._id !== caseId)
    );
  };

  return (
    <div>
      {loading ? (
        <CircularProgress />
      ) : (
        <div className="d-flex flex-column gap-500">
          <div className="d-flex flex-column gap-400">
            <Typography variant="h4">Newly Detected Cases</Typography>
            <div className="d-flex flex-wrap gap-500">
              {newlyDetectedCases?.map((newCase) => (
                <div key={newCase?._id} className="incident-case-card">
                  <PendingActionsOutlined />
                  <div className="badge-container">
                    <StatusBadge status={newCase.status} />
                  </div>
                  <img src={newCase?.injuryImages[0]?.url} />
                  <div className="d-flex justify-between">
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        setselectedCase(newCase);
                        setcaseDetailsModalOpen(true);
                      }}
                      fullWidth
                      sx={{ color: "white" }} // Change to your primary color
                    >
                      <Visibility fontSize="small" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <CaseDetailsModal
              isReadOnly
              handleDeleteNewlyDetectedCase={handleDeleteNewlyDetectedCase}
              caseData={selectedCase}
              isAdmin={true}
              open={caseDetailsModalOpen}
              onClose={() => setcaseDetailsModalOpen(false)}
            />
          </div>
          <div className="d-flex flex-column gap-500">
            <Typography variant="h4">
              Become A Member Pending Applications
            </Typography>
            {pendingApplications.length === 0 ? (
              <Block />
            ) : (
              <div className="d-flex  gap-400 flex-wrap items-center justify-center">
                {pendingApplications.map((application) => (
                  <div key={application._id} className="application-card">
                    <div className="card-header">
                      <div className="d-flex items-center justify-between">
                        <Typography fontWeight={600} variant="h5">
                          {application?.name}
                        </Typography>
                        <Typography>
                          <Badge variant="dot" color="primary">
                            {dayjs(application?.createdAt).fromNow()}
                          </Badge>
                        </Typography>
                      </div>
                    </div>
                    <div className="card-content">
                      <div className="d-flex gap-400">
                        <AlternateEmail />
                        <Typography fontWeight={600}>
                          {application?.email}
                        </Typography>
                      </div>
                      <div className="d-flex gap-400">
                        <Place color="primary" />
                        <Typography fontWeight={600}>
                          {application?.address}
                        </Typography>
                      </div>
                      <div className="d-flex">
                        <Typography>Pincode: </Typography>
                        <Typography fontWeight={600}>
                          {application?.pincode}
                        </Typography>
                      </div>
                      <div className="d-flex items-center justify-between">
                        <Button
                          onClick={() => handleReject(application._id)}
                          color="error"
                        >
                          Reject
                        </Button>
                        <Button
                          onClick={() => handleAccept(application._id)}
                          sx={{ color: "white" }}
                          variant="contained"
                        >
                          Accept
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="members-table">
              <Typography variant="h4">All Accepted Members</Typography>
              <ApplicationsTable
                handleView={hanldeViewTableItem}
                data={acceptedApplications}
              />
            </div>
          </div>
          <div className="d-flex flex-column gap-500">
            <Typography variant="h4">
              Become A Volunteer Pending Applications
            </Typography>
            {pendingVolunteersApplications?.length === 0 ? (
              <Block />
            ) : (
              <div className="d-flex  gap-400 flex-wrap items-center justify-center">
                {pendingVolunteersApplications.map((application) => (
                  <div key={application._id} className="application-card">
                    <div className="card-header">
                      <div className="d-flex items-center justify-between">
                        <Typography fontWeight={600} variant="h5">
                          {application?.name}
                        </Typography>
                        <Typography>
                          <Badge variant="dot" color="primary">
                            {dayjs(application?.createdAt).fromNow()}
                          </Badge>
                        </Typography>
                      </div>
                    </div>
                    <div className="card-content">
                      <div className="d-flex gap-400">
                        <AlternateEmail />
                        <Typography fontWeight={600}>
                          {application?.email}
                        </Typography>
                      </div>
                      <div className="d-flex gap-400">
                        <Place color="primary" />
                        <Typography fontWeight={600}>
                          {application?.address}
                        </Typography>
                      </div>
                      <div className="d-flex">
                        <Typography>Pincode: </Typography>
                        <Typography fontWeight={600}>
                          {application?.pincode}
                        </Typography>
                      </div>
                      <div className="d-flex items-center justify-between">
                        <Button
                          onClick={() =>
                            handleVolunteerApplicationReject(application._id)
                          }
                          color="error"
                        >
                          Reject
                        </Button>
                        <Button
                          onClick={() =>
                            handleVolunteerApplicationAccept(application._id)
                          }
                          sx={{ color: "white" }}
                          variant="contained"
                        >
                          Accept
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="volunteers-table">
              <Typography variant="h4">All Accepted Volunteers</Typography>
              <ApplicationsTable
                handleView={hanldeViewTableItem}
                data={allAcceptedVolunteers}
              />
            </div>
            <Dialog open={IsModalopen} onClose={() => setIsModalopen(false)}>
              <DialogTitle>
                <p>User Details</p>
              </DialogTitle>
              <DialogContent>
                {SelectedTableItem && (
                  <Formik
                    initialValues={{
                      name: SelectedTableItem?.name,
                      email: SelectedTableItem?.email,
                      address: SelectedTableItem?.address,
                      contact: SelectedTableItem?.contact,
                      pincode: SelectedTableItem?.pincode,
                    }}
                    validationSchema={updateValidationSchema}
                    onSubmit={hanldeUpdate}
                  >
                    {({ isSubmitting, setSubmitting }) => (
                      <Form>
                        {updateAlert.message && (
                          <Alert
                            icon={<Check fontSize="inherit" />}
                            severity={updateAlert.severity}
                            onClose={() =>
                              setUpdateAlert({ message: "", severity: "" })
                            } // Close alert on dismiss
                          >
                            {updateAlert.message}
                          </Alert>
                        )}
                        <CustomTextField name="name" label="Name" />
                        <CustomTextField name="email" label="Email" />
                        <CustomTextField name="address" label="Address" />
                        <CustomTextField name="pincode" label="Pincode" />
                        <CustomTextField name="contact" label="Contact" />

                        <DialogActions
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Button
                            color="warning"
                            onClick={() => setIsModalopen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            sx={{
                              color: "white",
                              background: "red",
                              "&:hover": {
                                backgroundColor: "darkred",
                              },
                            }}
                            variant="contained"
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => handleDelete(setSubmitting)}
                          >
                            {deleteloading ? (
                              <CircularProgress size={24} color="inherit" />
                            ) : (
                              "Delete"
                            )}
                          </Button>
                          <Button
                            sx={{ color: "white" }}
                            variant="contained"
                            type="submit"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <CircularProgress size={24} color="inherit" />
                            ) : (
                              "Update"
                            )}
                          </Button>
                        </DialogActions>
                      </Form>
                    )}
                  </Formik>
                )}
              </DialogContent>
            </Dialog>

            <div className="contact-us-container">
              <Typography variant="h4">Contact us Updates</Typography>
              <div className="d-flex flex-wrap items-center justify-center gap-400">
                {contactUsUpdates.map((query, index) => (
                  <ContactUsCard
                    key={index}
                    data={query}
                    onDelete={handleContactUsDelete}
                  />
                ))}
              </div>
            </div>
          </div>
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              severity={snackbar.severity}
              sx={{ width: "100%" }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </div>
      )}
    </div>
  );
};
export default Updates;
