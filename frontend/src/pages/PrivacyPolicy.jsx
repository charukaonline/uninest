import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom';

const PrivacyPolicy = () => {

    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);

        document.title = "UniNest | Privacy Policy";
    }, [location]);

    return (
        <section className=" items-center py-16 px-8 lg:px-20" id='#'>

            <div id='trust-safety' className='space-y-4 mb-8'>
                <h1 className=' text-2xl font-semibold mb-2'>Trust & Safety</h1>
                Your safety is our top priority at UniNest. We have implemented a series of measures to ensure that users can trust the platform and interact in a secure and respectful environment.
                User Verification: All landlords must go through a verification process to ensure that their listings are legitimate. This process includes confirming their identity and property ownership, ensuring that students are not exposed to fraudulent listings.
                Listing Verification: We regularly review and verify the content of listings, particularly user reviews, to ensure that all information presented on the platform is accurate and reliable. Landlords are encouraged to keep their listings up to date and adhere to our terms for providing detailed and honest descriptions.
                Reporting & Support: If you encounter a suspicious listing or interaction, you can easily report it through the platform. Our support team is available to investigate any claims and will take appropriate action if necessary. We also encourage users to engage in respectful communication and report any inappropriate behavior.
                Commitment to Data Security: We take the protection of your data seriously. Our platform uses industry-standard encryption to safeguard personal and financial details. Additionally, we continually monitor our systems for potential vulnerabilities to ensure a safe environment for all users.
            </div>

            <div id='terms-of-service' className='space-y-4 mb-8'>
                <h1 className=' text-2xl font-semibold mb-2'>Terms of Service</h1>
                By accessing and using UniNest, you agree to the following Terms of Service. These terms govern your access to and use of our website, services, and content. Please read them carefully, as they outline your rights and obligations.
                General Use: You are granted access to our platform for lawful and personal use only. Any commercial use or distribution of the platform&apos;s content without prior authorization is strictly prohibited. You agree not to upload or post content that violates any applicable law, including but not limited to offensive, defamatory, or discriminatory material.
                Account Security: You are responsible for maintaining the confidentiality of your account and password. Any activity on your account is your responsibility, and you must immediately notify us if you suspect any unauthorized access. You agree not to use anyone else&apos;s account or attempt to bypass any security measures on the platform.
                Termination of Service: We reserve the right to suspend or terminate your access to the platform if you violate any terms of use or engage in fraudulent activities. You may also cancel your account at any time by contacting our support team.
                Limitation of Liability: While we strive to provide accurate and reliable services, we are not liable for any errors or omissions in the content provided or for any losses or damages resulting from the use of the platform. We do not guarantee that the platform will be free from disruptions or errors.
            </div>

            <div id='privacy-policy' className='space-y-4 mb-8'>
                <h1 className=' text-2xl font-semibold mb-2'>Privacy Policy</h1>
                At UniNest, we take your privacy seriously. This Privacy Policy outlines the personal data we collect from you, how we use it, and the measures we take to protect it. By using our platform, you agree to the collection and use of information in accordance with this policy.
                Information Collection: We collect various types of personal information when you register on our platform, including your name, email address, and other registration details. We also collect data about your interactions with the platform, such as search preferences, listings viewed, and actions taken within the site.
                Use of Information: The information we collect is used to provide a personalized experience. This includes tailoring recommendations, sending relevant notifications, and improving platform features. We may also use your data to communicate with you regarding updates or important changes to the service.
                Data Sharing: We do not share your personal data with third parties unless necessary for the functionality of the platform or as required by law. Any third-party service providers we engage with are obligated to protect your data and use it only for the purposes for which it was shared.
                Data Security: We employ industry-standard security measures to protect your personal information. This includes encryption, secure servers, and regular security audits to ensure that your data is safeguarded against unauthorized access.
                Your Rights: You have the right to access, update, or delete your personal information at any time. If you wish to exercise any of these rights or have concerns about how we handle your data, please contact our support team.
            </div>
        </section>
    )
}

export default PrivacyPolicy