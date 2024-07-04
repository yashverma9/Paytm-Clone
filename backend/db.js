const mongoose = require("mongoose");
const { Schema } = require("zod");

mongoose.connect(
    "mongodb+srv://admin:cLjxVhv9QJtclu41@cluster0.3ak084w.mongodb.net/paytm"
);

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50,
    },
});

const User = mongoose.model("User", userSchema);

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User",
    },
    balance: {
        type: Number,
        required: true,
    },
});

const Account = new mongoose.model("Account", accountSchema);

module.exports = { User, Account };
