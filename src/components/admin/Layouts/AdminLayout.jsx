import { useEffect, useState } from "react";
import AdminHeader from "./AdminHeader";
import AdminSideBar from "./AdminSideBar";
import useWindowWidth from "../../../hooks/useWindowWidth";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const windowWidth = useWindowWidth();
  const toggleSidebar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };
  const isSmallScreen = windowWidth < 800;
  const variant = isSmallScreen ? "temporary" : "temporary";
  const data = {
    count: 5,
  };
  return (
    <>
      <AdminHeader toggleSidebar={toggleSidebar} />
      <AdminSideBar
        open={isSideBarOpen}
        onClose={() => setIsSideBarOpen(false)}
        variant={variant}
      />
      <main
        style={{
          transition: "margin 0.3s",
          padding: "20px",
          marginTop: "7rem",
        }}
      >
        <Outlet data={data} />
      </main>
    </>
  );
};

export default AdminLayout;
