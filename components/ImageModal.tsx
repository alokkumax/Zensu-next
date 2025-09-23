"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: any;
  alt: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, image, alt }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !image) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative max-w-4xl max-h-[90vh] w-full mx-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors duration-200 shadow-lg"
          aria-label="Close modal"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>
        
        <div className="relative w-full h-full">
          <Image
            src={urlFor(image).width(1200).height(1200).quality(90).url()}
            alt={alt}
            width={1200}
            height={1200}
            className="w-full h-full object-contain rounded-lg"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
