import Sidebar from '@/components/landlord_dashboard/Sidebar'
import { Empty, Spin, Card, Button, notification, Tabs, Image } from 'antd';
import React, { useEffect, useState } from 'react'
import { useLandlordAuthStore } from '@/store/landlordAuthStore';
import { useParams } from 'react-router-dom';
import { FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaUser, FaBuilding, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import axios from 'axios';
import { useScheduleStore } from '@/store/scheduleStore';

const { TabPane } = Tabs;

const LandlordSchedules = () => {
    const [activeTab, setActiveTab] = useState('upcoming');
    const { landlord } = useLandlordAuthStore();
    const {
        schedules,
        loading,
        getSchedulesByLandlordId,
        updateScheduleStatus
    } = useScheduleStore();

    useEffect(() => {
        document.title = "Scheduled Visits";
        if (landlord?._id) {
            getSchedulesByLandlordId(landlord._id);
        }
    }, [landlord, getSchedulesByLandlordId]);

    const isUpcoming = (dateStr, timeStr) => {
        try {
            const now = new Date();
            const scheduleDate = new Date(dateStr);
            const [hours, minutes] = timeStr.split(':').map(Number);
            scheduleDate.setHours(hours, minutes, 0, 0);
            return scheduleDate > now;
        } catch (error) {
            console.error("Error parsing date/time:", error);
            return false;
        }
    };

    const upcomingSchedules = schedules.filter(schedule =>
        isUpcoming(schedule.date, schedule.time) &&
        schedule.status !== 'cancelled' &&
        schedule.status !== 'rejected'
    );

    const pastSchedules = schedules.filter(schedule =>
        !isUpcoming(schedule.date, schedule.time) ||
        schedule.status === 'cancelled' ||
        schedule.status === 'rejected'
    );

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
    };

    const handleAccept = async (scheduleId) => {
        try {
            await updateScheduleStatus(scheduleId, 'confirmed');
        } catch (error) {
            console.error('Error confirming schedule:', error);
        }
    };

    const handleReject = async (scheduleId) => {
        try {
            await updateScheduleStatus(scheduleId, 'rejected');
        } catch (error) {
            console.error('Error rejecting schedule:', error);
        }
    };

    const handleCancel = async (scheduleId) => {
        try {
            await updateScheduleStatus(scheduleId, 'cancelled');
        } catch (error) {
            console.error('Error cancelling schedule:', error);
        }
    };

    const renderScheduleCard = (schedule) => (
        <Card
            key={schedule._id}
            className={`mb-4 ${schedule.status === 'confirmed' ? 'border-l-4 border-l-green-500' :
                    schedule.status === 'rejected' ? 'border-l-4 border-l-orange-500' :
                        schedule.status === 'cancelled' ? 'border-l-4 border-l-red-500' :
                            'border-l-4 border-l-yellow-500'}`}
            hoverable
        >
            <div className="flex flex-col md:flex-row gap-4">
                {/* Property Image */}
                <div className="w-full md:w-32 h-32">
                    {schedule.listingId?.images && schedule.listingId.images.length > 0 ? (
                        <Image
                            src={schedule.listingId.images[0]}
                            alt={schedule.listingId.propertyName || "Property"}
                            className="w-full h-full object-cover rounded-md"
                            fallback=""
                            preview={false}
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                            <FaBuilding className="text-gray-400" size={32} />
                        </div>
                    )}
                </div>

                <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">{schedule.listingId?.propertyName || 'Property Visit'}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${schedule.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                schedule.status === 'rejected' ? 'bg-orange-100 text-orange-800' :
                                    schedule.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                            }`}>
                            {schedule.status === 'confirmed' ? 'Confirmed' :
                                schedule.status === 'rejected' ? 'Rejected' :
                                    schedule.status === 'cancelled' ? 'Cancelled' : 'Pending'}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                        <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-primaryBgColor" />
                            <span>{formatDate(schedule.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaClock className="text-primaryBgColor" />
                            <span>{schedule.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaUser className="text-primaryBgColor" />
                            <span>{schedule.userId?.username || 'Unknown Student'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaBuilding className="text-primaryBgColor" />
                            <span>{schedule.listingId?.propertyType || 'Not specified'}</span>
                        </div>
                        {schedule.listingId?.address && (
                            <div className="flex items-center gap-2 md:col-span-2">
                                <FaMapMarkerAlt className="text-primaryBgColor" />
                                <span>{schedule.listingId.address}, {schedule.listingId.city}</span>
                            </div>
                        )}
                    </div>

                    {/* Only show action buttons for upcoming and pending visits */}
                    {isUpcoming(schedule.date, schedule.time) && schedule.status === 'pending' && (
                        <div className="flex justify-end gap-2">
                            <Button
                                type="primary"
                                onClick={() => handleAccept(schedule._id)}
                                className="bg-primaryBgColor hover:bg-green-700 flex items-center"
                                icon={<FaCheckCircle />}
                            >
                                Accept
                            </Button>
                            <Button
                                danger
                                onClick={() => handleReject(schedule._id)}
                                className="flex items-center"
                                icon={<FaTimesCircle />}
                            >
                                Reject
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );

    return (
        <div className="flex h-full bg-gray-100 min-h-screen overflow-y-hidden">
            <Sidebar className="fixed h-full" />

            <div className="flex-1 ml-[220px] p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                        <FaCalendarAlt className="mr-2 text-primaryBgColor" />
                        Scheduled Visits
                    </h1>
                    <p className="text-gray-600">Manage your property visit schedules</p>
                </div>

                <Tabs activeKey={activeTab} onChange={setActiveTab} className="custom-tabs">
                    <TabPane tab={`Upcoming (${upcomingSchedules.length})`} key="upcoming">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <Spin size="large" />
                            </div>
                        ) : upcomingSchedules.length === 0 ? (
                            <Empty
                                description="No upcoming scheduled visits"
                                className="my-12"
                            />
                        ) : (
                            <div className="space-y-4">
                                {upcomingSchedules.map(renderScheduleCard)}
                            </div>
                        )}
                    </TabPane>
                    <TabPane tab={`Past & Cancelled (${pastSchedules.length})`} key="past">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <Spin size="large" />
                            </div>
                        ) : pastSchedules.length === 0 ? (
                            <Empty
                                description="No past scheduled visits"
                                className="my-12"
                            />
                        ) : (
                            <div className="space-y-4">
                                {pastSchedules.map(renderScheduleCard)}
                            </div>
                        )}
                    </TabPane>
                </Tabs>

                <style jsx global>{`
                    .custom-tabs .ant-tabs-tab.ant-tabs-tab-active {
                        background-color: #006845;
                        border-color: #006845;
                    }
                    .custom-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
                        color: white !important;
                    }
                    .custom-tabs .ant-tabs-tab:hover {
                        color: #006845;
                    }
                    .custom-tabs .ant-tabs-ink-bar {
                        background-color: #006845;
                    }
                `}</style>
            </div>
        </div>
    );
};

export default LandlordSchedules;