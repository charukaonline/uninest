import React from "react";
import PropertyCard from "./Card.jsx";
import FilterBar from "./FilterBar.jsx";
import MobileFilterBar from "./MobileFilterBar.jsx";

const ScrollingSection = () => {
    const cardData = [
        { image: "/homepic.jpg", title: "The Stables", price: "$ 9540.99", location: "📍 Terry Lane, Golden CO 80403" },
        { image: "/homepic.jpg", title: "The Washington", price: "$ 2456.99", location: "📍 DC Washington" },
        { image: "/homepic.jpg", title: "Ocean Breeze", price: "$ 7890.50", location: "📍 Malibu, CA" },
        { image: "/homepic.jpg", title: "Mountain Retreat", price: "$ 3650.00", location: "📍 Aspen, CO" },
        { image: "/homepic.jpg", title: "Hilton", price: "$ 3650.00", location: "📍 Sri Lanka" },
        { image: "/homepic.jpg", title: "Mountain Bay", price: "$ 3650.00", location: "📍 Kandy" },
        { image: "/homepic.jpg", title: "Suriya Hotels", price: "$ 3650.00", location: "📍 Colombo" },
        { image: "/homepic.jpg", title: "Mountain Retreat", price: "$ 3650.00", location: "📍 Aspen, CO" },
        { image: "/homepic.jpg", title: "Mountain Retreat", price: "$ 3650.00", location: "📍 Kegalle" },
    ];

    return (
        <section className="px-3 sm:px-4 md:px-6 py-4 bg-gray-100 min-h-screen flex flex-col items-center">
            {/* Filter Bars */}
            <div className="hidden md:block w-full max-w-7xl mb-8">
                <FilterBar />
            </div>
            <div className="block md:hidden mb-4 w-full max-w-7xl">
                <MobileFilterBar />
            </div>

            {/* Cards Grid */}
            <main className="h-[calc(100vh-160px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-7xl mx-auto">
                    {cardData.map((card, index) => (
                        <PropertyCard key={index} image={card.image} title={card.title} price={card.price} location={card.location} />
                    ))}
                </div>
            </main>
        </section>
    );
};

export default ScrollingSection;
