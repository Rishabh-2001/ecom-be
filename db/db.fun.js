// import db from "./firebaseConfig";
const admin = require("firebase-admin");
const db = require("./firebaseConfig");
// const {collection} require

async function ifUserAlreadyExist(email) {
  try {
    const citiesRef = db.collection("Auth");
    const snapshot = await citiesRef.where("email", "==", email).get();
    if (snapshot.empty) {
      console.log("No matching documents.");
      return { status: false };
    } else {
      return { status: true };
    }
  } catch (error) {
    console.log("Error while checking credentials.");
    return { error };
  }
}
async function addUser({ firstName, lastName, email, hash, userType }) {
  const { status, error } = await ifUserAlreadyExist(email);
  if (error) {
    throw error;
  } else {
    if (status) {
      throw { error: "User Already Exist" };
    } else {
      try {
        const batch = db.batch();
        const nycRef = db.collection("Auth").doc(); // Use .doc() to generate a new document ID
        batch.set(nycRef, { email, hash, userType }); // Use batch.set for adding a new document

        console.log("DID:", nycRef.id);

        const userData = {
          email,
          firstName,
          lastName,
          userType,
          id: nycRef.id,
        };
        let sfRef;
        if (userType === "CUSTOMER") {
          sfRef = db.collection("Users").doc(nycRef.id); // Use the same ID generated above
        } else {
          sfRef = db.collection("Admin").doc(nycRef.id);
        }
        batch.set(sfRef, userData);
        await batch.commit();
        return { data: "user added successfuly" };
      } catch (error) {
        console.error("Error:", error);
        throw error;
      }
    }
  }
}
async function verifyUser(userData) {
  console.log("DB:", userData);
  try {
    const citiesRef = db.collection("Auth");
    const snapshot = await citiesRef
      .where("email", "==", userData?.email)
      .where("userType", "==", userData?.userType)
      .get();
    if (snapshot.empty) {
      console.log("No matching documents.");
      throw { status: false, error: "User doesn't exist" };
    }
    let ress;
    snapshot.forEach((doc) => {
      // console.log(doc.id, '=>', doc.data());
      const dataWithId = { id: doc.id, data: doc.data() };
      console.log(">>>", dataWithId);
      ress = { status: true, payload: dataWithId };
    });
    return ress;
  } catch (error) {
    throw { error };
  }
}

async function checkAdmin(token) {
  console.log("Coming ot check , token", token);
  const cityRef = db.collection("Admin").doc(token);
  const doc = await cityRef.get();
  if (!doc.exists) {
    console.log("No Admin document!");
    return false;
  } else {
    console.log("Admin true");
    return true;
  }
}

async function getVendersList() {
  const finalRes = [];
  try {
    const citiesRef = db.collection("Vendors");
    const snapshot = await citiesRef.get();
    snapshot.forEach((doc) => {
      const formatData = {
        id: doc.id,
        vendorName: doc.data().vendorName,
      };
      finalRes.push(formatData);
    });
    console.log("RERERE", finalRes);
    return finalRes;
  } catch (error) {
    throw error;
  }
}

async function getAllOrders() {
  const finalRes = [];
  try {
    const citiesRef = db.collection("Orders");
    const snapshot = await citiesRef.get();
    snapshot.forEach((doc) => {
      const formatData = {
        id: doc.id,
        order: doc.data(),
      };
      finalRes.push(formatData);
    });
    console.log("RERERE", finalRes);
    return finalRes;
  } catch (error) {
    throw error;
  }
}
async function getCartItems({ addedBy }) {
  try {
    const citiesRef = db.collection("Users").doc(addedBy).collection("Cart");
    const snapshot = await citiesRef.get();

    // Use Promise.all to wait for all getProductDetails calls
    const productDetailsPromises = snapshot.docs.map(async (doc) => {
      const productData = await getProductDetails(doc.data().productId);
      return {
        id: doc.id,
        data: doc.data(),
        productData,
      };
    });

    const finalRes = await Promise.all(productDetailsPromises);
    console.log("CART", finalRes);
    return finalRes;
  } catch (error) {
    throw error;
  }
}

async function getOrderItems({ addedBy }) {
  try {
    const citiesRef = db.collection("Users").doc(addedBy).collection("Orders");
    const snapshot = await citiesRef.get();

    // Use Promise.all to wait for all getProductDetails calls
    const orderDetailsPromise = snapshot.docs.map(async (doc) => {
      const ordersData = await getOrdersDetails(doc.data().orderId);
      return {
        id: doc.id,
        data: doc.data(),
        ordersData,
      };
    });

    const finalRes = await Promise.all(orderDetailsPromise);
    console.log("ORDER", finalRes);
    return finalRes;
  } catch (error) {
    throw error;
  }
}

