const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
const mongoURI = process.env.MONGOURI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Models
const Certificate = mongoose.model("certificates", new mongoose.Schema({}, { strict: false }));
const Student = mongoose.model("students", new mongoose.Schema({}, { strict: false }));

// API
app.post("/api/certificates", async (req, res) => {
  const { type, value } = req.body;

  try {
    // Build query dynamically
    const query = {};
    if (type === "batch") query.batch = value;
    else if (type === "description") query.description = value;
    else if (type === "session") query.session = value;

    const certificates = await Certificate.find(query);
    if (certificates.length === 0) return res.json([]);

    const studentIds = certificates.map(cert => cert.user.toString());
    const students = await Student.find({ _id: { $in: studentIds } });

    const studentMap = {};
    students.forEach(student => {
      studentMap[student._id.toString()] = student.name;
    });

    const result = certificates.map(cert => ({
      studentName: studentMap[cert.user.toString()] || "Unknown",
      certificateUrl: cert.certificateUrl,
      description: cert.description,
      batch: cert.batch,
      session: cert.session,
    }));

    res.json(result);
  } catch (error) {
    console.error("Error fetching certificates:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
});

app.listen(process.env.PORT, () => console.log("Server running on port"));
