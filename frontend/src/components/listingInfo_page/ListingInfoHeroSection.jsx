import React from 'react'

import { IoMdPin } from "react-icons/io";
import { Form, Input, Tooltip } from "antd";
import TextArea from 'antd/es/input/TextArea';

const ListingInfoHeroSection = ({ listing }) => {

    const handleInquiry = () => {
        console.log('Inquiry submitted');
    };

    return (
        <div className=' overflow-x-hidden px-6 w-full'>
            <div className=' p-6 mt-3'>

                <div className='flex justify-between items-center'>
                    <div className='flex items-center space-x-3'>
                        <h1 className='text-2xl font-semibold'>{listing.propertyName}</h1>
                        <div className='flex items-center space-x-1 text-gray-500'>
                            <h2><IoMdPin className="text-lg" /></h2>
                            <h2 className='text-base leading-none'>{listing.address}</h2>
                        </div>
                    </div>

                    <div>
                        <h2 className=' text-xl text-primaryBgColor'>
                            LKR {listing.monthlyRent.toLocaleString()}/month
                        </h2>
                    </div>
                </div>

                <div className="flex space-x-3">
                    <Tooltip title="The status of the property">
                        <h2 className="bg-primaryBgColor text-white font-semibold uppercase text-sm p-2 rounded-lg cursor-pointer">
                            {listing.status} For Rent
                        </h2>
                    </Tooltip>

                    <Tooltip title="Indicates if this property is sponsored">
                        <h2 className="bg-[#90D4D6] text-black font-semibold uppercase text-sm p-2 rounded-lg cursor-pointer">
                            {listing.featured} Featured
                        </h2>
                    </Tooltip>
                </div>

                <div className=' flex space-x-2 mt-2'>
                    <div className=' items-center'>
                        <img
                            src={listing.images}
                            alt={listing.propertyName}
                            className=' h-full w-full object-cover rounded-lg'
                        />
                    </div>
                    <div className=' p-4 rounded-lg w-full bg-primaryBgColor'>

                        <div className=' mb-2'>
                            <div className=' flex space-x-3 items-center mt-2'>
                                <img src='/' alt='house owner' className=' rounded-full w-14 h-14' />
                                <div className=' flex flex-col items-center'>
                                    <h1 className=' text-base text-white'>{listing.username} Sanoj Aminda</h1>
                                    <h1 className=' text-sm text-gray-300'>House Owner</h1>
                                </div>
                            </div>
                        </div>

                        <Form
                            layout='vertical'
                            onFinish={handleInquiry}
                            requiredMark={true}
                            className=' text-white'
                        >
                            <Form.Item
                                label={<span className="text-white">Your Name</span>}
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter your name!'
                                    },
                                ]}
                            >
                                <Input
                                    placeholder='John Doe'
                                    className="bg-white text-black placeholder-gray-400 focus:border-primaryBgColor hover:border-primaryBgColor"
                                />
                            </Form.Item>

                            <Form.Item
                                label={<span className="text-white">Email</span>}
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter your email!'
                                    },
                                ]}
                            >
                                <Input
                                    placeholder='email@domain.com'
                                    className="bg-white text-black placeholder-gray-400 focus:border-primaryBgColor hover:border-primaryBgColor"
                                />
                            </Form.Item>

                            <Form.Item
                                label={<span className="text-white">Phone Number</span>}
                                name="phoneNumber"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter your phone number!'
                                    },
                                ]}
                            >
                                <Input
                                    placeholder='+94 77 123 3456'
                                    className="bg-white text-black placeholder-gray-400 focus:border-primaryBgColor hover:border-primaryBgColor"
                                />
                            </Form.Item>

                            <Form.Item
                                label={<span className="text-white">Message</span>}
                                name="message"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter your message!'
                                    },
                                ]}
                            >
                                <TextArea
                                    placeholder='Type your message here...'
                                    className="bg-white text-black placeholder-gray-400 focus:border-primaryBgColor hover:border-primaryBgColor"
                                />
                            </Form.Item>

                            <Form.Item>
                                <button
                                    type="submit"
                                    className="bg-white text-primaryBgColor px-6 py-2 rounded-lg focus:outline-none w-full hover:bg-white-[#eee] font-semibold"
                                >
                                    Submit Inquiry
                                </button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListingInfoHeroSection