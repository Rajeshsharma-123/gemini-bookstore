import React from "react";

const UserInfoCard = ({ user }) => {
  return (
    <div className="bg-gray-100 rounded-xl p-6 shadow-inner">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <img
          src={
            user.profileImage
              ? `https://gemini-bookstore.onrender.com/${user.profileImage}`
              : "https://via.placeholder.com/100"
          }
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
        />
        <div>
          <p className="text-lg font-semibold">Name: {user.name}</p>
          <p className="text-gray-700">Email: {user.email}</p>
          <p className="text-gray-700">Mobile: {user.mobile}</p>
          <p className="text-sm text-purple-600">Role: {user.role}</p>
        </div>
      </div>
    </div>
  );
};

export default UserInfoCard;
