import { useEffect, useState } from "react";
import axios from "../../api/axios";
import DOMPurify from "dompurify";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Button,
  Divider,
  Typography,
  CircularProgress,
} from "@mui/material";
import CircularWithValueLabel from "../CircularProgressWithLabel";
import { AccessTime, CurrencyRupee, People } from "@mui/icons-material";

/* eslint-disable react/prop-types */
const PageRenderer = ({ id }) => {
  const [htmlContent, setHtmlContent] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [PageCategory, setPageCategory] = useState("");
  const [metaTitle, setMetaTitle] = useState("Default Title");
  const [metaDescription, setMetaDescription] = useState("Default Description");
  const [goal, setGoal] = useState(null);
  const [raised, setRaised] = useState(null);
  const [raisedBy, setRaisedBy] = useState(null);
  const [days, setDays] = useState(null);
  const [proofDoc, setProofDocs] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPageById = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axios.get(`/api/pages/${id}`);
        console.log(response.data);

        if (response.data.ok) {
          const {
            pageData,
            bannerImage,
            category,
            metaTitle,
            metaDescription,
          } = response.data.page;
          setHtmlContent(DOMPurify.sanitize(pageData));
          setBannerImage(bannerImage[0]?.url);
          setPageCategory(category);
          setMetaTitle(metaTitle || "Default Title");
          setMetaDescription(metaDescription || "Default Description");
          if (category === "Donations and Fundraising") {
            setGoal(response?.data?.page?.goal);
            setRaised(response?.data?.page?.raised);
            setDays(response?.data?.page?.days);
            setRaisedBy(response?.data?.page.raisedBy);
            setProofDocs(response?.data?.page.proofDoc);
          }
        }
      } catch (error) {
        console.error("Error fetching page:", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    getPageById();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="page-renderer">
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={bannerImage} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={bannerImage} />
      </Helmet>
      {PageCategory === "Donations and Fundraising" ? (
        <div className="d-flex donations-page gap-500">
          <div className="donation-statics">
            <div className="container">
              <Box display="flex">
                <div className="d-flex padding-400 flex-column item-center">
                  <Typography color="primary" variant="h6">
                    Raised
                  </Typography>
                  <Typography
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    gap=".3rem"
                    variant="h6"
                  >
                    <CurrencyRupee /> {raised}
                  </Typography>
                </div>
                <Divider orientation="vertical" variant="middle" flexItem />
                <div className="d-flex padding-400 flex-column item-center">
                  <Typography color="primary" variant="h6">
                    Goal
                  </Typography>
                  <Typography
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    gap=".3rem"
                    variant="h6"
                  >
                    <CurrencyRupee /> {goal}
                  </Typography>
                </div>
              </Box>
              <Box padding="1rem" display="flex" justifyContent="center">
                <CircularWithValueLabel goal={goal} raised={raised} />
              </Box>
              <Box display="flex" justifyContent="space-between">
                <div className="d-flex padding-400 flex-column item-center">
                  <Typography color="primary" variant="h6">
                    Donors
                  </Typography>
                  <Typography
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    gap=".5rem"
                    variant="h6"
                  >
                    <People /> {raisedBy}
                  </Typography>
                </div>
                <Divider orientation="vertical" variant="middle" flexItem />
                <div className="d-flex padding-400 flex-column item-center">
                  <Typography color="primary" variant="h6">
                    Days
                  </Typography>
                  <Typography
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    gap=".5rem"
                    variant="h6"
                  >
                    <AccessTime /> {days}
                  </Typography>
                </div>
              </Box>
            </div>
          </div>
          <div className="donations-content">
            <div className="d-flex flex-column gap-400">
              <img
                className="patient-image"
                src={bannerImage}
                alt="Patient Image"
              />
              <div className="d-flex flex-column gap-400">
                {proofDoc.map((profImag) => (
                  <Button
                    variant="contained"
                    key={profImag.public_id}
                    href={profImag?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open file
                  </Button>
                ))}
              </div>
            </div>
            <div
              className="patient-page-content"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>
        </div>
      ) : (
        <div className="common-page">
          <img className="bannerImage" src={bannerImage} alt="Banner Image" />
          <div
            className="ck-content"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>
      )}
    </div>
  );
};

export default PageRenderer;
