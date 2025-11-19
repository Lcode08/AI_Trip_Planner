import { Button } from '@/components/ui/button';
import { GetPlaceDetails, PHOTO_REF_URL } from '@/Service/GlobalApi';
import React, { useEffect, useState } from 'react'
import { IoIosSend } from "react-icons/io";

function InfoSection({trip}) {

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
    <div>
        <img src={photoUrl} className='h-[200px] sm:h-[250px] md:h-[300px] lg:h-[340px] w-full object-cover rounded-xl'/>

        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4 sm:mt-5'>
            <div className='flex flex-col gap-2 w-full sm:w-auto'>
                <h2 className='font-bold text-xl sm:text-2xl'>{trip?.userSelection?.location?.label}</h2>
                <div className='flex flex-wrap gap-2 sm:gap-3 md:gap-5'>
                    <h2 className='p-1 px-2 sm:px-3 bg-gray-200 rounded-full text-gray-500 text-xs sm:text-sm md:text-base whitespace-nowrap'>🗓️ {trip.userSelection?.noOfDays} Days</h2>
                    <h2 className='p-1 px-2 sm:px-3 bg-gray-200 rounded-full text-gray-500 text-xs sm:text-sm md:text-base whitespace-nowrap'>💰 {trip.userSelection?.budget} Budget</h2>
                    <h2 className='p-1 px-2 sm:px-3 bg-gray-200 rounded-full text-gray-500 text-xs sm:text-sm md:text-base whitespace-nowrap'>🥂 {trip.userSelection?.Travelers}</h2>
                </div>
            </div>
            <Button className="w-full sm:w-auto"><IoIosSend className="text-lg sm:text-xl" /></Button>
        </div>
    </div>
  )
}

export default InfoSection
