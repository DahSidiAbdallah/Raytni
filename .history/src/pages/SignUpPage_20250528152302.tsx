import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { User, Phone, Lock as LockIcon, Image as ImageIcon, AlertCircle } from 'lucide-react'; // Renamed Lock to LockIcon

const SignUpPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [sex, setSex] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError(t('page.signup.passwordsNoMatch'));
      return;
    }
    setPasswordError('');
    setIsLoading(true);
    setError('');
    
    // Simulate API Call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Signing up with:', { name, phone, sex, password, profilePhoto });
    setIsLoading(false);
    // navigate('/signin'); // Navigate to sign in page after successful registration
    // For now, let's assume an error to show the message
    setError(t('page.signup.error'));
  };

  const iconContainerClasses = language === 'ar' ? 
    "absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none" :
    "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none";
  
  const inputPaddingClasses = language === 'ar' ? "pr-10" : "pl-10";

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
          <form onSubmit={handleSignUp} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-start block text-sm font-medium text-gray-700">{t('page.signup.nameLabel')}</Label>
              <div className="mt-1 relative rounded-md shadow-sm">
                  <div className={iconContainerClasses}>
                    <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <Input id="name" type="text" placeholder={t('page.signup.namePlaceholder')} required value={name} onChange={(e) => setName(e.target.value)} className={`${inputPaddingClasses} appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`} dir={language === 'ar' ? 'rtl' : 'ltr'} />
              </div>
            </div>
            
            <div>
              <Label htmlFor="phone" className="text-start block text-sm font-medium text-gray-700">{t('page.signin.phoneLabel')}</Label>
              <div className="mt-1 relative rounded-md shadow-sm">
                  <div className={iconContainerClasses}>
                    <Phone className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <Input id="phone" type="tel" placeholder="+222 XX XX XX XX" required value={phone} onChange={(e) => setPhone(e.target.value)} className={`${inputPaddingClasses} appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`} dir={language === 'ar' ? 'rtl' : 'ltr'} />
              </div>
            </div>

            <div>
              <Label htmlFor="sex" className="text-start block text-sm font-medium text-gray-700">{t('page.signup.sexLabel')}</Label>
              <Select value={sex} onValueChange={setSex} required dir={language === 'ar' ? 'rtl' : 'ltr'}>
                <SelectTrigger className="w-full mt-1 text-start">
                  <SelectValue placeholder={t('page.signup.sexPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male" className="text-start">{t('page.signup.sexMale')}</SelectItem>
                  <SelectItem value="female" className="text-start">{t('page.signup.sexFemale')}</SelectItem>
                  <SelectItem value="other" className="text-start">{t('page.signup.sexOther')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="password" className="text-start block text-sm font-medium text-gray-700">{t('page.signin.passwordLabel')}</Label>
              <div className="mt-1 relative rounded-md shadow-sm">
                  <div className={iconContainerClasses}>
                    <LockIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <Input id="password" type="password" placeholder={t('page.signup.passwordPlaceholder')} required value={password} onChange={(e) => setPassword(e.target.value)} className={`${inputPaddingClasses} appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`} dir={language === 'ar' ? 'rtl' : 'ltr'} />
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-start block text-sm font-medium text-gray-700">{t('page.signup.confirmPasswordLabel')}</Label>
              <div className="mt-1 relative rounded-md shadow-sm">
                  <div className={iconContainerClasses}>
                    <LockIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <Input id="confirmPassword" type="password" placeholder={t('page.signup.confirmPasswordPlaceholder')} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={`${inputPaddingClasses} appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`} dir={language === 'ar' ? 'rtl' : 'ltr'} />
              </div>
              {passwordError && <p className="mt-2 text-sm text-red-600 text-start">{passwordError}</p>}
            </div>
            
            <div>
              <Label htmlFor="profilePhoto" className="text-start block text-sm font-medium text-gray-700">{t('page.signup.photoLabel')}</Label>
              <div className="mt-1 flex items-center space-x-4 rtl:space-x-reverse">
                <span className="inline-block h-16 w-16 rounded-full overflow-hidden bg-gray-100">
                  {photoPreview ? (
                    <img className="h-full w-full object-cover" src={photoPreview} alt={t('page.signup.photoPreviewAlt')} />
                  ) : (
                    <ImageIcon className="h-full w-full text-gray-300" />
                  )}
                </span>
                <Input id="profilePhoto" type="file" accept="image/*" onChange={handlePhotoChange} className="block w-full text-sm text-slate-500 file:me-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4 text-start">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400 me-2" />
                  </div>
                  <div className="ms-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <Button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" disabled={isLoading}>
                {isLoading ? t('page.signup.loadingButton') : t('page.signup.button')}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="text-center">
            <p className="text-sm text-gray-600">
                {t('page.signup.hasAccount')}{' '}
                <Link to="/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
                    {t('page.signup.signInLink')}
                </Link>
            </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUpPage;