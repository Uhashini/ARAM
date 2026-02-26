import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  RotateCcw, ArrowLeft, CheckCircle, AlertTriangle, Shield, User, MapPin,
  FileText, Upload, Scale, ArrowRight, Eye, Smartphone, Zap, Heart,
  MessageSquare, Briefcase, Plus, Lock, ChevronRight, X, Navigation, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './WitnessReport.css';
import '../App.css';
import aramLogo from '../assets/aram-hero-logo.png';

// Fix Leaflet marker icon issue
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Map Component Helpers
const LocationPicker = ({ position, setPosition, onAddressFound }) => {
  useMapEvents({
    async click(e) {
      setPosition(e.latlng);
      if (onAddressFound) {
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${e.latlng.lat}&lon=${e.latlng.lng}`);
          const data = await response.json();
          onAddressFound(data.display_name);
        } catch (err) {
          console.error('Reverse geocoding failed:', err);
        }
      }
    },
  });
  return position ? <Marker position={position} /> : null;
};

const MapFocus = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, map.getZoom());
  }, [position, map]);
  return null;
};

const WitnessReport = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 7;
  const [user, setUser] = useState(null);

  // FIR PDF Generation Function
  const generateFIRPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPos = 20;

    // Header
    doc.setFillColor(124, 145, 227);
    doc.rect(0, 0, pageWidth, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('FIRST INFORMATION REPORT (FIR)', pageWidth / 2, 15, { align: 'center' });

    doc.setTextColor(0, 0, 0);
    yPos = 35;

    // FIR Number & Date
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`FIR Number: ${submissionResult?.reportId || 'PENDING'}`, 15, yPos);
    doc.text(`Date: ${new Date().toLocaleString('en-IN')}`, pageWidth - 15, yPos, { align: 'right' });
    yPos += 10;


    // Police Station
    doc.setFont('helvetica', 'normal');
    doc.text('Assigned Police Station: ', 15, yPos);
    doc.setFont('helvetica', 'bold');
    const stationName = submissionResult?.assignedPoliceStation?.name || 'Women Safety Cell / Cyber Crime Division';
    doc.text(stationName, 65, yPos);
    yPos += 6;

    if (submissionResult?.assignedPoliceStation?.address) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Address: ${submissionResult.assignedPoliceStation.address}`, 15, yPos);
      yPos += 5;
    }

    if (submissionResult?.assignedPoliceStation?.distance) {
      doc.setFont('helvetica', 'italic');
      doc.text(`Distance from incident: ${submissionResult.assignedPoliceStation.distance} km`, 15, yPos);
      yPos += 5;
    }
    doc.setFontSize(10);
    yPos += 5;

    // Legal Sections
    doc.setFont('helvetica', 'normal');
    doc.text('Applicable Sections: ', 15, yPos);
    doc.setFont('helvetica', 'bold');
    const sections = submissionResult?.suggestedLaws?.join(', ') || 'IPC 498A, DV Act 2005';
    doc.text(sections, 60, yPos);
    yPos += 15;

    // Section 1: Complainant/Witness Details
    doc.setFillColor(240, 240, 240);
    doc.rect(15, yPos - 5, pageWidth - 30, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('1. COMPLAINANT / WITNESS DETAILS', 17, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Mode: ${formData.reporterMode.toUpperCase()}`, 20, yPos);
    doc.text(`Privacy Mode: ${formData.privacyMode.toUpperCase()}`, 100, yPos);
    yPos += 6;
    if (formData.witness.name) {
      doc.text(`Name: ${formData.witness.name}`, 20, yPos);
      yPos += 6;
    }
    if (formData.witness.phone) {
      doc.text(`Contact: ${formData.witness.phone}`, 20, yPos);
      yPos += 6;
    }
    yPos += 5;

    // Section 2: Victim Details
    doc.setFillColor(240, 240, 240);
    doc.rect(15, yPos - 5, pageWidth - 30, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('2. VICTIM DETAILS', 17, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${formData.victim.name || 'Anonymous'}`, 20, yPos);
    doc.text(`Age: ${formData.victim.age || 'N/A'}`, 100, yPos);
    doc.text(`Gender: ${formData.victim.gender || 'N/A'}`, 140, yPos);
    yPos += 6;
    if (formData.victim.address) {
      doc.text(`Address: ${formData.victim.address}`, 20, yPos);
      yPos += 6;
    }
    yPos += 5;

    // Section 3: Accused Details
    doc.setFillColor(240, 240, 240);
    doc.rect(15, yPos - 5, pageWidth - 30, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('3. ACCUSED DETAILS', 17, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${formData.accused.name || 'Unknown'}`, 20, yPos);
    doc.text(`Relationship: ${formData.accused.relationshipToVictim || 'N/A'}`, 100, yPos);
    yPos += 6;
    doc.text(`Substance Abuse: ${formData.accused.substanceAbuse}`, 20, yPos);
    doc.text(`Weapon Present: ${formData.accused.hasWeapon}`, 100, yPos);
    yPos += 10;

    // Section 4: Incident Summary
    doc.setFillColor(240, 240, 240);
    doc.rect(15, yPos - 5, pageWidth - 30, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('4. INCIDENT SUMMARY', 17, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Abuse Type: ${formData.abuseType.join(', ') || 'N/A'}`, 20, yPos);
    yPos += 6;
    doc.text(`Frequency: ${formData.frequency}`, 20, yPos);
    yPos += 6;
    doc.text(`Location: ${formData.location || 'Not Provided'}`, 20, yPos);
    yPos += 6;
    if (formData.dateTime) {
      doc.text(`Date & Time: ${new Date(formData.dateTime).toLocaleString()}`, 20, yPos);
      yPos += 6;
    }
    yPos += 3;

    // Incident Description
    doc.setFont('helvetica', 'bold');
    doc.text('Description:', 20, yPos);
    yPos += 6;
    doc.setFont('helvetica', 'normal');
    const descLines = doc.splitTextToSize(formData.incidentDescription || 'No detailed description provided.', pageWidth - 40);
    doc.text(descLines, 20, yPos);
    yPos += descLines.length * 5 + 5;

    // Check if new page is needed
    if (yPos > pageHeight - 60) {
      doc.addPage();
      yPos = 20;
    }

    // Section 5: Risk Assessment
    doc.setFillColor(240, 240, 240);
    doc.rect(15, yPos - 5, pageWidth - 30, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('5. RISK ASSESSMENT', 17, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const riskScore = submissionResult?.riskScore || 'PENDING';
    doc.setFont('helvetica', 'bold');
    doc.text(`Risk Score: ${riskScore}`, 20, yPos);
    yPos += 8;
    doc.setFont('helvetica', 'normal');

    const riskFactors = [];
    if (formData.riskAssessment.isVictimInImmediateDanger) riskFactors.push('✓ Victim in immediate danger');
    if (formData.riskAssessment.isAccusedNearby) riskFactors.push('✓ Accused nearby');
    if (formData.riskAssessment.areChildrenAtRisk) riskFactors.push('✓ Children at risk');
    if (formData.riskAssessment.hasSuicideThreats) riskFactors.push('✓ Suicide threats made');

    if (riskFactors.length > 0) {
      riskFactors.forEach(factor => {
        doc.text(factor, 20, yPos);
        yPos += 5;
      });
    } else {
      doc.text('No immediate risk factors detected.', 20, yPos);
      yPos += 5;
    }
    yPos += 5;

    // Section 6: Evidence List
    doc.setFillColor(240, 240, 240);
    doc.rect(15, yPos - 5, pageWidth - 30, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('6. EVIDENCE REGISTRY', 17, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const evidenceCount = submissionResult?.evidenceCount || evidenceFiles.length || 0;
    doc.text(`Total Evidence Files: ${evidenceCount}`, 20, yPos);
    yPos += 6;

    if (evidenceFiles.length > 0) {
      evidenceFiles.forEach((file, idx) => {
        doc.text(`${idx + 1}. ${file.name} (${(file.size / 1024).toFixed(1)} KB)`, 25, yPos);
        yPos += 5;
      });
    } else {
      doc.text('No evidence files uploaded.', 20, yPos);
      yPos += 5;
    }
    yPos += 10;

    // Footer
    doc.setFillColor(124, 145, 227);
    doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('ARAM - Intimate Partner Violence Support & Resources', pageWidth / 2, pageHeight - 12, { align: 'center' });
    doc.text('This document is confidential and for official use only.', pageWidth / 2, pageHeight - 7, { align: 'center' });

    // Save PDF
    doc.save(`FIR_${submissionResult?.reportId || 'REPORT'}.pdf`);
  };

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) setUser(JSON.parse(userInfo));
  }, []);

  // Emotional Step Labels
  const stepLabels = [
    { num: 1, label: 'Identity', icon: User },
    { num: 2, label: 'Incident', icon: Zap },
    { num: 3, label: 'Risk', icon: AlertTriangle },
    { num: 4, label: 'Evidence', icon: FileText },
    { num: 5, label: 'Victim', icon: Heart },
    { num: 6, label: 'Review', icon: Scale },
    { num: 7, label: 'Submit', icon: CheckCircle },
  ];

  // Quick Exit Keyboard Shortcut (Esc x2)
  useEffect(() => {
    let escCount = 0;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        escCount++;
        if (escCount >= 2) {
          window.location.href = 'https://www.google.com/search?q=weather+today';
        }
        setTimeout(() => { escCount = 0; }, 500);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [formData, setFormData] = useState({
    reporterMode: 'witness',
    privacyMode: 'anonymous',
    witness: { name: '', phone: '', address: '', relationshipToVictim: '', email: '' },
    incidentDescription: '',
    abuseType: [],
    frequency: 'first-time',
    location: '',
    locationCoordinates: {
      type: 'Point',
      coordinates: [78.9629, 20.5937] // [lng, lat] for GeoJSON
    },
    dateTime: '',
    victim: { name: '', gender: '', age: '', phone: '', address: '', maritalStatus: '', relationshipToAccused: '', childrenInvolved: { hasChildren: false, details: '' }, isPregnant: false },
    accused: { name: '', gender: '', ageApprox: '', relationshipToVictim: '', occupation: '', substanceAbuse: 'unknown', hasWeapon: 'unknown' },
    medical: { hasVisibleInjuries: false, injuryType: [], hospitalTreated: false, hospitalName: '' },
    riskAssessment: { isVictimInImmediateDanger: false, isAccusedNearby: false, areChildrenAtRisk: false, hasSuicideThreats: false },
    consent: { isInformationTrue: false, understandsFalseReporting: false, consentsToPoliceContact: false }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [evidenceFiles, setEvidenceFiles] = useState([]);

  const handleInputChange = (e, section = null, subSection = null) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => {
      if (section && subSection) {
        return { ...prev, [section]: { ...prev[section], [subSection]: { ...prev[section][subSection], [name]: type === 'checkbox' ? checked : value } } };
      } else if (section) {
        return { ...prev, [section]: { ...prev[section], [name]: type === 'checkbox' ? checked : value } };
      } else {
        return { ...prev, [name]: type === 'checkbox' ? checked : value };
      }
    });
  };

  const handleMultiSelect = (value, field, section = null) => {
    setFormData(prev => {
      const currentValues = section ? [...prev[section][field]] : [...prev[field]];
      const index = currentValues.indexOf(value);
      if (index === -1) {
        currentValues.push(value);
      } else {
        currentValues.splice(index, 1);
      }
      if (section) return { ...prev, [section]: { ...prev[section], [field]: currentValues } };
      return { ...prev, [field]: currentValues };
    });
  };

  const nextStep = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(prev => Math.min(prev + 1, totalSteps));
  };
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'video/mp4', 'video/quicktime', 'application/pdf'];

    const validFiles = files.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        alert(`File type not allowed: ${file.name}`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert(`File too large: ${file.name}. Maximum size is 10MB.`);
        return false;
      }
      return true;
    });

    setEvidenceFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setEvidenceFiles(prev => prev.filter((_, i) => i !== index));
  };

  const prevStep = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const userInfo = localStorage.getItem('userInfo');

      // Use FormData to handle file uploads
      const formDataToSend = new FormData();

      // Append all form fields as JSON
      formDataToSend.append('reportData', JSON.stringify(formData));

      // Append evidence files
      evidenceFiles.forEach((file, index) => {
        formDataToSend.append(`evidence`, file);
      });

      const headers = {};
      if (userInfo) {
        const { token } = JSON.parse(userInfo);
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('http://127.0.0.1:5001/api/witness/report', {
        method: 'POST',
        headers: headers,
        body: formDataToSend,
      });
      const data = await response.json();
      if (response.ok) {
        setSubmissionResult(data);
        setStep(8);
      } else {
        alert(`Error: ${data.message || 'Failed to submit report'}`);
      }
    } catch (err) {
      console.error('Submit error:', err);
      alert('Failed to connect to server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="form-step-container"
          >
            <div className="step-guidance">
              <h2><Shield size={28} /> Reporting Identity</h2>
              <p className="reassurance-microcopy">
                This helps us tailor the support process. Your legal identity is only shared
                if you choose identified mode. You can remain 100% anonymous.
              </p>
            </div>

            <div className="form-section-fluid">
              <label className="section-title">Reporting Context</label>
              <div className="guided-chip-grid">
                {[
                  { id: 'witness', title: 'Witness', desc: 'I saw or heard an incident', icon: Eye }
                ].map(mode => (
                  <div
                    key={mode.id}
                    className={`guided-card ${formData.reporterMode === mode.id ? 'active' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, reporterMode: mode.id }))}
                  >
                    <div className="card-icon-zone"><mode.icon size={20} /></div>
                    <div className="card-text-zone">
                      <span className="card-lbl">{mode.title}</span>
                      <span className="card-sub">{mode.desc}</span>
                    </div>
                    {formData.reporterMode === mode.id && <CheckCircle size={16} className="card-check-icon" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="form-section-fluid">
              <label className="section-title">Confidentiality Preference</label>
              <div className="guided-chip-grid">
                {[
                  { id: 'anonymous', title: 'Anonymous', desc: 'No personal details stored', icon: Shield },
                  { id: 'confidential', title: 'Confidential', desc: 'Securely stored for support', icon: Lock },
                  { id: 'identified', title: 'Identified', desc: 'Full disclosure for legal', icon: User }
                ].map(mode => (
                  <div
                    key={mode.id}
                    className={`guided-card ${formData.privacyMode === mode.id ? 'active' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, privacyMode: mode.id }))}
                  >
                    <div className="card-icon-zone"><mode.icon size={20} /></div>
                    <div className="card-text-zone">
                      <span className="card-lbl">{mode.title}</span>
                      <span className="card-sub">{mode.desc}</span>
                    </div>
                    {formData.privacyMode === mode.id && <CheckCircle size={16} className="card-check-icon" />}
                  </div>
                ))}
              </div>
            </div>

            {formData.privacyMode !== 'anonymous' && (
              <div className="details-drawer animate-fade">
                <div className="form-grid-2">
                  <div className="input-group-fluid">
                    <label>Full Name</label>
                    <input type="text" name="name" value={formData.witness.name} onChange={(e) => handleInputChange(e, 'witness')} placeholder="Enter your full name" />
                  </div>
                  <div className="input-group-fluid">
                    <label>Phone Number</label>
                    <input type="tel" name="phone" value={formData.witness.phone} onChange={(e) => handleInputChange(e, 'witness')} placeholder="+91 XXXX XXX XXX" />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="form-step-container"
          >
            <div className="step-guidance">
              <h2><Zap size={28} /> Incident Details</h2>
              <p className="reassurance-microcopy">
                Share only what you’re comfortable reporting. Your observations are vital
                for assessing immediate danger. <strong>Confidentiality is our priority.</strong>
              </p>
            </div>

            <div className="form-section-fluid">
              <label className="section-title">Type of Abuse Spotted</label>
              <div className="guided-chip-grid">
                {[
                  { id: 'physical', title: 'Physical', desc: 'Visible harm or assault', icon: AlertTriangle },
                  { id: 'emotional', title: 'Emotional', desc: 'Threats, control, or humiliation', icon: MessageSquare },
                  { id: 'financial', title: 'Financial', desc: 'Money restriction', icon: Lock },
                  { id: 'dowry-related', title: 'Dowry related', desc: 'Marriage-related coercion', icon: Scale }
                ].map(type => (
                  <div
                    key={type.id}
                    className={`guided-card ${formData.abuseType.includes(type.id) ? 'active' : ''}`}
                    onClick={() => handleMultiSelect(type.id, 'abuseType')}
                  >
                    <div className="card-icon-zone"><type.icon size={20} /></div>
                    <div className="card-text-zone">
                      <span className="card-lbl">{type.title}</span>
                      <span className="card-sub">{type.desc}</span>
                    </div>
                    {formData.abuseType.includes(type.id) && <CheckCircle size={16} className="card-check-icon" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="form-grid-2">
              <div className="input-group-fluid">
                <label>Date & Approximate Time</label>
                <input type="datetime-local" name="dateTime" value={formData.dateTime} onChange={handleInputChange} />
                <span className="helper-txt">Approximate date is acceptable if exact time is unknown.</span>
              </div>
              <div className="input-group-fluid">
                <label>Observation Frequency</label>
                <select name="frequency" value={formData.frequency} onChange={handleInputChange}>
                  <option value="first-time">First known incident</option>
                  <option value="repeated">Occasional pattern</option>
                  <option value="ongoing">Repeated abuse</option>
                  <option value="permanent">Ongoing danger</option>
                </select>
              </div>
            </div>

            <div className="input-group-fluid">
              <label>Location & Area Description</label>
              <textarea name="location" value={formData.location} onChange={handleInputChange} rows="2" placeholder="Nearby shops, buildings, or specific areas..." />
              <span className="helper-txt">Landmarks help responders locate the scene faster.</span>
            </div>

            <div className="map-selection-section">
              <label className="section-title"><MapPin size={18} /> Pin Accurate Location</label>
              <p className="reassurance-microcopy">Click on the map to pin the exact location of the incident. This helps responders reach precisely where needed.</p>

              <div className="map-selection-container">
                <MapContainer
                  center={[formData.locationCoordinates.coordinates[1], formData.locationCoordinates.coordinates[0]]}
                  zoom={13}
                  className="map-interaction-box"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <LocationPicker
                    position={{ lat: formData.locationCoordinates.coordinates[1], lng: formData.locationCoordinates.coordinates[0] }}
                    setPosition={(latlng) => {
                      setFormData(prev => ({
                        ...prev,
                        locationCoordinates: {
                          ...prev.locationCoordinates,
                          coordinates: [latlng.lng, latlng.lat]
                        }
                      }));
                    }}
                    onAddressFound={(address) => {
                      setFormData(prev => ({ ...prev, location: address }));
                    }}
                  />
                  <MapFocus position={{ lat: formData.locationCoordinates.coordinates[1], lng: formData.locationCoordinates.coordinates[0] }} />
                </MapContainer>

                <button
                  type="button"
                  className="btn-locate-me"
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(async (pos) => {
                        const { latitude, longitude } = pos.coords;
                        setFormData(prev => ({
                          ...prev,
                          locationCoordinates: {
                            ...prev.locationCoordinates,
                            coordinates: [longitude, latitude]
                          }
                        }));

                        try {
                          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
                          const data = await response.json();
                          setFormData(prev => ({ ...prev, location: data.display_name }));
                        } catch (err) {
                          console.error('Locate me reverse geocode failed:', err);
                        }
                      });
                    }
                  }}
                >
                  <Navigation size={14} /> Detect My Location
                </button>

                <div className="map-coords-badge">
                  <Zap size={14} />
                  Coordinates: {formData.locationCoordinates.coordinates[1].toFixed(4)}, {formData.locationCoordinates.coordinates[0].toFixed(4)}
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="form-step-container"
          >
            <div className="step-guidance">
              <h2><AlertTriangle size={28} /> Risk Assessment</h2>
              <p className="reassurance-microcopy">
                These markers help police prioritize the urgency of intervention.
                Answer to the best of your observation.
              </p>
            </div>

            <div className="risk-question-stack">
              {[
                { id: 'isVictimInImmediateDanger', label: 'Is the victim in danger RIGHT NOW?', icon: Zap },
                { id: 'isAccusedNearby', label: 'Is the accused present or nearby?', icon: MapPin },
                { id: 'areChildrenAtRisk', label: 'Are children involved or at risk?', icon: User },
                { id: 'hasSuicideThreats', label: 'Any suicide or death threats made?', icon: AlertTriangle }
              ].map(q => (
                <label key={q.id} className={`risk-card-check ${formData.riskAssessment[q.id] ? 'checked' : ''}`}>
                  <input
                    type="checkbox"
                    name={q.id}
                    checked={formData.riskAssessment[q.id]}
                    onChange={(e) => handleInputChange(e, 'riskAssessment')}
                  />
                  <div className="risk-card-content">
                    <q.icon size={20} />
                    <span>{q.label}</span>
                  </div>
                  {formData.riskAssessment[q.id] && <CheckCircle size={18} className="risk-indicator-icon" />}
                </label>
              ))}
            </div>

            <div className="form-section-fluid" style={{ marginTop: '32px' }}>
              <label className="section-title">Weapon Possession</label>
              <select name="hasWeapon" value={formData.accused.hasWeapon} onChange={(e) => handleInputChange(e, 'accused')}>
                <option value="unknown">Unknown</option>
                <option value="no">No weapon seen</option>
                <option value="yes">Yes, weapon present</option>
              </select>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="form-step-container"
          >
            <div className="step-guidance">
              <h2><FileText size={28} /> Evidence & Narrative</h2>
              <p className="reassurance-microcopy">
                Detailed descriptions and evidence greatly increase the legal strength
                of a report. Photos/Videos are hashed for tamper-proofing.
              </p>
            </div>

            <div className="input-group-fluid">
              <label>Incident Description (Narrative) *</label>
              <textarea
                name="incidentDescription"
                value={formData.incidentDescription}
                onChange={handleInputChange}
                rows="6"
                placeholder="What happened? How long has it been occurring? Any prior police complaints?"
              />
              <span className="helper-txt">Police rely heavily on this narrative for the FIR.</span>
            </div>

            <div className="form-section-fluid">
              <label className="section-title">Injury & Medical Info</label>
              <div className="risk-card-check" onClick={() => setFormData(prev => ({ ...prev, medical: { ...prev.medical, hasVisibleInjuries: !prev.medical.hasVisibleInjuries } }))} style={{ marginBottom: '16px' }}>
                <input type="checkbox" checked={formData.medical.hasVisibleInjuries} readOnly />
                <div className="risk-card-content">
                  <Smartphone size={20} />
                  <span>Are there visible injuries? (Bruises, burns, fractures)</span>
                </div>
              </div>

              {formData.medical.hasVisibleInjuries && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}>
                  <div className="input-group-fluid">
                    <label>Hospital Details (If treated)</label>
                    <input type="text" name="hospitalName" value={formData.medical.hospitalName} onChange={(e) => handleInputChange(e, 'medical')} placeholder="Hospital Name (if known)" />
                  </div>
                </motion.div>
              )}
            </div>

            <div className="evidence-upload-zone">
              <input
                type="file"
                id="evidence-upload"
                multiple
                accept="image/*,video/*,application/pdf"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <div
                className="upload-placeholder"
                onClick={() => document.getElementById('evidence-upload').click()}
                style={{ cursor: 'pointer' }}
              >
                <Upload size={32} />
                <div className="upload-txt">
                  <strong>Upload Evidence</strong>
                  <span>Photos, Videos, or PDFs (Max 10MB each)</span>
                </div>
                <button type="button" className="btn-nav-outline" onClick={(e) => { e.stopPropagation(); document.getElementById('evidence-upload').click(); }}>Browse Files</button>
              </div>

              {evidenceFiles.length > 0 && (
                <div className="uploaded-files-list" style={{ marginTop: '20px' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-secondary)' }}>Uploaded Files ({evidenceFiles.length})</h4>
                  {evidenceFiles.map((file, index) => (
                    <div key={index} className="file-preview-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'white', borderRadius: '12px', border: '1px solid var(--divider-soft)', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {file.type.startsWith('image/') && (
                          <img src={URL.createObjectURL(file)} alt="preview" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />
                        )}
                        {file.type.startsWith('video/') && <FileText size={24} />}
                        {file.type === 'application/pdf' && <FileText size={24} />}
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{file.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{(file.size / 1024).toFixed(1)} KB</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-color)' }}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        );
      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="form-step-container"
          >
            <div className="step-guidance">
              <h2><Heart size={28} /> Affected Persons</h2>
              <p className="reassurance-microcopy">
                Even partial details help authorities identify and reach the victim.
                All data is encrypted and handled with extreme privacy.
              </p>
            </div>

            <div className="form-split">
              <div className="split-column">
                <h3 className="sub-header-fluid">Victim Details</h3>
                <div className="input-group-fluid">
                  <label>Victim Name (if known)</label>
                  <input type="text" name="name" value={formData.victim.name} onChange={(e) => handleInputChange(e, 'victim')} />
                </div>
                <div className="form-grid-2">
                  <div className="input-group-fluid">
                    <label>Age approx</label>
                    <input type="number" name="age" value={formData.victim.age} onChange={(e) => handleInputChange(e, 'victim')} />
                  </div>
                  <div className="input-group-fluid">
                    <label>Gender</label>
                    <select name="gender" value={formData.victim.gender} onChange={(e) => handleInputChange(e, 'victim')}>
                      <option value="">Select</option>
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="risk-card-check" style={{ marginBottom: '12px' }} onClick={() => setFormData(prev => ({ ...prev, victim: { ...prev.victim, isPregnant: !prev.victim.isPregnant } }))}>
                  <input type="checkbox" checked={formData.victim.isPregnant} readOnly />
                  <span>Pregnancy status?</span>
                </div>
              </div>

              <div className="split-column">
                <h3 className="sub-header-fluid">Accused Details</h3>
                <div className="input-group-fluid">
                  <label>Accused Name/Alias</label>
                  <input type="text" name="name" value={formData.accused.name} onChange={(e) => handleInputChange(e, 'accused')} />
                </div>
                <div className="input-group-fluid">
                  <label>Relationship to Victim</label>
                  <select name="relationshipToVictim" value={formData.accused.relationshipToVictim} onChange={(e) => handleInputChange(e, 'accused')}>
                    <option value="">Select</option>
                    <option value="husband">Husband</option>
                    <option value="in-laws">In-laws</option>
                    <option value="partner">Partner</option>
                    <option value="relative">Relative</option>
                  </select>
                </div>
                <div className="input-group-fluid">
                  <label>Alcohol/Drug Abuse?</label>
                  <select name="substanceAbuse" value={formData.accused.substanceAbuse} onChange={(e) => handleInputChange(e, 'accused')}>
                    <option value="unknown">Unknown</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 6:
        // Calculate Risk Level for Review
        const getRiskLevel = () => {
          let score = 0;
          if (formData.riskAssessment.isVictimInImmediateDanger) score += 40;
          if (formData.riskAssessment.isAccusedNearby) score += 20;
          if (formData.riskAssessment.areChildrenAtRisk) score += 20;
          if (formData.riskAssessment.hasSuicideThreats) score += 20;
          if (formData.accused.hasWeapon === 'yes') score += 20;

          if (score >= 80) return { label: 'EMERGENCY', color: 'var(--danger-text)' };
          if (score >= 60) return { label: 'HIGH', color: 'var(--accent-color)' };
          if (score >= 30) return { label: 'MEDIUM', color: 'var(--warning-text)' };
          return { label: 'LOW', color: 'var(--success-text)' };
        };
        const risk = getRiskLevel();

        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="form-step-container"
          >
            <div className="step-guidance">
              <h2><Scale size={28} /> Final Review</h2>
              <p className="reassurance-microcopy">
                Review your report cards below. You can go back to any step if corrections are needed.
              </p>
            </div>

            <div className="review-risk-banner" style={{ borderColor: risk.color }}>
              <div className="risk-meta">
                <span className="risk-lbl">Estimated Risk Level</span>
                <span className="risk-val" style={{ color: risk.color }}>{risk.label}</span>
              </div>
              <p className="risk-note">This score is generated based on your incident data.</p>
            </div>

            <div className="review-grid">
              <div className="review-card">
                <h4>Reporter Info</h4>
                <p>Mode: {formData.reporterMode}</p>
                <p>Privacy: {formData.privacyMode}</p>
              </div>
              <div className="review-card">
                <h4>Incident</h4>
                <p>Type: {formData.abuseType.join(', ')}</p>
                <p>Location: {formData.location}</p>
              </div>
              <div className="review-card">
                <h4>Target Info</h4>
                <p>Victim: {formData.victim.name || 'Anonymous'}</p>
                <p>Accused: {formData.accused.name || 'Unknown'}</p>
              </div>
            </div>
          </motion.div>
        );
      case 7:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="form-step-container"
          >
            <div className="step-guidance">
              <h2><CheckCircle size={28} /> Consent & Submit</h2>
              <p className="reassurance-microcopy">
                By submitting this report, you act as a catalyst for safety.
                Ensure all details are true to the best of your knowledge.
              </p>
            </div>

            <div className="consent-stack">
              {[
                { id: 'isInformationTrue', label: 'I declare that the information provided is true.' },
                { id: 'understandsFalseReporting', label: 'I understand that false reporting is punishable by law.' },
                { id: 'consentsToPoliceContact', label: 'I consent to being contacted by authorities if needed.' }
              ].map(c => (
                <label key={c.id} className="consent-check-item">
                  <input
                    type="checkbox"
                    name={c.id}
                    checked={formData.consent[c.id]}
                    onChange={(e) => handleInputChange(e, 'consent')}
                  />
                  <span>{c.label}</span>
                </label>
              ))}
            </div>
          </motion.div>
        );
      case 8:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="success-feedback-fluid"
          >
            <div className="success-pulse">
              <CheckCircle size={64} />
            </div>
            <h2>Report Lodged Successfully</h2>
            <p className="success-msg">Your Report ID is <strong>{submissionResult?.reportId || 'ARAM-XXXX'}</strong>. A caseworker has been alerted.</p>

            {submissionResult?.assignedPoliceStation && (
              <div className="police-station-info" style={{
                background: '#F0F9FF',
                border: '1px solid #BAE6FD',
                padding: '20px',
                borderRadius: '12px',
                marginTop: '20px',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <MapPin size={20} style={{ color: '#0369A1' }} />
                  <h4 style={{ margin: 0, color: '#0C4A6E', fontSize: '1rem', fontWeight: 700 }}>Report Assigned To:</h4>
                </div>
                <p style={{ margin: '8px 0', fontSize: '0.95rem', fontWeight: 600, color: '#0C4A6E' }}>
                  {submissionResult.assignedPoliceStation.name}
                </p>
                <p style={{ margin: '4px 0', fontSize: '0.85rem', color: '#075985' }}>
                  {submissionResult.assignedPoliceStation.address}
                </p>
                {submissionResult.assignedPoliceStation.distance && (
                  <p style={{ margin: '8px 0 0 0', fontSize: '0.8rem', color: '#0369A1', fontWeight: 600 }}>
                    📍 Distance: {submissionResult.assignedPoliceStation.distance} km from incident location
                  </p>
                )}
                {submissionResult.assignedPoliceStation.phone && (
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#0369A1' }}>
                    📞 Contact: {submissionResult.assignedPoliceStation.phone}
                  </p>
                )}
              </div>
            )}

            <div className="next-steps-info">
              <h4>What happens next?</h4>
              <ul>
                <li>Incident will be analyzed by ARAM Response Team.</li>
                <li>Authorities will be notified if HIGH or EMERGENCY risk is detected.</li>
                <li>You will receive an update on the dashboard.</li>
              </ul>
            </div>

            <div className="success-nav">
              <button className="btn-nav-primary" onClick={() => navigate('/witness')}>Go to Dashboard</button>
              <button className="btn-nav-outline" onClick={generateFIRPDF}>Download FIR Copy</button>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="witness-report-dashboard-flow">
      {/* Shared Dashboard Navbar */}
      <nav className="navbar-fluid">
        <div className="nav-inner-fluid">
          <div className="nav-left-zone">
            <Link to="/">
              <img src={aramLogo} alt="ARAM" style={{ height: '32px' }} />
            </Link>
            <div className="breadcrumb-fluid">
              <Link to="/witness">Dashboard</Link>
              <ChevronRight size={14} />
              <span>Safety Report</span>
            </div>
          </div>
          <div className="nav-right-zone">
            <button
              className="quick-exit-trigger"
              onClick={() => window.location.href = 'https://www.google.com/search?q=weather+today'}
              title="Esc x2 for immediate exit"
            >
              <X size={16} /> Quick Exit
            </button>
          </div>
        </div>
      </nav>

      <div className="report-flow-layout">
        <div className="report-main-column">
          {/* Progress Indicator */}
          {step < 8 && (
            <div className="stepper-track-fluid">
              <div className="stepper-line">
                <div className="stepper-fill" style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}></div>
              </div>
              {stepLabels.map(s => (
                <div key={s.num} className={`step-node ${step === s.num ? 'active' : ''} ${step > s.num ? 'done' : ''}`}>
                  <div className="node-circle">
                    {step > s.num ? <CheckCircle size={16} /> : s.num}
                  </div>
                  <span className="node-lbl">{s.label}</span>
                </div>
              ))}
            </div>
          )}

          <div className="form-card-fluid">
            <form onSubmit={step === 7 ? handleSubmit : (e) => e.preventDefault()}>
              <AnimatePresence mode="wait">
                {renderStep()}
              </AnimatePresence>

              {step < 8 && (
                <div className="form-footer-nav">
                  <p className="nav-assurance">You can review and edit all details before final submission.</p>
                  <div className="nav-button-group">
                    {step > 1 && (
                      <button type="button" className="btn-nav-outline" onClick={prevStep}>
                        <ArrowLeft size={18} /> Back
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn-nav-primary"
                      onClick={step === 7 ? handleSubmit : nextStep}
                      disabled={
                        isSubmitting ||
                        (step === 7 && (!formData.consent.isInformationTrue || !formData.consent.understandsFalseReporting || !formData.consent.consentsToPoliceContact))
                      }
                      style={{ marginLeft: 'auto' }}
                    >
                      {step === 7 ? (isSubmitting ? 'Submitting...' : 'Submit Official Report') : 'Next Step'}
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Safety & Confidentiality Bar */}
      <footer className="footer-confidential-bar">
        <div className="conf-left">
          <div className="conf-item"><Lock size={14} /> <span>Data Encrypted</span></div>
          <div className="conf-item"><Shield size={14} /> <span>Anonymous Reporting Available</span></div>
        </div>
        <div className="conf-right">
          <span className="support-txt">Confidential Support Line:</span>
          <span className="support-num">181 (NCW)</span>
        </div>
      </footer>
    </div>
  );
};

export default WitnessReport;
