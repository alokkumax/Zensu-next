"use client";

import { ClerkLoaded, SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Logs } from "lucide-react";
import Signin from "./Signin";
import { useEffect, useState } from "react";

const HeaderAuth = () => {
  const { user } = useUser();
  const [ordersCount, setOrdersCount] = useState<number>(0);

  useEffect(() => {
    if (user) {
      // Fetch orders from API
      fetch("/api/orders")
        .then(res => res.json())
        .then(data => setOrdersCount(data.length))
        .catch(() => setOrdersCount(0));
    }
  }, [user]);

  return (
    <ClerkLoaded>
      <SignedIn>
        {/* Orders tab */}
        <Link
          href="/orders"
          className="group relative hover:text-shop_light_green hoverEffect"
        >
          <Logs />
          {/* <span className="absolute -top-1 -right-1 bg-black text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
            {ordersCount}
          </span> */}
        </Link>

        {/* User profile */}
        <UserButton afterSignOutUrl="/" />
      </SignedIn>

      <SignedOut>
        <Signin />
      </SignedOut>
    </ClerkLoaded>
  );
};

export default HeaderAuth;
