// src/routes/downloadRoutes.ts
import express from "express";
import { getDownloadList } from "../controllers/downloadController";
import { authMiddleware } from "../middleware/authMiddleware";
import { checkSync } from "../controllers/downloadController";

const router = express.Router();

/**
 * @swagger
 * /api/media/sync:
 *   post:
 *     summary: Sync device schedules
 *     tags: [Media]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               owned_schedule_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Sync result
 */

// Sync check
router.post("/sync", authMiddleware, checkSync);

/**
 * @swagger
 * /api/media/list:
 *   get:
 *     summary: Get download list by schedule IDs
 *     tags: [Media]
 *     parameters:
 *       - in: query
 *         name: schedule_ids
 *         schema:
 *           type: string
 *         required: true
 *         description: Comma separated schedule IDs
 *     responses:
 *       200:
 *         description: Download list
 */

// Download 
router.get("/list", authMiddleware, getDownloadList);

export default router;
