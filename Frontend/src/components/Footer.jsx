import React from 'react';

function Footer() {
  return (
    <footer className="text-black py-6 mt-10 ">
      <div className="container mx-auto text-center">
        <div className="flex justify-center space-x-6 mb-4">
          <a href="/about" className="hover:text-gray-400">About Us</a>
          <a href="/services" className="hover:text-gray-400">Services</a>
          <a href="/contact" className="hover:text-gray-400">Contact</a>
          <a href="/privacy" className="hover:text-gray-400">Privacy Policy</a>
        </div>
        <div className="text-sm">
          <p>Contact us: info@example.com | +1 (555) 123-4567</p>
          <p>&copy; {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
