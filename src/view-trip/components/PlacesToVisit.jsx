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
    <div className="w-full md:w-1/2 lg:w-1/3 p-4 bg-white shadow-md rounded-lg hover:shadow-lg hover:scale-105 cursor-pointer transition-all">
      
      <Link to={'https://www.google.com/maps/search/?api=1&query=' + place.placeName} target='_blank'>
        <div className="relative rounded-t-lg overflow-hidden h-48">
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

        <div className="p-4">
          <h4 className="font-semibold text-lg text-gray-700 mb-2">
            📍{place.placeName}
          </h4>
          <p className="text-sm text-gray-600 mb-2">
            <strong>💁Details:</strong> {place.placeDetails}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            <strong>💸Ticket Pricing:</strong> {place.ticketPricing}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            <strong>⌚Best Time to Visit:</strong> {place.bestTimeToVisit}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            <strong>⌛Time Travel:</strong> {place.timeTravel}
          </p>
        </div>
      </Link>
    </div>
  );
}

function PlacesToVisit({ trip }) {
  return (
    <div>
      <h2 className="font-bold text-2xl mb-4 text-blue-600">Places To Visit</h2>

      <div>
        {trip?.tripData?.itinerary?.map((dayPlan, index) => (
          <div key={index} className="mb-8 border-b pb-4">
            <h2 className="font-semibold text-xl text-gray-800 mb-4">{dayPlan.day}</h2>

            <div className="flex flex-wrap gap-6">
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
