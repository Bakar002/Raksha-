/* eslint-disable react/prop-types */
import { Visibility } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { useMemo, useState } from "react";
import StatusBadge from "./StatusBadge";
import { MaterialReactTable } from "material-react-table";
import CaseTabs from "./CaseTabs";

function CasesTable({ data, handleEdit }) {
  const columns = useMemo(
    () => [
      {
        accessorKey: "animalName",
        header: "Animal Name",
        size: 150,
      },
      {
        accessorKey: "reporterInfo.name",
        header: "Reporter Name",
        size: 200,
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 150,
        sortType: (a, b) => {
          const statusOrder = {
            Recoverd: 1,
            "Under Care": 2,
            New: 3,
          };
          return (statusOrder[a] || 0) - (statusOrder[b] || 0);
        },
        Cell: ({ cell }) => <StatusBadge status={cell.getValue()} />,
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
              onClick={() => handleEdit(row.original)}
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
  const [selectedTab, setSelectedTab] = useState(0);
  const filteredCasesData = useMemo(() => {
    switch (selectedTab) {
      case 0:
        return data; // All cases
      case 1:
        return data?.filter((caseItem) => caseItem?.status === "New"); // New cases
      case 2:
        return data?.filter(
          (caseItem) => caseItem?.status === "Pending Review"
        ); // Under Care cases
      case 3:
        return data?.filter(
          (caseItem) => caseItem?.status === "Rescue In Progress"
        ); // Recovered cases
      default:
        return data;
    }
  }, [selectedTab, data]);
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <>
      <CaseTabs selectedTab={selectedTab} handleTabChange={handleTabChange} />
      <MaterialReactTable
        columns={columns}
        data={filteredCasesData}
        enableSorting
        enableColumnFilterModes
        enableGlobalFilter
        enablePagination
        muiTablePaperProps={{
          elevation: 2,
          sx: { borderRadius: "10px", border: "none" },
        }}
      />
    </>
  );
}

export default CasesTable;
