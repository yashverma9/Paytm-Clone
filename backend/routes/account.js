const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware");
const { Account, User } = require("../db");
const zod = require("zod");
const { default: mongoose } = require("mongoose");

router.get("/balance", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const accountDetails = await Account.findOne({ userId: userId });
    console.log("accountDets: ", accountDetails);
    if (accountDetails)
        res.status(200).json({ balance: accountDetails.balance });
    else res.status(411).json({ message: "Error processing balance" });
});

const transferInputBody = zod.object({
    to: zod.string(),
    amount: zod.number(),
});

// Bad method without Transactions: Can lead to inconsistencies

// router.post("/transfer", authMiddleware, async (req, res) => {
//     const payeeId = req.userId;
//     const { success } = transferInputBody.safeParse(req.body);
//     if (success) {
//         const recepUsername = req.body.to;

//         const recepDetails = await User.findOne({ username: recepUsername });
//         const recepId = recepDetails._id;

//         const amount = req.body.amount;

//         const payeeAccount = await Account.findOne({ userId: payeeId });
//         if (payeeAccount.balance < amount)
//             return res.status(400).json({ message: "Insufficient balance" });

//         const recepAccount = await Account.findOne({ userId: recepId });
//         if (!recepAccount)
//             return res.status(400).json({ message: "Invalid account" });

//         try {
//             await Account.findOneAndUpdate(
//                 { userId: payeeId },
//                 { $inc: { balance: -amount } },
//                 { new: true }
//             );
//             await Account.findOneAndUpdate(
//                 { userId: recepId },
//                 { $inc: { balance: amount } },
//                 { new: true }
//             );
//             return res.status(200).json({ message: "Transfer successful" });
//         } catch (err) {
//             return res
//                 .status(500)
//                 .json({ message: `Error processing request ${err}` });
//         }
//     } else res.status(411).send("Error processing request due to inputs");
// });

// Better method using transaction- Makes sure data integrity
router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    const payeeId = req.userId;
    const { success } = transferInputBody.safeParse(req.body);

    if (success) {
        const recepUsername = req.body.to;

        const recepDetails = await User.findOne({
            username: recepUsername,
        }).session(session);
        const recepId = recepDetails._id;

        const amount = req.body.amount;

        const payeeAccount = await Account.findOne({ userId: payeeId }).session(
            session
        );
        if (!payeeAccount || payeeAccount.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Insufficient balance" });
        }

        const recepAccount = await Account.findOne({ userId: recepId }).session(
            session
        );
        if (!recepAccount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Invalid account" });
        }

        try {
            await Account.findOneAndUpdate(
                { userId: payeeId },
                { $inc: { balance: -amount } },
                { new: true }
            ).session(session);
            await Account.findOneAndUpdate(
                { userId: recepId },
                { $inc: { balance: amount } },
                { new: true }
            ).session(session);

            await session.commitTransaction();
            return res.status(200).json({ message: "Transfer successful" });
        } catch (err) {
            await session.abortTransaction();
            return res
                .status(500)
                .json({ message: `Error processing request ${err}` });
        }
    } else {
        await session.abortTransaction();
        res.status(411).json({
            message: "Error processing request due to inputs",
        });
    }
});

module.exports = router;
