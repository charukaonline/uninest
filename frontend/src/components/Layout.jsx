// eslint-disable-next-line no-unused-vars
import React from "react";
import PropTypes from "prop-types";
import Header from "./include/Header";
import Footer from "./include/Footer";
import ChatBubble from "@/components/chat/ChatBubble";

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <ChatBubble chatbaseId="Z2F0sAP8rY6j5qNXtc3kU" />
      <Footer />
    </div>
  );
};
Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
