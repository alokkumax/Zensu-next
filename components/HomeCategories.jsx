"use client";

import React, { useRef } from "react";
import Title from "./Title";
import { Category } from "@/sanity.types";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HomeCategories = ({ categories }) => {
  const scrollContainerRef = useRef(null);

  // Carousel navigation functions with snappy scroll
  const scrollToNext = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = 320; // Approximate card width
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
      const cardWidth = 320; // Approximate card width
      const gap = 16; // Gap between cards
      const scrollAmount = cardWidth + gap;
      
      container.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="my-16 md:my-12">
      {/* Centered Heading */}
      <div>
        <h2 className="text-2xl md:text-3xl font-light text-center font-poppins mb-2">
        Zensu's Collections
        </h2>
        <p className="text-sm text-center md:text-sm font-poppins text-[#767676] mb-8">
          Explore our world of travel essentials—crafted suitcases, timeless handbags, and versatile backpacks.</p>
      </div>
      
      {/* Categories Layout */}
      <div className="relative">
        {/* Desktop: Centered Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8 justify-center">
          {categories?.map((category) => (
            <div key={category?._id} className="flex flex-col items-center text-center group">
              {/* Image Container */}
              <Link
                href={`/category/${category?.slug?.current}`}
                className="w-full overflow-hidden"
              >
                {category?.image?.asset ? (
                  <div className="w-full h-[400px] relative overflow-hidden flex justify-center">
                    <Image
                      src={urlFor(category.image).url()}
                      alt="categoryImage"
                      className="object-cover flex align-center"
                      height={400}
                      width={320}
                      style={{ width: "auto", height: "auto" }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-[400px] flex items-center justify-center bg-gray-100">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
              </Link>

              {/* Title & Button */}
              <div className="mt-4">
                <h3 className="text-lg font-medium">{category?.title}</h3>
                <Link
                  href={`/category/${category?.slug?.current}`}
                  className="mt-2 text-[#767676] italic inline-block text-sm underline hover:text-shop_dark_green transition"
                >
                  Explore
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: Horizontal Scrollable Categories */}
        <div className="md:hidden">
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide mobile-horizontal-scroll pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories?.map((category) => (
              <div key={category?._id} className="flex-shrink-0 w-80">
                <div className="flex flex-col items-center text-center group">
                  {/* Image Container */}
                  <Link
                    href={`/category/${category?.slug?.current}`}
                    className="w-full overflow-hidden"
                  >
                    {category?.image?.asset ? (
                      <div className="w-full h-[400px] relative overflow-hidden flex justify-center">
                        <Image
                          src={urlFor(category.image).url()}
                          alt="categoryImage"
                          className="object-cover flex align-center"
                          height={400}
                          width={320}
                          style={{ width: "auto", height: "auto" }}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-[400px] flex items-center justify-center bg-gray-100">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                  </Link>

                  {/* Title & Button */}
                  <div className="mt-4">
                    <h3 className="text-lg font-medium">{category?.title}</h3>
                    <Link
                      href={`/category/${category?.slug?.current}`}
                      className="mt-2 text-[#767676] italic inline-block text-sm underline hover:text-shop_dark_green transition"
                    >
                      Explore
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Arrow Buttons - Mobile Only */}
          <div className="flex justify-center items-center mt-4 gap-4">
            <button
              onClick={scrollToPrev}
              className="flex items-center justify-center w-10 h-10 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
              aria-label="Previous categories"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={scrollToNext}
              className="flex items-center justify-center w-10 h-10 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
              aria-label="Next categories"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeCategories;
