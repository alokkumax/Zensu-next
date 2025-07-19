import Link from 'next/link';
import React from 'react';

const Logo = () => {
  return <Link href="/">
    <h2 
        className='text-2xl
            text-shop-dark-grey 
            font-poppins
            uppercase 
            hover:text-shop-primary'
    >
        ZENSU
    </h2>
  </Link>;
}

export default Logo;
