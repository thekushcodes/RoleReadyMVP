import courses from "../data/courses";

function getLevel(score) {
if (score <= 40) {
return "Beginner";
}


if (score <= 75) {
    return "Intermediate";
}

return "Advanced";


}

function getRecommendationMessage(score, level) {
if (level === "Beginner") {
return "Your assessment shows that you should strengthen your foundational understanding in this domain.";
}


if (level === "Intermediate") {
    return "You have a foundation in this domain and are ready to develop more practical and advanced skills.";
}

return "You performed strongly in this domain. Challenge yourself with advanced concepts and deeper learning.";


}

function getRecommendations(domainScores) {
const recommendations = [];


for (const domain in domainScores) {
    const score = domainScores[domain];
    const level = getLevel(score);

    const course = courses.find(
        (course) =>
            course.domain === domain &&
            course.level === level
    );

    if (course) {
        recommendations.push({
            ...course,
            score,
            message: getRecommendationMessage(score, level)
        });
    }
}

return recommendations.sort((a, b) => a.score - b.score);


}

export default getRecommendations;
