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
        <img src={photoUrl} className='h-[340px] w-full object-cover rounded-xl'/>

        <div className='flex justify-between items-center'>
            <div className='my-5 flex flex-col gap-2'>
                <h2 className='font-bold text-2xl '>{trip?.userSelection?.location?.label}</h2>
                <div className='flex gap-5'>
                    <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>🗓️ {trip.userSelection?.noOfDays} Days</h2>
                    <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>💰 {trip.userSelection?.budget} Budget</h2>
                    <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>🥂 No. of Travelers: {trip.userSelection?.Travelers}</h2>
                </div>
            </div>
            <Button><IoIosSend /></Button>
        </div>
    </div>
  )
}

export default InfoSection
