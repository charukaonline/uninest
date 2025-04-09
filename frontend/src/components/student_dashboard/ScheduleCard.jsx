import React from 'react'
import { Card, Typography, Divider, Tag } from 'antd'
import { RiCalendarScheduleFill, RiTimeLine, RiMapPin2Line, RiPhoneLine, RiMailLine, RiUser3Line } from 'react-icons/ri'
import { format } from 'date-fns'

const { Title, Text } = Typography;

const ScheduleCard = ({ schedule, isUpcoming }) => {
    const propertyImage = schedule.listingId?.propertyImages?.[0] || 'https://via.placeholder.com/150?text=No+Image';

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
            className={`overflow-hidden ${isUpcoming ? 'border-green-400' : 'border-gray-300'}`}
        >
            <div className="flex flex-col sm:flex-row gap-4">
                <img
                    src={propertyImage}
                    alt={schedule.listingId?.propertyName || 'Property'}
                    className="w-full sm:w-32 h-32 object-cover rounded-md"
                />
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <Title level={5} className="mb-1">{schedule.listingId?.propertyName || 'Unknown Property'}</Title>
                        {isUpcoming && <Tag color="green">Upcoming</Tag>}
                        {!isUpcoming && <Tag color="gray">Past</Tag>}
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