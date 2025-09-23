"use client";
import { productTypeZ } from "@/constants/data";
import Link from "next/link";
interface Props {
  selectedTab: string;
  onTabSelect: (tab: string) => void;
}

const HomeTabBar = ({ selectedTab, onTabSelect }: Props) => {

  return (
    <div className="flex items-center flex-wrap gap-3 md:gap-5 justify-between">
      <div className="flex items-center gap-1.5 text-sm font-semibold">
        <div className="flex items-center gap-1 md:gap-3">
          {productTypeZ?.map((item) => (
            <button
              onClick={() => onTabSelect(item?.title)}
              key={item?.title}
              className={`border hover:cursor-pointer border-shop-dark-grey/30 px-2 py-1 md:px-6 md:py-2 rounded-full hover:border-shop_light_green hoverEffect text-xs md:text-sm ${
                selectedTab === item?.title 
                ? "bg-gray-200 border-gray-300" 
                : "bg-shop_light_green/10"
              }`}
            >
              {item?.title}
            </button>
          ))}
        </div>
      </div>
      <Link
        href={"/shop"}
        className="border border-darkColor px-3 py-1 md:px-4 rounded-full hover:bg-shop_light_green hover:border-shop_light_green hoverEffect text-xs md:text-sm"
      >
        See all
      </Link>
    </div>
  );
};

export default HomeTabBar;
