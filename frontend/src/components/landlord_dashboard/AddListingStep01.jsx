import React from 'react'
import { useNavigate } from 'react-router-dom';

import { Form, Input, Upload, Select, notification } from "antd";
import { InboxOutlined } from "@ant-design/icons";

const AddListingStep01 = ({ onFinish }) => {

    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    }

    const handleCancel = () => {
        form.resetFields();
    }

    const normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList || [];
    };

    const handleFormFinish = (values) => {
        // Log the form values before submitting
        console.log('Form values before submit:', values);
        
        // Ensure propertyImages is properly formatted
        const formattedValues = {
            ...values,
            propertyImages: values.propertyImages || []
        };
        
        onFinish(formattedValues);
    };

    return (
        <div className='w-full min-h-screen bg-gray-50 px-4 py-6'>
            <Form
                form={form}
                name='add-listing-step-01'
                onFinish={handleFormFinish}
                onFinishFailed={onFinishFailed}
                layout='vertical'
                className='max-w-[1400px] mx-auto'
            >
                <div className='w-full'>
                    <div className='bg-white p-8 rounded-xl shadow-lg'>
                        <h2 className='text-3xl font-semibold text-gray-800 mb-8 border-b pb-4'>Add Property Details</h2>

                        <div className='grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-6'>
                            {/* First Column */}
                            <div className='space-y-4'>
                                <Form.Item
                                    label={<span className='text-base font-medium'>Property Name</span>}
                                    name="propertyName"
                                    rules={[{ required: true, message: "Please enter property name!" }]}
                                >
                                    <Input
                                        className="w-full h-10 focus:border-primaryBgColor hover:border-primaryBgColor"
                                        placeholder='Enter property name'
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={<span className='text-base font-medium'>Property Type</span>}
                                    name='propertyType'
                                    rules={[{ required: true, message: "Please select property type!" }]}
                                >
                                    <Select
                                        showSearch
                                        placeholder="Select Property Type"
                                        className='w-full h-10'
                                        options={[
                                            { value: 'Boarding House', label: 'Boarding House' },
                                            { value: 'Apartment', label: 'Apartment' },
                                        ]}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={<span className='text-base font-medium'>Built Year</span>}
                                    name="builtYear"  // Changed from "built-year" to "builtYear"
                                    rules={[{ required: true, message: "Please enter built year!" }]}
                                >
                                    <Input type='text' className="w-full h-10" placeholder='Ex: 2020' />
                                </Form.Item>

                                <Form.Item
                                    label={<span className='text-base font-medium'>Size (m²)</span>}
                                    name="size"
                                    rules={[
                                        {
                                            required: true,
                                            type: 'number',
                                            transform: (value) => Number(value),
                                            min: 0,
                                            message: 'Please enter a valid size'
                                        }
                                    ]}
                                >
                                    <Input type='number' min={0} className="w-full h-10" placeholder='Approximate size in square meters' />
                                </Form.Item>
                            </div>

                            {/* Second Column */}
                            <div className='space-y-4'>
                                <Form.Item
                                    label={<span className='text-base font-medium'>Number of Bedrooms</span>}
                                    name="bedrooms"
                                    rules={[
                                        {
                                            required: true,
                                            type: 'number',
                                            transform: (value) => Number(value),
                                            min: 0,
                                            message: 'Please enter a valid number of bedrooms'
                                        }
                                    ]}
                                >
                                    <Input type="number" min={0} className="w-full h-10" placeholder='Number of bedrooms' />
                                </Form.Item>

                                <Form.Item
                                    label={<span className='text-base font-medium'>Number of Bathrooms</span>}
                                    name="bathrooms"
                                    rules={[
                                        {
                                            required: true,
                                            type: 'number',
                                            transform: (value) => Number(value),
                                            min: 0,
                                            message: 'Please enter a valid number of bathrooms'
                                        }
                                    ]}
                                >
                                    <Input type="number" min={0} className="w-full h-10" placeholder='Number of bathrooms' />
                                </Form.Item>

                                <Form.Item
                                    label={<span className='text-base font-medium'>Number of Garages</span>}
                                    name="garage"
                                    rules={[
                                        {
                                            required: true,
                                            type: 'number',
                                            transform: (value) => Number(value),
                                            min: 0,
                                            message: 'Please enter a valid number of garages'
                                        }
                                    ]}
                                >
                                    <Input type="number" min={0} className="w-full h-10" placeholder='Number of garage' />
                                </Form.Item>

                                <Form.Item
                                    label={<span className='text-base font-medium'>Monthly Rent (Rs.)</span>}
                                    name="monthlyRent"
                                    rules={[
                                        { required: true, message: "Please enter monthly rent!" },
                                        {
                                            type: 'number',
                                            transform: (value) => Number(value),
                                            min: 0,
                                            message: 'Please enter a valid monthly rent'
                                        }
                                    ]}
                                >
                                    <Input
                                        type="number"
                                        min={0}
                                        className="w-full h-10"
                                        placeholder='Enter monthly rent'
                                        prefix="Rs."
                                    />
                                </Form.Item>
                            </div>

                            {/* Third Column */}
                            <div className='space-y-4'>
                                <Form.Item
                                    label={<span className='text-base font-medium'>Description</span>}
                                    name="description"
                                >
                                    <Input.TextArea
                                        className="w-full min-h-[120px]"
                                        placeholder='Describe your property'
                                        rows={4}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={<span className='text-base font-medium'>Property Images</span>}
                                    name="propertyImages"
                                    valuePropName="fileList"
                                    getValueFromEvent={normFile}
                                    rules={[{ 
                                        required: true,
                                        validator: (_, value) => {
                                            if (!value || value.length === 0) {
                                                return Promise.reject('Please upload at least one image!');
                                            }
                                            return Promise.resolve();
                                        }
                                    }]}
                                >
                                    <Upload.Dragger
                                        name="propertyImages"
                                        accept=".jpg,.jpeg,.png"
                                        multiple
                                        beforeUpload={() => false}
                                        onChange={(info) => {
                                            console.log('Upload onChange:', info);
                                        }}
                                        className='p-8'
                                    >
                                        <p className="ant-upload-drag-icon text-primaryBgColor">
                                            <InboxOutlined />
                                        </p>
                                        <p className="ant-upload-text">Click or drag images to upload</p>
                                        <p className="ant-upload-hint text-gray-400">Support for JPG, JPEG, PNG files</p>
                                    </Upload.Dragger>
                                </Form.Item>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className='flex justify-end mt-8 pt-6 border-t gap-4'>
                            <button
                                type="button"
                                className='px-8 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium'
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className='px-8 py-2.5 bg-primaryBgColor text-white rounded-lg hover:bg-primaryBgColor/90 font-medium'
                            >
                                Next Step
                            </button>
                        </div>
                    </div>
                </div>
            </Form>
        </div>
    )
}

export default AddListingStep01