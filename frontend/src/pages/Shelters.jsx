import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Phone, Home, ExternalLink } from 'lucide-react';
import Navigation from '../components/Navigation';
import '../App.css';

const Shelters = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const shelters = [
        {
            id: 1,
            name: 'Sakhi One Stop Centre – Coimbatore',
            city: 'Coimbatore',
            phone: '7708707756',
            phoneAlt: '181',
            hours: '24/7',
            address: 'Coimbatore District (linked to Govt short-stay home at Kavundampalayam)',
            type: 'OSC'
        },
        {
            id: 2,
            name: 'Sakhi One Stop Centre – Chennai',
            city: 'Chennai',
            phone: '9941937370',
            phoneAlt: '8428719559',
            hours: '24/7',
            address: 'Government Service Home / OSC, Chennai District',
            type: 'OSC'
        },
        {
            id: 3,
            name: 'Sakhi One Stop Centre – Salem',
            city: 'Salem',
            phone: '9677918795',
            phoneAlt: '181',
            hours: '24/7',
            address: 'Salem District OSC',
            type: 'OSC'
        },
        {
            id: 4,
            name: 'Sakhi One Stop Centre – Trichy',
            city: 'Trichy',
            phone: '7402539210',
            phoneAlt: '181',
            hours: '24/7',
            address: 'Trichy District OSC',
            type: 'OSC'
        },
        {
            id: 5,
            name: 'Sakhi One Stop Centre – Madurai',
            city: 'Madurai',
            phone: '9486229149',
            phoneAlt: '181',
            hours: '24/7',
            address: 'Madurai District OSC',
            type: 'OSC'
        },
        {
            id: 6,
            name: 'Tamil Nadu Women Helpline',
            city: 'Statewide',
            phone: '181',
            hours: '24/7',
            address: 'Statewide emergency coordination to link to nearby OSCs',
            type: 'Helpline'
        },
        {
            id: 7,
            name: 'Swadhar Greh / Short Stay Homes',
            city: 'Statewide',
            phone: '181',
            hours: 'Varies',
            address: 'Network of 35+ homes. Access via 181 or District Social Welfare Office',
            type: 'Scheme'
        }
    ];

    const filteredShelters = shelters.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="app-container">
            <Navigation />

            <div className="container" style={{ padding: '3rem 1.5rem', minHeight: '80vh' }}>
                <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Find a Safe Shelter</h1>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                        Safe housing options for emergencies. These locations prioritize your safety and anonymity.
                    </p>
                </header>

                <div className="search-bar" style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
                    <div style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
                        <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <input
                            type="text"
                            placeholder="Search by city (e.g., Chennai, Coimbatore)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '1rem 1.5rem 1rem 3rem', borderRadius: '3rem', border: '2px solid #e0e7ff', fontSize: '1.1rem', boxShadow: 'var(--shadow-sm)' }}
                        />
                    </div>
                </div>

                <div className="shelters-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                    {filteredShelters.map(shelter => (
                        <motion.div
                            key={shelter.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ y: -5 }}
                            className="shelter-card"
                            style={{ background: 'var(--white)', padding: '2rem', borderRadius: '1rem', boxShadow: 'var(--shadow-md)', borderTop: '4px solid var(--primary-color)' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                <div style={{ padding: '0.5rem', background: 'rgba(124, 145, 227, 0.1)', borderRadius: '50%' }}>
                                    <Home size={24} color="var(--primary-color)" />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.15rem', marginBottom: '0.1rem', lineHeight: 1.2 }}>{shelter.name}</h3>
                                    <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: '600', background: '#dcfce7', padding: '0.1rem 0.5rem', borderRadius: '0.3rem' }}>
                                        Open {shelter.hours}
                                    </span>
                                </div>
                            </div>

                            <p style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                                <MapPin size={18} style={{ marginTop: '3px', flexShrink: 0 }} /> {shelter.address}
                            </p>
                            <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontWeight: 'bold' }}>
                                <Phone size={18} /> {shelter.phone} {shelter.phoneAlt && <span> / {shelter.phoneAlt}</span>}
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <a href={`tel:${shelter.phone}`} className="btn-primary" style={{ textAlign: 'center' }}>
                                    Call {shelter.phone.slice(0, 4)}...
                                </a>
                                {shelter.city !== 'Statewide' && (
                                    <a href={`https://maps.google.com/?q=${shelter.name} ${shelter.city}`} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                        Map <ExternalLink size={16} />
                                    </a>
                                )}
                                {shelter.city === 'Statewide' && (
                                    <a href={`tel:181`} className="btn-outline" style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                        Help 181
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Shelters;
