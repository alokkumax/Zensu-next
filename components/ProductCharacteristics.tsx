import { Product } from "@/sanity.types";
import { getBrand } from "@/sanity/queries";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const ProductCharacteristics = async ({
  product,
}: {
  product: Product | null | undefined;
}) => {
  const brand = await getBrand(product?.slug?.current as string);

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1" className="border-b border-gray-200">
        <AccordionTrigger className="text-left font-semibold text-gray-800 hover:no-underline py-4">
          {product?.name}: Characteristics
        </AccordionTrigger>
        <AccordionContent className="pb-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Collection:</span>
              <span className="text-sm font-semibold text-gray-800">2025</span>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Type:</span>
              <span className="text-sm font-semibold text-gray-800">
                {product?.variant}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Stock:</span>
              <span className="text-sm font-semibold text-gray-800">
                {product?.stock ? "Available" : "Out of Stock"}
              </span>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="item-2" className="border-b border-gray-200">
        <AccordionTrigger className="text-left font-semibold text-gray-800 hover:no-underline py-4">
          Detailed Description
        </AccordionTrigger>
        <AccordionContent className="pb-4">
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed text-sm">
              {product?.description || "No detailed description available."}
            </p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ProductCharacteristics;