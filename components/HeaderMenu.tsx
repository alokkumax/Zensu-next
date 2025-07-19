"use client";
import { headerData } from "@/constants/data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const HeaderMenu = () => {
  const pathname = usePathname();

  return (
    <div className="hidden md:inline-flex w-1/3 items-center gap-7 text-sm capitalize font-poppins font-light text-shop-dark-grey">
      {headerData?.map((item) => (
        <Link
          key={item?.title}
          href={item?.href}
          className={`hover:pointer relative group
          ${pathname === item?.href && "text-black font-medium"}
          `}
        >
          {item?.title}
        </Link>
      ))}
    </div>
  );
};

export default HeaderMenu;
