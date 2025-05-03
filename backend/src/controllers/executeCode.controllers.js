import { pollBatchResults, submitBatch } from "../utils/judge0.util.js";

export const executeCode = async (req, res) => {
  try {
    const { source_code, language_id, stdin, expected_outputs, problemId } =
      req.body;

    const userId = req.user.id;

    //Validate testcases
    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_outputs) ||
      expected_outputs.length !== stdin.length
    ) {
      return res.status(400).json({ message: "Invalid or Missing Test Cases" });
    }

    //Prepare each test case for batch submission
    const submissions = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
    }));

    //send batch of submissions to judeg0
    const submitResponse = await submitBatch(submissions);

    const tokens = submitResponse.map((res) => res.token);

    //Poll judge0 for results of all submitted test cases
    const results = await pollBatchResults(tokens);

    console.log("Result: ", results);

    return res.status(200).json({ message: "Code Executed" });
  } catch (error) {}
};
