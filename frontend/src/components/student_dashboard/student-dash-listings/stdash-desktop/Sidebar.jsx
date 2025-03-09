import React from "react";

const messages = [
  { id: 1, name: "James Benny", text: "Hey, let me know if you're still available...", image: "src/assets/HouseOwnerDashboard-img/janko-ferlic-G-jo31ESuRE-unsplash 2.png" },
  { id: 2, name: "William Chyntia", text: "Okay thanks!", image: "src/assets/HouseOwnerDashboard-img/studio-portrait-emotional-happy-funny-smiling-boyfriend-man-with-heavy-beard-stands-with-arms-crossed-dressed-red-t-shirt-isolated-blue 1 (8).png" },
  { id: 3, name: "Henry David", text: "Alright! I'll get back to you ASAP.", image: "src/assets/HouseOwnerDashboard-img/young-bearded-man-with-striped-shirt 1.png" },
  { id: 4, name: "Charlotte Flair", text: "Sounds good buddy.", image: "src/assets/HouseOwnerDashboard-img/cheerful-indian-businessman-smiling-closeup-portrait-jobs-career-campaign 1.png" },
  { id: 5, name: "James Benny", text: "Hey, let me know if you're still available...", image: "src/assets/HouseOwnerDashboard-img/janko-ferlic-G-jo31ESuRE-unsplash 2.png" },
];

const Sidebar = () => {
  return (
    <div className="col-span-4 space-y-6">
      {/* Recent Messages */}
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

      {/* Map View */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-bold mb-4">Map View</h2>
        <div className="h-64 bg-gray-300 flex items-center justify-center rounded">
          <p className="text-gray-700">Interactive Map Coming Soon</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;