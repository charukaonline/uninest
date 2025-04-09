const Schedule = require("../models/Schedule");
const User = require("../models/User");
const Listing = require("../models/Listing");
const { sendScheduleNotification } = require("../services/emailService");
const Notification = require("../models/Notification");

exports.addSchedule = async (req, res) => {
    try {
        const { studentId, landlordId, listingId, date, time } = req.body;

        // Create new schedule
        const newSchedule = new Schedule({
            userId: studentId,
            landlordId,
            listingId,
            date,
            time,
        });

        await newSchedule.save();

        // Fetch additional information needed for emails
        const student = await User.findById(studentId);
        const landlord = await User.findById(landlordId);
        const listing = await Listing.findById(listingId);

        if (student && landlord && listing) {
            // Send notification emails to both parties
            await sendScheduleNotification(
                student.email,
                student.username,
                landlord.email,
                landlord.username,
                listing.propertyName,
                date,
                time
            );

            // Create in-app notification for landlord
            const landlordNotification = new Notification({
                userId: landlordId,
                type: "property_update",
                title: "New Visit Scheduled",
                message: `${student.username} has scheduled a visit to ${listing.propertyName} on ${date} at ${time}`,
                relatedId: listingId,
                refModel: "Property"
            });
            await landlordNotification.save();

            // Create in-app notification for student
            const studentNotification = new Notification({
                userId: studentId,
                type: "property_update",
                title: "Visit Scheduled Successfully",
                message: `Your visit to ${listing.propertyName} has been scheduled for ${date} at ${time}`,
                relatedId: listingId,
                refModel: "Property"
            });
            await studentNotification.save();
        }

        res
            .status(201)
            .json({
                message: "Schedule created successfully",
                schedule: newSchedule,
            });
    } catch (error) {
        console.error("Error in addSchedule:", error);
        res
            .status(500)
            .json({ message: "Error creating schedule", error: error.message });
    }
};
