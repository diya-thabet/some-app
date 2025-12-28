import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
    const { t } = useLanguage();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    {/* Brand */}
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <div className="logo-icon" style={{ width: '40px', height: '40px', fontSize: '1.25rem' }}>ح</div>
                            <span className="logo-text gradient-text" style={{ fontSize: '1.5rem' }}>Hirfa</span>
                        </div>
                        <p className="footer-desc">
                            {t('footer.desc')}
                        </p>
                        <div className="social-links">
                            <a href="#" className="social-link" aria-label="Facebook">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="social-link" aria-label="Instagram">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="social-link" aria-label="Twitter">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="social-link" aria-label="LinkedIn">
                                <Linkedin size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-column">
                        <h4>{t('footer.quickLinks')}</h4>
                        <ul className="footer-links">
                            <li><Link to="/">{t('nav.home')}</Link></li>
                            <li><Link to="/jobs">{t('nav.services')}</Link></li>
                            <li><Link to="/community">{t('dashboard.community')}</Link></li>
                            <li><Link to="/about">{t('nav.about')}</Link></li>
                        </ul>
                    </div>

                    {/* For Workers */}
                    <div className="footer-column">
                        <h4>{t('auth.provider.title')}</h4>
                        <ul className="footer-links">
                            <li><Link to="/register">{t('hero.becomeProvider')}</Link></li>
                            <li><Link to="/jobs">{t('jobs.browseJobs')}</Link></li>
                            <li><Link to="/community">{t('community.title')}</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="footer-column">
                        <h4>{t('footer.legal')}</h4>
                        <ul className="footer-links">
                            <li><Link to="/terms">{t('footer.terms')}</Link></li>
                            <li><Link to="/privacy">{t('footer.privacy')}</Link></li>
                            <li><Link to="/contact">{t('nav.contact')}</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="footer-copyright">
                        {t('footer.copyright')}
                    </p>
                    <div className="made-in-tunisia">
                        <span className="tunisia-flag">🇹🇳</span>
                        <span>{t('footer.madeInTunisia')}</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
