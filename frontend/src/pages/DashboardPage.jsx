import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../hooks/useApi';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Briefcase,
    MessageSquare,
    User,
    Users,
    Settings,
    TrendingUp,
    DollarSign,
    Star,
    CheckCircle,
    Plus,
    MapPin,
    Clock,
    AlertCircle
} from 'lucide-react';

export default function DashboardPage() {
    const { t, language } = useLanguage();
    const { user, isProvider } = useAuth();
    const { getJobs, loading, error } = useApi();
    const location = useLocation();

    const [jobs, setJobs] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [loadingJobs, setLoadingJobs] = useState(true);
    const [jobsError, setJobsError] = useState(null);

    useEffect(() => {
        loadJobs();
    }, []);

    const loadJobs = async () => {
        setLoadingJobs(true);
        setJobsError(null);
        try {
            const result = await getJobs();
            // Handle different response formats
            if (result?.data) {
                setJobs(Array.isArray(result.data) ? result.data : [result.data]);
            } else if (Array.isArray(result)) {
                setJobs(result);
            } else {
                setJobs([]);
            }
        } catch (err) {
            console.error('Failed to load jobs:', err);
            setJobsError(err.message || 'Failed to load jobs');
            setJobs([]);
        } finally {
            setLoadingJobs(false);
        }
    };

    const sidebarLinks = [
        { id: 'overview', icon: <LayoutDashboard size={20} />, label: t('dashboard.overview') },
        { id: 'jobs', icon: <Briefcase size={20} />, label: t('dashboard.myJobs') },
        { id: 'messages', icon: <MessageSquare size={20} />, label: t('dashboard.messages') },
        { id: 'community', icon: <Users size={20} />, label: t('dashboard.community') },
        { id: 'profile', icon: <User size={20} />, label: t('dashboard.profile') },
        { id: 'settings', icon: <Settings size={20} />, label: t('dashboard.settings') }
    ];

    const stats = isProvider ? [
        {
            icon: <Briefcase size={24} />,
            value: '5',
            label: t('dashboard.stats.activeJobs'),
            trend: '+2'
        },
        {
            icon: <DollarSign size={24} />,
            value: '1,250 TND',
            label: t('dashboard.stats.earned'),
            trend: '+15%'
        },
        {
            icon: <Star size={24} />,
            value: '4.9',
            label: t('dashboard.stats.rating'),
            trend: '⭐'
        },
        {
            icon: <CheckCircle size={24} />,
            value: '47',
            label: t('dashboard.stats.completedJobs'),
            trend: '+8'
        }
    ] : [
        {
            icon: <Briefcase size={24} />,
            value: '3',
            label: t('dashboard.stats.activeJobs'),
            trend: ''
        },
        {
            icon: <CheckCircle size={24} />,
            value: '12',
            label: t('dashboard.stats.completedJobs'),
            trend: ''
        },
        {
            icon: <Star size={24} />,
            value: user?.fairnessScore || 100,
            label: t('profile.fairnessScore'),
            trend: ''
        }
    ];

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="logo-icon" style={{ width: '40px', height: '40px', fontSize: '1.25rem' }}>ح</div>
                    <span className="logo-text gradient-text" style={{ fontSize: '1.25rem' }}>Hirfa</span>
                </div>

                <nav className="sidebar-nav">
                    {sidebarLinks.map(link => (
                        <button
                            key={link.id}
                            className={`sidebar-link ${activeTab === link.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(link.id)}
                        >
                            {link.icon}
                            <span>{link.label}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                <div className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">
                            {t('dashboard.welcome')}, {user?.fullName?.split(' ')[0]} 👋
                        </h1>
                        <p style={{ color: 'var(--text-muted)' }}>
                            {isProvider
                                ? (language === 'ar' ? 'شوف الخدمات الجديدة حداك' : 'See new jobs near you')
                                : (language === 'ar' ? 'تتبع طلباتك' : 'Track your requests')}
                        </p>
                    </div>

                    <Link to="/jobs/new" className="btn btn-primary">
                        <Plus size={20} />
                        {t('jobs.postJob')}
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="stats-grid">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            className="stat-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <div className="stat-icon">{stat.icon}</div>
                            <div className="stat-content">
                                <h3>{stat.value}</h3>
                                <p>{stat.label}</p>
                                {stat.trend && (
                                    <span style={{
                                        color: 'var(--accent)',
                                        fontSize: '0.8rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        marginTop: '4px'
                                    }}>
                                        <TrendingUp size={14} />
                                        {stat.trend}
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Recent Jobs */}
                <div style={{ marginTop: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h2 style={{ fontSize: '1.25rem' }}>
                            {isProvider
                                ? (language === 'ar' ? 'خدمات متاحة' : 'Available Jobs')
                                : (language === 'ar' ? 'طلباتك الأخيرة' : 'Your Recent Requests')}
                        </h2>
                        <Link to="/jobs" style={{ color: 'var(--primary)', fontWeight: '500' }}>
                            {language === 'ar' ? 'عرض الكل' : 'View All'} →
                        </Link>
                    </div>

                    <div className="jobs-grid">
                        {jobs.slice(0, 3).map((job, index) => (
                            <motion.div
                                key={job.id || index}
                                className="job-card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                <div className="job-header">
                                    <h3 className="job-title">{job.title || 'Untitled'}</h3>
                                    <span className="job-budget">{job.budget || 0} TND</span>
                                </div>

                                <span className="job-category">{job.category || 'General'}</span>

                                <p className="job-description">{job.description || ''}</p>

                                <div className="job-footer">
                                    <div className="job-meta">
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <MapPin size={14} />
                                            {language === 'ar' ? 'تونس' : 'Tunis'}
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Clock size={14} />
                                            {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : '-'}
                                        </span>
                                    </div>
                                    <span className={`job-status ${(job.status || 'open').toLowerCase().replace('_', '-')}`}>
                                        {t(`jobs.status.${(job.status || 'open').toLowerCase()}`)}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
