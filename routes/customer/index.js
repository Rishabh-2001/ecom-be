const {
  addVender,
  getVenders,
  addProduct,
  getProducts,
  getVendersList,
  addProductToCart,
  getCartItems,
  removeFromCart,
  addToOrders,
  deleteAllDocumentsInSubcollection,
  getOrderItems,
  getUserProfile,
} = require("../../db/db.fun");

const route = require("express").Router();

route.post("/addToCart", async (req, res) => {
  const vendorId = req.body.vendorId;
  const productId = req.body.productId;
  const addedBy = req.headers.usertoken;
  const quantity = req.body.quantity;

  addProductToCart({ vendorId, productId, addedBy, quantity })
    .then((response) => {
      console.log("From sercer ", response);
      return res.status(200).send("Success");
    })
    .catch((err) => {
      return res.status(401).json({ error: err });
    });
});
route.post("/removeFromCart", async (req, res) => {
  const productId = req.body.productId;
  const addedBy = req.headers.usertoken;

  removeFromCart({ productId, addedBy })
    .then((response) => {
      console.log("From sercer ", response);
      return res.status(200).send("Successfuly deleted");
    })
    .catch((err) => {
      return res.status(401).json({ error: err });
    });
});

// route.post('/addProduct', async (req,res)=>{
//      console.log("IN ADD PRD", req.body);

//     // const {vendorName,address,country,state,email,phone,ownership,dateOfJoining,adminToken}=req.body;
//     // const vendorName= req.body.vendorName;
//     // const address=req.body.address;
//     // const country= req.body.country;
//     // const state=req.body.state;
//     // const email=req.body.email;
//     // const phone=req.body.phone;
//     // const ownership=req.body.ownership;
//     // const dateOfJoining=req.body.dateOfJoining;
//     // const addedBy=req.headers.admintoken;

//    const productName= req.body.productName;
//    const productType=  req.body.productType;
//    const productDescription=  req.body.productDescription;
//    const productDetails=  req.body.productDetails;
//    const warrantyDuration= req.body.warrantyDuration;
//    const sellerType=   req.body.sellerType;
//    const productBrand=   req.body.productBrand
//    const productPrice=  req.body.productPrice;
//    const addedBy=req.headers.admintoken;

//     addProduct({productName,productType,productDescription,productDetails,warrantyDuration,sellerType,productBrand,productPrice,addedBy})
//     .then(response=> {
//         return res.status(200).json({response});
//     })
//     .catch(err=>{
//         return res.status(401).json({ error: err });
//     })

// })
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

// route.post()
route.get("/getCart", (req, res) => {
  const addedBy = req.headers.usertoken;
  console.log("Coming to get cart");
  getCartItems({ addedBy })
    .then((resp) => {
      console.log("RES CART", resp);
      res.status(200).send(resp);
    })
    .catch((err) => {
      return res.status(401).json({ error: err });
    });
});

route.post("/addOrder", async (req, res) => {
  console.log(">>", req.body, req.headers);

  const addedBy = req.headers.usertoken;
  const orderData = {
    order: req.body,
    addedBy: addedBy,
  };
  addToOrders(orderData)
    .then((response) => {
      console.log("From sercer ", response);
      return res.status(200).send("Success");
    })
    .catch((err) => {
      return res.status(401).json({ error: err });
    });
});
route.post("/removeAllCart", async (req, res) => {
  const addedBy = req.headers.usertoken;

  deleteAllDocumentsInSubcollection({ addedBy })
    .then((response) => {
      console.log("From sercer ", response);
      return res.status(200).send("Successfuly deleted");
    })
    .catch((err) => {
      return res.status(401).json({ error: err });
    });
});

route.get("/getOrders", (req, res) => {
  const addedBy = req.headers.usertoken;
  getOrderItems({ addedBy })
    .then((resp) => {
      console.log("RES", resp);
      res.status(200).send(resp);
    })
    .catch((err) => {
      return res.status(401).json({ error: err });
    });
});


route.get("/getProfile", (req, res) => {
    const userId = req.headers.usertoken;
    getUserProfile({ userId })
      .then((resp) => {
        console.log("RES", resp);
        res.status(200).send(resp);
      })
      .catch((err) => {
        return res.status(401).json({ error: err });
      });
  });
// route.post('/disable/:id', (req,res)=>{
//     console.log("Disable");
// })
// route.post('/deactivate/:id', (req,res)=>{
//     console.log("deactivate");
// })

module.exports = {
  customerRoute: route,
};
