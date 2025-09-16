"use client";

import React, { useEffect, useState, useCallback } from "react";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence } from "motion/react";
import { client } from "@/sanity/lib/client";
import NoProductAvailable from "./NoProductAvailable";
import { Loader2 } from "lucide-react";
import Container from "./Container";
import { productTypeZ } from "@/constants/data";
import { Product } from "@/sanity.types";

const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [selectedTab, setSelectedTab] = useState("All");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Optimized query with specific fields only
      const query = `*[_type == "product" ${
        selectedTab.toLowerCase() === "all"
          ? "&& isFeatured == true"
          : "&& variant == $variant"
      }] | order(name asc){
        _id,
        name,
        slug,
        price,
        discount,
        priceUAE,
        discountUAE,
        priceNPR,
        discountNPR,
        images,
        stock,
        status,
        variant,
        isFeatured,
        "categories": categories[]->title
      }`;
      
      const params = { variant: selectedTab.toLowerCase() };
      
      const response = await client.fetch(query, params, { 
        next: { revalidate: 60 } // Cache for 1 minute
      });
      
      setProducts(response);
    } catch (error) {
      console.log("Product fetching Error", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedTab]);

  // Initial load effect
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Container className="flex flex-col lg:px-0 my-5 md:my-10">
      {/* ✅ Tab Bar */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3 md:gap-6">
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          {productTypeZ.map((tab) => {
            const isActive = selectedTab === tab.title;
            return (
              <motion.button
                key={tab.title}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  isActive ? setSelectedTab("All") : setSelectedTab(tab.title)
                }
                className={`cursor-pointer px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-gray-100 text-black border border-black"
                    : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {tab.title}
              </motion.button>
            );
          })}
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.href = '/shop'}
          className="px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm underline rounded-md cursor-pointer border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-all duration-200 w-fit"
          >
          See all
        </motion.button>
      </div>

      {/* ✅ Products */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 min-h-80 space-y-4 text-center bg-gray-100 rounded-lg w-full mt-10">
          <motion.div className="flex items-center space-x-2 text-blue-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Product is loading...</span>
          </motion.div>
        </div>
      ) : products?.length ? (
        <div className="mt-5 md:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 lg:gap-10 w-full min-[420px]:grid-cols-1">
          {products?.map((product) => (
            <AnimatePresence key={product?._id}>
              <motion.div
                layout
                initial={{ opacity: 0.2 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ProductCard key={product?._id} product={product} />
              </motion.div>
            </AnimatePresence>
          ))}
        </div>
      ) : (
        <NoProductAvailable selectedTab={selectedTab} />
      )}
    </Container>
  );
};

export default ProductGrid;
