// eslint-disable-next-line no-unused-vars
import React from 'react';

function LandingSection2() {
  return (
    <div className="max-w-screen-xl mx-auto bg-white p-16 flex flex-col lg:flex-row gap-40">
      {/* Left Section */}
      {/* <div className="bg-teal-200 p-8 rounded-lg flex flex-col justify-between shadow-md"> */}
      <div
      className="bg-gradient-to-b from-green-200 to-green-300 rounded-lg p-8 max-w-72 text-center lg:text-left bg-cover bg-center"
    style={{ backgroundImage: "url('/img.jpg')" }} >

        <h1 className="text-3xl font-bold text-green-800 mb-4">
          The new way to find your new boarding place
        </h1>
        <p className="text-gray-700 mb-6">
          Find your dream place to live in with more than 10k+ properties listed.
        </p>
        <button className="bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700">
          Browse Boarding Options
        </button>
      </div>

      {/* Right Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="flex flex-col items-start text-center">
          <div className="p-2 rounded-full mb-2">
            <img src="/Icon (2).png" alt="Safety & Security" className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Safety & Security</h3>
          <p className="text-gray-600 text-start">
            We offer our customer property protection of liability coverage and insurance for their better life.
          </p>
        </div>

        <div className="flex flex-col items-start text-center">
          <div className=" p-2 rounded-full mb-2">
            <img src="/Icon (5).png" alt="Find the Best Offers" className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Find the Best Offers</h3>
          <p className="text-gray-600 text-start">
            Not sure what you should be charging for your property? No need to worry, let us do the numbers for you.
          </p>
        </div>

        <div className="flex flex-col items-start text-center">
          <div className="p-2 rounded-full mb-2">
            <img src="/Icon (3).png" alt="Lowest Commission" className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Lowest Commission</h3>
          <p className="text-gray-600 text-start">
            You no longer have to negotiate commissions and haggle with other agents; it only costs 2%!
          </p>
        </div>

        <div className="flex flex-col items-start text-center">
          <div className=" p-2 rounded-full  mb-2">
            <img src="/Icon (4).png" alt="Overall Control" className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Overall Control</h3>
          <p className="text-gray-600 text-start">
            Get a virtual tour, and schedule visits before you rent or buy any properties. You get overall control.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LandingSection2;
