const Listing = require("../models/Listing");
const User = require("../models/User");

// Hold listing by landlord
exports.holdListing = async (req, res) => {
    try {
        const landlord = req.user;
        if (!landlord) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { listingId } = req.params;

        // Find the listing
        const listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({ success: false, message: "Listing not found" });
        }

        // Check if landlord owns the listing
        if (listing.landlord.toString() !== landlord._id.toString()) {
            return res.status(403).json({ success: false, message: "You are not authorized to modify this listing" });
        }

        // Toggle the hold status - using findByIdAndUpdate instead of save to avoid validation
        const updatedListing = await Listing.findByIdAndUpdate(
            listingId,
            { $set: { isHeld: !listing.isHeld } },
            { new: true, runValidators: false }
        );

        return res.status(200).json({
            success: true, 
            message: updatedListing.isHeld ? "Listing has been put on hold" : "Listing is now active",
            isHeld: updatedListing.isHeld
        });
    } catch (error) {
        console.error("Error in holdListing:", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
}

// Delete listing by landlord
exports.deleteListing = async (req, res) => {
    try {
        const landlord = req.user;
        if (!landlord) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { listingId } = req.params;

        // Find the listing
        const listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({ success: false, message: "Listing not found" });
        }

        // Check if landlord owns the listing
        if (listing.landlord.toString() !== landlord._id.toString()) {
            return res.status(403).json({ success: false, message: "You are not authorized to delete this listing" });
        }

        // Delete the listing
        await Listing.findByIdAndDelete(listingId);

        return res.status(200).json({
            success: true,
            message: "Listing has been deleted successfully"
        });
    } catch (error) {
        console.error("Error in deleteListing:", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
}