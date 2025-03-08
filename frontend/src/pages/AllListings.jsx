import React, { useEffect, useState } from "react";
import useListingStore from "@/store/listingStore";
import Card from "@/components/listing_page/Card";
import LoadingSpinner from "@/components/include/LoadingSpinner";
import Filter from "@/components/include/Filter";

const AllListings = () => {
  const { listings, loading, error, fetchAllListings } = useListingStore();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    document.title = `${listings.length} Listings Available`;
    fetchAllListings();
  }, [listings.length]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentListings = listings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(listings.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">

      <div className=" mb-5">
        <Filter />
      </div>

      <h1 className="text-xl font-bold mb-6">
        We have {listings.length} listings available
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentListings.map((listing) => (
          <Card key={listing._id} listing={listing} />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center space-x-4 mt-8">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${currentPage === 1
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-primaryBgColor text-white hover:bg-primaryBgColor/90'
            }`}
        >
          Previous
        </button>
        <span className="text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${currentPage === totalPages
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-primaryBgColor text-white hover:bg-primaryBgColor/90'
            }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllListings;
