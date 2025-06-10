import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { User, Mail, Lock as LockIcon, Image as ImageIcon, AlertCircle } from 'lucide-react'; // Renamed Lock to LockIcon, added Mail
import { auth, db, storage } from '@/lib/firebase'; // Added firebase imports
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Added firebase auth import
import { doc, setDoc } from 'firebase/firestore'; // Added firestore imports
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Added firebase storage imports

const SignUpPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState(''); // Changed phone to email
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

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let photoURL = '';
      if (profilePhoto) {
        const photoRef = ref(storage, `profilePhotos/${user.uid}/${profilePhoto.name}`);
        await uploadBytes(photoRef, profilePhoto);
        photoURL = await getDownloadURL(photoRef);
      }

      // Save user data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name,
        email,
        sex,
        photoURL,
        createdAt: new Date().toISOString(),
      });

      setIsLoading(false);
      navigate('/signin'); // Navigate to sign in page after successful registration
    } catch (err: any) {
      setIsLoading(false);
      // Handle Firebase errors (e.g., email already in use)
      if (err.code === 'auth/email-already-in-use') {
        setError(t('page.signup.emailInUseError'));
      } else if (err.code === 'auth/weak-password') {
        setError(t('page.signup.weakPasswordError'));
      } else {
        setError(t('page.signup.error') + (err.message ? `: ${err.message}` : ''));
      }
      console.error('Sign up error:', err);
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
          <form onSubmit={handleSignUp} className="space-y-6">
            <div>
              <Label htmlFor="name">{t('page.signup.nameLabel')}</Label>
              <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <Input id="name" type="text" placeholder={t('page.signup.namePlaceholder')} required value={name} onChange={(e) => setName(e.target.value)} className="pl-10" />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">{t('page.signup.emailLabel')}</Label>
              <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <Input id="email" type="email" placeholder={t('page.signup.emailPlaceholder')} required value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" />
              </div>
            </div>

            <div>
              <Label htmlFor="sex">{t('page.signup.sexLabel')}</Label>
              <Select value={sex} onValueChange={setSex} required>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder={t('page.signup.sexPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">{t('page.signup.sexMale')}</SelectItem>
                  <SelectItem value="female">{t('page.signup.sexFemale')}</SelectItem>
                  <SelectItem value="other">{t('page.signup.sexOther')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="password">{t('page.signin.passwordLabel')}</Label>
              <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <Input id="password" type="password" placeholder={t('page.signup.passwordPlaceholder')} required value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" />
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword">{t('page.signup.confirmPasswordLabel')}</Label>
              <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <Input id="confirmPassword" type="password" placeholder={t('page.signup.confirmPasswordPlaceholder')} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-10" />
              </div>
              {passwordError && <p className="mt-2 text-sm text-red-600">{passwordError}</p>}
            </div>
            
            <div>
              <Label htmlFor="profilePhoto">{t('page.signup.photoLabel')}</Label>
              <div className="mt-1 flex items-center space-x-4">
                <span className="inline-block h-16 w-16 rounded-full overflow-hidden bg-gray-100">
                  {photoPreview ? (
                    <img className="h-full w-full object-cover" src={photoPreview} alt={t('page.signup.photoPreviewAlt')} />
                  ) : (
                    <ImageIcon className="h-full w-full text-gray-300" />
                  )}
                </span>
                <Input id="profilePhoto" type="file" accept="image/*" onChange={handlePhotoChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/>
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