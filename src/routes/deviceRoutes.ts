// src/routes/deviceRoutes.ts
import express from "express";
import { registerDevice } from "../controllers/deviceController";


const router = express.Router();

// Register device
router.post("/register", registerDevice);


export default router;
