import ListingInfoHeroSection from '@/components/listingInfo_page/ListingInfoHeroSection';
import ListingInfo01 from '@/components/listingInfo_page/ListingInfo01';
import ListingInfo02 from '@/components/listingInfo_page/ListingInfo02';
import LoadingSpinner from '@/components/include/LoadingSpinner';
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useListingStore from '@/store/listingStore';
import useMessageStore from '@/store/messageStore';
import { useAuthStore } from '@/store/authStore';
import { Modal, Input, Form, notification, Button } from 'antd';

const { TextArea } = Input;

const ListingInfo = () => {
    const { getListingById } = useListingStore();
    const { sendMessage } = useMessageStore();
    const { isAuthenticated, user } = useAuthStore();
    const navigate = useNavigate();
    const { listingId } = useParams();
    const [listing, setListing] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isContactModalVisible, setIsContactModalVisible] = useState(false);
    const [messageForm] = Form.useForm();
    const [sendingMessage, setSendingMessage] = useState(false);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const data = await getListingById(listingId);
                setListing(data);
                document.title = `${data.propertyName}`;
            } catch (err) {
                setError('Failed to load listing details');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchListing();
        window.scrollTo(0, 0);
    }, [listingId, getListingById]);

    const handleContactLandlord = () => {
        if (!isAuthenticated) {
            notification.info({
                message: 'Sign in required',
                description: 'Please sign in to contact the landlord',
                btn: (
                    <Button type="primary" onClick={() => navigate('/auth/signin')}>
                        Sign In
                    </Button>
                )
            });
            return;
        }
        
        setIsContactModalVisible(true);
    };

    const handleSubmitMessage = async (values) => {
        try {
            setSendingMessage(true);
            
            // Get landlord ID from the listing
            const landlordId = listing.landlord._id;
            
            // Send message through the message store
            await sendMessage(landlordId, values.message, listingId);
            
            notification.success({
                message: 'Message Sent',
                description: 'Your message has been sent to the landlord'
            });
            
            messageForm.resetFields();
            setIsContactModalVisible(false);
        } catch (error) {
            console.error("Message send error:", error);
            notification.error({
                message: 'Failed to Send Message',
                description: error.response?.data?.message || 
                            (error.message ? `Error: ${error.message}` : 
                            'An error occurred while sending your message')
            });
        } finally {
            setSendingMessage(false);
        }
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div className="text-center text-red-500 p-4">{error}</div>;
    }

    if (!listing) {
        return <div className="text-center p-4">Listing not found</div>;
    }

    return (
        <div className=''>
            <ListingInfoHeroSection listing={listing} onContactLandlord={handleContactLandlord} />
            <ListingInfo01 listing={listing} />
            <ListingInfo02 listing={listing} />
            
            {/* Contact Landlord Modal */}
            <Modal
                title={`Contact ${listing.landlord.username}`}
                open={isContactModalVisible}
                onCancel={() => setIsContactModalVisible(false)}
                footer={null}
                destroyOnClose
            >
                <Form 
                    form={messageForm} 
                    layout="vertical" 
                    onFinish={handleSubmitMessage}
                >
                    <Form.Item 
                        label="Message" 
                        name="message"
                        rules={[{ required: true, message: 'Please enter your message' }]}
                    >
                        <TextArea 
                            rows={4} 
                            placeholder={`Ask ${listing.landlord.username} about "${listing.propertyName}"...`}
                        />
                    </Form.Item>
                    
                    <div className="flex justify-end space-x-3">
                        <Button 
                            onClick={() => setIsContactModalVisible(false)}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            loading={sendingMessage}
                            style={{ backgroundColor: '#006845' }}
                        >
                            Send Message
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    )
}

export default ListingInfo
