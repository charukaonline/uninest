import { useEffect } from "react";

const ChatBubble = ({ chatbaseId = "Z2F0sAP8rY6j5qNXtc3kU" }) => {
  useEffect(() => {
    // Initialize Chatbase using their exact script pattern
    (function () {
      if (!window.chatbase || window.chatbase("getState") !== "initialized") {
        window.chatbase = (...args) => {
          if (!window.chatbase.q) {
            window.chatbase.q = [];
          }
          window.chatbase.q.push(args);
        };

        window.chatbase = new Proxy(window.chatbase, {
          get(target, prop) {
            if (prop === "q") {
              return target.q;
            }
            return (...args) => target(prop, ...args);
          },
        });
      }

      const script = document.createElement("script");
      script.src = "https://www.chatbase.co/embed.min.js";
      script.id = chatbaseId;
      script.domain = "www.chatbase.co";
      document.body.appendChild(script);
    })();

    // Cleanup function to remove script when component unmounts
    return () => {
      const existingScript = document.getElementById(chatbaseId);
      if (existingScript) {
        document.body.removeChild(existingScript);
      }

      // Clean up any remaining chat widget elements
      const chatWidgets = document.querySelectorAll(
        ".chatbase-bubble, .chatbase-frame"
      );
      chatWidgets.forEach((widget) => {
        if (widget) {
          widget.remove();
        }
      });

      // Reset the chatbase object
      if (window.chatbase) {
        delete window.chatbase;
      }
    };
  }, [chatbaseId]);

  return null; // This component doesn't render anything visible
};

export default ChatBubble;
