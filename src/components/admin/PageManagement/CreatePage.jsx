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
import useAxiosPrivate from "../../../api/axiosPrivate";
import { useState } from "react";
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

const CreatePage = () => {
  const axiosPrivate = useAxiosPrivate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const payload = {
      ...values,
    };
    try {
      const response = await axiosPrivate.post("/api/pages/", payload);
      console.log(response.message);
      if (response.status == 201) {
        setSnackbarMessage("Page created successfully");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        resetForm();
      }
    } catch (error) {
      if (error?.response?.status === 400) {
        setSnackbarMessage("Page with title already exists!");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage("Page couldn't be created. Please try again!");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }

    setSubmitting(false);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Create Page
      </Typography>
      <Formik
        initialValues={{
          category: "",
          title: "",
          pageData: "",
          bannerImage: [],
          metaTitle: "",
          metaDescription: "",
          raised: "",
          goal: "",
          raisedBy: "",
          days: "",
          proofDoc: [],
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form className="d-flex flex-column gap-500">
            <PagesDropDown name="category" />
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
                "Create Page"
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

export default CreatePage;
