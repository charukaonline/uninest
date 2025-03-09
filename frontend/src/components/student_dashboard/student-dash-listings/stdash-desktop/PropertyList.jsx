const houseImage = "/UserDashboardimg/Image.png";
const houseImage1 = "/assets/HouseOwnerDashboard-img/Image (1).png";
const houseImage2 = "/assets/HouseOwnerDashboard-img/Image (2).png";
const houseImage3 = "/assets/HouseOwnerDashboard-img/Image (3).png";
const houseImage4 = "/assets/HouseOwnerDashboard-img/Image (4).png";

const properties = [
  { name: "Meadow View", price: "$960.99", location: "Fremont, CA", image: houseImage },
  { name: "Greencares", price: "$999.89", location: "Golden, CO", image: houseImage1 },
  { name: "White Cottage", price: "$2989.99", location: "Arvada, CO", image: houseImage2 },
  { name: "The Stables", price: "$940.99", location: "Golden, CO", image: houseImage3 },
  { name: "The Old Rectory", price: "$998.99", location: "Arvada, CO", image: houseImage4 },
  { name: "Holly Cottage", price: "$2989.99", location: "Annapolis, MD", image: houseImage },
];



const PropertyList = () => {
  return (
      <motion.div
          className="col-span-8 h-[500px] overflow-y-scroll"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <motion.div
            className="grid grid-cols-3 gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
            }}
        >
          {properties.map((listing, index) => (
              <motion.div
                  key={index}
                  className="bg-white rounded-lg shadow p-4 cursor-pointer"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                  }}
                  whileHover={{ scale: 1.0, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
                  whileTap={{ scale: 0.95 }}
              >
                <motion.img
                    src={listing.image}
                    alt={`Image of ${listing.name}`}
                    className="rounded mb-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                />
                <h2 className="text-lg font-semibold text-[#44403C]">{listing.name}</h2>
                <p className="text-[#57534E]">{listing.location}</p>
                <p className="text-[#2D2926] font-bold">{listing.price}</p>
              </motion.div>
          ))}
        </motion.div>
      </motion.div>
  );
};

export default PropertyList;
