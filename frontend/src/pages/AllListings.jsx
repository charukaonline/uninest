import React, { useEffect } from "react";
import useListingStore from "@/store/listingStore";
// import ListingCard from "@/components/listing_page/ListingCard";
import Card from "@/components/listing_page/Card";
import LoadingSpinner from "@/components/include/LoadingSpinner";

const AllListings = () => {
  const { listings, loading, error, fetchAllListings } = useListingStore();

  useEffect(() => {

    document.title = `${listings.length} Listings Available`;

    fetchAllListings();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-6">We have {listings.length} listings available</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <Card key={listing._id} listing={listing} />
        ))}
      </div>
    </div>
  );
};

export default AllListings;
