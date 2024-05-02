import express             from "express";

import file_controller     from "../controllers/file.controller.js";
import download_controller from "../controllers/download.controller.js";


const router = express.Router();

router.get("/:uuid",          file_controller);
router.get("/download/:uuid", download_controller);


export default router;
