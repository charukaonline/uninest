import React from "react";
import { motion } from "framer-motion";
import profilePic from "../../../../public/ProfilePic/profilePic.avif";

const InputField = ({ type, placeholder }) => (
    <input
        type={type}
        placeholder={placeholder}
        className="w-full p-2 border border-gray-300 rounded-md text-black bg-gray-100 placeholder-gray-500 placeholder:font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
    />
);

const ProfileSettings = () => {
  return (
      <motion.div
          className="max-w-4xl mx-auto p-4 sm:p-6 bg-green-50 shadow-lg rounded-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Profile Settings
        </h2>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
          <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
          >
            <InputField type="text" placeholder="Name" />
            <InputField type="email" placeholder="Email address" />
            <InputField type="text" placeholder="Phone number" />
            <InputField type="text" placeholder="University" />
            <motion.button
                className="w-full md:w-1/2 mt-4 bg-green-800 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
              Update
            </motion.button>
          </motion.div>

          <motion.div
              className="flex flex-col items-center space-y-4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
          >
            <img
                src={profilePic}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover shadow-md"
            />
            <motion.button
                className="w-full md:w-auto bg-green-800 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
              Update Profile Picture
            </motion.button>
          </motion.div>
        </section>

        <hr className="my-8 border-gray-300" />

        
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Change Password
            </h3>
            <div className="space-y-4">
              <InputField type="password" placeholder="Current password" />
              <InputField type="password" placeholder="New password" />
              <InputField type="password" placeholder="Confirm new password" />
              <motion.button
                  className="w-full md:w-1/2 mt-4 bg-green-800 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
              >
                Update Password
              </motion.button>
            </div>
          </motion.div>

          <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Delete or Deactivate Account
            </h3>
            <div className="space-y-4">
              <motion.button
                  className="w-full md:w-1/2 bg-green-800 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
              >
                Temporary Deactivate
              </motion.button>
              <textarea
                  placeholder="Why are you leaving?"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                  rows="4"
              ></textarea>
              <motion.button
                  className="w-full md:w-1/2 bg-red-700 text-white py-2 rounded-md hover:bg-red-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
              >
                Delete Account Data
              </motion.button>
            </div>
          </motion.div>
        </section>
      </motion.div>
  );
};

export default ProfileSettings;
