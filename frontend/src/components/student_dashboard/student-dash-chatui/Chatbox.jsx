import React, { useState, useEffect } from "react";
import { List, Avatar, Button, Input, Dropdown, Menu, Card } from "antd";
import { SendOutlined, MoreOutlined, LeftOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import JamesImage from "../profileimg/james.jpg";
import WilliamImage from "../profileimg/william.jpg";
import HenryImage from "../profileimg/henry.jpg";
import CharlotteImage from "../profileimg/charlotte.jpg";

const contactsData = [
  { name: "James Benny", image: JamesImage },
  { name: "William Chynita", image: WilliamImage },
  { name: "Henry David", image: HenryImage },
  { name: "Charlotte Flair", image: CharlotteImage },
];

const Inbox = () => {
  const [messages, setMessages] = useState({});
  const [input, setInput] = useState("");
  const [activeContact, setActiveContact] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sendMessage = () => {
    if (input.trim() !== "") {
      const newMessage = {
        text: input,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => ({
        ...prev,
        [activeContact.name]: [...(prev[activeContact.name] || []), newMessage],
      }));
      setInput("");
    }
  };

  const markAsRead = (contactName) => {
    setMessages((prev) => ({ ...prev, [contactName]: [] }));
  };

  const sortedContacts = [...contactsData].sort((a, b) => {
    const lastMessageA = messages[a.name]?.[messages[a.name]?.length - 1];
    const lastMessageB = messages[b.name]?.[messages[b.name]?.length - 1];
    if (lastMessageA && lastMessageB) {
      return new Date(`1970-01-01T${lastMessageB.time}:00`) - new Date(`1970-01-01T${lastMessageA.time}:00`);
    }
    if (!lastMessageA) return 1;
    if (!lastMessageB) return -1;
    return 0;
  });

  return (
      <div className="flex h-screen bg-gray-100">
        {/* Contacts List */}
        {(!isMobile || (isMobile && !activeContact)) && (
            <motion.div
                className="flex flex-col w-full md:w-1/3 bg-white p-6 border-r shadow-lg"
                initial={{ opacity: 0, x: -200 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-semibold text-green-700 mb-4">All Messages</h2>
              <List
                  itemLayout="horizontal"
                  dataSource={sortedContacts}
                  renderItem={(contact) => (
                      <motion.div
                          key={contact.name}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                              activeContact?.name === contact.name ? "bg-green-100" : "hover:bg-green-50"
                          }`}
                          onClick={() => setActiveContact(contact)}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                      >
                        <List.Item>
                          <List.Item.Meta
                              avatar={<Avatar src={contact.image} size={50} />}
                              title={<span className="font-medium">{contact.name}</span>}
                              description={
                                messages[contact.name] && messages[contact.name].length > 0
                                    ? messages[contact.name][messages[contact.name].length - 1].text
                                    : "No messages yet"
                              }
                          />
                          <Dropdown
                              overlay={
                                <Menu>
                                  <Menu.Item onClick={() => markAsRead(contact.name)}>
                                    Mark as Read
                                  </Menu.Item>
                                </Menu>
                              }
                              trigger={["click"]}
                          >
                            <Button type="text" icon={<MoreOutlined className="text-gray-500" />} onClick={(e) => e.stopPropagation()} />
                          </Dropdown>
                        </List.Item>
                      </motion.div>
                  )}
              />
            </motion.div>
        )}

        {/* Chat Section */}
        {activeContact && (
            <motion.div
                className="flex flex-col w-full md:w-2/3 p-6 bg-green-50 shadow-lg rounded-xl"
                initial={{ opacity: 0, x: 200 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
              {/* Chat Header */}
              <Card bordered={false} className="mb-4 shadow-sm">
                <div className="flex items-center">
                  {isMobile && (
                      <Button
                          type="text"
                          icon={<LeftOutlined className="text-gray-600" />}
                          onClick={() => setActiveContact(null)}
                          className="mr-3"
                      />
                  )}
                  <Avatar src={activeContact.image} size={55} className="mr-3" />
                  <h2 className="text-lg font-bold text-green-700">{activeContact.name}</h2>
                </div>
              </Card>

              {/* Chat Messages */}
              <div className="flex flex-col flex-1 overflow-auto p-4 space-y-4">
                {(messages[activeContact.name] || []).map((msg, index) => (
                    <motion.div
                        key={index}
                        className="p-3 bg-green-600 text-white rounded-lg w-fit self-end shadow"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                      <p>{msg.text}</p>
                      <span className="text-xs text-gray-200 ml-2">{msg.time}</span>
                    </motion.div>
                ))}
              </div>

              {/* Message Input */}
              <div className="flex items-center p-4 bg-white rounded-lg shadow mt-4">
                <Input
                    placeholder="Type a message"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onPressEnter={sendMessage}
                    className="flex-grow border-0 focus:ring-0"
                />
                <Button
                    type="primary"
                    shape="circle"
                    icon={<SendOutlined />}
                    onClick={sendMessage}
                    className="bg-green-600 border-green-600 hover:bg-green-500"
                />
              </div>
            </motion.div>
        )}
      </div>
  );
};

export default Inbox;
