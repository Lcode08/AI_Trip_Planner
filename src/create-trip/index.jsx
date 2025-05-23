import React, { useEffect, useState } from 'react'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'
import { Input } from "@/components/ui/input"
import { AI_PROMPT, SelectBudgetOptions } from '@/constants/options'
import { SelectTravelesList } from '@/constants/options'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { chatSession } from '@/Service/AIModal'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/Service/firebaseConfig'
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from 'react-router-dom'



function CreateTrip() {
  const [place, setPlace] = useState();

  const[formData, setFormData] = useState([]);
  const[openDialog, setOpenDialog] = useState(false);
  const[loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (name, value) => {
      setFormData({
        ...formData,
        [name]: value
      })
  }

  useEffect(() => {
    console.log(formData);
  },[formData])

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log("Login Successful:");
      GetUserProfile(tokenResponse);
    },
    onError: (error) => console.error("Login Failed:", error),
    scope: "openid profile email", // Correct scopes
  });
  

  const OnGenerateTrip = async ()=> {

    const User = localStorage.getItem('user');

    if(!User){
      setOpenDialog(true);
      return;
    }
    
    if(formData?.noOfDays>5&& !formData?.location|| !formData?.budget|| !formData?.Travelers){
      toast.error("Please fill all the details!");
      return;
    }
    console.log(formData);

    setLoading(true);
    const FINAL_PROMPT = AI_PROMPT
    .replace('{location}',formData?.location.label)
    .replace('{totalDays}',formData?.noOfDays)
    .replace('{Travelers}',formData?.Travelers)
    .replace('{budget}',formData?.budget)
    .replace('{totalDays}',formData?.noOfDays)

    console.log(FINAL_PROMPT);

    const result =await chatSession.sendMessage(FINAL_PROMPT);
    setLoading(false);

    console.log("--", result?.response?.text());

    saveAiTrip(result?.response?.text());

  }

  const saveAiTrip = async (TripData) => {

    setLoading(true);
    const user =JSON.parse(localStorage.getItem('user'));
    const docId = Date.now().toString();
    await setDoc(doc(db, "AITrips", docId), {
      userSelection: formData,
      tripData: JSON.parse(TripData),
      userEmail:user?.email,
      id:docId,
    });
    setLoading(false);

    navigate('/view-trip/'+docId);
 }

  const GetUserProfile = async (tokenInfo) => {
    console.log(tokenInfo);
    const accessToken = tokenInfo?.access_token; // Extract access_token
    console.log(accessToken);
    if (!accessToken) {
      console.error("Access token not found.");
      return;
    }
    try {
      const response = await axios.get(
        "https://openidconnect.googleapis.com/v1/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: "application/json",
          },
        }
      );
      console.log("Response:", response.data);
      localStorage.setItem('user', JSON.stringify(response.data));   
      setOpenDialog(false);
      OnGenerateTrip();   
    } catch (error) {
      console.error("Error occurred:", error.response?.data || error.message);
    }
    
  };
  

  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10'>
      <h2 className='font-bold text-3xl'>Tell us your travel preferences 🏕️🌴</h2>
      <p className='mt-3 text-gray-500 text-xl '>
      Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.</p>

      <div className='mt-20 flex flex-col gap-10'>

        <div>
          <h2 className='text-xl my-3 font-medium '>
            What is destination of choice?
          </h2>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
            selectProps={{
              place,
              onChange:(v)=>{setPlace(v); handleInputChange('location', v)}
            }}
          />
         </div>

        <div>
          <h2 className='text-xl my-3 font-medium '>
            How many days are you planning your trip?
          </h2>
          <Input placeholder={'Ex.3'} type="number" 
            onChange={(e) => handleInputChange('noOfDays',e.target.value)}
          />
        </div>

        <div>
          <h2 className='text-xl my-3 font-medium '>
            What is Your Budget?
          </h2>
          <div className='grid grid-cols-3 gap-5 mt-5 '>
            {SelectBudgetOptions.map((item, index) => (
              <div key={index} 
                onClick={() => handleInputChange('budget', item.title)}
              className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg
                    ${formData?.budget==item.title&&'shadow-lg border-black'}
                  `}>
                <h2 className='text-4xl'>{item.icon}</h2>
                <h2 className='font-bold text-lg'>{item.title}</h2>
                <h2 className='text-sm text-gray-500'>{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className='text-xl my-3 font-medium '>
            Who do you plan on traveling with on your next adventure?
          </h2>
          <div className='grid grid-cols-3 gap-5 mt-5 '>
            {SelectTravelesList.map((item, index) => (
              <div key={index}
                onClick={() => handleInputChange('Travelers', item.people)}
                className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg
                    ${formData?.Travelers==item.people&&'shadow-lg border-black'}
                  `}>
                <h2 className='text-4xl'>{item.icon}</h2>
                <h2 className='font-bold text-lg'>{item.title}</h2>
                <h2 className='text-sm text-gray-500'>{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

      </div>  
      
        <div className='mx-10 justify-center flex '>
          <Button
            disabled={loading}
           onClick={OnGenerateTrip}>
            {loading? <AiOutlineLoading3Quarters className='h-7 w-7 animate-spin'/> : 
            'Generate Trip' }
          </Button>
        </div>

        <Dialog open={openDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogDescription>
                <h1 className='text-2xl font-bold text-blue-500 tracking-wide'>
                  Trip<span className='text-green-500'>Saathi</span>
                </h1>
                  <h2 className='font-bold text-lg'>Sign In With Google</h2>
                  <p>Sign in to the App with Google authentication securely</p>

                  <Button 
                      onClick={login}
                      className="w-full mt-5 flex gap-4 items-center h-[40px]">
                      <FcGoogle className='h-12 w-12'/>
                      Sign in with Google
                  </Button>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>


    </div>
  )
}

export default CreateTrip