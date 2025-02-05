import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import HouseownerSignup1 from '@/components/signup_pages/HouseownerSignup1';
import HouseownerSignup2 from '@/components/signup_pages/HouseownerSignup2';
import { landlordSignup } from '@/services/api';

const HouseownerSignupPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);

    const handleFirstStepSubmit = async (values) => {
        setLoading(true);
        try {
            const response = await landlordSignup.step1(values);
            setFormData((prevData) => ({
                ...prevData,
                ...values,
                userId: response.userId,
                token: response.token
            }));
            notification.success({
                message: 'First step completed',
                description: 'Please complete your profile verification.',
            });
            setStep(2);
        } catch (error) {
            notification.error({
                message: 'Registration Failed',
                description: error.response?.data?.message || 'Something went wrong',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSecondStepSubmit = async (values) => {
        setLoading(true);
        try {
            await landlordSignup.step2(formData.userId, values);
            notification.success({
                message: 'Registration Successful',
                description: 'Your account is pending verification.',
            });
            navigate('/auth/verification-pending');
        } catch (error) {
            notification.error({
                message: 'Profile Completion Failed',
                description: error.response?.data?.message || 'Something went wrong',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.title = "UniNest | House Owner Signup";
    }, []);

    return (
        <div>
            {step === 1 && (
                <HouseownerSignup1 
                    onFinish={handleFirstStepSubmit} 
                    loading={loading} 
                />
            )}
            {step === 2 && (
                <HouseownerSignup2 
                    onFinish={handleSecondStepSubmit} 
                    loading={loading} 
                />
            )}
        </div>
    );
};

export default HouseownerSignupPage;