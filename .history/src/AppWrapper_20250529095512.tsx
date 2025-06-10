import { LanguageProvider } from './contexts/LanguageContext';
import App from './App';
import { Toaster } from 'react-hot-toast';

const AppWrapper = () => {
  return (
    <LanguageProvider>
      <App />
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          className: '',
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
          error: {
            duration: 4000,
          }
        }}
      />
    </LanguageProvider>
  );
};

export default AppWrapper;
