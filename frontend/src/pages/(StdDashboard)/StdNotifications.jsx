import React, { useEffect, useState } from 'react';
import StudentSidebar from '@/components/student_dashboard/StudentSidebar';
import { Empty, Spin, Typography, Tabs, notification } from 'antd';
import { useAuthStore } from '@/store/authStore';
import axios from 'axios';

const { Title } = Typography;

const StdNotifications = () => {
    const { user } = useAuthStore();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('unread');

    useEffect(() => {
        document.title = `(${notifications.filter(n => !n.read).length}) Notifications`;
    }, [notifications]);

    // Fetch notifications from backend
    useEffect(() => {
        const fetchNotifications = async () => {
            if (!user?._id) return;

            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:5000/api/notifications/user/${user._id}`);

                if (response.data && response.data.notifications) {
                    setNotifications(response.data.notifications);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
                notification.error({
                    message: 'Failed to load notifications',
                    description: error.response?.data?.message || 'Please try again later'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [user]);

    // Filter notifications based on active tab
    const filteredNotifications = notifications.filter(notification => {
        if (activeTab === 'unread') return !notification.read;
        if (activeTab === 'all') return true;
        return true;
    });

    // Mark notification as read
    const handleNotificationClick = async (notification) => {
        if (!notification.read) {
            try {
                await axios.patch(`http://localhost:5000/api/notifications/${notification._id}/read`);

                // Update local state to reflect change
                setNotifications(prev =>
                    prev.map(item =>
                        item._id === notification._id ? { ...item, read: true } : item
                    )
                );
            } catch (error) {
                console.error('Error marking notification as read:', error);
            }
        }
    };

    // Format notification date
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    return (
        <div className="flex bg-white">
            <div><StudentSidebar /></div>

            <div className="flex-1 ml-[220px] p-4">
                <h1 className="text-xl font-bold mb-4">Notifications</h1>

                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={[
                        { key: 'unread', label: `Unread (${notifications.filter(n => !n.read).length})` },
                        { key: 'all', label: 'All' },
                    ]}
                    className="custom-tabs"
                    tabBarStyle={{
                        color: '#7F7F7F',
                        marginBottom: '16px'
                    }}
                    tabBarGutter={8}
                    type="card"
                    tabBarActiveTextColor="#FFFFFF"
                    tabBarInactiveTextColor="#7F7F7F"
                />

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

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Spin size="large" />
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <Empty
                        description="No notifications found"
                        className="my-12"
                    />
                ) : (
                    <div className="space-y-4 mt-6">
                        {filteredNotifications.map(notification => (
                            <div
                                key={notification._id}
                                onClick={() => handleNotificationClick(notification)}
                                className={`p-4 border rounded-lg cursor-pointer transition hover:shadow-md ${!notification.read ? 'bg-gray-50 border-l-4 border-l-green-500' : ''}`}
                            >
                                <div className="flex justify-between">
                                    <h3 className="text-base font-medium">{notification.title}</h3>
                                    {!notification.read && <span className="bg-primaryBgColor text-white text-xs px-2 py-2 rounded-full">New</span>}
                                </div>
                                <p className="mt-1 text-sm font-semibold">{notification.message}</p>
                                <p className="text-sm text-gray-500 mt-2">{formatDate(notification.createdAt)}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StdNotifications;
