import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Phone, User, ArrowRight, Loader, Briefcase, Search } from 'lucide-react';

export default function RegisterPage() {
    const { t, isRTL } = useLanguage();
    const { register } = useAuth();
    const navigate = useNavigate();

    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!fullName.trim()) {
            setError('Please enter your name');
            return;
        }

        if (phoneNumber.length !== 8) {
            setError('Phone number must be 8 digits');
            return;
        }

        if (!role) {
            setError('Please select your role');
            return;
        }

        setLoading(true);
        try {
            await register(fullName, phoneNumber, role);
            navigate('/dashboard');
        } catch (err) {
            setError('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <motion.div
                className="auth-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                {/* Logo */}
                <Link to="/" className="logo-section" style={{ justifyContent: 'center', marginBottom: '32px' }}>
                    <div className="logo-icon">ح</div>
                    <span className="logo-text gradient-text">Hirfa</span>
                </Link>

                <div className="auth-card">
                    <div className="auth-header">
                        <h1 className="auth-title">{t('auth.registerTitle')}</h1>
                        <p className="auth-subtitle">{t('auth.registerSubtitle')}</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Full Name */}
                        <div className="form-group">
                            <label className="form-label">{t('auth.nameLabel')}</label>
                            <div style={{ position: 'relative' }}>
                                <User
                                    size={20}
                                    style={{
                                        position: 'absolute',
                                        left: isRTL ? 'auto' : '16px',
                                        right: isRTL ? '16px' : 'auto',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: 'var(--text-muted)'
                                    }}
                                />
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder={t('auth.namePlaceholder')}
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    style={{
                                        paddingLeft: isRTL ? '16px' : '48px',
                                        paddingRight: isRTL ? '48px' : '16px'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div className="form-group">
                            <label className="form-label">{t('auth.phoneLabel')}</label>
                            <div style={{ position: 'relative' }}>
                                <Phone
                                    size={20}
                                    style={{
                                        position: 'absolute',
                                        left: isRTL ? 'auto' : '16px',
                                        right: isRTL ? '16px' : 'auto',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: 'var(--text-muted)'
                                    }}
                                />
                                <input
                                    type="tel"
                                    className="form-input"
                                    placeholder={t('auth.phonePlaceholder')}
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 8))}
                                    style={{
                                        paddingLeft: isRTL ? '16px' : '48px',
                                        paddingRight: isRTL ? '48px' : '16px'
                                    }}
                                    dir="ltr"
                                />
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                                🇹🇳 +216
                            </p>
                        </div>

                        {/* Role Selection */}
                        <div className="form-group">
                            <label className="form-label">{t('auth.roleLabel')}</label>
                            <div className="role-selector">
                                <div
                                    className={`role-option ${role === 'CUSTOMER' ? 'selected' : ''}`}
                                    onClick={() => setRole('CUSTOMER')}
                                >
                                    <div className="role-icon">
                                        <Search size={32} color={role === 'CUSTOMER' ? 'var(--primary)' : 'var(--text-muted)'} />
                                    </div>
                                    <div className="role-title">{t('auth.customer.title')}</div>
                                    <div className="role-desc">{t('auth.customer.desc')}</div>
                                </div>

                                <div
                                    className={`role-option ${role === 'PROVIDER' ? 'selected' : ''}`}
                                    onClick={() => setRole('PROVIDER')}
                                >
                                    <div className="role-icon">
                                        <Briefcase size={32} color={role === 'PROVIDER' ? 'var(--primary)' : 'var(--text-muted)'} />
                                    </div>
                                    <div className="role-title">{t('auth.provider.title')}</div>
                                    <div className="role-desc">{t('auth.provider.desc')}</div>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div style={{
                                padding: '12px',
                                background: 'rgba(230, 57, 70, 0.1)',
                                borderRadius: '8px',
                                color: 'var(--danger)',
                                marginBottom: '16px',
                                fontSize: '0.9rem'
                            }}>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={loading}
                            style={{ width: '100%' }}
                        >
                            {loading ? (
                                <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} />
                            ) : (
                                <>
                                    {t('auth.registerBtn')}
                                    <ArrowRight size={20} style={{ transform: isRTL ? 'rotate(180deg)' : 'none' }} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <span>{t('auth.hasAccount')} </span>
                        <Link to="/login">{t('nav.login')}</Link>
                    </div>
                </div>
            </motion.div>

            <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}
