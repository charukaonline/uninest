const Listing = require("../models/Listing");
const fs = require("fs");
const s3 = require("../config/awsS3");

exports.addListing = async (req, res) => {
  try {
    // Retrieve landlord info from session (attached by ensureLandlordAuth middleware)
    const landlord = req.user;
    if (!landlord) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Extract data from the form
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
      address,
      city,
      province,
      postalCode,
      nearestUniversity,
      coordinates,
    } = req.body;

    // Parse coordinates if needed (the frontend sends JSON.stringify(coordinates))
    let parsedCoordinates;
    try {
      parsedCoordinates =
        typeof coordinates === "string" ? JSON.parse(coordinates) : coordinates;
    } catch (err) {
      return res.status(400).json({ message: "Invalid coordinates" });
    }

    // Process images from temporary upload folder using multer (files available in req.files)
    const imageFiles = req.files;
    const imageUrls = [];

    for (const file of imageFiles) {
      // Read the file from local storage
      const fileContent = fs.readFileSync(file.path);

      // Set S3 upload parameters
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `listings/${file.filename}`, // This is the key (path) in the bucket
        Body: fileContent,
        ContentType: file.mimetype,
        ACL: "public-read", // Adjust ACL as needed
      };

      // Upload file to S3
      const s3Response = await s3.upload(params).promise();
      imageUrls.push(s3Response.Location);

      // Remove the file from local storage after upload
      fs.unlinkSync(file.path);
    }

    // Create the new listing document with all data and S3 image URLs
    const newListing = new Listing({
      propertyName,
      propertyType,
      builtYear,
      size,
      bedrooms,
      bathrooms,
      garage,
      monthlyRent,
      description,
      address,
      city,
      province,
      postalCode,
      nearestUniversity,
      coordinates: parsedCoordinates,
      images: imageUrls,
      landlord: landlord._id, // Attach the authenticated landlord's ID
    });

    await newListing.save();

    res
      .status(201)
      .json({ message: "Listing added successfully", listing: newListing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
