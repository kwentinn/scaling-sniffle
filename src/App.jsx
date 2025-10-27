import { useTranslation } from 'react-i18next';
import ConnectFour from './ConnectFour';
import LanguageSwitcher from './LanguageSwitcher';

function App() {
  const { t } = useTranslation();

  return (
    <div className="max-w-[1200px] mx-auto p-8 max-md:p-4 text-center bg-white/95 rounded-3xl max-md:rounded-2xl shadow-2xl min-h-[600px]">
      <header className="mb-8">
        <h1 className="text-5xl max-md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent m-0">{t('title')}</h1>
      </header>
      <LanguageSwitcher />
      <ConnectFour />
    </div>
  );
}

export default App;
