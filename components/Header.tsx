import React from "react";
import Container from "./Container";
import Logo from "./Logo";
import HeaderMenu from "./HeaderMenu";
import SearchBar from "./SearchBar";
import CartIcon from "./CartIcon";
import FavoriteButton from "./FavoriteButton";
import MobileMenu from "./MobileMenu";
import Link from "next/link";
import { Logs } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { getMyOrders } from "@/sanity/queries";
import HeaderAuth from "./HeaderAuth";

const Header = async () => {
  const { userId } = await auth();
  let orders: any[] = [];

  if (userId) {
    orders = (await getMyOrders(userId)) ?? [];
  }

  return (
    <header className="px-8 sticky top-0 z-50 py-5 bg-white/70 backdrop-blur-md">
      <Container className="flex items-center justify-between text-lightColor">
        {/* Left Side */}
        <div className="w-auto flex items-center justify-start gap-3 md:gap-0">
          <MobileMenu />
          <HeaderMenu />
        </div>

        {/* Center Logo */}
        <div className="absolute right-1/2 md:right-1/2 transform md:translate-x-1/2 flex items-center justify-center">
          <Logo />
        </div>

        {/* Right Side */}
        <div className="w-auto md:1/3 flex items-center justify-end gap-5">
          <FavoriteButton />
          <CartIcon />
          <SearchBar />

          {/* ✅ Orders badge only if logged in */}
          {userId && (
            <Link
              href="/orders"
              className="group relative hover:text-shop_light_green hoverEffect"
            >
              <Logs />
              <span className="absolute -top-1 -right-1 bg-black text-black h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
                {orders.length}
              </span>
            </Link>
          )}

          {/* ✅ Clerk UI moved into client component */}
          <HeaderAuth />
        </div>
      </Container>
    </header>
  );
};

export default Header;
