"use client";

import React, { useEffect, useState } from "react";
import RestaurantItem from "@/components/Restaurant/RestaurantItem";
import { Restaurant } from "@/types/restaurant";

type RestaurantCategoryProps = {
    restaurantCategory: string;
    restaurants: Restaurant[];
};

const RestaurantCategory: React.FC<RestaurantCategoryProps> = ({
    restaurantCategory,
    restaurants,
}) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            await new Promise((resolve) => setTimeout(resolve, 500)); // 模擬 API 加載
            setIsLoading(false);
        };
        fetchData();
    }, []);

    return (
        <div className="restaurant-category p-10 w-full rounded-lg shadow-xl bg-white">
            <h3 className="text-lg font-semibold text-gray-900">
                有 <span className="text-sky-500">{restaurantCategory}</span>{" "}
                的餐廳
            </h3>

            {isLoading && <p className="text-gray-600 mt-2">載入中...</p>}

            {!isLoading && restaurants.length > 0 && (
                <ul className="mt-6 space-y-4">
                    {restaurants.map((restaurant) => (
                        <RestaurantItem
                            key={restaurant.id}
                            restaurant={restaurant}
                            restaurantCategory={restaurantCategory}
                        />
                    ))}
                </ul>
            )}

            {!isLoading && restaurants.length === 0 && (
                <p className="text-gray-500 mt-2">沒有餐廳資料</p>
            )}
        </div>
    );
};

export default RestaurantCategory;
