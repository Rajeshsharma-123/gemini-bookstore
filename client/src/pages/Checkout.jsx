import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../services/api";
import { toast } from "react-toastify";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data.cart);
      const totalPrice = res.data.cart.reduce((sum, item) => sum + item.price, 0);
      setTotal(totalPrice);
    } catch (error) {
      toast.error("Failed to load cart items");
    }
  };

  const handlePlaceOrder = () => {
    // For now, just mock it
    toast.success("🎉 Order placed successfully!");
    navigate("/");
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-bold mb-4">🧾 Checkout Summary</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <ul className="space-y-4">
            {cartItems.map((item) => (
              <li key={item._id} className="bg-white p-4 shadow rounded">
                <div className="flex justify-between">
                  <span>{item.title}</span>
                  <span>₹{item.price}</span>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 p-4 bg-white shadow rounded text-right">
            <p className="text-xl font-semibold">Total: ₹{total}</p>
            <button
              onClick={handlePlaceOrder}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
