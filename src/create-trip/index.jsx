import React, { useEffect, useState } from 'react'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'
import { Input } from "@/components/ui/input"
import { AI_PROMPT, SelectBudgetOptions } from '@/constants/options'
import { SelectTravelesList } from '@/constants/options'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { sendMessageWithFallback } from '@/Service/AIModal'
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
  

  const OnGenerateTrip = async () => {
    const User = localStorage.getItem('user');

    if (!User) {
      setOpenDialog(true);
      return;
    }
    
    if (!formData?.location || !formData?.noOfDays || !formData?.budget || !formData?.Travelers) {
      toast.error("Please fill all the required fields!");
      return;
    }

    setLoading(true);

    try {
      const FINAL_PROMPT = AI_PROMPT
        .replace('{location}', formData?.location?.label || formData?.location)
        .replace('{totalDays}', formData?.noOfDays)
        .replace('{Travelers}', formData?.Travelers)
        .replace('{budget}', formData?.budget)
        .replace('{totalDays}', formData?.noOfDays);

      console.log("Sending prompt to AI:", FINAL_PROMPT);

      const result = await sendMessageWithFallback(FINAL_PROMPT);
      
      if (!result || !result?.response) {
        throw new Error("No response received from AI service");
      }

      const responseText = result.response.text();
      
      if (!responseText) {
        throw new Error("Empty response received from AI service");
      }

      console.log("AI Response received:", responseText);

      // Try to parse and validate JSON response
      let tripData;
      try {
        // Extract JSON from markdown code blocks if present
        const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || responseText.match(/```\s*([\s\S]*?)\s*```/);
        const jsonString = jsonMatch ? jsonMatch[1] : responseText;
        tripData = JSON.parse(jsonString);
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError);
        throw new Error("Invalid JSON response from AI. Please try again.");
      }

      await saveAiTrip(tripData);
      
    } catch (error) {
      console.error("Error generating trip:", error);
      setLoading(false);
      
      const errorMessage = error?.message || "Unknown error";
      
      // User-friendly error messages
      if (errorMessage.includes("API key") || errorMessage.includes("VITE_GOOGLE_GEMINI_AI_API_KEY")) {
        toast.error("API key error. Please check your environment variables.", {
          duration: 5000,
        });
      } else if (errorMessage.includes("All models failed")) {
        // Show detailed error for model availability issues
        toast.error(
          "Unable to access AI models. Please check:\n1. API key is valid\n2. Generative AI API is enabled\n3. Billing is enabled",
          {
            duration: 6000,
          }
        );
        console.error("Detailed error:", errorMessage);
      } else if (errorMessage.includes("404") || errorMessage.includes("not found")) {
        toast.error("AI model not available. Please check your API key permissions.", {
          duration: 5000,
        });
      } else if (errorMessage.includes("quota") || errorMessage.includes("limit")) {
        toast.error("API quota exceeded. Please try again later.", {
          duration: 5000,
        });
      } else if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
        toast.error("Network error. Please check your connection and try again.", {
          duration: 5000,
        });
      } else {
        toast.error(errorMessage.length > 100 ? errorMessage.substring(0, 100) + "..." : errorMessage, {
          duration: 6000,
        });
      }
    }
  }

  const saveAiTrip = async (TripData) => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      const docId = Date.now().toString();
      
      // TripData is already parsed JSON object
      await setDoc(doc(db, "AITrips", docId), {
        userSelection: formData,
        tripData: TripData,
        userEmail: user?.email,
        id: docId,
      });
      
      setLoading(false);
      toast.success("Trip generated successfully!");
      navigate('/view-trip/' + docId);
    } catch (error) {
      console.error("Error saving trip:", error);
      setLoading(false);
      toast.error("Failed to save trip. Please try again.");
    }
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
    <div className='px-4 sm:px-6 md:px-10 lg:px-32 xl:px-56 2xl:px-72 mt-6 sm:mt-8 md:mt-10 mb-10'>
      <h2 className='font-bold text-xl sm:text-2xl md:text-3xl'>Tell us your travel preferences 🏕️🌴</h2>
      <p className='mt-2 sm:mt-3 text-gray-500 text-sm sm:text-base md:text-lg lg:text-xl'>
      Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.</p>

      <div className='mt-8 sm:mt-12 md:mt-16 lg:mt-20 flex flex-col gap-6 sm:gap-8 md:gap-10'>

        <div>
          <h2 className='text-base sm:text-lg md:text-xl my-2 sm:my-3 font-medium'>
            What is destination of choice?
          </h2>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
            selectProps={{
              place,
              onChange:(v)=>{setPlace(v); handleInputChange('location', v)},
              className: "w-full"
            }}
          />
         </div>

        <div>
          <h2 className='text-base sm:text-lg md:text-xl my-2 sm:my-3 font-medium'>
            How many days are you planning your trip?
          </h2>
          <Input placeholder={'Ex.3'} type="number" 
            onChange={(e) => handleInputChange('noOfDays',e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <h2 className='text-base sm:text-lg md:text-xl my-2 sm:my-3 font-medium'>
            What is Your Budget?
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 mt-3 sm:mt-4 md:mt-5'>
            {SelectBudgetOptions.map((item, index) => (
              <div key={index} 
                onClick={() => handleInputChange('budget', item.title)}
              className={`p-3 sm:p-4 border cursor-pointer rounded-lg hover:shadow-lg transition-all
                    ${formData?.budget==item.title&&'shadow-lg border-black'}
                  `}>
                <h2 className='text-3xl sm:text-4xl'>{item.icon}</h2>
                <h2 className='font-bold text-base sm:text-lg mt-1'>{item.title}</h2>
                <h2 className='text-xs sm:text-sm text-gray-500 mt-1'>{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className='text-base sm:text-lg md:text-xl my-2 sm:my-3 font-medium'>
            Who do you plan on traveling with on your next adventure?
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 mt-3 sm:mt-4 md:mt-5'>
            {SelectTravelesList.map((item, index) => (
              <div key={index}
                onClick={() => handleInputChange('Travelers', item.people)}
                className={`p-3 sm:p-4 border cursor-pointer rounded-lg hover:shadow-lg transition-all
                    ${formData?.Travelers==item.people&&'shadow-lg border-black'}
                  `}>
                <h2 className='text-3xl sm:text-4xl'>{item.icon}</h2>
                <h2 className='font-bold text-base sm:text-lg mt-1'>{item.title}</h2>
                <h2 className='text-xs sm:text-sm text-gray-500 mt-1'>{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

      </div>  
      
        <div className='mt-6 sm:mt-8 md:mt-10 justify-center flex'>
          <Button
            disabled={loading}
            onClick={OnGenerateTrip}
            className="w-full sm:w-auto px-8 sm:px-10 py-2 sm:py-3 text-sm sm:text-base">
            {loading? <AiOutlineLoading3Quarters className='h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 animate-spin'/> : 
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