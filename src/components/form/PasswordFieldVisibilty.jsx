/* eslint-disable react/prop-types */
import { useState } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useField } from "formik";

const PasswordFieldVisibilty = ({ label, name }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [field, meta] = useField(name);

  return (
    <TextField
      {...field}
      label={label}
      type={showPassword ? "text" : "password"}
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setShowPassword((prev) => !prev)}
              edge="end"
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      fullWidth
      margin="normal"
    />
  );
};

export default PasswordFieldVisibilty;
