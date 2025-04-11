import React, { useEffect, useState } from 'react'
import { Card, Typography, Divider, Tag } from 'antd'
import { RiCalendarScheduleFill, RiTimeLine, RiMapPin2Line, RiPhoneLine, RiMailLine, RiUser3Line } from 'react-icons/ri'
import { format } from 'date-fns'

const { Title, Text } = Typography;

const ScheduleCard = ({ schedule, isUpcoming }) => {
    const [imageUrl, setImageUrl] = useState('');
    
    // Log the listing data to debug
    useEffect(() => {
        console.log("Listing data:", schedule.listingId);
        
        const listing = schedule.listingId;
        if (!listing) return;
        
        // Check all possible image field paths
        if (listing.images && listing.images.length > 0) {
            console.log("Found image in images array:", listing.images[0]);
            setImageUrl(listing.images[0]);
        } else if (listing.propertyImages && listing.propertyImages.length > 0) {
            console.log("Found image in propertyImages array:", listing.propertyImages[0]);
            setImageUrl(listing.propertyImages[0]);
        } else if (listing.image) {
            console.log("Found image in image field:", listing.image);
            setImageUrl(listing.image);
        } else {
            // Try other possible paths
            const possiblePaths = [
                'propertyImage',
                'thumbnail',
                'photo',
                'featuredImage'
            ];
            
            for (const path of possiblePaths) {
                if (listing[path]) {
                    console.log(`Found image in ${path}:`, listing[path]);
                    setImageUrl(listing[path]);
                    break;
                }
            }
        }
    }, [schedule]);

    const formatDateDisplay = (dateStr) => {
        try {
            const date = new Date(dateStr);
            return format(date, 'MMM dd, yyyy');
        } catch (error) {
            return dateStr;
        }
    };

    return (
        <Card
            hoverable
            className={`overflow-hidden ${
                schedule.status === 'rejected' ? 'border-orange-400' :
                schedule.status === 'cancelled' ? 'border-red-400' :
                isUpcoming ? 'border-green-400' : 'border-gray-300'
            }`}
        >
            <div className="flex flex-col sm:flex-row gap-4">
                <img
                    src={imageUrl}
                    alt={schedule.listingId?.propertyName || 'Property'}
                    className="w-full sm:w-32 h-32 object-cover rounded-md"
                    onError={(e) => {
                        console.log("Image failed to load:", e.target.src);
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                    }}
                />
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <Title level={5} className="mb-1">{schedule.listingId?.propertyName || 'Unknown Property'}</Title>
                        {schedule.status === 'rejected' ? (
                            <Tag color="orange">Rejected</Tag>
                        ) : schedule.status === 'cancelled' ? (
                            <Tag color="red">Cancelled</Tag>
                        ) : isUpcoming ? (
                            <Tag color="green">Upcoming</Tag>
                        ) : (
                            <Tag color="gray">Past</Tag>
                        )}
                    </div>

                    <div className="text-sm space-y-2 mt-2">
                        <div className="flex items-center gap-2">
                            <RiCalendarScheduleFill className="text-green-600" />
                            <span>{formatDateDisplay(schedule.date)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <RiTimeLine className="text-green-600" />
                            <span>{schedule.time}</span>
                        </div>

                        {schedule.listingId?.location && (
                            <div className="flex items-center gap-2">
                                <RiMapPin2Line className="text-green-600" />
                                <span>{schedule.listingId.location.city}, {schedule.listingId.location.province}</span>
                            </div>
                        )}
                    </div>

                    <Divider className="my-2" />

                    <div className="text-sm">
                        <Text type="secondary" className="flex items-center gap-1">
                            <RiUser3Line /> Landlord: {schedule.landlordId?.username || 'Unknown'}
                        </Text>

                        {schedule.landlordId?.phone && (
                            <Text type="secondary" className="flex items-center gap-1 mt-1">
                                <RiPhoneLine /> {schedule.landlordId.phone}
                            </Text>
                        )}

                        {schedule.landlordId?.email && (
                            <Text type="secondary" className="flex items-center gap-1 mt-1">
                                <RiMailLine /> {schedule.landlordId.email}
                            </Text>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ScheduleCard