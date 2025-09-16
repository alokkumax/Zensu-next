"use client";
import React, { FC } from "react";
import Logo from "./Logo";
import { X, ShoppingBag, Heart, Logs } from "lucide-react";
import { headerData } from "@/constants/data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SocialMedia from "./SocialMedia";
import useOutsideClick from "@/hooks";
import CurrencyFilter from "./CurrencyFilter";
import useStore from "@/store";
import { useUser } from "@clerk/nextjs";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideMenu: FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const sidebarRef = useOutsideClick<HTMLDivElement>(onClose);
  const { items, favoriteProduct } = useStore();
  const { user } = useUser();

  return (
    <div
      className={`fixed inset-y-0 h-screen left-0 z-50 w-full bg-black/50 text-white/70 shadow-xl ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } hoverEffect`}
    >
      <div
        ref={sidebarRef}
        className="min-w-72 max-w-96 bg-white h-screen p-10 border-r border-r-shop-light-grey flex flex-col gap-6 overflow-y-auto"
      >
        <div className="flex items-center justify-between gap-5">
          <Logo />
          <button
            onClick={onClose}
            className="hover:cursor-pointer text-black hoverEffect"
          >
            <X />
          </button>
        </div>

        {/* Currency Filter */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Currency</h3>
          <CurrencyFilter />
        </div>

        {/* Quick Actions */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h3>
          <div className="flex flex-col space-y-3">
            <Link
              href="/cart"
              className="flex items-center gap-3 hover:text-shop_light_green hoverEffect text-black/60 font-medium"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-black text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
                  {items?.length ? items?.length : 0}
                </span>
              </div>
              Cart ({items?.length ? items?.length : 0})
            </Link>
            
            <Link
              href="/wishlist"
              className="flex items-center gap-3 hover:text-shop_light_green hoverEffect text-black/60 font-medium"
            >
              <div className="relative">
                <Heart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-black text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
                  {favoriteProduct?.length ? favoriteProduct?.length : 0}
                </span>
              </div>
              Wishlist ({favoriteProduct?.length ? favoriteProduct?.length : 0})
            </Link>

            {user && (
              <Link
                href="/orders"
                className="flex items-center gap-3 hover:text-shop_light_green hoverEffect text-black/60 font-medium"
              >
                <Logs className="w-5 h-5" />
                Orders
              </Link>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex flex-col space-y-3.5 font-semibold tracking-wide">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Navigation</h3>
          {headerData?.map((item) => (
            <Link
              href={item?.href}
              key={item?.title}
              className={`hoverEffect text-black/60 font-medium ${
                pathname === item?.href && "text-black/100"
              }`}
            >
              {item?.title}
            </Link>
          ))}
        </div>
        
        <SocialMedia />
      </div>
    </div>
  );
};

export default SideMenu;
