const {
  addVender,
  getVenders,
  addProduct,
  getProducts,
  getVendersList,
} = require("../../db/db.fun");

const route = require("express").Router();

route.get("/allVendor", (req, res) => {
  console.log("Coming to get all data000", req.query);
  const { page, limit } = req.query;

  getVenders(page, limit)
    .then((resp) => {
      console.log("RES", resp);
      res.status(200).send(resp);
    })
    .catch((err) => {
      return res.status(401).json({ error: err });
    });
});

route.post("/addVendor", async (req, res) => {
  // const {vendorName,address,country,state,email,phone,ownership,dateOfJoining,adminToken}=req.body;
  const vendorName = req.body.vendorName;
  const address = req.body.address;
  const country = req.body.country;
  const state = req.body.state;
  const email = req.body.email;
  const phone = req.body.phone;
  const ownership = req.body.ownership;
  const dateOfJoining = req.body.dateOfJoining;
  const addedBy = req.headers.admintoken;

  // const vendorData={
  //    vendorName,address,country,state,email,phone,ownership,dateOfJoining, addedBy:adminToken
  // }
  addVender({
    vendorName,
    address,
    country,
    state,
    email,
    phone,
    ownership,
    dateOfJoining,
    addedBy,
  })
    .then((response) => {
      return res.status(200).json({ response });
    })
    .catch((err) => {
      return res.status(401).json({ error: err });
    });
});

route.post("/addProduct", async (req, res) => {
  console.log("IN ADD PRD", req.body);

  // const {vendorName,address,country,state,email,phone,ownership,dateOfJoining,adminToken}=req.body;
  // const vendorName= req.body.vendorName;
  // const address=req.body.address;
  // const country= req.body.country;
  // const state=req.body.state;
  // const email=req.body.email;
  // const phone=req.body.phone;
  // const ownership=req.body.ownership;
  // const dateOfJoining=req.body.dateOfJoining;
  // const addedBy=req.headers.admintoken;

  const productName = req.body.productName;
  const productType = req.body.productType;
  const productDescription = req.body.productDescription;
  const productDetails = req.body.productDetails;
  const warrantyDuration = req.body.warrantyDuration;
  const sellerType = req.body.sellerType;
  const productBrand = req.body.productBrand;
  const productPrice = req.body.productPrice;
  const addedBy = req.headers.admintoken;

  addProduct({
    productName,
    productType,
    productDescription,
    productDetails,
    warrantyDuration,
    sellerType,
    productBrand,
    productPrice,
    addedBy,
  })
    .then((response) => {
      return res.status(200).json({ response });
    })
    .catch((err) => {
      return res.status(401).json({ error: err });
    });
});
route.get("/allProduct", (req, res) => {
  console.log("Coming to get all data000", req.query);
  const { page, limit } = req.query;

  getProducts(page, limit)
    .then((resp) => {
      console.log("RES", resp);
      res.status(200).send(resp);
    })
    .catch((err) => {
      return res.status(401).json({ error: err });
    });
});
route.get("/vendorList", (req, res) => {
  getVendersList()
    .then((resp) => {
      console.log("RES", resp);
      res.status(200).send(resp);
    })
    .catch((err) => {
      return res.status(401).json({ error: err });
    });
});

route.post("/disable/:id", (req, res) => {
  console.log("Disable");
});
route.post("/deactivate/:id", (req, res) => {
  console.log("deactivate");
});

module.exports = {
  adminRoute: route,
};
