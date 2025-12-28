import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Phone, ArrowRight, Loader } from 'lucide-react';

export default function LoginPage() {
    const { t, isRTL } = useLanguage();
    const { login } = useAuth();
    const navigate = useNavigate();

    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (phoneNumber.length !== 8) {
            setError('Phone number must be 8 digits');
            return;
        }

        setLoading(true);
        try {
            await login(phoneNumber);
            navigate('/dashboard');
        } catch (err) {
            setError('Login failed. Please try again.');
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
                        <h1 className="auth-title">{t('auth.loginTitle')}</h1>
                        <p className="auth-subtitle">{t('auth.loginSubtitle')}</p>
                    </div>

                    <form onSubmit={handleSubmit}>
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
                                <Loader size={20} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                            ) : (
                                <>
                                    {t('auth.loginBtn')}
                                    <ArrowRight size={20} style={{ transform: isRTL ? 'rotate(180deg)' : 'none' }} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <span>{t('auth.noAccount')} </span>
                        <Link to="/register">{t('nav.register')}</Link>
                    </div>
                </div>

                {/* Demo hint */}
                <div style={{
                    marginTop: '24px',
                    padding: '16px',
                    background: 'rgba(129, 178, 154, 0.1)',
                    borderRadius: '12px',
                    textAlign: 'center',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)'
                }}>
                    <strong style={{ color: 'var(--accent)' }}>Demo Mode:</strong>
                    <br />
                    Try: <code style={{ background: 'var(--bg-tertiary)', padding: '2px 6px', borderRadius: '4px' }}>12345678</code> (Provider)
                    or <code style={{ background: 'var(--bg-tertiary)', padding: '2px 6px', borderRadius: '4px' }}>87654321</code> (Customer)
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
