import { getCurrentUser } from '@/lib/appwrite/api';
import { IContextType, IUser } from '@/types';
import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
// On load, useEffect runs checkAuthUser.

// checkAuthUser fetches user using Appwrite API.

// If valid, it sets user and isAuthenticated.

// If invalid, it redirects to /sign-up.

// You can use the context via useUserContext() anywhere in the app.
export const INITIAL_USER = {
  id: '',
  name: '',
  username: '',
  email: '',
  imageUrl: '',
  bio: ''
};

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  isEmailVerified: false,
  setUser: () => { },
  setIsAuthenticated: () => { },
  setIsEmailVerified: () => { },
  checkAuthUser: async () => false as boolean,
}

const AuthContext = createContext<IContextType>(INITIAL_STATE);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser>(INITIAL_USER)
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const navigate = useNavigate();
  
  const checkAuthUser = async () => {
    setIsLoading(true);
    try {
      const currentAccount = await getCurrentUser();
      if (currentAccount) {
        setUser({
          id: currentAccount.$id,
          name: currentAccount.name,
          username: currentAccount.username,
          email: currentAccount.email,
          imageUrl: currentAccount.imageUrl,
          bio: currentAccount.bio,
        });
        setIsAuthenticated(true);
        setIsEmailVerified(currentAccount.emailVerification || false);
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const cookieFallback = localStorage.getItem('cookieFallback');
      
      // Define public paths
      const publicPaths = ['/sign-in', '/sign-up', '/forgot-password', '/reset-password', '/verify'];
      const currentPath = window.location.pathname;
      const isPublicPath = publicPaths.some(path => currentPath.startsWith(path));

      // Check authentication first
      const isAuth = await checkAuthUser();

      // Only redirect if not authenticated, no valid cookie, and not on a public path
      if (!isAuth && (cookieFallback === '[]' || cookieFallback === null) && !isPublicPath) {
        navigate('/sign-up');
      }
    };

    initAuth();
  }, []);

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    isEmailVerified,
    setIsEmailVerified,
    checkAuthUser
  }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

export const useUserContext = () => useContext(AuthContext)