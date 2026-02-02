import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Check, AlertTriangle } from 'lucide-react';
import Navigation from '../components/Navigation';
import '../App.css';

const SelfScreening = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState('intro'); // intro, form, result
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);

    // Two sections of questions as provided by user
    const sections = [
        {
            id: 'relationship',
            title: 'Relationship Dynamics',
            description: 'Help us understand the patterns in your relationship.',
            questions: [
                { id: 'q1', text: 'Does your partner get angry when you spend time with friends or family?', weight: 2 },
                { id: 'q2', text: 'Are you afraid of your partner\'s temper?', weight: 3 },
                { id: 'q3', text: 'Does your partner control your money or prevent you from working?', weight: 2 },
                { id: 'q4', text: 'Has your partner ever threatened to hurt you or someone you care about?', weight: 3 },
                { id: 'q5', text: 'Does your partner check up on you constantly or follow you?', weight: 2 },
                { id: 'q6', text: 'Has your partner ever forced you to do sexual things you didn\'t want to do?', weight: 3 },
                { id: 'q7', text: 'Do you feel like you\'re walking on eggshells around your partner?', weight: 2 },
                { id: 'q8', text: 'Has your partner ever hit, slapped, pushed, or physically hurt you?', weight: 3 },
                { id: 'q9', text: 'Does your partner put you down or make you feel bad about yourself?', weight: 2 },
                { id: 'q10', text: 'Do you feel isolated from friends and family because of your relationship?', weight: 2 }
            ]
        },
        {
            id: 'safety',
            title: 'Personal Safety Assessment',
            description: 'Assess your current safety situation and risk factors.',
            questions: [
                { id: 's1', text: 'Do you have a safe place to go if you need to leave quickly?', weight: -2, reverse: true },
                { id: 's2', text: 'Are you able to contact friends or family without your partner monitoring?', weight: -1, reverse: true },
                { id: 's3', text: 'Has the violence or threats increased in frequency or severity?', weight: 3 },
                { id: 's4', text: 'Does your partner have access to weapons?', weight: 3 },
                { id: 's5', text: 'Has your partner threatened to kill you, your children, or pets?', weight: 4 },
                { id: 's6', text: 'Do you have access to important documents (ID, passport, etc.)?', weight: -1, reverse: true },
                { id: 's7', text: 'Has your partner ever tried to strangle or choke you?', weight: 4 },
                { id: 's8', text: 'Are you able to make decisions about your daily activities?', weight: -1, reverse: true }
            ]
        }
    ];

    // Combine all questions for easier iteration if needed, or keep sections
    const allQuestions = [...sections[0].questions, ...sections[1].questions];

    const handleAnswer = (qid, answer) => {
        setAnswers(prev => ({ ...prev, [qid]: answer }));
    };

    const calculateRisk = async () => {
        let score = 0;

        allQuestions.forEach(q => {
            const answer = answers[q.id];
            if (answer === 'yes') {
                score += q.weight;
            } else if (answer === 'no') {
                if (q.reverse) {
                    score += Math.abs(q.weight);
                }
            }
        });

        let level = 'LOW';
        let actions = ['Read safety planning tips', 'Save helpline numbers'];

        const hasRedFlags = (answers['s5'] === 'yes') || (answers['s7'] === 'yes');

        if (score >= 25 || hasRedFlags) {
            level = 'HIGH';
            actions = ['Immediate help: Call 181/100', 'Locate nearest shelter immediately', 'Create quick safety plan', 'Refer to counsellor immediately'];
        } else if (score >= 10) {
            level = 'MEDIUM';
            actions = ['Talk to a counsellor', 'Locate shelters near you', 'Document incidents', 'Pack an emergency bag'];
        }

        // Save to backend if user is logged in
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            try {
                const { token } = JSON.parse(userInfo);
                const response = await fetch('http://127.0.0.1:5001/api/auth/risk-assessment', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ level, score })
                });

                if (response.ok) {
                    console.log("Risk assessment saved successfully");
                }
            } catch (err) {
                console.error("Failed to save risk assessment", err);
            }
        }

        setResult({ level, score, actions });
        setStep('result');
    };

    const handleReferral = () => {
        if (window.confirm("This will securely share your current risk assessment with a verified counsellor who will contact you via your safe method. Proceed?")) {
            // In a real app, this would trigger a notification to the healthcare/admin
            alert("Referral sent successfully. A counsellor has been notified and will review your profile.");
            navigate('/victim-dashboard', { state: { assessmentComplete: true } });
        }
    };

    const handleBackToDashboard = () => {
        navigate('/victim-dashboard', { state: { assessmentComplete: true } });
    };

    return (
        <div className="app-container">
            <Navigation />
            <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '800px' }}>

                {step === 'intro' && (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <Shield size={64} color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
                        <h1 style={{ marginBottom: '1rem' }}>Comprehensive Safety Screening</h1>
                        <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                            This screening includes {allQuestions.length} questions to assess your relationship dynamics and personal safety.
                            Your answers are confidential.
                        </p>
                        <button onClick={() => setStep('form')} className="btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
                            Start Assessment
                        </button>
                    </div>
                )}

                {step === 'form' && (
                    <div>
                        {sections.map((section) => (
                            <div key={section.id} style={{ marginBottom: '3rem' }}>
                                <h2 style={{ marginBottom: '0.5rem', color: 'var(--primary-color)' }}>{section.title}</h2>
                                <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>{section.description}</p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {section.questions.map((q) => (
                                        <div key={q.id} style={{ background: 'var(--white)', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: 'var(--shadow-sm)' }}>
                                            <p style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: '500' }}>{q.text}</p>
                                            <div style={{ display: 'flex', gap: '1rem' }}>
                                                <button
                                                    onClick={() => handleAnswer(q.id, 'yes')}
                                                    style={{
                                                        flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', cursor: 'pointer',
                                                        background: answers[q.id] === 'yes' ? 'var(--primary-color)' : 'white',
                                                        color: answers[q.id] === 'yes' ? 'white' : 'inherit',
                                                        fontWeight: answers[q.id] === 'yes' ? 'bold' : 'normal'
                                                    }}
                                                >
                                                    Yes
                                                </button>
                                                <button
                                                    onClick={() => handleAnswer(q.id, 'no')}
                                                    style={{
                                                        flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', cursor: 'pointer',
                                                        background: answers[q.id] === 'no' ? '#718096' : 'white',
                                                        color: answers[q.id] === 'no' ? 'white' : 'inherit',
                                                        fontWeight: answers[q.id] === 'no' ? 'bold' : 'normal'
                                                    }}
                                                >
                                                    No
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <div style={{ marginTop: '2rem', textAlign: 'center', paddingBottom: '3rem' }}>
                            <button
                                onClick={calculateRisk}
                                className="btn-primary"
                                disabled={Object.keys(answers).length < allQuestions.length}
                                style={{ padding: '1rem 3rem', opacity: Object.keys(answers).length < allQuestions.length ? 0.5 : 1 }}
                            >
                                Calculate Risk Profile
                            </button>
                            {Object.keys(answers).length < allQuestions.length && (
                                <p style={{ marginTop: '1rem', color: 'var(--warning)', fontSize: '0.9rem' }}>
                                    Please answer all questions to proceed.
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {step === 'result' && result && (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            display: 'inline-block', padding: '1rem 2rem', borderRadius: '2rem',
                            background: result.level === 'HIGH' ? '#fee2e2' : (result.level === 'MEDIUM' ? '#ffedd5' : '#dcfce7'),
                            color: result.level === 'HIGH' ? '#dc2626' : (result.level === 'MEDIUM' ? '#c2410c' : '#16a34a'),
                            fontWeight: '800', fontSize: '1.5rem', marginBottom: '2rem'
                        }}>
                            {result.level} RISK DETECTED
                        </div>

                        <div style={{ background: 'var(--white)', padding: '2rem', borderRadius: '1rem', boxShadow: 'var(--shadow-md)', textAlign: 'left' }}>
                            <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Recommended Actions</h3>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {result.actions.map((action, idx) => (
                                    <li key={idx} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.1rem' }}>
                                        <Check size={20} color="var(--success)" /> {action}
                                    </li>
                                ))}
                            </ul>

                            <h3 style={{ marginTop: '2rem', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Professional Support</h3>
                            <button
                                onClick={handleReferral}
                                className="btn-primary"
                                style={{ width: '100%', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
                            >
                                Connect with a Counsellor <Shield size={18} />
                            </button>
                            <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem', textAlign: 'center' }}>
                                Your answers and risk score will be securely sent to the assigned professional.
                            </p>
                        </div>

                        <button onClick={handleBackToDashboard} className="btn-ghost" style={{ marginTop: '2rem' }}>
                            Back to Dashboard
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default SelfScreening;
