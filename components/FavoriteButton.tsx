"use client";
import { Heart } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const FavoriteButton = () => {
  return (
    <Link href={"/cart"} className="group relative">
      <Heart className="w-5 h-5
       hover:pointer hoverEffect" />
      <span 
        className="
        absolute -top-1 -right-1 
        bg-black/80
        text-white h-3.5 w-3.5
        rounded-full text-xs font-semibold 
        flex items-center justify-center">
          0
        </span>
    </Link>
  );
};

export default FavoriteButton;
