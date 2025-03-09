import React, { useState } from "react";
import { Drawer, Button } from "antd";
import { MessageOutlined } from "@ant-design/icons";

const messages = [
  {
    id: 1,
    name: "James Benny",
    text: "Hey, let me know if you're still available...",
    image: "src/assets/HouseOwnerDashboard-img/janko-ferlic-G-jo31ESuRE-unsplash 2.png",
  },
  {
    id: 2,
    name: "William Chyntia",
    text: "Okay thanks!",
    image: "src/assets/HouseOwnerDashboard-img/studio-portrait-emotional-happy-funny-smiling-boyfriend-man-with-heavy-beard-stands-with-arms-crossed-dressed-red-t-shirt-isolated-blue 1 (8).png",
  },
  {
    id: 3,
    name: "Henry David",
    text: "Alright! I'll get back to you ASAP.",
    image: "src/assets/HouseOwnerDashboard-img/young-bearded-man-with-striped-shirt 1.png",
  },
  {
    id: 4,
    name: "Charlotte Flair",
    text: "Sounds good buddy.",
    image: "src/assets/HouseOwnerDashboard-img/cheerful-indian-businessman-smiling-closeup-portrait-jobs-career-campaign 1.png",
  },
  {
    id: 5,
    name: "James Benny",
    text: "Hey, let me know if you're still available...",
    image: "src/assets/HouseOwnerDashboard-img/janko-ferlic-G-jo31ESuRE-unsplash 2.png",
  },
];

const Sidebar = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);

  return (
    <div className="relative">
      {/* Button to open the drawer (on the right side) */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          icon={<MessageOutlined />}
          onClick={() => setDrawerVisible(true)}
          className="bg-green-500 text-white hover:bg-green-600"
        >
          Messages
        </Button>
      </div>

      {/* Drawer from the right side */}
      <Drawer
        title="Messages"
        placement="right"
        closable
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        {/* Recent Messages Section */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-bold mb-4">Recent Messages</h2>
          <div className="max-h-64 overflow-y-scroll">
            <ul>
              {messages.map((msg) => (
                <li key={msg.id} className="mb-4 flex items-center space-x-4">
                  <img
                    src={msg.image}
                    alt={msg.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{msg.name}</p>
                    <p className="text-gray-600 text-sm">{msg.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default Sidebar;
