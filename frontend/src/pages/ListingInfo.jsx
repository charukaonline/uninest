import ListingInfoHeroSection from '@/components/listingInfo_page/ListingInfoHeroSection';
import ListingInfo01 from '@/components/listingInfo_page/ListingInfo01';
import ListingInfo02 from '@/components/listingInfo_page/ListingInfo02';
import LoadingSpinner from '@/components/include/LoadingSpinner';

import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useListingStore from '@/store/listingStore';

const ListingInfo = () => {
    const { getListingById } = useListingStore();
    const { listingId } = useParams();
    const [listing, setListing] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const data = await getListingById(listingId);
                setListing(data);
                document.title = `${data.propertyName}`;
            } catch (err) {
                setError('Failed to load listing details');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchListing();
        window.scrollTo(0, 0);
    }, [listingId, getListingById]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div className="text-center text-red-500 p-4">{error}</div>;
    }

    if (!listing) {
        return <div className="text-center p-4">Listing not found</div>;
    }

    return (
        <div className=''>
            <ListingInfoHeroSection listing={listing} />
            <ListingInfo01 listing={listing} />
            <ListingInfo02 listing={listing} />
        </div>
    )
}

export default ListingInfo
