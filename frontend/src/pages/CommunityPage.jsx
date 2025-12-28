import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../hooks/useApi';
import { motion } from 'framer-motion';
import {
    Plus,
    Heart,
    MessageCircle,
    Share2,
    Camera,
    CheckCircle,
    AlertCircle
} from 'lucide-react';

export default function CommunityPage() {
    const { t, language } = useLanguage();
    const { user, isAuthenticated } = useAuth();
    const { getStories, postStory } = useApi();

    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPostModal, setShowPostModal] = useState(false);
    const [newStory, setNewStory] = useState({ mediaUrl: '', caption: '' });

    useEffect(() => {
        loadStories();
    }, []);

    const loadStories = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getStories();
            // Handle different response formats from Spring Boot
            if (result?.data) {
                setStories(Array.isArray(result.data) ? result.data : [result.data]);
            } else if (Array.isArray(result)) {
                setStories(result);
            } else {
                setStories([]);
            }
        } catch (err) {
            console.error('Failed to load stories:', err);
            setError(err.message || 'Failed to load stories');
            setStories([]);
        } finally {
            setLoading(false);
        }
    };

    const handlePostStory = async (e) => {
        e.preventDefault();
        if (!newStory.caption.trim()) return;

        try {
            await postStory({
                mediaUrl: newStory.mediaUrl || '',
                caption: newStory.caption
            });

            setNewStory({ mediaUrl: '', caption: '' });
            setShowPostModal(false);
            loadStories();
        } catch (err) {
            console.error('Failed to post story:', err);
            alert(err.message || 'Failed to post story');
        }
    };

    const getTimeAgo = (date) => {
        if (!date) return language === 'ar' ? 'الآن' : 'Just now';
        const now = new Date();
        const diff = now - new Date(date);
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);

        if (days > 0) return language === 'ar' ? `${days} يوم` : `${days}d ago`;
        if (hours > 0) return language === 'ar' ? `${hours} ساعة` : `${hours}h ago`;
        return language === 'ar' ? 'الآن' : 'Just now';
    };

    return (
        <div className="page-wrapper">
            <div className="container" style={{ paddingTop: '32px', paddingBottom: '64px', maxWidth: '700px' }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '32px'
                }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>
                            {t('community.title')}
                        </h1>
                        <p style={{ color: 'var(--text-muted)' }}>
                            {language === 'ar'
                                ? 'شوف آخر أعمال الحرفيين'
                                : 'See the latest work from providers'}
                        </p>
                    </div>

                    {isAuthenticated && (
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowPostModal(true)}
                        >
                            <Plus size={20} />
                            {t('community.postStory')}
                        </button>
                    )}
                </div>

                {/* Stories Feed */}
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
                    </div>
                ) : stories.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '64px',
                        background: 'var(--bg-card)',
                        borderRadius: 'var(--radius-xl)',
                        border: '1px solid var(--border-color)'
                    }}>
                        <Camera size={48} style={{ marginBottom: '16px', color: 'var(--text-muted)' }} />
                        <h3 style={{ marginBottom: '8px' }}>
                            {language === 'ar' ? 'ما فماش قصص بعد' : 'No stories yet'}
                        </h3>
                        <p style={{ color: 'var(--text-muted)' }}>
                            {language === 'ar' ? 'كن أول واحد يشارك!' : 'Be the first to share!'}
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {stories.map((story, index) => (
                            <motion.div
                                key={story.id}
                                className="story-card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                <div className="story-header">
                                    <div className="story-author-avatar">
                                        {(story.user?.fullName || 'U').charAt(0)}
                                    </div>
                                    <div>
                                        <div className="story-author-name" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            {story.user?.fullName || 'Unknown'}
                                            {story.user?.verified && <CheckCircle size={14} color="var(--accent)" />}
                                        </div>
                                        <div className="story-time">{getTimeAgo(story.createdAt)}</div>
                                    </div>
                                </div>

                                {story.mediaUrl && (
                                    <img
                                        src={story.mediaUrl}
                                        alt="Story"
                                        className="story-media"
                                        style={{ width: '100%' }}
                                    />
                                )}

                                <div className="story-caption">{story.caption}</div>

                                <div className="story-actions">
                                    <button className="story-action-btn">
                                        <Heart size={20} />
                                        <span>{t('community.like')}</span>
                                    </button>
                                    <button className="story-action-btn">
                                        <MessageCircle size={20} />
                                        <span>{t('community.comment')}</span>
                                    </button>
                                    <button className="story-action-btn">
                                        <Share2 size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Post Story Modal */}
            {showPostModal && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0,0,0,0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '24px'
                    }}
                    onClick={() => setShowPostModal(false)}
                >
                    <motion.div
                        className="card"
                        style={{
                            width: '100%',
                            maxWidth: '500px',
                            maxHeight: '90vh',
                            overflow: 'auto'
                        }}
                        onClick={e => e.stopPropagation()}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        <h2 style={{ marginBottom: '20px' }}>{t('community.postStory')}</h2>

                        <form onSubmit={handlePostStory}>
                            <div className="form-group">
                                <label className="form-label">
                                    {language === 'ar' ? 'رابط الصورة (اختياري)' : 'Image URL (optional)'}
                                </label>
                                <input
                                    type="url"
                                    className="form-input"
                                    value={newStory.mediaUrl}
                                    onChange={(e) => setNewStory({ ...newStory, mediaUrl: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    {language === 'ar' ? 'النص' : 'Caption'}
                                </label>
                                <textarea
                                    className="form-input"
                                    value={newStory.caption}
                                    onChange={(e) => setNewStory({ ...newStory, caption: e.target.value })}
                                    placeholder={language === 'ar' ? 'شارك إنجازك...' : 'Share your accomplishment...'}
                                    rows={4}
                                    required
                                    style={{ resize: 'vertical' }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowPostModal(false)}
                                >
                                    {t('common.cancel')}
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {t('common.submit')}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}
