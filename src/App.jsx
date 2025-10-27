import { useTranslation } from 'react-i18next';
import ConnectFour from './ConnectFour';
import LanguageSwitcher from './LanguageSwitcher';

function App() {
  const { t } = useTranslation();

  return (
    <div className="max-w-[1200px] mx-auto p-8 text-center bg-white/95 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] min-h-[600px] md:p-4 md:rounded-2xl">
      <header className="mb-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent m-0 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.1)] md:text-3xl">{t('title')}</h1>
      </header>
      <LanguageSwitcher />
      <ConnectFour />
    </div>
  );
}

export default App;
