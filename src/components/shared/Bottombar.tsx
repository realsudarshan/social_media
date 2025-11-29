import { bottombarLinks } from '@/constants';
import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import { useUserContext } from '@/context/AuthContext';
import { toast } from 'sonner';

const BottomBar = () => {
  const { pathname } = useLocation();
  const { isEmailVerified } = useUserContext();

  const handleRestrictedClick = (e: React.MouseEvent, route: string) => {
    if (!isEmailVerified && route === '/create-post') {
      e.preventDefault();
      toast.error("Please verify your email to create posts");
    }
  };

  return (
    <section className="bottom-bar">
      {bottombarLinks.map((link) => {
        const isActive = pathname === link.route;
        const isRestricted = !isEmailVerified && link.route === '/create-post';

        return (
          <Link
            key={`bottombar-${link.label}`}
            to={link.route}
            onClick={(e) => handleRestrictedClick(e, link.route)}
            className={`${isActive && "rounded-[10px] bg-primary-500 "
              } ${isRestricted && 'opacity-50'} flex-center flex-col gap-1 p-2 transition`}>
            <img
              src={link.imgURL}
              alt={link.label}
              width={16}
              height={16}
              className={`${isActive && "invert-white"}`}
            />

            <p className="tiny-medium text-light-2">
              {link.label}
              {isRestricted && ' 🔒'}
            </p>
          </Link>
        );
      })}
    </section>
  );
}

export default BottomBar