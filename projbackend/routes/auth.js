const express = require("express");
const authController = require("../controllers/auth");
const router = express.Router();
const { check } = require("express-validator")

router.post('/signin',
    [
        check('email').isEmail().withMessage("Please specify valid email"),
        check('password').exists().withMessage("Please enter password")
    ],
    authController.SignIn
)

router.post('/signup',[
    check('name').isLength({ min: 3 }).withMessage("Must be atleast 3 characters"),
    check('email').isEmail().withMessage("Please specify valid email")
],authController.SignUp);

router.get('/signout',authController.signOut);

router.get('/test', authController.isSignedIn, (req, res) => {
    return res.send(req.auth)
});

module.exports = router;