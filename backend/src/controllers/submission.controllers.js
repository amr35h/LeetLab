import { db } from "../db/index.js";

export const getAllSubmission = async (req, res) => {
  try {
    const userId = req.user.id;

    const submissions = await db.submission.findMany({
      where: {
        userId: userId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Submissions fetched Successfully",
      submissions,
    });
  } catch (error) {
    console.error("Fetch Submission Error:", error);
    res.status(500).json({ message: "Failed to fetch Submissions" });
  }
};

export const getAllSubmissionForProblem = async (req, res) => {
  try {
    const userId = req.user.id;
    const problemId = req.params.problemId;
    const submissions = await db.submission.findMany({
      where: {
        userId: userId,
        problemId: problemId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Submissions Fetched Successfully",
      submissions,
    });
  } catch (error) {
    console.error("Fetch Submission Error:", error);
    res.status(500).json({ message: "Failed to fetch Submissions" });
  }
};

export const getAllTheSubmissionsForProblem = async (req, res) => {
  try {
    const problemId = req.params.problemId;
    const submission = await db.submission.count({
      where: {
        problemId: problemId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Submission Count Fetched Successfully",
      count: submission,
    });
  } catch (error) {
    console.error("Fetch Submission Error:", error);
    res.status(500).json({ message: "Failed to fetch Submissions" });
  }
};
