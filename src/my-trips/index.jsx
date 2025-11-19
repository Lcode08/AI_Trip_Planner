import { db } from '@/Service/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useNavigation } from 'react-router-dom';
import UserTripCardItem from './Components/UserTripCardItem';

function MyTrips() {

    const navigation = useNavigation();
    const [userTrips, setUserTrips] = useState([]);
    useEffect(()=> {
        GetUserTrips();
    },[])

    // function to get all user trips 
    const GetUserTrips =async ()=> {
        const user= JSON.parse(localStorage.getItem('user'));
        
        if(!user){
            navigation('/');
            return;
        }

        const q= query(collection(db, 'AITrips'),where('userEmail','==',user?.email));
        const querySnapshot = await getDocs(q);
          setUserTrips([]);
            querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            setUserTrips(prevVal=>[...prevVal,doc.data()])
            });
    }
  return (
    <div className='px-4 sm:px-6 md:px-10 lg:px-32 xl:px-56 2xl:px-72 mt-6 sm:mt-8 md:mt-10 mb-10'>
        <h2 className='font-bold text-xl sm:text-2xl md:text-3xl'>My Trips</h2>

        {/* Skeleton effect is applied while loading data from DB  */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mt-6 sm:mt-8 md:mt-10'>
            {userTrips?.length>0? userTrips.map((trip,index)=> (
                <UserTripCardItem trip={trip} key={index}/>
            ))
            :[1,2,3,4,5,6].map((item,index) => (
                <div key={index} className='h-[200px] sm:h-[250px] w-full bg-slate-200 animate-pulse rounded-xl'>
                </div>
            ))}
        </div>
    </div>
  )
}

export default MyTrips