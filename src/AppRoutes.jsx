import { BrowserRouter, Route, Routes } from "react-router-dom";
import NGOLoginPage from "./components/auth/LoginPage";
import NGORegistrationPage from "./pages/NgoRegister";
import NgoManagement from "./pages/NgoManagement";
import AdminLayout from "./components/admin/Layouts/AdminLayout";
import AdminHomePage from "./components/admin/AdminHomePage";
import App from "./App";
import PageRenderer from "./components/pages/PageRenderer"; // Import your PageRenderer component
import MainLayout from "./components/HomeLayout/MainLayout";
import CreatePage from "./components/admin/PageManagement/CreatePage";
import Profile from "./components/admin/Profile";
import EditPage from "./components/admin/PageManagement/EditPage";
import NgoAdminManagement from "./components/admin/NgoManagement/NgoAdminMangament";
import AdminNgo from "./components/admin/NgoManagement/AdminNgo";
import ReportIncidentForm from "./components/form/ReportIncidentForm";
import RequireAuth from "./components/auth/RequireAuth";
import { pagesContext } from "./context/PagesContext.jsx";
import { useContext, useMemo } from "react";
import { transformPagesToCategories } from "./Utils/transformPagesToCategories .js";
import EmailVerificationPage from "./components/EmailVarification.jsx";
import BecomeMember from "./components/form/BecomeMember.jsx";
import Updates from "./components/admin/Updates.jsx";
import BecomeVolunteer from "./components/form/BecomeVolunteer.jsx";
import AdminGallary from "./components/admin/AdminGallary.jsx";
import AdminEvents from "./components/admin/AdminEvents.jsx";
import FundraisingPosts from "./components/FundraisingPosts.jsx";
import MembersVolunteers from "./components/admin/MembersVolunteers.jsx";
import OurMembers from "./components/OurMembers.jsx";
import OurVolunteers from "./components/OurVolunteers.jsx";
import ContactUs from "./components/ContactUsForm.jsx";
import TrackCurrentStatusPage from "./components/TrackCurrentStatusPage.jsx";
import Gallery from "./components/OurGallary.jsx";
import ScrollToTop from "./Utils/ScrollToTop.js";

const AppRoutes = () => {
  const pages = useContext(pagesContext);

  const categories = useMemo(() => transformPagesToCategories(pages), [pages]);
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<App />} />
          <Route
            path="/report-animal-incident"
            element={<ReportIncidentForm />}
          />
          <Route path="/users/login" element={<NGOLoginPage />} />
          <Route path="/register-ngo" element={<NGORegistrationPage />} />
          <Route path="/becomeMember" element={<BecomeMember />} />
          <Route path="/becomeVolunteer" element={<BecomeVolunteer />} />
          <Route path="/ourGallary" element={<Gallery />} />
          <Route path="fundraisings" element={<FundraisingPosts />} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route path="/our-members" element={<OurMembers />} />
          <Route path="/our-volunteers" element={<OurVolunteers />} />
          <Route path="/contact-us-form" element={<ContactUs />} />
          <Route
            path="/track-animal-status"
            element={<TrackCurrentStatusPage />}
          />
          {categories?.flatMap((category) =>
            category.pages.map((page) => (
              <Route
                key={`${category.category}/${page._id}`}
                path={`/${category.category
                  .toLowerCase()
                  .replace(/ /g, "-")}/${page.title
                  .toLowerCase()
                  .replace(/ /g, "-")}`}
                element={
                  <PageRenderer
                    id={page._id}
                    page={page.title}
                    category={category.category}
                  />
                }
              />
            ))
          )}
        </Route>
        <Route element={<RequireAuth allowedRoles={["ngo"]} />}>
          <Route path="/ngo-management" element={<NgoManagement />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={["super_admin"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/home" element={<AdminHomePage />} />
            <Route
              path="/admin/ngo-management"
              element={<NgoAdminManagement />}
            />

            <Route path="admin/ngo-management/:id" element={<AdminNgo />} />

            <Route path="/admin/create-new-page" element={<CreatePage />} />
            <Route path="/admin/profile" element={<Profile />} />
            <Route path="/admin/edit-page/:id" element={<EditPage />} />
            <Route path="/admin/updates" element={<Updates />} />
            <Route
              path="/admin/volunteers-and-members"
              element={<MembersVolunteers />}
            />
            <Route path="/admin/gallary" element={<AdminGallary />} />
            <Route path="/admin/events" element={<AdminEvents />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
