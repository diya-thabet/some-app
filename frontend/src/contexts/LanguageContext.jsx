import React, { createContext, useContext, useState, useEffect } from 'react';
import translations from '../translations';

const LanguageContext = createContext();

export const LANGUAGES = {
    ar: { code: 'ar', name: 'عربي', dir: 'rtl', flag: '🇹🇳' },
    fr: { code: 'fr', name: 'FR', dir: 'ltr', flag: '🇫🇷' },
    en: { code: 'en', name: 'EN', dir: 'ltr', flag: '🇬🇧' }
};

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState(() => {
        const saved = localStorage.getItem('hirfa-language');
        return saved || 'ar'; // Default to Arabic (Derja)
    });

    useEffect(() => {
        localStorage.setItem('hirfa-language', language);
        document.documentElement.dir = LANGUAGES[language].dir;
        document.documentElement.lang = language;
    }, [language]);

    // Translation helper function
    const t = (path) => {
        const keys = path.split('.');
        let result = translations;

        for (const key of keys) {
            if (result && result[key]) {
                result = result[key];
            } else {
                console.warn(`Translation missing: ${path}`);
                return path;
            }
        }

        if (typeof result === 'object' && result[language]) {
            return result[language];
        }

        return path;
    };

    const value = {
        language,
        setLanguage,
        t,
        isRTL: LANGUAGES[language].dir === 'rtl',
        currentLanguage: LANGUAGES[language]
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}

export default LanguageContext;
