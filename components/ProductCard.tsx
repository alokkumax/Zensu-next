import { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { Flame } from "lucide-react";
import PriceView from "./PriceView";
// import AddToWishList from "./AddToWishList";
import FavoriteButton from "./FavoriteButton";
// import AddToCartButton from "./AddToCartButton";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="group bg-white flex flex-col min-w-[280px] sm:min-w-0">
      <div className="relative w-full overflow-hidden">
        {product?.images && product.images.length > 0 && (
          <Link href={`/product/${product?.slug?.current}`}>
            <div className="relative w-full h-[600px]">
              {/* First Image */}
              <Image
                src={urlFor(product.images[0]).width(400).height(400).quality(80).url()}
                alt={product?.name || "Product Image"}
                width={400}
                height={400}
                loading="lazy"
                className={`w-full h-full object-cover transition-opacity duration-500
                group-hover:opacity-0 ${product?.stock === 0 ? "opacity-50" : "opacity-100"}`}
              />
              {/* Second Image (shows on hover) */}
              {product.images.length > 1 && (
                <Image
                  src={urlFor(product.images[1]).width(400).height(400).quality(80).url()}
                  alt={product?.name || "Product Image"}
                  width={400}
                  height={400}
                  loading="lazy"
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
              <p className="text-xs font-medium bg-red-500 text-white px-4 py-1.5 rounded-full shadow-sm">
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
      <div className="px-0 mt-1 md:mt-2 mb-1 md:mb-2 flex flex-col gap-0.5 md:gap-1">
        {product?.categories && (
          <p className="text-[#767676] italic text-sm font-poppins font-normal">
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
  );
};

export default ProductCard;