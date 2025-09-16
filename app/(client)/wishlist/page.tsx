"use client";

import NoAccess from "@/components/NoAccess";
import WishListProducts from "@/components/WishListProducts";
import { useUser } from "@clerk/nextjs";

const WishListPage = () => {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return <p>Loading...</p>;

  if (!isSignedIn) {
    return (
      <NoAccess details="Log in to view your wishlist items. Don’t miss out on your cart products to make the payment!" />
    );
  }

  return <WishListProducts  />;
};

export default WishListPage;
