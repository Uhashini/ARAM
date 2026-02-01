import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './ContentPage.css';

const Helplines = () => {
  const nationalHelplines = [
    {
      name: "National Domestic Violence Hotline",
      description: "24/7 confidential support for domestic violence survivors and their loved ones",
      phone: "1-800-799-7233",
      text: "START to 88788",
      website: "thehotline.org",
      chat: "Available on website",
      languages: "200+ languages available",
      services: [
        "Crisis intervention and safety planning",
        "Information about domestic violence",
        "Referrals to local resources",
        "Support for friends and family"
      ]
    },
    {
      name: "National Sexual Assault Hotline (RAINN)",
      description: "Free, confidential support for survivors of sexual assault",
      phone: "1-800-656-4673",
      text: "Not available",
      website: "rainn.org",
      chat: "Available on website",
      languages: "English and Spanish",
      services: [
        "Crisis support and counseling",
        "Information about sexual assault",
        "Referrals to local services",
        "Support during legal proceedings"
      ]
    },
    {
      name: "Crisis Text Line",
      description: "Free, 24/7 crisis support via text message",
      phone: "Not available",
      text: "HOME to 741741",
      website: "crisistextline.org",
      chat: "Text-based service",
      languages: "English and Spanish",
      services: [
        "Crisis counseling via text",
        "Emotional support",
        "De-escalation techniques",
        "Resource referrals"
      ]
    },
    {
      name: "Love is Respect",
      description: "Support for teens and young adults experiencing dating abuse",
      phone: "1-866-331-9474",
      text: "LOVEIS to 22522",
      website: "loveisrespect.org",
      chat: "Available on website",
      languages: "English and Spanish",
      services: [
        "Dating abuse support",
        "Healthy relationship education",
        "Safety planning for teens",
        "Support for parents and friends"
      ]
    }
  ];

  const specializedHelplines = [
    {
      category: "LGBTQ+ Support",
      helplines: [
        {
          name: "LGBT National Domestic Violence Hotline",
          phone: "1-800-832-1901",
          description: "Support for LGBTQ+ survivors of intimate partner violence"
        },
        {
          name: "Trans Lifeline",
          phone: "877-565-8860",
          description: "Crisis support for transgender individuals"
        }
      ]
    },
    {
      category: "Immigration Support",
      helplines: [
        {
          name: "National Immigration Forum",
          phone: "202-347-0040",
          description: "Resources for immigrant survivors of domestic violence"
        },
        {
          name: "ASISTA Immigration Assistance",
          phone: "515-244-3371",
          description: "Legal assistance for immigrant survivors"
        }
      ]
    },
    {
      category: "Elder Abuse",
      helplines: [
        {
          name: "Eldercare Locator",
          phone: "1-800-677-1116",
          description: "Resources for elder abuse and neglect"
        },
        {
          name: "National Adult Protective Services",
          phone: "Contact local APS",
          description: "Protection services for vulnerable adults"
        }
      ]
    },
    {
      category: "Substance Abuse",
      helplines: [
        {
          name: "SAMHSA National Helpline",
          phone: "1-800-662-4357",
          description: "Treatment referrals for substance abuse and mental health"
        }
      ]
    }
  ];

  const internationalHelplines = [
    {
      country: "Canada",
      helplines: [
        {
          name: "Assaulted Women's Helpline",
          phone: "1-866-863-0511",
          description: "24/7 crisis support in Ontario"
        },
        {
          name: "Kids Help Phone",
          phone: "1-800-668-6868",
          description: "Support for children and teens"
        }
      ]
    },
    {
      country: "United Kingdom",
      helplines: [
        {
          name: "National Domestic Abuse Helpline",
          phone: "0808 2000 247",
          description: "24/7 support for domestic abuse survivors"
        },
        {
          name: "Rape Crisis England & Wales",
          phone: "0808 802 9999",
          description: "Support for sexual violence survivors"
        }
      ]
    },
    {
      country: "Australia",
      helplines: [
        {
          name: "1800RESPECT",
          phone: "1800 737 732",
          description: "24/7 domestic and sexual violence counseling"
        },
        {
          name: "Lifeline Australia",
          phone: "13 11 14",
          description: "Crisis support and suicide prevention"
        }
      ]
    }
  ];

  const safetyTips = [
    "Use a phone your abuser doesn't have access to",
    "Call from a safe location where you won't be overheard",
    "Have a safety plan ready in case you need to leave quickly",
    "Clear your browser history after visiting support websites",
    "Consider using a public computer at a library",
    "Trust your instincts about when it's safe to call",
    "Know that you can hang up at any time",
    "Remember that all calls are confidential"
  ];

  return (
    <div className="content-page">
      <motion.div 
        className="content-header"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Link to="/" className="back-link">← Back to Home</Link>
        <h1>National Helplines</h1>
        <p>24/7 helplines that can support you wherever you live</p>
      </motion.div>

      <div className="content-container">
        <motion.div 
          className="intro-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2>Crisis Support Available 24/7</h2>
          <p>
            These national helplines provide free, confidential support to survivors of domestic violence, 
            sexual assault, and other forms of abuse. Trained advocates are available around the clock to 
            provide crisis intervention, safety planning, and referrals to local resources.
          </p>
        </motion.div>

        <div className="warning-box">
          <h3>🚨 In Immediate Danger?</h3>
          <p>
            If you are in immediate physical danger, call <strong>911</strong> or your local emergency number. 
            If you cannot speak safely, try texting 911 if available in your area, or call and leave the line open 
            so dispatchers can hear what's happening.
          </p>
        </div>

        <div className="helplines-section">
          <h2>National Crisis Helplines</h2>
          <div className="helplines-grid">
            {nationalHelplines.map((helpline, index) => (
              <motion.div
                key={helpline.name}
                className="helpline-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(74, 50, 103, 0.15)" }}
              >
                <h3>{helpline.name}</h3>
                <p className="helpline-description">{helpline.description}</p>
                
                <div className="contact-methods">
                  {helpline.phone !== "Not available" && (
                    <div className="contact-method">
                      <strong>📞 Phone:</strong> <span className="phone-number">{helpline.phone}</span>
                    </div>
                  )}
                  {helpline.text !== "Not available" && (
                    <div className="contact-method">
                      <strong>💬 Text:</strong> {helpline.text}
                    </div>
                  )}
                  <div className="contact-method">
                    <strong>🌐 Website:</strong> {helpline.website}
                  </div>
                  <div className="contact-method">
                    <strong>💻 Chat:</strong> {helpline.chat}
                  </div>
                  <div className="contact-method">
                    <strong>🌍 Languages:</strong> {helpline.languages}
                  </div>
                </div>

                <div className="services-section">
                  <h4>Services Provided:</h4>
                  <ul>
                    {helpline.services.map((service, idx) => (
                      <li key={idx}>{service}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div 
          className="specialized-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <h2>Specialized Support Services</h2>
          <div className="specialized-grid">
            {specializedHelplines.map((category, index) => (
              <div key={category.category} className="specialized-category">
                <h3>{category.category}</h3>
                <div className="specialized-helplines">
                  {category.helplines.map((helpline, idx) => (
                    <div key={helpline.name} className="specialized-helpline">
                      <h4>{helpline.name}</h4>
                      <p><strong>Phone:</strong> {helpline.phone}</p>
                      <p>{helpline.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="international-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <h2>International Helplines</h2>
          <div className="international-grid">
            {internationalHelplines.map((country, index) => (
              <div key={country.country} className="country-section">
                <h3>{country.country}</h3>
                <div className="country-helplines">
                  {country.helplines.map((helpline, idx) => (
                    <div key={helpline.name} className="international-helpline">
                      <h4>{helpline.name}</h4>
                      <p><strong>Phone:</strong> {helpline.phone}</p>
                      <p>{helpline.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="safety-tips-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          <h2>Safety Tips for Calling Helplines</h2>
          <div className="info-box">
            <h3>🔒 Calling Safely</h3>
            <ul>
              {safetyTips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </motion.div>

        <motion.div 
          className="help-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
        >
          <h2>Need More Resources?</h2>
          <p>Find additional support services and resources in your local area.</p>
          <div className="help-buttons">
            <Link to="/local-services" className="help-btn primary">Find Local Services</Link>
            <Link to="/victim-dashboard" className="help-btn secondary">Get Support Tools</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Helplines;