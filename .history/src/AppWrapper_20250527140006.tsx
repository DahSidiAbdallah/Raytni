
import { LanguageProvider } from './contexts/LanguageContext';
import App from './App';

const AppWrapper = () => {
  return (
    <LanguageProvider>
      <App />
    </LanguageProvider>
  );
};

export default AppWrapper;
