/**
 * Seed script: Insert 15 sample patient records
 * Run: node backend/scripts/seedPatients.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Patient = require('../models/Patient');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ipv_intervention_system';

const patients = [
    { patientId: 'PAT-001', demographics: { firstName: 'Priya', lastName: 'Sharma', dateOfBirth: '1992-04-15', gender: 'female', preferredLanguage: 'english' }, contactInfo: { phone: '9876543210', email: 'priya.sharma@email.com' } },
    { patientId: 'PAT-002', demographics: { firstName: 'Ananya', lastName: 'Patel', dateOfBirth: '1988-09-22', gender: 'female', preferredLanguage: 'english' }, contactInfo: { phone: '9876543211', email: 'ananya.patel@email.com' } },
    { patientId: 'PAT-003', demographics: { firstName: 'Meera', lastName: 'Reddy', dateOfBirth: '1995-01-10', gender: 'female', preferredLanguage: 'english' }, contactInfo: { phone: '9876543212', email: 'meera.reddy@email.com' } },
    { patientId: 'PAT-004', demographics: { firstName: 'Sunita', lastName: 'Devi', dateOfBirth: '1980-12-05', gender: 'female', preferredLanguage: 'hindi' }, contactInfo: { phone: '9876543213', email: 'sunita.devi@email.com' } },
    { patientId: 'PAT-005', demographics: { firstName: 'Rekha', lastName: 'Menon', dateOfBirth: '1990-06-18', gender: 'female', preferredLanguage: 'english' }, contactInfo: { phone: '9876543214', email: 'rekha.menon@email.com' } },
    { patientId: 'PAT-006', demographics: { firstName: 'Lakshmi', lastName: 'Nair', dateOfBirth: '1985-03-25', gender: 'female', preferredLanguage: 'english' }, contactInfo: { phone: '9876543215', email: 'lakshmi.nair@email.com' } },
    { patientId: 'PAT-007', demographics: { firstName: 'Kavitha', lastName: 'Kumar', dateOfBirth: '1993-08-14', gender: 'female', preferredLanguage: 'english' }, contactInfo: { phone: '9876543216', email: 'kavitha.kumar@email.com' } },
    { patientId: 'PAT-008', demographics: { firstName: 'Deepa', lastName: 'Verma', dateOfBirth: '1978-11-30', gender: 'female', preferredLanguage: 'hindi' }, contactInfo: { phone: '9876543217', email: 'deepa.verma@email.com' } },
    { patientId: 'PAT-009', demographics: { firstName: 'Fatima', lastName: 'Sheikh', dateOfBirth: '1996-02-08', gender: 'female', preferredLanguage: 'english' }, contactInfo: { phone: '9876543218', email: 'fatima.sheikh@email.com' } },
    { patientId: 'PAT-010', demographics: { firstName: 'Seetha', lastName: 'Iyer', dateOfBirth: '1983-07-20', gender: 'female', preferredLanguage: 'english' }, contactInfo: { phone: '9876543219', email: 'seetha.iyer@email.com' } },
    { patientId: 'PAT-011', demographics: { firstName: 'Radha', lastName: 'Gupta', dateOfBirth: '1991-10-12', gender: 'female', preferredLanguage: 'hindi' }, contactInfo: { phone: '9876543220', email: 'radha.gupta@email.com' } },
    { patientId: 'PAT-012', demographics: { firstName: 'Amita', lastName: 'Das', dateOfBirth: '1987-05-03', gender: 'female', preferredLanguage: 'english' }, contactInfo: { phone: '9876543221', email: 'amita.das@email.com' } },
    { patientId: 'PAT-013', demographics: { firstName: 'Nandini', lastName: 'Rao', dateOfBirth: '1994-09-28', gender: 'female', preferredLanguage: 'english' }, contactInfo: { phone: '9876543222', email: 'nandini.rao@email.com' } },
    { patientId: 'PAT-014', demographics: { firstName: 'Jyothi', lastName: 'Pillai', dateOfBirth: '1982-01-16', gender: 'female', preferredLanguage: 'english' }, contactInfo: { phone: '9876543223', email: 'jyothi.pillai@email.com' } },
    { patientId: 'PAT-015', demographics: { firstName: 'Vijaya', lastName: 'Krishnan', dateOfBirth: '1989-04-07', gender: 'female', preferredLanguage: 'english' }, contactInfo: { phone: '9876543224', email: 'vijaya.krishnan@email.com' } }
];

(async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        let inserted = 0, skipped = 0;
        for (const p of patients) {
            const exists = await Patient.findOne({ patientId: p.patientId });
            if (exists) { skipped++; console.log(`  SKIP ${p.patientId} (already exists)`); continue; }
            await new Patient(p).save();
            inserted++;
            console.log(`  INSERT ${p.patientId} — ${p.demographics.firstName} ${p.demographics.lastName}`);
        }
        console.log(`\nDone! Inserted: ${inserted}, Skipped: ${skipped}`);
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
})();
