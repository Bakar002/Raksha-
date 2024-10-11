/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";
import axios from "../api/axios";
export const pagesContext = createContext();

export const PagesProvider = ({ children }) => {
  const [pages, setpages] = useState([]);

  useEffect(() => {
    async function getAllPages() {
      try {
        const response = await axios.get("/api/pages");
        if (response.status === 200) {
          setpages(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getAllPages();
  }, []);
  return (
    <pagesContext.Provider value={pages}>{children}</pagesContext.Provider>
  );
};
