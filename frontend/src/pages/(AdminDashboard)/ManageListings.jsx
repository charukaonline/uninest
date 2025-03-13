import Sidebar from '@/components/admin_dashboard/Sidebar'
import { ScrollArea } from '@/components/ui/scroll-area';
import useListingStore from '@/store/listingStore';
import React, { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Map from '@/components/include/Map';
import ToggleSwitch from '@/components/listing_page/ToggleSwitch';
import { Building2 } from 'lucide-react';

const ManageListings = () => {
    const { listings, loading, error, fetchAllListings } = useListingStore();
    const [selectedListing, setSelectedListing] = React.useState(null);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [showMap, setShowMap] = React.useState(false);

    useEffect(() => {

        fetchAllListings();

        document.title = `${listings.length} All Listings`
    }, [fetchAllListings, listings.length])

    const handleRowClick = (listing) => {
        setSelectedListing(listing);
        setIsDialogOpen(true);
    };

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
                            {/* <ScrollArea className="h-[calc(100vh-130px)]"> */}
                            <Table>
                                <TableCaption className=" text-center">A list of all properties</TableCaption>
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
                                                >
                                                    Flag
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                >
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {/* </ScrollArea> */}
                        </CardContent>
                    </Card>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogContent className="max-w-4xl">
                            {selectedListing && (
                                <>
                                    <DialogHeader>
                                        <div className="flex justify-between items-center">
                                            <DialogTitle>{selectedListing.propertyName}</DialogTitle>
                                            <ToggleSwitch
                                                label={showMap ? "Show Info" : "Show Map"}
                                                checked={showMap}
                                                onChange={setShowMap}
                                            />
                                        </div>
                                    </DialogHeader>

                                    {!showMap ? (
                                        // Information View
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <h3 className="font-semibold">Property Type</h3>
                                                <p>{selectedListing.propertyType}</p>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">Description</h3>
                                                <p>{selectedListing.description}</p>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">Price</h3>
                                                <p>Rs.{selectedListing.monthlyRent}</p>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">Location</h3>
                                                <p>{selectedListing.address}</p>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">Nearest University</h3>
                                                <p>{selectedListing.nearestUniversity}</p>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">Created Date</h3>
                                                <p>{new Date(selectedListing.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        // Map View
                                        <div className="h-[500px] w-full">
                                            <Map
                                                selectedLocations={[selectedListing.coordinates]}
                                                initialCenter={[
                                                    selectedListing.coordinates.latitude,
                                                    selectedListing.coordinates.longitude
                                                ]}
                                                initialZoom={15}
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    )
}

export default ManageListings