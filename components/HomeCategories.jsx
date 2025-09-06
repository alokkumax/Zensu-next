import React from "react";
import Title from "./Title";
import { Category } from "@/sanity.types";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";

const HomeCategories = ({ categories }) => {
  return (
    <div className="my-25">
      {/* Centered Heading */}
      <div>
        <h2 className="text-2xl md:text-3xl font-light text-center font-poppins mb-2">
        Zensu's Collections
        </h2>
        <p className="text-sm text-center md:text-sm font-poppins text-[#767676] mb-8">
          Explore our world of travel essentials—crafted suitcases, timeless handbags, and versatile backpacks.</p>

      </div>
      
      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories?.map((category) => (
          <div key={category?._id} className="flex flex-col items-center text-center group">
            {/* Image Container */}
            <Link
              href={`/category/${category?.slug?.current}`}
              className="w-full overflow-hidden"
            >
              {category?.image?.asset ? (
                <div className="w-full h-[600px] relative overflow-hidden flex justify-center">
                  <Image
                    src={urlFor(category.image).url()}
                    alt="categoryImage"
                    // fill
                    className="object-cover flex align-center"
                    height={400}
                    width={400}
                  />
                </div>
              ) : (
                <div className="w-full h-[400px] flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </Link>

            {/* Title & Button */}
            <div className="mt-5">
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
    </div>
  );
};

export default HomeCategories;
