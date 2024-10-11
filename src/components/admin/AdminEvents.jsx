import { ErrorMessage, Form, Formik } from "formik";
import { CustomTextField } from "../Custom";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Typography,
} from "@mui/material";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { FmdGood } from "@mui/icons-material";
import UploadFilesDropZone from "../UploadFilesDropZone";
import useAxiosPrivate from "../../api/axiosPrivate";
import axios from "../../api/axios";

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(2, "Title must be at least 2 characters"),
  eventType: Yup.string().required("Event Type is required"),
  time: Yup.date().required("Event Date & Time is required").nullable(),
  location: Yup.string()
    .required("Location is required")
    .min(2, "Location must be at least 2 characters"),
  eventPhoto: Yup.mixed().required("Event photo is required").nullable(),
});

const AdminEvents = () => {
  const axiosPrivate = useAxiosPrivate();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const [AllEvents, setAllEvents] = useState([]);
  const [SelectedEvent, setSelectedEvent] = useState(null);
  const [snackBar, setsnackBar] = useState({
    open: false,
    message: "",
    severity: "",
  });

  useEffect(() => {
    const getAllEvents = async () => {
      try {
        const response = await axios.get("/api/events");
        if (response.status === 200) {
          setAllEvents(response.data);
          console.log(response.data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getAllEvents();
  }, []);

  const handleAddEvent = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axiosPrivate.post("/api/events", values);
      console.log(response.data);
      if (response.status === 200) {
        setAllEvents((prev) => [...prev, response.data]);
        setsnackBar((prev) => ({
          ...prev,
          open: true,
          message: "Event added successfully",
          severity: "success",
        }));
        resetForm();
      }
    } catch (error) {
      setsnackBar((prev) => ({
        ...prev,
        open: true,
        message: "Event couln't be created.try again later!",
        severity: "error",
      }));
      console.log(error);
    }
    setSubmitting(false);
  };

  const handleOpenUpdate = (event) => {
    setSelectedEvent(event);
    setIsUpdateModalOpen(true);
  };
  const handleUpdate = async (values, { setSubmitting }) => {
    try {
      const id = SelectedEvent._id;
      const response = await axiosPrivate.put(`/api/events/${id}`, values);
      console.log(response.data);
      if (response.status === 200) {
        setAllEvents((prev) =>
          prev.map((event) => (event._id === id ? response.data : event))
        );

        setsnackBar({
          open: true,
          message: "Event updated successfully",
          severity: "success",
        });
      }
    } catch (error) {
      console.log(error);
      setsnackBar({
        open: true,
        message: "Event couldn't be updated. Try again later!",
        severity: "error",
      });
    }
    setIsUpdateModalOpen(false);
    setSubmitting(false);
  };
  const handleDeleteEvent = async (event) => {
    const id = event._id;
    try {
      const response = await axiosPrivate.delete(`/api/events/${id}`);
      if (response.status === 200) {
        setAllEvents((prev) => prev.filter((event) => event.id !== id));
        setsnackBar((prev) => ({
          ...prev,
          open: true,
          message: "Event deleted successfully",
          severity: "success",
        }));
      }
      console.log(response);
    } catch (error) {
      setsnackBar((prev) => ({
        ...prev,
        open: true,
        message: "Event couldn't be deleted",
        severity: "error",
      }));
      console.log(error);
    }
  };

  return (
    <div className="d-flex flex-column gap-500">
      <div className="addEvents">
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            title: "",
            eventType: "",
            time: dayjs(),
            location: "",
            eventPhoto: null,
          }}
          onSubmit={handleAddEvent}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form className="d-flex flex-column gap-400">
              <CustomTextField name="title" label="Title" />
              <CustomTextField name="location" label="Location" />
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Event type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={values.eventType}
                  label="Event type"
                  onChange={(event) =>
                    setFieldValue("eventType", event.target.value)
                  }
                >
                  <MenuItem value="Ongoing">Ongoing</MenuItem>
                  <MenuItem value="Upcomming">Upcoming</MenuItem>
                </Select>
              </FormControl>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Event Date & Time"
                  value={values.time}
                  onChange={(newValue) => setFieldValue("time", newValue)}
                />
              </LocalizationProvider>

              <UploadFilesDropZone
                accept={{
                  "image/*": [".jpeg", ".jpg", ".png"],
                }}
                onRemove={() => setFieldValue("eventPhoto", null)}
                onDrop={(acceptedImages) =>
                  setFieldValue("eventPhoto", acceptedImages[0])
                }
                maxFiles={1}
                files={values?.eventPhoto ? [values.eventPhoto] : []}
              />
              <ErrorMessage name="eventPhoto" component="p" className="error" />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isSubmitting}
                sx={{ mt: 2 }}
              >
                {isSubmitting ? <CircularProgress /> : "Create Event"}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
      <div className="update-modal">
        <Dialog
          open={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
        >
          <DialogTitle>Update Event</DialogTitle>
          <DialogContent>
            <Formik
              validationSchema={validationSchema}
              initialValues={{
                title: SelectedEvent?.title,
                eventType: SelectedEvent?.eventType,
                time: dayjs(SelectedEvent?.time),
                location: SelectedEvent?.location,
                eventPhoto: SelectedEvent?.eventPhoto,
              }}
              onSubmit={handleUpdate}
            >
              {({ isSubmitting, setFieldValue, values }) => (
                <Form className="d-flex flex-column gap-400">
                  <CustomTextField name="title" label="Title" />
                  <CustomTextField name="location" label="Location" />
                  {/* <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Event type
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={values.eventType}
                      label="Event type"
                      onChange={(event) =>
                        setFieldValue("eventType", event.target.value)
                      }
                    >
                      <MenuItem value="Ongoing">Ongoing</MenuItem>
                      <MenuItem value="Upcoming">Upcoming</MenuItem>
                    </Select>
                  </FormControl> */}
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      label="Event Date & Time"
                      value={values.time}
                      onChange={(newValue) => setFieldValue("time", newValue)}
                    />
                  </LocalizationProvider>

                  <UploadFilesDropZone
                    accept={{ "image/*": [".jpeg", ".jpg", ".png"] }}
                    onRemove={() => setFieldValue("eventPhoto", null)}
                    onDrop={(acceptedImages) =>
                      setFieldValue("eventPhoto", acceptedImages[0])
                    }
                    maxFiles={1}
                    files={values?.eventPhoto ? [values.eventPhoto] : []}
                  />
                  <ErrorMessage
                    name="eventPhoto"
                    component="p"
                    className="error"
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={isSubmitting}
                    sx={{ mt: 2 }}
                  >
                    {isSubmitting ? <CircularProgress /> : "Update Event"}
                  </Button>
                </Form>
              )}
            </Formik>
          </DialogContent>
        </Dialog>
      </div>

      <div className="allevents">
        <div className="event-container d-flex flex-wrap gap-400 items-center justify-center">
          {AllEvents?.map((event) => (
            <div key={event._id} className="event-card">
              <div className="image-title">
                <p className="title">{event.title}</p>
                <img
                  className="img-overly"
                  src={event.eventPhoto.url}
                  alt="event photo"
                />
              </div>
              <div className="container">
                <div className="time-date-slot d-flex items-center">
                  <Typography
                    color="rgba(0,0,0,0.7)"
                    variant="h5"
                    fontSize="2rem"
                    fontWeight={600}
                  >
                    {dayjs(event.time).format("HH:mm:a")}
                  </Typography>
                  <Divider orientation="vertical" variant="middle" flexItem />
                  <Typography variant="h6">
                    {dayjs(event.time).format("DD:MM:YYYY")}
                  </Typography>
                </div>
                <div className="location">
                  <FmdGood color="rgba(0,0,0,0.7)" />
                  <Typography color="rgba(0,0,0,0.7)">
                    {event.location}
                  </Typography>
                </div>
                <div className="d-flex justify-between">
                  <Button
                    onClick={() => handleDeleteEvent(event)}
                    color="error"
                    variant="contained"
                  >
                    Delete
                  </Button>
                  <Button
                    color="warning"
                    onClick={() => handleOpenUpdate(event)}
                    variant="contained"
                  >
                    Update
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
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

export default AdminEvents;
