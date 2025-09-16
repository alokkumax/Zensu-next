import { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import PriceView from "./PriceView";
import { Flame } from "lucide-react";
import FavoriteButton from "./FavoriteButton";

interface RelatedProductsProps {
  products: Product[];
  title?: string;
}

const RelatedProducts = ({ products, title = "WE THINK YOU'LL LOVE" }: RelatedProductsProps) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="w-full py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 font-poppins">{title}</h2>
        <div className="flex gap-8 overflow-x-auto pb-6 scrollbar-hide">
          {products.map((product) => (
            <div key={product._id} className="group bg-white flex flex-col min-w-[280px] sm:min-w-0 flex-shrink-0">
              <div className="relative w-full overflow-hidden">
                {product?.images && product.images.length > 0 && (
                  <Link href={`/product/${product?.slug?.current}`}>
                    <div className="relative w-full h-[600px]">
                      {/* First Image */}
                      <Image
                        src={urlFor(product.images[0]).url()}
                        alt={product?.name || "Product Image"}
                        width={400}
                        height={400}
                        priority
                        className={`w-full h-full object-cover transition-opacity duration-500
                        group-hover:opacity-0 ${product?.stock === 0 ? "opacity-50" : "opacity-100"}`}
                      />
                      {/* Second Image (shows on hover) */}
                      {product.images.length > 1 && (
                        <Image
                          src={urlFor(product.images[1]).url()}
                          alt={product?.name || "Product Image"}
                          width={400}
                          height={400}
                          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 
                          group-hover:opacity-100 ${product?.stock === 0 ? "opacity-50" : ""}`}
                        />
                      )}
                    </div>
                  </Link>
                )}
                
                <div className="absolute top-4 right-4 hover:cursor-pointer">
                  <FavoriteButton showProduct={true} product={product} />
                </div>

                {product?.status && (
                  <div className="absolute top-4 left-4 z-10">
                    {product.status === "sale" ? (
                      <p className="text-xs font-medium bg-red-500 text-white px-4 py-1.5 rounded-full shadow-sm font-poppins">
                        Sale!
                      </p>
                    ) : product.status === "hot" ? (
                      <div className="border-2 border-shop_orange p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm">
                        <Flame
                          size={18}
                          fill="#fb6c08"
                          className="text-shop_orange"
                        />
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
              <div className="px-0 mt-2 mb-2 flex flex-col gap-1">
                {product?.categories && (
                  <p className="text-[#767676] italic text-sm">
                    {product.categories.map((cat) => cat._type).join(" · ")}
                  </p>
                )}
                <Link href={`/product/${product?.slug?.current}`}>
                  <h3 className="text-[16px] font-medium line-clamp-1 transition-colors font-poppins">
                    {product?.name || "Product Name"}
                  </h3>
                </Link>
                <PriceView
                  product={product}
                  className="text-base font-normal text-[#767676] text-[14px] font-poppins"
                />
                {product?.stock === 0 && (
                  <p className="text-red-500 text-sm font-medium font-poppins">Out of Stock</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;
