const Review = require('../models/Review');
const { getSentiment } = require('../utils/reviewDetector');

exports.addReview = async (req, res) => {
    try {
        const { propertyId, studentId, ratings, review } = req.body;

        const { sentiment, isSpam } = await getSentiment(review);
        console.log('Sentiment analysis result:', sentiment, '| Spam:', isSpam);

        let marks = 0;
        if (isSpam) {
            marks = -50;
        } else if (sentiment === "positive") {
            marks = 10;
        } else if (sentiment === "negative") {
            marks = -5;
        }

        const reviewData = {
            propertyId,
            studentId,
            review,
            ratings,
            sentiment,
            marks,
            status: isSpam ? 'spam' : 'approved'
        };

        let response = {
            success: true,
            message: 'Review processed successfully',
            sentiment: sentiment,
            marks: marks,
            data: reviewData
        };

        if (isSpam) {
            response.message = "Review flagged as spam. Only visible to admins.";
            response.success = false;
        }

        res.status(201).json(response);

    } catch (error) {
        console.error('Error in addReview:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add review',
            error: error.message,
        });
    }
}