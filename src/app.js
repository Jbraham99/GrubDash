const express = require("express");
const cors = require("cors");

const errorHandler = require("./errors/errorHandler");
const notFound = require("./errors/notFound");
const ordersRouter = require("./orders/orders.router");
const dishesRouter = require("./dishes/dishes.router");

const app = express();


// You have not learned about CORS yet.
// The following line let's this API be used by any website.
app.use(cors());
app.use(express.json());

app.use("/dishes", dishesRouter);
app.use("/orders", ordersRouter);

app.use((req, res, next) => {
    next({
        status: 404,
        message: `path not found: ${req.path}`
    })
});

app.use((error, req, res, next) => {
    const {status = 500, message = "Something went wrong!"} = error;
    res.status(status).send({error: message})
});

module.exports = app;
