import express from "express";

import rate_limit_middleware from "../config/rate_limiter.config.js";
import upload_controller from "../controllers/upload.controller.js";


const router = express.Router();

router.post("/", rate_limit_middleware, upload_controller);


export default router;
