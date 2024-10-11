/* eslint-disable react/prop-types */
import { Tabs, Tab } from "@mui/material";

const CaseTabs = ({ selectedTab, handleTabChange }) => (
  <Tabs
    value={selectedTab}
    onChange={handleTabChange}
    sx={{
      "& .MuiTabs-indicator": {
        backgroundColor: "hsl(129, 61%, 52%)", // Indicator color
      },
    }}
    textColor="inherit" // This allows us to customize the text color using the sx prop
    indicatorColor="primary" // This will be overridden by the sx styling
  >
    <Tab
      label="All Cases"
      sx={{
        color: selectedTab === 0 ? "hsl(129, 61%, 52%)" : "inherit", // Text color for selected tab
        "&.Mui-selected": {
          color: "hsl(129, 61%, 52%)", // Text color when selected
        },
      }}
    />
    <Tab
      label="New Cases"
      sx={{
        color: selectedTab === 1 ? "hsl(129, 61%, 52%)" : "inherit",
        "&.Mui-selected": {
          color: "hsl(129, 61%, 52%)",
        },
      }}
    />
    <Tab
      label="Pending Reviews"
      sx={{
        color: selectedTab === 2 ? "hsl(129, 61%, 52%)" : "inherit",
        "&.Mui-selected": {
          color: "hsl(129, 61%, 52%)",
        },
      }}
    />
    <Tab
      label="Rescues in Progress"
      sx={{
        color: selectedTab === 3 ? "hsl(129, 61%, 52%)" : "inherit",
        "&.Mui-selected": {
          color: "hsl(129, 61%, 52%)",
        },
      }}
    />
  </Tabs>
);

export default CaseTabs;
