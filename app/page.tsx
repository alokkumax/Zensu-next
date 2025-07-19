import Container from '@/components/Container';
import { Button } from '@/components/ui/button';
import React from 'react';

const Home = () => {
  return (
    <Container className='p-10 bg-shop-light-grey'>
      <h1 className='text-xl font-semibold'>Welcome to the Home Page</h1>
      <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nobis sint soluta aspernatur quam qui. Autem soluta explicabo velit dignissimos iusto deserunt minus quis quod earum pariatur error voluptas accusamus ipsa assumenda obcaecati commodi exercitationem distinctio aperiam ad maxime, nisi consectetur libero! Possimus rem adipisci eaque dignissimos quia molestiae optio eum!</p>
      <Button size="lg">Click Me</Button>
    </Container>
  );
}

export default Home;
