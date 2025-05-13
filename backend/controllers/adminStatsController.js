const Listing = require("../models/Listing");
const User = require("../models/User");
const Review = require("../models/Review");
const ListingReport = require("../models/ListingReport");
const Schedule = require("../models/Schedule");
const BookMark = require("../models/BookMark");

// Get listing statistics
exports.getListingStats = async (req, res) => {
  try {
    // Fetch all listings
    const listings = await Listing.find();

    // Calculate total count
    const total = listings.length;

    // Calculate property type distribution
    const byPropertyType = {};
    listings.forEach((listing) => {
      const type = listing.propertyType || "Unknown";
      byPropertyType[type] = (byPropertyType[type] || 0) + 1;
    });

    // Calculate average rent
    const totalRent = listings.reduce(
      (sum, listing) => sum + (listing.monthlyRent || 0),
      0
    );
    const averageRent = total > 0 ? Math.round(totalRent / total) : 0;

    // Find listing with most views
    const highestViewed = listings.reduce(
      (max, listing) => (!max || listing.views > max.views ? listing : max),
      null
    );

    // Calculate average ELO rating
    const totalElo = listings.reduce(
      (sum, listing) => sum + (listing.eloRating || 0),
      0
    );
    const averageElo = total > 0 ? totalElo / total : 0;

    // Find most bookmarked listing
    const bookmarkCounts = await BookMark.aggregate([
      { $group: { _id: "$listing", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    let mostBookmarked = null;
    if (bookmarkCounts.length > 0) {
      mostBookmarked = await Listing.findById(bookmarkCounts[0]._id);
    }

    res.status(200).json({
      total,
      byPropertyType,
      averageRent,
      highestViewed: highestViewed
        ? {
            _id: highestViewed._id,
            propertyName: highestViewed.propertyName,
            views: highestViewed.views,
          }
        : null,
      mostBookmarked: mostBookmarked
        ? {
            _id: mostBookmarked._id,
            propertyName: mostBookmarked.propertyName,
            bookmarkCount: bookmarkCounts[0].count,
          }
        : null,
      averageElo,
    });
  } catch (error) {
    console.error("Error fetching listing stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching listing statistics",
      error: error.message,
    });
  }
};

// Get report statistics
exports.getReportStats = async (req, res) => {
  try {
    // Fetch all reports
    const reports = await ListingReport.find();

    // Calculate total count
    const total = reports.length;

    // Calculate reports by status
    const pending = reports.filter(
      (report) => report.status === "pending"
    ).length;
    const investigating = reports.filter(
      (report) => report.status === "investigating"
    ).length;
    const resolved = reports.filter(
      (report) => report.status === "resolved"
    ).length;

    // Calculate reports by type
    const byType = {};
    reports.forEach((report) => {
      const type = report.type || "Unknown";
      byType[type] = (byType[type] || 0) + 1;
    });

    res.status(200).json({
      total,
      pending,
      investigating,
      resolved,
      byType,
    });
  } catch (error) {
    console.error("Error fetching report stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching report statistics",
      error: error.message,
    });
  }
};

// Get review statistics
exports.getReviewStats = async (req, res) => {
  try {
    // Fetch all reviews
    const reviews = await Review.find();

    // Calculate total count
    const total = reviews.length;

    // Calculate spam reviews
    const spam = reviews.filter((review) => review.status === "spam").length;

    // Calculate average rating
    const totalRating = reviews.reduce(
      (sum, review) => sum + (review.ratings || 0),
      0
    );
    const averageRating = total > 0 ? (totalRating / total).toFixed(1) : 0;

    // Calculate sentiment distribution
    const sentiments = {
      positive: reviews.filter((review) => review.sentiment === "positive")
        .length,
      neutral: reviews.filter((review) => review.sentiment === "neutral")
        .length,
      negative: reviews.filter((review) => review.sentiment === "negative")
        .length,
    };

    res.status(200).json({
      total,
      spam,
      averageRating,
      sentiments,
    });
  } catch (error) {
    console.error("Error fetching review stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching review statistics",
      error: error.message,
    });
  }
};

// Get schedule statistics
exports.getScheduleStats = async (req, res) => {
  try {
    // Fetch all schedules
    const schedules = await Schedule.find();

    // Calculate total count
    const total = schedules.length;

    // Calculate schedules by status
    const pending = schedules.filter(
      (schedule) => schedule.status === "pending"
    ).length;
    const confirmed = schedules.filter(
      (schedule) => schedule.status === "confirmed"
    ).length;
    const rejected = schedules.filter(
      (schedule) => schedule.status === "rejected"
    ).length;

    // Get popular days (for scheduling)
    const dayCount = {};
    schedules.forEach((schedule) => {
      const day = new Date(schedule.date).getDay();
      const dayName = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ][day];
      dayCount[dayName] = (dayCount[dayName] || 0) + 1;
    });

    // Get most popular time slots
    const timeCount = {};
    schedules.forEach((schedule) => {
      const hour = schedule.time.split(":")[0];
      timeCount[hour] = (timeCount[hour] || 0) + 1;
    });

    res.status(200).json({
      total,
      pending,
      confirmed,
      rejected,
      popularDays: dayCount,
      popularTimes: timeCount,
    });
  } catch (error) {
    console.error("Error fetching schedule stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching schedule statistics",
      error: error.message,
    });
  }
};
