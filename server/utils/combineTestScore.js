// utils/combineScore.js
export function computeCombinedScore(classifierLabel, regressorValue) {
    const normalizedClassifier = classifierLabel / 3; // label 0–3 → 0–1
    const normalizedRegressor = (regressorValue - 1) / 4; // 1–5 → 0–1
    return (normalizedClassifier + normalizedRegressor) / 2;
}
