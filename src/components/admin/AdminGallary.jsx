import { useEffect, useState } from "react";
import StyledDropzone from "../StyledDropZone";
import {
  Alert,
  Button,
  CircularProgress,
  IconButton,
  Snackbar,
  Typography,
} from "@mui/material";
import { AddPhotoAlternate, Delete } from "@mui/icons-material";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import useAxiosPrivate from "../../api/axiosPrivate";
import axios from "../../api/axios";
import UploadFilesDropZone from "../UploadFilesDropZone";

const validationSchema = Yup.object().shape({
  gallaryImages: Yup.array()
    .of(
      Yup.object().shape({
        url: Yup.string().url("Invalid URL format").required("URL is required"),
        public_id: Yup.string().required("Public ID is required"),
      })
    )
    .min(1, "At least one image is required")
    .required("Gallery images are required"),
});
const AdminGallary = () => {
  const [images, setimages] = useState([]);
  const [allImages, setallImages] = useState([]);
  const [selectedImage, setselectedImage] = useState(null);
  const [ImageLoading, setImageLoading] = useState(false);
  const [deleteImageLoading, setdeleteImageLoading] = useState(false);
  const [ImageSnackBar, setImageSnackBar] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchAllGallaryImages = async () => {
      try {
        const response = await axios.get("/api/organization/gallary");
        console.log(response.data.gallary);
        if (response.status === 200) {
          setallImages(response?.data?.gallary);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllGallaryImages();
  }, []);

  const handleSubmitImages = async (values, { setSubmitting, resetForm }) => {
    console.log(values);
    try {
      setImageLoading(true);
      const response = await axiosPrivate.post(
        "/api/organization/gallary",
        values
      );
      if (response.status === 200) {
        setallImages(response.data);
        setimages([]);
        console.log(response.data);
        setImageSnackBar((prev) => ({
          ...prev,
          open: true,
          message: "Images added to gallary successfully!",
          severity: "success",
        }));
        resetForm();
      }
      setImageLoading(false);
    } catch (error) {
      setImageSnackBar((prev) => ({
        ...prev,
        open: true,
        message: "Images couln't be added!",
        severity: "error",
      }));
      console.log(error);
    }
    setSubmitting(false);
  };
  const handleImageDelete = async (image) => {
    const id = image.public_id;
    try {
      setdeleteImageLoading(true);
      const response = await axiosPrivate.delete(
        `/api/organization/gallary/${id}`
      );
      console.log(response.data);
      if (response.status === 200) {
        setallImages((prev) => prev.filter((img) => img.public_id !== id));
      }
      setdeleteImageLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Formik
        initialValues={{
          gallaryImages: [],
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmitImages}
      >
        {({ setFieldValue, isSubmitting, errors, touched }) => (
          <Form>
            <Typography variant="h5">Upload images</Typography>
            <UploadFilesDropZone
              accept={{
                "image/*": [".jpeg", ".jpg", ".png"],
              }}
              files={images}
              onRemove={(file) => {
                setimages((prev) =>
                  prev.filter((img) => img.public_id !== file.public_id)
                );
                setFieldValue("gallaryImages", (prev) =>
                  prev.filter((img) => img.public_id !== file.public_id)
                );
              }}
              onDrop={(acceptedImages) => {
                console.log(acceptedImages);
                const formattedImages = acceptedImages.map((image) => ({
                  url: image.url,
                  public_id: image.public_id,
                }));
                setimages((prev) => [...prev, ...formattedImages]);
                setFieldValue("gallaryImages", formattedImages);
              }}
            />
            {errors.gallaryImages && touched.gallaryImages && (
              <div style={{ color: "red" }}>{errors.gallaryImages}</div>
            )}

            <Button
              fullWidth
              sx={{ color: "white" }}
              variant="contained"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <AddPhotoAlternate />
              )}
            </Button>
          </Form>
        )}
      </Formik>
      <br />
      <Typography variant="h4">All uploaded Images</Typography>
      {ImageLoading ? (
        <CircularProgress size={24} color="inherit" />
      ) : (
        <div className="d-flex flex-wrap gap-400">
          {allImages?.map((item) => (
            <div key={item.public_id} style={{ position: "relative" }}>
              <img
                onClick={() => setselectedImage(item)}
                className="box-shadow-400"
                style={{
                  objectFit: "cover",
                  borderRadius: "1rem",
                }}
                width={300}
                height={250}
                src={item.url}
                alt={item.public_id}
                loading="lazy"
              />
              {selectedImage?.public_id === item.public_id && (
                <IconButton
                  sx={{
                    position: "absolute",
                    zIndex: 999,
                    top: "50%",
                    backgroundColor: "gray",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                  onClick={() => handleImageDelete(selectedImage)}
                >
                  {deleteImageLoading ? (
                    <CircularProgress size={28} color="primary" />
                  ) : (
                    <Delete color="error" sx={{ fontSize: "50px" }} />
                  )}
                </IconButton>
              )}
            </div>
          ))}
        </div>
      )}

      <Snackbar
        open={ImageSnackBar.open}
        autoHideDuration={6000}
        onClose={() => setImageSnackBar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setImageSnackBar((prev) => ({ ...prev, open: false }))}
          severity={ImageSnackBar.severity}
          sx={{ width: "100%" }}
        >
          {ImageSnackBar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AdminGallary;
