const ListingReport = require("../models/ListingReport");

exports.addReport = async (req, res) => {
    try {

        const { reporterId, listingId, type, description } = req.body;

        // Validate request body
        if (!reporterId || !listingId || !type || !description) {
            return res.status(400).json({ message: "userId, listingId, type, and description are required." });
        }

        const newReport = new ListingReport({
            reporterId,
            listingId,
            type,
            description,
        });
        await newReport.save();

        res.status(201).json({
            success: true,
            message: "Report added successfully.",
            report: newReport,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while adding the report.",
            error: error.message
        });
    }
}

exports.getReport = async (req, res) => {
    try {

        // Fetch reports for the listing
        const reports = await ListingReport.find({})
            .populate("reporterId", "name email") // Populate reporter details
            .populate("listingId", "propertyName description"); // Populate listing details

        res.status(200).json({
            success: true,
            message: "Reports fetched successfully.",
            reports: reports,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching reports.",
            error: error.message
        });
    }
}