"use client";

import React from "react";

const Banner: React.FC = () => {
    return (
        <div className="banner w-full h-[300px] md:h-[500px] lg:h-[600px] bg-[url(/banner.webp)] bg-cover bg-center relative">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                <h1 className="text-white text-4xl lg:text-6xl font-bold shadow-lg">
                    餐廳管理系統
                </h1>
            </div>
        </div>
    );
};

export default Banner;
