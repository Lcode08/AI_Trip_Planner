import { GetPlaceDetails, PHOTO_REF_URL } from '@/Service/GlobalApi';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function HotelCard({ hotel }) {
 const [photoUrl, setPhotoUrl] = useState('');
  useEffect(()=> {
    hotel&&GetPlacePhoto();
  },[hotel])

  const GetPlacePhoto=async ()=> {
    const data = {
      textQuery: hotel?.hotelName +","+ hotel.hotelAddress
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
    <Link to={'https://www.google.com/maps/search/?api=1&query='+ hotel?.hotelName +","+ hotel.hotelAddress } target='_blank'>
      <div className='hover:scale-[1.02] transition-all cursor-pointer bg-white rounded-lg shadow-md hover:shadow-lg overflow-hidden h-full'>
        <div className="relative rounded-t-lg overflow-hidden h-[180px] sm:h-[200px]">
          <img 
            src={photoUrl} 
            className='w-full h-full object-cover'
            alt={hotel?.hotelName}
            onError={(e) => {
              e.target.onerror = null
              e.target.src = '/placeholder.jpg'
            }}
          />
        </div>
        <div className='p-3 sm:p-4'>
          <h2 className='font-semibold text-base sm:text-lg text-gray-800 mb-2 line-clamp-1'>{hotel?.hotelName}</h2>
          <h2 className='text-xs text-gray-600 mb-2 sm:mb-3 line-clamp-2'>📍{hotel?.hotelAddress}</h2>
          <div className="flex items-center justify-between">
            <h2 className='text-xs sm:text-sm font-medium text-green-600'>💰 {hotel?.price}</h2>
            <h2 className='text-xs sm:text-sm font-medium text-yellow-600'>⭐ {hotel?.rating}</h2>
          </div>
        </div>
      </div>
    </Link>
  )
}

function Hotels({trip}) {
  return (
    <div className="mt-6 sm:mt-8">
        <h2 className="font-bold text-xl sm:text-2xl mb-4 sm:mb-6 text-blue-600">Hotels Recommendation</h2>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6'>
            {trip?.tripData?.hotels?.map((hotel, index) => (
              <HotelCard key={index} hotel={hotel} />
            ))}
        </div>
    </div>
  )
}

export default Hotels