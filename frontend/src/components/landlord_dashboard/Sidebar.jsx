import { useLandlordAuthStore } from '@/store/landlordAuthStore';
import { LayoutDashboard, Users } from 'lucide-react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react';
import { MdDashboard } from "react-icons/md";
import { MdAddLocationAlt } from "react-icons/md";
import { FaHouseChimney, FaInbox } from "react-icons/fa6";
import { SiGoogleanalytics } from "react-icons/si";
import { IoSettings, IoPricetags } from "react-icons/io5";
import { MdFeedback } from "react-icons/md";
import { IoMdHelpCircle } from "react-icons/io";
import { RiLogoutBoxLine } from "react-icons/ri";
import { notification } from 'antd';
import FeedbackForm from '@/components/include/FeedbackForm';

const Sidebar = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const { landlordId, email } = useParams();
    const { landlord, landlordLogout } = useLandlordAuthStore();
    const [showFeedbackForm, setShowFeedbackForm] = useState(false);

    const handleLogout = async () => {
        try {
            await landlordLogout();
            navigate("/auth/houseowner-signin");
        } catch (error) {
            console.error("Logout failed:", error);
            notification.error({ message: 'Logout failed', description: 'An error occurred while trying to logout' });
        }
    }

    const handleFeedbackClick = (e) => {
        e.preventDefault();
        setShowFeedbackForm(true);
    };

    const isActive = (path) => location.pathname === path;

    const topLinks = [
        { name: 'Dashboard', path: `/landlord/${landlordId}/${email}`, icon: <MdDashboard />, txtColor: '#7F7F7F' },
        { name: 'Add Listing', path: `/landlord/${landlordId}/${email}/add-listings`, icon: <MdAddLocationAlt />, txtColor: '#7F7F7F' },
        { name: 'My Listings', path: `/landlord/${landlordId}/${email}/my-listings`, icon: <FaHouseChimney />, txtColor: '#7F7F7F' },
        { name: 'Inbox', path: `/landlord/${landlordId}/${email}/inbox`, icon: <FaInbox />, txtColor: '#7F7F7F' },
        { name: 'Pricing', path: `/landlord/${landlordId}/${email}/pricing`, icon: <IoPricetags />, txtColor: '#7F7F7F' },
        { name: 'Settings', path: '/house-owner/settings', icon: <IoSettings />, txtColor: '#7F7F7F' },
    ];

    const lastLinks = [
        { 
            name: 'Give Feedback', 
            path: '/house-owner/feedback', 
            icon: <MdFeedback />, 
            txtColor: '#7F7F7F', 
            onClick: handleFeedbackClick
        },
        // { name: 'Help & Support', path: '/house-owner/help-support', icon: <IoMdHelpCircle />, txtColor: '#7F7F7F' },
        { name: 'Logout', icon: <RiLogoutBoxLine />, txtColor: '#F10A0A', onclick: handleLogout },
    ];

    return (
        <div className="bg-[#181818] h-screen fixed w-52 border-r border-gray-300 p-4">

            {/* Profile Section */}
            <div className="flex flex-col items-center space-y-2">
                <div className=' w-14 h-14 flex items-center justify-center rounded-full bg-primaryBgColor text-white text-xl font-bold'>
                    {landlord.email ? landlord.email.charAt(0).toUpperCase() : 'U'}
                </div>
                <h1 className="text-xl font-semibold text-white">Welcome, {landlord.username}</h1>
            </div>

            {/* Links Section */}
            <ul className="mt-8 space-y-3">
                {topLinks.map((link, index) => (
                    <li key={index}>
                        <Link
                            to={link.path}
                            style={{ color: isActive(link.path) ? '#FFFFFF' : link.txtColor }}
                            className={`flex items-center gap-5 p-1 rounded ${isActive(link.path) ? "bg-[#030303] border-r-4 border-green-500" : "hover:text-white"}`}
                        >
                            <span className="text-lg">{link.icon}</span>
                            <span className="text-base">{link.name}</span>
                        </Link>
                    </li>
                ))}
            </ul>

            <ul className="mt-10 space-y-3">
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
                userType="landlord"
                userId={landlord?._id}
            />
        </div>
    )
}

export default Sidebar