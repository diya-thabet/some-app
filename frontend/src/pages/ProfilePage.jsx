import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import {
    CheckCircle,
    Star,
    Award,
    Edit,
    Briefcase,
    Calendar
} from 'lucide-react';

export default function ProfilePage() {
    const { t, language } = useLanguage();
    const { user, isProvider } = useAuth();

    if (!user) {
        return (
            <div className="page-wrapper">
                <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
                    <h2>{language === 'ar' ? 'سجل دخول للمتابعة' : 'Please login to continue'}</h2>
                    <Link to="/login" className="btn btn-primary" style={{ marginTop: '24px' }}>
                        {t('nav.login')}
                    </Link>
                </div>
            </div>
        );
    }

    const badges = [
        {
            id: 'flash',
            name: language === 'ar' ? 'البرق ⚡' : 'The Flash ⚡',
            desc: language === 'ar' ? 'أسرع استجابة' : 'Fastest response time',
            unlocked: user.badges?.includes('The Flash')
        },
        {
            id: 'hero',
            name: language === 'ar' ? 'بطل الحي 🦸' : 'Neighborhood Hero 🦸',
            desc: language === 'ar' ? '50+ خدمة في نفس الحي' : '50+ jobs in same area',
            unlocked: user.badges?.includes('Neighborhood Hero')
        },
        {
            id: '5star',
            name: language === 'ar' ? 'نجم الخمسة ⭐' : '5-Star Pro ⭐',
            desc: language === 'ar' ? 'تقييم 5 نجوم متواصل' : 'Consistent 5-star rating',
            unlocked: false
        },
        {
            id: 'trusted',
            name: language === 'ar' ? 'موثوق 🔒' : 'Trusted Worker 🔒',
            desc: language === 'ar' ? 'هوية موثقة' : 'Verified identity',
            unlocked: user.verified
        }
    ];

    return (
        <div className="page-wrapper">
            <div className="container" style={{ paddingTop: '32px', paddingBottom: '64px' }}>
                {/* Profile Header */}
                <motion.div
                    className="profile-header"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="profile-content">
                        <div className="profile-avatar">
                            {user.fullName.charAt(0)}
                        </div>
                        <div className="profile-info">
                            <h1 className="profile-name">{user.fullName}</h1>
                            <p className="profile-role">
                                {isProvider ? t('auth.provider.title') : t('auth.customer.title')}
                            </p>
                            {user.verified && (
                                <span className="profile-verified">
                                    <CheckCircle size={16} />
                                    {t('profile.verified')}
                                </span>
                            )}
                        </div>

                        <button
                            className="btn btn-secondary"
                            style={{
                                marginLeft: 'auto',
                                background: 'rgba(255,255,255,0.2)',
                                borderColor: 'rgba(255,255,255,0.3)',
                                color: 'white'
                            }}
                        >
                            <Edit size={18} />
                            {t('profile.editProfile')}
                        </button>
                    </div>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    {/* Fairness Score */}
                    <motion.div
                        className="fairness-score"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                    >
                        <div className="fairness-header">
                            <div>
                                <h3 style={{ marginBottom: '4px' }}>{t('profile.fairnessScore')}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    {language === 'ar'
                                        ? 'مؤشر سلوكك في المنصة'
                                        : 'Your platform behavior score'}
                                </p>
                            </div>
                            <div className="fairness-value">{user.fairnessScore}</div>
                        </div>
                        <div className="fairness-bar">
                            <div
                                className="fairness-fill"
                                style={{ width: `${user.fairnessScore}%` }}
                            />
                        </div>
                        <p style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {user.fairnessScore >= 80
                                ? (language === 'ar' ? '✨ ممتاز! أنت عضو مميز.' : '✨ Excellent! You\'re a top member.')
                                : (language === 'ar' ? 'حسّن سلوكك للحصول على أفضلية.' : 'Improve to get priority.')}
                        </p>
                    </motion.div>

                    {/* Quick Stats */}
                    <motion.div
                        className="card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.15 }}
                    >
                        <h3 style={{ marginBottom: '20px' }}>
                            {language === 'ar' ? 'إحصائياتك' : 'Your Stats'}
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div style={{
                                padding: '16px',
                                background: 'var(--bg-tertiary)',
                                borderRadius: 'var(--radius-md)',
                                textAlign: 'center'
                            }}>
                                <Briefcase size={24} color="var(--primary)" style={{ marginBottom: '8px' }} />
                                <div style={{ fontWeight: '700', fontSize: '1.5rem' }}>47</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    {t('dashboard.stats.completedJobs')}
                                </div>
                            </div>
                            <div style={{
                                padding: '16px',
                                background: 'var(--bg-tertiary)',
                                borderRadius: 'var(--radius-md)',
                                textAlign: 'center'
                            }}>
                                <Star size={24} color="var(--secondary)" style={{ marginBottom: '8px' }} />
                                <div style={{ fontWeight: '700', fontSize: '1.5rem' }}>4.9</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    {t('dashboard.stats.rating')}
                                </div>
                            </div>
                            <div style={{
                                padding: '16px',
                                background: 'var(--bg-tertiary)',
                                borderRadius: 'var(--radius-md)',
                                textAlign: 'center'
                            }}>
                                <Award size={24} color="var(--accent)" style={{ marginBottom: '8px' }} />
                                <div style={{ fontWeight: '700', fontSize: '1.5rem' }}>{user.badges?.length || 0}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    {t('profile.badges')}
                                </div>
                            </div>
                            <div style={{
                                padding: '16px',
                                background: 'var(--bg-tertiary)',
                                borderRadius: 'var(--radius-md)',
                                textAlign: 'center'
                            }}>
                                <Calendar size={24} color="var(--info)" style={{ marginBottom: '8px' }} />
                                <div style={{ fontWeight: '700', fontSize: '1rem' }}>
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    {language === 'ar' ? 'عضو من' : 'Member since'}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Badges Section */}
                <motion.div
                    className="badges-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    style={{ marginTop: '24px' }}
                >
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>
                        {t('profile.badges')} 🏆
                    </h2>
                    <div className="badges-grid">
                        {badges.map((badge, index) => (
                            <motion.div
                                key={badge.id}
                                className="badge-item"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                                style={{
                                    opacity: badge.unlocked ? 1 : 0.5,
                                    filter: badge.unlocked ? 'none' : 'grayscale(100%)'
                                }}
                            >
                                <span className="badge-icon">{badge.name.slice(-2)}</span>
                                <div>
                                    <div className="badge-name">{badge.name.slice(0, -2)}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        {badge.desc}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Reviews Section */}
                <motion.div
                    className="card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.25 }}
                    style={{ marginTop: '24px' }}
                >
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>
                        {t('profile.reviews')}
                    </h2>

                    {/* Sample Reviews */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {[
                            {
                                name: 'سارة المنصوري',
                                rating: 5,
                                text: language === 'ar'
                                    ? 'خدمة ممتازة! جا في الوقت وخدم بنظافة.'
                                    : 'Excellent service! Arrived on time and worked clean.',
                                date: '2025-12-20'
                            },
                            {
                                name: 'محمد الغربي',
                                rating: 5,
                                text: language === 'ar'
                                    ? 'نوصي بيه 100%. محترف ومأمون.'
                                    : '100% recommended. Professional and trustworthy.',
                                date: '2025-12-15'
                            }
                        ].map((review, index) => (
                            <div
                                key={index}
                                style={{
                                    padding: '16px',
                                    background: 'var(--bg-tertiary)',
                                    borderRadius: 'var(--radius-md)'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <div style={{ fontWeight: '600' }}>{review.name}</div>
                                    <div style={{ display: 'flex', gap: '2px' }}>
                                        {[...Array(review.rating)].map((_, i) => (
                                            <Star key={i} size={14} fill="var(--secondary)" color="var(--secondary)" />
                                        ))}
                                    </div>
                                </div>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>{review.text}</p>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    {new Date(review.date).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          .profile-content {
            flex-direction: column;
            text-align: center;
            gap: 20px;
          }
          .profile-content button {
            margin-left: 0 !important;
          }
        }
      `}</style>
        </div>
    );
}
