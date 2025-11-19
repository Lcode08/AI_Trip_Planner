import React from 'react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'
import Footer from '@/view-trip/components/Footer'

function Hero() {
  return (
    <div>
    <div className='flex flex-col items-center px-4 sm:px-6 md:px-12 lg:px-32 xl:px-56 gap-6 sm:gap-8 md:gap-9'>
      <h1 className='font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-[50px] text-center mt-8 sm:mt-12 md:mt-16 leading-tight'> 
        <span className='text-[#4299e1]'>Discover Your Next Adventure with AI:</span>
        <span className='block mt-2'>Personalized Itineraries at Your Fingertips</span>
      </h1>

        <p className='text-sm sm:text-base md:text-lg lg:text-xl text-gray-500 text-center px-4 max-w-3xl'>Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget.</p>
        
        <Link to={'/create-trip'}>
          <Button className="text-sm sm:text-base px-6 sm:px-8 py-2 sm:py-3">Get Started, It's Free</Button>
        </Link>

      <img src='https://res.cloudinary.com/dupwervku/image/upload/v1748022459/landing_Image_formphotoeditor.com_nffvt3.jpg' className='rounded-xl w-full h-auto max-h-[300px] sm:max-h-[400px] md:max-h-[500px] lg:max-h-[600px] object-cover mb-5'/>
    </div>

    <div>
      <Footer/>
    </div>
  </div>

  )
}      

export default Hero
