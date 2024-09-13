import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from "react-icons/fa";  

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check for token in localStorage when the component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // Set logged in state based on token presence
  }, []);

  const handleLogin = () => {
    // Assuming you have logic to authenticate and get a token
    const token = 'token'; 
    localStorage.setItem('token', token); // Store the token in localStorage
    setIsLoggedIn(true); // Update the logged-in state
    setIsAccountOpen(false); // Close the account dropdown
  };

  const handleLogOut = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    setIsLoggedIn(false); // Update isLoggedIn state
    setIsAccountOpen(false); // Close account dropdown
  };

  const toggleAccountDropdown = () => {
    setIsAccountOpen(!isAccountOpen);
  };
 

  return (
    <nav className="bg-black text-white">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex space-x-4">
            <Link to="/products" className="hover:text-gray-300">Products</Link>
            <Link to="/AdminProductManagement" className="hover:text-gray-300">Admin</Link>
          </div>
        </div>
        
        <div className="hidden md:flex items-center justify-end">
          <div className="relative">
            <button onClick={toggleAccountDropdown} className="hover:text-gray-300">
              Account^
            </button>

            {isAccountOpen && isLoggedIn && (
              <div className="absolute right-0 mt-2 py-2 w-48 bg-black rounded-lg shadow-xl items-center">
                <Link to="/userProfile" className="block px-4 py-2 hover:text-gray-300">Account Details</Link>
                <button onClick={handleLogOut} className="block w-full text-left px-4 py-2 hover:text-gray-300">Logout</button>
              </div>
            )}

            {isAccountOpen && !isLoggedIn && (
              <div className="absolute right-0 mt-2 py-2 w-48 bg-black rounded-lg shadow-xl items-center">
                <Link to="/login" className="block px-4 py-2 hover:text-gray-300">Login</Link>
                <Link to="/signup" className="block px-4 py-2 text-white-800 ">Signup</Link>
              </div>
            )}
          </div>

          <Link to="/cart" className="px-8 hover:text-gray-300 flex flex-col items-center">
            <FaShoppingCart className="text-2xl" />
            <span>Cart</span>
          </Link>
        </div>

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
          <Link to="/" className="block py-2 hover:bg-gray-800">Products</Link>
          <Link to="/about" className="block py-2 hover:bg-gray-800">About</Link>
          <Link to="/services" className="block py-2 hover:bg-gray-800">Services</Link>
          <Link to="/contact" className="block py-2 hover:bg-gray-800">Contact</Link>
          <Link to="/shoppingCart" className="py-2 hover:bg-gray-800 flex items-center">
            <FaShoppingCart className="mr-2" /> Cart
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
