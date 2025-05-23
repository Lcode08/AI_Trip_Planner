import React from 'react';

function Footer() {
  return (
   <footer className="bg-gray-900 text-gray-300 py-10 px-4">
  <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
    
    <div>
      <h1 className="text-3xl font-bold text-white tracking-wide">Trip<span className="text-green-400">Saathi</span></h1>
      <p className="text-sm mt-1">Your trusted AI-powered travel companion.</p>
    </div>

    <div className="text-sm text-center md:text-right space-y-1">
      <p>Email: <a href="mailto:support@tripsaathi.com" className="hover:underline">support@tripsaathi.com</a></p>
      <p>Phone: <a href="tel:+9194032288212" className="hover:underline">+91-94032288212</a></p>
    </div>
  </div>

  <div className="text-center mt-8 text-xs text-gray-500">
    © {new Date().getFullYear()} <strong>TripSaathi.com</strong>. All rights reserved. | Designed with ❤️ by Lokesh Patil.
  </div>
</footer>

  );
}

export default Footer;
