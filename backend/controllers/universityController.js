const University = require("../models/University");

exports.addUniversity = async (req, res) => {
  try {
    const { name, latitude, longitude } = req.body;

    // Check if university already exists
    const existingUniversity = await University.findOne({ name });
    if (existingUniversity) {
      return res.status(400).json({
        success: false,
        message: "University with this name already exists",
      });
    }

    // Create new university
    const university = new University({
      name,
      location: {
        type: "Point",
        coordinates: [longitude, latitude], // GeoJSON format expects [longitude, latitude]
      },
    });

    await university.save();

    res.status(201).json({
      success: true,
      message: "University added successfully",
      data: university,
    });
  } catch (error) {
    console.error("Error in addUniversity:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add university",
      error: error.message,
    });
  }
};

exports.getAllUniversities = async (req, res) => {
  try {
    const universities = await University.find({})
      .select("name location")
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: universities,
    });
  } catch (error) {
    console.error("Error in getAllUniversities:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch universities",
      error: error.message,
    });
  }
};
