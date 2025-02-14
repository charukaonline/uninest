const User = require("../models/User");
const LandlordProfile = require("../models/LandlordProfile");

exports.getPendingLandlords = async (req, res) => {
  try {
    const unverifiedLandlords = await User.aggregate([
      {
        $match: {
          role: "landlord",
          $or: [
            { isVerified: { $exists: false } },
            { isVerified: false }
          ]
        }
      },
      {
        $lookup: {
          from: "landlordprofiles", // The name of your LandlordProfile collection
          localField: "_id",
          foreignField: "userId",
          as: "landlordProfile"
        }
      },
      {
        $unwind: "$landlordProfile"
      },
      {
        $project: {
          _id: 1,
          username: 1,
          email: 1,
          phoneNumber: 1,
          userId: "$_id",
          residentialAddress: "$landlordProfile.residentialAddress",
          nationalIdCardNumber: "$landlordProfile.nationalIdCardNumber",
          verificationDocuments: "$landlordProfile.verificationDocuments",
          verificationStatus: "$landlordProfile.verificationStatus"
        }
      }
    ]);

    res.status(200).json({
      success: true,
      landlords: unverifiedLandlords
    });
  } catch (error) {
    console.error("Error fetching unverified landlords:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch unverified landlords"
    });
  }
};

exports.approveLandlord = async (req, res) => {
  try {
    const { userId } = req.params;

    const landlordProfile = await LandlordProfile.findOneAndUpdate(
      { userId: userId },
      { verificationStatus: "verified" },
      { new: true }
    );

    if (!landlordProfile) {
      return res.status(404).json({ message: "Landlord profile not found" });
    }

    await User.findByIdAndUpdate(userId, { isVerified: true });

    res.status(200).json({ message: "Landlord approved successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error approving landlord", error: error.message });
  }
};

exports.rejectLandlord = async (req, res) => {
  try {
    const { userId } = req.params;

    const landlordProfile = await LandlordProfile.findOneAndUpdate(
      { userId: userId },
      { verificationStatus: "rejected" },
      { new: true }
    );

    if (!landlordProfile) {
      return res.status(404).json({ message: "Landlord profile not found" });
    }

    res.status(200).json({ message: "Landlord rejected successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error rejecting landlord", error: error.message });
  }
};
