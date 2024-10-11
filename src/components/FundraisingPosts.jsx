import { CurrencyRupee } from "@mui/icons-material";
import { Box, Button, Divider, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import axios from "../api/axios";
import { generateLinks } from "../Utils/GenerateLinkUtils";
import { pagesContext } from "../context/PagesContext";
import { transformPagesToCategories } from "../Utils/transformPagesToCategories ";
import { Link } from "react-router-dom";

const FundraisingPosts = () => {
  const [posts, setposts] = useState([]);
  const pages = useContext(pagesContext);
  const categories = transformPagesToCategories(pages);

  const links = generateLinks(categories, ["Donations and Fundraising"]);
  console.log(links);
  useEffect(() => {
    const getAllFundraisingPages = async () => {
      const category = "Donations and Fundraising";

      try {
        const response = await axios.get(
          `/api/pages/category?category=${encodeURIComponent(category)}`
        );
        console.log(response.data);
        if (response.status === 200) setposts(response.data);
        console.log(links);
      } catch (err) {
        console.log(err);
      }
    };
    getAllFundraisingPages();
  }, []);

  return (
    <div className="fundraising-posts">
      <h1>Fundraising Posts</h1>
      <Box display="flex" flexWrap="wrap" justifyContent="center" gap="1.5rem">
        {posts?.map((post, index) => (
          <div key={post._id} className="card">
            <Box position="relative">
              <img
                src={post.bannerImage[0].url}
                alt={post.title}
                style={{
                  width: "100%",
                  height: "auto",
                  borderTopLeftRadius: "1rem",
                  borderTopRightRadius: "1rem",
                }}
              />

              {/* Floating Title */}
              <Box
                position="absolute"
                bottom="0"
                left="0"
                right="0"
                padding="0.5rem"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0))",
                  borderBottomLeftRadius: "1rem",
                  borderBottomRightRadius: "1rem",
                }}
              >
                <div>
                  <Typography color="white" variant="h5">
                    {post.title}
                  </Typography>
                </div>
              </Box>
            </Box>
            <Box display="flex" padding="1rem" justifyContent="space-between">
              <Box display="grid">
                <Typography>Raised</Typography>
                <Typography
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  gap=".3rem"
                  fontWeight={600}
                >
                  <CurrencyRupee /> {post.raised}
                </Typography>
              </Box>
              <Divider orientation="vertical" variant="middle" flexItem />

              <Box display="grid">
                <Typography>Goal</Typography>
                <Typography
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  gap=".3rem"
                  fontWeight={600}
                >
                  <CurrencyRupee /> {post.goal}
                </Typography>
              </Box>
              <Divider orientation="vertical" variant="middle" flexItem />
              <Button component={Link} to={links[index].link}>
                View
              </Button>
            </Box>
          </div>
        ))}
      </Box>
    </div>
  );
};

export default FundraisingPosts;
