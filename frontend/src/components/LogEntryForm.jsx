import React, { useState } from 'react';
import { Send, MessageSquare, Eye, Zap, ShieldAlert, FileText, Info } from 'lucide-react';
import './LogEntryForm.css';

const LogEntryForm = ({ reportId, onLogAdded }) => {
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('note');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const categories = [
        { id: 'note', label: 'General Note', icon: MessageSquare },
        { id: 'observation', label: 'Observation', icon: Eye },
        { id: 'intervention', label: 'Intervention', icon: ShieldAlert },
        { id: 'evidence_added', label: 'Evidence', icon: FileText }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsSubmitting(true);
        try {
            const userInfo = localStorage.getItem('userInfo');
            const { token } = JSON.parse(userInfo);

            const response = await fetch(`http://127.0.0.1:5001/api/witness/report/${reportId}/log`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content, category })
            });

            if (response.ok) {
                const data = await response.json();
                onLogAdded(data.log);
                setContent('');
                setCategory('note');
            } else {
                const data = await response.json();
                alert(`Error: ${data.message || 'Failed to add log'}`);
            }
        } catch (err) {
            console.error('Add log error:', err);
            alert('Failed to connect to server.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="log-entry-form-container">
            <div className="form-header">
                <Zap size={18} />
                <span>Add Action Log / Observation</span>
            </div>

            <form onSubmit={handleSubmit} className="log-form">
                <div className="category-selector">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            type="button"
                            className={`category-btn ${category === cat.id ? 'active' : ''}`}
                            onClick={() => setCategory(cat.id)}
                        >
                            <cat.icon size={14} />
                            <span>{cat.label}</span>
                        </button>
                    ))}
                </div>

                <div className="input-with-action">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What did you observe or what action was taken?"
                        rows="3"
                        required
                    />
                    <button
                        type="submit"
                        className="btn-send-log"
                        disabled={isSubmitting || !content.trim()}
                    >
                        {isSubmitting ? <span className="loader-mini"></span> : <Send size={18} />}
                    </button>
                </div>
                <p className="helper-text">
                    <Info size={12} /> Your logs help build a stronger case timeline for authorities.
                </p>
            </form>
        </div>
    );
};

export default LogEntryForm;
