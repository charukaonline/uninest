const Listing = require("../models/Listing");
const fs = require("fs");
const s3 = require("../config/awsS3");

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
    } = req.body;

    const numericFields = ['size', 'bedrooms', 'bathrooms', 'garage', 'monthlyRent'];
    numericFields.forEach(field => {
      if (req.body[field]) {
        req.body[field] = Number(req.body[field]);
      }
    });

    let parsedCoordinates;
    try {
      parsedCoordinates =
        typeof coordinates === "string" ? JSON.parse(coordinates) : coordinates;
    } catch (err) {
      return res.status(400).json({ message: "Invalid coordinates" });
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
        console.log('S3 upload response:', s3Response);
        imageUrls.push(s3Response.Location);

        fs.unlinkSync(file.path);
      } catch (uploadError) {
        console.error('S3 upload error:', uploadError);
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }
    }

    // console.log('Image URLs:', imageUrls);

    const newListing = new Listing({
      ...req.body,
      coordinates: typeof req.body.coordinates === 'string' 
        ? JSON.parse(req.body.coordinates) 
        : req.body.coordinates,
      images: imageUrls,
      landlord: req.user._id,
    });

    await newListing.save();
    // console.log('Saved listing:', newListing);

    res
      .status(201)
      .json({ message: "Listing added successfully", listing: newListing });
  } catch (err) {
    console.error('Error details:', err);
    res.status(500).json({ 
      message: "Server error", 
      error: err.message,
      details: err.errors
    });
  }
};

exports.getListings = async (req, res) => {
  try {
    const listings = await Listing.find()
      .populate('landlord', 'firstName lastName email phoneNumber')
      .exec();

    res.status(200).json(listings);
  } catch (err) {
    console.error('Error fetching listings:', err);
    res.status(500).json({ 
      message: "Error fetching listings", 
      error: err.message 
    });
  }
};

exports.getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('landlord', 'firstName lastName email phoneNumber')
      .exec();

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.status(200).json(listing);
  } catch (err) {
    console.error('Error fetching listing:', err);
    res.status(500).json({ 
      message: "Error fetching listing", 
      error: err.message 
    });
  }
};