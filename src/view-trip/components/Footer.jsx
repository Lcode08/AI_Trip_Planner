import React from 'react';

function Footer() {
  return (
   <footer className="w-full bg-gray-900 text-gray-300 py-6 sm:py-8 md:py-10 px-4 sm:px-6 mt-8">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
      
      <div className="text-center md:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">Trip<span className="text-green-400">Saathi</span></h1>
        <p className="text-xs sm:text-sm mt-1">Your trusted AI-powered travel companion.</p>
      </div>

      <div className="text-xs sm:text-sm text-center md:text-right space-y-1">
        <p>Email: <a href="mailto:support@tripsaathi.com" className="hover:underline text-green-400 break-all">support@tripsaathi.com</a></p>
        <p>Phone: <a href="tel:+9194032288212" className="hover:underline text-green-400">+91-94032288212</a></p>
      </div>
    </div>

    <div className="max-w-6xl mx-auto text-center mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-700 text-xs text-gray-500 px-2">
      © {new Date().getFullYear()} <strong>TripSaathi.com</strong>. All rights reserved. | Designed with ❤️ by Lokesh Patil.
    </div>
  </footer>
  );
}

export default Footer;
