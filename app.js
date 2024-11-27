const express = require('express');
const app = express();
const cors = require("cors");
const { checkAuthentication } = require('./middleware/auth.middleware');
const { authRouter } = require('./routes/auth.route');
const { coachRouter } = require('./routes/coach.route');
const { clientRouter } = require('./routes/client.route');
const { adminRouter } = require('./routes/admin.route');


// define middlewares
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(checkAuthentication);


// define routers
app.use('/api/auth', authRouter);
app.use("/api",coachRouter);
app.use('/api',clientRouter);
app.use('/api', adminRouter);






app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

// Middleware to handle errors (both 404 and server errors).
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    });
});


module.exports = app