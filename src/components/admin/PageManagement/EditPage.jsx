import {
  Button,
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import CkCustomEditor from "./CkCustomEditor";
import PagesDropDown from "./PagesDropDown";
import * as Yup from "yup";
import { Formik, Form, ErrorMessage } from "formik";
import { CustomTextField } from "../../Custom";
import { useEffect, useState } from "react";
import axios from "../../../api/axios";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "../../../api/axiosPrivate";
import UploadFilesDropZone from "../../UploadFilesDropZone";

const validationSchema = Yup.object().shape({
  category: Yup.string().required("Category is required"),
  title: Yup.string().required("Title is required"),
  metaTitle: Yup.string().required("Meta Title is required"),
  metaDescription: Yup.string().required("Meta Description is required"),
  pageData: Yup.string().required("Page data is required"),
  bannerImage: Yup.array()
    .min(1, "Banner Image is required")
    .required("Banner Image is required"),

  raised: Yup.number().when("category", {
    is: "Donations and Fundraising",
    then: (schema) => schema.required("Raised amount is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  goal: Yup.number().when("category", {
    is: "Donations and Fundraising",
    then: (schema) => schema.required("Goal amount is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  raisedBy: Yup.string().when("category", {
    is: "Donations and Fundraising",
    then: (schema) => schema.required("Raised By is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  days: Yup.number().when("category", {
    is: "Donations and Fundraising",
    then: (schema) => schema.required("Days are required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  proofDoc: Yup.array().when("category", {
    is: "Donations and Fundraising",
    then: (schema) =>
      schema.min(1, "At least one Proof document is required").required(),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const EditPage = () => {
  const { id } = useParams();
  const [pageToBeEdite, setpageToBeEdite] = useState(null);
  const axiosPrivate = useAxiosPrivate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  useEffect(() => {
    const getPageById = async () => {
      try {
        const response = await axios.get(`/api/pages/${id}`);
        if (response.data.ok) {
          setpageToBeEdite(response.data.page);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getPageById();
  }, [id]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axiosPrivate.patch(`/api/pages/${id}`, values);
      if (response.status === 201) {
        setSnackbarMessage("Page updated successfully.");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.log(error);
      setSnackbarMessage("Page couldn't be updated.please try again");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
    setSubmitting(false);
  };

  if (!pageToBeEdite) return <CircularProgress />;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Edit Page
      </Typography>
      <Formik
        initialValues={{
          category: pageToBeEdite?.category,
          title: pageToBeEdite?.title,
          pageData: pageToBeEdite?.pageData,
          bannerImage: pageToBeEdite?.bannerImage,
          metaTitle: pageToBeEdite?.metaTitle,
          metaDescription: pageToBeEdite?.metaDescription,
          raised: pageToBeEdite?.raised,
          goal: pageToBeEdite?.goal,
          raisedBy: pageToBeEdite?.raisedBy,
          days: pageToBeEdite?.days,
          proofDoc: pageToBeEdite?.proofDoc,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form className="d-flex flex-column gap-500">
            <PagesDropDown name="category" disabled={true} />
            <CustomTextField name="title" label="Title" />
            {values.category === "Donations and Fundraising" && (
              <div className="d-flex gap-400 flex-wrap">
                <CustomTextField name="raised" label="Raised" />
                <CustomTextField name="goal" label="Goal" />
                <CustomTextField name="raisedBy" label="Raised BY" />
                <CustomTextField name="days" label="Days" />

                <div>
                  <p>Upload proof docs</p>
                  <UploadFilesDropZone
                    accept={{
                      "application/pdf": [".pdf"],
                      "image/*": [".jpeg", ".jpg", ".png"],
                    }}
                    onRemove={(fileToRemove) => {
                      setFieldValue(
                        "proofDoc",
                        values.proofDoc.filter(
                          (file) => file.public_id !== fileToRemove.public_id
                        )
                      );
                    }}
                    onDrop={(acceptedFiles) =>
                      setFieldValue("proofDoc", [
                        ...values.proofDoc,
                        ...acceptedFiles,
                      ])
                    }
                    maxFiles={5}
                    files={values?.proofDoc}
                  />
                </div>
              </div>
            )}

            <div>
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <CkCustomEditor
                pageData={values?.pageData}
                setpageData={(pageData) => setFieldValue("pageData", pageData)}
              />
              <ErrorMessage name="pageData" component="p" className="error" />
            </div>

            <div>
              {values.category !== "Donations and Fundraising" ? (
                <Typography variant="h6" gutterBottom>
                  Upload Banner Image
                </Typography>
              ) : (
                <Typography>Upload Image</Typography>
              )}
              <UploadFilesDropZone
                accept={{
                  "image/*": [".jpeg", ".jpg", ".png"],
                }}
                onRemove={(fileToRemove) => {
                  console.log(values.bannerImage);
                  console.log(fileToRemove);
                  setFieldValue(
                    "bannerImage",
                    values.bannerImage.filter(
                      (file) => file.public_id !== fileToRemove.public_id
                    )
                  );
                }}
                onDrop={(acceptedImages) =>
                  setFieldValue("bannerImage", [
                    ...values.bannerImage,
                    ...acceptedImages,
                  ])
                }
                maxFiles={1}
                files={values?.bannerImage}
              />
              <ErrorMessage
                name="bannerImage"
                component="p"
                className="error"
              />
            </div>

            <CustomTextField name="metaTitle" label="Meta Title" />
            <CustomTextField name="metaDescription" label="Meta Description" />

            <Button
              sx={{ color: "white" }}
              variant="contained"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Update Page"
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
    </Box>
  );
};

export default EditPage;
