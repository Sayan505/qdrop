import express         from "express";

import file_controller from "../controllers/file.controller.js";


const router = express.Router();

router.get("/:uuid", file_controller);


export default router;
