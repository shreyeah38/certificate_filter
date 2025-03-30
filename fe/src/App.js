import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
} from "@mui/material";

function App() {
  const [filterType, setFilterType] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
    setInputValue("");
  };

  const handleSubmit = async () => {
    if (!filterType || !inputValue) return alert("Please enter a value");

    setLoading(true);
    try {
      const res = await axios.post("https://certificate-filter-be.onrender.com/api/certificates", {
        type: filterType,
        value: inputValue,
      });

      setCertificates(res.data);
    } catch (error) {
      console.error(error);
      alert("Error fetching certificates");
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        🎓 Certificate Fetcher
      </Typography>

      {/* Filter Section */}
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={4}>
          <Select
            fullWidth
            value={filterType}
            onChange={handleFilterChange}
            displayEmpty
          >
            <MenuItem value="">Select Filter</MenuItem>
            <MenuItem value="batch">Batch</MenuItem>
            <MenuItem value="description">Description</MenuItem>
          </Select>
        </Grid>

        {filterType && (
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth
              label={
                filterType === "batch" ? "Enter Batch (e.g., 2025)" : "Enter Description (e.g., GATE)"
              }
              variant="outlined"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </Grid>
        )}

        {filterType && (
          <Grid item xs={12} sm={3}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSubmit}
              sx={{ height: "100%" }}
            >
              {loading ? "Loading..." : "Submit"}
            </Button>
          </Grid>
        )}
      </Grid>

      {/* Results Section */}
      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        📜 Certificates:
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {certificates.length > 0 ? (
          certificates.map((cert, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ maxWidth: 345 }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={cert.certificateUrl || "https://via.placeholder.com/300"}
                  alt="Certificate"
                />
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {cert.studentName || "Unknown Student"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {cert.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    variant="contained"
                    href={cert.certificateUrl}
                    target="_blank"
                  >
                    View Certificate
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" color="text.secondary">
            {loading ? "Fetching data..." : "No certificates found."}
          </Typography>
        )}
      </Grid>
    </Container>
  );
}

export default App;
