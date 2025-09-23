"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface LatestBlogProps {
  blogs: any[];
}

const LatestBlog = ({ blogs }: LatestBlogProps) => {
  const scrollContainerRef = useRef(null);

  // Carousel navigation functions with snappy scroll
  const scrollToNext = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth;
      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollToPrev = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth;
      container.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="my-12 container mx-auto px-4 max-w-7xl">
      {/* Centered Heading */}
      <div>
        <h2 className="text-2xl md:text-3xl font-light text-center font-poppins mb-2">
          Stories
        </h2>
        <p className="text-sm text-center md:text-sm font-poppins text-[#767676] mb-8">
          Discover our newest articles and stay up to date with the latest trends and stories
        </p>
      </div>
      
      {/* Stories Layout */}
      <div className="relative">
        {/* Desktop: Centered Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 justify-center">
          {blogs?.map((blog: any) => (
            <div key={blog?._id} className="flex flex-col items-center text-center group">
              {/* Image Container */}
              <Link
                href={`/blog/${blog?.slug?.current}`}
                className="w-full max-w-md mx-auto overflow-hidden"
              >
                {blog?.mainImage && (
                  <div className="w-full h-[400px] relative overflow-hidden flex items-center justify-center">
                    <Image
                      src={urlFor(blog?.mainImage).url()}
                      alt="blogImage"
                      className="object-cover flex align-center"
                      height={400}
                      width={400}
                    />
                  </div>
                )}
              </Link>

              {/* Content */}
              <div className="mt-5 max-w-md mx-auto">
                <h3 className="text-lg font-medium mb-2">{blog?.title}</h3>
                <Link
                  href={`/blog/${blog?.slug?.current}`}
                  className="inline-block text-[#767676] italic text-sm underline hover:text-shop_dark_green transition"
                >
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: Horizontal Scrollable Stories */}
        <div className="md:hidden">
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide mobile-horizontal-scroll pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {blogs?.map((blog: any) => (
              <div key={blog?._id} className="flex-shrink-0 w-80">
                <div className="flex flex-col items-center text-center group">
                  {/* Image Container */}
                  <Link
                    href={`/blog/${blog?.slug?.current}`}
                    className="w-full overflow-hidden"
                  >
                    {blog?.mainImage && (
                      <div className="w-full h-[400px] relative overflow-hidden flex items-center justify-center">
                        <Image
                          src={urlFor(blog?.mainImage).url()}
                          alt="blogImage"
                          className="object-cover flex align-center"
                          height={400}
                          width={320}
                          style={{ width: "auto", height: "auto" }}
                        />
                      </div>
                    )}
                  </Link>

                  {/* Content */}
                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2">{blog?.title}</h3>
                    <Link
                      href={`/blog/${blog?.slug?.current}`}
                      className="inline-block text-[#767676] italic text-sm underline hover:text-shop_dark_green transition"
                    >
                      Read More
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
              aria-label="Previous stories"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={scrollToNext}
              className="flex items-center justify-center w-10 h-10 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
              aria-label="Next stories"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestBlog;