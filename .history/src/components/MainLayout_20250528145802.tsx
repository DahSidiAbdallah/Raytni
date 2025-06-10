import React, { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const navigate = useNavigate();

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

  const handleViewPolice = () => {
    console.log('Navigate to police');
    navigate('/police');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        onCreatePost={handleCreatePost}
        onViewBrowse={handleViewBrowse}
        onViewHome={handleViewHome}
        onViewPolice={handleViewPolice}
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout; 