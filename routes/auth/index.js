const route=require('express').Router();
const bcrypt = require("bcryptjs");
const { addUser, verifyUser } = require('../../db/db.fun');

route.post("/register", (req, res) => {
    console.log("Coming to post data register");
    console.log("data:", req.body);
    // const { firstName,lastName, email, password, password_confirm } = req.body
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
    let password = req.body.password;
    let userType= req.body.userType;
    // let hashedPassword = await bcrypt.hash(password, 8)
  
    if (password.length <= 6) {
      console.log("less password length");
      return res
        .status(400)
        .json({ error: "password length must be greater than 6 chanracters" });
      // return res.sendStatus(401).json({ data: "password length must be greater than 6 chanracters" });
    } else {
      // const hashedPassword=  getHashedPassword(password);
      bcrypt.genSalt(8, function (err, salt) {
        if (err) {
          throw err;
        } else {
          bcrypt.hash(password, salt, function (err, hash) {
            if (err) {
              throw err;
            } else {
            //   console.log(hash);
  
              // const dataToQr = email + " " + hash;
  
              // QRCode.toFile(
              //   "./file.png",
              //   dataToQr,
              //   {
              //     errorCorrectionLevel: "H",
              //   },
              //   function (er) {
              //     if (er) {
              //       console.log("error in qr", er);
              //       return er;
              //     }
              //     console.log("QR code saved!");
              //     readQR()
              //   }
              // );
              //here just photo is made
  
              addUser({ firstName, lastName, email, hash, userType })
                .then((response) => {
                  console.log("RES CREATED USER:", response);
                  // sendMailFn(email)
                  return res.sendStatus(200, response.data);
                })
                .catch((err) => {
                  console.log("ERROR in database:", err);
                  return res.status(405).json({ error: err?.error });
                });
            }
          });
        }
      });
    }
  });

  route.post("/login", (req, res) => {
    console.log("Coming in login post server");
    const { email, password, userType } = req.body;
    console.log("login post server data:", email, password);
    verifyUser({ email, password, userType })
      .then((response) => {
        console.log("success:::", response);
        bcrypt.compare(password, response.payload.data?.hash, function (err, resp) {
          if (err) {
            console.log("ERR:", err);
            return res.status(401).json({ error: err });
          }
          if (resp) {
         
            // if(response.isVerified===true)
            // {
            //   console.log("Verified account");
            //   // const token = jwt.sign(response, SECRET_KEY, { expiresIn: '2h' });
            //   return res.status(200).json( response );
            // }
            // else if(response.isVerified===false)
            // {
            //   console.log("NOTTT Verified account");
            //   return res.status(405).json({error: "Verify Your Accoount"})
            // }
            return res.status(200).json( {id:response?.payload?.id, userType: response?.payload?.data?.userType, email: response?.payload?.data?.email} );
          } else {
               return res.status(401).json({ error: "password dont match" });
          }
        });
      })
      .catch((err) => {
        console.log("ERROR:", err);
        return res.status(401).json({ error: err?.error });
      });
  });


module.exports={
    authRoute:route
}