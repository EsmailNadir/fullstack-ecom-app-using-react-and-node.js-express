import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from "react-icons/fa";  
import LoginContext from './context/loginContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const { isLoggedIn, logout } = useContext(LoginContext); // Consume the context

  const toggleAccountDropdown = () => {
    setIsAccountOpen(!isAccountOpen);
  };

  return (
    <nav className="bg-black text-white">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Left Side Links */}
        <div className="hidden md:flex space-x-4">
          <Link to="/products" className="hover:text-gray-300">Products</Link>
          <Link to="/AdminProductManagement" className="hover:text-gray-300">Admin</Link>
        </div>

        {/* Right Side Links */}
        <div className="hidden md:flex items-center">
          <div className="relative">
            {isLoggedIn ? (
              <>
                {/* Account Button */}
                <button onClick={toggleAccountDropdown} className="hover:text-gray-300">
                  Account
                </button>
                {/* Account Dropdown */}
                {isAccountOpen && (
                  <div className="absolute right-0 mt-2 py-2 w-48 bg-black rounded-lg shadow-xl">
                    <Link to="/userProfile" className="block px-4 py-2 hover:text-gray-300">
                      Account Details
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 hover:text-gray-300"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-gray-300">Login</Link>
                <Link to="/signup" className="hover:text-gray-300 ml-4">Signup</Link>
              </>
            )}
          </div>

          {/* Cart Link */}
          <Link to="/cart" className="px-8 hover:text-gray-300 flex flex-col items-center">
                <FaShoppingCart className="text-2xl" />
                <span>Cart</span>
          </Link>

        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden hover:text-gray-300"
          onClick={() => setIsOpen(!isOpen)}
        >
          Menu
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="mt-4 md:hidden">
          <Link to="/products" className="block py-2 hover:bg-gray-800">Products</Link>
          <Link to="/AdminProductManagement" className="block py-2 hover:bg-gray-800">Admin</Link>
          <Link to="/cart" className="py-2 hover:bg-gray-800 flex items-center">
            <FaShoppingCart className="mr-2" /> Cart
          </Link>

          {/* Mobile Account Section */}
          {isLoggedIn ? (
            <>
              <Link to="/userProfile" className="block py-2 hover:bg-gray-800">Account</Link>
              <button
                onClick={logout}
                className="block w-full text-left py-2 hover:bg-gray-800"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block py-2 hover:bg-gray-800">Login</Link>
              <Link to="/signup" className="block py-2 hover:bg-gray-800">Signup</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
