import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export default function Testimonials() {
    const { t, language } = useLanguage();

    const testimonials = [
        {
            id: 1,
            text: language === 'ar'
                ? 'هيرفة غيرتلي حياتي! كنت قاعد بطال 6 شهور، توا عندي خدمة كل يوم. الأرباح كاملة تمشيلي بدون عمولة.'
                : language === 'fr'
                    ? "Hirfa a changé ma vie ! J'étais au chômage depuis 6 mois, maintenant j'ai du travail tous les jours. Tous les revenus sont pour moi."
                    : "Hirfa changed my life! I was unemployed for 6 months, now I have work every day. All earnings go to me, no commission.",
            name: 'محمود الشريف',
            role: language === 'ar' ? 'سباك - المرسى' : language === 'fr' ? 'Plombier - La Marsa' : 'Plumber - La Marsa',
            avatar: 'م'
        },
        {
            id: 2,
            text: language === 'ar'
                ? 'نجمت نلقى معلم رياضيات لوليدي في نهار. الخدمة سريعة والحرفيين موثوقين. شكراً هيرفة!'
                : language === 'fr'
                    ? "J'ai trouvé un prof de maths pour mon fils en une journée. Service rapide et prestataires vérifiés. Merci Hirfa !"
                    : "I found a math tutor for my son in one day. Fast service and verified providers. Thanks Hirfa!",
            name: 'سلمى البجاوي',
            role: language === 'ar' ? 'عميلة - البحيرة' : language === 'fr' ? 'Cliente - Lac' : 'Customer - Lac',
            avatar: 'س'
        },
        {
            id: 3,
            text: language === 'ar'
                ? 'كل يوم نشوف خدمات جديدة قريبة مني. النظام عادل، حتى الجداد عندهم فرص كيف القدامى.'
                : language === 'fr'
                    ? 'Chaque jour je vois de nouvelles offres près de moi. Le système est juste, même les nouveaux ont leur chance.'
                    : 'Every day I see new jobs near me. The system is fair, even newcomers get equal chances.',
            name: 'يوسف الحمامي',
            role: language === 'ar' ? 'كهربائي - باردو' : language === 'fr' ? 'Électricien - Bardo' : 'Electrician - Bardo',
            avatar: 'ي'
        }
    ];

    return (
        <section className="testimonials-section" id="testimonials">
            <div className="container">
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="section-badge" style={{
                        background: 'rgba(224, 122, 95, 0.1)',
                        borderColor: 'rgba(224, 122, 95, 0.3)',
                        color: 'var(--primary)'
                    }}>
                        {language === 'ar' ? 'شهادات' : language === 'fr' ? 'Témoignages' : 'Testimonials'}
                    </span>
                    <h2 className="section-title">
                        <span className="gradient-text">
                            {language === 'ar' ? 'شنوة يقولوا علينا' : language === 'fr' ? 'Ce qu\'ils disent' : 'What They Say'}
                        </span>
                    </h2>
                </motion.div>

                <div className="testimonials-grid">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            className="testimonial-card"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div className="testimonial-quote">
                                <Quote size={40} />
                            </div>
                            <p className="testimonial-text">{testimonial.text}</p>
                            <div className="testimonial-author">
                                <div className="testimonial-avatar">{testimonial.avatar}</div>
                                <div>
                                    <div className="testimonial-name">{testimonial.name}</div>
                                    <div className="testimonial-role">{testimonial.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
