/* eslint-disable react/prop-types */
import { Visibility } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { useMemo } from "react";

const ApplicationsTable = ({ data, handleView }) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Member Name",
        size: 150,
      },
      {
        accessorKey: "email",
        header: "Member Email",
        size: 200,
      },
      {
        accessorKey: "address",
        header: "Member Address",
        size: 200,
      },
      {
        accessorKey: "pincode",
        header: "Pincode",
        size: 100,
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
              onClick={() => handleView(row.original)}
            >
              <Visibility fontSize="10px" />
              View
            </Button>
          </Box>
        ),
      },
    ],
    []
  );
  return (
    <div>
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
    </div>
  );
};

export default ApplicationsTable;
