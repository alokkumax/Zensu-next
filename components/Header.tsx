import React from 'react';
import Container from './Container';
import Logo from './Logo';
import HeaderMenu from './HeaderMenu';
import SearchBar from './SearchBar';
import CartIcon from './CartIcon';
import FavoriteButton from './FavoriteButton';
import Signin from './Signin';
import MobileMenu from './MobileMenu';
import { currentUser } from '@clerk/nextjs/server';
import { ClerkLoaded } from '@clerk/nextjs';
import { SignedIn, UserButton } from '@clerk/nextjs';

const Header = async  () => {
  const user = await currentUser();
  return (
    <header className="sticky top-0 z-50 py-5 bg-white/70 backdrop-blur-md">
        <Container className='flex items-center justify-between text-lightColor'>
          <div className='w-auto flex items-center justify-start gap-3 md:gap-0'>
            <MobileMenu />
            <HeaderMenu />
          </div>
          <Logo />
          <div className='w-auto md:1/3 flex items-center justify-end gap-5'>
          <FavoriteButton />
          <CartIcon />
          <SearchBar />
          <ClerkLoaded>
            <SignedIn>
              <UserButton />
            </SignedIn>
            {!user && <Signin />}
          </ClerkLoaded>
          </div>
         
        </Container>
    </header>
  );
}

export default Header;
