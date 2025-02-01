import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Shield, Clock, MapPin, Filter, ChevronLeft, ChevronRight, Star, Users, Bath, Wifi, Home as HomeIcon } from 'lucide-react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  const cities = [
    "Harare",
    "Bulawayo",
    "Gweru",
    "Mutare",
    "Masvingo"
  ];

  const features = [
    {
      title: "Live",
      description: "Step into exclusive student residences where luxury meets learning. Our premium accommodations create the perfect environment for academic excellence and personal growth.",
      icon: <HomeIcon className="h-6 w-6" />
    },
    {
      title: "Study",
      description: "Dedicated study spaces, high-speed Wi-Fi, and quiet zones designed to inspire focus and achievement. Transform your academic journey in our thoughtfully crafted environments.",
      icon: <Calendar className="h-6 w-6" />
    },
    {
      title: "Connect",
      description: "Join a vibrant community of ambitious students. From common areas to organized events, forge lifelong friendships and valuable networks.",
      icon: <Users className="h-6 w-6" />
    },
    {
      title: "Thrive",
      description: "Experience a balanced lifestyle with our premium amenities. From fitness centers to recreation areas, we've created spaces that nurture both body and mind.",
      icon: <Star className="h-6 w-6" />
    }
  ];

  // Featured Properties Data
  const featuredProperties = [
    {
      id: 1,
      title: "Modern Student Studio",
      location: "Mount Pleasant, Harare",
      price: "$300/month",
      rating: 4.8,
      reviews: 124,
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      amenities: ["Wi-Fi", "En-suite", "Study Area", "Security"],
      beds: 1,
      baths: 1,
      maxOccupants: 1
    },
    {
      id: 2,
      title: "Shared Student House",
      location: "Avondale, Harare",
      price: "$200/month",
      rating: 4.6,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      amenities: ["Wi-Fi", "Garden", "Parking", "Laundry"],
      beds: 3,
      baths: 2,
      maxOccupants: 3
    },
    {
      id: 3,
      title: "Premium University Apartment",
      location: "CBD, Harare",
      price: "$400/month",
      rating: 4.9,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      amenities: ["Wi-Fi", "Gym", "Study Room", "24/7 Security"],
      beds: 2,
      baths: 1,
      maxOccupants: 2
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "University of Zimbabwe",
      content: "As an international student, finding accommodation was my biggest worry. The support team was incredibly helpful throughout the entire booking process.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64&q=80"
    },
    {
      name: "Michael Mupfumi",
      role: "University of Zimbabwe",
      content: "Finding accommodation was never easier. The platform is user-friendly and efficient! I found my perfect room within days.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64&q=80"
    }
  ];

  const stats = [
    { label: "Elite Properties", value: "500+" },
    { label: "Premium Locations", value: "25+" },
    { label: "Student Communities", value: "15+" },
    { label: "Years of Excellence", value: "10+" }
  ];

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => 
        prev === featuredProperties.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => 
      prev === featuredProperties.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => 
      prev === 0 ? featuredProperties.length - 1 : prev - 1
    );
  };

  const PropertyCard = ({ property }) => (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden">
      <img 
        src={property.image} 
        alt={property.title}
        className="w-full h-64 object-cover"
      />
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{property.title}</h3>
            <p className="text-gray-600 flex items-center mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {property.location}
            </p>
          </div>
          <div className="flex items-center">
            <Star className="h-5 w-5 text-gray-900" />
            <span className="ml-1 text-gray-900 font-semibold">{property.rating}</span>
            <span className="text-gray-600 text-sm ml-1">({property.reviews})</span>
          </div>
        </div>
        
        <div className="mt-4 flex items-center space-x-4 text-gray-600">
          <div className="flex items-center">
            <HomeIcon className="h-4 w-4 mr-1" />
            <span>{property.beds} Bed</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            <span>{property.baths} Bath</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{property.maxOccupants} Max</span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {property.amenities.map((amenity, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-gray-100 text-gray-900 rounded-full text-sm"
            >
              {amenity}
            </span>
          ))}
        </div>

        <div className="mt-6 flex justify-between items-center">
          <span className="text-2xl font-bold text-black">{property.price}</span>
          <Link
            to={`/property/${property.id}`}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition duration-200"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );

  // Add new video data with YouTube IDs
  const promoVideos = [
    {
      id: 1,
      title: "Experience Luxury Student Living",
      youtubeId: "dQw4w9WgXcQ", // Replace with actual YouTube video ID
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg"
    },
    {
      id: 2,
      title: "A Day in Student Life",
      youtubeId: "M7lc1UVf-VE", // Replace with actual YouTube video ID
      thumbnail: "https://img.youtube.com/vi/M7lc1UVf-VE/maxresdefault.jpg"
    },
    {
      id: 3,
      title: "Premium Amenities Tour",
      youtubeId: "VbXNmIvWa1c", // Replace with actual YouTube video ID
      thumbnail: "https://img.youtube.com/vi/VbXNmIvWa1c/maxresdefault.jpg"
    }
  ];

  // State for YouTube modal
  const [selectedVideo, setSelectedVideo] = useState(null);

  // YouTube Player Modal Component
  const YouTubeModal = ({ videoId, onClose }) => {
    if (!videoId) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
        <div className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white">
      {/* Hero Section with YouTube Background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <iframe
            className="w-full h-full scale-150"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&controls=0&mute=1&loop=1&playlist=dQw4w9WgXcQ"
            title="Background video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-gray-900/90" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
              <span className="block">The Pinnacle of</span>
              <span className="block text-gray-200">Student Living Excellence</span>
            </h1>
            <p className="mt-6 max-w-lg mx-auto text-xl text-gray-200 sm:max-w-3xl">
              Discover a new standard in student accommodation where luxury meets learning. Experience not just a room, but an unmatched lifestyle designed for academic brilliance.
            </p>

            {/* Enhanced Search Bar */}
            <div className="mt-10 max-w-xl mx-auto">
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <select
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                      >
                        <option value="">Select City</option>
                        {cities.map((city) => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search properties..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <button className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition duration-200 flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Showcase Section with YouTube Integration */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Experience the Future of Student Living
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Take a virtual tour through our premium student accommodations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {promoVideos.map((video) => (
              <div key={video.id} className="relative group">
                <div 
                  className="relative aspect-video overflow-hidden rounded-xl cursor-pointer"
                  onClick={() => setSelectedVideo(video.youtubeId)}
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                    <button className="bg-white/90 p-4 rounded-full transform transition-transform duration-300 group-hover:scale-110">
                      <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{video.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* YouTube Modal */}
      <YouTubeModal
        videoId={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />

      {/* Featured Properties Carousel */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Featured Properties
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Discover our hand-picked selection of premium student accommodations
            </p>
          </div>

          <div className="relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {featuredProperties.map((property) => (
                  <div key={property.id} className="w-full flex-shrink-0 px-4">
                    <PropertyCard property={property} />
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Controls */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition duration-200"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition duration-200"
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </button>

            {/* Carousel Indicators */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-2 mt-4">
              {featuredProperties.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 w-2 rounded-full transition-colors duration-200 ${
                    currentSlide === index ? 'bg-black' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-black">{stat.value}</div>
                <div className="text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Features Section */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              A New Way to Experience Student Life
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Where Innovation Meets Tradition, Creating Experiences Beyond Imagination
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div key={index} className="bg-white p-8 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105">
                  <div className="text-black w-12 h-12 flex items-center justify-center bg-gray-100 rounded-xl">
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

      {/* New Lifestyle Grid Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="relative aspect-square group overflow-hidden rounded-xl">
              <img
                src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Live"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <h3 className="text-white text-2xl font-bold">Live</h3>
              </div>
            </div>
            <div className="relative aspect-square group overflow-hidden rounded-xl">
              <img
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Study"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <h3 className="text-white text-2xl font-bold">Study</h3>
              </div>
            </div>
            <div className="relative aspect-square group overflow-hidden rounded-xl">
              <img
                src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Connect"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <h3 className="text-white text-2xl font-bold">Connect</h3>
              </div>
            </div>
            <div className="relative aspect-square group overflow-hidden rounded-xl">
              <img
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Thrive"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <h3 className="text-white text-2xl font-bold">Thrive</h3>
              </div>
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
            </h2><p className="mt-4 text-xl text-gray-600">
              Join thousands of satisfied students who found their perfect accommodation
            </p>
          </div>
          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-gray-50 p-8 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105">
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
      <div className="bg-gradient-to-r from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Your Journey to Excellence Begins Here
            </h2>
            <p className="mt-4 text-xl text-gray-100">
              Join a community of ambitious students in Zimbabwe's finest student accommodations
            </p>
            <div className="mt-8 flex justify-center gap-4 flex-wrap">
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-medium rounded-md text-black bg-white hover:bg-gray-50 transition duration-200 shadow-lg hover:shadow-xl"
              >
                Create Your Account
              </Link>
              <Link
                to="/browse"
                className="inline-flex items-center px-8 py-3 border border-white text-lg font-medium rounded-md text-white hover:bg-white/10 transition duration-200"
              >
                Browse Properties
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h4 className="text-white font-semibold text-lg">About Us</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-400 hover:text-white">Our Story</Link></li>
                <li><Link to="/team" className="text-gray-400 hover:text-white">Team</Link></li>
                <li><Link to="/careers" className="text-gray-400 hover:text-white">Careers</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-semibold text-lg">Students</h4>
              <ul className="space-y-2">
                <li><Link to="/how-it-works" className="text-gray-400 hover:text-white">How it Works</Link></li>
                <li><Link to="/safety" className="text-gray-400 hover:text-white">Safety</Link></li>
                <li><Link to="/universities" className="text-gray-400 hover:text-white">Universities</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-semibold text-lg">Landlords</h4>
              <ul className="space-y-2">
                <li><Link to="/list-property" className="text-gray-400 hover:text-white">List Your Property</Link></li>
                <li><Link to="/landlord-guide" className="text-gray-400 hover:text-white">Landlord Guide</Link></li>
                <li><Link to="/partnership" className="text-gray-400 hover:text-white">Partnership</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-semibold text-lg">Support</h4>
              <ul className="space-y-2">
                <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact Us</Link></li>
                <li><Link to="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
                <li><Link to="/help" className="text-gray-400 hover:text-white">Help Center</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800">
            <p className="text-center text-gray-400">
              © {new Date().getFullYear()} Student Housing. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}