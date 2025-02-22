const s3 = require("../config/awsConfig");
const Listing = require("../models/Listing");
const fs = require("fs");

exports.addListing = async (req, res) => {
  try {
    const landlordId = req.user?.id;

    if (!landlordId) {
      return res.status(401).json({ message: "Unauthorized: No landlord ID found" });
    }

    // Safely parse numeric values
    const parseNumber = (value) => {
      if (value === undefined || value === '') return 0;
      const num = Number(value);
      return isNaN(num) ? 0 : num;
    };

    const newListing = new Listing({
      landlordId,
      propertyName: req.body.propertyName,
      propertyType: req.body.propertyType,
      builtYear: parseNumber(req.body.builtYear),
      size: parseNumber(req.body.size),
      bedrooms: parseNumber(req.body.bedrooms),
      bathrooms: parseNumber(req.body.bathrooms),
      garage: parseNumber(req.body.garage),
      monthlyRent: parseNumber(req.body.monthlyRent),
      description: req.body.description || '',
    });

    // Handle image upload if files exist
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) => {
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
      newListing.images = uploadResults.map((result) => result.Location);
    }

    await newListing.save();
    res.status(201).json({ message: "Listing added successfully", listing: newListing });
  } catch (error) {
    console.error("Error adding listing:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
