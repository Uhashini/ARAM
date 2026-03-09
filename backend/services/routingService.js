/**
 * Routing Service
 * Logic to determine Risk Score and Recommended Destinations
 */

const calculateRiskScore = (data) => {
    let score = 'LOW';
    let riskPoints = 0;

    // Indicators from VictimReport or WitnessReport
    const indicators = data.riskAssessment?.indicators || data.riskAssessment || {};
    const perp = data.perpetrator || data.accused || {};
    const medical = data.medical || {};

    // Critical Red Flags (Immediate Extreme Risk)
    if (indicators.threatToKill || indicators.strangulationIndex || indicators.weaponUse) {
        return 'EXTREME';
    }

    // High Risk Factors
    if (perp.hasWeaponAccess || perp.hasWeapon === 'yes') riskPoints += 3;
    if (medical.hasInjuries || medical.hasVisibleInjuries) riskPoints += 2;
    if (indicators.escalatingViolence) riskPoints += 2;

    // Medium Risk Factors
    if (perp.substanceAbuse || perp.substanceAbuse === 'yes') riskPoints += 1;
    if (data.children?.isAlsoAbused || (data.children?.details?.some(c => c.isAlsoAbused))) riskPoints += 2;
    if (medical.isPregnant) riskPoints += 2;
    if (indicators.suicideThreats) riskPoints += 2;

    if (riskPoints >= 5) return 'HIGH';
    if (riskPoints >= 2) return 'MEDIUM';

    return 'LOW';
};

const determineDestinations = (data, riskScore) => {
    const destinations = new Set();
    const abuseTypes = data.incidentDetails?.abuseTypes || data.abuseType || [];
    const medical = data.medical || {};

    // 1. Police Routing
    if (riskScore === 'EXTREME' || riskScore === 'HIGH' || abuseTypes.includes('physical') || abuseTypes.includes('sexual') || abuseTypes.includes('dowry-related')) {
        destinations.add('Police');
    }

    // 2. Hospital Routing
    if (medical.hasInjuries || medical.needImmediateHelp || abuseTypes.includes('physical') || abuseTypes.includes('sexual') || medical.isPregnant) {
        destinations.add('Hospital');
    }

    // 3. Shelter / Protection Officer
    if (data.perpetrator?.livesWithVictim || riskScore === 'EXTREME' || riskScore === 'HIGH') {
        destinations.add('Shelter');
    }

    // 4. Counselor / Psychologist
    if (abuseTypes.includes('emotional') || abuseTypes.includes('verbal') || abuseTypes.includes('psychological') || abuseTypes.includes('stalking')) {
        destinations.add('Counselor');
    }

    // 5. Legal Aid
    if (abuseTypes.includes('financial') || abuseTypes.includes('dowry-related') || abuseTypes.includes('digital')) {
        destinations.add('LegalAid');
    }

    return Array.from(destinations);
};

module.exports = {
    calculateRiskScore,
    determineDestinations
};
