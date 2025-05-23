import { GetPlaceDetails, PHOTO_REF_URL } from '@/Service/GlobalApi';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function UserTripCardItem({trip}) {
 const [photoUrl, setPhotoUrl] = useState('');
  useEffect(()=> {
    trip&&GetPlacePhoto();
  },[trip])

  const GetPlacePhoto=async ()=> {
    const data = {
      textQuery: trip?.userSelection?.location?.label
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
    <Link to={'/view-trip/'+ trip?.id}>
        <div className='hover:scale-105 transition-all hover:shadow-md'>
            
            <div className="relative rounded-xl h-[250px] overflow-hidden">
              <img 
                src={photoUrl} 
                className="object-cover w-full h-full rounded-xl"
                alt={trip?.userSelection?.location?.label || "Trip destination"}
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = '/placeholder.jpg'
                }}
              />
            </div>
            <div className="mt-2">
                <h2 className='font-bold text-lg '>{trip?.userSelection?.location?.label}</h2>
                <h2 className='text-sm text-gray-500'>{trip?.userSelection?.noOfDays} Days of trip with {trip?.userSelection?.budget} budget</h2>
            </div>
        </div>
    </Link>
  )
}

export default UserTripCardItem