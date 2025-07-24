import Collection from '@/components/Collection';
import Container from '@/components/Container';
import HomeBanner from '@/components/HomeBanner';
import ProductGrid from '@/components/ProductGrid';
import React from 'react';

const Home = () => {
  return (
    <Container>
      <HomeBanner />
      <div className='p-8'>
        <ProductGrid />
      </div>
      {/* <Collection/> */}
    </Container>
  );
}

export default Home;
