import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Form, Rate, Input, Select, notification, Spin } from "antd";
import { MdRateReview, MdReport } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaBookmark } from "react-icons/fa6";
import { useBookmarkStore } from "@/store/bookmarkStore";
import { RiCalendarScheduleFill } from "react-icons/ri";
import { useScheduleStore } from "@/store/scheduleStore";
import { BiSolidConversation } from "react-icons/bi";
import ChatDialog from "./ChatDialog";

export function ScheduleDialog() {
  return <div>Schedule</div>;
}

export function RatingDialog() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { listingId } = useParams();

  const handleRatingClick = () => {
    if (!isAuthenticated) {
      // Store current location before redirecting
      localStorage.setItem("redirectAfterLogin", location.pathname);
      navigate("/auth/user-signin");
      return;
    }
    setShowForm(true);
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const reviewData = {
        propertyId: listingId,
        studentId: user._id,
        ratings: values.rating,
        review: values.review,
      };

      const response = await axios.post(
        "http://localhost:5000/api/review/add-review",
        reviewData
      );

      if (response.data.success) {
        notification.success({
          message: "Success",
          description: "Your review has been submitted successfully",
        });
      } else {
        // Handle spam detection notification
        notification.warning({
          message: "Review Flagged",
          description:
            response.data.message || "Your review has been flagged for review",
        });
      }

      form.resetFields();
      setShowForm(false);
    } catch (error) {
      console.error("Error submitting review:", error);
      notification.error({
        message: "Error",
        description: error.response?.data?.message || "Failed to submit review",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        className="w-full bg-white text-black font-semibold hover:bg-gray-100"
        onClick={handleRatingClick}
      >
        <MdRateReview className="text-black" />
        Rate this Listing
      </Button>

      <AnimatePresence>
        {showForm && (
          <div className="fixed -inset-3 h-screen bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="bg-white p-6 rounded-lg w-[400px]"
            >
              <h2 className="text-xl font-semibold mb-4">Rate this Listing</h2>
              <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                  name="rating"
                  label="Your Rating"
                  rules={[{ required: true, message: "Please give a rating" }]}
                >
                  <Rate
                    allowHalf
                    className=" p-2 w-full rounded-lg"
                    style={{ fontSize: 24 }}
                  />
                </Form.Item>

                <Form.Item
                  name="review"
                  label="Your Review"
                  rules={[{ required: true, message: "Please write a review" }]}
                >
                  <Input.TextArea
                    rows={4}
                    placeholder="Write your review here..."
                    className="resize-none focus:border-primaryBgColor"
                  />
                </Form.Item>

                <div className="flex justify-end space-x-2 mt-4">
                  <Button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-gray-200 text-black hover:bg-gray-300"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primaryBgColor text-white hover:bg-green-600"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit Review"}
                  </Button>
                </div>
              </Form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export function ReportDialog() {
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { listingId } = useParams();

  const handleReportClick = () => {
    if (!isAuthenticated) {
      localStorage.setItem("redirectAfterLogin", location.pathname);
      navigate("/auth/user-signin");
      return;
    }
    setShowReportForm(true);
  };

  const reportReasons = [
    { value: "inappropriate_content", label: "Inappropriate Content" },
    { value: "fraudulent_listing", label: "Fraudulent Listing" },
    { value: "scam", label: "Scam" },
    { value: "harassment", label: "Harassment" },
    { value: "misleading_info", label: "Misleading Information" },
    { value: "terms_violation", label: "Terms Violation" },
    { value: "duplicate_listing", label: "Duplicate Listing" },
    { value: "technical_issue", label: "Technical Issue" },
  ];

  const handleReportSubmit = async (values) => {
    try {
      setLoading(true);
      const reportData = {
        reporterId: user._id,
        listingId: listingId,
        type: values.reason,
        description: values.report,
      };

      const response = await axios.post(
        "http://localhost:5000/api/report/addReport",
        reportData
      );

      if (response.data.success) {
        notification.success({
          message: "Success",
          description: "Your report has been submitted successfully",
        });
        reportForm.resetFields();
        setShowReportForm(false);
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      notification.error({
        message: "Error",
        description: error.response?.data?.message || "Failed to submit report",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        className="w-full bg-red-500 text-white font-semibold hover:bg-red-600"
        onClick={handleReportClick}
      >
        <MdReport className="text-white" />
        Report misconduct
      </Button>

      <AnimatePresence>
        {showReportForm && (
          <div className="fixed -inset-3 h-screen bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="bg-white p-6 rounded-lg w-[400px]"
            >
              <h2 className="text-xl font-semibold mb-4">
                Why are you reporting this listing?
              </h2>
              <Form
                form={reportForm}
                layout="vertical"
                onFinish={handleReportSubmit}
              >
                <Form.Item
                  name="reason"
                  label="Reason for Report"
                  rules={[
                    { required: true, message: "Please select a reason" },
                  ]}
                >
                  <Select
                    placeholder="Select a reason"
                    options={reportReasons}
                    className=" focus:border-primaryBgColor"
                  />
                </Form.Item>

                <Form.Item
                  name="report"
                  label="Explain your reporting"
                  rules={[
                    { required: true, message: "Please explain clearly" },
                  ]}
                >
                  <Input.TextArea
                    rows={4}
                    placeholder="Explain your report here..."
                    className="resize-none focus:border-primaryBgColor"
                  />
                </Form.Item>

                <div className="flex justify-end space-x-2 mt-4">
                  <Button
                    type="button"
                    onClick={() => setShowReportForm(false)}
                    className="bg-gray-200 text-black hover:bg-gray-300"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primaryBgColor text-white hover:bg-green-600"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit Report"}
                  </Button>
                </div>
              </Form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export function AddBookMark() {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const { listingId } = useParams();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    addBookmark,
    removeBookmark,
    isListingBookmarked,
    fetchBookmarks,
    bookmarks,
  } = useBookmarkStore();

  useEffect(() => {
    if (isAuthenticated && user?._id) {
      const loadBookmarkStatus = async () => {
        try {
          await fetchBookmarks(user._id);
          setIsBookmarked(isListingBookmarked(listingId));
        } catch (error) {
          console.error("Error checking bookmark status:", error);
        }
      };
      loadBookmarkStatus();
    }
  }, [isAuthenticated, user, listingId, fetchBookmarks, isListingBookmarked]);

  const toggleBookmark = async () => {
    if (!isAuthenticated) {
      localStorage.setItem("redirectAfterLogin", location.pathname);
      navigate("/auth/user-signin");
      return;
    }

    setLoading(true);

    try {
      if (isBookmarked) {
        // Find the bookmark ID to remove
        const bookmarkToRemove = bookmarks.find(
          (bookmark) =>
            bookmark.listing?._id === listingId ||
            bookmark.listing === listingId
        );

        if (bookmarkToRemove) {
          await removeBookmark(bookmarkToRemove._id, user._id);
          setIsBookmarked(false);
          notification.success({
            message: "Success",
            description: "Bookmark removed successfully",
          });
        }
      } else {
        await addBookmark(listingId, user._id);
        setIsBookmarked(true);
        notification.success({
          message: "Success",
          description: "Bookmark added successfully",
        });
      }
    } catch (error) {
      console.error("Error managing bookmark:", error);
      notification.error({
        message: "Error",
        description:
          error.response?.data?.message ||
          `Failed to ${isBookmarked ? "remove" : "add"} bookmark`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className={`w-full font-semibold hover:bg-gray-100 ${
        isBookmarked ? "bg-yellow-500 text-black" : "bg-white text-black"
      }`}
      onClick={toggleBookmark}
      disabled={loading}
    >
      <FaBookmark className="text-black mr-2" />
      {loading
        ? "Processing..."
        : isBookmarked
        ? "Bookmarked"
        : "Add to Bookmark"}
    </Button>
  );
}

export function ScheduleVisit() {
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);
  const { addSchedule, loading } = useScheduleStore();
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);

  // Fetch listing data to get landlordId
  useEffect(() => {
    const fetchListing = async () => {
      if (listingId) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/listings/${listingId}`
          );
          setListing(response.data);
        } catch (error) {
          console.error("Error fetching listing:", error);
        }
      }
    };

    fetchListing();
  }, [listingId]);

  // Fetch available time slots when date changes
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (selectedDate && listingId) {
        setLoadingTimeSlots(true);
        try {
          const response = await axios.get(
            `http://localhost:5000/api/schedules/available-time-slots?listingId=${listingId}&date=${selectedDate}`
          );
          setTimeSlots(response.data.timeSlots);
        } catch (error) {
          console.error("Error fetching time slots:", error);
          notification.error({
            message: "Error",
            description: "Failed to fetch time slots",
          });
        } finally {
          setLoadingTimeSlots(false);
        }
      }
    };

    if (selectedDate) {
      fetchTimeSlots();
    }
  }, [selectedDate, listingId]);

  const handleScheduleClick = () => {
    if (!isAuthenticated) {
      localStorage.setItem("redirectAfterLogin", location.pathname);
      navigate("/auth/user-signin");
      return;
    }
    setShowScheduleForm(true);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleSubmit = async (values) => {
    if (!listing || !listing.landlord) {
      notification.error({
        message: "Error",
        description: "Missing listing or landlord information",
      });
      return;
    }

    // Check if time is between 7am and 6pm
    const [hours, minutes] = values.time.split(":").map(Number);
    if (hours < 7 || hours >= 18) {
      notification.error({
        message: "Invalid Time",
        description: "Booking time must be between 7:00 AM and 6:00 PM",
      });
      return;
    }

    const scheduleData = {
      studentId: user._id,
      landlordId: listing.landlord._id,
      listingId: listingId,
      date: values.date,
      time: values.time,
    };

    try {
      await addSchedule(scheduleData);
      setShowScheduleForm(false);
    } catch (error) {
      // Error is handled in the store
    }
  };

  return (
    <>
      <Button
        className="w-full bg-white text-black font-semibold hover:bg-gray-100"
        onClick={handleScheduleClick}
        disabled={loading}
      >
        <RiCalendarScheduleFill className="text-black" />
        {loading ? "Loading..." : "Schedule a Visit"}
      </Button>

      <AnimatePresence>
        {showScheduleForm && (
          <div className="fixed -inset-3 h-screen bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="bg-white p-6 rounded-lg w-[400px]"
            >
              <h2 className="text-xl font-semibold mb-4">Schedule a Visit</h2>
              <p className="text-sm text-gray-500 mb-4">
                Note: Visits can only be scheduled between 7:00 AM and 6:00 PM
              </p>
              <Form layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                  name="date"
                  label="Select Date"
                  rules={[{ required: true, message: "Please select a date" }]}
                >
                  <Input
                    type="date"
                    className="focus:border-primaryBgColor"
                    onChange={handleDateChange}
                    min={new Date().toISOString().split("T")[0]} // Can't select dates in the past
                  />
                </Form.Item>

                <Form.Item
                  name="time"
                  label="Select Time"
                  rules={[{ required: true, message: "Please select a time" }]}
                >
                  {selectedDate ? (
                    loadingTimeSlots ? (
                      <Spin size="small" />
                    ) : timeSlots.length > 0 ? (
                      <Select className="w-full">
                        {timeSlots.map((slot) => (
                          <Select.Option
                            key={slot.time}
                            value={slot.time}
                            disabled={!slot.available}
                            className={!slot.available ? "text-gray-400" : ""}
                          >
                            {slot.time}
                            {!slot.available && " (Booked)"}
                          </Select.Option>
                        ))}
                      </Select>
                    ) : (
                      <div className="text-orange-500 text-sm">
                        No time slots available for this date.
                      </div>
                    )
                  ) : (
                    <div className="text-gray-500 text-sm">
                      Please select a date first to see available times
                    </div>
                  )}
                </Form.Item>

                <div className="flex justify-end space-x-2 mt-4">
                  <Button
                    type="button"
                    onClick={() => setShowScheduleForm(false)}
                    className="bg-gray-200 text-black hover:bg-gray-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primaryBgColor text-white hover:bg-green-600"
                    disabled={
                      !selectedDate ||
                      loadingTimeSlots ||
                      timeSlots.length === 0
                    }
                  >
                    Submit Schedule
                  </Button>
                </div>
              </Form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export function StartConversation({ listing }) {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  const handleClick = () => {
    console.log("User object:", user); // Debug line to verify the user object structure

    if (!isAuthenticated) {
      localStorage.setItem("redirectAfterLogin", location.pathname);
      navigate("/auth/user-signin");
      return;
    }

    // Fixed role check - in your database, students have the role "user" not "student"
    if (user && user.role !== "user") {
      notification.info({
        message: "Student access only",
        description: "Only students can start conversations with landlords",
      });
      return;
    }

    setIsOpen(true);
  };

  return (
    <>
      <Button
        onClick={handleClick}
        className="w-full bg-white text-black font-semibold hover:bg-gray-100"
      >
        <BiSolidConversation className="text-black mr-2" />
        Start Conversation
      </Button>

      <ChatDialog isOpen={isOpen} setIsOpen={setIsOpen} listing={listing} />
    </>
  );
}
