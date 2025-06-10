import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Phone, Image as ImageIcon, Users, Lock as LockIcon, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
    sex: '',
    profilePhoto: null as File | null,
  });
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, profilePhoto: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData({ ...formData, profilePhoto: null });
      setProfilePhotoPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordError(t('page.signup.passwordsNoMatch'));
      return;
    }
    setPasswordError('');
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Implement actual sign-up logic here for Raytni
      console.log('Raytni - Signing up with:', formData);
      alert('Sign-up successful (simulation)!');
      navigate('/signin'); 
    } catch (err) {
      setError('Failed to sign up. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tight text-gray-900">{t('page.signup.title')}</CardTitle>
          <CardDescription className="mt-2 text-sm text-gray-600">
            {t('page.signup.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">{t('page.signup.nameLabel')}</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <Input id="name" name="name" type="text" required className="pl-10 block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" placeholder={t('page.signup.namePlaceholder')} value={formData.name} onChange={handleChange} />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">{t('page.signin.phoneLabel')}</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <Input id="phone" name="phone" type="tel" required className="pl-10 block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" placeholder="+222 XX XX XX XX" value={formData.phone} onChange={handleChange} />
              </div>
            </div>
            
            <div>
              <label htmlFor="sex" className="block text-sm font-medium text-gray-700 mb-1">{t('page.signup.sexLabel')}</label>
              <div className="relative rounded-md shadow-sm">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
                <Select onValueChange={(value) => handleSelectChange('sex', value)} value={formData.sex} required>
                  <SelectTrigger className="pl-10 w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
                    <SelectValue placeholder={t('page.signup.sexPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{t('page.signup.sexMale')}</SelectItem>
                    <SelectItem value="female">{t('page.signup.sexFemale')}</SelectItem>
                    <SelectItem value="other">{t('page.signup.sexOther')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">{t('page.signin.passwordLabel')}</label>
              <div className="relative rounded-md shadow-sm">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input id="password" name="password" type="password" required className="pl-10 block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" placeholder={t('page.signup.passwordPlaceholder')} value={formData.password} onChange={handleChange} />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">{t('page.signup.confirmPasswordLabel')}</label>
               <div className="relative rounded-md shadow-sm">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input id="confirmPassword" name="confirmPassword" type="password" required className="pl-10 block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" placeholder={t('page.signup.confirmPasswordPlaceholder')} value={formData.confirmPassword} onChange={handleChange} />
              </div>
              {passwordError && <p className="mt-2 text-sm text-red-600">{passwordError}</p>}
            </div>

            <div>
              <label htmlFor="profilePhoto" className="block text-sm font-medium text-gray-700 mb-1">{t('page.signup.photoLabel')}</label>
              <div className="mt-1 flex items-center">
                <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-200 border border-gray-300">
                  {profilePhotoPreview ? 
                    <img src={profilePhotoPreview} alt={t('page.signup.photoPreviewAlt')} className="h-full w-full object-cover" /> : 
                    <ImageIcon className="h-full w-full text-gray-400 p-2" />
                  }
                </span>
                <Input id="profilePhoto" name="profilePhoto" type="file" accept="image/*" onChange={handleFileChange} className="ml-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <Button type="submit" className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-2" disabled={isLoading}>
                {isLoading ? t('page.signup.loadingButton') : t('page.signup.button')}
              </Button>
            </div>
          </form>
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              {t('page.signup.hasAccount')}{' '}
              <Link to="/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
                {t('page.signup.signInLink')}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpPage; 