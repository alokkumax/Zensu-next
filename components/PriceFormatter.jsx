"use client";

import { twMerge } from "tailwind-merge";
import PropTypes from "prop-types";
import { useCurrency } from "@/contexts/CurrencyContext";

const PriceFormatter = ({ amount, className, currency: propCurrency }) => {
  const { currencyConfig } = useCurrency();
  
  // Use prop currency if provided, otherwise use context currency
  const currency = propCurrency || currencyConfig.code;
  const config = currency === 'INR' ? currencyConfig : 
                currency === 'NPR' ? { ...currencyConfig, locale: 'en-NP' } :
                currency === 'UAE' ? { ...currencyConfig, locale: 'en-AE' } : currencyConfig;

  const formattedPrice = Number(amount).toLocaleString(config.locale, {
    currency: currency,
    style: "currency",
    minimumFractionDigits: 2,
  });
  
  return (
    <span
      className={twMerge("text-sm font-semibold text-darkColor font-poppins", className)}
    >
      {formattedPrice}
    </span>
  );
};

PriceFormatter.propTypes = {
  amount: PropTypes.number,
  className: PropTypes.string,
  currency: PropTypes.string,
};

export default PriceFormatter;