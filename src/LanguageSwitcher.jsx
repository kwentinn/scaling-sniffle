import { useTranslation } from 'react-i18next';

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
    <div className="flex flex-col items-center gap-4 mb-4">
      <label className="text-base font-semibold text-gray-600">{t('language')}:</label>
      <div className="flex gap-2 max-sm:gap-1.5 flex-wrap justify-center">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`flex items-center gap-2 px-4 py-2 max-sm:px-3 max-sm:py-1.5 rounded-lg border-2 cursor-pointer transition-all duration-200 text-sm max-sm:text-xs hover:bg-gray-200 hover:border-gray-400 hover:-translate-y-0.5 ${
              i18n.language === lang.code 
                ? 'bg-blue-500 border-blue-600 text-white font-bold' 
                : 'bg-gray-100 border-gray-300'
            }`}
            title={lang.name}
          >
            <span className="text-xl max-sm:text-lg">{lang.flag}</span>
            <span className="text-sm max-sm:text-xs">{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher;
