import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Calendar, Book } from 'lucide-react';
import Navigation from '../components/Navigation';
import '../App.css';

const Journal = () => {
    const [entries, setEntries] = useState([
        { id: 1, date: '2024-05-20', mood: 'Anxious', content: 'Felt unsafe today when he came home late...' },
        { id: 2, date: '2024-05-18', mood: 'Calm', content: 'Spent time with sister. Felt better.' }
    ]);
    const [isCreating, setIsCreating] = useState(false);
    const [newEntry, setNewEntry] = useState({ mood: '', content: '' });

    const handleSave = () => {
        // Backend API call to save entry
        const entry = {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            mood: newEntry.mood || 'Neutral',
            content: newEntry.content
        };
        setEntries([entry, ...entries]);
        setIsCreating(false);
        setNewEntry({ mood: '', content: '' });
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure? This cannot be undone.')) {
            setEntries(entries.filter(e => e.id !== id));
        }
    };

    return (
        <div className="app-container">
            <Navigation />

            <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '800px', minHeight: '85vh' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Private Journal</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Log your thoughts and incidents safely.</p>
                    </div>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Plus size={20} /> New Entry
                    </button>
                </header>

                {isCreating ? (
                    <div style={{ background: 'var(--white)', padding: '2rem', borderRadius: '1rem', boxShadow: 'var(--shadow-md)' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>New Entry</h2>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>How are you feeling?</label>
                            <select
                                value={newEntry.mood}
                                onChange={(e) => setNewEntry({ ...newEntry, mood: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}
                            >
                                <option value="">Select Mood</option>
                                <option value="Calm">Calm 😌</option>
                                <option value="Anxious">Anxious 😰</option>
                                <option value="Sad">Sad 😢</option>
                                <option value="Angry">Angry 😠</option>
                                <option value="Hopeful">Hopeful 🌻</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Write your thoughts...</label>
                            <textarea
                                value={newEntry.content}
                                onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                                rows="6"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', fontFamily: 'inherit' }}
                                placeholder="What happened today? How did you feel?"
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={handleSave} className="btn-primary" style={{ flex: 1 }}>Save Entry</button>
                            <button onClick={() => setIsCreating(false)} className="btn-outline" style={{ flex: 1 }}>Cancel</button>
                        </div>
                    </div>
                ) : (
                    <div className="entries-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {entries.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
                                <Book size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                <p>No entries yet. Start writing today.</p>
                            </div>
                        ) : (
                            entries.map(entry => (
                                <div key={entry.id} style={{ background: 'var(--white)', padding: '1.5rem', borderRadius: '0.75rem', borderLeft: '4px solid var(--accent-color)', boxShadow: 'var(--shadow-sm)', position: 'relative' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                            <Calendar size={16} /> {entry.date}
                                        </span>
                                        <span style={{ background: '#f3f4f6', padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.85rem' }}>
                                            {entry.mood}
                                        </span>
                                    </div>
                                    <p style={{ lineHeight: '1.6', color: 'var(--text-main)' }}>{entry.content}</p>

                                    <button
                                        onClick={() => handleDelete(entry.id)}
                                        style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', opacity: 0.6 }}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Journal;
