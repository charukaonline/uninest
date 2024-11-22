// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import Logo from "/uninestLogo.png";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutMenuOpen, setAboutMenuOpen] = useState(false);
  const [current, setCurrent] = useState("listings");

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
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>

          {/* Logo */}
          <Link to={"/"}>
            <img
              src={Logo}
              alt="UniNest Logo"
              className="h-20 w-auto ml-2 mr-10"
            />
          </Link>
        </div>

        {/* Desktop Navigation with right margin */}
        <nav className="hidden md:flex space-x-6 ml-6">
          <button
            className={"text-black font-bold"}
            onClick={() => setCurrent("listings")}
          >
            View Listings
          </button>
          <button
            className={"text-black font-bold"}
            onClick={() => setCurrent("contact")}
          >
            Contact Us
          </button>

          <div className="relative w-40">
            <button
              className={"text-black font-bold items-center flex"}
              onClick={() => {
                setCurrent("about");
                toggleAboutMenu();
              }}
            >
              About
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {aboutMenuOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-md py-2">
                <a
                  href="#about-us"
                  className={`block px-4 py-2 ${
                    current === "about-us" ? "font-bold" : ""
                  }`}
                  onClick={() => {
                    setCurrent("about-us");
                    closeMenus();
                  }}
                  style={{
                    color: current === "about-us" ? "#006845" : "black",
                    hover: { color: "#006845" },
                  }}
                >
                  About Us
                </a>
                <a
                  href="#how-it-works"
                  className={`block px-4 py-2 ${
                    current === "how-it-works" ? "font-bold" : ""
                  }`}
                  onClick={() => {
                    setCurrent("how-it-works");
                    closeMenus();
                  }}
                  style={{
                    color: current === "how-it-works" ? "#006845" : "black",
                    hover: { color: "#006845" },
                  }}
                >
                  How it Works
                </a>
              </div>
            )}
          </div>
        </nav>

        {/* Action Buttons (both Desktop and Mobile) */}
        <div className="flex items-center space-x-4 ml-auto">
          <Button
            className="bg-transparent hover:bg-transparent text-black border border-gray-600 hover:border-black font-semibold "
            onClick={(e) => {
              e.preventDefault(); // Prevent default anchor behavior
              navigate("/auth/user-signin"); // Redirect to the login route
            }}
          >
            Login
          </Button>

          <Button
            className="bg-[#006845] hover:bg-[#006845] font-semibold"
            onClick={(e) => {
              e.preventDefault(); // Prevent default anchor behavior
              navigate("/auth/user-signup"); // Redirect to the login route
            }}
          >
            SignUp
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#eee] shadow-lg rounded-md mt-2">
          <a
            href="#listings"
            className={`block px-4 py-2 ${
              current === "listings" ? "font-bold" : ""
            }`}
            onClick={() => {
              setCurrent("listings");
              closeMenus();
            }}
            style={{
              color: current === "listings" ? "#006845" : "black",
              hover: { color: "#006845" },
            }}
          >
            View Listings
          </a>
          <a
            href="#contact"
            className={`block px-4 py-2 ${
              current === "contact" ? "font-bold" : ""
            }`}
            onClick={() => {
              setCurrent("contact");
              closeMenus();
            }}
            style={{
              color: current === "contact" ? "#006845" : "black",
              hover: { color: "#006845" },
            }}
          >
            Contact Us
          </a>
          <div className="relative">
            <button
              className={`block w-full text-left px-4 py-2 ${
                current === "about" ? "font-bold" : ""
              }`}
              onClick={() => {
                setCurrent("about");
                toggleAboutMenu();
              }}
              style={{
                color: current === "about" ? "#006845" : "black",
                hover: { color: "#006845" },
              }}
            >
              About
              <svg
                className="w-4 h-4 ml-1 inline"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {aboutMenuOpen && (
              <div className="pl-4">
                <a
                  href="#about-us"
                  className={`block px-4 py-2 ${
                    current === "about-us" ? "font-bold" : ""
                  }`}
                  onClick={() => {
                    setCurrent("about-us");
                    closeMenus();
                  }}
                  style={{
                    color: current === "about-us" ? "#006845" : "black",
                    hover: { color: "#006845" },
                  }}
                >
                  About Us
                </a>
                <a
                  href="#how-it-works"
                  className={`block px-4 py-2 ${
                    current === "how-it-works" ? "font-bold" : ""
                  }`}
                  onClick={() => {
                    setCurrent("how-it-works");
                    closeMenus();
                  }}
                  style={{
                    color: current === "how-it-works" ? "#006845" : "black",
                    hover: { color: "#006845" },
                  }}
                >
                  How it Works
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
