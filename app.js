const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const DatabaseProvider = require("./src/provider/DatabaseProvider");

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("app running..");
});

// connect sequelize
DatabaseProvider.sequelize
  .sync()
  .then(() => {
    console.log("Database Connected...");
  })
  .catch((err) => {
    console.log("Failed to connect database: " + err.message);
  });

require("./src/routes/UserRoute")(app);
require("./src/routes/OtpRoute")(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("app listening on port", PORT);
});
