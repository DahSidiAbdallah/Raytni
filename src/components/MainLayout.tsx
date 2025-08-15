import React, { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useNavigate, Outlet } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import LoadingOverlay from '@/components/LoadingOverlay';

const MainLayout = () => {
  const navigate = useNavigate();
  const { isChangingLanguage } = useLanguage();

  const handleCreatePost = () => {
    console.log('Navigate to create post');
    navigate('/create-post');
  };

  const handleViewBrowse = () => {
    console.log('Navigate to browse');
    navigate('/browse');
  };

  const handleViewHome = () => {
    console.log('Navigate to home');
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
      <LoadingOverlay isLoading={isChangingLanguage} />
      <Header 
        onCreatePost={handleCreatePost}
        onViewBrowse={handleViewBrowse}
        onViewHome={handleViewHome}
      />
      <main className="flex-grow w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;