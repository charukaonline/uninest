const s3 = require("../config/awsConfig");
const Listing = require("../models/Listing");
const fs = require("fs");

exports.addListing = async (req, res) => {
  try {
    const landlordId = req.user?.id;

    if (!landlordId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No landlord ID found" });
    }

    const {
      propertyName,
      propertyType,
      builtYear,
      size,
      bedrooms,
      bathrooms,
      garage,
      monthlyRent,
      description,
    } = req.body;
    const files = req.files;

    // Upload images to S3
    const uploadPromises = files.map((file) => {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `listings/${Date.now()}_${file.originalname}`,
        Body: fs.createReadStream(file.path),
        ContentType: file.mimetype,
        ACL: "public-read",
      };

      return s3.upload(params).promise();
    });

    const uploadResults = await Promise.all(uploadPromises);
    const imageUrls = uploadResults.map((result) => result.Location);

    // Save listing in MongoDB
    const newListing = new Listing({
      landlordId,
      propertyName,
      propertyType,
      builtYear,
      size,
      bedrooms,
      bathrooms,
      garage,
      monthlyRent,
      description,
      images: imageUrls,
    });

    await newListing.save();
    res
      .status(201)
      .json({ message: "Listing added successfully", listing: newListing });
  } catch (error) {
    console.error("Error adding listing:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
