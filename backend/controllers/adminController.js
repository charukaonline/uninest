const User = require("../models/User");
const LandlordProfile = require("../models/LandlordProfile");

exports.getPendingLandlords = async (req, res) => {
  try {
    const pendingLandlords = await LandlordProfile.find({
      verificationStatus: "pending",
    }).populate("userId", "fullName email");

    res.status(200).json(pendingLandlords);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching pending landlords",
        error: error.message,
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
