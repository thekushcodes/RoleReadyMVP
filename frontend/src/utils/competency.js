export const updateCompetency = (questions, answers) => {
    const domainResults = {};

    questions.forEach((question, index) => {
        const domain = question.domain;

        if (!domainResults[domain]) {
            domainResults[domain] = {
                correct: 0,
                total: 0
            };
        }

        domainResults[domain].total += 1;

        if (
            answers[index] ===
            question.correctAnswer
        ) {
            domainResults[domain].correct += 1;
        }
    });

    const newScores = {};

    Object.entries(domainResults).forEach(
        ([domain, result]) => {
            newScores[domain] = Math.round(
                (result.correct / result.total) * 100
            );
        }
    );

    const existingProfile = JSON.parse(
        localStorage.getItem("competencyProfile")
    ) || {};

    const updatedProfile = {
        ...existingProfile,
        ...newScores,
        lastUpdated: new Date().toISOString()
    };

    localStorage.setItem(
        "competencyProfile",
        JSON.stringify(updatedProfile)
    );

    return updatedProfile;
};