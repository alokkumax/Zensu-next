"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Currency = 'INR' | 'NPR' | 'UAE';

interface CurrencyConfig {
  code: Currency;
  symbol: string;
  flag: string;
  name: string;
  locale: string;
}

export const CURRENCY_CONFIG: Record<Currency, CurrencyConfig> = {
  INR: {
    code: 'INR',
    symbol: '₹',
    flag: '/flags/Flag_of_India.png',
    name: 'Indian Rupee',
    locale: 'en-IN'
  },
  NPR: {
    code: 'NPR',
    symbol: '₨',
    flag: '/flags/Flag_of_Nepal.svg.png',
    name: 'Nepalese Rupee',
    locale: 'en-NP'
  },
  UAE: {
    code: 'UAE',
    symbol: 'د.إ',
    flag: '/flags/Flag_of_the_United_Arab_Emirates.svg.png',
    name: 'UAE Dirham',
    locale: 'en-AE'
  }
};

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  currencyConfig: CurrencyConfig;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>('INR');
  const [isHydrated, setIsHydrated] = useState(false);

  // Load currency from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem('selectedCurrency') as Currency;
    if (savedCurrency && CURRENCY_CONFIG[savedCurrency]) {
      setCurrency(savedCurrency);
    }
    setIsHydrated(true);
  }, []);

  // Save currency to localStorage when changed
  const handleSetCurrency = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    if (isHydrated) {
      localStorage.setItem('selectedCurrency', newCurrency);
    }
  };

  const currencyConfig = CURRENCY_CONFIG[currency];

  return (
    <CurrencyContext.Provider value={{ 
      currency, 
      setCurrency: handleSetCurrency, 
      currencyConfig 
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
