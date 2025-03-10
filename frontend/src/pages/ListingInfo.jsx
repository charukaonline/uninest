import PropertyHeroSection from '@/components/propertyInfo_page/PropertyHeroSection';
import PropertyInformation01 from '@/components/propertyInfo_page/PropertyInformation01';
import PropertyInformation02 from '@/components/propertyInfo_page/PropertyInformation02';

import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'

import { FaMapMarkedAlt } from "react-icons/fa";

const ListingInfo = () => {
    const { propertyId } = useParams();
    const location = useLocation();
    const { name, address, price, image } = location.state;

    const [additionalDetails, setAdditionalDetails] = useState({});

    // if (!additionalDetails) return <div>Loading...</div>;

    useEffect(() => {

        window.scrollTo(0, 0);

        document.title = `UniNest | ${name}`;
    }, []);

    const heroSectionProps = {
        name: name,
        image: image,
        address: address,
        price: price,
        ownerName: additionalDetails.ownerName,
        status: additionalDetails.status,
        featured: additionalDetails.featured,
    };

    const propertyInfo01 = {
        propertyType: additionalDetails.propertyType,
        yearBuild: additionalDetails.yearBuild,
        size: additionalDetails.size,
        bedrooms: additionalDetails.bedrooms,
        bathrooms: additionalDetails.bathrooms,
        parking: additionalDetails.parking,
        address: address,
        city: additionalDetails.city,
        state: additionalDetails.country,
        postalCode: additionalDetails.postalCode,
        universityProximity: additionalDetails.universityProximity,
        country: additionalDetails.country
    };

    const propertyInfo02 = {
        description: additionalDetails.description,
        features: additionalDetails.features,
        mapLocation: additionalDetails.mapLocation
    };

    return (
        <div className=''>

            <PropertyHeroSection details01={heroSectionProps} />
            <PropertyInformation01 details02={propertyInfo01} />
            <PropertyInformation02 details03={propertyInfo02} />

        </div>
    )
}

export default ListingInfo
