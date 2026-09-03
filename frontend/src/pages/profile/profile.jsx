import { useNavigate } from "react-router-dom";
import "./profile.css";

function Profile() {
const navigate = useNavigate();

const user = {
name: "Anurag",
role: "Statistical Engineer",
};

const initialAssessment = JSON.parse(
localStorage.getItem("assessmentData")
);

const verificationAssessment = JSON.parse(
localStorage.getItem("verificationAssessment")
);

const competencyProfile = JSON.parse(
localStorage.getItem("competencyProfile")
) || {};

const skillScores = Object.entries(
competencyProfile
).filter(
([key]) => key !== "lastUpdated"
);

return ( <div className="profile-page"> <div className="profile-container">
<button
className="back-button"
onClick={() => navigate("/dashboard")}
>
← Back to Dashboard </button>


    <div className="profile-card">
      <div className="profile-main">
        <div className="profile-avatar-large">
          {user.name.charAt(0)}
        </div>

        <div>
          <p className="profile-label">
            PROFESSIONAL PROFILE
          </p>

          <h1>{user.name}</h1>

          <span className="profile-role">
            {user.role}
          </span>
        </div>
      </div>

      <div className="profile-divider" />

      <div className="profile-scores">
        <div className="profile-score-card">
          <span>Initial Assessment</span>

          <strong>
            {initialAssessment?.completed
              ? `${initialAssessment.percentage}%`
              : "--"}
          </strong>
        </div>

        <div className="profile-score-card">
          <span>Latest Assessment</span>

          <strong>
            {verificationAssessment?.completed
              ? `${verificationAssessment.percentage}%`
              : "--"}
          </strong>
        </div>
      </div>

      {skillScores.length > 0 && (
        <div className="profile-skills">
          <p className="profile-label">
            CURRENT COMPETENCY
          </p>

          <div className="profile-skill-list">
            {skillScores.map(
              ([domain, score]) => (
                <div
                  className="profile-skill"
                  key={domain}
                >
                  <span>{domain}</span>

                  <strong>{score}%</strong>
                </div>
              )
            )}
          </div>
        </div>
      )}

      <p className="profile-updated">
        {competencyProfile.lastUpdated
          ? `Last updated: ${new Date(
              competencyProfile.lastUpdated
            ).toLocaleDateString()}`
          : "Complete an assessment to build your competency profile."}
      </p>
    </div>
  </div>
</div>


);
}

export default Profile;
