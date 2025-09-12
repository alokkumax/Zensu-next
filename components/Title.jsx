import React from "react";
import { twMerge } from "tailwind-merge";
import PropTypes from "prop-types";

const Title = ({ children, className }) => {
  return (
    <h2 className={twMerge("text-2xl font-semibold font-poppins", className)}>{children}</h2>
  );
};

Title.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Title;