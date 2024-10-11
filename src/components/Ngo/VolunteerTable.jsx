/* eslint-disable react/prop-types */
import { Visibility } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { useMemo } from "react";
import { MaterialReactTable } from "material-react-table";

function VolunteersTable({ data, handleView }) {
  console.log(data);
  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        size: 150,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 200,
      },
      {
        accessorKey: "contact",
        header: "Contact no",
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
}

export default VolunteersTable;
