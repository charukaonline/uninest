const Listing = require("../models/Listing");
const User = require("../models/User"); // Add User model import
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
      genderPreference, // Process the new field
    } = req.body;

    // Validate gender preference
    if (!genderPreference || !['boys', 'girls', 'mixed'].includes(genderPreference)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid gender preference. Must be one of: boys, girls, mixed'
      });
    }

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
      genderPreference, // Add gender preference
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
      .populate({
        path: "landlord",
        select: "username email phoneNumber isFlagged",
        match: { isFlagged: { $ne: true } } // Only include listings where landlord is not flagged
      })
      .populate("nearestUniversity", "name location")
      .sort({ eloRating: -1 })
      .exec();

    // Filter out listings where landlord is null (due to the match condition)
    const filteredListings = listings.filter(listing => listing.landlord);

    res.status(200).json(filteredListings);
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
      .populate({
        path: "landlord",
        select: "username email phoneNumber isFlagged",
      })
      .populate("nearestUniversity", "name location")
      .exec();

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // If landlord is flagged, don't show the listing
    if (listing.landlord && listing.landlord.isFlagged) {
      return res.status(403).json({
        message: "This listing is currently unavailable"
      });
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

    const popularListings = await Listing.find()
      .populate({
        path: "landlord",
        select: "username email phoneNumber isFlagged",
        match: { isFlagged: { $ne: true } }
      })
      .populate("nearestUniversity", "name location")
      .sort({ eloRating: -1 })
      .limit(limit * 2)
      .exec();

    const filteredListings = popularListings.filter(listing => listing.landlord);

    const limitedListings = filteredListings.slice(0, limit);

    res.status(200).json(limitedListings);
  } catch (err) {
    console.error("Error fetching popular listings:", err);
    res.status(500).json({
      message: "Error fetching popular listings",
      error: err.message,
    });
  }
};

exports.getLandlordListings = async (req, res) => {
  try {
    const { landlordId } = req.params;

    if (!landlordId) {
      return res.status(400).json({
        message: "Landlord ID is required"
      });
    }

    // Check if landlord is flagged
    const landlord = await User.findById(landlordId);
    if (!landlord) {
      return res.status(404).json({
        message: "Landlord not found"
      });
    }

    const isAdminOrOwner = req.user &&
      (req.user.role === 'admin' ||
        req.user._id.toString() === landlordId);

    if (!isAdminOrOwner && landlord.isFlagged) {
      return res.status(200).json([]);
    }

    const query = { landlord: landlordId };
    const limit = parseInt(req.query.limit) || 0;

    let listingsQuery = Listing.find(query)
      .populate("landlord", "username email phoneNumber isFlagged") // Add isFlagged to the populated fields
      .populate("nearestUniversity", "name location")
      .sort({ createdAt: -1 });

    if (limit > 0) {
      listingsQuery = listingsQuery.limit(limit);
    }

    const listings = await listingsQuery.exec();

    res.status(200).json(listings);
  } catch (err) {
    console.error("Error fetching landlord listings:", err);
    res.status(500).json({
      message: "Error fetching landlord listings",
      error: err.message,
    });
  }
};

exports.updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate gender preference if it's being updated
    if (updates.genderPreference && !['boys', 'girls', 'mixed'].includes(updates.genderPreference)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid gender preference. Must be one of: boys, girls, mixed'
      });
    }

    // Find the listing by ID and update it
    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Check if user is authorized to update this listing
    if (req.user.role !== 'admin' && listing.landlord.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this listing'
      });
    }

    // Apply updates to the listing
    Object.keys(updates).forEach(key => {
      if (key !== 'landlord' && key !== '_id') { // Prevent changing landlord or _id
        listing[key] = updates[key];
      }
    });

    await listing.save();

    res.status(200).json({
      success: true,
      message: 'Listing updated successfully',
      listing
    });
  } catch (error) {
    console.error('Error updating listing:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update listing',
      error: error.message
    });
  }
};
