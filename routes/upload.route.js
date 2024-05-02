import express from "express";

import rate_limit_middleware from "../middleware/rate_limiter.middleware.js"
import upload_controller     from "../controllers/upload.controller.js";


const router = express.Router();

router.post("/", rate_limit_middleware, upload_controller);    // "/api/upload" route is rate limited by IP


export default router;
