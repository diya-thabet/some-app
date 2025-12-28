import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Ban, Scale, ShieldCheck, Sparkles } from 'lucide-react';

export default function Features() {
    const { t } = useLanguage();

    const features = [
        {
            icon: <Ban size={28} />,
            title: t('features.items.zeroFees.title'),
            desc: t('features.items.zeroFees.desc'),
            color: 'var(--primary)'
        },
        {
            icon: <Scale size={28} />,
            title: t('features.items.fairPlay.title'),
            desc: t('features.items.fairPlay.desc'),
            color: 'var(--secondary)'
        },
        {
            icon: <ShieldCheck size={28} />,
            title: t('features.items.verification.title'),
            desc: t('features.items.verification.desc'),
            color: 'var(--accent)'
        },
        {
            icon: <Sparkles size={28} />,
            title: t('features.items.inclusive.title'),
            desc: t('features.items.inclusive.desc'),
            color: 'var(--info)'
        }
    ];

    return (
        <section className="features-section" id="features">
            <div className="container">
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="section-badge">{t('features.badge')}</span>
                    <h2 className="section-title">
                        {t('features.title')}
                    </h2>
                    <p className="section-desc">
                        {t('features.subtitle')}
                    </p>
                </motion.div>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="feature-card"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div
                                className="feature-icon"
                                style={{ color: feature.color }}
                            >
                                {feature.icon}
                            </div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-desc">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
