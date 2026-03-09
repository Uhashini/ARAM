const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const VictimReport = require('./models/VictimReport');
const WitnessReport = require('./models/WitnessReport');
const Content = require('./models/Content');
const Notification = require('./models/Notification');
const SystemReport = require('./models/SystemReport');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data to avoid duplicates
        await User.deleteMany({ email: { $in: ['admin@aram.org', 'priya@example.com', 'anita@hospital.org', 'raj@example.com'] } });
        await Content.deleteMany({ contentId: { $in: ['EDU-001', 'EDU-002'] } });
        // Optional: clear others if needed
        // await VictimReport.deleteMany({});
        // await WitnessReport.deleteMany({});
        // await Notification.deleteMany({});

        // 1. Create Admin User
        const admin = new User({
            name: 'System Admin',
            email: 'admin@aram.org',
            password: 'adminpassword123',
            role: 'admin'
        });
        await admin.save();
        console.log('Admin user created');

        // 2. Create sample Users
        const usersData = [
            { name: 'Priya Sharma', email: 'priya@example.com', password: 'password123', role: 'victim' },
            { name: 'Dr. Anita Desai', email: 'anita@hospital.org', password: 'password123', role: 'healthcare_worker', organization: 'City Hospital' },
            { name: 'Raj Kumar', email: 'raj@example.com', password: 'password123', role: 'witness' }
        ];

        for (const u of usersData) {
            await new User(u).save();
        }
        console.log('Sample users seeded');

        // 3. Create Victim Reports
        const victimReports = [
            {
                personalDetails: {
                    name: 'Priya Sharma',
                    age: 28,
                    gender: 'Female',
                    region: { state: 'Delhi', district: 'South Delhi', country: 'India' }
                },
                incidentDetails: {
                    abuseTypes: ['physical', 'emotional'],
                    frequency: 'regular',
                    description: 'Frequent physical abuse by husband.'
                },
                perpetrator: { name: 'Unknown', relationship: 'husband', livesWithVictim: true },
                riskAssessment: { score: 'HIGH', indicators: { weaponUse: true, escalatingViolence: true } },
                status: 'submitted'
            },
            {
                personalDetails: {
                    name: 'Anonymous',
                    age: 34,
                    gender: 'Female',
                    region: { state: 'Maharashtra', district: 'Mumbai', country: 'India' }
                },
                incidentDetails: {
                    abuseTypes: ['financial', 'verbal'],
                    frequency: 'occasional',
                    description: 'Financial control and verbal abuse.'
                },
                perpetrator: { name: 'Partner', relationship: 'partner', livesWithVictim: true },
                riskAssessment: { score: 'MEDIUM' },
                status: 'processing'
            }
        ];

        for (const r of victimReports) {
            await new VictimReport(r).save();
        }
        console.log('Victim reports seeded');

        // 4. Create Witness Reports
        const witnessReports = [
            {
                reporterMode: 'witness',
                incidentDescription: 'Heard loud screaming and sounds of struggle from neighbor\'s house.',
                abuseType: ['physical'],
                region: { state: 'Delhi', district: 'North Delhi', country: 'India' },
                victim: { name: 'Sita', age: 25 },
                riskAssessment: { riskScore: 'HIGH', isVictimInImmediateDanger: true },
                consent: { isInformationTrue: true, understandsFalseReporting: true }
            }
        ];

        for (const r of witnessReports) {
            await new WitnessReport(r).save();
        }
        console.log('Witness reports seeded');

        // 5. Create Educational Content
        const contents = [
            {
                contentId: 'EDU-001',
                title: 'Understanding IPV',
                slug: 'understanding-ipv-guide',
                type: 'educational-article',
                category: 'domestic-violence',
                content: {
                    summary: 'An overview of Intimate Partner Violence.',
                    body: 'Intimate Partner Violence (IPV) is a serious issue that affects millions of people worldwide. It can take many forms, including physical, emotional, and sexual abuse.'
                },
                metadata: {
                    author: admin._id
                },
                workflow: {
                    status: 'published',
                    publishedAt: new Date()
                }
            },
            {
                contentId: 'EDU-002',
                title: 'Legal Rights in India',
                slug: 'legal-rights-india-guide',
                type: 'legal-information',
                category: 'legal-rights',
                content: {
                    summary: 'Information about legal rights for victims in India.',
                    body: 'The Protection of Women from Domestic Violence Act, 2005, is a landmark legislation in India aimed at protecting women from domestic violence.'
                },
                metadata: {
                    author: admin._id
                },
                workflow: {
                    status: 'published',
                    publishedAt: new Date()
                }
            }
        ];

        for (const c of contents) {
            await new Content(c).save();
        }
        console.log('Content seeded');

        // 6. Create Notifications
        const notificationsData = [
            { userId: admin._id, title: 'New High Risk Report', message: 'A high risk victim report has been submitted from South Delhi.', type: 'alert', category: 'risk' },
            { userId: admin._id, title: 'System Update', message: 'System maintenance scheduled for tonight.', type: 'info', category: 'system' }
        ];

        for (const n of notificationsData) {
            await new Notification(n).save();
        }
        console.log('Notifications seeded');

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding error:', err);
        if (err.errors) {
            Object.keys(err.errors).forEach(key => {
                console.error(`Field ${key}: ${err.errors[key].message}`);
                if (err.errors[key].errors) {
                    Object.keys(err.errors[key].errors).forEach(subKey => {
                        console.error(`  Sub-field ${subKey}: ${err.errors[key].errors[subKey].message}`);
                    });
                }
            });
        }
        process.exit(1);
    }
};

seedData();
