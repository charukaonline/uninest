import React from "react";
import { Button, Tooltip } from "antd";
import { FaHeart, FaShare, FaBookmark } from "react-icons/fa";
import StartConversationButton from "@/components/chat/StartConversationButton";
import { useAuthStore } from "@/store/authStore";
import { useLandlordAuthStore } from "@/store/landlordAuthStore";
import { useNavigate } from "react-router-dom";
import ChatDialog from "@/components/chat/ChatDialog";

const ListingDetailActions = ({ listing }) => {
  const { user, isAuthenticated } = useAuthStore();
  const { landlord, isLandlordAuthenticated } = useLandlordAuthStore();
  const navigate = useNavigate();

  // Don't show contact button if the landlord is viewing their own listing
  const isOwnListing =
    isLandlordAuthenticated &&
    landlord &&
    listing.landlord &&
    listing.landlord._id === landlord._id;

  const handleAuthenticationRequired = () => {
    navigate("/auth/user-signin");
  };

  return (
    <div className="flex flex-col md:flex-row gap-3 mt-4">
      {!isOwnListing && (
        <ChatDialog
          propertyId={listing._id}
          landlordId={listing.landlord?._id}
          propertyName={listing.propertyName}
          className="bg-primaryBgColor text-white hover:bg-green-700 py-2 rounded-md flex-1"
          buttonText="Contact Landlord"
        />
      )}

      <div className="flex gap-2">
        <Tooltip title="Save">
          <Button
            icon={<FaBookmark />}
            className="flex items-center justify-center"
          />
        </Tooltip>
        <Tooltip title="Like">
          <Button
            icon={<FaHeart />}
            className="flex items-center justify-center"
          />
        </Tooltip>
        <Tooltip title="Share">
          <Button
            icon={<FaShare />}
            className="flex items-center justify-center"
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default ListingDetailActions;
