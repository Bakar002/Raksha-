/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import { useMediaQuery, useTheme } from "@mui/material";

import CaseDetailsModal from "./CaseDetailsModal";
import CasesTable from "./CasesTable";
import StatusBadge from "./StatusBadge";
import {
  Add,
  Block,
  Check,
  PendingActionsOutlined,
  Visibility,
} from "@mui/icons-material";
import useAxiosPrivate from "../../api/axiosPrivate";

function CaseManagement({
  newDetectedCases,
  NgoProfile,
  allCases,
  handleAddNewCase,
  handleDeleteNewlyDetectedCase,
  handleUpdateIncidentCase,
}) {
  useEffect(() => {}, []);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentCase, setCurrentCase] = useState({});
  const theme = useTheme();

  const [takeCaseUnderCareLoading, settakeCaseUnderCareLoading] =
    useState(false);
  const [caseTaken, setCaseTaken] = useState(null);
  const isFullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const axiosPrivate = useAxiosPrivate();
  const handleEdit = (caseData) => {
    setCurrentCase(caseData);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedCase) => {
    try {
      const ngoId = NgoProfile.id;
      const caseId = updatedCase._id;
      const payload = {
        status: updatedCase.status,
        underTreatmentImages: updatedCase.underTreatmentImages,
      };
      console.log(updatedCase);
      const response = await axiosPrivate.put(
        `/api/ngos/${ngoId}/cases/${caseId}`,
        payload
      );
      if (response.status === 200) {
        handleUpdateIncidentCase(response.data.updatedCase);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const takeCaseUnderCare = async (newCase) => {
    settakeCaseUnderCareLoading(true);
    setCurrentCase(newCase);
    const ngoId = NgoProfile?.id;
    try {
      const response = await axiosPrivate.put(
        `/api/cases/take-case/${newCase._id}`,
        { ngoId }
      );
      if (response.status === 200) {
        console.log(response.data.incidentCase);
        handleDeleteNewlyDetectedCase(newCase._id);
        handleAddNewCase(response.data.incidentCase);
        setCaseTaken(newCase._id);
      }
    } catch (error) {
      console.log(error);
    } finally {
      settakeCaseUnderCareLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column gap-500">
      <div className="new-case-container">
        <div>
          <Typography variant="h5" gutterBottom>
            {newDetectedCases?.length === 0
              ? "No new cases found near your ngo"
              : "Cases reported near you"}
          </Typography>
          {newDetectedCases?.length === 0 && (
            <Block color="#869f8b" sx={{ fontSize: "50px" }} />
          )}
        </div>

        <div className="new-cases">
          {newDetectedCases?.map((newCase) => (
            <div key={newCase?._id} className="incident-case-card">
              <PendingActionsOutlined />
              <div className="badge-container">
                <StatusBadge status={newCase.status} />
              </div>
              <img src={newCase?.injuryImages[0]?.url} />
              <div className="d-flex justify-between">
                <Button
                  sx={{ color: "white" }}
                  variant="contained"
                  size="small"
                  onClick={() => takeCaseUnderCare(newCase)}
                  disabled={
                    takeCaseUnderCareLoading || caseTaken === newCase._id
                  } // Disable button while loading or case already taken
                >
                  {takeCaseUnderCareLoading &&
                  currentCase?._id === newCase._id ? (
                    <CircularProgress size={16} color="inherit" /> // Show spinner while loading
                  ) : caseTaken === newCase._id ? (
                    <Check fontSize="small" /> // Show check icon if case is taken
                  ) : (
                    <Add fontSize="small" /> // Default add icon
                  )}
                  {caseTaken === newCase._id ? "Under Care" : "Take Under Care"}
                </Button>
                <IconButton
                  onClick={() => handleEdit(newCase)}
                  size="small"
                  sx={{ color: "primary.main" }} // Change to your primary color
                >
                  <Visibility fontSize="small" />
                  View
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="case-management d-flex flex-column">
        <Typography variant="h4" gutterBottom>
          All Cases
        </Typography>
        <div className="content">
          <CasesTable data={allCases} handleEdit={handleEdit} />
          <CaseDetailsModal
            ngoLocation={NgoProfile?.location}
            open={editModalOpen}
            isFullScreen={isFullScreen}
            onClose={() => setEditModalOpen(false)}
            caseData={currentCase}
            onSave={handleSaveEdit}
          />
        </div>
      </div>
    </div>
  );
}

export default CaseManagement;
