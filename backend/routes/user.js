const express = require("express");
const { User, Account } = require("../db");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware");
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

    const randomBalance = Math.floor(Math.random() * 10000) + 1;

    await Account.create({ userId: userId, balance: randomBalance });

    res.status(200).json({
        message: "User created successfully",
        token: jwtToken,
    });
});

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string(),
});

router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs",
        });
    }
    const username = req.body.username;
    const password = req.body.password;
    const user = await User.findOne({
        username: username,
        password: password,
    });

    if (!!user) {
        console.log("userId:", user._);
        const jwtToken = jwt.sign({ userId: user._id }, JWT_SECRET);
        res.status(200).json({ token: jwtToken });
    } else res.status(411).send("Error while logging in");
});

const updateBodySchema = zod
    .object({
        password: zod.string().min(6).optional(),
        firstName: zod.string().optional(),
        lastName: zod.string().optional(),
    })
    .refine(
        ({ firstName, lastName, password }) =>
            firstName !== undefined ||
            lastName !== undefined ||
            password !== undefined,
        { message: "One of the fields must be defined" }
    );

router.post("/", authMiddleware, async (req, res) => {
    const userId = req.userId;
    console.log("UserId:", userId);
    const updateBody = req.body;

    const { success } = updateBodySchema.safeParse(updateBody);
    if (success) {
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            updateBody,
            {
                new: true,
            }
        );
        console.log("updatedUser:", updatedUser);
        res.status(200).json({ message: "Updated successfully" });
    } else res.status(411).json({ message: "Errr while updating information" });
});

router.get("/bulk", authMiddleware, async (req, res) => {
    const filterString = req.query.filter || "";

    // const allUsers = await User.find({});

    // const filterUsers = allUsers.filter(
    //     (user) =>
    //         user.firstName.includes(filterString) ||
    //         user.lastName.includes(filterString)
    // );

    const filterUsers = await User.find({
        $or: [
            {
                firstName: {
                    $regex: filterString,
                },
            },
            {
                lastName: {
                    $regex: filterString,
                },
            },
        ],
    });

    res.status(200).json({
        users: filterUsers.map((user) => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id,
        })),
    });
});

module.exports = router;
