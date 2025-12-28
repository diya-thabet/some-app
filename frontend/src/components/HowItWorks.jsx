import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';
import { UserPlus, MapPin, DollarSign, CheckCircle } from 'lucide-react';

export default function HowItWorks() {
    const { t } = useLanguage();

    const steps = [
        {
            number: 1,
            icon: <UserPlus size={32} />,
            title: t('howItWorks.steps.register.title'),
            desc: t('howItWorks.steps.register.desc')
        },
        {
            number: 2,
            icon: <MapPin size={32} />,
            title: t('howItWorks.steps.find.title'),
            desc: t('howItWorks.steps.find.desc')
        },
        {
            number: 3,
            icon: <DollarSign size={32} />,
            title: t('howItWorks.steps.bid.title'),
            desc: t('howItWorks.steps.bid.desc')
        },
        {
            number: 4,
            icon: <CheckCircle size={32} />,
            title: t('howItWorks.steps.earn.title'),
            desc: t('howItWorks.steps.earn.desc')
        }
    ];

    return (
        <section className="how-it-works" id="how-it-works">
            <div className="container">
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="section-title">
                        <span className="gradient-text">{t('howItWorks.title')}</span>
                    </h2>
                </motion.div>

                <div className="steps-container">
                    <div className="steps-line"></div>

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            className="step-item"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div className="step-number">{step.number}</div>
                            <h3 className="step-title">{step.title}</h3>
                            <p className="step-desc">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
