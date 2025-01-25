import React from "react";
import PropertyCard from "./card";
import FilterBar from "./FilterBar.jsx";

const ScrollingSection = () => {
  // Card data managed within ScrollingSection
  const cardData = [
    {
      image: "/homepic.jpg",
      title: "The Stables",
      price: "$ 9540.99",
      location: "📍 Terry Lane, Golden CO 80403",
    },
    {
      image: "/homepic.jpg",
      title: "The Washington",
      price: "$ 2456.99",
      location: "📍 DC Washington",
    },
    {
      image: "/homepic.jpg",
      title: "Ocean Breeze",
      price: "$ 7890.50",
      location: "📍 Malibu, CA",
    },
    {
      image: "/homepic.jpg",
      title: "Mountain Retreat",
      price: "$ 3650.00",
      location: "📍 Aspen, CO",
    },
    {
      image: "/homepic.jpg",
      title: "Hilton",
      price: "$ 3650.00",
      location: "📍 Sri Lanka",
    },
    {
      image: "/homepic.jpg",
      title: "Mountain Bay",
      price: "$ 3650.00",
      location: "📍 Kandy",
    },
    {
      image: "/homepic.jpg",
      title: "Suriya Hotels",
      price: "$ 3650.00",
      location: "📍 Colombo",
    },
    {
      image: "/homepic.jpg",
      title: "Mountain Retreat",
      price: "$ 3650.00",
      location: "📍 Aspen, CO",
    },
    {
      image: "/homepic.jpg",
      title: "Mountain Retreat",
      price: "$ 3650.00",
      location: "📍 Kegalle",
    },
  ];

  return (
      <section className="p-6 bg-gray-100 min-h-screen">
        {/* Header Section */}
        <FilterBar/>

        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Results</h1>
        </header>

        {/* Scrolling Section */}
        <main className="h-[calc(100vh-150px)] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Render Cards */}
            {cardData.map((card, index) => (
                <PropertyCard
                    key={index}
                    image={card.image}
                    title={card.title}
                    price={card.price}
                    location={card.location}
                />
            ))}
          </div>
        </main>
      </section>
  );
};

export default ScrollingSection;
