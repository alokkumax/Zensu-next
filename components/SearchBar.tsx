'use client';

import { Search } from 'lucide-react';
import React, { useState } from 'react';
import SearchOverlay from './SearchOverlay';

const SearchBar: React.FC = () => {
  const [showOverlay, setShowOverlay] = useState(false);

  const handleSearchClick = () => {
    setShowOverlay(true);
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };

  return (
    <>
      <button
        onClick={handleSearchClick}
        className="hoverEffect text-shop-dark-grey transition-colors duration-200"
      >
        <Search className="w-5 h-5" />
      </button>
      
      <SearchOverlay 
        isOpen={showOverlay} 
        onClose={handleCloseOverlay} 
      />
    </>
  );
}

export default SearchBar;
