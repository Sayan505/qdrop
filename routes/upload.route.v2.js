import express               from "express";

import rate_limit_middleware from "../middleware/rate_limiter.middleware.js"
import upload_controller_v2  from "../controllers/upload.controller.v2.js";


const router = express.Router();

router.post("/", rate_limit_middleware, upload_controller_v2);    // "/api/v2/upload" route is rate limited by IP


export default router;
