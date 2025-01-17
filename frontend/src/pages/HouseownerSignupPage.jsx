
import React, { useEffect, useState } from 'react'
import HouseownerSignup1 from '@/components/signup_pages/HouseownerSignup1'
import HouseownerSignup2 from '@/components/signup_pages/HouseownerSignup2';

const HouseownerSignupPage = () => {

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});

    const handleFirstStepSubmit = (values) => {
        setFormData((prevData) => ({ ...prevData, ...values }));
        setStep(2);
    };

    const handleSecondStepSubmit = (values) => {
        const completeData = { ...formData, ...values };
        console.log("Complete data submitted: ", completeData);
    };

    useEffect(() => {
        document.title = "UniNest | House Owner Signup";
    }, []);

    return (
        <div>
            {step === 1 && <HouseownerSignup1 onFinish={handleFirstStepSubmit} />}
            {step === 2 && <HouseownerSignup2 onFinish={handleSecondStepSubmit} />}
        </div>
    )
}

export default HouseownerSignupPage