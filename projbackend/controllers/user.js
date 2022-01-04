const User = require("../models/user");

// KIND OF MIDDLEWARE 
exports.getUserById = (req,res,next,id) => {
    User.findById(id).exec((error, instance) => {
        if(error || !instance) {
            return res.status(400).json({
                error: "No user was found in DB"
            })
        }
        req.profile = instance
        req.profile.salt=undefined
        req.profile.encry_password=undefined
        req.profile.createdAt = undefined
        req.profile.updatedAt = undefined
        next()
    })
}

exports.getUser = (req,res) => {
    // req.profile is set by middleware
    return res.json(req.profile);
}