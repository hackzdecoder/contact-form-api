require("dotenv").config();
const express = require("express");
const cors = require("cors");
const end_point = require("../routes/api");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/api", end_point);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
