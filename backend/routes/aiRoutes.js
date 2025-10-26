import express from "express";
import { handleAIQuery } from "../controllers/aiController.js";

const router = express.Router();

router.post("/query", handleAIQuery);

export default router;
