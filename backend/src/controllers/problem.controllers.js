import { db } from "../db/index.js";

export const createProblem = async (req, res) => {
  //going to call all the data from the request body
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  //going to check user role once again
  if (req.user.role !== "ADMIN") {
    return res
      .status(403)
      .json({ message: "You are not allowed to create a Problem" });
  }

  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);

      if (!languageId) {
        return res
          .status(400)
          .json({ message: `Language ${language} is not supported` });
      }

      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submissions);

      const tokens = submissionResults.map((res) => res.token);

      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        console.log("Result ---- ", result);

        if (result.status.id !== 3) {
          return res.status(400).json({
            message: `Testcase ${i + 1} failed for language ${language}`,
          });
        }
      }
    }

    //save the problem in database
    const newProblem = await db.problem.create({
      data: {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testcases,
        codeSnippets,
        referenceSolutions,
        userId: req.user.id,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Problem Created Successfully",
      problem: newProblem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error While Creating Problem",
    });
  }

  //loop through each refrenece solution for different languages
  //
};

export const getAllProblems = async (req, res) => {
  try {
    const problems = await db.problem.findMany();

    if (!problems) {
      return res.status(404).json({
        message: "No Problem Found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Problem Fetched Successfully",
      problems,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error While Fetching Problem",
    });
  }
};

export const getProblemById = async (req, res) => {
  const { id } = req.params;

  try {
    const problem = await db.problem.findUnique({
      where: {
        id,
      },
    });

    if (!problem) {
      return res.status(404).json({
        message: "No Problem Found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Problem Fetch Successfully by ID",
      problem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error While Fetching Problem by ID",
    });
  }
};

export const updateProblem = async (req, res) => {
  //get data from body
  //get id & find problem exist or not
  //loop for all langs
  //update query with id
  //same like create
  //put request
};

export const deleteProblem = async (req, res) => {
  const { id } = req.params;

  try {
    const problem = await db.problem.findUnique({
      where: { id },
    });

    if (!problem) {
      return res.status(404).json({
        message: "Problem Not Found",
      });
    }

    await db.problem.delete({ where: { id } });

    return res.status(200).json({
      success: true,
      message: "Problem deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error While deleting Problem",
    });
  }
};

export const getAllProblemsSolvedByUser = async (req, res) => {};
