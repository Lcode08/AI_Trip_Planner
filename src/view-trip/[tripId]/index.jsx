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
    <div className='p-10 md:px-20 lg:px-44 xl:px-56 '>
        {/* information Section  */}
        <InfoSection trip={trip}/>

        {/* Recommended Hotels section  */}
        <Hotels trip={trip}/>

        {/* Daily plans for places to visit  */}
        <PlacesToVisit trip={trip}/>

        {/* Footer Section  */}
        <Footer trip={trip}/>
    </div>
  )
}

export default ViewTrip
