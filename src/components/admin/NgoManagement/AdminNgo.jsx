import { useParams } from "react-router-dom";
import VolunteersTable from "../../Ngo/VolunteerTable";
import { useEffect, useState } from "react";
import { Dialog, IconButton, useMediaQuery } from "@mui/material";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

import CasesTable from "../../Ngo/CasesTable";
import { useTheme } from "@emotion/react";
import CaseDetailsModal from "../../Ngo/CaseDetailsModal";
import useAxiosPrivate from "../../../api/axiosPrivate";
import Profile from "../NgoManagement/Profile";
import { AccountCircle } from "@mui/icons-material";

function AdminNgo() {
  const { id } = useParams();
  const axiosPrivate = useAxiosPrivate();

  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);
  const [isCaseDetailsModalOpen, setIsCaseDetailsModalOpen] = useState(false);
  const [AllNgoCases, setAllNgoCases] = useState([]);
  const [AllNgoVolunteers, setAllNgoVolunteers] = useState([]);
  const [ngoInfo, setngoInfo] = useState({});
  const theme = useTheme();
  useEffect(() => {
    const getNgoDetails = async () => {
      try {
        //fetch ngo details here
        const response = await axiosPrivate.get(`api/ngos/${id}`);
        console.log(response.data);
        if (response.status === 200) {
          const { user, location, pincode, cases, volunteers } =
            response.data.ngo;
          setAllNgoCases(cases);
          setAllNgoVolunteers(volunteers);

          const transLocation = {
            lat: location.coordinates[1],
            lng: location.coordinates[0],
          };
          setngoInfo((prev) => ({
            ...prev,
            NgoName: user.name,
            email: user.email,
            address: user.address,
            location: transLocation,
            contact: user.contact,
            pincode: pincode,
          }));
        }
      } catch (e) {
        console.log(e);
      }
    };
    getNgoDetails();
  }, []);

  const isFullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleViewVolunteer = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setIsVolunteerModalOpen(true);
  };
  const handleViewCase = (caseData) => {
    console.log(caseData);
    setSelectedCase(caseData);
    setIsCaseDetailsModalOpen(true);
  };
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="d-flex flex-column gap-500">
      <div className="d-flex justify-between flex-column items-center">
        <h1>NGO: {ngoInfo?.NgoName}</h1>
        <IconButton onClick={handleClickOpen} color="inherit">
          <AccountCircle />
        </IconButton>
        <Profile open={open} onClose={handleClose} profileData={ngoInfo} />
      </div>
      <div>
        <h3>All Cases of Ngo : {ngoInfo?.name}</h3>
        <CasesTable data={AllNgoCases} handleEdit={handleViewCase} />
        <CaseDetailsModal
          open={isCaseDetailsModalOpen}
          isFullScreen={isFullScreen}
          onClose={() => setIsCaseDetailsModalOpen(false)}
          caseData={selectedCase}
          isReadOnly={true}
        />
      </div>

      <div className="d-flex flex-column gap-500">
        <h3>Volunteers of the Ngo</h3>
        <VolunteersTable
          data={AllNgoVolunteers}
          handleView={handleViewVolunteer}
        />
        <Dialog
          open={isVolunteerModalOpen}
          onClose={() => setIsVolunteerModalOpen(false)}
        >
          <DialogTitle>NGO Volunteer Details</DialogTitle>
          <DialogContent>
            {selectedVolunteer && (
              <form>
                <TextField
                  margin="dense"
                  name="name"
                  label="Name"
                  type="text"
                  fullWidth
                  value={selectedVolunteer.name}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  margin="dense"
                  name="email"
                  label="Email"
                  type="email"
                  fullWidth
                  value={selectedVolunteer.email}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  margin="dense"
                  name="address"
                  label="Address"
                  type="text"
                  fullWidth
                  value={selectedVolunteer.address}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  margin="dense"
                  name="contact"
                  label="contact"
                  type="tel"
                  fullWidth
                  value={selectedVolunteer.contact}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <DialogActions>
                  <Button
                    color="warning"
                    onClick={() => setIsVolunteerModalOpen(false)}
                  >
                    Close
                  </Button>
                </DialogActions>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default AdminNgo;
