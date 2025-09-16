import { Currency } from '@/contexts/CurrencyContext';

export interface ProductPrice {
  price: number;
  discount: number;
  priceUAE?: number;
  discountUAE?: number;
  priceNPR?: number;
  discountNPR?: number;
}

export const getProductPriceByCurrency = (product: ProductPrice, currency: Currency) => {
  // Temporary: If currency-specific prices are not available, create them for testing
  const basePrice = product.price || 0;
  const baseDiscount = product.discount || 0;

  switch (currency) {
    case 'NPR':
      return {
        price: product.priceNPR || Math.round(basePrice * 1.6), // NPR is roughly 1.6x INR
        discount: product.discountNPR || baseDiscount,
      };
    case 'UAE':
      return {
        price: product.priceUAE || Math.round(basePrice * 0.045), // UAE Dirham is roughly 0.045x INR
        discount: product.discountUAE || baseDiscount,
      };
    case 'INR':
    default:
      return {
        price: basePrice,
        discount: baseDiscount,
      };
  }
};

export const formatPriceByCurrency = (amount: number, currency: Currency) => {
  const locales = {
    INR: 'en-IN',
    NPR: 'en-NP', 
    UAE: 'en-AE'
  };

  return Number(amount).toLocaleString(locales[currency], {
    currency: currency,
    style: 'currency',
    minimumFractionDigits: 2,
  });
};
