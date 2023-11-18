const { checkAdmin } = require("../db/db.fun");

const verifiedAdmins = {};

const isAdmin = async (req, res, next) => {
  // const {userType, adminToken} = req.body; // Assuming user information is available on the request
  const userType = req.headers.usertype;
  const adminToken = req.headers.admintoken;

  if (userType === 'ADMIN') {
    // If the user is an admin, check the cache
    if (verifiedAdmins[adminToken]) {
      console.log("Verified (from cache)");
      next();
    } else {
      // If not in the cache, check the database
      try {
        const isAdminVerified = await checkAdmin(adminToken);
       
        if (isAdminVerified) {
          // Save to cache
          verifiedAdmins[adminToken] = true;
          console.log("Verified (from database)");
          next();
        } else {
          res.status(403).send('Forbidden');
        }
      } catch (error) {
        console.error("Error checking admin:", error);
        res.status(500).send('Internal Server Error');
      }
    }
  } else {
    // If the user is not an admin, send a forbidden response or redirect
    res.status(403).send('Forbidden');
  }
};

module.exports = isAdmin;

