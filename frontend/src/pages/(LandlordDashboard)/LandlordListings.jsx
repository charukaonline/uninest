import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/landlord_dashboard/Sidebar';
import { useLandlordAuthStore } from '@/store/landlordAuthStore';
import useListingStore from '@/store/listingStore';
import LoadingSpinner from '@/components/include/LoadingSpinner';
import { Link, useParams } from 'react-router-dom';
import { FaEdit, FaEye, FaTrash, FaPlus, FaBuilding, FaHome, FaChartLine } from 'react-icons/fa';
import { Input, Button, Popconfirm, notification, Tag, Modal, Card, Avatar, Row, Col, Pagination, Empty } from 'antd';
import { SearchOutlined, ExclamationCircleOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { FaCirclePause } from 'react-icons/fa6';

const LandlordListings = () => {
    const { landlordId, email } = useParams();
    const { landlord, isLandlordAuthenticated, checkLandlordAuth, isCheckingLandlordAuth } = useLandlordAuthStore();
    const { fetchLandlordListings, landlordListings, loading } = useListingStore();
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);
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
        setCurrentPage(1);
    };

    const showDeleteConfirm = (record) => {
        confirm({
            title: 'Are you sure you want to delete this listing?',
            icon: <ExclamationCircleOutlined />,
            content: `You are about to delete "${record.propertyName}". This action cannot be undone.`,
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'No, Cancel',
            centered: true,
            onOk() {
                notification.info({
                    message: 'Delete feature coming soon',
                    description: 'This feature will be available in the next update.'
                });
            },
        });
    };

    // Filter listings based on search text
    const filteredListings = landlordListings.filter(listing =>
        listing.propertyName.toLowerCase().includes(searchText.toLowerCase()) ||
        listing.address.toLowerCase().includes(searchText.toLowerCase()) ||
        listing.city.toLowerCase().includes(searchText.toLowerCase())
    );

    // Pagination calculation
    const paginatedListings = filteredListings.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

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
                        <Link to={`/landlord/${landlordId}/${email}/add-listings`}>
                            <Button type="primary" icon={<FaPlus />} style={{ backgroundColor: '#006845' }}>
                                Add New Listing
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="mb-4 flex justify-between items-center">
                        <Input
                            placeholder="Search by property name, address or city..."
                            prefix={<SearchOutlined />}
                            onChange={(e) => handleSearch(e.target.value)}
                            style={{ width: 300 }}
                        />
                        <div>
                            <span className="mr-2 text-gray-600">
                                Showing {Math.min(filteredListings.length, 1 + (currentPage - 1) * pageSize)}-
                                {Math.min(currentPage * pageSize, filteredListings.length)} of {filteredListings.length} listings
                            </span>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <LoadingSpinner />
                        </div>
                    ) : filteredListings.length === 0 ? (
                        <Empty
                            image={<FaBuilding className="text-gray-300 text-6xl" />}
                            description={
                                <div>
                                    <p className="text-gray-500 mb-4">No listings found</p>
                                    <Link to={`/landlord/${landlordId}/${email}/add-listings`}>
                                        <Button type="primary" icon={<FaPlus />} style={{ backgroundColor: '#006845' }}>
                                            Add Your New Listing
                                        </Button>
                                    </Link>
                                </div>
                            }
                        />
                    ) : (
                        <>
                            <Row gutter={[16, 16]}>
                                {paginatedListings.map(listing => (
                                    <Col xs={24} sm={12} md={8} lg={8} key={listing._id}>
                                        <Card
                                            hoverable
                                            className="h-full flex flex-col"
                                            cover={
                                                <div className="h-48 overflow-hidden relative">
                                                    <img
                                                        alt={listing.propertyName}
                                                        src={listing.images[0] || ""}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = "";
                                                        }}
                                                    />
                                                </div>
                                            }
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-1">
                                                    <h3 className="text-lg font-medium truncate flex-1">{listing.propertyName}</h3>

                                                    <Tag style={{ backgroundColor: '#006845', color: 'white', marginRight: '8px' }}>
                                                        LKR {listing.monthlyRent.toLocaleString()}
                                                    </Tag>
                                                </div>
                                                <p className="text-gray-500 flex items-center mb-2 text-sm">
                                                    <EnvironmentOutlined className="mr-1" />
                                                    {listing.address}, {listing.city}
                                                </p>
                                                <div className="flex justify-between items-center mb-2">
                                                    <Tag color="blue">{listing.propertyType}</Tag>
                                                    <span className="text-sm text-gray-500">{new Date(listing.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    <span className="font-semibold">Views:</span> {listing.views}
                                                </p>
                                            </div>

                                            <div className="flex flex-col space-y-2 mt-auto pt-3 border-t">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <Button
                                                        type="primary"
                                                        size="small"
                                                        icon={<FaEye />}
                                                        onClick={() => window.open(`/listing/${listing._id}`, '_blank')}
                                                        style={{ backgroundColor: '#1890ff' }}
                                                    >
                                                        View
                                                    </Button>
                                                    <Button
                                                        type="primary"
                                                        size="small"
                                                        icon={<FaChartLine />}
                                                        onClick={() => notification.info({ message: 'Analytics feature coming soon' })}
                                                        style={{ backgroundColor: '#722ED1' }}
                                                    >
                                                        Analytics
                                                    </Button>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
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
                                                        onClick={() => showDeleteConfirm(listing)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>

                            <div className="mt-6 flex justify-center">
                                <Pagination
                                    current={currentPage}
                                    pageSize={pageSize}
                                    total={filteredListings.length}
                                    onChange={(page) => setCurrentPage(page)}
                                    showSizeChanger={false}
                                    showQuickJumper
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LandlordListings;