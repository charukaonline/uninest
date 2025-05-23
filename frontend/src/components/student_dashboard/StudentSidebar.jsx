import { useAuthStore } from '@/store/authStore';
import { notification } from 'antd';
import React, { useState, useEffect } from 'react'
import { FaBell, FaInbox } from 'react-icons/fa';
import { IoMdHelpCircle } from 'react-icons/io';
import { IoSettings } from 'react-icons/io5';
import { MdDashboard, MdFeedback } from 'react-icons/md';
import { RiCalendarScheduleFill, RiLogoutBoxLine } from 'react-icons/ri';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import FeedbackForm from '@/components/include/FeedbackForm';

const StudentSidebar = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showFeedbackForm, setShowFeedbackForm] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const { userId, email } = useParams();
    const { user, logout } = useAuthStore();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/auth/user-signin");
        } catch (error) {
            notification.error({ message: 'Logout failed', description: 'An error occurred while trying to logout' });
        }
    }

    const handleFeedbackClick = (e) => {
        e.preventDefault();
        setShowFeedbackForm(true);
    };

    const isActive = (path) => location.pathname === path;

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!user?._id) return;

            try {
                const response = await axios.get(`http://localhost:5000/api/notifications/user/${user._id}`);

                if (response.data && response.data.notifications) {
                    const notifs = response.data.notifications;
                    setNotifications(notifs);
                    setUnreadCount(notifs.filter(n => !n.read).length);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();

        const intervalId = setInterval(fetchNotifications, 60000);

        return () => clearInterval(intervalId);
    }, [user]);

    const topLinks = [
        { name: 'Dashboard', path: `/student/${userId}/${email}`, icon: <MdDashboard />, txtColor: '#7F7F7F' },
        { name: 'Inbox', path: `/student/${userId}/${email}/inbox`, icon: <FaInbox />, txtColor: '#7F7F7F' },
        { name: 'Schedule', path: `/student/${userId}/${email}/schedule`, icon: <RiCalendarScheduleFill />, txtColor: '#7F7F7F' },
        {
            name: 'Notifications',
            path: `/student/${userId}/${email}/notifications`,
            icon: <FaBell />,
            txtColor: '#7F7F7F',
            badge: unreadCount > 0
        },
        { name: 'Settings', path: `/student/${userId}/${email}/settings`, icon: <IoSettings />, txtColor: '#7F7F7F' },
    ];

    const lastLinks = [
        { 
            name: 'Give Feedback', 
            path: `/student/${userId}/${email}/feedback`, 
            icon: <MdFeedback />, 
            txtColor: '#7F7F7F',
            onClick: handleFeedbackClick 
        },
        { name: 'Help & Support', path: `/student/${userId}/${email}/help-support`, icon: <IoMdHelpCircle />, txtColor: '#7F7F7F' },
        { name: 'Logout', icon: <RiLogoutBoxLine />, txtColor: '#F10A0A', onclick: handleLogout },
    ];

    return (
        <div className="bg-[#181818] h-screen fixed w-52 border-r border-gray-300 p-4 flex flex-col">

            {/* Profile Section */}
            <div className="flex flex-col items-center space-y-2">
                <div className=' w-14 h-14 flex items-center justify-center rounded-full bg-primaryBgColor text-white text-xl font-bold'>
                    {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                </div>
                <h1 className="text-xl font-semibold text-white">{user.username}</h1>
            </div>

            {/* Link Section */}
            <ul className=' mt-8 space-y-3'>
                {topLinks.map((link, index) => (
                    <li key={index}>
                        <Link
                            to={link.path}
                            style={{ color: isActive(link.path) ? '#FFFFFF' : link.txtColor }}
                            className={`flex items-center gap-5 p-1 rounded ${isActive(link.path) ? "bg-[#030303] border-r-4 border-green-500" : "hover:text-white"}`}
                        >
                            <div className="relative">
                                <span className='text-lg'>{link.icon}</span>
                                {link.badge && (
                                    <span className="absolute -top-2 -right-2 bg-primaryBgColor text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </div>
                            <span className='text-base'>{link.name}</span>
                        </Link>
                    </li>
                ))}
            </ul>

            <ul className='mt-auto space-y-3 mb-4'>
                {lastLinks.map((link, index) => (
                    <li key={index}>
                        {
                            link.name === 'Logout' ? (
                                <button
                                    onClick={handleLogout}
                                    style={{ color: isActive(link.path) ? '#FFFFFF' : link.txtColor }}
                                    className={`flex items-center gap-5 p-1 rounded ${isActive(link.path) ? "bg-[#212121] border-r-4 border-green-500" : "hover:text-white"}`}
                                >
                                    <span className="text-lg">{link.icon}</span>
                                    <span className="text-base">{link.name}</span>
                                </button>
                            ) : link.name === 'Give Feedback' ? (
                                <button
                                    onClick={handleFeedbackClick}
                                    style={{ color: isActive(link.path) ? '#FFFFFF' : link.txtColor }}
                                    className={`flex items-center gap-5 p-1 rounded ${isActive(link.path) ? "bg-[#212121] border-r-4 border-green-500" : "hover:text-white"}`}
                                >
                                    <span className="text-lg">{link.icon}</span>
                                    <span className="text-base">{link.name}</span>
                                </button>
                            ) : (
                                <Link
                                    to={link.path}
                                    style={{ color: isActive(link.path) ? '#FFFFFF' : link.txtColor }}
                                    className={`flex items-center gap-5 p-1 rounded ${isActive(link.path) ? "bg-[#212121] border-r-4 border-green-500" : "hover:text-white"}`}
                                >
                                    <span className="text-lg">{link.icon}</span>
                                    <span className="text-base">{link.name}</span>
                                </Link>
                            )
                        }
                    </li>
                ))}
            </ul>

            {/* Feedback Form Modal */}
            <FeedbackForm 
                isOpen={showFeedbackForm}
                onClose={() => setShowFeedbackForm(false)}
                userType="student"
                userId={user?._id}
            />
        </div>
    )
}

export default StudentSidebar