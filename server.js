const express = require("express");

const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const PORT = process.env.PORT || 3444;
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
const isAdmin = require("./middlewares/admin.middleware");

const { authRoute } = require("./routes/auth");
const { adminRoute } = require("./routes/admin");
const { customerRoute } = require("./routes/customer");

app.use("/api/auth", authRoute);
app.use("/api/admin", isAdmin, adminRoute);
app.use("/api/customer", customerRoute);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.get("/data", async (req, res) => {
  const { data, error } = await getAllData();
  if (error) {
    res.status(500).send("Server Error");
  } else {
    console.log(">>", data.length);
    res.send(data);
  }
});

app.listen(PORT, () => {
  console.log("SErver running at port ", PORT);
});

// cart page PENDING
// buy functaionality and all modals pending
// order histories ]
// order db
// crud product, vendor,
// generate reports
