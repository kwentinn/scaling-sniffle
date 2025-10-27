import { useTranslation } from 'react-i18next';
import ConnectFour from './ConnectFour';
import LanguageSwitcher from './LanguageSwitcher';
import './App.css';

function App() {
  const { t } = useTranslation();

  return (
    <div className="app">
      <header className="app-header">
        <h1>{t('title')}</h1>
      </header>
      <LanguageSwitcher />
      <ConnectFour />
    </div>
  );
}

export default App;
