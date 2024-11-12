import React, { useState } from "react";
import CustomButton from "./CustomBtn";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    inquiryType: "",
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      {/* Internal CSS for option hover */}
      <style>
        {`
          select option:hover {
            background-color: #bfbfbf;
          }
        `}
      </style>
      
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Feel free to reach us anytime!
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Inquiry Type <span className="text-red-500">*</span>
            </label>
            <select
              name="inquiryType"
              value={formData.inquiryType}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none"
              style={{
                borderColor: "#006845",
              }}
            >
              <option value="" disabled>
                Select Inquiry Type
              </option>
              <option value="renting">Renting Property</option>
              <option value="buying">Buying Property</option>
              <option value="selling">Selling Property</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none"
              style={{
                borderColor: "#006845",
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="example@domain.com"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none"
              style={{
                borderColor: "#006845",
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone (Optional)
            </label>
           <PhoneInput
           country={'lk'}
           inputStyle={{
            width:'100%',
            padding: '0.5rem',
            borderRadius: '0.375rem',
            borderColor: '#006845',
            outline: 'none',
           }}
           onFocus={(e)=>(e.target.style.borderColor = '#006845')}
           onBlur={(e)=>(e.target.style.borderColor = '#006845')}
           />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Please Enter Your Message"
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none"
              style={{
                borderColor: "#006845",
              }}
            ></textarea>
          </div>

          <div className="text-center">
           <Btn
           btnName="Submit"
           btnType="Submit"
           color="#006845"
           hoverColor="#15803d"
           textColor="White"
           hoverTextColor="white"
           >
           </Btn>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
