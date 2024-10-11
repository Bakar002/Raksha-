/* eslint-disable react/prop-types */

import { useNavigate } from "react-router-dom";
import AdminNgoTable from "../Tables/AdminNgoTable";
import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../api/axiosPrivate";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  CircularProgress, // Import MUI's CircularProgress for loading
} from "@mui/material";

const NgoAdminManagement = () => {
  const [AllNgos, setAllNgos] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedNgoId, setSelectedNgoId] = useState(null);
  const [deleting, setDeleting] = useState(false); // State for tracking delete operation
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  useEffect(() => {
    const getAllNgos = async () => {
      try {
        const response = await axiosPrivate.get("/api/ngos");
        setAllNgos(response.data.ngos);
      } catch (error) {
        console.log(error);
      }
    };
    getAllNgos();
  }, []);

  const handleView = (ngo) => {
    const id = ngo._id;
    navigate(`/admin/ngo-management/${id}`);
  };

  const handleDelete = (id) => {
    setSelectedNgoId(id);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    setDeleting(true); // Start the loading state
    const id = selectedNgoId;
    console.log("Ngo with id to be deleted:", id);
    try {
      const response = await axiosPrivate.delete(`/api/ngos/${id}`);
      if (response.status === 200) {
        setAllNgos((prevNgos) =>
          prevNgos.filter((ngo) => ngo._id !== selectedNgoId)
        );
        setSelectedNgoId(null);
        setOpenDialog(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDeleting(false); // End the loading state
    }
  };

  const cancelDelete = () => {
    setSelectedNgoId(null);
    setOpenDialog(false);
  };

  return (
    <div className="d-flex flex-column gap-500">
      <h1>NGOs Management</h1>

      <AdminNgoTable
        AllNgos={AllNgos}
        handleDelete={handleDelete}
        handleView={handleView}
      />

      <Dialog open={openDialog} onClose={cancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this NGO?</DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary" disabled={deleting}>
            Cancel
          </Button>

          <Button
            onClick={confirmDelete}
            color="error"
            disabled={deleting} // Disable button while deleting
            startIcon={
              deleting && <CircularProgress size={20} color="inherit" />
            } // Show CircularProgress when deleting
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NgoAdminManagement;
