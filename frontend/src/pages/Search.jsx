import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Spin, notification, Tooltip, Button } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import SearchMapboxMap from '../components/include/SearchMapboxMap';

const Search = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    
    const [loading, setLoading] = useState(true);
    const [university, setUniversity] = useState(null);
    const [listings, setListings] = useState([]);
    const mapRef = useRef(null);
    const [radiusKm, setRadiusKm] = useState(5);

    useEffect(() => {
        document.title = `${listings.length} listings found`;
    })
    
    // Use a single API call to get both university and listings
    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query.trim()) {
                setLoading(false);
                return;
            }
            
            setLoading(true);
            
            try {
                console.log("Searching for university with query:", query);
                
                // Use the query parameter explicitly in the API call
                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/search/university?query=${encodeURIComponent(query)}`
                );
                
                if (!response.ok) {
                    throw new Error(`Server responded with status ${response.status}`);
                }
                
                const data = await response.json();
                console.log("Search response:", data);
                
                if (data.success) {
                    if (data.data.university) {
                        console.log("University found:", data.data.university.name);
                        console.log("Listings found:", data.data.listings.length);
                        
                        setUniversity(data.data.university);
                        setListings(data.data.listings);
                        
                        // Log the location coordinates to verify they're correct
                        if (data.data.university.location && data.data.university.location.coordinates) {
                            console.log("University coordinates:", 
                                data.data.university.location.coordinates.latitude,
                                data.data.university.location.coordinates.longitude
                            );
                        } else {
                            console.warn("University has no location coordinates!");
                        }
                        
                        // Log the listings to check their structure
                        if (data.data.listings.length > 0) {
                            console.log("First listing sample:", data.data.listings[0]);
                        }
                    } else {
                        // No university found, fetch all universities and use the first one
                        const uniResponse = await fetch(
                            `${import.meta.env.VITE_BACKEND_URL}/api/university/all-universities`
                        );
                        
                        if (uniResponse.ok) {
                            const universities = await uniResponse.json();
                            if (universities.length > 0) {
                                setUniversity(universities[0]);
                                // Now fetch listings for this university using search endpoint
                                const listingsResponse = await fetch(
                                    `${import.meta.env.VITE_BACKEND_URL}/api/search/university?query=${universities[0].name}`
                                );
                                if (listingsResponse.ok) {
                                    const listingsData = await listingsResponse.json();
                                    setListings(listingsData.data.listings);
                                }
                                
                                notification.info({
                                    message: 'University Not Found',
                                    description: `Couldn't find "${query}". Showing listings near ${universities[0].name} instead.`,
                                });
                            }
                        }
                    }
                } else {
                    notification.error({
                        message: 'Search Error',
                        description: data.message || 'Failed to search for university',
                    });
                }
            } catch (error) {
                console.error('Error fetching search results:', error);
                notification.error({
                    message: 'Error',
                    description: 'Failed to load search results: ' + error.message,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query]);

    // When university or listings change, reset the map
    useEffect(() => {
        if (mapRef.current && university && listings.length > 0) {
            // Force map to redraw by accessing internal map methods
            setTimeout(() => {
                mapRef.current.resize();
            }, 100);
        }
    }, [university, listings]);

    // Format university location for the map
    const getUniversityLocation = () => {
        if (!university || !university.location || !university.location.coordinates) return null;
        
        return {
            latitude: university.location.coordinates.latitude,
            longitude: university.location.coordinates.longitude
        };
    };

    // Format properties for the map
    const getFormattedProperties = () => {
        if (!listings.length) {
            console.log("No listings available");
            return [];
        }
        
        // Format the properties with all required data
        const formattedProps = listings.map(listing => {
            // Check for valid coordinates
            if (!listing.coordinates || 
                typeof listing.coordinates.latitude !== 'number' || 
                typeof listing.coordinates.longitude !== 'number') {
                console.error("Invalid coordinates for listing:", listing._id);
                return null;
            }
            
            return {
                id: listing._id,
                latitude: listing.coordinates.latitude,
                longitude: listing.coordinates.longitude,
                name: listing.propertyName || "Unnamed Property",
                price: listing.monthlyRent || 0,
                image: listing.images && listing.images.length > 0 ? listing.images[0] : '',
                link: `/listing/${listing._id}`
            };
        }).filter(Boolean); // Remove any null entries from invalid data
        
        console.log("Formatted properties:", formattedProps.length);
        return formattedProps;
    };

    return (
        <div className="min-h-screen bg-gray-50 mb-10">
            <div className="py-4 px-4 bg-white shadow-sm mb-0">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">
                                {university ? `Listings near ${university.name}` : 'Search Results'}
                            </h1>
                            <p className="text-gray-600">
                                {listings.length} properties found
                                {university && (
                                    <Tooltip title="Properties within 5km of the university are highlighted in the map">
                                        <InfoCircleOutlined className="ml-2 text-primaryBgColor" />
                                    </Tooltip>
                                )}
                            </p>
                        </div>
                        
                        {university && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Distance from university:</span>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 rounded-full bg-green-700 bg-opacity-20 border border-green-700"></div>
                                    <span className="text-sm font-medium">5km radius</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Spin size="large" />
                </div>
            ) : (
                <div className="w-full h-[calc(100vh-120px)]" key={university?._id || 'no-university'}>
                    {university ? (
                        <>
                            {/* Add a key that will force a complete re-render when data changes */}
                            <SearchMapboxMap
                                ref={mapRef}
                                initialCenter={
                                    university.location?.coordinates 
                                        ? [university.location.coordinates.longitude, university.location.coordinates.latitude]
                                        : [79.8612, 6.9271] // Default to Colombo
                                }
                                initialZoom={13}
                                universityLocation={getUniversityLocation()}
                                properties={getFormattedProperties()}
                                radiusKm={radiusKm}
                                key={`search-map-${university._id}-${listings.length}-${Date.now()}`} // Force new component on any data change
                            />
                            
                            {listings.length === 0 && (
                                <div className="absolute top-20 left-4 bg-red-100 p-3 rounded-lg shadow-md z-20 border border-red-300">
                                    <p className="text-red-700 text-sm">No properties found to display on map</p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex justify-center items-center py-20">
                            <p className="text-gray-500">No university found for your search.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Search;