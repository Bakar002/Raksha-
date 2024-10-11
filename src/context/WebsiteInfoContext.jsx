/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";
import axios from "../api/axios";

export const WebsiteInfoContext = createContext();

export const WebsiteInfoProvider = ({ children }) => {
  const [websiteInfo, setWebsiteInfo] = useState({});

  useEffect(() => {
    async function fetchWebsiteInfo() {
      try {
        const response = await axios.get("/api/organization");
        if (response.status === 200) {
          setWebsiteInfo(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchWebsiteInfo();
  }, []);

  return (
    <WebsiteInfoContext.Provider value={websiteInfo}>
      {children}
    </WebsiteInfoContext.Provider>
  );
};
