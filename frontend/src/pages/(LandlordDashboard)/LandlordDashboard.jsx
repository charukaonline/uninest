import { useLandlordAuthStore } from '@/store/landlordAuthStore'
import React, { useEffect, useState } from 'react'
import LoadingSpinner from '@/components/include/LoadingSpinner';
import Sidebar from '@/components/landlord_dashboard/Sidebar';
import { Link } from 'react-router-dom';
import { Switch } from 'antd';
// Add FontAwesome icons
import { FaHome, FaCalendarAlt, FaEnvelope, FaEye, FaHeart, FaPlus, FaMapMarkerAlt, FaBuilding, FaUserFriends } from 'react-icons/fa';
import ListingCard from '@/components/landlord_dashboard/ListingCard';

const LandlordDashboard = () => {
    const [isMapView, setIsMapView] = useState(false);
    const { landlord, isLandlordAuthenticated, checkLandlordAuth, isCheckingLandlordAuth } = useLandlordAuthStore();

    // Sample data for demonstration
    const sampleListings = [
        { id: 1, title: "Cozy Studio Apartment", location: "Near University", price: "$450/month", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60", views: 24, favorites: 3 },
        { id: 2, title: "Modern 2-Bedroom Flat", location: "City Center", price: "$750/month", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60", views: 36, favorites: 8 },
        { id: 3, title: "Spacious 3-Bedroom House", location: "Suburban Area", price: "$1200/month", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGhvdXNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60", views: 18, favorites: 5 },
    ];

    const scheduledVisits = [
        { id: 1, name: "John Doe", property: "Cozy Studio Apartment", date: "Nov 15, 2023", time: "10:00 AM", status: "Confirmed" },
        { id: 2, name: "Jane Smith", property: "Modern 2-Bedroom Flat", date: "Nov 16, 2023", time: "3:30 PM", status: "Pending" },
        { id: 3, name: "Robert Johnson", property: "Spacious 3-Bedroom House", date: "Nov 18, 2023", time: "1:00 PM", status: "Confirmed" },
    ];

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
        if (landlord) {
            document.title = `${landlord.username}'s Dashboard`;
        }
    }, [landlord]);

    if (isCheckingLandlordAuth) {
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
                        {/* <h2 className="font-semibold text-2xl text-gray-800">Welcome, {landlord.username}</h2>
                        <p className="text-gray-600">Manage your properties and tenant requests</p> */}
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex space-x-2">
                            <Link to="/" className="px-4 py-2 bg-primaryBgColor text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2">
                                <FaHome /> Home
                            </Link>
                            <Link to="/all-listings" className="px-4 py-2 bg-primaryBgColor text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2">
                                <FaBuilding /> All Listings
                            </Link>
                        </div>

                        {/* <div className="flex items-center space-x-3 ml-4"> */}
                            {/* <span className="text-base font-semibold">Map View</span>
                            <Switch
                                checked={isMapView}
                                onChange={(checked) => setIsMapView(checked)}
                                size="default"
                                style={{
                                    backgroundColor: isMapView ? '#006845' : '#adadad'
                                }}
                            /> */}
                        {/* </div> */}
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
                            <p className="text-2xl font-bold">{sampleListings.length}</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
                        <div className="rounded-full bg-blue-100 p-3 mr-4">
                            <FaCalendarAlt className="text-blue-600 text-xl" />
                        </div>
                        <div>
                            <p className="text-gray-500">Scheduled Visits</p>
                            <p className="text-2xl font-bold">{scheduledVisits.length}</p>
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
                            <FaHome className="mr-2 text-primaryBgColor" /> Your Listings
                        </h3>
                        <div className="flex items-center space-x-3">
                            <span className="text-base">Map View</span>
                            <Switch
                                checked={isMapView}
                                onChange={(checked) => setIsMapView(checked)}
                                size="default"
                                style={{
                                    backgroundColor: isMapView ? '#006845' : '#adadad'
                                }}
                            />
                        </div>
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
                            sampleListings.length > 0 ? (
                                <ListingCard listings={sampleListings} />
                            ) : (
                                <div className="bg-white border border-gray-200 p-6 rounded-lg h-64 flex flex-col items-center justify-center">
                                    <FaHome className="text-gray-300 text-5xl mb-3" />
                                    <p className="text-gray-500 mb-4">No listings yet</p>
                                    <Link to="/add-listing" className="px-4 py-2 bg-primaryBgColor text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2">
                                        <FaPlus /> Add Your First Listing
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
                        {scheduledVisits.length > 0 ? (
                            <div className="space-y-4">
                                {scheduledVisits.map(visit => (
                                    <div key={visit.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                                        <div className="flex justify-between">
                                            <div>
                                                <p className="font-medium">{visit.name}</p>
                                                <p className="text-sm text-gray-600">{visit.property}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm">{visit.date}, {visit.time}</p>
                                                <span className={`text-xs px-2 py-1 rounded-full ${visit.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                    {visit.status}
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
                            <Link to="/visits" className="text-primaryBgColor hover:underline">View all visits →</Link>
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
            </div>
        </div>
    )
}

export default LandlordDashboard