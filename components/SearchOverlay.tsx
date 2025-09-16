'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { urlFor } from '@/sanity/lib/image';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  discount: number;
  images: Array<{ asset: { _ref: string }; _key: string }>;
  categories: string[];
  variant: string;
}

interface Category {
  _id: string;
  title: string;
  slug: { current: string };
  productCount: number;
}

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      loadCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery.trim()) {
      setShowCategories(false);
      searchProductsDebounced(searchQuery);
    } else {
      setProducts([]);
      setShowCategories(true);
    }
  }, [searchQuery]);

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/search?type=categories');
      const data = await response.json();
      setCategories(data.categories || []);
      setShowCategories(true);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const searchProductsDebounced = async (query: string) => {
    setIsLoading(true);
    try {
      // Add a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 300));
      const response = await fetch(`/api/search?type=products&q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error searching products:', error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setProducts([]);
    setShowCategories(false);
    onClose();
  };

  const formatPrice = (price: number, discount: number) => {
    const discountedPrice = price - (price * discount) / 100;
    return {
      original: price,
      discounted: discountedPrice,
      hasDiscount: discount > 0
    };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="absolute top-0 left-0 right-0 bg-white shadow-lg animate-slide-down">
        <div className="max-w-4xl mx-auto p-6">
          {/* Search Input */}
          <div className="relative mb-6">
            <div className="flex items-center border-2 border-gray-200 bg-white">
              <Search className="w-5 h-5 text-gray-400 ml-4 mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="flex-1 text-lg py-4 border-0 outline-none bg-transparent placeholder-gray-400"
              />
              <button
                onClick={handleClose}
                className="mr-4 p-2 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="min-h-[300px]">
            {showCategories && !searchQuery && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  POPULAR SEARCHES
                </h3>
                <div className="grid grid-cols-1 gap-1">
                  {categories.slice(0, 7).map((category) => (
                    <Link
                      key={category._id}
                      href={`/category/${category.slug.current}`}
                      onClick={handleClose}
                      className="text-gray-700 hover:text-black py-3 px-4 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
                    >
                      {category.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {searchQuery && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Products Section */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">
                    PRODUCTS
                  </h3>
                  
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                  ) : products.length > 0 ? (
                    <div className="space-y-4">
                      {products.map((product) => {
                        const priceInfo = formatPrice(product.price, product.discount);
                        return (
                          <Link
                            key={product._id}
                            href={`/product/${product.slug.current}`}
                            onClick={handleClose}
                            className="flex items-center space-x-4 p-4 border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
                          >
                            <div className="w-16 h-16 bg-gray-100 flex-shrink-0">
                              {product.images && product.images[0] && (
                                <img
                                  src={urlFor(product.images[0]).width(64).height(64).url()}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 truncate">
                                {product.name}
                              </h4>
                              <div className="flex items-center space-x-2 mt-1">
                                {priceInfo.hasDiscount ? (
                                  <>
                                    <span className="text-sm font-semibold text-gray-900">
                                      ${priceInfo.discounted.toFixed(0)}
                                    </span>
                                    <span className="text-xs text-gray-500 line-through">
                                      ${priceInfo.original}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-sm font-semibold text-gray-900">
                                    ${priceInfo.original}
                                  </span>
                                )}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No products found for &quot;{searchQuery}&quot;
                    </div>
                  )}
                </div>

                {/* Suggestions Section */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">
                    SUGGESTIONS
                  </h3>
                  <div className="space-y-1">
                    {categories
                      .filter(cat => 
                        cat.title.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .slice(0, 4)
                      .map((category) => (
                        <Link
                          key={category._id}
                          href={`/category/${category.slug.current}`}
                          onClick={handleClose}
                          className="block text-gray-700 hover:text-black py-3 px-4 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
                        >
                          {category.title}
                        </Link>
                      ))}
                    {searchQuery && (
                      <Link
                        href={`/shop?search=${encodeURIComponent(searchQuery)}`}
                        onClick={handleClose}
                        className="block text-gray-600 hover:text-black py-3 px-4 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all text-sm"
                      >
                        Search for &quot;{searchQuery}&quot;
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
