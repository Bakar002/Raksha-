import { useContext, useEffect, useState } from "react";
import {
  AddPhotoAlternate,
  Check,
  Delete,
  Email,
  LocationCity,
  Person,
  Tag,
  ToggleOn,
  Warning,
} from "@mui/icons-material";
import {
  Button,
  Modal,
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { CustomTextField } from "../Custom";
import useAxiosPrivate from "../../api/axiosPrivate";
import { WebsiteInfoContext } from "../../context/WebsiteInfoContext";
import PasswordFieldVisibilty from "../form/PasswordFieldVisibilty";
import UploadFilesDropZone from "../UploadFilesDropZone";
import axios from "../../api/axios";

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
  selectedCarouselType: Yup.string().required(
    "Carousel image type is required"
  ),
});

const Profile = () => {
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [orgInfoModalOpen, setOrgInfoModalOpen] = useState(false);
  const [userInfo, setuserInfo] = useState(null);
  const websiteInfo = useContext(WebsiteInfoContext);

  const [organizationalInfo, setOrganizationalInfo] = useState({
    logo: [],
    name: "",
    organizationalTagLine: "",
    regdOfficeAddress: "",
    email: "",
  });

  useEffect(() => {
    if (websiteInfo) {
      setOrganizationalInfo({
        logo: websiteInfo.logo || [],
        name: websiteInfo.name || "",
        organizationalTagLine: websiteInfo.organizationalTagLine || "",
        regdOfficeAddress: websiteInfo.regdOfficeAddress || "",
        email: websiteInfo.email || "",
      });
    }
  }, [websiteInfo]);

  console.log(organizationalInfo);
  const axiosPrivate = useAxiosPrivate();

  const [infoAlert, setInfoAlert] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const [orgAlert, setOrgAlert] = useState({
    open: false,
    message: "",
    severity: "",
  });
  console.log(organizationalInfo);

  const handleAlertClose = (alertType) => {
    if (alertType === "info") setInfoAlert({ ...infoAlert, open: false });
    if (alertType === "org") setOrgAlert({ ...orgAlert, open: false });
  };

  const handleInfoModalOpen = () => setInfoModalOpen(true);
  const handleInfoModalClose = () => setInfoModalOpen(false);

  const handlePasswordModalOpen = () => setPasswordModalOpen(true);
  const handlePasswordModalClose = () => setPasswordModalOpen(false);

  const handleOrgInfoModalOpen = () => setOrgInfoModalOpen(true);
  const handleOrgInfoModalClose = () => setOrgInfoModalOpen(false);

  useEffect(() => {
    const getUserById = async () => {
      try {
        const userInfo = await axiosPrivate.get("/api/user");
        if (userInfo.status === 200) setuserInfo(userInfo.data.user);
      } catch (error) {
        console.log(error);
      }
    };
    getUserById();
  }, []);
  const userValidationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    contact: Yup.string().required("contact number is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("email is required"),
    address: Yup.string().required("Address is required"),
  });
  const [passwordAlert, setpasswordAlert] = useState({
    icon: null,
    message: "",
    severity: "",
  });

  const orgValidationSchema = Yup.object({
    name: Yup.string().required("Organization name is required"),
    organizationalTagLine: Yup.string().required("Tagline is required"),
    regdOfficeAddress: Yup.string().required(
      "Registered office address is required"
    ),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    logo: Yup.array()
      .min(1, "Banner Image is required")
      .required("Banner Image is required"),
  });

  const handleOrgInfoUpdateSubmit = async (values, { setSubmitting }) => {
    console.log(values);
    const payload = {
      ...values,
      logo: values.logo[0],
    };
    try {
      const response = await axiosPrivate.patch("/api/organization", payload);
      if (response.status === 200) {
        const { logo, email, organizationalTagLine, regdOfficeAddress, name } =
          response.data.organization;
        setOrganizationalInfo((prev) => ({
          ...prev,
          logo,
          email,
          organizationalTagLine,
          regdOfficeAddress,
          name,
        }));
        setOrgAlert({
          open: true,
          message: "Organization info updated successfully!",
          severity: "success",
        });
      }
    } catch (err) {
      console.log(err);
    }
    setSubmitting(false);
  };

  const handleUserInfoUpdate = async (values, { setSubmitting }) => {
    try {
      const payload = {
        ...values,
      };
      const response = await axiosPrivate.patch("api/user", payload);
      console.log(response);
      if (response.status === 200) {
        setuserInfo(response.data.user);
        setInfoAlert({
          open: true,
          message: "User info updated successfully!",
          severity: "success",
        });
      }
    } catch (error) {
      console.log(error);
    }
    setSubmitting(false);
  };

  const [UploadedImages, setUploadedImages] = useState([]);
  const [DesktopCarouselImages, setDesktopCarouselImages] = useState([]);
  const [MobileCarouselImages, setMobileCarouselImages] = useState([]);
  const [selectedImage, setselectedImage] = useState(null);
  const [ImageLoading, setImageLoading] = useState(false);
  const [deleteImageLoading, setdeleteImageLoading] = useState(false);
  const [ImageSnackBar, setImageSnackBar] = useState({
    open: false,
    message: "",
    severity: "",
  });

  useEffect(() => {
    const fetchAllCarouselImages = async () => {
      try {
        const response = await axios.get("/api/organization/carouselImages");
        console.log(response.data);
        if (response.status === 200) {
          setDesktopCarouselImages(response?.data?.carouselImages);
          setMobileCarouselImages(response?.data?.carouselMobileImages);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllCarouselImages();
  }, []);

  const handleSubmitImages = async (values, { setSubmitting, resetForm }) => {
    console.log(values);
    try {
      setImageLoading(true);
      const response = await axiosPrivate.post(
        "/api/organization/carouselImages",
        values
      );
      if (response.status === 200) {
        if (response.data.type === "Mobile") {
          setMobileCarouselImages(response.data.images);
          setUploadedImages([]);
        }
        if (response.data.type === "Desktop") {
          setUploadedImages([]);
          setDesktopCarouselImages(response.data.images);
        }

        console.log(response.data);
        setImageSnackBar((prev) => ({
          ...prev,
          open: true,
          message: "Images added to carousel successfully!",
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
        `/api/organization/carouselImages/${id}`
      );
      console.log(response.data);
      if (response.status === 200) {
        setDesktopCarouselImages((prev) =>
          prev.filter((img) => img.public_id !== id)
        );
        setMobileCarouselImages((prev) =>
          prev.filter((img) => img.public_id !== id)
        );
      }
      setdeleteImageLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="profile-page">
      <div className="user-profile">
        <div>
          {organizationalInfo?.logo && (
            <img src={organizationalInfo?.logo.url} alt="organization logo" />
          )}
          <div className="status d-flex items-center">
            <h4>Status</h4>
            <ToggleOn fontSize="large" color="primary" />
          </div>
        </div>

        <h3>{userInfo?.name}</h3>
        <p>{userInfo?.email}</p>

        <div className="d-flex">
          <h4>Phone no:</h4>
          <p>{userInfo?.contact}</p>
        </div>
        <div className="d-flex gap-400 flex-wrap">
          <Button
            variant="contained"
            sx={{ color: "white" }}
            onClick={handleInfoModalOpen}
          >
            Update your Info
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handlePasswordModalOpen}
          >
            Change Password
          </Button>
        </div>
      </div>
      <div className="organization-profile">
        <h3 className="text-center">Organization Information</h3>
        <div className="info-box">
          <CorporateFareIcon />
          <p>Organization Name:</p>
          <p>{organizationalInfo?.name}</p>
        </div>

        <div className="info-box">
          <Tag />
          <p>Organization Tagline:</p>
          <p>{organizationalInfo?.organizationalTagLine}</p>
        </div>
        <div className="info-box">
          <LocationCity />
          <p>Office Address:</p>
          <p>{organizationalInfo?.regdOfficeAddress}</p>
        </div>
        <div className="info-box">
          <Person />
          <p>Contact Person:</p>
          <p>{userInfo?.name}</p>
        </div>
        <div className="info-box">
          <Email />
          <p>Organization Email:</p>
          <p>{organizationalInfo?.email}</p>
        </div>
        <Button
          color="warning"
          variant="contained"
          onClick={handleOrgInfoModalOpen}
        >
          Update Organization Info
        </Button>
      </div>

      <div className="bannerImages">
        <Formik
          initialValues={{
            gallaryImages: [],
            selectedCarouselType: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmitImages}
        >
          {({ setFieldValue, isSubmitting, errors, touched, values }) => (
            <Form>
              <Typography variant="h5">Upload carousel images</Typography>
              <UploadFilesDropZone
                accept={{
                  "image/*": [".jpeg", ".jpg", ".png"],
                }}
                files={UploadedImages}
                onRemove={(file) => {
                  setUploadedImages((prev) =>
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
                  setUploadedImages((prev) => [...prev, ...formattedImages]);
                  setFieldValue("gallaryImages", formattedImages);
                }}
              />
              {errors.gallaryImages && touched.gallaryImages && (
                <div style={{ color: "red" }}>{errors.gallaryImages}</div>
              )}
              <FormControl fullWidth sx={{ paddingBottom: "1rem" }}>
                <InputLabel id="selected-carouse-image-type">
                  Carousel Type
                </InputLabel>
                <Select
                  labelId="selected-carouse-image-type"
                  value={values.selectedCarouselType}
                  onChange={(event) =>
                    setFieldValue("selectedCarouselType", event.target.value)
                  }
                  label="Carousel Type"
                >
                  <MenuItem value="Mobile">Mobile</MenuItem>
                  <MenuItem value="Desktop">Desktop</MenuItem>
                </Select>
              </FormControl>

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

        <div className="desktop-carousel-uploaded-images">
          <Typography variant="h4">
            All desktop carousel uploaded images
          </Typography>
          {ImageLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            <div className="d-flex flex-wrap gap-400">
              {DesktopCarouselImages?.map((item) => (
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
        </div>
        <br />

        <div className="d-flex gap-400 flex-column">
          <Typography variant="h4">
            All Mobile carousel uploaded images
          </Typography>
          {ImageLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            <div className="d-flex flex-wrap gap-400">
              {MobileCarouselImages?.map((item) => (
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
        </div>

        <Snackbar
          open={ImageSnackBar.open}
          autoHideDuration={6000}
          onClose={() => setImageSnackBar((prev) => ({ ...prev, open: false }))}
        >
          <Alert
            onClose={() =>
              setImageSnackBar((prev) => ({ ...prev, open: false }))
            }
            severity={ImageSnackBar.severity}
            sx={{ width: "100%" }}
          >
            {ImageSnackBar.message}
          </Alert>
        </Snackbar>
      </div>

      {/* Update User Info Modal */}
      <Modal
        open={infoModalOpen}
        onClose={handleInfoModalClose}
        aria-labelledby="update-info-modal"
        aria-describedby="update-info-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          <Typography id="update-info-modal" variant="h6" component="h2">
            Update Your Information
          </Typography>
          <IconButton
            onClick={handleInfoModalClose}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <Formik
            initialValues={{
              name: userInfo?.name,
              contact: userInfo?.contact,
              email: userInfo?.email,
              address: userInfo?.address,
            }}
            validationSchema={userValidationSchema}
            onSubmit={handleUserInfoUpdate}
          >
            {() => (
              <Form>
                <CustomTextField name="name" label="your name" />
                <CustomTextField name="contact" label="your contact Number" />
                <CustomTextField name="email" label="your email address" />
                <CustomTextField name="address" label="your address" />
                <Button
                  sx={{
                    mt: 2,
                    color: "white",
                    backgroundColor: "#3acf50",
                    "&:hover": { backgroundColor: "#2c8c3f" },
                  }}
                  variant="contained"
                  fullWidth
                  type="submit"
                >
                  Save Changes
                </Button>
              </Form>
            )}
          </Formik>
          <Snackbar
            open={infoAlert.open}
            autoHideDuration={6000}
            onClose={() => handleAlertClose("info")}
          >
            <Alert
              onClose={() => handleAlertClose("info")}
              severity={infoAlert.severity}
              sx={{ width: "100%" }}
            >
              {infoAlert.message}
            </Alert>
          </Snackbar>
        </Box>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        open={passwordModalOpen}
        onClose={handlePasswordModalClose}
        aria-labelledby="change-password-modal"
        aria-describedby="change-password-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          <Typography id="change-password-modal" variant="h6" component="h2">
            Change Your Password
          </Typography>
          <IconButton
            onClick={handlePasswordModalClose}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <Formik
            initialValues={{
              currentPassword: "",
              newPassword: "",
              confirmNewPassword: "",
            }}
            validationSchema={Yup.object({
              currentPassword: Yup.string().required(
                "Current password is required"
              ),
              newPassword: Yup.string()
                .min(6, "Password must be at least 6 characters")
                .required("New password is required"),
              confirmNewPassword: Yup.string()
                .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
                .required("Confirm password is required"),
            })}
            onSubmit={async (values) => {
              console.log(values);
              try {
                const response = await axiosPrivate.post(
                  "/api/user/update-password",
                  values
                );
                if (response.status === 200) {
                  setpasswordAlert((prev) => ({
                    ...prev,
                    icon: <Check />,
                    message: "Password updated successfully",
                    severity: "success",
                  }));
                }
                console.log(response);
              } catch (error) {
                console.log(error);
                setpasswordAlert((prev) => ({
                  ...prev,
                  icon: <Warning />,
                  message: "Password couln't be updated",
                  severity: "error",
                }));
              }
              //handlePasswordModalClose();
            }}
          >
            {() => (
              <Form>
                <Alert
                  icon={passwordAlert.icon}
                  severity={passwordAlert.severity}
                >
                  {passwordAlert.message}
                </Alert>
                <PasswordFieldVisibilty
                  name="currentPassword"
                  label="Current Password"
                />
                <PasswordFieldVisibilty
                  name="newPassword"
                  label="New Password"
                />
                <PasswordFieldVisibilty
                  name="confirmNewPassword"
                  label="Confirm new Password"
                />

                <Button
                  sx={{
                    mt: 2,
                    color: "white",
                    backgroundColor: "#3acf50",
                    "&:hover": { backgroundColor: "#2c8c3f" },
                  }}
                  variant="contained"
                  fullWidth
                  type="submit"
                >
                  Change Password
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>

      {/* Organization Info Modal */}
      <Dialog open={orgInfoModalOpen} onClose={handleOrgInfoModalClose}>
        <DialogTitle>Update Organization Information</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{
              logo: [websiteInfo?.logo],
              name: websiteInfo?.name,
              organizationalTagLine: websiteInfo?.organizationalTagLine,
              regdOfficeAddress: websiteInfo?.regdOfficeAddress,
              email: websiteInfo?.email,
            }}
            validationSchema={orgValidationSchema}
            onSubmit={handleOrgInfoUpdateSubmit}
          >
            {({ isSubmitting, setFieldValue, values }) => (
              <Form>
                <CustomTextField name="name" label="Organization Name" />
                <CustomTextField name="organizationalTagLine" label="Tagline" />
                <CustomTextField
                  name="regdOfficeAddress"
                  label="Registered Office Address"
                />
                <CustomTextField name="email" label="Email" />
                <div>
                  <p>Update logo</p>
                  <UploadFilesDropZone
                    accept={{
                      "image/*": [".jpeg", ".jpg", ".png", ".svg"],
                    }}
                    onRemove={(fileToRemove) => {
                      setFieldValue(
                        "logo",
                        values.logo.filter(
                          (file) => file.public_id !== fileToRemove.public_id
                        )
                      );
                    }}
                    onDrop={(acceptedImages) => {
                      setFieldValue("logo", [
                        ...values.logo,
                        ...acceptedImages,
                      ]);
                    }}
                    maxFiles={1}
                    files={values.logo}
                  />
                </div>
                <Button
                  sx={{ color: "white" }}
                  variant="contained"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "save changes"
                  )}
                </Button>
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
        <DialogActions>
          <Button onClick={handleOrgInfoModalClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Profile;
