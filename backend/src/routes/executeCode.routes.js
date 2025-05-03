import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { executeCode } from "../controllers/executeCode.controllers.js";

const executionRoutes = express.Router();

executionRoutes("/", authMiddleware, executeCode);

export default executionRoutes;
