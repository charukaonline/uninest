import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Form, Rate, Input, Select, notification } from 'antd'
import { MdRateReview, MdReport } from "react-icons/md"
import { motion, AnimatePresence } from "framer-motion"
import { useAuthStore } from '@/store/authStore'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { FaBookmark } from 'react-icons/fa6'

export function ScheduleDialog() {
    return (
        <div>Schedule</div>
    );
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
            localStorage.setItem('redirectAfterLogin', location.pathname);
            navigate('/auth/user-signin');
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
                review: values.review
            };

            const response = await axios.post('http://localhost:5000/api/review/add-review', reviewData);

            if (response.data.success) {
                notification.success({
                    message: 'Success',
                    description: 'Your review has been submitted successfully'
                });
            } else {
                // Handle spam detection notification
                notification.warning({
                    message: 'Review Flagged',
                    description: response.data.message || 'Your review has been flagged for review'
                });
            }

            form.resetFields();
            setShowForm(false);
        } catch (error) {
            console.error('Error submitting review:', error);
            notification.error({
                message: 'Error',
                description: error.response?.data?.message || 'Failed to submit review'
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
                <MdRateReview className='text-black' />Rate this Listing
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
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={handleSubmit}
                            >
                                <Form.Item
                                    name="rating"
                                    label="Your Rating"
                                    rules={[{ required: true, message: 'Please give a rating' }]}
                                >
                                    <Rate
                                        allowHalf
                                        className=' p-2 w-full rounded-lg'
                                        style={{ fontSize: 24 }}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="review"
                                    label="Your Review"
                                    rules={[{ required: true, message: 'Please write a review' }]}
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
                                        {loading ? 'Submitting...' : 'Submit Review'}
                                    </Button>
                                </div>
                            </Form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}

export function ReportDialog() {

    const [showReportForm, setShowReportForm] = useState(false);
    const [reportForm] = Form.useForm();
    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const handleReportClick = () => {
        if (!isAuthenticated) {
            localStorage.setItem('redirectAfterLogin', location.pathname);
            navigate('/auth/user-signin');
            return;
        }
        setShowReportForm(true);
    };

    const reportReasons = [
        { value: 'wrong_info', label: 'Wrong Information' },
        { value: 'performance', label: 'Performance Issues Reporting' },
        { value: 'privacy', label: 'Privacy Violation Reporting' },
        { value: 'broken_link', label: 'Broken Link or Missing Page Reporting' },
        { value: 'scam', label: 'Scam or Fraud Reporting' },
    ];

    const handleReportSubmit = (values) => {
        try {
            console.log('Report:', values);
            reportForm.resetFields();
            setShowReportForm(false);
        } catch (error) {
            console.error('Error submitting report:', error);
        }
    };

    return (
        <>
            <Button
                className="w-full bg-red-500 text-white font-semibold hover:bg-red-600"
                onClick={handleReportClick}
            >
                <MdReport className='text-white' />Report misconduct
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
                            <h2 className="text-xl font-semibold mb-4">Why are you reporting this listing?</h2>
                            <Form
                                form={reportForm}
                                layout="vertical"
                                onFinish={handleReportSubmit}
                            >
                                <Form.Item
                                    name="reason"
                                    label="Reason for Report"
                                    rules={[{ required: true, message: 'Please select a reason' }]}
                                >
                                    <Select
                                        placeholder="Select a reason"
                                        options={reportReasons}
                                        className=' focus:border-primaryBgColor'
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="report"
                                    label="Explain your reporting"
                                    rules={[{ required: true, message: 'Please explain clearly' }]}
                                >
                                    <Input.TextArea
                                        rows={4}
                                        placeholder="Explain you report here..."
                                        className="resize-none focus:border-primaryBgColor"
                                    />
                                </Form.Item>

                                <div className="flex justify-end space-x-2 mt-4">
                                    <Button
                                        type="button"
                                        onClick={() => setShowReportForm(false)}
                                        className="bg-gray-200 text-black hover:bg-gray-300"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-primaryBgColor text-white hover:bg-green-600"
                                    >
                                        Submit Report
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
    const { isAuthenticated, user } = useAuthStore(); // Get user from auth store
    const navigate = useNavigate();
    const { listingId } = useParams(); // Get listingId from route params
    const [isBookmarked, setIsBookmarked] = useState(false); // State to track bookmark status

    const addBookMark = async () => {
        if (!isAuthenticated) {
            // Redirect to login if not authenticated
            navigate('/auth/user-signin');
            return;
        }

        try {
            const bookmarkData = {
                listingId,
                userId: user._id, // Include user ID
            };

            const response = await axios.post('http://localhost:5000/api/bookmark/addBookMark', bookmarkData);

            if (response.data.success) {
                setIsBookmarked(true); // Set bookmark status to true
                notification.success({
                    message: 'Success',
                    description: 'Bookmark added successfully'
                });
            } else {
                notification.warning({
                    message: 'Bookmark Exists',
                    description: response.data.message || 'This bookmark already exists'
                });
            }
        } catch (error) {
            console.error('Error adding bookmark:', error);
            notification.error({
                message: 'Error',
                description: error.response?.data?.message || 'Failed to add bookmark'
            });
        }
    };

    return (
        <Button
            className={`w-full font-semibold hover:bg-gray-100 ${
                isBookmarked ? "bg-yellow-500 text-black" : "bg-white text-black"
            }`} // Change button color based on state
            onClick={addBookMark} // Call addBookMark on click
        >
            <FaBookmark className="text-black" /> Add to Bookmark
        </Button>
    );
}
