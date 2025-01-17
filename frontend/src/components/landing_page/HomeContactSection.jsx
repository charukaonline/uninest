import React, { useState } from "react";
import { notification } from "antd";
import "antd/dist/reset.css";

export default function HomeContactSection() {
  const [formData, setFormData] = useState({
    inquiryType: "",
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const validate = () => {
    // Check for empty fields
    const isEmpty = !formData.inquiryType ||
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim();

    if (isEmpty) {
      notification.error({
        message: "Validation Error",
        description: "Please fill in all required fields.",
        duration: 3,
      });
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      notification.error({
        message: "Validation Error",
        description: "Please enter a valid email address.",
        duration: 3,
      });
      return false;
    }

    if (formData.phone && !/^\+?\d{1,4}?[-.\s]?\(?(?:\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9})$/.test(formData.phone)) {
      notification.error({
        message: "Validation Error",
        description: "Please enter a valid phone number.",
        duration: 3,
      });
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      notification.success({
        message: "Form Submitted",
        description: "Your form has been submitted successfully.",
        duration: 3,
      });

      // Reset form after submission
      setFormData({
        inquiryType: "",
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    }

    console.log("Form Submitted: ", formData);
  };

  return (
    <div
      className="max-w-screen-xl mx-auto bg-white p-16 flex flex-col lg:flex-row gap-40 w-auto text-center lg:text-left bg-cover bg-center"
      style={{ backgroundImage: "url('/landingContactImage.png')" }}
    >
      <div className="space-y-4 text-center md:text-left text-white md:w-1/2">
        <h2 className="text-4xl font-bold leading-tight">
          Why Our Service Is The Perfect Choice?
        </h2>
        <p className="text-lg text-gray-200">
          We offer exceptional solutions tailored to your needs, combining expertise, innovation,
          and unmatched customer support to deliver the best experience possible.
          Choose us for reliability, quality, and results that exceed expectations!
        </p>
      </div>
      <div className="w-full md:w-1/2 lg:w-2/5 mt-8 md:mt-0">
        <div
          className="p-5 rounded-lg shadow-lg"
          style={{ backgroundColor: "rgba(238, 238, 238, 0.6)" }}
        >
          <h1 className="font-semibold text-xl mb-4 text-gray-700">
            Feel free to reach us anytime!
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Inquiry Type <span className="text-red-500">*</span>
              </label>
              <select
                name="inquiryType"
                value={formData.inquiryType}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                style={{ borderColor: "#006845" }}
              >
                <option value="" disabled>
                  Select Inquiry Type
                </option>
                <option value="renting">Renting Property</option>
                <option value="listing">Listing Property</option>
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
                placeholder="John Doe"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                style={{ borderColor: "#006845" }}
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
                placeholder="example@domain.com"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                style={{ borderColor: "#006845" }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone (Optional)
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+94 77 123 4567"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                style={{ borderColor: "#006845" }}
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
                placeholder="Please Enter Your Message"
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                style={{ borderColor: "#006845" }}
              ></textarea>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="bg-primaryBgColor text-white px-6 py-2 rounded-lg focus:outline-none w-full hover:bg-green-700"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
