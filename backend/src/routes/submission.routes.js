import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  getAllSubmission,
  getAllSubmissionForProblem,
  getAllTheSubmissionsForProblem,
} from "../controllers/submission.controllers.js";

const submissionRoutes = express.Router();

submissionRoutes.get("/get-all-submissions", authMiddleware, getAllSubmission);
submissionRoutes.get(
  "/get-submission/:problemId",
  authMiddleware,
  getAllSubmissionForProblem,
);

submissionRoutes.get(
  "/get-submissions-count/:problemId",
  authMiddleware,
  getAllTheSubmissionsForProblem,
);

export default submissionRoutes;
