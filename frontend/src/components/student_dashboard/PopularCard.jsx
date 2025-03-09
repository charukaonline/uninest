import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch, Tooltip } from "antd";
import { FaHouseChimney } from "react-icons/fa6";
import { FaBath, FaBed, FaCalendarAlt, FaRulerCombined } from "react-icons/fa";
import { IoMdPin } from "react-icons/io";
import { PiGarageFill } from "react-icons/pi";

import { Link, useNavigate, useParams } from "react-router-dom";
import { MdArrowOutward } from "react-icons/md";

const PopularCard = () => {
    return (
        <Card className=" bg-gray-100">
            <CardHeader className=" -mb-5">
                <div className=" flex space-x-2 justify-between mb-5">
                    <CardTitle>
                        Boarding House Name
                    </CardTitle>

                    <div>
                        <Tooltip title="View Listing">
                            <Link to="/listing/1">
                                <div className=" bg-primaryBgColor p-2 rounded-lg text-white hover:bg-green-600">
                                    <MdArrowOutward />
                                </div>
                            </Link>
                        </Tooltip>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className=" gap-5 flex">

                    <div className=" w-2/4">
                        <img
                            src="https://via.placeholder.com/150"
                            alt="Boarding House"
                            className="w-full h-64 object-cover bg-purple-400 rounded-xl"
                        />
                    </div>
                    <div className="flex flex-col">

                        <div className=" -space-y-4 mb-4">
                            <p className=" font-semibold text-2xl">$5000/Month</p>
                            <div className='flex items-center space-x-1 text-gray-500'>
                                <h2><IoMdPin className="text-lg" /></h2>
                                <h2 className=" text-gray-600 leading-none">Doane Street, Fremont</h2>
                            </div>
                        </div>

                        <hr className=" border-2 rounded border-primaryBgColor" />

                        <div className=" mt-4">
                            <h2 className=" text-lg text-gray-600 mb-4">Overview</h2>

                            <div className=" flex gap-5">
                                <div>
                                    <div className=" flex gap-4 mb-5">
                                        <FaHouseChimney className=" p-1 rounded-lg border border-gray-600 text-primaryBgColor size-10 hover:text-green-600" />
                                        <div className=" -space-y-2">
                                            <h2 className=" text-sm text-gray-600">Type</h2>
                                            <h2 className=" font-semibold">Apartment</h2>
                                        </div>
                                    </div>
                                    <div className=" flex gap-4">
                                        <FaBed className=" p-1 rounded-lg border border-gray-600 text-primaryBgColor size-10 hover:text-green-600" />
                                        <div className=" -space-y-2">
                                            <h2 className=" text-sm text-gray-600">Bedrooms</h2>
                                            <h2 className=" font-semibold">3</h2>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className=" flex gap-4 mb-5">
                                        <FaCalendarAlt className=" p-1 rounded-lg border border-gray-600 text-primaryBgColor size-10 hover:text-green-600" />
                                        <div className=" -space-y-2">
                                            <h2 className=" text-sm text-gray-600">Build Year</h2>
                                            <h2 className=" font-semibold">2022</h2>
                                        </div>
                                    </div>
                                    <div className=" flex gap-4">
                                        <FaBath className=" p-1 rounded-lg border border-gray-600 text-primaryBgColor size-10 hover:text-green-600" />
                                        <div className=" -space-y-2">
                                            <h2 className=" text-sm text-gray-600">Bathrooms</h2>
                                            <h2 className=" font-semibold">2</h2>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className=" flex gap-4 mb-5">
                                        <FaRulerCombined className=" p-1 rounded-lg border border-gray-600 text-primaryBgColor size-10 hover:text-green-600" />
                                        <div className=" -space-y-2">
                                            <h2 className=" text-sm text-gray-600">Size (m²)</h2>
                                            <h2 className=" font-semibold">32</h2>
                                        </div>
                                    </div>
                                    <div className=" flex gap-4">
                                        <PiGarageFill className=" p-1 rounded-lg border border-gray-600 text-primaryBgColor size-10 hover:text-green-600" />
                                        <div className=" -space-y-2">
                                            <h2 className=" text-sm text-gray-600">Garages</h2>
                                            <h2 className=" font-semibold">1</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default PopularCard