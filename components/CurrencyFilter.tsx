"use client";

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useCurrency, CURRENCY_CONFIG, Currency } from '@/contexts/CurrencyContext';
import Image from 'next/image';

const CurrencyFilter: React.FC = () => {
  const { currency, setCurrency, currencyConfig } = useCurrency();

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 hover:text-shop_light_green hoverEffect"
        >
          <Image
            src={currencyConfig.flag}
            alt={`${currencyConfig.name} flag`}
            width={20}
            height={15}
            className="rounded-sm"
            style={{ width: "auto", height: "auto" }}
          />
          <ChevronDown size={14} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {Object.values(CURRENCY_CONFIG).map((config) => (
          <DropdownMenuItem
            key={config.code}
            onClick={() => handleCurrencyChange(config.code)}
            className={`flex items-center gap-3 cursor-pointer ${
              currency === config.code ? 'bg-gray-100' : ''
            }`}
          >
            <Image
              src={config.flag}
              alt={`${config.name} flag`}
              width={20}
              height={15}
              className="rounded-sm"
            />
            <div className="flex flex-col">
              <span className="font-medium">{config.name}</span>
              <span className="text-xs text-gray-500">{config.code}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CurrencyFilter;