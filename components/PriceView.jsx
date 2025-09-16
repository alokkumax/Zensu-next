"use client";

import { twMerge } from "tailwind-merge";
import { cn } from "@/lib/utils";
import PriceFormatter from "./PriceFormatter";
import { useCurrency } from "@/contexts/CurrencyContext";
import { getProductPriceByCurrency } from "@/lib/currencyUtils";

/**
 * @param {Object} props
 * @param {Object} props.product - Product object with price fields
 * @param {string=} props.className
 */
const PriceView = ({ product, className }) => {
  const { currency } = useCurrency();
  
  // Get the correct price and discount based on selected currency
  const { price, discount } = getProductPriceByCurrency(product, currency);
  
  return (
    <div className="flex items-center justify-between gap-5" key={`price-${currency}-${product?._id}`}>
      <div className="flex items-center gap-2">
        <PriceFormatter
          amount={price}
          className={cn("text-shop_dark_green", className)}
        />
        {price && discount && (
          <PriceFormatter
            amount={price + (discount * price) / 100}
            className={twMerge(
              "line-through text-xs font-normal text-zinc-500 font-poppins",
              className
            )}
          />
        )}
      </div>
    </div>
  );
};

export default PriceView;