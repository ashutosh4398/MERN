const mongoose = require("mongoose");
const { createHmac } = require("crypto");
const { v1: uuidv1 } = require("uuid");

// DEFINING USER SCHEMA
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 32, trim: true },
    lastName: { type: String, required: false, maxlength: 32, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    encryPassword: { type: String, required: true },
    salt: String,
    role: { 
        type: Number, // the higher the number, more access
        default: 0,
    },
    purchases: { type: Array, default: [] },
    userInfo: { type: String, trim: true }
},{timestamps: true});

// DEFINING METHODS
userSchema.methods = {
    authenticate: function(plainPassword){
        // PASSWORD MATCHING STUFF
        return this.securePassword(plainPassword) === this.encryPassword;
    },
    securePassword: function(plainPassword) {
        // returns encrypted password
        if(!plainPassword) return "";
        try {
            return createHmac('sha256',this.salt)
                        .update(plainPassword)
                        .digest('hex');
        } catch(err) {
            console.log(err);
            return "";
        }
    }
}

// DEFINING USER SCHEMA
userSchema.virtual('password')
    .set(function(password){
        this._password = password
        this.salt = uuidv1()
        this.encryPassword = this.securePassword(this._password);
    })
    .get(function() {
        return this._password
    })

module.exports = mongoose.model("User", userSchema);