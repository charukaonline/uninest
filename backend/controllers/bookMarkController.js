const BookMark = require("../models/BookMark");

exports.addBookMark = async (req, res) => {
    try {
        const { listingId, userId } = req.body;

        // Validate request body
        if (!listingId || !userId) {
            return res.status(400).json({ message: "listingId and userId are required." });
        }

        // Check for duplicate bookmark
        const existingBookMark = await BookMark.findOne({ listingId, userId });
        if (existingBookMark) {
            return res.status(409).json({ message: "Bookmark already exists." });
        }

        // Create and save the bookmark
        const newBookMark = new BookMark({ listingId, userId });
        await newBookMark.save();

        res.status(201).json({ message: "Bookmark added successfully.", bookMark: newBookMark });
    } catch (error) {
        res.status(500).json({ message: "An error occurred while adding the bookmark.", error: error.message });
    }
};

exports.getBookMark = async (req, res) => {
    try {
        const { userId } = req.query;

        // Validate query parameter
        if (!userId) {
            return res.status(400).json({ message: "userId is required." });
        }

        // Fetch bookmarks for the user
        const bookMarks = await BookMark.find({ userId });

        res.status(200).json({ message: "Bookmarks fetched successfully.", bookMarks });
    } catch (error) {
        res.status(500).json({ message: "An error occurred while fetching bookmarks.", error: error.message });
    }
};