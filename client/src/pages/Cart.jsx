// src/pages/Cart.jsx
import React, { useEffect, useState } from "react";
import axios from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user's cart items
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data.cart);
    } catch (error) {
      toast.error("Failed to fetch cart items");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Remove book from cart
  const removeFromCart = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/cart/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Removed from cart");
      setCartItems((prev) => prev.filter((item) => item._id !== bookId));
    } catch (error) {
      toast.error("Error removing from cart");
      console.error(error);
    }
  };

  // Clear the entire cart
  const clearCart = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete("/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Cart cleared successfully");
      setCartItems([]);
    } catch (error) {
      toast.error("Failed to clear cart");
      console.error(error);
    }
  };

  // Proceed to checkout
  const handleCheckout = () => {
    navigate("/checkout");
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
            <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            Your Reading Cart
          </h1>
          <p className="text-gray-600 text-lg">
            {cartItems.length === 0 
              ? "Your cart is ready for amazing books" 
              : `${cartItems.length} book${cartItems.length > 1 ? 's' : ''} selected for your collection`
            }
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-4">Your Cart is Empty</h3>
              <p className="text-gray-500 mb-8">
                Discover amazing books and start building your personal library
              </p>
              <button
                onClick={() => navigate("/")}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Browse Books
                </span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Cart Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
              {cartItems.map((book, index) => (
                <div
                  key={book._id}
                  className="group bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col overflow-hidden border border-white/20 hover:border-red-200/50 hover:-translate-y-2"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                  }}
                >
                  {/* Book Image with Remove Button Overlay */}
                  <div className="relative overflow-hidden">
                    <img
                      src={`http://localhost:3000/${book.bookImage}`}
                      alt={book.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Remove Button Overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button
                        onClick={() => removeFromCart(book._id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-300"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    {/* Price Badge */}
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                      ₹{book.price}
                    </div>
                  </div>

                  {/* Book Details */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h2 className="text-xl font-bold text-gray-800 group-hover:text-purple-700 transition-colors duration-300 line-clamp-2">
                        {book.title}
                      </h2>
                      <p className="text-gray-600 font-medium">by {book.author}</p>
                      {book.description && (
                        <p className="text-gray-500 text-sm line-clamp-3">
                          {book.description}
                        </p>
                      )}
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(book._id)}
                      className="mt-4 w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove from Cart
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary and Actions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
              <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                {/* Total Price Section */}
                <div className="text-center lg:text-left">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Total Amount
                  </h2>
                  <p className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    ₹{totalPrice.toLocaleString()}
                  </p>
                  <p className="text-gray-600 mt-2">
                    {cartItems.length} item{cartItems.length > 1 ? 's' : ''} in your cart
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={clearCart}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Clear Cart
                    </span>
                  </button>
                  <button
                    onClick={handleCheckout}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                      </svg>
                      Proceed to Checkout
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Cart;