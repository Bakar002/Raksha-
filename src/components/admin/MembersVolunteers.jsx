/* eslint-disable react/prop-types */
import { Add } from "@mui/icons-material";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { ErrorMessage, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { CustomTextField } from "../Custom";
import AdminVolunteerAndMemberTable from "./Tables/AdminVolunteerTable";
import useAxiosPrivate from "../../api/axiosPrivate";

import * as Yup from "yup";
import axios from "../../api/axios";
const validationSchema = Yup.object().shape({
  serialNo: Yup.string()
    .required("Serial number is required")
    .matches(/^\d+$/, "Serial number must be a number"),
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  designation: Yup.string()
    .required("Designation is required")
    .min(2, "Designation must be at least 2 characters"),
  validTill: Yup.string().required("Valid till date is required"),
  type: Yup.string().required("Type is required"),
});

const MembersVolunteers = () => {
  const [type, setType] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [allMembers, setallMembers] = useState([]);
  const [allVolunteers, setallVolunteers] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const [deleteLoading, setdeleteLoading] = useState(false);
  const [snackBar, setsnackBar] = useState({
    open: false,
    message: "",
    severity: "",
  });
  useEffect(() => {
    const getAllMembersVolunteers = async () => {
      try {
        const response = await axios.get("/api/volunteersmembers");
        if (response.status === 200) {
          const members = response.data.filter(
            (person) => person.type === "member"
          );
          setallMembers(members);
          const volunteers = response.data.filter(
            (person) => person.type === "volunteer"
          );
          setallVolunteers(volunteers);
          console.log(volunteers);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getAllMembersVolunteers();
  }, []);

  const handleTypeChange = (event, setFieldValue) => {
    const newType = event.target.value;
    setType(newType);
    console.log(newType);
    setFieldValue("type", newType);
  };

  const handleAddVolunteerOrMember = async (values, { setSubmitting }) => {
    console.log("Form submitted with values:", values);

    try {
      const response = await axiosPrivate.post(
        "/api/volunteersmembers",
        values
      );
      console.log("API response:", response.data);
      if (response.status === 200) {
        setsnackBar((prev) => ({
          ...prev,
          open: true,
          message: "Added successfully",
          severity: "success",
        }));
        if (response.data.type === "member")
          setallMembers((prev) => [...prev, response.data]);
        else setallVolunteers((prev) => [...prev, response.data]);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setsnackBar((prev) => ({
        ...prev,
        open: true,
        message: "couldn't be added.try again",
        severity: "error",
      }));
    }
  };

  const handleUpdate = async (values, { setSubmitting }) => {
    const id = selectedPerson._id;
    try {
      const response = await axiosPrivate.post(
        `/api/volunteersmembers/${id}`,
        values
      );
      console.log(response.data);
      if (response.status === 200) {
        setsnackBar((prev) => ({
          ...prev,
          open: true,
          message: "Updated successfully",
          severity: "success",
        }));
        if (response.data.type === "member")
          setallMembers((prev) =>
            prev.map((person) =>
              person._id === selectedPerson._id ? response.data : person
            )
          );
        else
          setallVolunteers((prev) =>
            prev.map((person) =>
              person._id === selectedPerson._id ? response.data : person
            )
          );
        setIsUpdateModalOpen(false);
      }
    } catch (err) {
      setsnackBar((prev) => ({
        ...prev,
        open: true,
        message: "Couldn't be updated",
        severity: "error",
      }));
      console.log(err);
    }
    console.log(values);
    setSubmitting(false);
  };
  const handleDelete = async (setSubmitting) => {
    const id = selectedPerson._id;
    try {
      setdeleteLoading(true);

      const response = await axiosPrivate.delete(
        `/api/volunteersmembers/${id}`
      );
      console.log(response.data);
      if (response.status === 200) {
        if (selectedPerson.type === "member") {
          setallMembers((prev) =>
            prev.filter((person) => person._id !== selectedPerson._id)
          );
        } else {
          setallVolunteers((prev) =>
            prev.filter((person) => person._id !== selectedPerson._id)
          );
        }
        setsnackBar((prev) => ({
          ...prev,
          open: true,
          message: "Deleted successfully",
          severity: "success",
        }));
      }
      setdeleteLoading(false);
      setIsUpdateModalOpen(false);
    } catch (err) {
      setsnackBar((prev) => ({
        ...prev,
        open: true,
        message: "couldn't be deleted.try again",
        severity: "error",
      }));
      console.log(err);
      setdeleteLoading(false);
      setIsUpdateModalOpen(false);
    }
    setSubmitting(false);
  };
  const handleView = (person) => {
    setSelectedPerson(person);
    setIsUpdateModalOpen(true);
  };

  return (
    <div className="d-flex flex-column gap-500">
      <div>
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            serialNo: "",
            name: "",
            designation: "",
            validTill: "",
            type: "",
          }}
          onSubmit={handleAddVolunteerOrMember}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className="d-flex flex-column gap-400">
              <Typography variant="h5">
                Add {type === "volunteer" ? "Volunteer" : "Member"}
              </Typography>

              <div className="d-flex flex-wrap gap-400">
                <CustomTextField name="serialNo" label="Sr. No" />
                <CustomTextField name="name" label="Name" />
                <CustomTextField name="designation" label="Designation" />
                <CustomTextField name="validTill" label="Valid till" />
                <FormControl variant="outlined">
                  <InputLabel>Type</InputLabel>
                  <Select
                    fullWidth
                    value={type}
                    onChange={(event) => handleTypeChange(event, setFieldValue)}
                    label="Type"
                  >
                    <MenuItem value="volunteer">Volunteer</MenuItem>
                    <MenuItem value="member">Member</MenuItem>
                  </Select>
                </FormControl>

                <Button type="submit" fullWidth variant="contained">
                  {isSubmitting ? (
                    <CircularProgress />
                  ) : (
                    <Box display="flex">
                      <Add color="white" />
                      Add
                    </Box>
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Formik>

        <Dialog
          open={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
        >
          <DialogTitle>
            {selectedPerson?.type === "volunteer" ? (
              <Typography>View Volunteer</Typography>
            ) : (
              <Typography>View Member</Typography>
            )}
          </DialogTitle>
          <DialogContent>
            {selectedPerson && (
              <Formik
                validationSchema={validationSchema}
                onSubmit={handleUpdate}
                initialValues={{
                  serialNo: selectedPerson.serialNo,
                  name: selectedPerson.name,
                  designation: selectedPerson.designation,
                  validTill: selectedPerson.validTill,
                  type: selectedPerson.type,
                }}
              >
                {({ isSubmitting, setFieldValue, setSubmitting }) => (
                  <Form className="d-flex flex-column gap-400">
                    <Typography variant="h5">
                      Add {type === "volunteer" ? "Volunteer" : "Member"}
                    </Typography>

                    <div className="d-flex flex-wrap gap-400">
                      <CustomTextField name="serialNo" label="Sr. No" />
                      <CustomTextField name="name" label="Name" />
                      <CustomTextField name="designation" label="Designation" />
                      <CustomTextField name="validTill" label="Valid till" />
                      <FormControl variant="outlined">
                        <InputLabel>Type</InputLabel>
                        <Select
                          fullWidth
                          disabled
                          value={selectedPerson.type}
                          onChange={(event) =>
                            handleTypeChange(event, setFieldValue)
                          }
                          label="Type"
                        >
                          <MenuItem value="volunteer">Volunteer</MenuItem>
                          <MenuItem value="member">Member</MenuItem>
                        </Select>
                        <ErrorMessage
                          name="type"
                          component="div"
                          className="error"
                        />
                      </FormControl>
                    </div>
                    <div className="d-flex justify-between">
                      <Button
                        onClick={() => setIsUpdateModalOpen(false)}
                        color="primary"
                      >
                        Close
                      </Button>
                      <Button
                        color="warning"
                        variant="contained"
                        disabled={isSubmitting}
                        type="submit"
                      >
                        Update
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(setSubmitting)}
                      >
                        {deleteLoading ? (
                          <CircularProgress size={20} />
                        ) : (
                          "Delete"
                        )}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="members">
        <Typography variant="h3">Members</Typography>

        <AdminVolunteerAndMemberTable
          data={allMembers}
          handleView={handleView}
        />
      </div>
      <div className="volunteers">
        <Typography variant="h3">Volunteers</Typography>
        <AdminVolunteerAndMemberTable
          data={allVolunteers}
          handleView={handleView}
        />
      </div>
      <Snackbar
        open={snackBar.open}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={6000}
        onClose={() => setsnackBar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setsnackBar((prev) => ({ ...prev, open: false }))}
          severity={snackBar.severity}
          sx={{ width: "100%" }}
        >
          {snackBar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MembersVolunteers;
