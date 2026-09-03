import {
useEffect,
useState,
} from "react";

import {
useNavigate,
} from "react-router-dom";

import { updateCompetency } from "../../utils/competency";

import "./courseAssessment.css";

function CourseAssessment() {
const navigate = useNavigate();

const [questions, setQuestions] =
useState([]);

const [
currentQuestion,
setCurrentQuestion,
] = useState(0);

const [
selectedAnswer,
setSelectedAnswer,
] = useState(null);

const [score, setScore] =
useState(0);

const [answers, setAnswers] =
useState([]);

const [loading, setLoading] =
useState(true);

const [error, setError] =
useState("");

const [showResult, setShowResult] =
useState(false);

useEffect(() => {
const startedCourses =
JSON.parse(
localStorage.getItem(
"startedCourses"
)
) || [];


const initialAssessment =
  JSON.parse(
    localStorage.getItem(
      "assessmentData"
    )
  );

if (startedCourses.length === 0) {
  navigate("/recommendations");
  return;
}

const generateAssessment =
  async () => {
    try {
      const response =
        await fetch(
          "http://localhost:5001/api/generate-assessment",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              courses:
                startedCourses,

              previousQuestions:
                initialAssessment?.askedQuestions ||
                [],
            }),
          }
        );

      if (!response.ok) {
        throw new Error(
          "Could not generate assessment"
        );
      }

      const data =
        await response.json();

      setQuestions(
        data.questions
      );
    } catch {
      setError(
        "Unable to generate your assessment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

generateAssessment();


}, [navigate]);

const handleNext = () => {
if (
selectedAnswer === null
) {
return;
}


const currentQuestionData =
  questions[currentQuestion];

const updatedAnswers = [
  ...answers,
  selectedAnswer,
];

setAnswers(updatedAnswers);

let updatedScore = score;

if (
  selectedAnswer ===
  currentQuestionData.correctAnswer
) {
  updatedScore = score + 1;
}

setScore(updatedScore);

if (
  currentQuestion ===
  questions.length - 1
) {
  const percentage =
    Math.round(
      (updatedScore /
        questions.length) *
        100
    );

  const updatedProfile =
    updateCompetency(
      questions,
      updatedAnswers
    );

  localStorage.setItem(
    "verificationAssessment",
    JSON.stringify({
      score:
        updatedScore,

      totalQuestions:
        questions.length,

      percentage:
        percentage,

      passed:
        percentage >= 60,

      competencyProfile:
        updatedProfile,

      completed: true,
    })
  );

  setShowResult(true);
} else {
  setCurrentQuestion(
    currentQuestion + 1
  );

  setSelectedAnswer(null);
}


};

if (loading) {
return ( <div className="course-assessment-page"> <div className="assessment-loading"> <p className="assessment-label">
PREPARING ASSESSMENT </p>


      <h1>
        Generating your questions...
      </h1>

      <p>
        Our AI is preparing questions
        based on your learning path.
      </p>
    </div>
  </div>
);


}

if (error) {
return ( <div className="course-assessment-page"> <div className="assessment-loading"> <h1>
Something went wrong </h1>


      <p>
        {error}
      </p>

      <button
        className="assessment-button"
        onClick={() =>
          navigate("/recommendations")
        }
      >
        Back to Recommendations
      </button>
    </div>
  </div>
);


}

if (showResult) {
const percentage =
Math.round(
(score /
questions.length) *
100
);


const passed =
  percentage >= 60;

return (
  <div className="course-assessment-page">
    <div className="result-container">
      <p className="assessment-label">
        VERIFICATION COMPLETE
      </p>

      <h1>
        {passed
          ? "Learning Verified"
          : "More Learning Needed"}
      </h1>

      <div className="score-circle">
        <span>
          {percentage}%
        </span>
      </div>

      <p className="result-text">
        You answered {score} out of{" "}
        {questions.length} questions
        correctly.
      </p>

      <p className="result-text">
        {passed
          ? "Your competency profile has been updated based on your latest assessment."
          : "Your competency profile has been updated. Review the recommended learning resources and continue improving."}
      </p>

      <button
        className="assessment-button"
        onClick={() =>
          navigate("/dashboard")
        }
      >
        Continue to Dashboard
      </button>
    </div>
  </div>
);


}

const question =
questions[currentQuestion];

if (!question) {
return ( <div className="course-assessment-page"> <div className="assessment-loading"> <h1>
No questions available </h1> </div> </div>
);
}

return ( <div className="course-assessment-page"> <div className="assessment-container"> <div className="assessment-header"> <div> <p className="assessment-label">
LEARNING VERIFICATION </p>


        <h1>
          Course Assessment
        </h1>
      </div>

      <span>
        {currentQuestion + 1}
        {" / "}
        {questions.length}
      </span>
    </div>

    <div className="question-progress">
      <div
        className="question-progress-fill"
        style={{
          width: `${
            ((currentQuestion + 1) /
              questions.length) *
            100
          }%`,
        }}
      />
    </div>

    <div className="question-container">
      <h2>
        {question.question}
      </h2>

      <div className="options-container">
        {question.options.map(
          (option, index) => (
            <button
              key={index}
              className={`option ${
                selectedAnswer ===
                index
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                setSelectedAnswer(
                  index
                )
              }
            >
              <span className="option-letter">
                {String.fromCharCode(
                  65 + index
                )}
              </span>

              {option}
            </button>
          )
        )}
      </div>
    </div>

    <div className="assessment-footer">
      <p>
        {selectedAnswer === null
          ? "Select an answer to continue"
          : "Answer selected"}
      </p>

      <button
        className="assessment-button"
        onClick={handleNext}
        disabled={
          selectedAnswer === null
        }
      >
        {currentQuestion ===
        questions.length - 1
          ? "Finish Assessment"
          : "Next Question"}
      </button>
    </div>
  </div>
</div>


);
}

export default CourseAssessment;
