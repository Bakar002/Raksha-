import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Paper,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useState, useEffect } from "react";
import axios from "../api/axios";
import { Numbers } from "@mui/icons-material";

export default function OurMembers() {
  // State to store the members data
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getAllMembers = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/volunteersmembers");
        // Set the fetched data into the state
        if (response.status === 200) {
          const filteredMembers = response.data.filter(
            (person) => person.type === "member"
          );

          // Sort members by serialNo in ascending order
          const sortedMembers = filteredMembers.sort((a, b) => {
            return a.serialNo - b.serialNo;
          });

          setMembers(sortedMembers);
          console.log(response.data);
        }
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    getAllMembers();
  }, []);

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
    <div className="section-padding-class">
      <Box paddingTop={12}>
        <Typography
          variant="h4"
          fontWeight={600}
          gutterBottom
          color="primary"
          sx={{ textAlign: "center", marginBottom: 4 }}
        >
          Raksha Animal Members
        </Typography>
        {members.length > 0 ? (
          <Grid container spacing={3} justifyContent="center">
            {members.map((member) => (
              <Grid item xs={12} sm={6} md={4} key={member._id}>
                <Card
                  component={Paper}
                  elevation={3}
                  sx={{
                    transition: "0.3s",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" marginBottom={2}>
                      <Numbers color="primary" />
                      <Typography variant="body1">
                        <strong>Serial No: </strong>
                        <span style={{ fontWeight: "bold" }}>
                          {member.serialNo}
                        </span>
                      </Typography>
                    </Box>
                    {/* Name with Icon */}
                    <Box display="flex" alignItems="center" marginBottom={2}>
                      <PersonIcon color="primary" sx={{ marginRight: 1 }} />
                      <Typography variant="body1">
                        <strong>Name: </strong>
                        <span style={{ fontWeight: "bold" }}>
                          {member.name}
                        </span>
                      </Typography>
                    </Box>

                    {/* Designation with Icon */}
                    <Box display="flex" alignItems="center" marginBottom={2}>
                      <WorkIcon color="primary" sx={{ marginRight: 1 }} />
                      <Typography variant="body1">
                        <strong>Designation: </strong>
                        <span style={{ fontWeight: "bold" }}>
                          {member.designation}
                        </span>
                      </Typography>
                    </Box>

                    {/* Valid Till with Icon */}
                    <Box display="flex" alignItems="center">
                      <CalendarTodayIcon
                        color="primary"
                        sx={{ marginRight: 1 }}
                      />
                      <Typography variant="body1">
                        <strong>Valid Till: </strong>
                        <span style={{ fontWeight: "bold" }}>
                          {member.validTill}
                        </span>
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box textAlign="center" marginTop={4}>
            <Typography variant="h6">No members found</Typography>
          </Box>
        )}
      </Box>
    </div>
  );
}
