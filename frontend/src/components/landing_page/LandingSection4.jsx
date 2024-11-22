// eslint-disable-next-line no-unused-vars
import React from "react";
import { Divider } from "antd";
import ContactForm from "./HomeContactSection";

const LeftParagraph = () => {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between md:space-x-8 p-8 max-w-6xl mx-auto">
      <div className="space-y-4 text-center md:text-left text-white md:w-1/2">
        <h2 className="text-4xl font-bold leading-tight">
          Why Our Service Is The Perfect Choice?
        </h2>
        <Divider className="border-t-2 border-white w-1/4 md:w-1/4 mx-auto md:mx-0" />
        <p className="text-lg text-gray-200">
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod.
        </p>
      </div>
      <div className="w-full md:w-1/2 lg:w-2/5 mt-8 md:mt-0">
        <ContactForm />
      </div>
    </div>
  );
};

export default LeftParagraph;
