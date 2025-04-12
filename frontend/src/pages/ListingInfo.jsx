import ListingInfoHeroSection from "@/components/listingInfo_page/ListingInfoHeroSection";
import ListingInfo01 from "@/components/listingInfo_page/ListingInfo01";
import ListingInfo02 from "@/components/listingInfo_page/ListingInfo02";
import LoadingSpinner from "@/components/include/LoadingSpinner";
import { useAuthStore } from "@/store/authStore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useListingStore from "@/store/listingStore";
import { io } from "socket.io-client";

const ListingInfo = () => {
  const { getListingById } = useListingStore();
  const { isAuthenticated, user } = useAuthStore();
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    if (isAuthenticated && user) {
      const socketUrl =
        import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";
      const newSocket = io(socketUrl, {
        auth: { token: localStorage.getItem("token") },
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [isAuthenticated, user]);

  // Listen for socket events
  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("new_message", (data) => {
      // Notification can be handled here if needed
      console.log("New message received:", data);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    return () => {
      socket.off("connect");
      socket.off("new_message");
      socket.off("connect_error");
    };
  }, [socket]);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const data = await getListingById(listingId);
        setListing(data);
        document.title = `${data.propertyName}`;
      } catch (err) {
        setError("Failed to load listing details");
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
    <div className="">
      <ListingInfoHeroSection listing={listing} />
      <ListingInfo01 listing={listing} />
      <ListingInfo02 listing={listing} />
    </div>
  );
};

export default ListingInfo;
