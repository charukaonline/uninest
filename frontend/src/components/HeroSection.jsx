import React from "react";

function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center bg-[url('/heroBackground.jpg')] bg-cover bg-center bg-no-repeat py-16 px-8 lg:px-20 font-sans">
      {/* Centered Content */}
      <div className="max-w-xl space-y-9 lg:space-y-8 text-center">
        {/* Title and Subtitle */}
        <div className="space-y-5 px-4">
          <h1
            className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-0 tracking-tight"
            style={{ textShadow: "2px 2px 8px rgba(0, 0, 0, 0.1)" }}
          >
            Find Your Favorite{" "}
            <span className="text-green-700">Boarding House</span>
          </h1>
          <p className="text-gray-700 text-lg leading-relaxed">
            Discover great options to buy or rent boarding houses tailored for
            university students across Sri Lanka.
          </p>
        </div>

        {/* Input and Button in a Stacked Layout on Mobile without padding on Mobile */}
        <div className="w-full mx-auto lg:max-w-lg lg:bg-white rounded-lg lg:p-4 p-0">
          <div className="flex flex-col lg:flex-row items-center lg:space-x-4">
            {/* Input Container with Border on Mobile */}
            <div className="flex-grow w-full bg-gray-200 rounded-md overflow-hidden mb-4 lg:mb-0 border border-gray-300 lg:border-0">
              <input
                type="text"
                placeholder="What University are you belongs to?"
                className="w-full px-4 py-3 text-center text-gray-700 bg-gray-200 placeholder-gray-500 focus:outline-none focus:bg-gray-100"
              />
            </div>
            {/* Divider (|) */}
            <div className="lg:h-6 w-px bg-gray-300 mx-4"></div>{" "}
            {/* Divider with spacing */}
            {/* Button Container, Stacked on Mobile */}
            <button className=" lg:w-auto bg-green-700 text-white px-5 py-2 lg:px-6 lg:py-3 font-semibold hover:bg-green-600 transition duration-300 rounded-lg">
              Proceed
            </button>
          </div>
        </div>

        {/* Button for Landlord */}
        <div className="space-y-5 text-center">
          <p className="text-gray-800 font-semibold text-lg">
            Are you a boarding house owner looking to list your housing options?
          </p>
          <button className="px-8 py-3 bg-green-700 text-white rounded-full font-semibold hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 shadow-md">
            Get Started as a Landlord
          </button>
        </div>
      </div>

      {/* Optional Right Image Section 
      <div className="hidden lg:block p-0">
        <img src="/src/assets/Image.png" alt="House Owner" className="w-60 h-auto "/>
      </div>*/}
    </section>
  );
}

export default HeroSection;
