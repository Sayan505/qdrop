import logger from "../config/pino.config.js"


function logger_middleware(req, res, next) {
    logger.info({
        route: req.path,
        method: req.method
    }, "Request Received");

    next();
}


export default logger_middleware;
