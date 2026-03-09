/**
 * AI Risk Scoring Engine — Rule-Based Clinical IPV Risk Calculator
 * 
 * This module implements a deterministic, rule-based scoring algorithm that
 * simulates AI risk assessment for Intimate Partner Violence (IPV) cases.
 * 
 * WORKFLOW:
 * 1. Healthcare worker submits IPV screening data (responses, clinical observations)
 * 2. This engine receives the screening data and applies weighted scoring rules
 * 3. It analyzes 4 dimensions: screening responses, physical injuries, behavioral
 *    indicators, and emotional state
 * 4. Each dimension contributes a weighted score (0–1 probability)
 * 5. The engine outputs: aiRiskLevel, aiProbability, aiConfidence, aiExplanation,
 *    and riskFactors — all stored in ScreeningResponse.riskAssessment
 * 
 * SCORING DIMENSIONS & WEIGHTS:
 * - Screening Response Score (40%): Based on totalScore from the screening instrument
 * - Physical Injury Score   (25%): Number and severity of observed injuries
 * - Behavioral Indicator Score (20%): Count of risk-related behavioral flags
 * - Emotional State Score   (15%): Emotional state severity mapping
 */

// ── Injury Severity Weights ─────────────────────────────────────────────
const INJURY_WEIGHTS = {
    'bruises': 0.3,
    'cuts': 0.35,
    'burns': 0.6,
    'fractures': 0.8,
    'head-injury': 0.9,
    'dental-injury': 0.5,
    'defensive-wounds': 0.85,
    'strangulation-marks': 0.95,
    'other': 0.3
};

// ── Behavioral Indicator Weights ────────────────────────────────────────
const BEHAVIOR_WEIGHTS = {
    'fearful-demeanor': 0.6,
    'hypervigilance': 0.5,
    'depression': 0.4,
    'anxiety': 0.35,
    'substance-use': 0.55,
    'suicidal-ideation': 0.9,
    'social-isolation': 0.5,
    'other': 0.2
};

// ── Emotional State Severity ────────────────────────────────────────────
const EMOTION_SEVERITY = {
    'calm': 0.05,
    'anxious': 0.35,
    'depressed': 0.45,
    'fearful': 0.65,
    'angry': 0.3,
    'withdrawn': 0.5,
    'agitated': 0.55
};

// ── Risk Factor Mapping ─────────────────────────────────────────────────
const FACTOR_MAP = {
    'bruises': 'physical-violence',
    'cuts': 'physical-violence',
    'burns': 'physical-violence',
    'fractures': 'physical-violence',
    'head-injury': 'physical-violence',
    'defensive-wounds': 'physical-violence',
    'dental-injury': 'physical-violence',
    'fearful-demeanor': 'threats',
    'hypervigilance': 'stalking',
    'substance-use': 'substance-abuse',
    'suicidal-ideation': 'mental-health-crisis',
    'social-isolation': 'isolation',
    'depression': 'mental-health-crisis',
    'anxiety': 'emotional-abuse'
};

/**
 * Calculate AI risk score from screening data
 * @param {Object} screeningData - The screening submission data
 * @returns {Object} { aiRiskLevel, aiProbability, aiConfidence, aiExplanation, riskFactors }
 */
