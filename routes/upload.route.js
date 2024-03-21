import express from "express";

import upload_controller from "../controllers/upload.controller.js";


const router = express.Router();

router.post("/", upload_controller);


export default router;
