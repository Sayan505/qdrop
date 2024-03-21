import express from "express";

import download_controller from "../controllers/download.controller.js";


const router = express.Router();

router.get("/:uuid", download_controller);


export default router;
