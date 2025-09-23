import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const bannerData = [
  {
    image: "/hero2.png",
    title: "YOUR FALL EDIT",
    subtitle: "A curated capsule for the season of reset.",
    buttonText: "SHOP NOW",
    href: "/shop"
  }
];

const HomeBanner = () => {
  return (
    <div className="relative w-full overflow-hidden min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[700px]">
      {/* Hero Image */}
      <Image
        src={bannerData[0].image}
        alt="Hero Banner"
        fill
        priority
        className="object-cover object-center scale-110"
        sizes="100vw"
      />
      
      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-end pb-8 pl-6 pr-6">
        <div className="text-white">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
            {bannerData[0].title}
          </h1>
          <p className="text-sm sm:text-base md:text-lg mb-4 max-w-md">
            {bannerData[0].subtitle}
          </p>
          <Link
            href={bannerData[0].href}
            className="inline-block px-6 py-3 bg-white text-black font-semibold text-sm sm:text-base hover:bg-gray-100 transition-colors cursor-pointer"
          >
            {bannerData[0].buttonText}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;
