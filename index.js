require("dotenv").config();
const express = require("express");
const cors = require("cors");

const port = process.env.PORT || 6600;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bistro server is sitting....");
});

app.listen(port, () => console.log(`Server running on port ${port}`));