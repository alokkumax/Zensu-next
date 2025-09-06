import { cn } from '@/lib/utils';
import { Product } from '@/sanity.types';
import { Heart } from 'lucide-react';
import React from 'react';

const AddToWishList = ({
  product,
  className,
}:{
  product: Product;
  className?: string;
}) => {
  return (
    <div className={cn("absolute top-2 right-2 z-10", className)}>
      <button className='p-2.5 rounded-full hover:text-white hoverEffect bg-white hover:cursor-pointer'>
        <Heart size ={19} className="text-blue hover:fill-red-500 hover:border-red-500" />
      </button>
    </div>
  );
}

export default AddToWishList;
