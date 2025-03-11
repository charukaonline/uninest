const Review = require('../models/Review');
const { getSentiment } = require('../utils/reviewDetector');

exports.addReview = async (req, res) => {
    try {
        const { propertyId, studentId, ratings, review } = req.body;

        const sentiment = await getSentiment(review);
        console.log('Sentiment analysis result:', sentiment);

        const reviewData = {
            propertyId,
            studentId,
            review,
            ratings,
            sentiment,
            status: 'approved',
        };

        res.status(201).json({
            success: true,
            message: 'Review added successfully',
            sentiment: sentiment,
            data: reviewData,
        });

    } catch (error) {
        console.error('Error in addReview:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add review',
            error: error.message,
        });
    }
}