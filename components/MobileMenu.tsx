
"use client";
import { AlignLeft } from 'lucide-react';
import React, { useState } from 'react';
import SideMenu from './SideMenu';

const MobileMenu = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <>
     <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
        className='md:hidden hover:cursor-pointer'
     >
        <AlignLeft  className='md:hidden hover:cursor-pointer'/>
     </button>
     <div className="md:hidden">
       <SideMenu 
       isOpen={isSidebarOpen} 
       onClose={() => setIsSidebarOpen(false)}
       />
     </div>
    </>
  );
}

export default MobileMenu;
