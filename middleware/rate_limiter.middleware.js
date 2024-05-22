import setRateLimit from "express-rate-limit";


const rate_limit_middleware = setRateLimit({
    windowMs: 60 * 1000,
    max: process.env.NODE_ENV === "test" ? 65535 : 2,
    message: { error: "you have exceeded the 2 requests per minute limit"},
    headers: true
});


export default rate_limit_middleware;
