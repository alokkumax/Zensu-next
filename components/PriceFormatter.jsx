import { twMerge } from "tailwind-merge";

import PropTypes from "prop-types";

const PriceFormatter = ({ amount, className }) => {
  const formattedPrice = Number(amount).toLocaleString("en-IN", {
    currency: "INR",
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
};

export default PriceFormatter;