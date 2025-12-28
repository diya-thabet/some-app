import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage, LANGUAGES } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, Sun, Moon, ChevronDown, User, LogOut } from 'lucide-react';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const { language, setLanguage, t } = useLanguage();
    const { theme, toggleTheme, isDark } = useTheme();
    const { user, isAuthenticated, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
        setUserMenuOpen(false);
    }, [location]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navLinks = [
        { path: '/', label: t('nav.home') },
        { path: '/jobs', label: t('nav.services') },
        { path: '/community', label: t('dashboard.community') },
        { path: '/about', label: t('nav.about') }
    ];

    return (
        <>
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <div className="container nav-content">
                    {/* Logo */}
                    <Link to="/" className="logo-section">
                        <div className="logo-icon">ح</div>
                        <span className="logo-text gradient-text">Hirfa</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="nav-links">
                        {navLinks.map(link => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="nav-actions">
                        {/* Language Toggle */}
                        <div className="lang-toggle">
                            {Object.values(LANGUAGES).map(lang => (
                                <button
                                    key={lang.code}
                                    className={`lang-btn ${language === lang.code ? 'active' : ''}`}
                                    onClick={() => setLanguage(lang.code)}
                                >
                                    {lang.name}
                                </button>
                            ))}
                        </div>

                        {/* Theme Toggle */}
                        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                            {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {/* Auth Buttons or User Menu */}
                        {isAuthenticated ? (
                            <div className="user-menu-wrapper" style={{ position: 'relative' }}>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                >
                                    <User size={18} />
                                    <span>{user.fullName.split(' ')[0]}</span>
                                    <ChevronDown size={16} />
                                </button>

                                {userMenuOpen && (
                                    <div className="user-dropdown" style={{
                                        position: 'absolute',
                                        top: '100%',
                                        right: 0,
                                        marginTop: '8px',
                                        background: 'var(--bg-card)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: 'var(--radius-md)',
                                        padding: '8px',
                                        minWidth: '180px',
                                        zIndex: 100
                                    }}>
                                        <Link
                                            to="/dashboard"
                                            className="dropdown-item"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                padding: '10px 12px',
                                                borderRadius: '8px',
                                                color: 'var(--text-primary)',
                                                transition: 'background 0.2s'
                                            }}
                                        >
                                            {t('nav.dashboard')}
                                        </Link>
                                        <Link
                                            to="/profile"
                                            className="dropdown-item"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                padding: '10px 12px',
                                                borderRadius: '8px',
                                                color: 'var(--text-primary)',
                                                transition: 'background 0.2s'
                                            }}
                                        >
                                            {t('dashboard.profile')}
                                        </Link>
                                        <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '8px 0' }} />
                                        <button
                                            onClick={handleLogout}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                padding: '10px 12px',
                                                borderRadius: '8px',
                                                color: 'var(--danger)',
                                                background: 'transparent',
                                                border: 'none',
                                                width: '100%',
                                                cursor: 'pointer',
                                                fontSize: '1rem'
                                            }}
                                        >
                                            <LogOut size={18} />
                                            {t('nav.logout')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-secondary btn-sm">
                                    {t('nav.login')}
                                </Link>
                                <Link to="/register" className="btn btn-primary btn-sm">
                                    {t('nav.register')}
                                </Link>
                            </>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            className="mobile-menu-btn"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation */}
            <div className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
                <button
                    className="mobile-menu-btn"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ position: 'absolute', top: '24px', right: '24px' }}
                >
                    <X size={24} />
                </button>

                {navLinks.map(link => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className="mobile-nav-link"
                    >
                        {link.label}
                    </Link>
                ))}

                <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '16px 0' }} />

                {isAuthenticated ? (
                    <>
                        <Link to="/dashboard" className="mobile-nav-link">
                            {t('nav.dashboard')}
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="mobile-nav-link"
                            style={{ background: 'transparent', border: 'none', color: 'var(--danger)', textAlign: 'left', cursor: 'pointer' }}
                        >
                            {t('nav.logout')}
                        </button>
                    </>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                        <Link to="/login" className="btn btn-secondary">
                            {t('nav.login')}
                        </Link>
                        <Link to="/register" className="btn btn-primary">
                            {t('nav.register')}
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
