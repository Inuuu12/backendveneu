const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Express jalan 🚀");
});

app.listen(3000, () => {
  console.log("Server running di http://localhost:3000");
});