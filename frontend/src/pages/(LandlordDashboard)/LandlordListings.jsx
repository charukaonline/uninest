import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/landlord_dashboard/Sidebar';
import { useLandlordAuthStore } from '@/store/landlordAuthStore';
import useListingStore from '@/store/listingStore';
import LoadingSpinner from '@/components/include/LoadingSpinner';
import { Link, useParams } from 'react-router-dom';
import { FaEdit, FaEye, FaTrash, FaPlus, FaBuilding, FaHome } from 'react-icons/fa';
import { Table, Input, Button, Popconfirm, notification, Tag, Modal } from 'antd';
import { SearchOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { FaCirclePause } from 'react-icons/fa6';

const LandlordListings = () => {
    const { landlordId, email } = useParams();
    const { landlord, isLandlordAuthenticated, checkLandlordAuth, isCheckingLandlordAuth } = useLandlordAuthStore();
    const { fetchLandlordListings, landlordListings, loading } = useListingStore();
    const [searchText, setSearchText] = useState('');
    const { confirm } = Modal;

    useEffect(() => {
        if (!isLandlordAuthenticated) {
            checkLandlordAuth();
        }
    }, []);

    useEffect(() => {
        if (landlord && landlord._id) {
            fetchLandlordListings(landlord._id);
        }
    }, [landlord, fetchLandlordListings]);

    useEffect(() => {
        document.title = 'My Listings';
    }, []);

    if (isCheckingLandlordAuth || loading) {
        return <LoadingSpinner />;
    }

    if (!isLandlordAuthenticated || !landlord) {
        return null;
    }

    const getStatusColor = (price) => {
        if (price > 5000) return 'green';
        if (price > 1000) return 'geekblue';
        return 'volcano';
    };

    const handleSearch = (value) => {
        setSearchText(value);
    };

    const showDeleteConfirm = (record) => {
        confirm({
            title: 'Are you sure you want to delete this listing?',
            icon: <ExclamationCircleOutlined />,
            content: `You are about to delete "${record.propertyName}". This action cannot be undone.`,
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'No, Cancel',
            centered: true, // This ensures it appears in the center of the screen
            onOk() {
                notification.info({ 
                    message: 'Delete feature coming soon',
                    description: 'This feature will be available in the next update.' 
                });
            },
        });
    };

    const columns = [
        {
            title: 'Property Name',
            dataIndex: 'propertyName',
            key: 'propertyName',
            filteredValue: searchText ? [searchText] : null,
            onFilter: (value, record) => {
                return (
                    record.propertyName.toLowerCase().includes(value.toLowerCase()) ||
                    record.address.toLowerCase().includes(value.toLowerCase()) ||
                    record.city.toLowerCase().includes(value.toLowerCase())
                );
            },
            render: (text, record) => (
                <div className="flex items-center space-x-3">
                    <img
                        src={record.images[0] || "https://via.placeholder.com/40"}
                        alt={text}
                        className="w-10 h-10 rounded-md object-cover"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/40";
                        }}
                    />
                    <span className="font-medium">{text}</span>
                </div>
            ),
        },
        {
            title: 'Location',
            dataIndex: 'address',
            key: 'address',
            render: (text, record) => (
                <span>
                    {text}, {record.city}
                </span>
            ),
        },
        {
            title: 'Type',
            dataIndex: 'propertyType',
            key: 'propertyType',
        },
        {
            title: 'Monthly Rent',
            dataIndex: 'monthlyRent',
            key: 'monthlyRent',
            sorter: (a, b) => a.monthlyRent - b.monthlyRent,
            render: (price) => (
                <Tag color={getStatusColor(price)}>
                    LKR {price.toLocaleString()}
                </Tag>
            ),
        },
        {
            title: 'Views',
            dataIndex: 'views',
            key: 'views',
            sorter: (a, b) => a.views - b.views,
        },
        {
            title: 'Created',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleDateString(),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <div className="flex space-x-2">
                    <Button
                        type="primary"
                        size="small"
                        icon={<FaEye />}
                        onClick={() => window.open(`/listing/${record._id}`, '_blank')}
                        style={{ backgroundColor: '#1890ff' }}
                    >
                        View
                    </Button>
                    <Button
                        type="primary"
                        size="small"
                        icon={<FaCirclePause />}
                        style={{ backgroundColor: '#006845' }}
                        onClick={() => notification.info({ message: 'Hold feature coming soon' })}
                    >
                        Hold
                    </Button>
                    <Button
                        type="primary"
                        danger
                        size="small"
                        icon={<FaTrash />}
                        onClick={() => showDeleteConfirm(record)}
                    >
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="flex h-full bg-gray-100 min-h-screen overflow-y-hidden">
            <Sidebar className="fixed h-full" />

            <div className="flex-1 ml-[220px] p-6">
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                            <FaHome className="mr-2 text-primaryBgColor" />
                            My Listings
                        </h1>
                        <p className="text-gray-600">Manage all your property listings</p>
                    </div>
                    <div className="flex space-x-3">
                        {/* <Link to={`/landlord/${landlordId}/${email}`}>
                            <Button type="default">
                                Dashboard
                            </Button>
                        </Link> */}
                        <Link to={`/landlord/${landlordId}/${email}/add-listings`}>
                            <Button type="primary" icon={<FaPlus />} style={{ backgroundColor: '#006845' }}>
                                Add New Listing
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="mb-4">
                        <Input
                            placeholder="Search by property name, address or city..."
                            prefix={<SearchOutlined />}
                            onChange={(e) => handleSearch(e.target.value)}
                            style={{ width: 300 }}
                        />
                    </div>

                    <Table
                        dataSource={landlordListings}
                        columns={columns}
                        rowKey="_id"
                        loading={loading}
                        pagination={{
                            pageSize: 10,
                            showTotal: (total) => `Total ${total} listings`,
                        }}
                        locale={{
                            emptyText: (
                                <div className="py-8 text-center">
                                    <FaBuilding className="text-gray-300 text-4xl mx-auto mb-4" />
                                    <p className="text-gray-500 mb-4">No listings found</p>
                                    <Link to={`/landlord/${landlordId}/${email}/add-listings`}>
                                        <Button type="primary" icon={<FaPlus />} style={{ backgroundColor: '#006845' }}>
                                            Add Your New Listing
                                        </Button>
                                    </Link>
                                </div>
                            ),
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default LandlordListings;