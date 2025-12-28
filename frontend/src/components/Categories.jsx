import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';
import {
    Wrench,
    Zap,
    Sparkles,
    BookOpen,
    Truck,
    TreePine,
    Paintbrush,
    ChefHat
} from 'lucide-react';

export default function Categories() {
    const { t } = useLanguage();

    const categories = [
        {
            key: 'plumbing',
            icon: <Wrench size={32} />,
            emoji: '🔧'
        },
        {
            key: 'electrical',
            icon: <Zap size={32} />,
            emoji: '⚡'
        },
        {
            key: 'cleaning',
            icon: <Sparkles size={32} />,
            emoji: '🧹'
        },
        {
            key: 'tutoring',
            icon: <BookOpen size={32} />,
            emoji: '📚'
        },
        {
            key: 'moving',
            icon: <Truck size={32} />,
            emoji: '🚚'
        },
        {
            key: 'gardening',
            icon: <TreePine size={32} />,
            emoji: '🌿'
        },
        {
            key: 'painting',
            icon: <Paintbrush size={32} />,
            emoji: '🎨'
        },
        {
            key: 'cooking',
            icon: <ChefHat size={32} />,
            emoji: '👨‍🍳'
        }
    ];

    return (
        <section className="categories-section" id="categories">
            <div className="container">
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="section-title">
                        <span className="gradient-text">{t('categories.title')}</span>
                    </h2>
                </motion.div>

                <div className="categories-grid">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.key}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <Link
                                to={`/jobs?category=${category.key}`}
                                className="category-card"
                            >
                                <div className="category-icon">{category.emoji}</div>
                                <div className="category-name">
                                    {t(`categories.items.${category.key}`)}
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
