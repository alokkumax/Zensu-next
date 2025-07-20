import Collection from '@/components/Collection';
import Container from '@/components/Container';
import HomeBanner from '@/components/HomeBanner';
import React from 'react';

const Home = () => {
  return (
    <Container>
      <HomeBanner />
      <Collection/>
    </Container>
  );
}

export default Home;
