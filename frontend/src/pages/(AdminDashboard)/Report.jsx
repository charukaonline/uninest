import Sidebar from '@/components/admin_dashboard/Sidebar'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Table, Tag, Button, notification, Modal, Space, Input, Alert } from 'antd'
import { ExclamationCircleOutlined, SearchOutlined, WarningOutlined } from '@ant-design/icons'
import { FileText } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const { confirm } = Modal

const Report = () => {
    const [spamReviews, setSpamReviews] = useState([]);
    const [listingReports, setListingReports] = useState([]);

    const [loading, setLoading] = useState(true)
    const [searchText, setSearchText] = useState('')
    const [currentTab, setCurrentTab] = useState("spam-reviews");

    useEffect(() => {
        fetchSpamReviews();
        fetchListingReports();
    }, [])

    // Document Titles
    useEffect(() => {
        if (currentTab === 'spam-reviews') {
            document.title = `(${spamReviews.length}) Spam Reviews`;
        } else {
            document.title = `(${listingReports.length}) Listing Reports`;
        }
    }, [spamReviews.length, listingReports.length, currentTab]);

    const fetchSpamReviews = async () => {
        try {
            setLoading(true)
            const response = await axios.get('http://localhost:5000/api/review/spam-reviews', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('adminToken')}`
                }
            })

            if (response.data.success) {
                console.log('Spam reviews data:', response.data.reviews);
                setSpamReviews(response.data.reviews)
            }
        } catch (error) {
            console.error('Error fetching spam reviews:', error)
            notification.error({
                message: 'Error',
                description: 'Failed to load spam reviews'
            })
        } finally {
            setLoading(false)
        }
    }

    const fetchListingReports = async () => {
        try {
            setLoading(true)
            const response = await axios.get('http://localhost:5000/api/report/get-reports', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('adminToken')}`
                }
            })
            if (response.data.success) {
                console.log('Listing report data:', response.data.reports);
                const transformedReports = response.data.reports.map(report => ({
                    _id: report._id,
                    propertyName: report.listingId?.propertyName || 'Unknown Property',
                    reportReason: report.type, // Changed from reportReason to match with the type field from ListingReport model
                    reportedBy: report.reporterId?.name || report.reporterId?.email || 'Anonymous',
                    description: report.description,
                    createdAt: report.createdAt
                }));
                setListingReports(transformedReports)
            }
        } catch (error) {
            console.error('Error fetching listing reports:', error)
            notification.error({
                message: 'Error',
                description: 'Failed to load listing reports'
            })
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteReview = (reviewId) => {
        confirm({
            title: 'Remove Flagged Review',
            icon: <ExclamationCircleOutlined style={{ color: 'red' }} />,
            content: 'This action will permanently delete this inappropriate review from the system.',
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    const response = await axios.delete(`http://localhost:5000/api/review/delete/${reviewId}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('adminToken')}`
                        }
                    })
                    if (response.data.success) {
                        notification.success({
                            message: 'Success',
                            description: 'Review deleted successfully'
                        })
                        fetchSpamReviews()
                    }
                } catch (error) {
                    notification.error({
                        message: 'Error',
                        description: 'Failed to delete review'
                    })
                }
            }
        });
    }

    const handleFlagListing = (reportId) => {
        confirm({
            title: 'Flag this listing?',
            icon: <ExclamationCircleOutlined style={{ color: 'red' }} />,
            content: 'This will flag the listing and hide it from users. The landlord account may also be flagged.',
            okText: 'Flag',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    const response = await axios.post(`http://localhost:5000/api/report/resolve/${reportId}`, {
                        action: 'flag'
                    }, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('adminToken')}`
                        }
                    });
                    if (response.data.success) {
                        notification.success({
                            message: 'Success',
                            description: 'Listing has been flagged successfully'
                        });
                        fetchListingReports();
                    }
                } catch (error) {
                    notification.error({
                        message: 'Error',
                        description: error.response?.data?.message || 'Failed to flag listing'
                    });
                }
            }
        });
    };

    const columns = [
        {
            title: 'Student',
            dataIndex: 'studentName',
            key: 'studentName',
        },
        {
            title: 'Property',
            dataIndex: 'propertyName',
            key: 'propertyName',
        },
        {
            title: 'Review',
            dataIndex: 'review',
            key: 'review',
            width: '30%',
            render: text => <div className="max-h-24 overflow-y-auto">{text}</div>
        },
        {
            title: 'Spam Reason',
            dataIndex: 'spamReason',
            key: 'spamReason',
            render: reason => (
                <Tag color="red">{reason}</Tag>
            )
        },
        {
            title: 'Sentiment',
            dataIndex: 'sentiment',
            key: 'sentiment',
            render: sentiment => {
                let color = 'blue';
                if (sentiment === 'positive') color = 'green';
                if (sentiment === 'negative') color = 'volcano';
                return <Tag color={color}>{sentiment}</Tag>;
            }
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: date => new Date(date).toLocaleString()
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button
                    danger
                    onClick={() => handleDeleteReview(record._id)}
                >
                    Delete Review
                </Button>
            )
        },
    ];

    const listingColumns = [
        {
            title: 'Property Name',
            dataIndex: 'propertyName',
            key: 'propertyName',
        },
        {
            title: 'Report Reason',
            dataIndex: 'reportReason', // Changed from 'type' to 'reportReason' to match the transformed data
            key: 'reportReason',
            render: reason => (
                <Tag color="red">{reason}</Tag>
            )
        },
        {
            title: 'Reported By',
            dataIndex: 'reportedBy',
            key: 'reportedBy',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: '30%',
            render: text => <div className="max-h-24 overflow-y-auto">{text}</div>
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: date => new Date(date).toLocaleString()
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button
                    danger
                    onClick={() => handleFlagListing(record._id)}
                >
                    Flag Listing
                </Button>
            )
        }
    ];

    return (
        <div className="flex h-full bg-gray-100 min-h-screen">
            <div><Sidebar /></div>
            <div style={{ marginLeft: '230px' }} className="flex-1 p-6">
                <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
                    <FileText className="text-primaryBgColor mr-3 text-2xl" />
                    Reports
                </h1>
                <Tabs defaultValue='spam-reviews' onValueChange={setCurrentTab}>
                    <TabsList>
                        <TabsTrigger
                            value="spam-reviews"
                            className="data-[state=active]:bg-primaryBgColor data-[state=active]:text-white"
                        >
                            Review Reports
                        </TabsTrigger>
                        <TabsTrigger
                            value="listing-reports"
                            className="data-[state=active]:bg-primaryBgColor data-[state=active]:text-white"
                        >
                            Listing Reports
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="spam-reviews">
                        <Alert
                            message="Strict Content Policy"
                            description="Our platform maintains a zero-tolerance policy for spam, misleading information, and inappropriate content. All flagged reviews are subject to deletion to maintain platform integrity."
                            type="warning"
                            showIcon
                            icon={<WarningOutlined />}
                            className="mb-6 mt-4"
                        />
                        <div className="bg-white p-6 rounded-lg shadow mb-6">
                            <div className="mb-4">
                                <Input
                                    placeholder="Search reviews..."
                                    prefix={<SearchOutlined />}
                                    onChange={e => setSearchText(e.target.value)}
                                    className="w-64"
                                />
                            </div>
                            <Table
                                dataSource={spamReviews.filter(review =>
                                    review.review?.toLowerCase().includes(searchText.toLowerCase()) ||
                                    review.studentName?.toLowerCase().includes(searchText.toLowerCase()) ||
                                    review.propertyName?.toLowerCase().includes(searchText.toLowerCase()) ||
                                    review.spamReason?.toLowerCase().includes(searchText.toLowerCase())
                                )}
                                columns={columns}
                                rowKey="_id"
                                loading={loading}
                                pagination={{ pageSize: 10 }}
                                locale={{ emptyText: 'No flagged reviews found' }}
                            />
                        </div>
                    </TabsContent>
                    <TabsContent value="listing-reports">
                        <Alert
                            message="Report of Inappropriate Listings"
                            description="All flagged listings are subject to review and potential removal from the platform."
                            type="warning"
                            showIcon
                            icon={<WarningOutlined />}
                            className="mb-6 mt-4"
                        />
                        <div className="bg-white p-6 rounded-lg shadow mb-6">
                            <div className="mb-4">
                                <Input
                                    placeholder='Search reports...'
                                    prefix={<SearchOutlined />}
                                    onChange={e => setSearchText(e.target.value)}
                                    className='w-64'
                                />
                            </div>
                            <Table
                                dataSource={listingReports.filter(report =>
                                    report.propertyName?.toLowerCase().includes(searchText.toLowerCase()) ||
                                    report.reportReason?.toLowerCase().includes(searchText.toLowerCase()) ||
                                    report.reportedBy?.toLowerCase().includes(searchText.toLowerCase()) ||
                                    report.description?.toLowerCase().includes(searchText.toLowerCase())
                                )}
                                columns={listingColumns}
                                rowKey="_id"
                                loading={loading}
                                pagination={{ pageSize: 10 }}
                                locale={{ emptyText: 'No reports found' }}
                            />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default Report