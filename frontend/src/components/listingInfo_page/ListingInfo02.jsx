import React from 'react'

import { GoCheckCircleFill } from "react-icons/go";

const PropertyInformation02 = ({ details03 }) => {
    return (
        <div className=' overflow-x-hidden px-12 w-full'>

            {/* Description */}
            <div className=' p-3 px-8 mt-8 bg-[#eee] rounded-lg mb-3'>
                <h2 className=' font-semibold text-lg'>Description</h2>

                <div className=' flex space-x-3 justify-between mt-6'>
                    <div className='space-y-4'>
                        <h2 className=''>{details03.description} Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum voluptatibus unde consequuntur culpa accusantium esse architecto soluta. Obcaecati pariatur molestias sunt beatae magnam odio possimus quam quisquam, non culpa! Asperiores.</h2>
                    </div>
                </div>
            </div>

            {/* Features */}
            <div className=' p-3 px-8 mt-8 bg-[#eee] rounded-lg mb-3'>
                <h2 className=' font-semibold text-lg'>Features</h2>

                <div className=' flex flex-col space-x-3 justify-between mt-6'>
                    <div className=' flex space-x-56 mb-2'>
                        <div className=' flex space-x-3 items-center justify-center'>
                            <GoCheckCircleFill className=' text-primaryBgColor text-2xl' />
                            <h2 className=' my-auto'>Air Conditioning</h2>
                        </div>

                        <div className=' flex space-x-3 items-center justify-center'>
                            <GoCheckCircleFill className=' text-primaryBgColor text-2xl' />
                            <h2 className=' my-auto'>Washer</h2>
                        </div>

                        <div className=' flex space-x-3 items-center justify-center'>
                            <GoCheckCircleFill className=' text-primaryBgColor text-2xl' />
                            <h2 className=' my-auto'>Laundry</h2>
                        </div>
                    </div>
                </div>
            </div>

            {/* Map view */}
        </div>
    )
}

export default PropertyInformation02