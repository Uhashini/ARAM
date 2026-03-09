import React from 'react';
import {
    Clock, User, MessageSquare, ShieldAlert, Info, Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import './AdvancedTimeline.css';

const AdvancedTimeline = ({ logs = [], status = 'pending' }) => {
    // Sort logs by date descending
    const sortedLogs = [...logs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const getLogIcon = (category) => {
        switch (category) {
            case 'status_change': return <RefreshCcw size={16} />;
            case 'observation': return <Eye size={16} />;
            case 'intervention': return <ShieldAlert size={16} />;
            case 'evidence_added': return <FileText size={16} />;
            case 'note': return <MessageSquare size={16} />;
            default: return <Info size={16} />;
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'system': return '#6366f1'; // Indigo
            case 'witness': return '#ec4899'; // Pink
            case 'authority': return '#0ea5e9'; // Sky
            case 'legal': return '#10b981'; // Emerald
            case 'medical': return '#f43f5e'; // Rose
            default: return '#94a3b8';
        }
    };

    return (
        <div className="advanced-timeline">
            <div className="timeline-header">
                <Calendar size={18} />
                <span>Case Progression & Action Logs</span>
            </div>

            {sortedLogs.length === 0 ? (
                <div className="empty-timeline">
                    <Clock size={32} />
                    <p>No activity recorded yet.</p>
                </div>
            ) : (
                <div className="timeline-container">
                    {sortedLogs.map((log, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`timeline-item ${log.type}`}
                        >
                            <div className="timeline-dot" style={{ backgroundColor: getTypeColor(log.type) }}>
                                {getLogIcon(log.category)}
                            </div>

                            <div className="timeline-content">
                                <div className="timeline-meta">
                                    <span className="log-type-badge" style={{ backgroundColor: `${getTypeColor(log.type)}15`, color: getTypeColor(log.type) }}>
                                        {log.type}
                                    </span>
                                    <span className="log-time">
                                        {new Date(log.timestamp).toLocaleString(undefined, {
                                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                                <p className="log-text">{log.content}</p>
                                {log.actorName && (
                                    <span className="log-actor">
                                        <User size={10} /> {log.actorName}
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    ))}
                    <div className="timeline-line"></div>
                </div>
            )}
        </div>
    );
};

// Internal Lucide-react icons not imported above
const RefreshCcw = ({ size }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 21h5v-5" /></svg>;
const Eye = ({ size }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>;
const FileText = ({ size }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></svg>;

export default AdvancedTimeline;
