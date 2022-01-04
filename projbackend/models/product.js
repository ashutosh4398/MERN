const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, maxlength: 40 },
    description: { type: String, maxlength: 2000 },
    price: { type: Number, required: true },
    // HAVING CATEGORIES
    category: { type: ObjectId, ref: "Category", required: true },
    stock: { type: Number },
    soldUnit: { type: Number, default: 0 },
    photo: {
        data: Buffer,
        contentType: String,
    }
}, {timestamps: true});

module.exports = mongoose.model("Product", productSchema);