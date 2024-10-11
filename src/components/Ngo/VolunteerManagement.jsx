/* eslint-disable react/prop-types */
import { useState } from "react";
import VolunteerRegisterForm from "../form/VolunteerRegisterForm";
import VolunteersTable from "./VolunteerTable";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import useAxiosPrivate from "../../api/axiosPrivate";
import { Check } from "@mui/icons-material";

const VolunteerManagement = ({
  volunteers,
  ngoId,
  handleAddVolunteer,
  handleUpdateVolunteer,
  handleDeleteVolunteer,
}) => {
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const [updateAlert, setUpdateAlert] = useState({
    message: "",
    severity: "",
  });

  const handleView = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setIsModalOpen(true);
  };

  const handleUpdate = async (values, { setSubmitting }) => {
    try {
      const id = selectedVolunteer._id;
      const response = await axiosPrivate.put(
        `/api/ngos/volunteers/${id}`,
        values
      );
      if (response.status === 200) {
        handleUpdateVolunteer(response.data.updatedVolunteer);
        setUpdateAlert({
          message: "Volunteer updated successfully",
          severity: "success",
        });
        console.log(response.data.updatedVolunteer);
      }
    } catch (error) {
      console.log(error);
      setUpdateAlert({
        message: "Volunteer update failed",
        severity: "error",
      });
    }
    setSubmitting(false);
  };

  const handleDelete = async (setSubmitting) => {
    const id = selectedVolunteer._id;
    console.log(id);
    try {
      const response = await axiosPrivate.delete(`/api/ngos/volunteers/${id}`, {
        params: { ngoId },
      });
      if (response.status === 200) {
        handleDeleteVolunteer(id);
        setIsModalOpen(false);
      }
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
    setSubmitting(false);
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    address: Yup.string().required("Address is required"),
    contact: Yup.string().required("Contact Number is required"),
  });

  return (
    <div className="volunteer-management">
      <div>
        <Typography variant="h4" gutterBottom>
          Volunteer Management
        </Typography>
        <VolunteersTable data={volunteers} handleView={handleView} />
      </div>
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>
          <p>NGO Volunteer Details</p>
        </DialogTitle>
        <DialogContent>
          {selectedVolunteer && (
            <Formik
              initialValues={{
                name: selectedVolunteer.name,
                email: selectedVolunteer.email,
                address: selectedVolunteer.address,
                contact: selectedVolunteer.contact,
              }}
              validationSchema={validationSchema}
              onSubmit={handleUpdate}
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
                  <Field
                    as={TextField}
                    margin="dense"
                    name="name"
                    label="Name"
                    type="text"
                    fullWidth
                  />
                  <ErrorMessage name="name" component="div" className="error" />
                  <Field
                    as={TextField}
                    margin="dense"
                    name="email"
                    label="Email"
                    type="email"
                    fullWidth
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="error"
                  />
                  <Field
                    as={TextField}
                    margin="dense"
                    name="address"
                    label="Address"
                    type="text"
                    fullWidth
                  />
                  <ErrorMessage
                    name="address"
                    component="div"
                    className="error"
                  />
                  <Field
                    as={TextField}
                    margin="dense"
                    name="contact"
                    label="Contact no"
                    type="tel"
                    fullWidth
                  />
                  <ErrorMessage
                    name="contact"
                    component="div"
                    className="error"
                  />
                  <DialogActions
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Button
                      color="warning"
                      onClick={() => setIsModalOpen(false)}
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
                      {isSubmitting ? (
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
      <div className="d-flex gap-400 flex-column">
        <VolunteerRegisterForm
          handleAddVolunteer={handleAddVolunteer}
          ngoId={ngoId}
        />
      </div>
    </div>
  );
};

export default VolunteerManagement;
