import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-slate-800 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-white font-bold text-xl">
              Student Accommodation
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-700 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              <div className="block w-6 h-6 relative">
                <span className={`absolute w-full h-0.5 bg-current transform transition duration-300 ease-in-out ${isOpen ? 'rotate-45 translate-y-1.5' : '-translate-y-1'}`} />
                <span className={`absolute w-full h-0.5 bg-current transform transition duration-300 ease-in-out ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
                <span className={`absolute w-full h-0.5 bg-current transform transition duration-300 ease-in-out ${isOpen ? '-rotate-45 -translate-y-1.5' : 'translate-y-1'}`} />
              </div>
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors duration-300">
              Home
            </Link>
            <Link to="/students" className="text-gray-300 hover:text-white transition-colors duration-300">
              Students
            </Link>
            <Link to="/rooms" className="text-gray-300 hover:text-white transition-colors duration-300">
              Rooms
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-800">
          <Link
            to="/"
            className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-slate-700 rounded-md"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/students"
            className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-slate-700 rounded-md"
            onClick={() => setIsOpen(false)}
          >
            Students
          </Link>
          <Link
            to="/rooms"
            className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-slate-700 rounded-md"
            onClick={() => setIsOpen(false)}
          >
            Rooms
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 