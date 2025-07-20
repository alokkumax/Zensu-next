import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from './ui/button';

const products = [
  {
    title: 'ZENSU Monogram Suitcase',
    price: '₹9,000.00',
    images: ['/pic3.png', '/pic33.png'],
  },
  {
    title: 'ZENSU Classic Suitcase',
    price: '₹10,500.00',
    images: ['/pic2.png', '/pic22.png'],
  },
  {
    title: 'ZENSU Dimension Suitcase',
    price: '₹17,000.00',
    images: ['/pic3.png', '/pic33.png'],
  },
  {
    title: 'ZENSU Signature Suitcase',
    price: '₹8,000.00',
    images: ['/pic2.png', '/pic22.png'],
  },
];

export default function Collection() {
  return (
    <section className="py-16 px-4 md:px-12 lg:px-24">
      <div className="text-center mb-12">
        <p className="uppercase text-sm text-gray-500 tracking-wide">Suitcases</p>
        <h2 className="text-3xl md:text-3xl font-semibold font-poppins">Our Picks for Your Next Journey</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product, index) => (
          <div key={index} className="flex flex-col items-start group">
            <div className="relative w-full h-96 flex items-center justify-center bg-gradient-to-b from-gray-200 to-gray-50 overflow-hidden">
              <div className="relative w-full h-full">
                {product.images.map((img, imgIndex) => (
                  <img
                    key={imgIndex}
                    src={img}
                    alt={`${product.title} ${imgIndex + 1}`}
                    className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ease-in-out
                      ${imgIndex === 0 ? 'opacity-100 group-hover:opacity-0' : 'opacity-0 group-hover:opacity-100'}`}
                  />
                ))}
              </div>
              <Heart className="absolute top-4 right-4 w-5 h-5 text-gray-500 hover:text-black cursor-pointer z-10" />
            </div>
            <div className="mt-4 w-full">
              <p className="text-sm font-medium text-gray-900 mb-1">{product.title}</p>
              <p className="text-sm text-gray-600">{product.price}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <Button className="">
          Discover the Collection
        </Button>
      </div>
    </section>
  );
}
