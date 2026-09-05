import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

function Dashboard() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const user = {
        name: "Anurag",
        role: "Statistical Engineer",
    };

    const savedAssessment = JSON.parse(
        localStorage.getItem("assessmentData")
    );

    const competencyProfile = JSON.parse(
        localStorage.getItem("competencyProfile")
    ) || {};

    const assessmentCompleted =
        savedAssessment?.completed || false;

    const verificationAssessment = JSON.parse(
        localStorage.getItem("verificationAssessment")
    );

    const skillStats = [
        {
            name: "Statistics",
            score:
                competencyProfile.Statistics ??
                savedAssessment?.domainScores?.Statistics ??
                null,
        },
        {
            name: "Probability",
            score:
                competencyProfile.Probability ??
                savedAssessment?.domainScores?.Probability ??
                null,
        },
        {
            name: "Data Analysis",
            score:
                competencyProfile["Data Analysis"] ??
                savedAssessment?.domainScores?.["Data Analysis"] ??
                null,
        },
    ];

    return (
        <div className="dashboard-page">
            <header className="mobile-header">
                <button
                    className="menu-toggle-btn"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    aria-label="Toggle navigation">☰</button>

                <span className="mobile-title">
                    RoleReady
                </span>

            </header>

            <div
                className={`sidebar-overlay ${sidebarOpen ? "active" : ""
                    }`}
                onClick={() => setSidebarOpen(false)}
            />

            <aside
                className={`sidebar ${sidebarOpen ? "open" : ""
                    }`}
            >
                <div className="sidebar-top">
                    <div className="sidebar-brand">
                        <h2>RoleReady</h2>

                        <button
                            className="close-sidebar-btn"
                            onClick={() => setSidebarOpen(false)}
                            aria-label="Close navigation"
                        >
                            ✕
                        </button>
                    </div>

                    <nav className="sidebar-menu">
                        <button
                            className="menu-item active"
                            onClick={() => setSidebarOpen(false)}
                        >
                            Dashboard
                        </button>

                        <button
                            className="menu-item"
                            onClick={() => setSidebarOpen(false)}
                        >
                            My Progress
                        </button>
                    </nav>
                </div>

                <button
                    className="profile-button"
                    onClick={() => navigate("/profile")}
                >
                    <span className="profile-avatar">
                        {user.name.charAt(0)}
                    </span>

                    <div>
                        <strong>{user.name}</strong>
                        <p>View Profile</p>
                    </div>
                </button>
            </aside>

            <main className="dashboard-main">
                <div className="dashboard-header">
                    <p>Welcome back,</p>

                    <h1>{user.name}</h1>

                    <span>{user.role}</span>
                </div>

                <section className="current-action">
                    <p className="section-label">
                        YOUR CURRENT STEP
                    </p>

                    {!assessmentCompleted ? (
                        <div className="action-card">
                            <div>
                                <h2>
                                    Take Your Diagnostic Assessment
                                </h2>

                                <p>
                                    Complete this assessment so we can
                                    evaluate your current skill level and
                                    create your learning path.
                                </p>
                            </div>

                            <button
                                className="primary-button"
                                onClick={() =>
                                    navigate("/assessment/initial")
                                }
                            >
                                Start Assessment
                            </button>
                        </div>
                    ) : !verificationAssessment ? (
                        <div className="action-card">
                            <div>
                                <h2>
                                    Continue Your Learning Path
                                </h2>

                                <p>
                                    Complete your recommended learning
                                    resources before taking your
                                    verification assessment.
                                </p>
                            </div>

                            <button
                                className="primary-button"
                                onClick={() =>
                                    navigate("/recommendations")
                                }
                            >
                                View Recommendations
                            </button>
                        </div>
                    ) : (
                        <div className="action-card">
                            <div>
                                <h2>
                                    Competency Updated
                                </h2>

                                <p>
                                    Your latest assessment score is{" "}
                                    {verificationAssessment.percentage}%.
                                    Continue learning to improve your
                                    competency profile.
                                </p>
                            </div>

                            <button
                                className="primary-button"
                                onClick={() =>
                                    navigate("/recommendations")
                                }
                            >
                                Continue Learning
                            </button>
                        </div>
                    )}
                </section>

                <section className="progress-section">
                    <div className="section-header">
                        <h2>Your Skill Progress</h2>

                        <span>
                            {assessmentCompleted
                                ? `${savedAssessment.percentage}% Initial Score`
                                : "Not assessed yet"}
                        </span>
                    </div>

                    <div className="progress-list">
                        {skillStats.map((skill) => (
                            <div
                                className="progress-item"
                                key={skill.name}
                            >
                                <div className="progress-info">
                                    <span>{skill.name}</span>

                                    <span>
                                        {skill.score !== null
                                            ? `${skill.score}%`
                                            : "--"}
                                    </span>
                                </div>

                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{
                                            width:
                                                skill.score !== null
                                                    ? `${skill.score}%`
                                                    : "0%",
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {Object.keys(competencyProfile).some(
                    (key) => key !== "lastUpdated"
                ) && (
                        <section className="competency-section">
                            <div className="section-header">
                                <div>
                                    <p className="section-label">
                                        COMPETENCY PROFILE
                                    </p>

                                    <h2>
                                        Latest Assessment Results
                                    </h2>
                                </div>
                            </div>

                            <div className="competency-grid">
                                {Object.entries(
                                    competencyProfile
                                )
                                    .filter(
                                        ([key]) =>
                                            key !== "lastUpdated"
                                    )
                                    .map(([domain, score]) => (
                                        <div
                                            className="competency-card"
                                            key={domain}
                                        >
                                            <span>
                                                {domain}
                                            </span>

                                            <strong>
                                                {score}%
                                            </strong>
                                        </div>
                                    ))}
                            </div>
                        </section>
                    )}
            </main>
        </div>


    );
}

export default Dashboard;
