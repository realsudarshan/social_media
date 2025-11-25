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
  setUser: () => { },
  setIsAuthenticated: () => { },
  checkAuthUser: async () => false as boolean,
}


const AuthContext = createContext<IContextType>(INITIAL_STATE);


const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser>(INITIAL_USER)
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false)

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
    const cookieFallback = localStorage.getItem('cookieFallback');

    // Don't redirect if user is on public auth pages
    const publicPaths = ['/sign-in', '/sign-up', '/forgot-password', '/reset-password', '/verify'];
    const currentPath = window.location.pathname;
    const isPublicPath = publicPaths.some(path => currentPath.startsWith(path));

    if ((cookieFallback === '[]' || cookieFallback === null) && !isPublicPath) {
      navigate('/sign-up');
    }

    checkAuthUser();
  }, [])

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser
  }
  return (
    <div>
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    </div>
  )


}
export default AuthProvider
export const useUserContext = () => useContext(AuthContext)