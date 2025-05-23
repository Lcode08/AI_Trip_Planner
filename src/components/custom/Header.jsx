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
    <div className='p-3 shadow-sm flex justify-between items-center px-5'>
         <a href="/">
          <h2 className='text-2xl font-bold text-blue-500 tracking-wide cursor-pointer'>
            Trip<span className='text-green-500'>Saathi</span>
          </h2>
        </a>
        <div>
          {user?
            <div className='flex items-center gap-3'>
            <a href='/create-trip'>
              <Button variant="outline" className="rounded-full">+ Create Trip</Button>   
            </a>
            <a href='/my-trips'>
              <Button variant="outline" className="rounded-full">My Trips</Button>   
            </a>
              <Popover>
                <PopoverTrigger asChild>
                  <div className="w-[35px] h-[35px] rounded-full overflow-hidden cursor-pointer" 
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
                    window.location.reload();
                  }}>
                  LogOut</h2>
                </PopoverContent>
              </Popover>
            </div>
            : <Button onClick={()=> setOpenDialog(true)}>Sign In</Button>
          }
      
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

export default Header