import { Tooltip } from 'antd'
import React from 'react'
import { IoMdPin } from 'react-icons/io'
import { MdArrowOutward } from 'react-icons/md'
import { Link } from 'react-router-dom'

const RecommendationCard = () => {
    return (
        <div className=" overflow-hidden p-4 border border-gray-200 bg-gray-100 rounded-lg shadow-lg transition transform hover:scale-105">
            <img
                src="https://via.placeholder.com/150"
                alt="Meadow View"
                className="w-full h-48 object-cover rounded-md bg-purple-400"
            />
            <div className="p-4">
                <h2 className="font-bold text-lg">Meadow View</h2>
                <p className="text-primaryBgColor text-[15px] font-bold mt-2">
                    LKR 5000.00/month
                </p>
                <div className="flex items-center justify-between">
                    <div className=' flex items-center space-y-0 space-x-1'>
                        <IoMdPin className="text-gray-600" />
                        <p className="text-gray-600 text-base truncate">Doane Street, Fremont</p>
                    </div>
                    <div>
                        <Tooltip title="View Listing">
                            <Link to="/listing/">
                                <div className=" bg-primaryBgColor p-2 rounded-lg text-white hover:bg-green-600">
                                    <MdArrowOutward />
                                </div>
                            </Link>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RecommendationCard