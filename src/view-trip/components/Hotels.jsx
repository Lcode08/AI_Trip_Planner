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
      <div className='hover:scale-105 transition-all cursor-pointer'>
        <div className="relative rounded-xl overflow-hidden h-[180px]">
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
        <div className='my-2'>
          <h2 className='font-medium'>{hotel?.hotelName}</h2>
          <h2 className='text-xs text-gray-500'>📍{hotel?.hotelAddress}</h2>
          <h2 className='text-sm flex flex-col gap-2'>💰 {hotel?.price}</h2>
          <h2 className='text-sm flex flex-col gap-2'>⭐ {hotel?.rating}</h2>
        </div>
      </div>
    </Link>
  )
}

function Hotels({trip}) {
  return (
    <div>
        <h2 className="font-bold text-2xl mb-4 text-blue-600">Hotels Recommendation</h2>

        <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5'>
            {trip?.tripData?.hotels?.map((hotel, index) => (
              <HotelCard key={index} hotel={hotel} />
            ))}
        </div>
    </div>
  )
}

export default Hotels