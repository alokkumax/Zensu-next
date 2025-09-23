"use client";
import { Category, Product } from "@/sanity.types";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { client } from "@/sanity/lib/client";
import { AnimatePresence, motion } from "motion/react";
import { Loader2, ChevronDown } from "lucide-react";
import NoProductAvailable from "./NoProductAvailable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import ProductCard from "./ProductCard";
// Props: { categories: Category[], slug: string }

const CategoryProducts = ({ categories, slug }) => {
  const [currentSlug, setCurrentSlug] = useState(slug);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleCategoryChange = (newSlug) => {
    if (newSlug === currentSlug) return; // Prevent unnecessary updates
    setCurrentSlug(newSlug);
    router.push(`/category/${newSlug}`, { scroll: false }); // Update URL without
  };

  const fetchProducts = async (categorySlug) => {
    setLoading(true);
    try {
      const query = `
        *[_type == 'product' && references(*[_type == "category" && slug.current == $categorySlug]._id)] | order(name asc){
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
        "categories": categories[]->title}
      `;
      const data = await client.fetch(query, { categorySlug }, { 
        next: { revalidate: 60 } 
      });
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts(currentSlug);
  }, [currentSlug]);

  return (
    <div className="w-full">
      {/* Category Selector - Top Left */}
      <div className="flex justify-start mb-6">
        <div className="w-full max-w-xs">
          <Select value={currentSlug} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full border-gray-200 focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((item) => (
                <SelectItem
                  key={item?._id}
                  value={item?.slug?.current}
                  className="capitalize"
                >
                  {item?.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 min-h-80 space-y-4 text-center bg-gray-100 rounded-lg w-full">
            <div className="flex items-center space-x-2 text-red-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Product is loading...</span>
            </div>
          </div>
        ) : products?.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {products?.map((product) => (
              <AnimatePresence key={product._id}>
                <motion.div>
                  <ProductCard product={product} />
                </motion.div>
              </AnimatePresence>
            ))}
          </div>
        ) : (
          <NoProductAvailable
            selectedTab={currentSlug}
            className="mt-0 w-full"
          />
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;