async function getUserProfile({userId}) {

  try {
    const cityRef = db.collection('Users').doc(userId);
    const doc = await cityRef.get();
    if (!doc.exists) {
      console.log('No such document!');
    } else {
      console.log('Document data:', doc.data());
      return {data: doc.data()};
    }
  } catch (error) {
    throw error;
  }
}

async function getOrdersDetails(id) {
  try {
    const cityRef = db.collection("Orders").doc(id);
    const doc = await cityRef.get();
    if (!doc.exists) {
      console.log("No such document!");
      return null;
    } else {
      console.log("Document data:", doc.data());
      return doc.data();
    }
  } catch (error) {
    console.error("Error fetching Order details:", error);
    throw error;
  }
}
async function getProductDetails(id) {
  try {
    const cityRef = db.collection("Products").doc(id);
    const doc = await cityRef.get();
    if (!doc.exists) {
      console.log("No such document!");
      return null;
    } else {
      console.log("Document data:", doc.data());
      return doc.data();
    }
  } catch (error) {
    console.error("Error fetching Order details:", error);
    throw error;
  }
}

async function addVender(vendorData) {
  console.log("V", vendorData);
  vendorData = {
    ...vendorData,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  // Add a new document with a generated id.
  try {
    const res = await db.collection("Vendors").add(vendorData);
    console.log("Added document with ID: ", res.id);
    return { data: res.id };
  } catch (error) {
    throw error;
  }
}
async function addProductToCart(cartData) {
  console.log("V", cartData);
  cartData = {
    ...cartData,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  // Add a new document with a generated id.
  try {
    const res = await db
      .collection("Users")
      .doc(cartData?.addedBy)
      .collection("Cart")
      .doc()
      .set(cartData);
    return {
      data: cartData,
    };
  } catch (error) {
    // console.log("ERRV<V<<", error);
    throw error;
  }
}

async function addToOrders(orderData) {
  console.log("V", orderData);
  orderData = {
    ...orderData,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  // Add a new document with a generated id.
  try {
    const batch = db.batch();
    const nycRef = db.collection("Orders").doc(); // Use .doc() to generate a new document ID
    batch.set(nycRef, orderData); // Use batch.set for adding a new document

    console.log("DID:", nycRef.id);

    const orderD = {
      orderId: nycRef.id,
    };
    const sfRef = db
      .collection("Users")
      .doc(orderData?.addedBy)
      .collection("Orders")
      .doc();
    batch.set(sfRef, orderD);
    await batch.commit();
    return { data: "user added successfuly" };
  } catch (error) {
    // console.log("ERRV<V<<", error);
    throw error;
  }
}

async function removeFromCart(cartData) {
  try {
    const userDocRef = db.collection("Users").doc(cartData?.addedBy);
    const cartQuerySnapshot = await userDocRef
      .collection("Cart")
      .where("productId", "==", cartData.productId) // Replace 'productId' with your actual field name and condition
      .get();

    // Iterate through matching documents and delete them
    cartQuerySnapshot.forEach(async (doc) => {
      await doc.ref.delete();
      console.log("Document successfully deleted!");
    });

    return {
      data: cartData,
    };
  } catch (error) {
    console.error("Error removing document: ", error);
    throw error;
  }
}

// async function getVenders(page,pageSize)
// {
//   console.log("getting ", page, pageSize);
//   // const {page}=page;
//   // const pageSize=page?.limit;
//   try {
//     const querySnapshot = await db.collection('Vendors') // Replace 'createdAt' with your actual field for ordering
//     .orderBy('country')
//       .startAfter((page - 1) * pageSize) // Calculate the starting point for the current page
//       .limit(pageSize)
//       .get();

//     const data = [];

//     querySnapshot.forEach((doc) => {
//       const docWithId={id: doc.id , data: doc.data()};
//       data.push(docWithId);
//     });
//     // console.log("SIZE:", querySnapshot.size());
//     const collectionRef = db.collection('Vendors');

//     // console.log(">D>FDS>", data);
//     let finalData={}
//     await collectionRef.get()
//   .then((snapshot) => {
//     // Get the count of documents
//     const documentCount = snapshot.size;
//     // console.log('Document count:', documentCount);
//      finalData={data, count: documentCount};

//   })
//   .catch((error) => {
//     console.error('Error getting documents:', error);
//   });
//   // console.log("FD", finalData);

// }catch(err){
//     console.log("ER:",err);
//     throw err;
//   }
// }
async function getVenders(page, pageSize) {
  console.log("getting ", page, pageSize);
  try {
    const lastDoc = await db
      .collection("Vendors")
      .orderBy("country")
      .limit((page - 1) * pageSize + 1) // Get the last document on the previous page
      .get()
      .then((snapshot) => {
        const docs = snapshot.docs;
        return docs[docs.length - 1];
      });

    const querySnapshot = await db
      .collection("Vendors")
      .orderBy("country")
      .startAfter(lastDoc)
      .limit(parseInt(pageSize))
      .get();

    const data = [];

    querySnapshot.forEach((doc) => {
      const docWithId = { id: doc.id, data: doc.data() };
      data.push(docWithId);
    });

    const collectionRef = db.collection("Vendors");
    const totalDocs = await collectionRef
      .get()
      .then((snapshot) => snapshot.size);

    const finalData = { data, count: totalDocs };

    return finalData;
  } catch (err) {
    console.log("ER:", err);
    throw err;
  }
}

async function deleteAllDocumentsInSubcollection(data) {
  try {
    const subcollectionRef = db
      .collection("Users")
      .doc(data?.addedBy)
      .collection("Cart");

    // Get all documents in the subcollection
    const querySnapshot = await subcollectionRef.get();

    // Delete each document
    querySnapshot.forEach(async (doc) => {
      await subcollectionRef.doc(doc.id).delete();
      console.log(`Document ${doc.id} deleted successfully.`);
    });

    console.log("All documents in subcollection deleted.");
  } catch (error) {
    console.error("Error deleting documents:", error);
  }
}

async function addProduct(productData) {
  console.log("V", productData);
  productData = {
    ...productData,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  // Add a new document with a generated id.
  try {
    const res = await db.collection("Products").add(productData);
    console.log("Added document with ID: ", res.id);
    return { data: res.id };
  } catch (error) {
    throw error;
  }
}

async function saveProducts() {
  fetch("https://fakestoreapi.com/products/")
    .then((res) => res.json())
    .then(async (json) => {
      const vendorNames = [
        "A8MysFc8DJ5vY8zDTVrb",
        "9Wm7PHKvvKvP7zq1a1ZC",
        "Sj4bjb1wUi7wVrTCHd7o",
        "oCBycpYTh9chhyiEbUvB",
        "wqB6VHDj769UiQRR7K1u",
        "y1KYxhEOv514Tx2nAb6C",
      ];

      const transformedData = json.map((item) => {
        const randomVendorName =
          vendorNames[Math.floor(Math.random() * vendorNames.length)];

        return {
          ...item,
          productName: item.title,
          productType: item.category,
          productDescription: item.description,
          productDetails: item.description.substring(0, 20), // Adjust the substring length as needed
          warrantyDuration: new Date().toISOString(), // You may need to adjust this based on your requirements
          sellerType: Math.random() < 0.5 ? "self" : "Vendor",
          productBrand: "Aspernatur ut obcaec", // You may replace this with actual data
          productPrice: item.price.toString(),
          vendorName: randomVendorName,
        };
      });
      console.log("JSSO:", json?.[0]);
      console.log("TPP:", transformedData?.[0]);
      transformedData.map(async (t) => {
        await addProduct(t);
      });
    });
}
// saveProducts();

async function getProducts(page, pageSize) {
  console.log("getting ", page, pageSize);
  try {
    const lastDoc = await db
      .collection("Products")
      .orderBy("productType")
      .limit((page - 1) * pageSize + 1) // Get the last document on the previous page
      .get()
      .then((snapshot) => {
        const docs = snapshot.docs;
        return docs[docs.length - 1];
      });

    const querySnapshot = await db
      .collection("Products")
      .orderBy("productType")
      .startAfter(lastDoc)
      .limit(parseInt(pageSize))
      .get();

    const data = [];

    querySnapshot.forEach((doc) => {
      const docWithId = { id: doc.id, data: doc.data() };
      data.push(docWithId);
    });

    const collectionRef = db.collection("Products");
    const totalDocs = await collectionRef
      .get()
      .then((snapshot) => snapshot.size);

    const finalData = { data, count: totalDocs };

    return finalData;
  } catch (err) {
    console.log("ER:", err);
    throw err;
  }
}


// getVenders(1,10)
// AddUser();
// check login
// add user
// get product

// search product

// get orders
//get user data
//get vender list in add product
//
//get venders data
// crud venders
//crud products

//{{{ cart data}}}
// handled by redux FE

//{{{{{buy data}}}}}
// user transaction btch write
// amount acacl
// link with product and vneder
// update orer db

//{{{{{{reports generate }}}}}}
// # items sold in last 1 month
// items sold by self and by vendor
// total transaction done
// what type of product is mostly sold
// sold / order as pwer each vender

module.exports = {
  addUser,
  getCartItems,
  removeFromCart,
  getOrderItems,
  deleteAllDocumentsInSubcollection,
  addToOrders,
  verifyUser,
  checkAdmin,
  addVender,
  addProduct,
  getProducts,
  addProductToCart,
  getVenders,
  getVendersList,
  getUserProfile,
  getAllOrders,
};
