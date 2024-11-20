import React from "react";
import BordingImage from '../images/bording.jpg'; // Import image

const LandingSection3 = () => {
  return (
    <div className="flex flex-col md:flex-row items-center bg-white p-8 rounded-lg shadow-lg space-y-6 md:space-y-0">
      {/* Text Section */}
      <div className="flex-1 space-y-4 md:pr-6 text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Best Place to List Your Boarding House
        </h2>
        <p className="text-gray-600 leading-relaxed">
          The best place to list your boarding house is on our website! With user-friendly features and wide reach, we help you connect with potential tenants quickly and effectively. Whether you’re targeting short-term or long-term stays, our platform ensures maximum visibility and a hassle-free experience. List your property today!
        </p>
        <div className="flex items-center justify-center md:justify-start space-x-4">
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
            Get Started
          </button>
          <a href="#" className="text-gray-800 underline hover:text-gray-900">
            Have a question? Click here...
          </a>
        </div>
      </div>

      {/* Image Section */}
      <div className="flex-1 mt-6 md:mt-0">
        <img
          src={BordingImage}
          alt="Boarding House"
          className="rounded-lg shadow-md w-full h-auto object-cover"
        />
      </div>
    </div>
  );
};

export default LandingSection3;
