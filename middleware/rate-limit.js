const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 60 * 1000, 
    max: 500, 
    message: JSON.stringify("Too many requests from this IP, please try again later"),
    headers: true,  
});

module.exports = limiter;
