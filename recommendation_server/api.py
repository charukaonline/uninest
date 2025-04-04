from fastapi import FastAPI, HTTPException
from pymongo import MongoClient
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import LabelEncoder
from typing import List, Dict, Any, Optional
import uvicorn
from pydantic import BaseModel
import logging
from bson import ObjectId
import traceback
from fastapi.middleware.cors import CORSMiddleware
import random

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI(title="Property Recommendation API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
client = MongoClient(
    "mongodb+srv://charukank:Fk1lRURC5auCxa9c@cluster0.nvkhy.mongodb.net/UniNest?retryWrites=true&w=majority&appName=Cluster0"
)
db = client["UniNest"]

# Check available collections for debugging
collections = db.list_collection_names()
logger.info(f"Available collections: {collections}")


# Response models
class PropertyRecommendation(BaseModel):
    _id: str
    propertyName: str
    propertyType: str
    monthlyRent: float
    city: Optional[str] = None
    score: float
    images: Optional[List[str]] = None

    class Config:
        # Allow ObjectId to be processed
        arbitrary_types_allowed = True


class ErrorResponse(BaseModel):
    detail: str


# Function to handle ObjectId serialization
def serialize_document(doc):
    if isinstance(doc, dict):
        for k, v in doc.items():
            if isinstance(v, ObjectId):
                doc[k] = str(v)
            elif isinstance(v, dict):
                doc[k] = serialize_document(v)
            elif isinstance(v, list):
                doc[k] = [
                    (
                        serialize_document(item)
                        if isinstance(item, dict)
                        else str(item) if isinstance(item, ObjectId) else item
                    )
                    for item in v
                ]
    return doc


# Get raw listings without processing
@app.get("/debug/listings")
async def get_listings():
    try:
        # Get first 5 listings for debugging
        listings = list(db.listings.find().limit(5))
        listings = [serialize_document(listing) for listing in listings]
        return {"listings": listings}
    except Exception as e:
        return {"error": str(e)}


# Get raw student profile without processing
@app.get("/debug/studentprofiles")
async def get_student_profiles():
    try:
        # Look in both potential collections
        studentprofiles = (
            list(db.studentprofiles.find().limit(5))
            if "studentprofiles" in collections
            else []
        )
        student_profile = (
            list(db.studentProfile.find().limit(5))
            if "studentProfile" in collections
            else []
        )

        result = {
            "studentprofiles": [
                serialize_document(profile) for profile in studentprofiles
            ],
            "studentProfile": [
                serialize_document(profile) for profile in student_profile
            ],
            "collections": collections,
        }
        return result
    except Exception as e:
        return {"error": str(e)}


@app.get(
    "/recommendations/{student_id}",
    responses={500: {"model": ErrorResponse}, 404: {"model": ErrorResponse}},
)
async def get_recommendations(student_id: str):
    """
    Get personalized property recommendations for a student based on their preferences.

    The algorithm considers:
    - Property type match (exact/similar matching)
    - Price range compatibility
    - Preferred areas/locations
    - Gender preference matching
    - University proximity
    - Property features (bedrooms, bathrooms, etc.)
    - Property popularity (ELO rating)

    Returns exactly 6 listings, prioritizing perfect matches across all preferences.
    """
    logger.info(f"Getting recommendations for student ID: {student_id}")

    try:
        # Try to convert to ObjectId if possible
        try:
            obj_id = ObjectId(student_id)
            user_id_query = {"userId": obj_id}
            logger.info(f"Looking for student profile with userId: {obj_id}")
        except:
            user_id_query = {"userId": student_id}
            logger.info(
                f"Looking for student profile with userId (string): {student_id}"
            )

        # Find student profile
        student_profile = None
        collections_to_check = ["studentProfile", "studentprofiles"]

        for collection_name in collections_to_check:
            if collection_name in db.list_collection_names():
                logger.info(f"Checking collection: {collection_name}")
                student_profile = db[collection_name].find_one(user_id_query)
                if student_profile:
                    logger.info(f"Found student profile in {collection_name}")
                    break

        # Additional checks by _id if not found
        if not student_profile:
            try:
                for collection_name in collections_to_check:
                    if collection_name in db.list_collection_names():
                        logger.info(f"Checking collection {collection_name} by _id")
                        student_profile = db[collection_name].find_one(
                            {"_id": ObjectId(student_id)}
                        )
                        if student_profile:
                            logger.info(
                                f"Found student profile in {collection_name} by _id"
                            )
                            break
            except Exception as e:
                logger.error(f"Error looking up by _id: {e}")

        # Extract all user preferences
        if student_profile:
            logger.info(f"Processing preferences for student: {student_id}")
            logger.info(f"Student profile: {serialize_document(student_profile)}")

            # Extract core preferences with defaults
            preferred_property_type = student_profile.get("preferredPropertyType")
            price_range = student_profile.get("priceRange", {})
            preferred_areas = student_profile.get("preferredAreas", [])
            gender = student_profile.get("gender")  # Student gender if available
            university = student_profile.get("university")  # University ID or name

            # Extract extended preferences if available
            min_bedrooms = student_profile.get("minBedrooms", 1)
            min_bathrooms = student_profile.get("minBathrooms", 1)

            min_price = (
                price_range.get("min", 0) if isinstance(price_range, dict) else 0
            )
            max_price = (
                price_range.get("max", 100000)
                if isinstance(price_range, dict)
                else 100000
            )

            logger.info(
                f"Using preferences: type={preferred_property_type}, "
                + f"price={min_price}-{max_price}, areas={preferred_areas}"
            )
        else:
            logger.warning(f"No student profile found for user ID: {student_id}")
            # Get top 6 popular listings as a fallback when no profile exists
            popular_listings = list(db.listings.find().sort("eloRating", -1).limit(6))

            if not popular_listings:
                return []

            result_listings = []
            for listing in popular_listings:
                listing = serialize_document(listing)
                # Set fallback scores - still provide some variation based on ELO
                elo = listing.get("eloRating", 0)
                listing["score"] = 0.5 + (
                    elo / 10000 * 0.3
                )  # Base 0.5 + up to 0.3 from ELO
                listing["matchReason"] = "Popular listing recommendation"
                result_listings.append(listing)

            # Cap at exactly 6 listings
            return result_listings[:6]

        # Get all listings
        all_listings = list(db.listings.find())
        logger.info(f"Found {len(all_listings)} total listings to evaluate")

        if not all_listings:
            logger.warning("No listings found in database")
            return []

        # Process each listing with advanced scoring
        scored_listings = []
        for listing in all_listings:
            # Initialize score components - we'll calculate an advanced weighted score
            scores = {
                "property_type": 0,
                "price_match": 0,
                "location_match": 0,
                "gender_match": 0,
                "university_match": 0,
                "features_match": 0,
                "popularity": 0,
            }

            match_reasons = []

            # 1. Property Type Matching (Weight: 25%)
            if preferred_property_type:
                listing_type = listing.get("propertyType")
                if listing_type and listing_type == preferred_property_type:
                    scores["property_type"] = 1.0  # Exact match
                    match_reasons.append(f"Perfect property type match: {listing_type}")
                elif listing_type:
                    # Partial string match gives partial score
                    if (
                        isinstance(listing_type, str)
                        and isinstance(preferred_property_type, str)
                        and (
                            listing_type.lower() in preferred_property_type.lower()
                            or preferred_property_type.lower() in listing_type.lower()
                        )
                    ):
                        scores["property_type"] = 0.7
                        match_reasons.append(f"Similar property type: {listing_type}")

            # 2. Price Range Matching (Weight: 20%)
            price = listing.get("monthlyRent", 0)
            if min_price <= price <= max_price:
                # Perfect price match
                price_match_quality = 1.0
                match_reasons.append(f"Within your budget: LKR {price}")
            elif price < min_price:
                # Below budget (good thing)
                price_match_quality = 0.9
                match_reasons.append(f"Below your budget: LKR {price}")
            else:
                # Above budget - penalize based on how much above
                overage = price - max_price
                if overage <= max_price * 0.1:  # Up to 10% over
                    price_match_quality = 0.7
                    match_reasons.append(f"Slightly above budget: LKR {price}")
                elif overage <= max_price * 0.2:  # Up to 20% over
                    price_match_quality = 0.4
                    match_reasons.append(f"Above budget: LKR {price}")
                else:
                    price_match_quality = 0

            scores["price_match"] = price_match_quality

            # 3. Location Matching (Weight: 20%)
            if preferred_areas:
                location_matched = False
                listing_city = listing.get("city", "").lower()
                listing_address = listing.get("address", "").lower()
                listing_province = listing.get("province", "").lower()

                for area in preferred_areas:
                    area_lower = area.lower()
                    if (
                        area_lower in listing_city
                        or area_lower in listing_address
                        or area_lower in listing_province
                    ):
                        location_matched = True
                        scores["location_match"] = 1.0
                        match_reasons.append(f"Location match: {area}")
                        break

                if not location_matched:
                    # No direct match, but assign a modest score if listing has location info
                    if listing_city or listing_address:
                        scores["location_match"] = 0.3
            else:
                # No preferred areas specified, don't penalize
                scores["location_match"] = 0.7

            # 4. Gender Preference Matching (Weight: 15%)
            listing_gender_pref = listing.get("genderPreference", "mixed").lower()
            if not gender or listing_gender_pref == "mixed":
                # If no gender specified or listing accepts mixed, it's a match
                scores["gender_match"] = 1.0
            elif gender.lower() == "male" and listing_gender_pref == "boys":
                scores["gender_match"] = 1.0
                match_reasons.append("Boys-only accommodation")
            elif gender.lower() == "female" and listing_gender_pref == "girls":
                scores["gender_match"] = 1.0
                match_reasons.append("Girls-only accommodation")
            else:
                # Gender mismatch
                scores["gender_match"] = 0.0

            # 5. University Proximity (Weight: 10%)
            if university:
                listing_university = listing.get("nearestUniversity")
                university_distance = listing.get("universityDistance", 100)

                if listing_university and listing_university == university:
                    scores["university_match"] = 1.0
                    match_reasons.append(
                        f"Near your university: {university_distance}km"
                    )
                elif university_distance < 3:
                    scores["university_match"] = 0.9
                    match_reasons.append(
                        f"Close to university: {university_distance}km"
                    )
                elif university_distance < 5:
                    scores["university_match"] = 0.8
                    match_reasons.append(f"Near university: {university_distance}km")
                elif university_distance < 10:
                    scores["university_match"] = 0.6
                else:
                    scores["university_match"] = 0.3
            else:
                # No university preference, don't penalize
                scores["university_match"] = 0.7

            # 6. Features Match (Weight: 5%)
            bedrooms = listing.get("bedrooms", 0)
            bathrooms = listing.get("bathrooms", 0)

            if bedrooms >= min_bedrooms and bathrooms >= min_bathrooms:
                scores["features_match"] = 1.0
                match_reasons.append(f"{bedrooms} bedrooms, {bathrooms} bathrooms")
            elif bedrooms >= min_bedrooms:
                scores["features_match"] = 0.7
                match_reasons.append(f"{bedrooms} bedrooms")
            elif bathrooms >= min_bathrooms:
                scores["features_match"] = 0.5
                match_reasons.append(f"{bathrooms} bathrooms")
            else:
                scores["features_match"] = 0.3

            # 7. Popularity/ELO Rating (Weight: 5%)
            elo_rating = listing.get("eloRating", 0)
            scores["popularity"] = min(elo_rating / 3000, 1.0)
            if scores["popularity"] > 0.8:
                match_reasons.append("Highly rated by other students")

            # Calculate weighted final score
            weights = {
                "property_type": 0.25,
                "price_match": 0.20,
                "location_match": 0.20,
                "gender_match": 0.15,
                "university_match": 0.10,
                "features_match": 0.05,
                "popularity": 0.05,
            }

            final_score = sum(score * weights[key] for key, score in scores.items())

            # Add a tiny bit of randomness (±0.02) for variety while keeping good matches at top
            final_score += random.uniform(-0.02, 0.02)
            final_score = max(0, min(final_score, 1.0))  # Clamp between 0 and 1

            # Prepare listing for response
            listing_result = serialize_document(listing)
            listing_result["score"] = final_score

            # Only include top 3 match reasons to avoid clutter
            listing_result["matchReasons"] = (
                match_reasons[:3] if match_reasons else ["Recommended listing"]
            )

            # Debug scoring
            logger.debug(
                f"Listing {listing.get('propertyName')}: score={final_score}, components={scores}"
            )

            scored_listings.append(listing_result)

        # Sort by score (descending) and return the top 6
        sorted_listings = sorted(
            scored_listings, key=lambda x: x["score"], reverse=True
        )
        top_listings = sorted_listings[:6]

        logger.info(
            f"Returning {len(top_listings)} recommendations (from {len(scored_listings)} evaluated)"
        )
        return top_listings

    except Exception as e:
        # Log the full exception for debugging
        logger.error(f"Error generating recommendations: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=500, detail=f"Error generating recommendations: {str(e)}"
        )


@app.get("/")
async def root():
    return {"message": "Property Recommendation API is running"}


if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
