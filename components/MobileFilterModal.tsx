"use client";

import React from "react";
import { X } from "lucide-react";
import CategoryList from "./shop/CategoryList";
import PriceList from "./shop/PriceList";
import { Category } from "@/sanity.types";

interface MobileFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  selectedCategory: string | null;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | null>>;
  selectedPrice: string | null;
  setSelectedPrice: React.Dispatch<React.SetStateAction<string | null>>;
  onResetFilters: () => void;
  productCount: number;
}

const MobileFilterModal: React.FC<MobileFilterModalProps> = ({
  isOpen,
  onClose,
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedPrice,
  setSelectedPrice,
  onResetFilters,
  productCount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-transparent"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">FILTERS</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Categories */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">CATEGORIES</h3>
              <CategoryList
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            </div>

            {/* Price */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">PRICE</h3>
              <PriceList
                setSelectedPrice={setSelectedPrice}
                selectedPrice={selectedPrice}
              />
            </div>
          </div>
          
          {/* Footer */}
          <div className="border-t border-gray-200 p-4 space-y-3">
            <button
              onClick={onClose}
              className="w-full bg-black text-white py-3 px-4 rounded-md font-semibold text-sm hover:bg-gray-800 transition-colors"
            >
              VIEW {productCount} PRODUCTS
            </button>
            <button
              onClick={onResetFilters}
              className="w-full text-gray-600 underline text-sm hover:text-gray-800 transition-colors"
            >
              REMOVE ALL FILTERS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileFilterModal;
