const express = require('express');
const router = express.Router();
const { authenticate, addRequestId } = require('../middleware/auth');
const {
    requireRole,
    auditLog,
    rateLimitSensitive
} = require('../middleware/authorization');

const Patient = require('../models/Patient');
const ScreeningResponse = require('../models/ScreeningResponse');
const Referral = require('../models/Referral');
const CarePlan = require('../models/CarePlan');
const FollowUpLog = require('../models/FollowUpLog');
const GeneratedPatientReport = require('../models/GeneratedPatientReport');
let SafetyPlan, JournalEntry;
try { SafetyPlan = require('../models/SafetyPlan'); } catch (e) { SafetyPlan = null; }
try { JournalEntry = require('../models/JournalEntry'); } catch (e) { JournalEntry = null; }
const { calculateRiskScore } = require('../utils/riskScoringEngine');

router.use(addRequestId);
router.use(authenticate);
router.use(requireRole(['healthcare_worker', 'healthcare', 'admin']));

// ── HELPER: resolve custom patientId string → MongoDB _id ───────────────
async function resolvePatientId(patientIdStr) {
    if (!patientIdStr) return null;
    // If it looks like a MongoDB ObjectId (24 hex chars), use directly
    if (/^[0-9a-fA-F]{24}$/.test(patientIdStr)) {
        return patientIdStr;
    }
    // Otherwise look up by custom patientId field
    const patient = await Patient.findOne({ patientId: patientIdStr, isActive: true });
    return patient ? patient._id : null;
}

// ── PATIENT ROUTES ──────────────────────────────────────────────────────

router.get('/patients/resolve/:patientId', auditLog('READ', 'patient'), async (req, res) => {
    try {
        const patient = await Patient.findOne({ patientId: req.params.patientId, isActive: true });
        if (!patient) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Patient not found' } });
        res.json({ patient });
    } catch (error) {
        res.status(500).json({ error: { code: 'RESOLVE_ERROR', message: error.message } });
    }
});

router.get('/patients/search', auditLog('SEARCH', 'patient'), async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.trim().length === 0) {
            const patients = await Patient.find({ isActive: true }).sort({ 'demographics.lastName': 1 }).limit(50);
            return res.json({ patients });
        }
        const patients = await Patient.searchPatients(q.trim());
        res.json({ patients });
    } catch (error) {
        res.status(500).json({ error: { code: 'SEARCH_ERROR', message: error.message } });
    }
});

router.get('/patients/:id', auditLog('READ', 'patient'), async (req, res) => {
    try {
        const id = req.params.id;
        let patient;
        if (/^[0-9a-fA-F]{24}$/.test(id)) {
            patient = await Patient.findById(id);
        } else {
            patient = await Patient.findOne({ patientId: id, isActive: true });
        }
        if (!patient) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Patient not found' } });
        res.json({ patient });
    } catch (error) {
        res.status(500).json({ error: { code: 'READ_ERROR', message: error.message } });
    }
});

router.post('/patients', auditLog('CREATE', 'patient'), async (req, res) => {
    try {
        const patient = new Patient(req.body);
        await patient.save();
        res.status(201).json({ patient, message: 'Patient created successfully' });
    } catch (error) {
        if (error.code === 11000) return res.status(400).json({ error: { code: 'DUPLICATE', message: 'Patient ID already exists' } });
        res.status(400).json({ error: { code: 'CREATE_ERROR', message: error.message } });
    }
});

router.put('/patients/:id', auditLog('UPDATE', 'patient'), async (req, res) => {
    try {
        let patient;
        if (/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
            patient = await Patient.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
        } else {
            patient = await Patient.findOneAndUpdate({ patientId: req.params.id }, { $set: req.body }, { new: true, runValidators: true });
        }
        if (!patient) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Patient not found' } });
        res.json({ patient, message: 'Patient updated successfully' });
    } catch (error) {
        res.status(400).json({ error: { code: 'UPDATE_ERROR', message: error.message } });
    }
});

