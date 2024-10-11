/* eslint-disable react/prop-types */
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import { useContext, useMemo } from "react";
import { pagesContext } from "../../context/PagesContext";
import { transformPagesToCategories } from "../../Utils/transformPagesToCategories ";
import { WebsiteInfoContext } from "../../context/WebsiteInfoContext";
import Header from "./Header";
import ScrollToTopOfPage from "./ScrollToTopOfPage";

const MainLayout = () => {
  const pages = useContext(pagesContext);
  const categories = useMemo(() => transformPagesToCategories(pages), [pages]);
  const websiteInfo = useContext(WebsiteInfoContext);

  return (
    <div>
      <Header categories={categories} websiteInfo={websiteInfo} />
      <main>
        <Outlet />
      </main>
      <Footer categories={categories} websiteInfo={websiteInfo} />
      <ScrollToTopOfPage />
    </div>
  );
};

export default MainLayout;
