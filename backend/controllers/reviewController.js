const Review = require('../models/Review');
const User = require('../models/User');
const Property = require('../models/Property');
const { getSentiment } = require('../utils/reviewDetector');

exports.addReview = async (req, res) => {
    try {
        const { propertyId, studentId, ratings, review } = req.body;

        const { sentiment, isSpam, spamReason } = await getSentiment(review);
        console.log('Sentiment analysis result:', sentiment, '| Spam:', isSpam, '| Reason:', spamReason);

        let marks = 0;
        if (isSpam) {
            marks = -50;
        } else if (sentiment === "positive") {
            marks = 5; // Updated to 5 marks for positive reviews
        } else if (sentiment === "negative") {
            marks = -5; // Keep -5 for negative reviews
        }

        const reviewData = {
            propertyId,
            studentId,
            review,
            ratings,
            sentiment,
            marks,
            status: isSpam ? 'spam' : 'approved',
            spamReason: spamReason // Store the reason for spam classification
        };

        // Save the review to the database
        const newReview = new Review(reviewData);
        await newReview.save();

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
            response.spamReason = spamReason;
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

// New controller methods for admin actions
exports.getSpamReviews = async (req, res) => {
    try {
        const spamReviews = await Review.find({ status: 'spam' })
            .populate('studentId', 'username')
            .populate('propertyId', 'propertyName')
            .sort({ createdAt: -1 });

        // Format the data for frontend display with error handling
        const formattedReviews = spamReviews.map(review => {
            // Ensure both studentId and propertyId exist before accessing their properties
            const studentName = review.studentId ? review.studentId.username : 'Unknown User';
            const studentId = review.studentId ? review.studentId._id : null;
            const propertyName = review.propertyId ? review.propertyId.propertyName : 'Unknown Property';
            const propertyId = review.propertyId ? review.propertyId._id : null;

            return {
                _id: review._id,
                studentId: studentId,
                studentName: studentName,
                propertyId: propertyId,
                propertyName: propertyName,
                review: review.review,
                ratings: review.ratings,
                sentiment: review.sentiment,
                marks: review.marks,
                status: review.status,
                spamReason: review.spamReason || 'Unknown reason',
                createdAt: review.createdAt
            };
        });

        res.status(200).json({
            success: true,
            reviews: formattedReviews
        });
    } catch (error) {
        console.error('Error fetching spam reviews:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch spam reviews',
            error: error.message
        });
    }
};

exports.approveReview = async (req, res) => {
    try {
        const { id } = req.params;
        
        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }
        
        // Update review status to approved
        review.status = 'approved';
        await review.save();
        
        res.status(200).json({
            success: true,
            message: 'Review approved successfully'
        });
    } catch (error) {
        console.error('Error approving review:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to approve review',
            error: error.message
        });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        
        const review = await Review.findByIdAndDelete(id);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete review',
            error: error.message
        });
    }
};