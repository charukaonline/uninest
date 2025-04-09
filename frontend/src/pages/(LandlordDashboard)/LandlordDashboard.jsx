import { useLandlordAuthStore } from '@/store/landlordAuthStore'
import useListingStore from '@/store/listingStore';
import useScheduleStore from '@/store/scheduleStore';
import React, { useEffect, useState } from 'react'
import LoadingSpinner from '@/components/include/LoadingSpinner';
import Sidebar from '@/components/landlord_dashboard/Sidebar';
import { Link, useParams } from 'react-router-dom';
import { Switch } from 'antd';
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

    const inquiries = [
        { id: 1, name: "Emma Wilson", property: "Cozy Studio Apartment", message: "Is the apartment still available? I'm interested in viewing it.", date: "Nov 12, 2023" },
        { id: 2, name: "Michael Brown", property: "Modern 2-Bedroom Flat", message: "Are utilities included in the rent?", date: "Nov 14, 2023" },
        { id: 3, name: "Sarah Davis", property: "Spacious 3-Bedroom House", message: "Is the property pet-friendly?", date: "Nov 14, 2023" },
    ];

    useEffect(() => {
        if (!isLandlordAuthenticated) {
            checkLandlordAuth();
        }
    }, []);

    useEffect(() => {
        if (landlord && landlord._id) {
            // Fetch limited listings for display on dashboard
            fetchLandlordListings(landlord._id, 3)
                .then(() => {
                    // After fetching the limited listings, fetch all to get the total count
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

    // Fetch schedules for dashboard
    useEffect(() => {
        const fetchDashboardSchedules = async () => {
            if (landlord && landlord._id) {
                try {
                    const { getSchedulesByLandlordId } = useScheduleStore.getState();
                    const schedules = await getSchedulesByLandlordId(landlord._id);
                    
                    // Get only upcoming and limit to 3 for dashboard display
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
                                <RiCalendarScheduleFill />
                                Schedules
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Statistics Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
                        <div className="rounded-full bg-green-100 p-3 mr-4">
                            <FaBuilding className="text-primaryBgColor text-xl" />
                        </div>
                        <div>
                            <p className="text-gray-500">Total Properties</p>
                            <p className="text-2xl font-bold">{totalListingsCount}</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
                        <div className="rounded-full bg-blue-100 p-3 mr-4">
                            <FaCalendarAlt className="text-blue-600 text-xl" />
                        </div>
                        <div>
                            <p className="text-gray-500">Scheduled Visits</p>
                            <p className="text-2xl font-bold">{dashboardSchedules.length}</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
                        <div className="rounded-full bg-purple-100 p-3 mr-4">
                            <FaEnvelope className="text-purple-600 text-xl" />
                        </div>
                        <div>
                            <p className="text-gray-500">New Inquiries</p>
                            <p className="text-2xl font-bold">{inquiries.length}</p>
                        </div>
                    </div>
                </div>

                {/* Listings Section */}
                <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                            <FaHome className="mr-2 text-primaryBgColor" /> My Listings
                        </h3>
                    </div>

                    {/* Content area */}
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
                                {dashboardSchedules.map(schedule => (
                                    <div key={schedule._id} className="border-b border-gray-100 pb-3 last:border-b-0">
                                        <div className="flex justify-between">
                                            <div>
                                                <p className="font-medium">{schedule.userId?.username || 'Anonymous User'}</p>
                                                <p className="text-sm text-gray-600">{schedule.listingId?.propertyName || 'Property Visit'}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm">{schedule.date}, {schedule.time}</p>
                                                <span className={`text-xs px-2 py-1 rounded-full ${
                                                    schedule.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                                                    'bg-yellow-100 text-yellow-700'}`}>
                                                    {schedule.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
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

                <div className=" mt-10 items-center justify-center w-full">
                    <h1 className=" text-gray-600 font-semibold text-center">UniNest © {new Date().getFullYear()}</h1>
                </div>
            </div>
        </div>
    )
}

export default LandlordDashboard