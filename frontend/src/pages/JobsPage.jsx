import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../hooks/useApi';
import { motion } from 'framer-motion';
import {
    Plus,
    Search,
    Filter,
    MapPin,
    Clock,
    DollarSign,
    ChevronDown,
    AlertCircle
} from 'lucide-react';

export default function JobsPage() {
    const { t, language } = useLanguage();
    const { isAuthenticated, isProvider } = useAuth();
    const { getJobs } = useApi();
    const [searchParams] = useSearchParams();

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
    const [showFilters, setShowFilters] = useState(false);

    const categories = [
        { key: '', label: language === 'ar' ? 'الكل' : 'All' },
        { key: 'plumbing', label: t('categories.items.plumbing') },
        { key: 'electrical', label: t('categories.items.electrical') },
        { key: 'cleaning', label: t('categories.items.cleaning') },
        { key: 'tutoring', label: t('categories.items.tutoring') },
        { key: 'moving', label: t('categories.items.moving') },
        { key: 'painting', label: t('categories.items.painting') }
    ];

    useEffect(() => {
        loadJobs();
    }, []);

    const loadJobs = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getJobs();
            // Handle different response formats from Spring Boot
            if (result?.data) {
                setJobs(Array.isArray(result.data) ? result.data : [result.data]);
            } else if (Array.isArray(result)) {
                setJobs(result);
            } else {
                setJobs([]);
            }
        } catch (err) {
            console.error('Failed to load jobs:', err);
            setError(err.message || 'Failed to load jobs');
            setJobs([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredJobs = jobs.filter(job => {
        if (!job) return false;
        const title = job.title || '';
        const description = job.description || '';
        const category = job.category || '';

        const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || category.toLowerCase() === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getCategoryLabel = (categoryKey) => {
        if (!categoryKey) return 'General';
        const found = categories.find(c => c.key.toLowerCase() === categoryKey.toLowerCase());
        return found ? found.label : categoryKey;
    };

    return (
        <div className="page-wrapper">
            <div className="container" style={{ paddingTop: '32px', paddingBottom: '64px' }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '32px',
                    flexWrap: 'wrap',
                    gap: '16px'
                }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>
                            {isProvider ? t('jobs.browseJobs') : t('nav.services')}
                        </h1>
                        <p style={{ color: 'var(--text-muted)' }}>
                            {language === 'ar'
                                ? `${filteredJobs.length} خدمة متاحة`
                                : `${filteredJobs.length} jobs available`}
                        </p>
                    </div>

                    {isAuthenticated && !isProvider && (
                        <Link to="/jobs/new" className="btn btn-primary">
                            <Plus size={20} />
                            {t('jobs.postJob')}
                        </Link>
                    )}
                </div>

                {/* Search & Filters */}
                <div style={{
                    display: 'flex',
                    gap: '16px',
                    marginBottom: '32px',
                    flexWrap: 'wrap'
                }}>
                    {/* Search */}
                    <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                        <Search
                            size={20}
                            style={{
                                position: 'absolute',
                                left: '16px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--text-muted)'
                            }}
                        />
                        <input
                            type="text"
                            placeholder={t('common.search') + '...'}
                            className="form-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ paddingLeft: '48px' }}
                        />
                    </div>

                    {/* Category Filter */}
                    <div style={{ position: 'relative' }}>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setShowFilters(!showFilters)}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            <Filter size={18} />
                            {selectedCategory ? getCategoryLabel(selectedCategory) : (language === 'ar' ? 'فلترة' : 'Filter')}
                            <ChevronDown size={16} />
                        </button>

                        {showFilters && (
                            <div style={{
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
                                {categories.map(cat => (
                                    <button
                                        key={cat.key}
                                        onClick={() => {
                                            setSelectedCategory(cat.key);
                                            setShowFilters(false);
                                        }}
                                        style={{
                                            display: 'block',
                                            width: '100%',
                                            padding: '10px 12px',
                                            background: selectedCategory === cat.key ? 'rgba(224, 122, 95, 0.1)' : 'transparent',
                                            border: 'none',
                                            borderRadius: '8px',
                                            color: selectedCategory === cat.key ? 'var(--primary)' : 'var(--text-primary)',
                                            textAlign: 'left',
                                            cursor: 'pointer',
                                            fontSize: '0.95rem'
                                        }}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Jobs Grid */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '64px' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            border: '4px solid var(--border-color)',
                            borderTopColor: 'var(--primary)',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto'
                        }} />
                        <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>
                            {t('common.loading')}
                        </p>
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '64px',
                        background: 'var(--bg-card)',
                        borderRadius: 'var(--radius-xl)',
                        border: '1px solid var(--border-color)'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🔍</div>
                        <h3 style={{ marginBottom: '8px' }}>
                            {language === 'ar' ? 'ما لقينا شي' : 'No jobs found'}
                        </h3>
                        <p style={{ color: 'var(--text-muted)' }}>
                            {language === 'ar' ? 'جرب تبدل الفلترة' : 'Try adjusting your filters'}
                        </p>
                    </div>
                ) : (
                    <div className="jobs-grid">
                        {filteredJobs.map((job, index) => (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <Link to={`/jobs/${job.id}`} className="job-card" style={{ display: 'block' }}>
                                    <div className="job-header">
                                        <h3 className="job-title">{job.title}</h3>
                                        <span className="job-budget">{job.budget} TND</span>
                                    </div>

                                    <span className="job-category">{getCategoryLabel(job.category)}</span>

                                    <p className="job-description">{job.description}</p>

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

                                    {/* Customer Info */}
                                    {job.customer && (
                                        <div style={{
                                            marginTop: '16px',
                                            paddingTop: '16px',
                                            borderTop: '1px solid var(--border-color)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px'
                                        }}>
                                            <div style={{
                                                width: '36px',
                                                height: '36px',
                                                borderRadius: '50%',
                                                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontSize: '0.9rem',
                                                fontWeight: '600'
                                            }}>
                                                {(job.customer.fullName || 'U').charAt(0)}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                                                    {job.customer.fullName || 'Unknown'}
                                                </div>
                                                {job.customer.verified && (
                                                    <span style={{
                                                        fontSize: '0.75rem',
                                                        color: 'var(--accent)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px'
                                                    }}>
                                                        ✓ {t('profile.verified')}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}
