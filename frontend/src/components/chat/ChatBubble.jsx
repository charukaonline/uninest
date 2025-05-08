import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiMessage3Fill, RiCloseLine } from "react-icons/ri";

const ChatBubble = ({
  chatbaseId = "Z2F0sAP8rY6j5qNXtc3kU",
  title = "Meet Our AI Companion",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const chatRef = useRef(null);
  const bubbleRef = useRef(null);

  // Simulate new message notification
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setHasNewMessage(true);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setHasNewMessage(false);
    }
  }, [isOpen]);

  // Handle outside clicks to close the chat
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Make sure we're not clicking on the bubble itself
      if (
        chatRef.current &&
        !chatRef.current.contains(event.target) &&
        bubbleRef.current &&
        !bubbleRef.current.contains(event.target) &&
        isOpen
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Show tooltip message after 5 seconds
  useEffect(() => {
    const tooltipTimer = setTimeout(() => {
      if (!isOpen) {
        setShowTooltip(true);
        // Hide tooltip after 10 seconds
        const hideTimer = setTimeout(() => {
          setShowTooltip(false);
        }, 10000);
        return () => clearTimeout(hideTimer);
      }
    }, 5000);

    return () => clearTimeout(tooltipTimer);
  }, []);

  // Hide tooltip when chat is opened
  useEffect(() => {
    if (isOpen) {
      setShowTooltip(false);
    }
  }, [isOpen]);

  // Simplified toggle function
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chat Bubble Button with Dynamic Icon */}
      <motion.div
        ref={bubbleRef}
        onClick={toggleChat}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-4 sm:bottom-6 md:bottom-8 lg:bottom-10 right-4 sm:right-6 md:right-8 lg:right-10 w-12 sm:w-14 md:w-16 lg:w-16 h-12 sm:h-14 md:h-16 lg:h-16 bg-primaryBgColor rounded-full flex justify-center items-center text-white cursor-pointer z-50 shadow-xl hover:shadow-primaryBgColor/30 transition-shadow"
      >
        {hasNewMessage && !isOpen && (
          <motion.span
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full animate-pulse border-2 border-white"
          ></motion.span>
        )}
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close-icon"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <RiCloseLine className="text-2xl" />
            </motion.div>
          ) : (
            <motion.div
              key="message-icon"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <RiMessage3Fill className="text-2xl" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Tooltip Message */}
      <AnimatePresence>
        {showTooltip && !isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 sm:bottom-24 md:bottom-28 right-4 sm:right-6 md:right-8 lg:right-10 
                     bg-white px-4 py-3 rounded-xl shadow-lg z-40 max-w-[220px]"
          >
            <div className="text-gray-700 text-sm font-medium">
              UniNest AI here.. Need assistance?
            </div>
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white transform rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popup Chat Window - Enhanced Responsive Size */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatRef}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              bottom: "max(4rem, 10vh)",
              right: "max(1rem, 5vw)",
              width: "clamp(320px, 90vw, 500px)",
              height: "clamp(500px, 80vh, 800px)",
            }}
            className="fixed bg-white rounded-2xl shadow-2xl z-50 overflow-hidden 
                     flex flex-col border border-gray-100"
          >
            {/* Green Header with Close Button */}
            <div className="bg-green-800 px-4 py-3 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white bg-opacity-20 flex items-center justify-center backdrop-blur-sm">
                  <RiMessage3Fill className="text-lg" />
                </div>
                <h3 className="font-semibold text-base">{title}</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white hover:bg-opacity-30 rounded-full p-1.5 transition-colors"
              >
                <RiCloseLine className="text-lg" />
              </button>
            </div>

            {/* Chatbot iframe with loading state */}
            <div className="flex-1 bg-gray-50 relative">
              <iframe
                src={`https://www.chatbase.co/chatbot-iframe/${chatbaseId}`}
                title="Chatbot"
                className="w-full h-full border-none"
                style={{ minHeight: "300px", display: "block" }}
                loading="eager"
              />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-white/5 rounded-b-2xl"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBubble;
