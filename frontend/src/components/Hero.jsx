import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowRight, Sparkles, Users, Briefcase, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
    const { t, isRTL } = useLanguage();

    return (
        <section className="hero-section">
            {/* Background Effects */}
            <div className="hero-bg">
                <div className="hero-gradient hero-gradient-1"></div>
                <div className="hero-gradient hero-gradient-2"></div>
                <div className="hero-pattern"></div>
            </div>

            <div className="container">
                <div className="hero-content">
                    {/* Text Content */}
                    <motion.div
                        className="hero-text"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="hero-badge">
                            <Sparkles size={18} />
                            <span>{t('hero.badge')}</span>
                        </div>

                        <h1 className="hero-title">
                            {t('hero.title1')} <br />
                            <span className="gradient-text">{t('hero.title2')}</span>
                        </h1>

                        <p className="hero-subtitle">
                            {t('hero.subtitle')}
                        </p>

                        <div className="hero-buttons">
                            <Link to="/jobs" className="btn btn-primary btn-lg">
                                {t('hero.findProvider')}
                                <ArrowRight size={20} style={{ transform: isRTL ? 'rotate(180deg)' : 'none' }} />
                            </Link>
                            <Link to="/register" className="btn btn-secondary btn-lg">
                                {t('hero.becomeProvider')}
                            </Link>
                        </div>

                        <div className="hero-stats">
                            <div className="stat-item">
                                <div className="stat-value">2,500+</div>
                                <div className="stat-label">{t('hero.stats.providers')}</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-value">15,000+</div>
                                <div className="stat-label">{t('hero.stats.jobs')}</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-value">0%</div>
                                <div className="stat-label">{t('hero.stats.fees')}</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Visual Side */}
                    <motion.div
                        className="hero-visual"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="hero-image-wrapper">
                            {/* Main Card */}
                            <div className="glass-card" style={{
                                padding: '32px',
                                textAlign: 'center',
                                borderRadius: '24px'
                            }}>
                                <div style={{
                                    width: '120px',
                                    height: '120px',
                                    margin: '0 auto 24px',
                                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '3rem',
                                    color: 'white'
                                }}>
                                    🔧
                                </div>
                                <h3 style={{ marginBottom: '8px' }}>أحمد بن علي</h3>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>سباك محترف</p>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: '24px',
                                    marginBottom: '16px'
                                }}>
                                    <div>
                                        <div style={{ fontWeight: '700', color: 'var(--accent)' }}>4.9 ⭐</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>التقييم</div>
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '700', color: 'var(--primary)' }}>127</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>خدمة</div>
                                    </div>
                                </div>
                                <span style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '6px 12px',
                                    background: 'rgba(129, 178, 154, 0.2)',
                                    borderRadius: '100px',
                                    color: 'var(--accent)',
                                    fontSize: '0.85rem',
                                    fontWeight: '600'
                                }}>
                                    ✓ موثق
                                </span>
                            </div>

                            {/* Floating Cards */}
                            <motion.div
                                className="hero-card hero-card-1"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white'
                                    }}>
                                        <Briefcase size={20} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>خدمة جديدة!</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>إصلاح مكيف - 80 د.ت</div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                className="hero-card hero-card-2"
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white'
                                    }}>
                                        <Award size={20} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>شارة جديدة! 🏆</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>بطل الحي</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
