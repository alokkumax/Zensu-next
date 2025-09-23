"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence } from "motion/react";
import { client } from "@/sanity/lib/client";
import NoProductAvailable from "./NoProductAvailable";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import Container from "./Container";
import { productTypeZ } from "@/constants/data";
import { Product } from "@/sanity.types";

const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [selectedTab, setSelectedTab] = useState("All");
  // const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  // Carousel navigation functions with snappy scroll
  const scrollToNext = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = 280; // Approximate card width
      const gap = 16; // Gap between cards
      const scrollAmount = cardWidth + gap;
      
      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollToPrev = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = 280; // Approximate card width
      const gap = 16; // Gap between cards
      const scrollAmount = cardWidth + gap;
      
      container.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Container className="flex flex-col lg:px-0 my-2 md:my-4">
      {/* ✅ Section Heading */}
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-light text-center font-poppins mb-2">
          What&apos;s Trending
        </h2>
      </div>
      
      {/* ✅ Tab Bar */}
      <div className="flex items-center justify-between gap-4">
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
                className={`cursor-pointer px-3 py-2 text-sm transition-all duration-200 rounded-md ${
                  isActive
                    ? "bg-gray-200 text-black"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
          className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
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
        <div className="mt-6 relative">
          {/* Horizontal Scrollable Products */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide mobile-horizontal-scroll pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products?.slice(0, 6).map((product) => (
              <AnimatePresence key={product?._id}>
                <motion.div
                  layout
                  initial={{ opacity: 0.2 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-shrink-0"
                >
                  <ProductCard key={product?._id} product={product} />
                </motion.div>
              </AnimatePresence>
            ))}
          </div>
          
          {/* Arrow Buttons - Below Products */}
          <div className="flex justify-center items-center mt-4 gap-4">
            <button
              onClick={scrollToPrev}
              className="flex items-center justify-center w-10 h-10 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
              aria-label="Previous products"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={scrollToNext}
              className="flex items-center justify-center w-10 h-10 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
              aria-label="Next products"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      ) : (
        <NoProductAvailable selectedTab={selectedTab} />
      )}
    </Container>
  );
};

export default ProductGrid;
