"use client";

import { ClerkLoading, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Signin from "./Signin";

const HeaderAuth = () => {
  return (
    <>
      <ClerkLoading>
        <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
      </ClerkLoading>

      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>

      <SignedOut>
        <Signin />
      </SignedOut>
    </>
  );
};

export default HeaderAuth;
