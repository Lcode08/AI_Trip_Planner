import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from "react-icons/fc";
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

function Header() {

  const user = JSON.parse(localStorage.getItem('user'));
  const[openDialog, setOpenDialog] = useState(false);

  useEffect(()=> {
    console.log(user);
    console.log(user?.picture);
  })

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log("Login Successful:");
      GetUserProfile(tokenResponse);
    },
    onError: (error) => console.error("Login Failed:", error),
    scope: "openid profile email", // Correct scopes
  });

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
      window.location.reload();  
    } catch (error) {
      console.error("Error occurred:", error.response?.data || error.message);
    }
    
  };

  return (
    <div className='p-2 sm:p-3 shadow-sm flex justify-between items-center px-3 sm:px-5'>
         <a href="/">
          <h2 className='text-lg sm:text-xl md:text-2xl font-bold text-blue-500 tracking-wide cursor-pointer'>
            Trip<span className='text-green-500'>Saathi</span>
          </h2>
        </a>
        <div>
          {user?
            <div className='flex items-center gap-1 sm:gap-2 md:gap-3'>
            <a href='/create-trip' className="hidden sm:block">
              <Button variant="outline" className="rounded-full text-xs sm:text-sm px-2 sm:px-4">+ Create Trip</Button>   
            </a>
            <a href='/create-trip' className="sm:hidden">
              <Button variant="outline" className="rounded-full text-xs px-2">+</Button>   
            </a>
            <a href='/my-trips' className="hidden md:block">
              <Button variant="outline" className="rounded-full text-xs sm:text-sm px-2 sm:px-4">My Trips</Button>   
            </a>
              <Popover>
                <PopoverTrigger asChild>
                  <div className="w-[30px] h-[30px] sm:w-[35px] sm:h-[35px] rounded-full overflow-hidden cursor-pointer" 
                       style={{ background: 'transparent', border: 'none', padding: 0 }}>
                    <img 
                      src={user?.picture} 
                      className='w-full h-full object-cover'
                      style={{ display: 'block' }}
                      alt="User profile"
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent>
                  <h2 className='cursor-pointer' onClick={()=> {
                    googleLogout();
                    localStorage.clear();
                    window.location.href = '/';
                  }}>
                  LogOut</h2>
                </PopoverContent>
              </Popover>
            </div>
            : <Button onClick={()=> setOpenDialog(true)} className="text-xs sm:text-sm px-3 sm:px-4">Sign In</Button>
          }
      
        </div>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <div className="flex flex-col items-center text-center space-y-4 py-4">
                            <h1 className='text-3xl font-bold text-blue-500 tracking-wide'>
                              Trip<span className='text-green-500'>Saathi</span>
                            </h1>
                            <div className="space-y-2">
                              <h2 className='font-bold text-xl text-gray-800'>Sign In With Google</h2>
                              <p className="text-sm text-gray-600">Sign in to the App with Google authentication securely</p>
                            </div>
            
                              <Button 
                                  onClick={login}
                                  className="w-full mt-4 flex gap-3 items-center justify-center h-12 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all">
                                  <FcGoogle className='h-6 w-6'/>
                                  <span>Sign in with Google</span>
                              </Button>
                          </div>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
        
    </div> 
  )
}

export default Header