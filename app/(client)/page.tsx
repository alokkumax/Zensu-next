import Container from '@/components/Container';
import HomeBanner from '@/components/HomeBanner';
import ProductGrid from '@/components/ProductGrid';
import HomeCategories from '@/components/HomeCategories';
import Perks from '@/components/Perks';
import React from 'react';
import { getCategories, getLatestBlogs } from "@/sanity/queries";
import LatestBlog from '@/components/LatestBlog';

const Home = async() => {
  const categories = await getCategories();
  const blogs = await getLatestBlogs();
  console.log(categories)
  return (
    <Container>
      <HomeBanner />
      <div className='py-4 md:py-4 px-4 md:px-12'>
        <ProductGrid />
        <HomeCategories categories={categories} />
        <LatestBlog blogs={blogs} />
        <Perks />

      </div>
      {/* <Collection/> */}
    </Container>
  );
}

export default Home;
