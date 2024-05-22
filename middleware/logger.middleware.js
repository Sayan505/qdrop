import logger from "../utils/logger.util.js";


function logger_middleware(req, res, next) {
    logger.info({
        route: req.path,
        method: req.method
    }, `Request Received from ${req.ip
                                || req.connection.remoteAddress
                                || req.socket.remoteAddress
                                || req.connection.socket.remoteAddress}`);

    next();
}


export default logger_middleware;
