import setRateLimit from "express-rate-limit";


const rate_limit_middleware = setRateLimit({
    windowMs: 60 * 1000,
    max: 2,
    message: { error: "you have exceeded the 2 requests per minute limit"},
    headers: true
});


export default rate_limit_middleware;
