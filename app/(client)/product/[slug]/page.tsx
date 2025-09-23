import AddToCartButton from "@/components/AddToCartButton";
import Container from "@/components/Container";
import FavoriteButton from "@/components/FavoriteButton";
import ProductMediaGallery from "@/components/ProductMediaGallery";
import PriceView from "@/components/PriceView";
import ProductCharacteristics from "@/components/ProductCharacteristics";
import RelatedProducts from "@/components/RelatedProducts";
// import VideoView from "@/components/VideoView";
import { getProductBySlug, getRelatedProducts } from "@/sanity/queries";
import { StarIcon } from "lucide-react";
import { notFound } from "next/navigation";
import React from "react";

const SingleProductPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return notFound();
  }

  // Fetch related products based on the product's variant
  const relatedProducts = product?.variant 
    ? await getRelatedProducts(product.variant, slug, 5)
    : [];

  return (
    <>
      <Container className="flex flex-col md:flex-row gap-10 py-4 md:py-10 px-4 md:px-16">
        <ProductMediaGallery images={product?.images} videos={product?.videos} isStock={product?.stock} />
        <div className="w-full md:w-1/2 flex flex-row justify-center">
          <div className="w-full md:w-3/4">
            <div className="w-full flex-col gap-5">
              <div className="space-y-1">
                <h2 className="text-xl md:text-2xl font-bold font-poppins">{product?.name}</h2>
                <div className="flex items-center gap-1 text-sm">
                  {[...Array(5)].map((_, index) => (
                    <StarIcon
                      key={index}
                      size={16}
                      className="text-black"
                      fill={"#000000"}
                    />
                  ))}
                  <span className="text-gray-600 font-medium">(120 Reviews)</span>
                </div>
              </div>
              <div className="space-y-2  border-gray-200 py-5">
                <PriceView
                  product={product}
                  className="text-lg font-bold"
                />
                <p
                  className={`px-4 py-1.5 text-sm text-center inline-block font-semibold rounded-lg ${product?.stock === 0 ? "bg-red-100 text-red-600" : "text-green-600 bg-green-100"}`}
                >
                  {(product?.stock as number) > 0 ? "In Stock" : "Out of Stock"}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 lg:gap-3">
                <AddToCartButton product={product} />
                <FavoriteButton showProduct={true} product={product} />
              </div>
              <ProductCharacteristics product={product} />
              
              {/* New Shipping & Returns UI */}
              <div className="grid grid-cols-2 gap-4 py-6">
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="text-sm font-semibold text-gray-800 mb-1">
                    Express Shipping
                  </div>
                  <div className="text-xs text-green-600 font-medium">
                    Available
                  </div>
                </div>
                
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="text-sm font-semibold text-gray-800 mb-1">
                    Easy 45-Day
                  </div>
                  <div className="text-xs text-green-600 font-medium">
                    Returns
                  </div>
                </div>
                
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="text-sm font-semibold text-gray-800 mb-1">
                    TSA-
                  </div>
                  <div className="text-xs text-green-600 font-medium">
                    Approved
                  </div>
                </div>
                
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="text-sm font-semibold text-gray-800 mb-1">
                    Free
                  </div>
                  <div className="text-xs text-green-600 font-medium">
                    Shipping
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
      
      {/* Related Products Section */}
      <RelatedProducts products={relatedProducts as any} />
    </>
  );
};

export default SingleProductPage;
