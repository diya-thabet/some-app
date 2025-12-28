import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
    const { t, isRTL, language } = useLanguage();

    return (
        <section className="cta-section">
            <div className="cta-pattern"></div>
            <div className="container">
                <div className="cta-content">
                    <h2 className="cta-title">
                        {language === 'ar'
                            ? 'جاهز تبدا تكسب؟'
                            : language === 'fr'
                                ? 'Prêt à commencer ?'
                                : 'Ready to Start Earning?'}
                    </h2>
                    <p className="cta-desc">
                        {language === 'ar'
                            ? 'انضم لآلاف الحرفيين التونسيين. التسجيل مجاني وما فماش عمولة.'
                            : language === 'fr'
                                ? "Rejoignez des milliers d'artisans tunisiens. Inscription gratuite, zéro commission."
                                : 'Join thousands of Tunisian workers. Free registration, zero commission.'}
                    </p>
                    <div className="cta-buttons">
                        <Link to="/register" className="btn btn-lg cta-btn-white">
                            {t('hero.becomeProvider')}
                            <ArrowRight size={20} style={{ transform: isRTL ? 'rotate(180deg)' : 'none' }} />
                        </Link>
                        <Link to="/jobs" className="btn btn-lg cta-btn-outline-white">
                            {t('jobs.browseJobs')}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
