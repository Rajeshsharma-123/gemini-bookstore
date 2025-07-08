import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useSearch } from "../context/SearchContext";
import { useAuth } from "../context/authContext";
import { toast } from "react-toastify";
import { FaShoppingCart, FaUserCircle, FaSignOutAlt, FaSearch, FaBell } from "react-icons/fa";

const Navbar = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const { query, setQuery } = useSearch();
  const { isLoggedIn, logout, user } = useAuth();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    setShowProfile(false);
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-white via-blue-50 to-white backdrop-blur-md border-b border-gray-200/50 shadow-lg p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="group flex items-center gap-3 text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
        >
          <span className="text-3xl group-hover:rotate-12 transition-transform duration-300">
            📚
          </span>
          <span className="font-extrabold">BookStore</span>
        </Link>

        {/* Search & Icons */}
        {isLoggedIn ? (
          <div className="flex items-center gap-6 relative">
            {/* Enhanced Search Bar */}
            <div className={`relative transition-all duration-300 ${isSearchFocused ? 'scale-105' : ''}`}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className={`w-4 h-4 transition-colors duration-200 ${isSearchFocused ? 'text-blue-500' : 'text-gray-400'}`} />
              </div>
              <input
                type="text"
                placeholder="Search for books, authors..."
                className="pl-10 pr-4 py-3 w-72 bg-white/80 backdrop-blur-sm border border-gray-300/50 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all duration-300 text-sm placeholder-gray-500 shadow-sm hover:shadow-md"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 -z-10 transition-opacity duration-300 ${isSearchFocused ? 'opacity-100' : 'opacity-0'}`}></div>
            </div>

            {/* Navigation Icons */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-blue-600 transition-all duration-200 hover:bg-blue-50 rounded-full group">
                <FaBell className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              </button>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 text-gray-600 hover:text-blue-600 transition-all duration-200 hover:bg-blue-50 rounded-full group"
                title="Shopping Cart"
              >
                <FaShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                  2
                </span>
              </Link>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => setShowProfile((prev) => !prev)}
                  className="p-1 text-gray-600 hover:text-blue-600 transition-all duration-200 hover:bg-blue-50 rounded-full group"
                  title="Profile"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:shadow-xl transition-all duration-200">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                </button>

                {showProfile && (
                  <div
                    ref={profileRef}
                    className="absolute top-14 right-0 w-80 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200/50 p-6 animate-fade-in transform transition-all duration-300"
                  >
                    {/* Profile Header */}
                    <div className="flex items-center gap-4 mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1">
                          {user?.name || 'User'}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <span>📧</span> {user?.email || 'email@example.com'}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <span>📱</span> {user?.mobile || '+1234567890'}
                        </p>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-xl font-bold text-blue-600">12</div>
                        <div className="text-xs text-gray-600">Books</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-xl font-bold text-green-600">5</div>
                        <div className="text-xs text-gray-600">Reviews</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-xl font-bold text-purple-600">3</div>
                        <div className="text-xs text-gray-600">Wishlist</div>
                      </div>
                    </div>

                    {/* Profile Actions */}
                    <div className="space-y-2 mb-4">
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 p-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:text-blue-600"
                        onClick={() => setShowProfile(false)}
                      >
                        <span>👤</span>
                        <span>Edit Profile</span>
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center gap-3 p-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:text-blue-600"
                        onClick={() => setShowProfile(false)}
                      >
                        <span>📦</span>
                        <span>My Orders</span>
                      </Link>
                      <Link
                        to="/wishlist"
                        className="flex items-center gap-3 p-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:text-blue-600"
                        onClick={() => setShowProfile(false)}
                      >
                        <span>❤️</span>
                        <span>Wishlist</span>
                      </Link>
                    </div>

                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-3 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <FaSignOutAlt className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="px-6 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-all duration-200 hover:bg-blue-50 rounded-full"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-6 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;