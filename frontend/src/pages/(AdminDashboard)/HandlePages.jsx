import Sidebar from '@/components/admin_dashboard/Sidebar'
import React, { useState, useEffect } from 'react'
import { Switch, Table, message as antMessage } from 'antd'
import axios from 'axios'

const API_URL = import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/page-status"
    : "/api/page-status";

const HandlePages = () => {
    const [pageStatus, setPageStatus] = useState({});
    const [loading, setLoading] = useState(true);
    const [messageText, setMessageText] = useState('');
    const [routes, setRoutes] = useState([]);

    useEffect(() => {
        // Initialize default page statuses if needed
        const initializeDefaultPages = async () => {
            try {
                await axios.post(`${API_URL}/initialize`, {}, { withCredentials: true });
            } catch (error) {
                console.error('Error initializing default pages:', error);
            }
        };

        // Fetch current page status from API
        const fetchPageStatus = async () => {
            try {
                setLoading(true);
                const response = await axios.get(API_URL);

                if (response.data.success) {
                    const pages = response.data.data;

                    // Convert array to more usable format for our component
                    const statusMap = {};
                    const routesData = [];

                    pages.forEach(page => {
                        statusMap[page.path] = page.isOnline;
                        routesData.push({
                            path: page.path,
                            name: page.name
                        });
                    });

                    setPageStatus(statusMap);
                    setRoutes(routesData);
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching page status:', error);
                antMessage.error('Failed to load page statuses');
                setLoading(false);
            }
        };

        initializeDefaultPages()
            .then(() => fetchPageStatus())
            .catch(error => console.error('Startup error:', error));
    }, []);

    // Document title
    useEffect(() => {
        document.title = 'Manage Website Pages';
    }, []);

    const togglePageStatus = async (path, name) => {
        try {
            const newOnlineStatus = !pageStatus[path];

            // Optimistic update
            setPageStatus(prev => ({
                ...prev,
                [path]: newOnlineStatus
            }));

            // Call API to update
            const response = await axios.post(`${API_URL}/update`, {
                path,
                name,
                isOnline: newOnlineStatus
            }, { withCredentials: true });

            if (response.data.success) {
                const statusMessage = `${path} is now ${newOnlineStatus ? 'online' : 'in maintenance mode'}`;
                antMessage.success(statusMessage);
                setMessageText(statusMessage);
                setTimeout(() => setMessageText(''), 3000);
            } else {
                // Revert if API call fails
                setPageStatus(prev => ({
                    ...prev,
                    [path]: !newOnlineStatus
                }));
                throw new Error(response.data.message || 'Update failed');
            }
        } catch (error) {
            console.error('Error updating page status:', error);
            antMessage.error('Failed to update page status');
            // Revert on error if not already done
            setPageStatus(prev => ({
                ...prev,
                [path]: !pageStatus[path]
            }));
        }
    };

    const columns = [
        {
            title: 'Page Path',
            dataIndex: 'path',
            key: 'path',
        },
        {
            title: 'Page Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Status',
            key: 'status',
            render: (_, record) => (
                <span className={`px-2 py-1 text-xs rounded-full ${pageStatus[record.path] ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {pageStatus[record.path] ? 'Online' : 'Maintenance'}
                </span>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Switch
                    checked={pageStatus[record.path] || false}
                    onChange={() => togglePageStatus(record.path, record.name)}
                    size="small"
                />
            ),
        },
    ];

    return (
        <div className="flex">
            <div><Sidebar /></div>

            <div style={{ marginLeft: '230px' }} className="w-full p-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold mb-6">Manage Website Pages</h1>

                    <p className="mb-6">
                        Toggle pages online or offline for maintenance.
                    </p>

                    <Table
                        dataSource={routes}
                        columns={columns}
                        rowKey="path"
                        loading={loading}
                        pagination={false}
                    />
                </div>
            </div>
        </div>
    )
}

export default HandlePages