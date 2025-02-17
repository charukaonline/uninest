import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {

  const navigate = useNavigate();

  const searchUniversity = () => {
    console.log('Search University');
  }

  return (
    <section className="flex items-center justify-center bg-[url('/heroBackground.jpg')] bg-cover bg-center bg-no-repeat py-16 px-8 lg:px-20">
      {/* Container for left and right sections */}
      <div className="flex flex-col lg:flex-row w-full max-w-7xl mx-auto">
        {/* Left Content */}
        <div className="lg:w-1/2 text-center lg:text-left px-6 lg:px-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
            Find Your Favorite <span className='text-primaryBgColor'>Boarding House</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            A great platform to buy or rent boarding houses for University Students in Sri Lanka...
          </p>

          {/* Search Bar */}
          <div className="mt-6 flex items-center space-x-3 bg-white shadow-md rounded-md p-2">
            <input
              type="text"
              placeholder="What University are you belongs to?"
              className="flex-1 px-4 py-2 border-none focus:outline-none text-black bg-[#D9D9D9] rounded-md"
            />
            <div className="lg:h-6 w-px bg-gray-500 mx-4"></div>
            <button
              onClick={searchUniversity}
              className="px-6 py-2 bg-primaryBgColor text-white rounded-md hover:bg-green-700"
            >
              Proceed
            </button>
          </div>

          <p className="mt-8 text-gray-800 font-semibold">
            Are you a boarding house owner looking to list your housing options?
          </p>
          <button
            className="mt-2 px-6 py-2 bg-primaryBgColor text-white rounded-md hover:bg-green-700"
            onClick={() => navigate("/auth/houseowner-signin")}
          >
            Get Started as a Landlord
          </button>
        </div>

        {/* Right Image */}
        <div
          className="lg:w-1/2 flex items-center justify-center mt-8 lg:mt-0 relative"
          style={{
            maskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 80%, rgba(0, 0, 0, 0) 100%), linear-gradient(to right, rgba(0, 0, 0, 1) 80%, rgba(0, 0, 0, 0) 100%)',
            maskComposite: 'intersect',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 80%, rgba(0, 0, 0, 0) 100%), linear-gradient(to right, rgba(0, 0, 0, 1) 80%, rgba(0, 0, 0, 0) 100%)',
            WebkitMaskComposite: 'destination-in',
          }}
        >
          <img
            src="/landingPageImage.png"
            className="h-full w-full object-cover"
            alt="Boarding House"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
