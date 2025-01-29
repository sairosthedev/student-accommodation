import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const features = [
    {
      title: "Easy Room Booking",
      description: "Simple and quick process to find and book your perfect room. Browse through our verified listings and secure your accommodation in minutes.",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "24/7 Support",
      description: "Our dedicated support team is always here to help. Get assistance with bookings, maintenance requests, or any other queries around the clock.",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      title: "Verified Properties",
      description: "Every property in our listings is thoroughly verified for quality, safety, and comfort. We ensure you get the best accommodation experience possible.",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "University of London",
      content: "Finding accommodation was never easier. The platform is user-friendly and efficient! I found my perfect room within days.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
      name: "Michael Chen",
      role: "International Student",
      content: "As an international student, finding accommodation was my biggest worry. The support team was incredibly helpful throughout the entire booking process.",
      image: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Student accommodation"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-indigo-900/90 mix-blend-multiply" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
              <span className="block">Your Perfect</span>
              <span className="block text-blue-200">Student Home Awaits</span>
            </h1>
            <p className="mt-6 max-w-lg mx-auto text-xl text-gray-200 sm:max-w-3xl">
              Find comfortable and affordable student housing near your university.
              Verified properties, easy booking, and 24/7 support to ensure the best accommodation experience.
            </p>

            <div className="mt-10 flex justify-center">
              <Link
                to="/register"
                className="inline-flex items-center px-12 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition duration-200 shadow-lg hover:shadow-xl"
              >
                Get Started Today
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Choose Our Platform
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              We make finding your perfect student accommodation simple and stress-free
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div key={index} className="bg-white p-8 rounded-xl shadow-lg transform transition-all hover:scale-105">
                  <div className="text-blue-600 w-12 h-12 flex items-center justify-center bg-blue-100 rounded-xl">
                    {feature.icon}
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-gray-900">{feature.title}</h3>
                  <p className="mt-4 text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Student Success Stories
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Join thousands of satisfied students who found their perfect accommodation
            </p>
          </div>
          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-gray-50 p-8 rounded-xl shadow-lg transform transition-all hover:scale-105">
                  <div className="flex items-center">
                    <img className="h-14 w-14 rounded-full border-4 border-white shadow" src={testimonial.image} alt="" />
                    <div className="ml-4">
                      <div className="text-xl font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-blue-600 font-medium">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="mt-6 text-gray-600 leading-relaxed italic">"{testimonial.content}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Ready to Find Your New Home?
            </h2>
            <p className="mt-4 text-xl text-blue-100">
              Join thousands of students who have found their perfect accommodation with us
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                to="/register"
                className="inline-flex items-center px-12 py-4 border border-transparent text-lg font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 transition duration-200 shadow-lg hover:shadow-xl"
              >
                Create Your Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}