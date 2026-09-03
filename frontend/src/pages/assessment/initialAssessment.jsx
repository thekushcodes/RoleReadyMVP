import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./initialAssessment.css";

const questions = [
{
question: "What does a p-value represent in hypothesis testing?",
domain: "Statistics",
options: [
"The probability that the null hypothesis is true",
"The probability of obtaining results at least as extreme under the null hypothesis",
"The probability that the alternative hypothesis is true",
"The percentage of data that is statistically significant"
],
correctAnswer: 1
},
{
question: "Which measure of central tendency is most affected by extreme outliers?",
domain: "Statistics",
options: [
"Median",
"Mode",
"Mean",
"Range"
],
correctAnswer: 2
},
{
question: "What does a correlation coefficient close to -1 indicate?",
domain: "Statistics",
options: [
"Strong positive linear relationship",
"No relationship",
"Strong negative linear relationship",
"A causal relationship"
],
correctAnswer: 2
},
{
question: "If two events A and B are independent, which statement is correct?",
domain: "Probability",
options: [
"P(A ∩ B) = P(A) + P(B)",
"P(A | B) = P(A)",
"P(A ∪ B) = 1",
"P(A) = P(B)"
],
correctAnswer: 1
},
{
question: "What is the probability of rolling a sum of 7 with two fair six-sided dice?",
domain: "Probability",
options: [
"1/12",
"1/6",
"1/3",
"1/2"
],
correctAnswer: 1
},
{
question: "Which probability distribution is commonly used to model the number of successes in a fixed number of independent trials?",
domain: "Probability",
options: [
"Normal distribution",
"Binomial distribution",
"Exponential distribution",
"Uniform distribution"
],
correctAnswer: 1
},
{
question: "What is usually the first step in a data analysis workflow?",
domain: "Data Analysis",
options: [
"Building a predictive model",
"Data visualization",
"Understanding and cleaning the data",
"Deploying the final model"
],
correctAnswer: 2
},
{
question: "What does a missing value represented as NaN usually indicate?",
domain: "Data Analysis",
options: [
"A value equal to zero",
"A negative number",
"Missing or undefined numerical data",
"A duplicated data entry"
],
correctAnswer: 2
},
{
question: "Which chart is most suitable for understanding the distribution of a continuous numerical variable?",
domain: "Data Analysis",
options: [
"Pie chart",
"Histogram",
"Bar chart",
"Line chart"
],
correctAnswer: 1
}
];

const calculateDomainPercentages = (domainScores) => {
const domainQuestionCount = {};

 
questions.forEach((question) => {
    domainQuestionCount[question.domain] =
        (domainQuestionCount[question.domain] || 0) + 1;
});

const percentages = {};

for (const domain in domainScores) {
    percentages[domain] = Math.round(
        (domainScores[domain] /
            domainQuestionCount[domain]) *
            100
    );
}

return percentages;


};

function InitialAssessment() {
const navigate = useNavigate();


const [currentQuestion, setCurrentQuestion] =
    useState(0);

const [selectedAnswer, setSelectedAnswer] =
    useState(null);

const [score, setScore] = useState(0);

const [domainScores, setDomainScores] =
    useState({
        Statistics: 0,
        Probability: 0,
        "Data Analysis": 0
    });

const [showResult, setShowResult] =
    useState(false);


const handleNext = () => {
    if (selectedAnswer === null) {
        return;
    }

    const currentQuestionData =
        questions[currentQuestion];

    let updatedScore = score;

    let updatedDomainScores = {
        ...domainScores
    };


    if (
        selectedAnswer ===
        currentQuestionData.correctAnswer
    ) {
        updatedScore = score + 1;

        updatedDomainScores[
            currentQuestionData.domain
        ] =
            updatedDomainScores[
                currentQuestionData.domain
            ] + 1;
    }


    setScore(updatedScore);

    setDomainScores(updatedDomainScores);


    if (
        currentQuestion ===
        questions.length - 1
    ) {
        const percentage = Math.round(
            (updatedScore / questions.length) * 100
        );


        const finalAssessmentData = {
            percentage: percentage,

            correctAnswers: updatedScore,

            totalQuestions: questions.length,

            completed: true,

            domainScores:
                calculateDomainPercentages(
                    updatedDomainScores
                ),

            askedQuestions: questions.map(
                (question) => ({
                    question: question.question,

                    domain: question.domain
                })
            )
        };


        localStorage.setItem(
            "assessmentData",
            JSON.stringify(finalAssessmentData)
        );


        setShowResult(true);

    } else {

        setCurrentQuestion(
            currentQuestion + 1
        );

        setSelectedAnswer(null);
    }
};


if (showResult) {
    const percentage = Math.round(
        (score / questions.length) * 100
    );

    return (
        <div className="assessment-page">

            <div className="assessment-container">

                <p className="assessment-label">
                    ASSESSMENT COMPLETE
                </p>

                <h1>
                    Your Initial Assessment is Complete
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


return (
    <div className="assessment-page">

        <div className="assessment-container">

            <div className="assessment-header">

                <div>
                    <p className="assessment-label">
                        INITIAL ASSESSMENT
                    </p>

                    <h1>
                        Test Your Skills
                    </h1>
                </div>

                <span>
                    {currentQuestion + 1} /{" "}
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
                        }%`
                    }}
                ></div>

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

export default InitialAssessment;
