"use client";

import { useState } from "react";
import { Restaurant as RestaurantType } from "@/types/restaurant";
import useRestaurantStore from "@/store/restaurantStore";

type RestaurantProps = {
    restaurant: RestaurantType;
    restaurantCategory: string;
};

const RestaurantItem: React.FC<RestaurantProps> = ({
    restaurant,
    restaurantCategory,
}) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const { deleteRestaurant, fetchRestaurantDetails } = useRestaurantStore();
    const { editModal } = useRestaurantStore();

    const openEditModal = async () => {
        const restaurantDetails = await fetchRestaurantDetails(
            restaurant.documentId
        );
        if (restaurantDetails) {
            editModal.show = true;
            editModal.restaurant = restaurantDetails;
        }
    };

    const handleDelete = async () => {
        if (restaurant.categories.length > 0) {
            setIsDeleting(true);
            const success = await deleteRestaurant(
                restaurant.documentId,
                restaurantCategory
            );
            if (success) {
                setIsDeleting(false);
            }
        }
    };

    return (
        <li className="restaurant-category p-4 rounded-lg shadow-sm bg-white w-full">
            <h3 className="text-lg font-semibold text-gray-900">
                {restaurant.Name}
            </h3>
            <h4 className="text-sm text-gray-600 mt-2">敘述:</h4>
            {restaurant.Description.map((block, index) => (
                <div key={index} className="text-gray-700 text-sm mt-1">
                    {block.type === "paragraph" &&
                        block.children.map((child, childIndex) => (
                            <span key={childIndex}>{child.text}</span>
                        ))}
                </div>
            ))}
            {/* 刪除按鈕 */}
            <div className="flex space-x-2 mt-4">
                <button
                    onClick={handleDelete}
                    className="py-1 px-3 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 shadow-md cursor-pointer"
                >
                    {isDeleting ? "刪除中..." : "刪除關聯"}
                </button>
                <button
                    onClick={openEditModal}
                    className="py-1 px-3 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 shadow-md cursor-pointer"
                >
                    編輯
                </button>
            </div>
        </li>
    );
};

export default RestaurantItem;
