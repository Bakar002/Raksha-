/* eslint-disable react/prop-types */
import { Visibility } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { useMemo } from "react";

const AdminVolunteerAndMemberTable = ({ data, handleView }) => {
  const columns = useMemo(() => [
    {
      accessorKey: "serialNo",
      header: "Sr. No",
      size: 150,
    },
    {
      accessorKey: "name",
      header: "Name",
      size: 150,
    },
    {
      accessorKey: "designation",
      header: "Designation",
      size: 150,
    },
    {
      accessorKey: "validTill",
      header: "Valid Till",
      size: 150,
    },
    {
      id: "actions",
      header: "Actions",
      size: 100,
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
            onClick={() => handleView(row.original)} // open modal with selected person's details
          >
            <Visibility fontSize="10px" />
            View
          </Button>
        </Box>
      ),
    },
  ]);

  return (
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
  );
};

export default AdminVolunteerAndMemberTable;
