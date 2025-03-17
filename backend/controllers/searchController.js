const University = require("../models/University");
const Listing = require("../models/Listing");

exports.searchByUniversity = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: "Search query is required",
            });
        }

        // First find universities matching the query - be more flexible with regex
        const universities = await University.find({
            name: { $regex: query, $options: "i" }
        }).limit(1); // Only need the first match for efficiency

        if (universities.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No universities found matching your search",
                data: {
                    university: null,
                    listings: [],
                },
            });
        }

        // Use the first matching university
        const university = universities[0];

        // Find listings where nearestUniversity matches the university's _id
        // Ensure we're populating the correct field and checking for ObjectId equality
        const listings = await Listing.find()
            .populate("landlord", "username email phoneNumber")
            .populate("nearestUniversity", "name location")
            .exec();

        // Filter listings to only include those where nearestUniversity === university._id
        const filteredListings = listings.filter(listing => 
            listing.nearestUniversity && 
            listing.nearestUniversity._id && 
            listing.nearestUniversity._id.toString() === university._id.toString()
        );

        // More informative console logging for debugging
        console.log(`Found ${filteredListings.length} listings for university: ${university.name} (ID: ${university._id})`);

        res.status(200).json({
            success: true,
            data: {
                university,
                listings: filteredListings,
            },
        });
    } catch (error) {
        console.error("Error in searchByUniversity:", error);
        res.status(500).json({
            success: false,
            message: "Error searching by university",
            error: error.message,
        });
    }
};

exports.searchByLocation = async (req, res) => {
    try {
        const { lat, lng, radius = 5 } = req.query; // radius in kilometers, default 5km

        if (!lat || !lng) {
            return res.status(400).json({
                success: false,
                message: "Latitude and longitude are required",
            });
        }

        // Find all listings within the given radius
        // This is a simplified approach - for a more accurate geo search 
        // you would use MongoDB's geospatial queries with $geoNear

        // For now, let's get all listings and filter them by calculating distance
        const allListings = await Listing.find()
            .populate("landlord", "username email phoneNumber")
            .populate("nearestUniversity", "name location");

        // Filter listings by calculating the distance
        const nearbyListings = allListings.filter(listing => {
            const distance = calculateDistance(
                parseFloat(lat),
                parseFloat(lng),
                listing.coordinates.latitude,
                listing.coordinates.longitude
            );
            return distance <= parseFloat(radius);
        });

        res.status(200).json({
            success: true,
            data: nearbyListings,
        });
    } catch (error) {
        console.error("Error in searchByLocation:", error);
        res.status(500).json({
            success: false,
            message: "Error searching by location",
            error: error.message,
        });
    }
};

// Add a new method to get all listings (replacing the need for the listing controller's getListings)
exports.getAllListings = async (req, res) => {
    try {
        const listings = await Listing.find()
            .populate("landlord", "username email phoneNumber")
            .populate("nearestUniversity", "name location")
            .sort({ eloRating: -1 })
            .exec();

        res.status(200).json({
            success: true,
            data: listings
        });
    } catch (error) {
        console.error("Error fetching all listings:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching all listings",
            error: error.message,
        });
    }
};

// Helper function to calculate distance between two points using the Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
}
