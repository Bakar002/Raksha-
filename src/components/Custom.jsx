/* eslint-disable react/prop-types */
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { ErrorMessage, Field } from "formik";
export const CustomTextField = ({ name, label, ...props }) => (
  <div className="d-flex flex-column">
    <Field
      as={TextField}
      margin="dense"
      name={name}
      label={label}
      fullWidth
      {...props}
    />
    <ErrorMessage name={name} component="div" className="error" />
  </div>
);
export const CustomDialog = ({ open, onClose, title, children }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle
      sx={{
        backgroundColor: "#f5f5f5",
        borderBottom: "1px solid #ddd",
      }}
    >
      {title}
    </DialogTitle>
    <DialogContent>{children}</DialogContent>
    <DialogActions
      sx={{
        backgroundColor: "#f5f5f5",
        borderTop: "1px solid #ddd",
      }}
    >
      <Button onClick={onClose} color="warning">
        Cancel
      </Button>
    </DialogActions>
  </Dialog>
);
