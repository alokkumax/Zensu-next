"use client";

import { twMerge } from "tailwind-merge";
import { cn } from "@/lib/utils";
import PriceFormatter from "./PriceFormatter";
import { useCurrency } from "@/contexts/CurrencyContext";
import { getProductPriceByCurrency } from "@/lib/currencyUtils";
import { useMemo } from "react";

/**
 * @param {Object} props
 * @param {Object} props.product - Product object with price fields
 * @param {string=} props.className
 */
const PriceView = ({ product, className }) => {
  const { currency } = useCurrency();
  
  // Memoize price calculation to prevent unnecessary recalculations
  const priceData = useMemo(() => {
    if (!product?.price) return { price: 0, discount: 0 };
    
    const productPriceData = {
      price: product.price,
      discount: product.discount || 0,
      priceUAE: product.priceUAE,
      discountUAE: product.discountUAE,
      priceNPR: product.priceNPR,
      discountNPR: product.discountNPR,
    };
    
    return getProductPriceByCurrency(productPriceData, currency);
  }, [product, currency]);
  
  const { price, discount } = priceData;
  
  return (
    <div className="flex items-center justify-between gap-5">
      <div className="flex items-center gap-2">
        <PriceFormatter
          amount={price}
          className={cn("text-shop_dark_green", className)}
          currency={currency}
        />
        {price && discount > 0 && (
          <PriceFormatter
            amount={price + (discount * price) / 100}
            className={twMerge(
              "line-through text-xs font-normal text-zinc-500 font-poppins",
              className
            )}
            currency={currency}
          />
        )}
      </div>
    </div>
  );
};

export default PriceView;