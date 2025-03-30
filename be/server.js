const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const mongoURI = "mongodb+srv://shreyarai0308:cX1YaZYpwUhIt72f@cluster0.uxmmd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Define models
const Certificate = mongoose.model("certificates", new mongoose.Schema({}, { strict: false }));
const Student = mongoose.model("students", new mongoose.Schema({}, { strict: false }));

// API to fetch certificates with student names
app.post("/api/certificates", async (req, res) => {
  const { type, value } = req.body;

  try {
    // Fetch certificates based on batch or description
    const query = type === "batch" ? { batch: value } : { description: value };
    const certificates = await Certificate.find(query);

    if (certificates.length === 0) {
      return res.json([]);
    }

    // Fetch student IDs from certificates
    const studentIds = certificates.map((cert) => cert.user.toString());

    console.log("Fetched Student IDs:", studentIds); // Debugging log

    // Fetch student details
    const students = await Student.find({ _id: { $in: studentIds } });

    console.log("Fetched Students:", students); // Debugging log

    // Create a mapping of student IDs to names
    const studentMap = {};
    students.forEach((student) => {
      studentMap[student._id.toString()] = student.name;
    });

    console.log("Student Map:", studentMap); // Debugging log

    // Map student names to certificates
    const result = certificates.map((cert) => ({
      studentName: studentMap[cert.user.toString()] || "Unknown",
      certificateUrl: cert.certificateUrl,
      description: cert.description,
    }));

    console.log("Final Response Data:", result); // Debugging log

    res.json(result);
  } catch (error) {
    console.error("Error fetching certificates:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
});

app.listen(process.env.PORT, () => console.log("Server running on port"));
