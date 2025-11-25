import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations'
import { useUserContext } from '@/context/AuthContext'
import Logo from './Logo'

const Topbar = () => {
  const {mutate:signOut,isSuccess}=useSignOutAccount();
  const navigate=useNavigate();
  const {user}=useUserContext();
useEffect(() => {
  if(isSuccess) navigate(0);

}, [isSuccess])

    return (
    <section className=" bg-red-200 sticky top-0 ">
      <div className="flex justify-between items-center py-3 px-5">
        <Link to="/" className="flex gap-3 items-center">
          <Logo size="small" />
        </Link>
        <div className="flex gap-4">
          <Button
            variant="ghost"
            className="shad-button_ghost"
            onClick={() => signOut()}>
            <img src="/assets/icons/logout.svg" alt="logout" />
          </Button>
            <Link to={`/profile/${user.id}`} className="flex-center gap-3">
            <img
              src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="h-8 w-8 rounded-full"
            />
          </Link>
             </div>
      </div>
    </section>
  
  )
}

export default Topbar