import React, { useEffect, useState } from 'react';
import UserSignupStep01 from '../components/UserSignupStep01';
import UserSignupStep02 from '../components/UserSignupStep02';

const UserSignupPage = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});

    const handleFirstStepSubmit = (values) => {
        setFormData(prevData => ({ ...prevData, ...values }));
        setStep(2);
    };

    const handleSecondStepSubmit = (values) => {
        const completeData = { ...formData, ...values };
        console.log("Complete data submitted: ", completeData);
    };

    useEffect(() => {
        document.title = "UniNest | User Signup";
    }, []);

    return (
        <div>
            {step === 1 && (
                <UserSignupStep01 onFinish={handleFirstStepSubmit} />
            )}
            {step === 2 && (
                <UserSignupStep02 onFinish={handleSecondStepSubmit} />
            )}
        </div>
    );
};

export default UserSignupPage;