function calculateRiskScore(screeningData) {
    const { totalScore, responses, clinicalObservations, screeningType } = screeningData;
    const obs = clinicalObservations || {};
    const injuries = obs.physicalInjuries || [];
    const behaviors = obs.behavioralIndicators || [];
    const emotion = obs.emotionalState || 'calm';

    // ── Dimension 1: Screening Response Score (40% weight) ──────────────
    // Normalize score: instruments typically max at 10-30 range
    const maxScoreByType = { 'WHO': 20, 'HITS': 20, 'WAST': 8, 'PVS': 3, 'AAS': 30, 'clinical-assessment': 20 };
    const maxScore = maxScoreByType[screeningType] || 20;
    const normalizedScore = Math.min((totalScore || 0) / maxScore, 1);
    const responseScore = normalizedScore;

    // ── Dimension 2: Physical Injury Score (25% weight) ─────────────────
    let injuryScore = 0;
    if (injuries.length > 0) {
        const totalInjuryWeight = injuries.reduce((sum, inj) => sum + (INJURY_WEIGHTS[inj] || 0.3), 0);
        injuryScore = Math.min(totalInjuryWeight / 1.5, 1); // Cap at 1.0
    }

    // ── Dimension 3: Behavioral Indicator Score (20% weight) ────────────
    let behaviorScore = 0;
    if (behaviors.length > 0) {
        const totalBehaviorWeight = behaviors.reduce((sum, b) => sum + (BEHAVIOR_WEIGHTS[b] || 0.2), 0);
        behaviorScore = Math.min(totalBehaviorWeight / 1.5, 1);
    }

    // ── Dimension 4: Emotional State Score (15% weight) ─────────────────
    const emotionScore = EMOTION_SEVERITY[emotion] || 0.1;

    // ── Combined Weighted Probability ───────────────────────────────────
    const rawProbability = (
        responseScore * 0.40 +
        injuryScore * 0.25 +
        behaviorScore * 0.20 +
        emotionScore * 0.15
    );

    // Clamp to [0, 1]
    const aiProbability = Math.min(Math.max(rawProbability, 0), 1);

    // ── Risk Level Classification ───────────────────────────────────────
    let aiRiskLevel;
    if (aiProbability >= 0.6) aiRiskLevel = 'HIGH';
    else if (aiProbability >= 0.3) aiRiskLevel = 'MEDIUM';
    else aiRiskLevel = 'LOW';

    // Escalation rules: certain combinations force HIGH risk
    if (injuries.includes('head-injury') || injuries.includes('strangulation-marks')) aiRiskLevel = 'HIGH';
    if (behaviors.includes('suicidal-ideation')) aiRiskLevel = 'HIGH';
    if (injuries.length >= 3 && behaviors.length >= 2) aiRiskLevel = 'HIGH';

    // ── Confidence Calculation ──────────────────────────────────────────
    // Confidence increases with more data points available
    let dataPoints = 0;
    if (totalScore > 0) dataPoints++;
    if (injuries.length > 0) dataPoints++;
    if (behaviors.length > 0) dataPoints++;
    if (emotion !== 'calm') dataPoints++;
    if (responses && responses.length > 0) dataPoints++;
    const aiConfidence = Math.min(0.4 + (dataPoints * 0.12), 0.98);

    // ── Risk Factors Identification ─────────────────────────────────────
    const factorsSet = new Set();
    injuries.forEach(inj => { if (FACTOR_MAP[inj]) factorsSet.add(FACTOR_MAP[inj]); });
    behaviors.forEach(b => { if (FACTOR_MAP[b]) factorsSet.add(FACTOR_MAP[b]); });
    if (normalizedScore > 0.5) factorsSet.add('physical-violence');
    if (emotion === 'fearful') factorsSet.add('threats');

    const riskFactors = Array.from(factorsSet).map(factor => ({
        factor,
        severity: aiRiskLevel === 'HIGH' ? 'high' : aiRiskLevel === 'MEDIUM' ? 'medium' : 'low',
        identifiedAt: new Date()
    }));

    // ── Explanation Generation ──────────────────────────────────────────
    const explanationParts = [];
    explanationParts.push(`Screening score: ${totalScore}/${maxScore} (${(normalizedScore * 100).toFixed(0)}% of max).`);
    if (injuries.length > 0) explanationParts.push(`Physical injuries detected: ${injuries.join(', ')}.`);
    if (behaviors.length > 0) explanationParts.push(`Behavioral indicators: ${behaviors.map(b => b.replace(/-/g, ' ')).join(', ')}.`);
    explanationParts.push(`Emotional state: ${emotion}.`);
    explanationParts.push(`Overall probability: ${(aiProbability * 100).toFixed(1)}% (weighted across 4 dimensions).`);
    if (aiRiskLevel === 'HIGH') explanationParts.push('⚠️ HIGH RISK — Immediate intervention recommended.');

    return {
        aiRiskLevel,
        aiProbability: Math.round(aiProbability * 100) / 100,
        aiConfidence: Math.round(aiConfidence * 100) / 100,
        aiExplanation: explanationParts.join(' '),
        aiModelVersion: 'ARAM-RuleEngine-v1.0',
        riskFactors
    };
}

module.exports = { calculateRiskScore };
