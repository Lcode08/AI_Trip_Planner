import { GetPlaceDetails, PHOTO_REF_URL } from '@/Service/GlobalApi';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function PlaceCard({ place }) {
  const [photoUrl, setPhotoUrl] = useState('');
    useEffect(()=> {
      place&&GetPlacePhoto();
    },[place])
  
    const GetPlacePhoto=async ()=> {
      const data = {
        textQuery: place.placeName
      } 
      console.log(data);
      const result = await GetPlaceDetails(data).then(response=> {
        console.log(response.data.places[0].photos[3].name)
  
        const PhotoUrl = PHOTO_REF_URL.replace('NAME',response.data.places[0].photos[3].name);
        console.log(PhotoUrl);
        setPhotoUrl(PhotoUrl);
      })
    }

  return (
    <div className="w-full bg-white shadow-md rounded-lg hover:shadow-lg hover:scale-[1.02] cursor-pointer transition-all overflow-hidden">
      
      <Link to={'https://www.google.com/maps/search/?api=1&query=' + place.placeName} target='_blank'>
        <div className="relative rounded-t-lg overflow-hidden h-40 sm:h-44 md:h-48">
          <img
            src={photoUrl}
            className="w-full h-full object-cover"
            alt={place.placeName}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder.jpg';
            }}
          />
        </div>

        <div className="p-3 sm:p-4">
          <h4 className="font-semibold text-base sm:text-lg text-gray-800 mb-2 sm:mb-3">
            📍{place.placeName}
          </h4>
          <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
            <strong className="text-gray-700">💁Details:</strong> {place.placeDetails}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 mb-2">
            <strong className="text-gray-700">💸Ticket Pricing:</strong> {place.ticketPricing}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 mb-2">
            <strong className="text-gray-700">⌚Best Time to Visit:</strong> {place.bestTimeToVisit}
          </p>
          <p className="text-xs sm:text-sm text-gray-600">
            <strong className="text-gray-700">⌛Time Travel:</strong> {place.timeTravel}
          </p>
        </div>
      </Link>
    </div>
  );
}

function PlacesToVisit({ trip }) {
  return (
    <div className="mt-6 sm:mt-8">
      <h2 className="font-bold text-xl sm:text-2xl mb-4 sm:mb-6 text-blue-600">Places To Visit</h2>

      <div>
        {trip?.tripData?.itinerary?.map((dayPlan, index) => (
          <div key={index} className="mb-6 sm:mb-8 md:mb-10 border-b border-gray-200 pb-6 sm:pb-8 last:border-b-0">
            <h2 className="font-semibold text-lg sm:text-xl text-gray-800 mb-4 sm:mb-6">{dayPlan.day}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {dayPlan.plan.map((place, idx) => (
                <PlaceCard key={idx} place={place} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlacesToVisit;