router.delete('/patients/:id', auditLog('DELETE', 'patient'), async (req, res) => {
    try {
        let patient;
        if (/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
            patient = await Patient.findByIdAndUpdate(req.params.id, { $set: { isActive: false } }, { new: true });
        } else {
            patient = await Patient.findOneAndUpdate({ patientId: req.params.id }, { $set: { isActive: false } }, { new: true });
        }
        if (!patient) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Patient not found' } });
        res.json({ message: 'Patient deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: { code: 'DELETE_ERROR', message: error.message } });
    }
});

// ── SCREENING ROUTES ────────────────────────────────────────────────────

router.post('/screening', rateLimitSensitive(), auditLog('CREATE', 'clinical_screening'), async (req, res) => {
    try {
        const mongoId = await resolvePatientId(req.body.patientId);
        if (!mongoId) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Patient not found with that ID' } });

        // ── AI Risk Score Auto-Calculation ──────────────────────────
        const aiScores = calculateRiskScore(req.body);
        const mergedRisk = {
            ...aiScores,
            finalRiskLevel: req.body.riskAssessment?.finalRiskLevel || aiScores.aiRiskLevel,
            ...(req.body.riskAssessment || {}),
            aiRiskLevel: aiScores.aiRiskLevel,
            aiProbability: aiScores.aiProbability,
            aiConfidence: aiScores.aiConfidence,
            aiExplanation: aiScores.aiExplanation,
            aiModelVersion: aiScores.aiModelVersion,
            riskFactors: aiScores.riskFactors
        };

        const screening = new ScreeningResponse({
            ...req.body,
            patientId: mongoId,
            healthcareWorkerId: req.user.userId,
            riskAssessment: mergedRisk
        });
        await screening.save();
        try {
            const patient = await Patient.findById(mongoId);
            if (patient) {
                const isPositive = screening.isPositiveScreening();
                await patient.updateIPVScreening(mergedRisk.finalRiskLevel || 'LOW', isPositive, req.user.userId);
            }
        } catch (e) { console.error('Error updating patient IPV history:', e); }
        res.status(201).json({ screening, aiScores, message: 'Screening created with AI risk assessment' });
    } catch (error) {
        res.status(400).json({ error: { code: 'CREATE_ERROR', message: error.message } });
    }
});

router.get('/screening', auditLog('READ', 'clinical_screening'), async (req, res) => {
    try {
        const { patientId, riskLevel } = req.query;
        const filter = { isValid: true };
        if (patientId) {
            const mongoId = await resolvePatientId(patientId);
            if (mongoId) filter.patientId = mongoId;
            else return res.json({ screenings: [] });
        }
        if (riskLevel) filter['riskAssessment.finalRiskLevel'] = riskLevel;
        const screenings = await ScreeningResponse.find(filter).populate('patientId', 'patientId demographics').sort({ completedAt: -1 }).limit(100);
        res.json({ screenings });
    } catch (error) {
        res.status(500).json({ error: { code: 'SEARCH_ERROR', message: error.message } });
    }
});

router.get('/screening/:id', auditLog('READ', 'clinical_screening'), async (req, res) => {
    try {
        const screening = await ScreeningResponse.findById(req.params.id).populate('patientId', 'patientId demographics').populate('healthcareWorkerId', 'name email');
        if (!screening) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Screening not found' } });
        res.json({ screening });
    } catch (error) {
        res.status(500).json({ error: { code: 'READ_ERROR', message: error.message } });
    }
});

router.put('/screening/:id', auditLog('UPDATE', 'clinical_screening'), async (req, res) => {
    try {
        if (req.body.patientId) {
            const mongoId = await resolvePatientId(req.body.patientId);
            if (mongoId) req.body.patientId = mongoId;
        }
        const screening = await ScreeningResponse.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
        if (!screening) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Screening not found' } });
        res.json({ screening, message: 'Screening updated successfully' });
    } catch (error) {
        res.status(400).json({ error: { code: 'UPDATE_ERROR', message: error.message } });
    }
});

router.delete('/screening/:id', auditLog('DELETE', 'clinical_screening'), async (req, res) => {
    try {
        const screening = await ScreeningResponse.findByIdAndUpdate(req.params.id, { $set: { isValid: false } }, { new: true });
        if (!screening) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Screening not found' } });
        res.json({ message: 'Screening deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: { code: 'DELETE_ERROR', message: error.message } });
    }
});

// ── AI RISK SCORE ROUTES ────────────────────────────────────────────────

router.get('/risk-score/:patientId', auditLog('READ', 'risk_score'), async (req, res) => {
    try {
        const mongoId = await resolvePatientId(req.params.patientId);
        if (!mongoId) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Patient not found' } });
        const screenings = await ScreeningResponse.find({ patientId: mongoId, isValid: true, 'riskAssessment.aiRiskLevel': { $exists: true } }).sort({ completedAt: -1 }).limit(20);
        const patient = await Patient.findById(mongoId);
        const riskData = {
            patient: patient ? { patientId: patient.patientId, fullName: `${patient.demographics.firstName} ${patient.demographics.lastName}`, highestRiskLevel: patient.ipvHistory?.highestRiskLevel || 'LOW', totalScreenings: patient.ipvHistory?.totalScreenings || 0, positiveScreenings: patient.ipvHistory?.positiveScreenings || 0 } : null,
            screenings: screenings.map(s => ({ _id: s._id, screeningType: s.screeningType, completedAt: s.completedAt, totalScore: s.totalScore, aiRiskLevel: s.riskAssessment?.aiRiskLevel, aiProbability: s.riskAssessment?.aiProbability, aiConfidence: s.riskAssessment?.aiConfidence, aiExplanation: s.riskAssessment?.aiExplanation, finalRiskLevel: s.riskAssessment?.finalRiskLevel, riskFactors: s.riskAssessment?.riskFactors || [], clinicalObservations: s.clinicalObservations }))
        };
        res.json(riskData);
    } catch (error) {
        res.status(500).json({ error: { code: 'READ_ERROR', message: error.message } });
    }
});

// ── REFERRAL ROUTES ─────────────────────────────────────────────────────

router.post('/referral', auditLog('CREATE', 'referral'), async (req, res) => {
    try {
        const mongoId = await resolvePatientId(req.body.patientId);
        if (!mongoId) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Patient not found' } });
        const referral = new Referral({ ...req.body, patientId: mongoId, referringUserId: req.user.userId });
        await referral.save();
        res.status(201).json({ referral, message: 'Referral created successfully' });
    } catch (error) {
        res.status(400).json({ error: { code: 'CREATE_ERROR', message: error.message } });
    }
});

router.get('/referrals', auditLog('READ', 'referral'), async (req, res) => {
    try {
        const { patientId, status, urgencyLevel } = req.query;
        const filter = { isActive: true };
        if (patientId) {
            const mongoId = await resolvePatientId(patientId);
            if (mongoId) filter.patientId = mongoId;
            else return res.json({ referrals: [] });
        }
        if (status) filter.status = status;
        if (urgencyLevel) filter.urgencyLevel = urgencyLevel;
        const referrals = await Referral.find(filter).populate('patientId', 'patientId demographics').populate('referringUserId', 'name email').sort({ createdAt: -1 }).limit(100);
        res.json({ referrals });
    } catch (error) {
        res.status(500).json({ error: { code: 'SEARCH_ERROR', message: error.message } });
    }
});

router.put('/referral/:id', auditLog('UPDATE', 'referral'), async (req, res) => {
    try {
        if (req.body.patientId) {
            const mongoId = await resolvePatientId(req.body.patientId);
            if (mongoId) req.body.patientId = mongoId;
        }
        const referral = await Referral.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
        if (!referral) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Referral not found' } });
        res.json({ referral, message: 'Referral updated successfully' });
    } catch (error) {
        res.status(400).json({ error: { code: 'UPDATE_ERROR', message: error.message } });
    }
});

router.delete('/referral/:id', auditLog('DELETE', 'referral'), async (req, res) => {
    try {
        const referral = await Referral.findByIdAndUpdate(req.params.id, { $set: { isActive: false } }, { new: true });
        if (!referral) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Referral not found' } });
        res.json({ message: 'Referral deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: { code: 'DELETE_ERROR', message: error.message } });
    }
});

// ── CARE PLAN ROUTES ────────────────────────────────────────────────────

router.post('/careplan', auditLog('CREATE', 'careplan'), async (req, res) => {
    try {
        const mongoId = await resolvePatientId(req.body.patientId);
        if (!mongoId) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Patient not found' } });
        const carePlan = new CarePlan({ ...req.body, patientId: mongoId, healthcareWorkerId: req.user.userId });
        await carePlan.save();
        res.status(201).json({ carePlan, message: 'Care plan created successfully' });
    } catch (error) {
        res.status(400).json({ error: { code: 'CREATE_ERROR', message: error.message } });
    }
});

router.get('/careplan/:patientId', auditLog('READ', 'careplan'), async (req, res) => {
    try {
        const mongoId = await resolvePatientId(req.params.patientId);
        if (!mongoId) return res.json({ carePlans: [] });
        const carePlans = await CarePlan.find({ patientId: mongoId, isActive: true }).populate('healthcareWorkerId', 'name email').sort({ createdAt: -1 });
        res.json({ carePlans });
    } catch (error) {
        res.status(500).json({ error: { code: 'READ_ERROR', message: error.message } });
    }
});

router.put('/careplan/:id', auditLog('UPDATE', 'careplan'), async (req, res) => {
    try {
        const carePlan = await CarePlan.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
        if (!carePlan) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Care plan not found' } });
        res.json({ carePlan, message: 'Care plan updated successfully' });
    } catch (error) {
        res.status(400).json({ error: { code: 'UPDATE_ERROR', message: error.message } });
    }
});

router.delete('/careplan/:id', auditLog('DELETE', 'careplan'), async (req, res) => {
    try {
        const carePlan = await CarePlan.findByIdAndUpdate(req.params.id, { $set: { isActive: false } }, { new: true });
        if (!carePlan) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Care plan not found' } });
        res.json({ message: 'Care plan deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: { code: 'DELETE_ERROR', message: error.message } });
    }
});

// ── FOLLOW-UP LOG ROUTES ────────────────────────────────────────────────

router.post('/followup', auditLog('CREATE', 'followup'), async (req, res) => {
    try {
        const mongoId = await resolvePatientId(req.body.patientId);
        if (!mongoId) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Patient not found' } });
        const followUp = new FollowUpLog({ ...req.body, patientId: mongoId, healthcareWorkerId: req.user.userId });
        await followUp.save();
        res.status(201).json({ followUp, message: 'Follow-up log created successfully' });
    } catch (error) {
        res.status(400).json({ error: { code: 'CREATE_ERROR', message: error.message } });
    }
});

router.get('/followup/:patientId', auditLog('READ', 'followup'), async (req, res) => {
    try {
        const mongoId = await resolvePatientId(req.params.patientId);
        if (!mongoId) return res.json({ followUps: [] });
        const followUps = await FollowUpLog.find({ patientId: mongoId, isActive: true }).populate('healthcareWorkerId', 'name email').populate('carePlanId', 'diagnosis status').sort({ followUpDate: -1 });
        res.json({ followUps });
    } catch (error) {
        res.status(500).json({ error: { code: 'READ_ERROR', message: error.message } });
    }
});

router.put('/followup/:id', auditLog('UPDATE', 'followup'), async (req, res) => {
    try {
        const followUp = await FollowUpLog.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
        if (!followUp) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Follow-up not found' } });
        res.json({ followUp, message: 'Follow-up updated successfully' });
    } catch (error) {
        res.status(400).json({ error: { code: 'UPDATE_ERROR', message: error.message } });
    }
});

router.delete('/followup/:id', auditLog('DELETE', 'followup'), async (req, res) => {
    try {
        const followUp = await FollowUpLog.findByIdAndUpdate(req.params.id, { $set: { isActive: false } }, { new: true });
        if (!followUp) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Follow-up not found' } });
        res.json({ message: 'Follow-up deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: { code: 'DELETE_ERROR', message: error.message } });
    }
});

// ── REPORT GENERATION ROUTES ────────────────────────────────────────────

router.post('/reports', auditLog('CREATE', 'report'), async (req, res) => {
    try {
        const { patientId: pidStr, reportType, dateRange, includeSections } = req.body;
        const mongoId = await resolvePatientId(pidStr);
        if (!mongoId) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Patient not found' } });
        const patient = await Patient.findById(mongoId);

        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);
        const dateFilter = { $gte: startDate, $lte: endDate };
        const reportData = {};

        if (includeSections?.demographics !== false) { reportData.demographics = patient.demographics; reportData.contactInfo = patient.contactInfo; }
        if (includeSections?.screeningHistory !== false) { reportData.screenings = await ScreeningResponse.find({ patientId: mongoId, isValid: true, completedAt: dateFilter }).sort({ completedAt: -1 }); }
        if (includeSections?.riskScores !== false) { reportData.riskHistory = { highestRiskLevel: patient.ipvHistory?.highestRiskLevel, totalScreenings: patient.ipvHistory?.totalScreenings, positiveScreenings: patient.ipvHistory?.positiveScreenings }; }
        if (includeSections?.referrals !== false) { reportData.referrals = await Referral.find({ patientId: mongoId, isActive: true, createdAt: dateFilter }).sort({ createdAt: -1 }); }
        if (includeSections?.carePlans !== false) { reportData.carePlans = await CarePlan.find({ patientId: mongoId, isActive: true, createdAt: dateFilter }).sort({ createdAt: -1 }); }
        if (includeSections?.followUps !== false) { reportData.followUps = await FollowUpLog.find({ patientId: mongoId, isActive: true, followUpDate: dateFilter }).sort({ followUpDate: -1 }); }

        const report = new GeneratedPatientReport({ patientId: mongoId, generatedBy: req.user.userId, reportType, dateRange: { startDate, endDate }, includeSections: includeSections || {}, reportData, format: req.body.format || 'json' });
        await report.save();
        res.status(201).json({ report, message: 'Report generated successfully' });
    } catch (error) {
        res.status(400).json({ error: { code: 'GENERATE_ERROR', message: error.message } });
    }
});

router.get('/reports/:patientId', auditLog('READ', 'report'), async (req, res) => {
    try {
        const mongoId = await resolvePatientId(req.params.patientId);
        if (!mongoId) return res.json({ reports: [] });
        const reports = await GeneratedPatientReport.find({ patientId: mongoId, isActive: true }).populate('generatedBy', 'name email').sort({ createdAt: -1 });
        res.json({ reports });
    } catch (error) {
        res.status(500).json({ error: { code: 'READ_ERROR', message: error.message } });
    }
});

router.delete('/reports/:id', auditLog('DELETE', 'report'), async (req, res) => {
    try {
        const report = await GeneratedPatientReport.findByIdAndUpdate(req.params.id, { $set: { isActive: false } }, { new: true });
        if (!report) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Report not found' } });
        res.json({ message: 'Report deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: { code: 'DELETE_ERROR', message: error.message } });
    }
});

// ── DASHBOARD ROUTE ─────────────────────────────────────────────────────

router.get('/dashboard', auditLog('READ', 'dashboard'), async (req, res) => {
    try {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const [totalPatients, highRiskPatients, recentScreenings, pendingReferrals, pendingFollowUps, totalScreenings, totalReferrals] = await Promise.all([
            Patient.countDocuments({ isActive: true }),
            Patient.countDocuments({ 'ipvHistory.highestRiskLevel': 'HIGH', isActive: true }),
            ScreeningResponse.countDocuments({ isValid: true, completedAt: { $gte: today } }),
            Referral.countDocuments({ status: 'pending', isActive: true }),
            FollowUpLog.countDocuments({ status: 'scheduled', followUpDate: { $lte: new Date() }, isActive: true }),
            ScreeningResponse.countDocuments({ isValid: true }),
            Referral.countDocuments({ isActive: true })
        ]);
        res.json({ dashboard: { totalPatients, highRiskPatients, recentScreenings, pendingReferrals, pendingFollowUps, totalScreenings, totalReferrals } });
    } catch (error) {
        res.status(500).json({ error: { code: 'DASHBOARD_ERROR', message: error.message } });
    }
});

// ── SYSTEM METRICS ROUTE ────────────────────────────────────────────────

router.get('/metrics', auditLog('READ', 'metrics'), async (req, res) => {
    try {
        // Screening metrics
        const screeningsByType = await ScreeningResponse.aggregate([
            { $match: { isValid: true } },
            { $group: { _id: '$screeningType', count: { $sum: 1 }, avgScore: { $avg: '$totalScore' } } }
        ]);
        const positiveScreenings = await ScreeningResponse.countDocuments({ isValid: true, 'riskAssessment.finalRiskLevel': { $in: ['HIGH', 'MEDIUM'] } });

        // Risk distribution
        const riskDistribution = await Patient.aggregate([
            { $match: { isActive: true, 'ipvHistory.highestRiskLevel': { $exists: true } } },
            { $group: { _id: '$ipvHistory.highestRiskLevel', count: { $sum: 1 } } }
        ]);

        // Referral metrics
        const referralsByType = await Referral.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: '$referralType', count: { $sum: 1 } } }
        ]);
        const referralsByStatus = await Referral.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // Care plan metrics
        const activePlans = await CarePlan.countDocuments({ isActive: true, status: 'active' });
        const totalPlans = await CarePlan.countDocuments({ isActive: true });

        // Follow-up metrics
        const scheduledFollowUps = await FollowUpLog.countDocuments({ isActive: true, status: 'scheduled' });
        const completedFollowUps = await FollowUpLog.countDocuments({ isActive: true, status: 'completed' });
        const missedFollowUps = await FollowUpLog.countDocuments({ isActive: true, status: 'missed' });

        // Safety plan metrics
        let safetyPlanCount = 0;
        try { safetyPlanCount = await SafetyPlan.countDocuments({ status: 'active' }); } catch (e) { }

        // Journal analytics
        let journalStats = { total: 0 };
        try {
            journalStats.total = await JournalEntry.countDocuments({});
            const moodAgg = await JournalEntry.aggregate([
                { $match: { 'metadata.mood': { $exists: true } } },
                { $group: { _id: null, avgMood: { $avg: '$metadata.mood' } } }
            ]);
            if (moodAgg.length) journalStats.avgMood = moodAgg[0].avgMood;
        } catch (e) { }

        res.json({
            metrics: {
                screening: { byType: screeningsByType, positiveCount: positiveScreenings, total: await ScreeningResponse.countDocuments({ isValid: true }) },
                risk: { distribution: riskDistribution },
                referrals: { byType: referralsByType, byStatus: referralsByStatus, total: await Referral.countDocuments({ isActive: true }) },
                carePlans: { active: activePlans, total: totalPlans },
                followUps: { scheduled: scheduledFollowUps, completed: completedFollowUps, missed: missedFollowUps },
                safetyPlans: { active: safetyPlanCount },
                journal: journalStats
            }
        });
    } catch (error) {
        res.status(500).json({ error: { code: 'METRICS_ERROR', message: error.message } });
    }
});

module.exports = router;
