const express = require("express");
const { User } = require("./db");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("hi");
});

app.use((req, res, next) => {
    res.status(404).send("This route doesn't exist!");
});

app.use((err, req, res, next) => {
    res.status(500).send(`Internal server error : ${err}`);
});

app.listen(4000, () => {
    console.log("this is running!");
});
