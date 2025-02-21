import { create } from "zustand";
import { devtools } from "zustand/middleware";
import qs from "qs";
import { fetchAPI } from "../lib/api";
import { Category } from "@/types/category";
import { Restaurant } from "@/types/restaurant";

interface RestaurantStore {
    editModal: {
        show: boolean;
        title: string;
        restaurant: Restaurant;
    };
    categoryRestaurants: Record<string, Restaurant[]>;
    allCategories: Category[];
    fetchRestaurantDetails: (
        restaurantId: string
    ) => Promise<Restaurant | null>;
    fetchCategories: () => Promise<Category[]>;
    fetchRestaurantsByCategory: () => Promise<void>;
    deleteRestaurant: (
        restaurantId: string,
        categoryName: string
    ) => Promise<boolean>;
    addRestaurant: (restaurantData: {
        Name: string;
        Description: string;
        categories: number[];
    }) => Promise<boolean>;
    updateRestaurant: (
        restaurantId: string,
        updatedData: {
            Name?: string;
            Description?: string;
            categories?: number[];
        }
    ) => Promise<boolean>;
}

const useRestaurantStore = create<RestaurantStore>()(
    devtools(
        (set, get) => ({
            editModal: {
                show: false,
                title: "",
                restaurant: {
                    id: null,
                    Name: "",
                    Description: [],
                    categories: [],
                    documentId: "",
                },
            },
            categoryRestaurants: {},
            allCategories: [],

            fetchRestaurantDetails: async (restaurantId: string) => {
                try {
                    const data = await fetchAPI(
                        `/restaurants/${restaurantId}?populate=categories`
                    );
                    return data.data;
                } catch (error) {
                    console.error("取得餐廳詳細資料失敗:", error);
                    return null;
                }
            },

            fetchCategories: async () => {
                try {
                    const data = await fetchAPI("/categories");
                    set({ allCategories: data.data });
                    return data.data;
                } catch (error) {
                    console.error("取得分類失敗:", error);
                    return [];
                }
            },

            fetchRestaurantsByCategory: async () => {
                try {
                    const categories = await get().fetchCategories();
                    const restaurantData: Record<string, Restaurant[]> = {};

                    await Promise.all(
                        categories.map(async (category) => {
                            const query = qs.stringify(
                                {
                                    filters: {
                                        categories: {
                                            Name: { $eq: category.Name },
                                        },
                                    },
                                    populate: {
                                        categories: { sort: ["Name:asc"] },
                                    },
                                },
                                { encodeValuesOnly: true }
                            );

                            const response = await fetchAPI(
                                `/restaurants?${query}`
                            );
                            restaurantData[category.Name] = response.data;
                        })
                    );

                    set(
                        { categoryRestaurants: restaurantData },
                        false,
                        "fetchRestaurantsByCategory"
                    );
                } catch (error) {
                    console.error("取得餐廳資料失敗:", error);
                }
            },

            deleteRestaurant: async (
                restaurantId: string,
                categoryName: string
            ): Promise<boolean> => {
                try {
                    const { data } = await fetchAPI(
                        `/restaurants/${restaurantId}?populate=categories`
                    );
                    const restaurant = data.data;
                    const cateId = restaurant.categories.find(
                        (cate: Category) => cate.Name === categoryName
                    )?.id;

                    if (!cateId) {
                        console.warn("未找到對應分類，無法刪除");
                        return false;
                    }

                    if (restaurant.categories.length > 1) {
                        await fetchAPI(`/restaurants/${restaurantId}`, {
                            method: "PUT",
                            body: JSON.stringify({
                                data: {
                                    categories: {
                                        disconnect: [{ id: cateId }],
                                    },
                                },
                            }),
                        });
                    } else {
                        await fetchAPI(`/restaurants/${restaurantId}`, {
                            method: "DELETE",
                        });
                    }

                    await get().fetchRestaurantsByCategory();
                    return true;
                } catch (error) {
                    console.error("刪除餐廳失敗:", error);
                    return false;
                }
            },

            addRestaurant: async (restaurantData: {
                Name: string;
                Description: string;
                categories: number[];
            }): Promise<boolean> => {
                try {
                    const res = await fetchAPI("/restaurants", {
                        method: "POST",
                        body: JSON.stringify({
                            data: {
                                Name: restaurantData.Name,
                                Description: [
                                    {
                                        type: "paragraph",
                                        children: [
                                            {
                                                type: "text",
                                                text: restaurantData.Description,
                                            },
                                        ],
                                    },
                                ],
                                categories: {
                                    connect: restaurantData.categories,
                                },
                            },
                        }),
                    });
                    if (res.status === 200 || res.status === 201) {
                        console.log("餐廳新增成功:", res.data);
                        await get().fetchRestaurantsByCategory();
                        return true;
                    } else {
                        console.error("餐廳新增失敗:", res);
                        return false;
                    }
                } catch (error) {
                    console.error("餐廳新增失敗:", error);
                    return false;
                }
            },

            updateRestaurant: async (
                restaurantId: string,
                updatedData: {
                    Name?: string;
                    Description?: string;
                    categories?: number[];
                }
            ): Promise<boolean> => {
                try {
                    const response = await fetchAPI(
                        `/restaurants/${restaurantId}`,
                        {
                            method: "PUT",
                            body: JSON.stringify({
                                data: {
                                    Name: updatedData.Name,
                                    Description: updatedData.Description
                                        ? [
                                              {
                                                  type: "paragraph",
                                                  children: [
                                                      {
                                                          type: "text",
                                                          text: updatedData.Description,
                                                      },
                                                  ],
                                              },
                                          ]
                                        : undefined,
                                    categories: {
                                        set: updatedData.categories,
                                    },
                                },
                            }),
                        }
                    );
                    if (response.status === 200 || response.status === 201) {
                        console.log("餐廳更新成功:", response.data);
                        await get().fetchRestaurantsByCategory();
                        return true;
                    } else {
                        console.error("餐廳更新失敗:", response);
                        return false;
                    }
                } catch (error) {
                    console.error("餐廳更新失敗:", error);
                    return false;
                }
            },
        }),
        { name: "RestaurantStore" }
    ) // 給 Redux DevTools 命名
);

export default useRestaurantStore;
