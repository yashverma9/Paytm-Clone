const express = require("express");

const cors = require("cors");

const indexRouter = require("./routes/index");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("hi");
});

app.use("/api/v1", indexRouter);

app.use((req, res, next) => {
    res.status(404).send("This route doesn't exist!");
});

app.use((err, req, res, next) => {
    res.status(500).send(`Internal server error : ${err}`);
});

app.listen(4000, () => {
    console.log("this is running!");
});
