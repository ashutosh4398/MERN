const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const authController = require("../controllers/auth");

// defining something like middleware
// whenever userId is passed 
router.param("userId", userController.getUserById);
router.get("/user/:userId",authController.isSignedIn,authController.isAuthenticated,userController.getUser);


module.exports = router;