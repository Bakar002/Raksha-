/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import LocationSelector from "../../location/LocationSelector";

const Profile = ({ open, onClose, profileData }) => {
  console.log(profileData);
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Name: {profileData.NgoName}</Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1">Email: {profileData.email}</Typography>
        <Typography variant="body1">Address: {profileData.address}</Typography>
        <Typography>Contact no: {profileData.contact}</Typography>
        <Typography variant="body1">Pincode: {profileData.pincode}</Typography>
        <Box mt={2} sx={{ height: "200px", width: "100%" }}>
          <LocationSelector initialLocation={profileData.location} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Profile;
