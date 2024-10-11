/* eslint-disable react/prop-types */
import { Edit } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { useContext, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { useNavigate } from "react-router-dom";
import { pagesContext } from "../../../context/PagesContext";
import DeleteConfirmationModal from "../../DeleteConfirmationModal";
import useAxiosPrivate from "../../../api/axiosPrivate";

export default function PagesTable() {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [openDeleteConfirmationModal, setOpenDeleteConfirmationModal] =
    useState(false);
  const [pageToDelete, setPageToDelete] = useState(null);

  const data = useContext(pagesContext);

  const handlePageDelete = async () => {
    if (pageToDelete) {
      try {
        const response = await axiosPrivate.delete(
          `/api/pages/${pageToDelete}`
        );
        console.log(response);
        if (response.status === 200) {
          setOpenDeleteConfirmationModal(false);
          setPageToDelete(null);
        }
      } catch (error) {
        console.log("Error deleting page", error.message);
      }
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        size: 20,
      },
      {
        accessorKey: "bannerImage",
        header: "Banner Image",
        size: 400,
        enableSorting: false,
        enablePagination: false,

        Cell: ({ cell }) => {
          const bannerImage = cell?.row?.original?.bannerImage;
          if (bannerImage && bannerImage?.length > 0) {
            return (
              <img
                src={bannerImage[0]?.url}
                alt="Banner"
                style={{
                  objectFit: "contain",
                  width: "400px",
                  height: "200px",
                  borderRadius: "8px",
                }}
              />
            );
          }
          return null;
        },
      },
      {
        id: "actions",
        header: "Actions",
        size: 50,
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", gap: "0.5rem" }}>
            <Button
              variant="contained"
              style={{
                color: "white",
                padding: "0.5rem",
                fontSize: ".8rem",
                fontWeight: "700",
              }}
              color="primary"
              onClick={() => {
                console.log(row?.original?._id);
                navigate(`/admin/edit-page/${row?.original?._id}`);
              }}
            >
              <Edit fontSize="10px" />
              Edit
            </Button>
            <Button
              onClick={() => {
                setPageToDelete(row?.original?._id);
                setOpenDeleteConfirmationModal(true);
              }}
              variant="contained"
              color="error"
            >
              Delete
            </Button>
          </Box>
        ),
      },
    ],
    [navigate] // Add navigate as a dependency
  );

  return (
    <>
      <MaterialReactTable
        columns={columns}
        data={data}
        enableSorting
        enableColumnFilterModes
        enableGlobalFilter
        enablePagination
        muiTablePaperProps={{
          elevation: 2,
          sx: { borderRadius: "10px", border: "none" },
        }}
      />
      <DeleteConfirmationModal
        open={openDeleteConfirmationModal}
        handleDelete={handlePageDelete}
        handleClose={() => setOpenDeleteConfirmationModal(false)}
      />
    </>
  );
}
