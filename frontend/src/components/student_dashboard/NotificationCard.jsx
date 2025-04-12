import React from 'react';
import { Card, Typography, Badge, Space } from 'antd';
import { format } from 'date-fns';
import { 
    RiCalendarScheduleFill, 
    RiMessage2Fill, 
    RiInformationFill, 
    RiStarFill, 
    RiBuildingFill 
} from 'react-icons/ri';

const { Text, Title } = Typography;

const NotificationCard = ({ notification, onClick }) => {
    const { type, title, message, createdAt, read } = notification;

    // Format the date nicely
    const formattedDate = format(new Date(createdAt), 'MMM dd, yyyy • h:mm a');

    // Determine icon based on notification type
    const getIcon = () => {
        switch (type) {
            case 'property_update':
                return <RiCalendarScheduleFill className="text-2xl text-green-600" />;
            case 'message':
                return <RiMessage2Fill className="text-2xl text-blue-500" />;
            case 'review':
                return <RiStarFill className="text-2xl text-amber-500" />;
            case 'system':
                return <RiInformationFill className="text-2xl text-purple-500" />;
            case 'account':
                return <RiBuildingFill className="text-2xl text-orange-500" />;
            default:
                return <RiInformationFill className="text-2xl text-gray-500" />;
        }
    };

    // Determine card background based on read status
    const cardClassName = `cursor-pointer transition hover:shadow-md ${!read ? 'bg-gray-50' : 'bg-white'}`;

    return (
        <Badge.Ribbon text={read ? '' : 'New'} color="green" style={{ display: read ? 'none' : 'block' }}>
            <Card className={cardClassName} onClick={onClick}>
                <div className="flex gap-4">
                    <div className="flex-shrink-0">{getIcon()}</div>
                    <div className="flex-1">
                        <Title level={5} className="mb-1">{title}</Title>
                        <Text className="block mb-2">{message}</Text>
                        <Text type="secondary" className="text-xs">{formattedDate}</Text>
                    </div>
                </div>
            </Card>
        </Badge.Ribbon>
    );
};

export default NotificationCard;
