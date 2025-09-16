import { Category } from "@/sanity.types";
import React from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

interface Props {
  categories: Category[];
  selectedCategory?: string | null;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | null>>;
}

const CategoryList = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}: Props) => {
  return (
    <div className="w-full bg-white py-5">
      <h3 className=" text-[12px] uppercase text-black/60 font-semibold mb-4">Categories</h3>
      <RadioGroup value={selectedCategory || ""} className="mt-2 space-y-1">
        {categories?.map((category) => (
          <div
            onClick={() => {
              setSelectedCategory(category?.slug?.current as string);
            }}
            key={category?._id}
            className="flex items-center space-x-2 hover:cursor-pointer"
          >
            <RadioGroupItem
              value={category?.slug?.current as string}
              id={category?.slug?.current}
              className="rounded-sm"
            />
            <Label
              htmlFor={category?.slug?.current}
              className={`${selectedCategory === category?.slug?.current ? "font-semibold text-shop_dark_green" : "font-normal"}`}
            >
              {category?.title}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {selectedCategory && (
        <button
          onClick={() => setSelectedCategory(null)}
          className="text-sm font-medium mt-2 underline underline-offset-2 decoration-[1px] hover:text-shop_dark_green hoverEffect text-left"
        >
          Reset selection
        </button>
      )}
    </div>
  );
};

export default CategoryList;