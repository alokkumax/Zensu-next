'use client';
import React, { useState } from 'react';
import HomeTabBar from './HomeTabBar';

const ProductGrid = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedTab, setSelectedTab] = useState("");
    return (
        <div >
            <HomeTabBar selectedTab={selectedTab} onTabSelect={setSelectedTab} />
        </div>
    );
}

export default ProductGrid;
