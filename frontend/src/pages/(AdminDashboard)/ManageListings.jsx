import Sidebar from '@/components/admin_dashboard/Sidebar'
import useListingStore from '@/store/listingStore';
import React, { useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import Map from '@/components/include/Map';
import { Building2, X } from 'lucide-react';

const ManageListings = () => {
    const { listings, loading, error, fetchAllListings } = useListingStore();
    const [selectedListing, setSelectedListing] = React.useState(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [showMap, setShowMap] = React.useState(false);
    const modalRef = React.useRef(null);

    // Close modal when clicking outside
    React.useEffect(() => {
        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setIsModalOpen(false);
            }
        }

        if (isModalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isModalOpen]);

    // Add ESC key listener
    React.useEffect(() => {
        function handleEsc(event) {
            if (event.keyCode === 27) {
                setIsModalOpen(false);
            }
        }

        if (isModalOpen) {
            document.addEventListener('keydown', handleEsc);
        } else {
            document.removeEventListener('keydown', handleEsc);
        };

        return () => {
            document.removeEventListener('keydown', handleEsc);
        };
    }, [isModalOpen]);

    useEffect(() => {
        fetchAllListings();
        document.title = `${listings.length} All Listings`
    }, [fetchAllListings, listings.length])

    const handleRowClick = (listing) => {
        setSelectedListing(listing);
        setIsModalOpen(true);
        // Reset to details view when opening a new listing
        setShowMap(false);
    };

    // Prevent body scroll when modal is open
    React.useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isModalOpen]);

    return (
        <div className="flex">
            <div><Sidebar /></div>

            <div style={{ marginLeft: '230px' }} className=" w-full">
                <div className="flex-1 p-8 overflow-hidden flex flex-col">
                    <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
                        <Building2 className="text-primaryBgColor mr-3 text-2xl" />
                        Manage Listings
                    </h1>

                    <Card>
                        <CardContent className="p-4">
                            <Table>
                                <TableCaption className="text-center">A list of all properties</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>House Name</TableHead>
                                        <TableHead>House Type</TableHead>
                                        <TableHead>Create Date</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {listings.map((listing) => (
                                        <TableRow
                                            key={listing._id}
                                            className="cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleRowClick(listing)}
                                        >
                                            <TableCell className="font-medium">
                                                {listing.propertyName}
                                            </TableCell>
                                            <TableCell>{listing.propertyType}</TableCell>
                                            <TableCell>
                                                {new Date(listing.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="default"
                                                    size="sm"
                                                    className="bg-orange-500 mr-2"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    Flag
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Custom Modal using divs instead of Dialog */}
                    {isModalOpen && selectedListing && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                            <div
                                ref={modalRef}
                                className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col shadow-xl"
                            >
                                {/* Modal Header */}
                                <div className="p-4 md:p-6 border-b flex items-center justify-between">
                                    <h2 className="text-xl md:text-2xl font-bold text-primaryBgColor">
                                        {selectedListing.propertyName}
                                    </h2>
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            onClick={() => setShowMap(!showMap)}
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center gap-1.5"
                                        >
                                            {showMap ? "View Details" : "View Map"}
                                        </Button>
                                        <button
                                            onClick={() => setIsModalOpen(false)}
                                            className="text-gray-500 hover:text-gray-800 transition-colors"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                </div>

                                {/* Modal Content */}
                                <div className="overflow-y-auto flex-1">
                                    {!showMap ? (
                                        <div className="p-4 md:p-6">
                                            {/* Display property images if available */}
                                            {(selectedListing.images && selectedListing.images.length > 0) ? (
                                                <div className="mb-6">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                                        {selectedListing.images.slice(0, 3).map((image, index) => (
                                                            <img
                                                                key={index}
                                                                src={typeof image === 'string' ? image : image.url || image.src || ''}
                                                                alt={`Property ${index + 1}`}
                                                                className="w-full h-32 sm:h-40 md:h-48 object-cover rounded-md"
                                                                onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : selectedListing.image ? (
                                                <div className="mb-6">
                                                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-2">
                                                        <img
                                                            src={typeof selectedListing.image === 'string' ?
                                                                selectedListing.image :
                                                                selectedListing.image.url || selectedListing.image.src || ''}
                                                            alt="Property"
                                                            className="w-full h-32 sm:h-40 md:h-48 object-cover rounded-md"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            ) : selectedListing.imageUrls && selectedListing.imageUrls.length > 0 ? (
                                                // Alternative image array field that might be used
                                                <div className="mb-6">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                                        {selectedListing.imageUrls.slice(0, 3).map((image, index) => (
                                                            <img
                                                                key={index}
                                                                src={typeof image === 'string' ? image : image.url || image.src || ''}
                                                                alt={`Property ${index + 1}`}
                                                                className="w-full h-32 sm:h-40 md:h-48 object-cover rounded-md"
                                                                onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                // Fallback for listings without images
                                                <div className="mb-6">
                                                    <div className="grid grid-cols-1 gap-2">
                                                        <div className="w-full h-32 sm:h-40 md:h-48 bg-gray-100 rounded-md flex items-center justify-center">
                                                            <p className="text-gray-500">No images available</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                                <div className="space-y-3 md:space-y-4">
                                                    <div className="bg-gray-50 p-3 md:p-4 rounded-md">
                                                        <h3 className="text-sm font-medium text-gray-500 mb-1">Property Type</h3>
                                                        <p className="font-semibold text-gray-900">{selectedListing.propertyType}</p>
                                                    </div>

                                                    <div className="bg-gray-50 p-3 md:p-4 rounded-md">
                                                        <h3 className="text-sm font-medium text-gray-500 mb-1">Monthly Rent</h3>
                                                        <p className="font-bold text-lg text-primaryBgColor">Rs. {selectedListing.monthlyRent?.toLocaleString() || "N/A"}</p>
                                                    </div>

                                                    <div className="bg-gray-50 p-3 md:p-4 rounded-md">
                                                        <h3 className="text-sm font-medium text-gray-500 mb-1">Nearest University</h3>
                                                        <p className="font-semibold text-gray-900">{selectedListing.nearestUniversity}</p>
                                                    </div>

                                                    <div className="bg-gray-50 p-3 md:p-4 rounded-md">
                                                        <h3 className="text-sm font-medium text-gray-500 mb-1">Created Date</h3>
                                                        <p className="font-semibold text-gray-900">{new Date(selectedListing.createdAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-3 md:space-y-4">
                                                    <div className="bg-gray-50 p-3 md:p-4 rounded-md">
                                                        <h3 className="text-sm font-medium text-gray-500 mb-1">Address</h3>
                                                        <p className="font-semibold text-gray-900">{selectedListing.address}</p>
                                                    </div>

                                                    <div className="bg-gray-50 p-3 md:p-4 rounded-md">
                                                        <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                                                        <p className="text-gray-700 max-h-24 md:max-h-36 overflow-y-auto text-sm md:text-base">{selectedListing.description}</p>
                                                    </div>

                                                    <div className="bg-gray-50 p-3 md:p-4 rounded-md">
                                                        <h3 className="text-sm font-medium text-gray-500 mb-1">Owner Details</h3>
                                                        <p className="font-semibold text-gray-900">
                                                            {selectedListing.landlordName || 'Name not provided'}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            {selectedListing.landlordContact || 'Contact not provided'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-[400px] w-full items-center justify-center">
                                            {console.log("Map coordinates:", selectedListing)}
                                            <Map
                                                selectedLocations={[selectedListing.coordinates]}
                                                initialCenter={[
                                                    selectedListing.coordinates.latitude,
                                                    selectedListing.coordinates.longitude
                                                ]}
                                                initialZoom={16}
                                                pinColor="red"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Modal Footer */}
                                <div className="p-4 md:p-6 border-t flex flex-wrap items-center justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setIsModalOpen(false)}
                                        className="mr-2"
                                    >
                                        Close
                                    </Button>
                                    <Button
                                        variant="default"
                                        size="sm"
                                        className="bg-orange-500 mr-2"
                                    >
                                        Flag Listing
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                    >
                                        Delete Listing
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ManageListings