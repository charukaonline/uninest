import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const Filter = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState("All");

    const propertyOptions = ["All", "Boarding House", "Apartment"];

    return (
        <div className=' p-4 bg-primaryBgColor rounded-lg flex space-x-1 items-center justify-between'>

            {/* Search Bar */}
            <div>
                <input
                    type='text'
                    name='search'
                    className=' p-2 border rounded-lg w-full text-black'
                    placeholder='Search here...'
                />
            </div>

            {/* Property Type */}
            <div className="relative w-48">
                <motion.div
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 border rounded-lg w-full flex items-center justify-between cursor-pointer bg-white"
                >
                    <span className="truncate">{selectedProperty}</span>
                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ChevronDown className="w-5 h-5 flex-shrink-0" />
                    </motion.div>
                </motion.div>

                <AnimatePresence>
                    {isOpen && (
                        <motion.ul
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 w-full mt-1 bg-white border rounded-lg shadow-lg z-10"
                        >
                            {propertyOptions.map((option) => (
                                <li
                                    key={option}
                                    onClick={() => {
                                        setSelectedProperty(option);
                                        setIsOpen(false);
                                    }}
                                    className="p-2 hover:bg-gray-100 cursor-pointer truncate"
                                >
                                    {option}
                                </li>
                            ))}
                        </motion.ul>
                    )}
                </AnimatePresence>
            </div>

            {/* Price */}
            <div className="">
                <input
                    type="number"
                    name="price"
                    className="p-2 border rounded-lg w-full text-black"
                    placeholder="Price"
                />
            </div>

            {/* Location */}
            <div className="">
                <input
                    type="text"
                    name="location"
                    className="p-2 border rounded-lg w-full"
                    placeholder="Location or Address"
                />
            </div>

            {/* University */}
            <div className="">
                <input
                    type="text"
                    name="university"
                    className="p-2 border rounded-lg w-full"
                    placeholder="University name"
                />
            </div>

        </div>
    )
}

export default Filter;