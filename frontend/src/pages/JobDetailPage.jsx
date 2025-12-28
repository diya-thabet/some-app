import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../hooks/useApi';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    MapPin,
    Clock,
    DollarSign,
    User,
    MessageSquare,
    Send,
    CheckCircle,
    Star
} from 'lucide-react';

export default function JobDetailPage() {
    const { jobId } = useParams();
    const { t, language, isRTL } = useLanguage();
    const { user, isAuthenticated, isProvider } = useAuth();
    const { getJob, getBids, placeBid } = useApi();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bidAmount, setBidAmount] = useState('');
    const [bidMessage, setBidMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadJobData();
    }, [jobId]);

    const loadJobData = async () => {
        setLoading(true);
        try {
            const [jobResult, bidsResult] = await Promise.all([
                getJob(jobId),
                getBids(jobId)
            ]);

            if (jobResult.success) {
                setJob(jobResult.data);
            }
            if (bidsResult.success) {
                setBids(bidsResult.data);
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePlaceBid = async (e) => {
        e.preventDefault();
        if (!bidAmount || !isProvider) return;

        setSubmitting(true);
        try {
            await placeBid(jobId, {
                provider: user,
                amount: parseFloat(bidAmount),
                message: bidMessage
            });

            setBidAmount('');
            setBidMessage('');
            loadJobData();
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="page-wrapper">
                <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        border: '4px solid var(--border-color)',
                        borderTopColor: 'var(--primary)',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto'
                    }} />
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="page-wrapper">
                <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
                    <h2>{language === 'ar' ? 'ما لقيناش الخدمة' : 'Job not found'}</h2>
                    <Link to="/jobs" className="btn btn-primary" style={{ marginTop: '24px' }}>
                        {t('jobs.browseJobs')}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page-wrapper">
            <div className="container" style={{ paddingTop: '32px', paddingBottom: '64px' }}>
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        marginBottom: '24px',
                        cursor: 'pointer',
                        fontSize: '1rem'
                    }}
                >
                    <ArrowLeft size={20} style={{ transform: isRTL ? 'rotate(180deg)' : 'none' }} />
                    {language === 'ar' ? 'رجوع' : 'Back'}
                </button>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px' }}>
                    {/* Main Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {/* Job Card */}
                        <div className="card" style={{ marginBottom: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div>
                                    <span className="job-category" style={{ marginBottom: '8px' }}>{job.category}</span>
                                    <h1 style={{ fontSize: '1.75rem', marginTop: '8px' }}>{job.title}</h1>
                                </div>
                                <span className={`job-status ${job.status.toLowerCase()}`}>
                                    {t(`jobs.status.${job.status.toLowerCase()}`)}
                                </span>
                            </div>

                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '24px' }}>
                                {job.description}
                            </p>

                            <div style={{
                                display: 'flex',
                                gap: '24px',
                                padding: '16px',
                                background: 'var(--bg-tertiary)',
                                borderRadius: 'var(--radius-md)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <DollarSign size={20} color="var(--accent)" />
                                    <div>
                                        <div style={{ fontWeight: '700', fontSize: '1.25rem', color: 'var(--accent)' }}>
                                            {job.budget} TND
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            {t('jobs.budget')}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <MapPin size={20} color="var(--primary)" />
                                    <div>
                                        <div style={{ fontWeight: '600' }}>
                                            {language === 'ar' ? 'تونس' : 'Tunis'}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            {t('jobs.location')}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Clock size={20} color="var(--secondary)" />
                                    <div>
                                        <div style={{ fontWeight: '600' }}>
                                            {new Date(job.createdAt).toLocaleDateString()}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            {language === 'ar' ? 'تاريخ النشر' : 'Posted'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bids Section */}
                        <div className="card">
                            <h2 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>
                                {t('jobs.bids')} ({bids.length})
                            </h2>

                            {bids.length === 0 ? (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '40px',
                                    color: 'var(--text-muted)'
                                }}>
                                    <MessageSquare size={40} style={{ marginBottom: '12px', opacity: 0.5 }} />
                                    <p>{language === 'ar' ? 'ما فماش عروض بعد' : 'No bids yet'}</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {bids.map((bid, index) => (
                                        <div
                                            key={bid.id}
                                            style={{
                                                padding: '16px',
                                                background: 'var(--bg-tertiary)',
                                                borderRadius: 'var(--radius-md)',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{
                                                    width: '48px',
                                                    height: '48px',
                                                    borderRadius: '50%',
                                                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    fontWeight: '600'
                                                }}>
                                                    {bid.provider.fullName.charAt(0)}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        {bid.provider.fullName}
                                                        {bid.provider.verified && (
                                                            <CheckCircle size={14} color="var(--accent)" />
                                                        )}
                                                    </div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                        <Star size={12} style={{ marginRight: '4px' }} />
                                                        {bid.provider.fairnessScore}/100
                                                    </div>
                                                    {bid.message && (
                                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                                                            "{bid.message}"
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontWeight: '700', fontSize: '1.25rem', color: 'var(--primary)' }}>
                                                    {bid.amount} TND
                                                </div>
                                                <button className="btn btn-sm btn-primary" style={{ marginTop: '8px' }}>
                                                    {language === 'ar' ? 'قبول' : 'Accept'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                    >
                        {/* Customer Card */}
                        <div className="card" style={{ marginBottom: '24px' }}>
                            <h3 style={{ marginBottom: '16px', fontSize: '1rem' }}>
                                {language === 'ar' ? 'صاحب الطلب' : 'Posted by'}
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: '56px',
                                    height: '56px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '1.25rem',
                                    fontWeight: '600'
                                }}>
                                    {job.customer.fullName.charAt(0)}
                                </div>
                                <div>
                                    <div style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {job.customer.fullName}
                                        {job.customer.verified && (
                                            <CheckCircle size={14} color="var(--accent)" />
                                        )}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        {t('auth.customer.title')}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Place Bid Form - For Providers */}
                        {isAuthenticated && isProvider && job.status === 'OPEN' && (
                            <div className="card">
                                <h3 style={{ marginBottom: '16px', fontSize: '1rem' }}>
                                    {t('jobs.placeBid')}
                                </h3>
                                <form onSubmit={handlePlaceBid}>
                                    <div className="form-group">
                                        <label className="form-label">
                                            {language === 'ar' ? 'عرضك (TND)' : 'Your Bid (TND)'}
                                        </label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={bidAmount}
                                            onChange={(e) => setBidAmount(e.target.value)}
                                            placeholder={job.budget.toString()}
                                            min="1"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">
                                            {language === 'ar' ? 'رسالة (اختياري)' : 'Message (optional)'}
                                        </label>
                                        <textarea
                                            className="form-input"
                                            value={bidMessage}
                                            onChange={(e) => setBidMessage(e.target.value)}
                                            placeholder={language === 'ar' ? 'قل شي للعميل...' : 'Say something to the client...'}
                                            rows={3}
                                            style={{ resize: 'vertical' }}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-full"
                                        disabled={submitting}
                                        style={{ width: '100%' }}
                                    >
                                        <Send size={18} />
                                        {submitting ? t('common.loading') : t('jobs.placeBid')}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Login Prompt */}
                        {!isAuthenticated && (
                            <div className="card" style={{ textAlign: 'center' }}>
                                <User size={40} style={{ marginBottom: '12px', color: 'var(--primary)' }} />
                                <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
                                    {language === 'ar'
                                        ? 'سجل دخول باش تقدم عرض'
                                        : 'Login to place a bid'}
                                </p>
                                <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>
                                    {t('nav.login')}
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 968px) {
          div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
        </div>
    );
}
