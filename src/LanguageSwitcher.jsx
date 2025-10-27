import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'oc', name: 'Occitan', flag: '🏴' }
];

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="language-switcher">
      <label className="language-label">{t('language')}:</label>
      <div className="language-buttons">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`lang-btn ${i18n.language === lang.code ? 'active' : ''}`}
            title={lang.name}
          >
            <span className="flag">{lang.flag}</span>
            <span className="lang-name">{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher;
