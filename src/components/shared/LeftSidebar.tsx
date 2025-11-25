import React, { useEffect } from 'react'
import { Link, Navigate, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations'
import { INITIAL_USER, useUserContext } from '@/context/AuthContext'
import { sidebarLinks } from '@/constants'
import { INavLink } from '@/types'
import Loader from './Loader'
import { toast } from 'sonner'

const LeftSidebar = () => {
  const pathname = useLocation();
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate();
  const { user, setUser, setIsAuthenticated, isLoading, isEmailVerified } = useUserContext();
  useEffect(() => {
    if (isSuccess) navigate(0);

  }, [isSuccess])

  const handleSignOut = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    signOut();
    setIsAuthenticated(false);
    setUser(INITIAL_USER);
    navigate("/sign-in");
  };

  const handleRestrictedClick = (e: React.MouseEvent, route: string) => {
    if (!isEmailVerified && route === '/create-post') {
      e.preventDefault();
      toast.error("Please verify your email to create posts");
    }
  };

  return (
    <nav className="leftsidebar bg-yellow-100 h-full">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="/assets/images/logo.svg"
            alt="logo"
            width={170}
            height={36}
          />
        </Link>

        {isLoading || !user.email ? (
          <div className="h-14">
            <Loader />
          </div>
        ) : (

          <Link to={`/profile/${user.id}`} className="flex gap-3 items-center ml-2 max-w-full overflow-hidden">
            <img
              src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="h-14 w-14 rounded-full shrink"
            />
            <div className="flex flex-col">
              <p className="body-bold">{user.name}</p>
              <p className="small-regular text-light-3">@{user.username}</p>
            </div>
          </Link>

        )}

        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route as any;
            const isRestricted = !isEmailVerified && link.route === '/create-post';

            return (
              <li
                key={link.label}
                className={`leftsidebar-link group ${isActive && "bg-primary-500"
                  } ${isRestricted && 'opacity-50'}`}>
                <NavLink
                  to={link.route}
                  onClick={(e) => handleRestrictedClick(e, link.route)}
                  className="flex gap-4 items-center p-4">
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white ${isActive && "invert-white"
                      }`}
                  />
                  {link.label}
                  {isRestricted && <span className="text-xs ml-auto">🔒</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>

      <Button
        variant="ghost"
        className="shad-button_ghost"
        onClick={(e) => handleSignOut(e)}>
        <img src="/assets/icons/logout.svg" alt="logout" />
        <p className="small-medium lg:base-medium">Logout</p>
      </Button>
    </nav>
  );
}

export default LeftSidebar