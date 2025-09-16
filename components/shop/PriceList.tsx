import React from "react";
import Title from "../Title";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { useCurrency } from "@/contexts/CurrencyContext";
import { formatPriceByCurrency } from "@/lib/currencyUtils";

// Base price ranges in INR (reference currency)
const basePriceRanges = [
  { min: 0, max: 1000 },
  { min: 1000, max: 2000 },
  { min: 2000, max: 3000 },
  { min: 3000, max: 5000 },
  { min: 5000, max: 100000 },
];

// Currency conversion rates (approximate)
const currencyRates = {
  INR: 1,
  NPR: 1.6,
  UAE: 0.045,
};

interface Props {
  selectedPrice?: string | null;
  setSelectedPrice: React.Dispatch<React.SetStateAction<string | null>>;
}

const PriceList = ({ selectedPrice, setSelectedPrice }: Props) => {
  const { currency } = useCurrency();

  // Generate dynamic price ranges based on selected currency
  const getPriceRanges = () => {
    const rate = currencyRates[currency];
    
    return basePriceRanges.map((range, index) => {
      const convertedMin = Math.round(range.min * rate);
      const convertedMax = Math.round(range.max * rate);
      
      let title: string;
      if (index === 0) {
        title = `Under ${formatPriceByCurrency(convertedMax, currency)}`;
      } else if (index === basePriceRanges.length - 1) {
        title = `Over ${formatPriceByCurrency(convertedMin, currency)}`;
      } else {
        title = `${formatPriceByCurrency(convertedMin, currency)} - ${formatPriceByCurrency(convertedMax, currency)}`;
      }
      
      return {
        title,
        value: `${convertedMin}-${convertedMax}`,
      };
    });
  };

  const priceArray = getPriceRanges();

  return (
    <div className="w-full bg-white py-5 border-t">
      <h3 className=" text-[12px] uppercase text-black/60 font-semibold mb-4">Price</h3>
      <RadioGroup className="mt-2 space-y-1" value={selectedPrice || ""}>
        {priceArray?.map((price, index) => (
          <div
            key={index}
            onClick={() => setSelectedPrice(price?.value)}
            className="flex items-center space-x-2 hover:cursor-pointer"
          >
            <RadioGroupItem
              value={price?.value}
              id={price?.value}
              className="rounded-sm"
            />
            <Label
              htmlFor={price.value}
              className={`${selectedPrice === price?.value ? "font-semibold text-shop_dark_green" : "font-normal"}`}
            >
              {price?.title}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {selectedPrice && (
        <button
          onClick={() => setSelectedPrice(null)}
          className="text-sm font-medium mt-2 underline underline-offset-2 decoration-[1px] hover:text-shop_dark_green hoverEffect"
        >
          Reset selection
        </button>
      )}
    </div>
  );
};

export default PriceList;