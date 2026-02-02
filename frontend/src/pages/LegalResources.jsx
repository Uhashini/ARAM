import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Phone, ExternalLink, Mail } from 'lucide-react';
import Navigation from '../components/Navigation'; // Using our new Navbar
import '../App.css';

const LegalResources = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');

    const resources = [
        {
            id: 1,
            name: 'Coimbatore DLSA',
            type: 'govt',
            city: 'Coimbatore',
            phone: '0422-2200009',
            email: 'dlsacoimbatore@gmail.com',
            address: 'District Court Buildings, Coimbatore 641018',
            mapLink: 'https://maps.google.com/?q=District+Court+Buildings+Coimbatore'
        },
        {
            id: 2,
            name: 'Chennai DLSA',
            type: 'govt',
            city: 'Chennai',
            phone: '044-25332412',
            email: 'dlsachennai@gmail.com',
            address: 'Ground Floor, ADR Centre, North Fort Road, High Court Campus, Chennai 600104',
            mapLink: 'https://maps.google.com/?q=ADR+Centre+High+Court+Campus+Chennai'
        },
        {
            id: 3,
            name: 'TN State Legal Services Authority',
            type: 'govt',
            city: 'Chennai',
            phone: '044-25342441',
            note: '10am-6pm weekdays',
            address: 'North Fort Road, High Court Campus, Chennai 600104',
            mapLink: 'https://maps.google.com/?q=High+Court+Campus+Chennai'
        },
        {
            id: 4,
            name: 'Principal Family Court, Chennai',
            type: 'court',
            city: 'Chennai',
            phone: '044-25340791',
            email: 'chnccc.pfc-tn@indiancourts.nic.in',
            address: 'Chennai City Courts Complex',
            mapLink: 'https://maps.google.com/?q=Chennai+City+Courts+Complex'
        },
        {
            id: 5,
            name: 'I Additional Principal Family Court',
            type: 'court',
            city: 'Chennai',
            email: 'chnccc.afc1-tn@indiancourts.nic.in',
            address: 'Chennai City Courts',
            mapLink: 'https://maps.google.com/?q=Chennai+City+Courts'
        },
        {
            id: 6,
            name: 'Coimbatore Family Court',
            type: 'court',
            city: 'Coimbatore',
            phone: '0422-2200009',
            note: 'via DLSA',
            address: 'Coimbatore District Court Complex (near Ettimadai)',
            mapLink: 'https://maps.google.com/?q=Coimbatore+District+Court+Complex'
        },
        {
            id: 7,
            name: 'Sakhi One Stop Centre, Coimbatore',
            type: 'ngo',
            city: 'Coimbatore',
            phone: '181',
            note: 'Contact via TN Women Helpline 181',
            address: 'Government support for violence victims',
            mapLink: 'https://maps.google.com/?q=Coimbatore'
        },
        {
            id: 8,
            name: 'Tamil Nadu Women\'s Helpline',
            type: 'helpline',
            city: 'Statewide',
            phone: '181',
            note: '24/7 Integrated support',
            address: 'Statewide',
            mapLink: ''
        }
    ];

    const filteredResources = resources.filter(r =>
        (filter === 'all' || r.type === filter) &&
        (r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.city.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="app-container">
            <Navigation />

            <div className="container" style={{ padding: '3rem 1.5rem', minHeight: '80vh' }}>
                <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Legal Resources</h1>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                        Find free legal aid, family courts, and support organizations near you.
                    </p>
                </header>

                <div className="search-filter-bar" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem', justifyContent: 'center' }}>
                    <div style={{ position: 'relative', width: '300px' }}>
                        <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <input
                            type="text"
                            placeholder="Search by city or name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', fontSize: '1rem' }}
                        />
                    </div>

                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', fontSize: '1rem', cursor: 'pointer', background: '#fff' }}
                    >
                        <option value="all">All Types</option>
                        <option value="govt">Govt Legal Aid</option>
                        <option value="court">Family Courts</option>
                        <option value="ngo">NGOs / OSC</option>
                        <option value="helpline">Helplines</option>
                    </select>
                </div>

                <div className="resources-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {filteredResources.map(resource => (
                        <motion.div
                            key={resource.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="resource-card"
                            style={{ background: 'var(--white)', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: 'var(--shadow-sm)', border: '1px solid #f3f4f6' }}
                        >
                            <div className="badge" style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '1rem', background: '#e0e7ff', color: '#4338ca', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                                {resource.type}
                            </div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{resource.name}</h3>
                            <p style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                <MapPin size={16} style={{ marginTop: '3px', flexShrink: 0 }} />
                                <span>{resource.address}</span>
                            </p>
                            {resource.phone && (
                                <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                                    <Phone size={16} /> {resource.phone}
                                    {resource.note && <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>({resource.note})</span>}
                                </p>
                            )}
                            {resource.email && (
                                <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', wordBreak: 'break-all' }}>
                                    <Mail size={16} /> <a href={`mailto:${resource.email}`}>{resource.email}</a>
                                </p>
                            )}

                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
                                {resource.phone && (
                                    <a href={`tel:${resource.phone}`} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', flex: 1, textAlign: 'center' }}>
                                        Call Now
                                    </a>
                                )}
                                {resource.mapLink && (
                                    <a href={resource.mapLink} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', flex: 1, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                                        Directions <ExternalLink size={14} />
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

export default LegalResources;
