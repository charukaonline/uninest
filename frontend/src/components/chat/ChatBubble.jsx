import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiMessage3Fill, RiCloseLine } from "react-icons/ri";

const ChatBubble = ({
  chatbaseId = "Z2F0sAP8rY6j5qNXtc3kU",
  title = "UniNest Assistant",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);

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

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Chat Bubble Button with Dynamic Icon */}
      <motion.div
        onClick={toggleChat}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 w-16 h-16 bg-primaryBgColor rounded-full flex justify-center items-center text-white cursor-pointer z-50 shadow-xl hover:shadow-primaryBgColor/30 transition-shadow"
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

      {/* Popup Chat Window - Larger Size */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-24 right-6 w-[400px] h-[600px] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col border border-gray-100"
          >
            {/* Enhanced Chat Header */}
            <div className="bg-gradient-to-r from-primaryBgColor to-primaryBgColor/90 px-5 py-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center backdrop-blur-sm">
                  <RiMessage3Fill className="text-2xl" />
                </div>
                {/* <div>
                  <h3 className="font-semibold text-lg">{title}</h3>
                  <p className="text-xs text-white/80">
                    How can we help you today?
                  </p>
                </div> */}
              </div>
              <button
                onClick={toggleChat}
                className="text-white hover:bg-white hover:bg-opacity-30 rounded-full p-2 transition-colors"
              >
                <RiCloseLine className="text-xl" />
              </button>
            </div>

            {/* Chatbot iframe with loading state */}
            <div className="flex-1 border-t border-gray-100 bg-gray-50 relative">
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
