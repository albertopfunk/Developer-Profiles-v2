const express = require("express");
const routes = require("./routes/routes");
require("dotenv").config();

const server = express();

server.use(express.json());

let PORT = process.env.PORT;
if (PORT == null || PORT == "") {
  PORT = 7000;
}

server.get("/", (req, res) => {
  res.send("API is up an running!");
});

server.use("/", routes);

server.listen(PORT, () => {
  console.log(
    `== backend server is running on ${PORT} ==\n== using the ${process.env.DB} database ==`
  );
});
