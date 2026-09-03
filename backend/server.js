import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5001;

app.use(cors());

app.use(express.json());

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.get("/", (req, res) => {
    res.json({
        message: "RoleReady backend is running"
    });
});

app.post(
    "/api/generate-assessment",
    async (req, res) => {
        try {
            const {
                courses,
                previousQuestions
            } = req.body;


            if (!courses || courses.length === 0) {
                return res.status(400).json({
                    error: "No courses provided"
                });
            }


            const courseContext = courses
                .map(
                    (course) => `


Course: ${course.title}
Domain: ${course.domain}
Level: ${course.level}
Topics: ${course.topics?.join(", ") ||
                        course.domain
                        }
`
                )
                .join("\n");


            const previousQuestionContext =
                previousQuestions &&
                    previousQuestions.length > 0
                    ? previousQuestions
                        .map(
                            (item) =>
                                `- ${item.question}`
                        )
                        .join("\n")
                    : "No previous questions provided.";


            const prompt = `


You are generating a course verification assessment for a professional upskilling platform.

The user has completed the following learning resources:

${courseContext}

These questions were already asked in the initial assessment:

${previousQuestionContext}

Generate exactly 9 NEW multiple-choice questions based on the provided courses.

IMPORTANT DOMAIN DISTRIBUTION:

* Identify ALL unique domains present in the provided courses.
* Distribute the 9 questions as evenly as possible across these domains.
* Every domain must be represented.
* Do not focus heavily on only one domain.
* Base questions specifically on the topics listed for each course.
* Match the difficulty of each question to the course level.

PREVIOUS QUESTION RULES:

* Do NOT repeat any previous question.
* Do NOT ask the same concept with slightly different wording.
* Focus on concepts not already tested where possible.

Return ONLY valid JSON in exactly this structure:

{
"questions": [
{
"question": "Question text",
"domain": "Course domain",
"options": [
"Option A",
"Option B",
"Option C",
"Option D"
],
"correctAnswer": 0
}
]
}

STRICT RULES:

* Generate exactly 9 questions.
* Every question must have exactly 4 options.
* Only one option can be correct.
* correctAnswer must be 0, 1, 2, or 3.
* The domain must match one of the provided course domains.
* Do not include markdown.
* Do not include explanations.
* Return only valid JSON.
  `;


            const response =
                await ai.models.generateContent({
                    model:
                        "gemini-3.5-flash-lite",
                    contents: prompt
                });


            const responseText = response.text;

            const jsonStart = responseText.indexOf("{");
            const jsonEnd = responseText.lastIndexOf("}");

            if (jsonStart === -1 || jsonEnd === -1) {
                throw new Error("Gemini did not return valid JSON");
            }

            const cleanedText = responseText
                .slice(jsonStart, jsonEnd + 1)
                .trim();

            const assessment = JSON.parse(cleanedText);


            res.json(assessment);


        } catch (error) {
            console.error(
                "Gemini API error:",
                error
            );

            res.status(500).json({
                error:
                    "Failed to generate assessment"
            });
        }


    }
);

app.listen(PORT, () => {
    console.log(
        `Server running on port ${PORT}`
    );
});
