const User = require('../models/user');
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

exports.signOut = (req,res) => {
    res.clearCookie("token");
    res.json({
        message : "signout",
    });
}

exports.SignUp = async (req,res) => {
    // DATA VALIDATION
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(422).json({ errors: errors.array() })

    const user = new User(req.body);
    try{
        await user.save((error) => {
            if(error) {
                return res.status(400).json({
                    error: "Not able to save user in DB"
                });
            }
        })
    } catch(err) {
        return res.status(400).json({
            error: err.message
        })
    }   
    return res.send({name: user.name, email: user.email, id: user._id})
}

exports.SignIn = (req,res) => {
    // DATA VALIDATION PART
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(422).json({ errors: errors.array() })

    const { email, password } = req.body;

    User.findOne({ email }, (error, instance) => {
        if(error || !instance) return res.status(400).json({error: "User not found"})
        if(!instance.authenticate(password)) {
            return res.status(400).json({error: "Email and password incorrect"})
        }
        // CREATE TOKEN
        const token = jwt.sign({_id: instance._id}, process.env.SECRET)
        // PUT TOKEN IN USER'S COOKIE
        res.cookie("token", token, { expire: new Date() + 9999 });
        const {_id, name, email, role, } = instance
        return res.json({token, user: { _id, name, email, role }})
    })

}

// PROTECTED CONTENT
exports.isSignedIn = expressJwt({ 
    secret: process.env.SECRET,
    userProperty: "auth",
    algorithms: ['HS256'],
})

// CUSTOM MIDDLEWARES
exports.isAuthenticated = (req,res,next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id
    if(!checker) {
        return res.status(403).json({
            error: "ACCESS DENIED"
        })
    }
    next()
}

exports.isAdmin = (req,res,next) => {
    if(req.profile.role == 0) {
        return res.status(403).json({"error": "NOT ADMIN. ACCESS DENIED"})
    }
    next()
}