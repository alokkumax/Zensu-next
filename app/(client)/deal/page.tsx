import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import Title from "@/components/Title";
import { getDealProducts } from "@/sanity/queries";
import React from "react";

const DealPage = async () => {
  const products = await getDealProducts();
  return (
    <div className="p-10 bg-s">
      <Container >
        {/* <Title className="mb-5 underline underline-offset-4 decoration-[1px] text-base uppercase tracking-wide">
          Hot Deals of the Week
        </Title> */}
          <div>
        <h2 className="text-2xl md:text-3xl font-light text-center font-poppins mb-2">
        Hot Deals of the Week
        </h2>
        <p className="text-sm text-center md:text-sm font-poppins text-[#767676] mb-8">
          Discover exclusive savings on our bestsellers this week. From sleek suitcases to stylish handbags and versatile backpacks, enjoy limited-time deals crafted just for you.</p>

      </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {products?.map((product) => (
            // @ts-ignore
            <ProductCard key={product?._id} product={product} />
          ))}
        </div>
      </Container>
    </div>
  );
};

export default DealPage;