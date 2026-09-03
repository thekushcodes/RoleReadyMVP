import { useState } from "react";
import { useNavigate } from "react-router-dom";
import getRecommendations from "../../utils/recommendations";
import "./recommendations.css";

function Recommendations() {
const navigate = useNavigate();


const [startedCourses, setStartedCourses] = useState(
    JSON.parse(localStorage.getItem("startedCourses")) || []
);

const savedAssessment = JSON.parse(
    localStorage.getItem("assessmentData")
);

if (!savedAssessment) {
    return (
        <div className="recommendations-page">
            <div className="recommendations-container">
                <h1>No Assessment Found</h1>

                <p>
                    Complete your initial assessment first to receive
                    personalized recommendations.
                </p>

                <button
                    className="recommendations-button"
                    onClick={() =>
                        navigate("/assessment/initial")
                    }
                >
                    Take Assessment
                </button>
            </div>
        </div>
    );
}

const recommendations = getRecommendations(
    savedAssessment.domainScores
);

const allCoursesStarted =
    recommendations.length > 0 &&
    recommendations.every((course) =>
        startedCourses.some(
            (startedCourse) => startedCourse.id === course.id
        )
    );

const handleStartLearning = (course) => {
    const alreadyStarted = startedCourses.some(
        (startedCourse) => startedCourse.id === course.id
    );

    if (!alreadyStarted) {
        const updatedStartedCourses = [
            ...startedCourses,
            {
                id: course.id,
                title: course.title,
                domain: course.domain,
                level: course.level,
                status: "started"
            }
        ];

        localStorage.setItem(
            "startedCourses",
            JSON.stringify(updatedStartedCourses)
        );

        setStartedCourses(updatedStartedCourses);
    }

    window.open(course.link, "_blank");
};

return (
    <div className="recommendations-page">

        <div className="recommendations-container">

            <div className="recommendations-header">
                <p className="recommendations-label">
                    YOUR LEARNING PATH
                </p>

                <h1>Recommended for You</h1>

                <p>
                    Based on your assessment performance, we selected
                    learning resources suited to your current skill level.
                </p>
            </div>


            <div className="recommendations-list">

                {recommendations.map((course) => (
                    <div
                        className="recommendation-card"
                        key={course.id}
                    >

                        <div className="recommendation-top">

                            <div>
                                <p className="course-domain">
                                    {course.domain}
                                </p>

                                <h2>{course.title}</h2>
                            </div>

                            <span className="level-badge">
                                {course.level}
                            </span>

                        </div>


                        <p className="recommendation-message">
                            {course.message}
                        </p>


                        <div className="course-info">
                            <span>
                                Assessment Score: {course.score}%
                            </span>

                            <span>
                                Recommended Level: {course.level}
                            </span>
                        </div>


                        <button
                            className="recommendations-button"
                            onClick={() =>
                                handleStartLearning(course)
                            }
                        >
                            Start Learning
                        </button>

                    </div>
                ))}

            </div>


            {allCoursesStarted && (
                <div className="verification-section">

                    <h2>
                        Ready for Your Verification Assessment?
                    </h2>

                    <p>
                        You have started all recommended learning
                        resources. Take the assessment to verify
                        your learning.
                    </p>

                    <button
                        className="recommendations-button"
                        onClick={() =>
                            navigate("/assessment/course")
                        }
                    >
                        Take Verification Assessment
                    </button>

                </div>
            )}


            <button
                className="back-button"
                onClick={() => navigate("/dashboard")}
            >
                Back to Dashboard
            </button>

        </div>

    </div>
);


}

export default Recommendations;
