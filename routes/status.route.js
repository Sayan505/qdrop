import express from "express";

import status_controller     from "../controllers/status.controller.js";


const router = express.Router();

router.get("/", status_controller);


export default router;
