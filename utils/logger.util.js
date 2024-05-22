import pino        from "pino";

import pino_config from "../config/pino.config.js";


const logger = pino(pino_config);


export default logger;
