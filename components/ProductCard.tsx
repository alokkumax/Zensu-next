import { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { StarIcon } from "@sanity/icons";
import { Flame } from "lucide-react";
import PriceView from "./PriceView";
import Title from "./Title";
import AddToWishList from "./AddToWishList";
// import ProductSideMenu from "./ProductSideMenu";
// import AddToCartButton from "./AddToCartButton";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="text-sm border-[1px] rounded-md border-darkBlue/20 group bg-white">
      <div className="relative group overflow-hidden bg-shop_light_bg">
        {product?.images && product.images.length > 0 && (
          <Link href={`/product/${product?.slug?.current}`}>
            <div className="relative w-full h-64">
              {/* First Image */}
              <Image
                src={urlFor(product.images[0]).url()}
                alt="productImage"
                width={700}
                height={700}
                priority
                className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 bg-shop_light_bg
                group-hover:opacity-0 ${product?.stock === 0 ? "opacity-50" : "opacity-100"}`}
              />
              {/* Second Image (shows on hover) */}
              {product.images.length > 1 && (
                <Image
                  src={urlFor(product.images[1]).url()}
                  alt="productImage"
                  width={700}
                height={700}
                  className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 bg-shop_light_bg opacity-0 
                  group-hover:opacity-100 ${product?.stock === 0 ? "opacity-50" : ""}`}
                />
              )}
            </div>
          </Link>
        )}
        <AddToWishList product={product} />
        {/* <ProductSideMenu product={product} /> */}
        {product?.status === "sale" ? (
          <p className="absolute top-2 left-2 z-10 text-xs border border-darkColor/50 px-2 rounded-full group-hover:border-lightGreen hover:text-shop_dark_green hoverEffect">
            Sale!
          </p>
        ) : (
          <Link
            href={"/hot"}
            className="absolute top-2 left-2 z-10 border border-shop_orange/50 p-1 rounded-full group-hover:border-shop_orange hover:text-shop_dark_green hoverEffect"
          >
            <Flame
              size={18}
              fill="#fb6c08"
              className="text-shop_orange/50 group-hover:text-shop_orange hoverEffect"
            />
          </Link>
        )}
      </div>
      <div className="p-3 flex flex-col gap-2">
        {/* {product?.categories && (
          <p className="uppercase line-clamp-1 text-xs font-medium text-lightText">
            {product.categories.map((cat) => cat).join(", ")}
          </p>
        )} */}
        <Title className="text-sm line-clamp-1">{product?.name}</Title>
        {/* <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
              <StarIcon
                key={index}
                className={
                  index < 4 ? "text-shop_light_green" : " text-lightText"
                }
                fill={index < 4 ? "#93D991" : "#ababab"}
              />
            ))}
          </div>
          <p className="text-lightText text-xs tracking-wide">5 Reviews</p>
        </div> */}

        {/* <div className="flex items-center gap-2.5">
          <p className="font-medium">In Stock</p>
          <p
            className={`${product?.stock === 0 ? "text-red-600" : "text-shop_dark_green/80 font-semibold"}`}
          >
            {(product?.stock as number) > 0 ? product?.stock : "unavailable"}
          </p>
        </div> */}

        <PriceView
          price={product?.price}
          discount={product?.discount}
          className="text-sm"
        />
        {/* <AddToCartButton product={product} className="w-36 rounded-full" /> */}
      </div>
    </div>
  );
};

export default ProductCard;