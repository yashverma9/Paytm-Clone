const express = require("express");
const { User } = require("../db");
const zod = require("zod");
const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../config");

const router = express.Router();

const validateInputs = (req, res, next) => {
    const input = req.body;
    const inputSchema = zod.object({
        username: zod.string().email(),
        password: zod.string().min(6),
        lastName: zod.string().min(1),
        lastName: zod.string().min(1),
    });

    const resp = inputSchema.safeParse(input);
    if (resp.success) next();
    else
        res.status(411).json({
            message: "Email already taken / Incorrect inputs",
        });
};

const doesUserExist = async (req, res, next) => {
    const resp = await User.findOne({
        username: req.body.username,
    });
    if (!!resp)
        res.status(411).json({
            message: "Email already taken / Incorrect inputs",
        });
    else next();
};

router.post("/signup", validateInputs, doesUserExist, async (req, res) => {
    const user = new User({
        ...req.body,
    });

    const userResp = await user.save();
    const userId = userResp._id;
    console.log("userId:", typeof userId);

    const jwtToken = jwt.sign({ userId: userId }, JWT_SECRET);
    res.status(200).json({
        message: "User created successfully",
        token: jwtToken,
    });
});

module.exports = router;
