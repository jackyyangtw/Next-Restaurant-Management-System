// import Image from "next/image";
import Banner from "../components/Banner";
import AllRestaurants from "@/components/Restaurant/AllRestaurant";
export default function Home() {
    return (
        <>
            <Banner></Banner>
            <div className="container py-6 px-4 mx-auto">
                <AllRestaurants></AllRestaurants>
            </div>
        </>
    );
}
