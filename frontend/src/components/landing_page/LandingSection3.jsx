import { Link } from "react-router-dom";
import BordingImage from "/bording.jpg";

const LandingSection3 = () => {
  return (
    <div className="flex flex-col md:flex-row items-center bg-white p-16 rounded-lg shadow-lg space-y-6 md:space-y-0">
      {/* Text Section */}
      <div className="flex-1 space-y-4 md:pr-6 text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Best Place to List Your Boarding House
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Find the perfect boarding house effortlessly with our comprehensive
          platform. Whether you’re a tenant searching for a cozy stay or a
          property owner looking to list your boarding house, we provide an
          easy-to-use, reliable, and efficient solution to connect you with the
          right people. Your next boarding house is just a click away!{" "}
        </p>
        <div className="flex items-center justify-center md:justify-start space-x-4">
          <button className="bg-[#006845] text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
            Get Started
          </button>
          <Link to={"/"} className="text-gray-800 underline hover:text-[#006845]">
            Have a question? Click here...
          </Link>
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
