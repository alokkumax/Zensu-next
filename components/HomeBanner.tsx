"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Container from './Container';

const bannerData = [
  {
    image: "/hero2.jpg",
    category: "Suitcases",
    title: "LV Dimension Monogram",
    href: "/suitcases"
  },
  {
    image: "/hero.jpg",
    category: "Handbags",
    title: "LV Dimension Monogram",
    href: "/handbags"
  },
//   {    image: "/hero3.jpg",
//     category: "Accessories",
//     title: "LV Dimension Monogram",
//     href: "/accessories"
//   }
];

const HomeBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerData.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[400px] md:h-[700px]">
      {/* Hero Images */}
      {bannerData.map((banner, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000
            ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
        >
          <Image
            src={banner.image}
            alt={`Banner ${index + 1}`}
            fill
            className="object-cover w-full"
            priority={index === 0}
          />
        </div>
      ))}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

      {/* Content */}
      <div className="relative h-full flex items-end pb-10">
        <Container>
          <div className="flex flex-col items-center text-white text-center">
            <span className="text-lg md:text-xs italic uppercase tracking-widest mb-4 font-light">
              {bannerData[currentSlide].category}
            </span>
            <h2 className="text-3xl md:text-2xl font-bold font-poppins mb-4">
              {bannerData[currentSlide].title}
            </h2>
          </div>
        </Container>
      </div>

      {/* Slide Indicators */}
      {/* <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {bannerData.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors duration-300
              ${index === currentSlide ? 'bg-white' : 'bg-white/50'}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div> */}
    </div>
  );
};

export default HomeBanner;
