import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Logo from '/uninestLogo.png';
import { ChevronDown, List } from 'lucide-react';
import { Button } from '../ui/button';

import { useAuthStore } from '@/store/authStore';

const Header = () => {

  const [aboutDropdown, setAboutDropdown] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // const {isAuthenticated} = useAuthStore();

  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {

      if (!e.target.closest('.dropdown') && !e.target.closest('.menu-toggle')) {
        setAboutDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const toggleAboutDropdown = () => setAboutDropdown(!aboutDropdown);
  const toggleUserDropdown = () => setUserDropdown(!userDropdown);
  const closeMenus = () => {
    setAboutDropdown(false);
    setUserDropdown(false);
  }

  return (
    <header className=' bg-white shadow-md py-1 px-5 flex justify-between z-10'>
      <div className=' flex justify-between items-center'>

        <div>
          <Link to={"/"}>
            <img src={Logo} alt='uninest logo' className=' h-20 w-auto ml-2 mr-10' />
          </Link>
          <button className=' block md:hidden'>
            <List />
          </button>
        </div>
        <div>
          <nav className=' md:flex space-x-6'>
            <button
              className=' text-black hover:text-[#006845] font-semibold items-center'
              onClick={() => navigate('/all-listings')}
            >
              View Listing
            </button>
            <button to={"/"} className=' text-black hover:text-[#006845] font-semibold items-center'>
              Contact Us
            </button>
            <div className=' relative'>
              <button
                className='menu-toggle text-black hover:text-[#006845] font-semibold items-center'
                onClick={toggleAboutDropdown}
              >
                <div className='flex items-center'>
                  About
                  <ChevronDown
                    className={`ml-1 transition-transform ${aboutDropdown ? 'rotate-180' : 'rotate-0'
                      }`}
                  />
                </div>
              </button>

              {aboutDropdown && (
                <div className='dropdown absolute top-full left-0 mt-0 bg-[#eee] shadow-lg rounded-md py-2 w-40 z-10'>
                  <Link
                    className="block px-4 py-2 text-black hover:text-white hover:bg-[#006845] rounded-md w-5/6 mx-auto"
                    to={"/"}
                    onClick={closeMenus}
                  >
                    About Us
                  </Link>
                  <Link
                    className="block px-4 py-2 text-black hover:text-white hover:bg-[#006845] rounded-md w-5/6 mx-auto"
                    to={"/"}
                    onClick={closeMenus}
                  >
                    How It Works
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>

      </div>
      <div className=' flex items-center space-x-2'>

        {isAuthenticated ? (
          <div>
            <button
              className=' flex space-x-1 items-center justify-center'
              onClick={toggleUserDropdown}
            >
              <div className=' w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 items-center justify-center'>
                <img src='/' alt='' />
              </div>
              <ChevronDown
                className=' hover:text-[#006845]'
              />
            </button>
          </div>
        ) : (
          <>
            <Button
              className="bg-transparent hover:bg-[#006845] hover:text-white text-black border border-gray-600 hover:border-transparent font-semibold"
              onClick={(e) => {
                e.preventDefault();
                navigate("/auth/user-signin");
              }}
            >
              Login
            </Button>
            <Button
              className="bg-[#006845] text-white hover:bg-green-800 border hover:border-gray-600 font-semibold"
              onClick={(e) => {
                e.preventDefault();
                navigate("/auth/user-signup");
              }}
            >
              Sign Up
            </Button>
          </>
        )}
      </div>
    </header>
  )
}

export default Header