// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import Logo from '../../public/uninest_logo.png';
import CustomButton from './CustomBtn';

const Header2 = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutMenuOpen, setAboutMenuOpen] = useState(false);
  const [current, setCurrent] = useState('listings');

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleAboutMenu = () => {
    setAboutMenuOpen(!aboutMenuOpen);
  };

  const closeMenus = () => {
    setMenuOpen(false);
    setAboutMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md py-2 px-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Side - Logo and Mobile Menu */}
        <div className="flex items-center">
          {/* Mobile Menu Button */}
          <button className="block md:hidden" onClick={toggleMenu}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>

          {/* Logo */}
          <img src={Logo} alt="UniNest Logo" className="h-10 w-auto ml-2" />
          <h1 className="text-2xl font-bold text-[#006845] ml-2">UniNest</h1>
        </div>

        {/* Desktop Navigation with right margin */}
        <nav className="hidden md:flex space-x-6 ml-6">
          <button
            className={`text-black ${current === 'listings' ? 'text-green-700 font-bold' : ''}`}
            onClick={() => setCurrent('listings')}
            style={{ color: current === 'listings' ? '#006845' : 'black' }}
          >
            View Listings
          </button>
          <button
            className={`text-black ${current === 'contact' ? 'text-green-700 font-bold' : ''}`}
            onClick={() => setCurrent('contact')}
            style={{ color: current === 'contact' ? '#006845' : 'black' }}
          >
            Contact Us
          </button>
          <div className="relative">
            <button
              className={`text-black flex items-center ${current === 'about' ? 'font-bold' : ''}`}
              onClick={() => {
                setCurrent('about');
                toggleAboutMenu();
              }}
              style={{ color: current === 'about' ? '#006845' : 'black' }}
            >
              About
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {aboutMenuOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-md py-2">
                <a href="#about-us" className={`block px-4 py-2 ${current === 'about-us' ? 'font-bold' : ''}`} onClick={() => { setCurrent('about-us'); closeMenus(); }} style={{ color: current === 'about-us' ? '#006845' : 'black', hover: { color: '#006845' } }}>About Us</a>
                <a href="#how-it-works" className={`block px-4 py-2 ${current === 'how-it-works' ? 'font-bold' : ''}`} onClick={() => { setCurrent('how-it-works'); closeMenus(); }} style={{ color: current === 'how-it-works' ? '#006845' : 'black', hover: { color: '#006845' } }}>How it Works</a>
              </div>
            )}
          </div>
        </nav>

        {/* Action Buttons (both Desktop and Mobile) */}
        <div className="flex items-center space-x-4 ml-auto">
          <CustomButton
              btnName="Login"
              btnType="submit"
              color="white"
              hoverColor="#bfbfbf"
              textColor="black"
              hoverTextColor="black"
              
            />
            <CustomButton
              btnName="Sign up"
              btnType="button"
              color="#006845"
              hoverColor="#15803d"
              textColor="white"
              hoverTextColor="white"
              

            />
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg rounded-md mt-2">
          <a href="#listings" className={`block px-4 py-2 ${current === 'listings' ? 'font-bold' : ''}`} onClick={() => { setCurrent('listings'); closeMenus(); }} style={{ color: current === 'listings' ? '#006845' : 'black', hover: { color: '#006845' } }}>View Listings</a>
          <a href="#contact" className={`block px-4 py-2 ${current === 'contact' ? 'font-bold' : ''}`} onClick={() => { setCurrent('contact'); closeMenus(); }} style={{ color: current === 'contact' ? '#006845' : 'black', hover: { color: '#006845' } }}>Contact Us</a>
          <div className="relative">
            <button
              className={`block w-full text-left px-4 py-2 ${current === 'about' ? 'font-bold' : ''}`}
              onClick={() => {
                setCurrent('about');
                toggleAboutMenu();
              }}
              style={{ color: current === 'about' ? '#006845' : 'black', hover: { color: '#006845' } }}
            >
              About
              <svg className="w-4 h-4 ml-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {aboutMenuOpen && (
              <div className="pl-4">
                <a href="#about-us" className={`block px-4 py-2 ${current === 'about-us' ? 'font-bold' : ''}`} onClick={() => { setCurrent('about-us'); closeMenus(); }} style={{ color: current === 'about-us' ? '#006845' : 'black', hover: { color: '#006845' } }}>About Us</a>
                <a href="#how-it-works" className={`block px-4 py-2 ${current === 'how-it-works' ? 'font-bold' : ''}`} onClick={() => { setCurrent('how-it-works'); closeMenus(); }} style={{ color: current === 'how-it-works' ? '#006845' : 'black', hover: { color: '#006845' } }}>How it Works</a>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header2;
