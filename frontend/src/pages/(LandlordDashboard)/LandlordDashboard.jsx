import { useLandlordAuthStore } from '@/store/landlordAuthStore'
import useListingStore from '@/store/listingStore';
import { useScheduleStore } from '@/store/scheduleStore';
import React, { useEffect, useState, useRef } from 'react'
import LoadingSpinner from '@/components/include/LoadingSpinner';
import Sidebar from '@/components/landlord_dashboard/Sidebar';
import { Link, useParams } from 'react-router-dom';
import { Switch, notification } from 'antd';
import { FaHome, FaCalendarAlt, FaEnvelope, FaEye, FaHeart, FaPlus, FaMapMarkerAlt, FaBuilding, FaUserFriends } from 'react-icons/fa';
import ListingCard from '@/components/landlord_dashboard/ListingCard';
import { MdDashboard } from 'react-icons/md';
import { RiCalendarScheduleFill } from 'react-icons/ri';

const LandlordDashboard = () => {
    const [isMapView, setIsMapView] = useState(false);
    const { landlord, isLandlordAuthenticated, checkLandlordAuth, isCheckingLandlordAuth } = useLandlordAuthStore();
    const { fetchLandlordListings, landlordListings, loading: listingsLoading } = useListingStore();
    const [totalListingsCount, setTotalListingsCount] = useState(0);
    const [dashboardSchedules, setDashboardSchedules] = useState([]);
    const { landlordId, email } = useParams();
    const { updateScheduleStatus } = useScheduleStore();

    const inquiries = [
        { id: 1, name: "Emma Wilson", property: "Cozy Studio Apartment", message: "Is the apartment still available? I'm interested in viewing it.", date: "Nov 12, 2023" },
        { id: 2, name: "Michael Brown", property: "Modern 2-Bedroom Flat", message: "Are utilities included in the rent?", date: "Nov 14, 2023" },
        { id: 3, name: "Sarah Davis", property: "Spacious 3-Bedroom House", message: "Is the property pet-friendly?", date: "Nov 14, 2023" },
    ];

    // Animation state for counters
    const [animatedListingCount, setAnimatedListingCount] = useState(0);
    const [animatedScheduleCount, setAnimatedScheduleCount] = useState(0);
    const [animatedInquiryCount, setAnimatedInquiryCount] = useState(0);

    // Animation frame references
    const listingCountRef = useRef(null);
    const scheduleCountRef = useRef(null);
    const inquiryCountRef = useRef(null);

    useEffect(() => {
        if (!isLandlordAuthenticated) {
            checkLandlordAuth();
        }
    }, []);

    useEffect(() => {
        if (landlord && landlord._id) {
            fetchLandlordListings(landlord._id, 3)
                .then(() => {
                    return fetchLandlordListings(landlord._id, 0, false);
                })
                .then((allListings) => {
                    if (allListings && Array.isArray(allListings)) {
                        setTotalListingsCount(allListings.length);
                    }
                })
                .catch(error => {
                    console.error("Error fetching listings:", error);
                });
        }
    }, [landlord, fetchLandlordListings]);

    useEffect(() => {
        if (landlord) {
            document.title = `${landlord.username}'s Dashboard`;
        }
    }, [landlord]);

    useEffect(() => {
        const fetchDashboardSchedules = async () => {
            if (landlord && landlord._id) {
                try {
                    const { getSchedulesByLandlordId } = useScheduleStore.getState();
                    const schedules = await getSchedulesByLandlordId(landlord._id);
                    
                    const upcoming = schedules.filter(schedule => 
                        new Date(`${schedule.date}T${schedule.time}`) > new Date() &&
                        schedule.status !== 'cancelled'
                    ).slice(0, 3);
                    
                    setDashboardSchedules(upcoming);
                } catch (error) {
                    console.error("Error fetching dashboard schedules:", error);
                }
            }
        };

        fetchDashboardSchedules();
    }, [landlord]);

    useEffect(() => {
        if (totalListingsCount > 0) {
            let startTime;
            const duration = 1500; // animation duration in ms
            
            const animateCount = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);
                
                setAnimatedListingCount(Math.floor(progress * totalListingsCount));
                
                if (progress < 1) {
                    listingCountRef.current = requestAnimationFrame(animateCount);
                } else {
                    setAnimatedListingCount(totalListingsCount); // ensure the final value is exact
                }
            };
            
            listingCountRef.current = requestAnimationFrame(animateCount);
            
            return () => {
                if (listingCountRef.current) {
                    cancelAnimationFrame(listingCountRef.current);
                }
            };
        }
    }, [totalListingsCount]);

    useEffect(() => {
        if (dashboardSchedules.length > 0) {
            let startTime;
            const duration = 1500; // animation duration in ms
            
            const animateCount = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);
                
                setAnimatedScheduleCount(Math.floor(progress * dashboardSchedules.length));
                
                if (progress < 1) {
                    scheduleCountRef.current = requestAnimationFrame(animateCount);
                } else {
                    setAnimatedScheduleCount(dashboardSchedules.length);
                }
            };
            
            scheduleCountRef.current = requestAnimationFrame(animateCount);
            
            return () => {
                if (scheduleCountRef.current) {
                    cancelAnimationFrame(scheduleCountRef.current);
                }
            };
        }
    }, [dashboardSchedules.length]);

    useEffect(() => {
        if (inquiries.length > 0) {
            let startTime;
            const duration = 1500; // animation duration in ms
            
            const animateCount = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);
                
                setAnimatedInquiryCount(Math.floor(progress * inquiries.length));
                
                if (progress < 1) {
                    inquiryCountRef.current = requestAnimationFrame(animateCount);
                } else {
                    setAnimatedInquiryCount(inquiries.length);
                }
            };
            
            inquiryCountRef.current = requestAnimationFrame(animateCount);
            
            return () => {
                if (inquiryCountRef.current) {
                    cancelAnimationFrame(inquiryCountRef.current);
                }
            };
        }
    }, [inquiries.length]);

    const handleUpdateStatus = async (scheduleId, status) => {
        try {
            await updateScheduleStatus(scheduleId, status);
            
            setDashboardSchedules(prev => 
                prev.map(schedule => 
                    schedule._id === scheduleId 
                    ? {...schedule, status} 
                    : schedule
                )
            );
            
            notification.success({
                message: `Schedule ${status === 'confirmed' ? 'Confirmed' : 'Rejected'}`,
                description: `The schedule has been ${status} successfully.`
            });
        } catch (error) {
            console.error(`Error updating schedule status:`, error);
            notification.error({
                message: 'Error',
                description: 'Failed to update the schedule status.'
            });
        }
    };

    if (isCheckingLandlordAuth || listingsLoading) {
        return <LoadingSpinner />;
    }

    if (!isLandlordAuthenticated || !landlord) {
        return null;
    }

    return (
        <div className="flex h-full bg-gray-100 min-h-screen">
            <Sidebar className="fixed h-full" />

            <div className="flex-1 ml-[220px] p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                            <MdDashboard className="mr-2 text-primaryBgColor" />
                            Dashboard
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex space-x-2">
                            <Link to="/" className="px-4 py-2 bg-primaryBgColor text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2">
                                <FaHome /> Home
                            </Link>
                            <Link to="/all-listings" className="px-4 py-2 bg-primaryBgColor text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2">
                                <FaBuilding /> All Listings
                            </Link>
                            <Link to={`/landlord/${landlordId}/${email}/schedule`} className="px-4 py-2 bg-primaryBgColor text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2">
                                <RiCalendarScheduleFill /> Schedules
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
                        <div className="rounded-full bg-green-100 p-3 mr-4">
                            <FaBuilding className="text-primaryBgColor text-xl" />
                        </div>
                        <div>
                            <p className="text-gray-500">Total Properties</p>
                            <p className="text-2xl font-bold">{animatedListingCount}</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
                        <div className="rounded-full bg-blue-100 p-3 mr-4">
                            <FaCalendarAlt className="text-blue-600 text-xl" />
                        </div>
                        <div>
                            <p className="text-gray-500">Scheduled Visits</p>
                            <p className="text-2xl font-bold">{animatedScheduleCount}</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
                        <div className="rounded-full bg-purple-100 p-3 mr-4">
                            <FaEnvelope className="text-purple-600 text-xl" />
                        </div>
                        <div>
                            <p className="text-gray-500">New Inquiries</p>
                            <p className="text-2xl font-bold">{animatedInquiryCount}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                            <FaHome className="mr-2 text-primaryBgColor" /> My Listings
                        </h3>
                    </div>

                    <div className="mt-4">
                        {isMapView ? (
                            <div className="h-[400px] bg-gray-100 rounded-lg flex items-center justify-center relative">
                                <FaMapMarkerAlt className="text-red-500 text-4xl absolute" style={{ top: '45%', left: '48%' }} />
                                <FaMapMarkerAlt className="text-red-500 text-4xl absolute" style={{ top: '30%', left: '58%' }} />
                                <FaMapMarkerAlt className="text-red-500 text-4xl absolute" style={{ top: '60%', left: '35%' }} />
                                <div className="absolute bottom-4 right-4 bg-white p-2 rounded-lg shadow-md">
                                    <p className="text-sm text-gray-700">Interactive map coming soon</p>
                                </div>
                            </div>
                        ) : (
                            landlordListings.length > 0 ? (
                                <>
                                    <ListingCard listings={landlordListings.map(listing => ({
                                        id: listing._id,
                                        title: listing.propertyName,
                                        location: listing.address,
                                        price: `LKR ${listing.monthlyRent.toLocaleString()}/month`,
                                        image: listing.images[0] || "https://via.placeholder.com/150",
                                        views: listing.views || 0,
                                    }))} />
                                    <div className="mt-4 text-right">
                                        <Link to={`/landlord/${landlordId}/${email}/my-listings`} className="text-primaryBgColor hover:underline">View all listings →</Link>
                                    </div>
                                </>
                            ) : (
                                <div className="bg-white border border-gray-200 p-6 rounded-lg h-64 flex flex-col items-center justify-center">
                                    <FaHome className="text-gray-300 text-5xl mb-3" />
                                    <p className="text-gray-500 mb-4">No listings yet</p>
                                    <Link to={`/landlord/${landlordId}/${email}/add-listings`} className="px-4 py-2 bg-primaryBgColor text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2">
                                        <FaPlus /> Add Your New Listing
                                    </Link>
                                </div>
                            )
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-white p-5 rounded-lg shadow-sm">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <FaCalendarAlt className="mr-2 text-blue-600" /> Latest Scheduled Visits
                        </h3>
                        {dashboardSchedules.length > 0 ? (
                            <div className="space-y-4">
                                {dashboardSchedules.map(schedule => {
                                    const scheduleDate = new Date(`${schedule.date}T${schedule.time}`);
                                    const formattedDate = scheduleDate.toLocaleDateString('en-US', {
                                        weekday: 'short', 
                                        month: 'short', 
                                        day: 'numeric'
                                    });
                                    const formattedTime = scheduleDate.toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    });
                                    
                                    return (
                                        <div key={schedule._id} className={`border-l-4 ${
                                            schedule.status === 'confirmed' ? 'border-l-green-500' : 
                                            'border-l-yellow-500'} p-3 rounded-md shadow-sm hover:shadow-md transition`}>
                                            <div className="flex justify-between">
                                                <div>
                                                    <p className="font-medium flex items-center">
                                                        <FaUserFriends className="text-primaryBgColor mr-2" />
                                                        {schedule.userId?.username || 'Anonymous User'}
                                                    </p>
                                                    <p className="text-sm text-gray-600 flex items-center mt-1">
                                                        <FaBuilding className="text-gray-500 mr-2" />
                                                        {schedule.listingId?.propertyName || 'Property Visit'}
                                                    </p>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <p className="text-xs bg-gray-100 px-2 py-1 rounded flex items-center">
                                                            <FaCalendarAlt className="text-primaryBgColor mr-1" />
                                                            {formattedDate}
                                                        </p>
                                                        <p className="text-xs bg-gray-100 px-2 py-1 rounded flex items-center">
                                                            <FaCalendarAlt className="text-primaryBgColor mr-1" />
                                                            {formattedTime}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`text-xs px-3 py-1 rounded-full ${
                                                        schedule.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                                                        'bg-yellow-100 text-yellow-700'}`}>
                                                        {schedule.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            {schedule.status === 'pending' && (
                                                <div className="mt-3 flex justify-end space-x-2">
                                                    <button 
                                                        className="text-xs px-3 py-1 bg-primaryBgColor text-white rounded hover:bg-green-700 transition"
                                                        onClick={() => handleUpdateStatus(schedule._id, 'confirmed')}>
                                                        Confirm
                                                    </button>
                                                    <button 
                                                        className="text-xs px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                                        onClick={() => handleUpdateStatus(schedule._id, 'rejected')}>
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="h-48 flex items-center justify-center">
                                <p className="text-gray-500">No scheduled visits</p>
                            </div>
                        )}
                        <div className="mt-4 text-right">
                            <Link to={`/landlord/${landlordId}/${email}/schedule`} className="text-primaryBgColor hover:underline">View all visits →</Link>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-lg shadow-sm">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <FaEnvelope className="mr-2 text-purple-600" /> Recent Inquiries
                        </h3>
                        {inquiries.length > 0 ? (
                            <div className="space-y-4">
                                {inquiries.map(inquiry => (
                                    <div key={inquiry.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                                        <div>
                                            <div className="flex justify-between mb-1">
                                                <p className="font-medium">{inquiry.name}</p>
                                                <p className="text-xs text-gray-500">{inquiry.date}</p>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-1">{inquiry.property}</p>
                                            <p className="text-sm text-gray-700 line-clamp-2">{inquiry.message}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-48 flex items-center justify-center">
                                <p className="text-gray-500">No recent inquiries</p>
                            </div>
                        )}
                        <div className="mt-4 text-right">
                            <Link to="/inquiries" className="text-primaryBgColor hover:underline">View all inquiries →</Link>
                        </div>
                    </div>
                </div>

                <div className="mt-10 items-center justify-center w-full">
                    <h1 className="text-gray-600 font-semibold text-center">UniNest © {new Date().getFullYear()}</h1>
                </div>
            </div>
        </div>
    );
};

export default LandlordDashboard;