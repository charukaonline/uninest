const Listing = require("../models/Listing");
const fs = require("fs");
const s3 = require("../config/awsS3");
const { calculateInitialEloRating, calculateClickEloIncrease } = require("../utils/eloCalculator");

exports.addListing = async (req, res) => {
  try {
    const landlord = req.user;
    if (!landlord) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Debug log
    // console.log('Files received:', req.files);
    // console.log('Body received:', req.body);

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
      "university-distance": universityDistance, // Extract university distance
    } = req.body;

    const numericFields = [
      "size",
      "bedrooms",
      "bathrooms",
      "garage",
      "monthlyRent",
      "university-distance",
    ];
    numericFields.forEach((field) => {
      if (req.body[field]) {
        req.body[field] = Number(req.body[field]);
      }
    });

    let parsedCoordinates;
    try {
      parsedCoordinates =
        typeof coordinates === "string" ? JSON.parse(coordinates) : coordinates;
    } catch (err) {
      return res.status(400).json({ message: "Invalid coordinates format" });
    }

    const imageUrls = [];

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images were uploaded" });
    }

    for (const file of req.files) {
      try {
        const fileContent = fs.readFileSync(file.path);

        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: `listings/${Date.now()}-${file.originalname}`,
          Body: fileContent,
          ContentType: file.mimetype,
          ACL: "public-read",
        };

        const s3Response = await s3.upload(params).promise();
        console.log("S3 upload response:", s3Response);
        imageUrls.push(s3Response.Location);

        fs.unlinkSync(file.path);
      } catch (uploadError) {
        console.error("S3 upload error:", uploadError);
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }
    }

    // console.log('Image URLs:', imageUrls);

    // Calculate initial ELO rating using the utility function
    const initialEloRating = calculateInitialEloRating(req.body);

    const newListing = new Listing({
      propertyName,
      propertyType,
      builtYear,
      size: req.body.size,
      bedrooms: req.body.bedrooms,
      bathrooms: req.body.bathrooms,
      garage: req.body.garage,
      monthlyRent: req.body.monthlyRent,
      description,
      address,
      city,
      province,
      postalCode,
      nearestUniversity,
      universityDistance: req.body["university-distance"], // Add university distance
      coordinates: parsedCoordinates,
      images: imageUrls,
      landlord: landlord._id,
      eloRating: initialEloRating,
    });

    await newListing.save();
    // console.log('Saved listing:', newListing);

    res
      .status(201)
      .json({ message: "Listing added successfully", listing: newListing });
  } catch (err) {
    console.error("Error details:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
      details: err.errors,
    });
  }
};

exports.getListings = async (req, res) => {
  try {
    const listings = await Listing.find()
      .populate("landlord", "username email phoneNumber") // Update fields to match your User model
      .populate("nearestUniversity", "name location")
      .sort({ eloRating: -1 })
      .exec();

    res.status(200).json(listings);
  } catch (err) {
    console.error("Error fetching listings:", err);
    res.status(500).json({
      message: "Error fetching listings",
      error: err.message,
    });
  }
};

exports.getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate("landlord", "username email phoneNumber") // Update fields to match your User model
      .populate("nearestUniversity", "name location")
      .exec();

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.status(200).json(listing);
  } catch (err) {
    console.error("Error fetching listing:", err);
    res.status(500).json({
      message: "Error fetching listing",
      error: err.message,
    });
  }
};

exports.trackListingClick = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    listing.eloRating = calculateClickEloIncrease(listing.eloRating, listing);
    
    // Initialize views if it doesn't exist and increment
    if (listing.views === undefined) {
      listing.views = 1;
    } else {
      listing.views += 1;
    }
    
    await listing.save();

    res.status(200).json({
      success: true,
      newRating: listing.eloRating,
      views: listing.views
    });
  } catch (err) {
    res.status(500).json({
      message: "Error tracking click",
      error: err.message,
    });
  }
};

exports.getPopularListings = async (req, res) => {
  try {

    const limit = parseInt(req.query.limit) || 5;
    
    // Find listings with highest eloRating (most popular)
    const popularListings = await Listing.find()
      .populate("landlord", "username email phoneNumber")
      .populate("nearestUniversity", "name location")
      .sort({ eloRating: -1 })
      .limit(limit)
      .exec();

    res.status(200).json(popularListings);
  } catch (err) {
    console.error("Error fetching popular listings:", err);
    res.status(500).json({
      message: "Error fetching popular listings",
      error: err.message,
    });
  }
};
