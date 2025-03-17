import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getListingById } from "@/services/listingService";
import ListingDetailActions from "@/components/listing/ListingDetailActions";

const ListingDetailPage = () => {
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const data = await getListingById(listingId);
        setListing(data);
      } catch (error) {
        console.error("Failed to fetch listing:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!listing) {
    return <div>Listing not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-primaryBgColor mb-4">
          {listing.propertyName}
        </h1>

        {/* Add the actions component here */}
        <ListingDetailActions listing={listing} />

        {/* ...other listing details... */}
      </div>
    </div>
  );
};

export default ListingDetailPage;
