import React from 'react'
import { Link } from 'react-router-dom';
import { FaLinkedin, FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa';

const Footer = () => {

  const currentYear = new Date().getFullYear();

  return (
    <div
      className="bg-white"
      style={{
        boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)',
      }}
    >
      <div className=" mx-auto p-8 px-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">

        <div className=' justify-center items-start'>
          <div className=' flex justify-center'>
            <div className=" p-2">
              <img src="/uninestLogo.png" alt="Uninest Logo" className='h-52' />
            </div>
          </div>
        </div>

        <div className="flex justify-center items-start">
          <div className="space-y-2">
            <h2 className="font-semibold text-md text-gray-800 mb-3">ABOUT</h2>
            <Link to="/" className="text-gray-600 hover:text-primaryBgColor transition-colors duration-200 block">Company</Link>
            <Link to="/" className="text-gray-600 hover:text-primaryBgColor transition-colors duration-200 block">How it Works</Link>
            <Link to="/" className="text-gray-600 hover:text-primaryBgColor transition-colors duration-200 block">Contact</Link>
            <Link to="/" className="text-gray-600 hover:text-primaryBgColor transition-colors duration-200 block">Investors</Link>
          </div>
        </div>

        <div className=' flex justify-center items-start'>
          <div className="space-y-2">
            <h2 className="font-semibold text-md text-gray-800 mb-3">TERMS & PRIVACY</h2>
            <Link to="/privacy-policy" className="text-gray-600 hover:text-primaryBgColor transition-colors duration-200 block">Trust & Safety</Link>
            <Link to="/privacy-policy" className="text-gray-600 hover:text-primaryBgColor transition-colors duration-200 block">Terms of Service</Link>
            <Link to="/privacy-policy" className="text-gray-600 hover:text-primaryBgColor transition-colors duration-200 block">Privacy Policy</Link>
          </div>
        </div>

        <div className=' flex justify-center items-start'>
          <div className="space-y-2">
            <h2 className="font-semibold text-md text-gray-800 mb-3">RENT & BUY</h2>
            <Link to="/all listings" className="text-gray-600 hover:text-primaryBgColor transition-colors duration-200 block">All Listings</Link>
            <Link to="/" className="text-gray-600 hover:text-primaryBgColor transition-colors duration-200 block">Student Dashboard</Link>
            <Link to="/" className="text-gray-600 hover:text-primaryBgColor transition-colors duration-200 block">House Owner Dashboard</Link>
          </div>
        </div>
      </div>

      <div className="bg-[#006845] text-center text-white flex justify-between p-4 px-10">
        <div>
          <span className="text-md">© {currentYear} UniNest. All rights reserved</span>
        </div>
        <div className="flex justify-center md:justify-start space-x-6">
          <Link to="/"><FaFacebook className="text-white hover:text-[#eee] size-5" /></Link>
          <Link to="/"><FaInstagram className="text-white hover:text-[#eee] size-5" /></Link>
          <Link to="/"><FaTwitter className="text-white hover:text-[#eee] size-5" /></Link>
          <Link to="/"><FaLinkedin className="text-white hover:text-[#eee] size-5" /></Link>
        </div>
      </div>
    </div>
  );
}

export default Footer