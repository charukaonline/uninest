const s3 = require("../config/awsConfig");
const Listing = require("../models/Listing");
const User = require("../models/User");
const tempStorage = require("../utils/tempStorage");
const fs = require("fs");

exports.addListing = async (req, res) => {
  let savedImagePaths = [];

  try {
    const landlordId = req.user?.id;

    if (!landlordId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No landlord ID found",
      });
    }

    // Get landlord email
    const landlord = await User.findById(landlordId);
    if (!landlord) {
      return res.status(404).json({
        success: false,
        message: "Landlord not found",
      });
    }

    const parseNumber = (value) => {
      if (value === undefined || value === "") return 0;
      const num = Number(value);
      return isNaN(num) ? 0 : num;
    };

    try {
      // Save files temporarily
      if (req.files && req.files.length > 0) {
        savedImagePaths = await tempStorage.saveImages(req.files);
      }

      // Upload to S3
      const uploadPromises = savedImagePaths.map((file) => {
        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: `listings/${file.name}`,
          Body: fs.createReadStream(file.path),
          ContentType: "image/jpeg",
          ACL: "public-read",
        };
        return s3.upload(params).promise();
      });

      const uploadResults = await Promise.all(uploadPromises);

      // Create new listing
      const newListing = new Listing({
        landlordId,
        landlordEmail: landlord.email,
        propertyName: req.body.propertyName,
        propertyType: req.body.propertyType,
        builtYear: parseNumber(req.body.builtYear),
        size: parseNumber(req.body.size),
        bedrooms: parseNumber(req.body.bedrooms),
        bathrooms: parseNumber(req.body.bathrooms),
        garage: parseNumber(req.body.garage),
        monthlyRent: parseNumber(req.body.monthlyRent),
        description: req.body.description || "",
        address: req.body.address,
        city: req.body.city,
        province: req.body.province,
        postalCode: req.body.postalCode,
        nearestUniversity: req.body.nearestUniversity,
        coordinates: {
          latitude: parseNumber(req.body["coordinates[latitude]"]),
          longitude: parseNumber(req.body["coordinates[longitude]"]),
        },
        images: uploadResults.map((result) => result.Location),
        status: "available",
      });

      await newListing.save();

      // Cleanup temporary files
      await tempStorage.cleanupImages(savedImagePaths.map((file) => file.path));

      res.status(201).json({
        success: true,
        message: "Listing added successfully",
        listing: newListing,
      });
    } catch (uploadError) {
      // Cleanup temporary files in case of error during upload
      if (savedImagePaths.length > 0) {
        await tempStorage.cleanupImages(
          savedImagePaths.map((file) => file.path)
        );
      }
      throw uploadError;
    }
  } catch (error) {
    console.error("Error adding listing:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
