import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiMessage3Fill, RiCloseLine } from "react-icons/ri";

const ChatBubble = ({
  chatbaseId = "Z2F0sAP8rY6j5qNXtc3kU",
  title = "Meet Our AI Companion",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const chatRef = useRef(null);
  const bubbleRef = useRef(null);

  // Simulate new message notification (for demo purposes)
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setHasNewMessage(true);
      }, 10000);
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
        className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 w-14 sm:w-16 h-14 sm:h-16 bg-primaryBgColor rounded-full flex justify-center items-center text-white cursor-pointer z-50 shadow-xl hover:shadow-primaryBgColor/30 transition-shadow"
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

      {/* Popup Chat Window - Responsive Size */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatRef}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-4 sm:bottom-24 right-2 sm:right-6 w-[95vw] sm:w-[450px] md:w-[500px] h-[70vh] sm:h-[600px] md:h-[650px] max-w-[550px] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col border border-gray-100"
          >
            {/* Green Header with Close Button */}
            <div className="bg-green-800 px-5 py-3 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center backdrop-blur-sm">
                  <RiMessage3Fill className="text-xl" />
                </div>
                <h3 className="font-semibold text-lg">{title}</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white hover:bg-opacity-30 rounded-full p-2 transition-colors"
              >
                <RiCloseLine className="text-xl" />
              </button>
            </div>
            
            {/* Chatbot iframe with loading state */}
            <div className="flex-1 bg-gray-50 relative">
              <iframe
                src={`https://www.chatbase.co/chatbot-iframe/${chatbaseId}`}
                title="Chatbot"
                className="w-full h-full border-none"
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
