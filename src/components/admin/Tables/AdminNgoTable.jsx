/* eslint-disable react/prop-types */
import { MaterialReactTable } from "material-react-table";
import { Visibility, Delete } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { useMemo } from "react";

const AdminNgoTable = ({ handleView, handleDelete, AllNgos }) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "user.name",
        header: "Name",
        size: 150,
      },
      {
        accessorKey: "user.email",
        header: "Email",
        size: 200,
      },
      {
        accessorKey: "user.contact",
        header: "Contact",
        size: 150,
      },
      {
        id: "actions",
        header: "Actions",
        size: 200,
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", gap: "0.5rem" }}>
            <Button
              variant="text"
              style={{
                padding: "0.5rem",
                fontSize: ".8rem",
                fontWeight: "700",
              }}
              className="d-flex items-center btn-outlined"
              color="primary"
              onClick={() => handleView(row.original)}
            >
              <Visibility fontSize="small" />
              View
            </Button>
            <Button
              variant="text"
              style={{
                padding: "0.5rem",
                fontSize: ".8rem",
                fontWeight: "700",
              }}
              className="d-flex items-center btn-outlined"
              color="error"
              onClick={() => handleDelete(row.original._id)} // Assuming 'id' is the identifier
            >
              <Delete fontSize="small" />
              Delete
            </Button>
          </Box>
        ),
      },
    ],
    [handleView, handleDelete]
  );

  return (
    <MaterialReactTable
      columns={columns}
      data={AllNgos}
      enableSorting
      enableColumnFilterModes
      enableGlobalFilter
      enablePagination
      muiTablePaperProps={{
        elevation: 2,
        sx: { borderRadius: "10px", border: "none" },
      }}
    />
  );
};

export default AdminNgoTable;
