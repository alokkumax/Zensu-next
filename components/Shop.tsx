"use client";
import { Category, Product } from "@/sanity.types";
import React, { useEffect, useState, useCallback, useRef } from "react";
import Container from "./Container";
import CategoryList from "./shop/CategoryList";
import { useSearchParams } from "next/navigation";
// import BrandList from "./shop/BrandList";
import PriceList from "./shop/PriceList";
import { client } from "@/sanity/lib/client";
import { Loader2, Filter } from "lucide-react";
import NoProductAvailable from "./NoProductAvailable";
import ProductCard from "./ProductCard";
import { useCurrency } from "@/contexts/CurrencyContext";
import { getProductPriceByCurrency } from "@/lib/currencyUtils";
import MobileFilterModal from "./MobileFilterModal";

interface Props {
  categories: Category[];
  // brands: BRANDS_QUERYResult;
}
const Shop = ({ categories }: Props) => {
  const searchParams = useSearchParams();
  const brandParams = searchParams?.get("brand");
  const categoryParams = searchParams?.get("category");
  const { currency } = useCurrency();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true); // Start with loading true for initial load
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categoryParams || null
  );
  const [selectedBrand, setSelectedBrand] = useState<string | null>(
    brandParams || null
  );
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const fetchProducts = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const query = `
      *[_type == 'product' 
        && (!defined($selectedCategory) || references(*[_type == "category" && slug.current == $selectedCategory]._id))
        && (!defined($selectedBrand) || references(*[_type == "brand" && slug.current == $selectedBrand]._id))
        && defined(price)
      ] 
      | order(name asc) {
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
        "categories": categories[]->title
      }
    `;
      
      const allProducts = await client.fetch(
        query,
        { selectedCategory, selectedBrand },
        { next: { revalidate: 60 } } // Cache for 1 minute
      );

      // Check if request was cancelled
      if (signal?.aborted) return;

      // Filter products by currency-specific price if price filter is selected
      let filteredProducts = allProducts;
      
      if (selectedPrice) {
        const [minPrice, maxPrice] = selectedPrice.split("-").map(Number);
        
        filteredProducts = allProducts.filter((product: Product) => {
          if (!product.price) return false;
          
          // Create a ProductPrice object with required fields
          const productPriceData = {
            price: product.price,
            discount: product.discount || 0,
            priceUAE: product.priceUAE,
            discountUAE: product.discountUAE,
            priceNPR: product.priceNPR,
            discountNPR: product.discountNPR,
          };
          
          const productPrice = getProductPriceByCurrency(productPriceData, currency);
          return productPrice.price >= minPrice && productPrice.price <= maxPrice;
        });
      }
      
      if (!signal?.aborted) {
        setProducts(filteredProducts);
      }
    } catch (error) {
      if (!signal?.aborted) {
        console.log("Shop product fetching Error", error);
        setProducts([]);
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, [selectedCategory, selectedBrand, selectedPrice, currency]);

  // Initial load effect
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Filter change effect with debouncing
  useEffect(() => {
    // Clear existing timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    // Create AbortController for this request
    const abortController = new AbortController();
    
    // Set new timeout for debounced fetch
    debounceRef.current = setTimeout(() => {
      fetchProducts(abortController.signal);
    }, 150); // Reduced to 150ms for faster response

    // Cleanup function
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      abortController.abort();
    };
  }, [fetchProducts]);
  return (
    <div className="border-t md:px-20 p-2">
      <Container className="mt-5">
        <div className="sticky top-0 z-10 mb-3 hidden md:block">
          <div className="flex items-center justify-between">
            <h3 className="text-lg uppercase text-black/90 tracking-wide">
              FILTERS
            </h3>
            {(selectedCategory !== null ||
              selectedBrand !== null ||
              selectedPrice !== null) && (
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedBrand(null);
                  setSelectedPrice(null);
                }}
                className="text-shop_dark_green underline text-sm mt-2 font-medium hover:text-darkRed hoverEffect"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
        {/* Mobile Filter Button */}
        <div className="md:hidden flex justify-end p-4 border-t border-gray-200">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Sort / Filters
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-5 md:border-t border-t-shop_dark_green/50">
          {/* Desktop Filters */}
          <div className="hidden md:block md:sticky md:top-20 md:self-start md:h-[calc(100vh-160px)] md:overflow-y-auto md:min-w-64 pb-5 md:border-r border-r-shop_btn_dark_green/50 scrollbar-hide">
            <CategoryList
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
            {/* <BrandList
              brands={brands}
              setSelectedBrand={setSelectedBrand}
              selectedBrand={selectedBrand}
            /> */}
            <PriceList
              setSelectedPrice={setSelectedPrice}
              selectedPrice={selectedPrice}
            />
          </div>
          
          {/* Products Grid */}
          <div className="flex-1 pt-5">
            <div className="h-[calc(100vh-160px)] overflow-y-auto pr-2 scrollbar-hide">
              {loading ? (
                <div className="p-20 flex flex-col gap-2 items-center justify-center bg-white">
                  <Loader2 className="w-10 h-10 text-shop_dark_green animate-spin" />
                  <p className="font-semibold tracking-wide text-base">
                    Product is loading . . .
                  </p>
                </div>
              ) : products?.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {products?.map((product) => (
                    <ProductCard key={product?._id} product={product} />
                  ))}
                </div>
              ) : (
                <NoProductAvailable className="bg-white mt-0" />
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filter Modal */}
        <MobileFilterModal
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedPrice={selectedPrice}
          setSelectedPrice={setSelectedPrice}
          onResetFilters={() => {
            setSelectedCategory(null);
            setSelectedBrand(null);
            setSelectedPrice(null);
          }}
          productCount={products.length}
        />
      </Container>
    </div>
  );
};

export default Shop;