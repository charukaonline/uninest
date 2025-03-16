import Sidebar from '@/components/admin_dashboard/Sidebar'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Table, Tag, Button, notification, Modal, Space, Input, Alert } from 'antd'
import { ExclamationCircleOutlined, SearchOutlined, WarningOutlined } from '@ant-design/icons'

const { confirm } = Modal

const Report = () => {
    const [spamReviews, setSpamReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchText, setSearchText] = useState('')

    useEffect(() => {
        fetchSpamReviews()
    }, [])

    const fetchSpamReviews = async () => {
        try {
            setLoading(true)
            const response = await axios.get('http://localhost:5000/api/review/spam-reviews', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('adminToken')}`
                }
            })

            if (response.data.success) {
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
        })
    }

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
        }
    ]

    return (
        <div className="flex h-full bg-gray-100 min-h-screen">
            <div><Sidebar /></div>

            <div style={{ marginLeft: '230px' }} className="flex-1 p-6">
                <h1 className="text-2xl font-bold mb-6">Flagged Inappropriate Reviews</h1>
                
                <Alert 
                    message="Strict Content Policy" 
                    description="Our platform maintains a zero-tolerance policy for spam, misleading information, and inappropriate content. All flagged reviews are subject to deletion to maintain platform integrity." 
                    type="warning" 
                    showIcon
                    icon={<WarningOutlined />}
                    className="mb-6"
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
            </div>
        </div>
    )
}

export default Report