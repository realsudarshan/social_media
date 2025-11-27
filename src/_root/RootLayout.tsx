import Bottombar from '@/components/shared/Bottombar'
import LeftSidebar from '@/components/shared/LeftSidebar'
import Topbar from '@/components/shared/Topbar'
import EmailVerificationBanner from '@/components/shared/EmailVerificationBanner'
import { useUserContext } from '@/context/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'

const RootLayout = () => {
  const { isAuthenticated, isLoading } = useUserContext();

  if (isLoading) return null; // Or a loader component

  return (
    isAuthenticated ? (
      <div className='w-full h-screen flex flex-col'>
        <div className='sticky top-0 z-50'>
          <Topbar />
          <EmailVerificationBanner />
        </div>

        <div className='flex flex-1 overflow-hidden h-screen '>
          <div className='sticky top-0 h-screen w-1/4'>
            <LeftSidebar />
          </div>

          <main className='flex-1 overflow-y-auto'>
            <Outlet />
          </main>
        </div>

        <div className='sticky bottom-0 z-50'>
          <Bottombar />
        </div>
      </div>
    ) : (
      <Navigate to='/sign-in' />
    )
  )
}

export default RootLayout

