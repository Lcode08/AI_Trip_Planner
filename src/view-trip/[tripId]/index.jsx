import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/Service/firebaseConfig';
import InfoSection from '../components/InfoSection';
import Hotels from '../components/Hotels';
import PlacesToVisit from '../components/PlacesToVisit';
import Footer from '../components/Footer';

function ViewTrip() {

  const {tripId} = useParams();
  const [trip, setTrip] = useState([]);

  useEffect(() => {
      tripId&&GetTripData();
  },[tripId])

  // use to get Trip information from Firebase 
  const GetTripData = async () =>{
      const docRef = doc(db, 'AITrips', tripId);
      const docSnap = await getDoc(docRef);

      if(docSnap.exists()){
        toast.success('Trip Details found !');
        console.log("Document: ", docSnap.data());
        setTrip(docSnap.data());
      }
      else{
        console.log("No Such Document");
        toast.error('No Trip Found !')
      }

  }

  return (
    <>
      <div className='px-4 sm:px-6 md:px-10 lg:px-20 xl:px-32 2xl:px-44 py-6 sm:py-8 md:py-10'>
          {/* information Section  */}
          <InfoSection trip={trip}/>

          {/* Recommended Hotels section  */}
          <Hotels trip={trip}/>

          {/* Daily plans for places to visit  */}
          <PlacesToVisit trip={trip}/>
      </div>
      
      {/* Footer Section - Full Width */}
      <Footer trip={trip}/>
    </>
  )
}

export default ViewTrip
