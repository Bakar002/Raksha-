import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, IconButton, InputAdornment, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { CustomTextField } from "../Custom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import RecaptchaComponent from "../Recaptcha";

// Define validation schema using Yup
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required."),
  email: Yup.string().email("Email is invalid.").required("Email is required."),
  contact: Yup.string().required("Contact number is required."),
  password: Yup.string()
    .required("Password is required.")
    .min(6, "Password must be at least 6 characters long."),
});

const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const passedValues = location?.state;
  const [initialValues, setinitialValues] = useState(
    passedValues?.formValues || {}
  );
  const handleSignUpSubmit = (valus, { setSubmitting }) => {
    if (!recaptchaToken) {
      setSubmitting(false);
      return;
    }
    console.log(valus);

    setSubmitting(false);
  };

  return (
    <div className="signup-container">
      <Formik
        initialValues={{
          name: initialValues?.reporterName || "",
          email: initialValues?.reporterEmail || "",
          password: "",
          contact: initialValues?.reporterContact || "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSignUpSubmit}
      >
        {({ isSubmitting, handleChange, values }) => (
          <Form className="signup-form">
            <Typography sx={{ textAlign: "center" }} variant="h6">
              Sign Up
            </Typography>
            <CustomTextField name="name" label="Name" type="text" />
            <CustomTextField name="contact" label="Contact Number" />
            <CustomTextField name="email" label="Email Address" />
            <CustomTextField
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {!showPassword ? (
                        <VisibilityOff fontSize="small" />
                      ) : (
                        <Visibility fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <div className="d-flex flex-column justify-between items-center gap-400">
              <RecaptchaComponent onVerify={setRecaptchaToken} />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isSubmitting}
              >
                Register
              </Button>
              <Button
                onClick={() => navigate("/users/login")}
                variant="outlined"
                fullWidth
              >
                Login
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignUp;
