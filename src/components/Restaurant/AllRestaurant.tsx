"use client";

import React, { useEffect, useState } from "react";
import RestaurantCategory from "@/components/Restaurant/RestaurantCategory";
import useRestaurantStore from "@/store/restaurantStore";

const AllRestaurants: React.FC = () => {
    const { categoryRestaurants, fetchRestaurantsByCategory } =
        useRestaurantStore();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            await fetchRestaurantsByCategory();
            setIsLoading(false);
        };
        fetchData();
    }, [fetchRestaurantsByCategory]);

    return (
        <>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 pb-3 tracking-wide">
                🍽️ 全部餐廳
            </h2>
            {isLoading ? (
                <p className="text-gray-500 mt-2">載入全部餐廳資料中...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Object.entries(categoryRestaurants).map(
                        ([category, restaurants]) => (
                            <RestaurantCategory
                                key={category}
                                restaurants={restaurants}
                                restaurantCategory={category}
                            />
                        )
                    )}
                </div>
            )}
        </>
    );
};

export default AllRestaurants;
