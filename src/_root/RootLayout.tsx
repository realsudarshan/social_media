import Bottombar from '@/components/shared/Bottombar'
import LeftSidebar from '@/components/shared/LeftSidebar'
import Topbar from '@/components/shared/Topbar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const RootLayout = () => {
  return (
    <div className='w-full h-screen flex flex-col'>
      <div className='sticky top-0 z-50'>
        <Topbar />
      </div>
      
      <div className='flex flex-1 overflow-hidden'>
        <div className='sticky top-0 h-screen'>
          <LeftSidebar/>
        </div>
        
        <main className='flex-1 overflow-y-auto'>
          <Outlet/>
        </main>
      </div>
      
      <div className='sticky bottom-0 z-50'>
        <Bottombar/>
      </div>
    </div>
  )
}

export default RootLayout

