import React, { useState, useCallback, Suspense, lazy, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaHome, FaUserGraduate, FaShieldAlt, FaComments, FaUniversity, FaWifi, FaShieldVirus, FaBed, FaMapMarkerAlt, FaDollarSign, FaBath, FaCalendarAlt, FaFilter, FaChevronLeft, FaChevronRight, FaTools, FaHeadset, FaClipboardCheck, FaWrench, FaArrowRight, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'leaflet/dist/leaflet.css';
import { fetchRooms, submitApplication } from '../../services/api';
import { isAuthenticated } from '../../services/auth';
import RoomCard from '../../components/common/RoomCard';
import ApplicationModal from '../../components/student/ApplicationModal';
import { toast } from 'react-toastify';

// Create a Map component that will be loaded lazily
const Map = lazy(() => import('./Map'));

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    priceRange: '',
    roomType: '',
    availability: ''
  });
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [selectedRoomForApplication, setSelectedRoomForApplication] = useState(null);

  const universities = [
    "University of Zimbabwe",
    "Harare Institute of Technology",
    "Women's University in Africa",
    "Catholic University in Zimbabwe",
    "Zimbabwe Open University",
    "Africa University"
  ];

  const features = [
    {
      icon: <FaHome className="w-8 h-8 text-primary" />,
      title: "Quality Accommodation",
      description: "Verified properties near major Harare universities"
    },
    {
      icon: <FaWifi className="w-8 h-8 text-primary" />,
      title: "Modern Amenities",
      description: "High-speed internet and study-friendly environments"
    },
    {
      icon: <FaShieldVirus className="w-8 h-8 text-primary" />,
      title: "Safe & Secure",
      description: "24/7 security and gated communities for peace of mind"
    },
    {
      icon: <FaUniversity className="w-8 h-8 text-primary" />,
      title: "Campus Proximity",
      description: "Walking distance to major Harare universities"
    }
  ];

  const testimonials = [
    {
      name: "Tatenda Moyo",
      university: "University of Zimbabwe",
      text: "Found a great apartment just 5 minutes from UZ campus. The security and facilities are excellent!"
    },
    {
      name: "Chiedza Mutasa",
      university: "Harare Institute of Technology",
      text: "As an international student, finding accommodation was my biggest worry. This platform made it so easy!"
    }
  ];

  const cityGuide = {
    title: "Living in Harare",
    description: "Your comprehensive guide to student life in Zimbabwe's capital",
    sections: [
      {
        title: "Student Life",
        content: "Experience vibrant campus culture, diverse communities, and exciting student activities",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1"
      },
      {
        title: "Transportation",
        content: "Easy access to universities with local transport and walking routes",
        image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d"
      },
      {
        title: "Food & Culture",
        content: "Discover local cuisine, markets, and cultural hotspots",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836"
      }
    ]
  };

  const priceComparison = [
    {
      type: "Shared Room",
      priceRange: "USD 150-200",
      features: ["Shared Facilities", "Basic Amenities", "Bills Included"],
      bestFor: "Budget-conscious students"
    },
    {
      type: "Private Room",
      priceRange: "USD 250-350",
      features: ["Private Space", "Shared Kitchen", "Study Area"],
      bestFor: "Independent living"
    },
    {
      type: "Studio Apartment",
      priceRange: "USD 300-450",
      features: ["Full Privacy", "En-suite", "Kitchenette"],
      bestFor: "Luxury student living"
    }
  ];

  const mapProperties = featuredRooms.map(room => ({
    id: room.id,
    position: [
      room.id === 1 ? -17.820 : room.id === 2 ? -17.815 : -17.825,
      room.id === 1 ? 31.050 : room.id === 2 ? 31.045 : 31.055
    ],
    title: room.title,
    price: room.price,
    image: room.image,
    location: room.location
  }));

  const mapContainerStyle = {
    width: '100%',
    height: '500px'
  };

  const center = {
    lat: -17.820,
    lng: 31.050
  };

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  const testimonialSettings = {
    ...carouselSettings,
    slidesToShow: 2,
    responsive: [
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  const heroImages = [
    {
      url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      title: "Modern Student Living",
      subtitle: "Experience comfort and convenience"
    },
    {
      url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      title: "Premium Locations",
      subtitle: "Close to your university"
    },
    {
      url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      title: "Affordable Housing",
      subtitle: "Options for every budget"
    },
    {
      url: "https://images.unsplash.com/photo-1600573472591-ee6c8e695394?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      title: "Study-Friendly Spaces",
      subtitle: "Designed for academic success"
    },
    {
      url: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      title: "Community Living",
      subtitle: "Connect with fellow students"
    }
  ];

  const heroSettings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    cssEase: 'linear',
    arrows: false,
    pauseOnHover: false
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/rooms?search=${searchQuery}`);
  };

  const handleQuickLinks = (path) => {
    if (path.startsWith('/student/') || path.startsWith('/admin/')) {
      if (!isAuthenticated()) {
        navigate('/login');
        return;
      }
    }
    navigate(path);
  };

  const handleViewDetails = (room) => {
    setSelectedRoom({
      ...room,
      features: room.roomFeatures
    });
  };

  const handleApplyNow = (room = null) => {
    if (!room?.isAvailable) {
      toast.error('This room is not available for application');
      return;
    }
    setSelectedRoomForApplication(room);
    setIsApplicationModalOpen(true);
  };

  const handleApplicationSubmit = async (formData) => {
    try {
      // Log the request data
      console.log('Submitting application with data:', formData);

      // Ensure we have a room ID and it's available
      if (!selectedRoomForApplication?.id) {
        throw new Error('No room selected for application');
      }

      if (!selectedRoomForApplication.isAvailable) {
        throw new Error('Selected room is not available for application');
      }

      // Validate student ID format
      if (!formData.studentId || formData.studentId.length < 3) {
        throw new Error('Invalid student ID format. Please enter your complete student ID');
      }

      // Format the application data
      const applicationData = {
        ...formData,
        roomId: selectedRoomForApplication.id,
        preferences: {
          floorLevel: formData.preferences?.floorLevel || 'ground',
          roommateGender: formData.preferences?.roommateGender || 'same',
          quietStudyArea: Boolean(formData.preferences?.quietStudyArea),
          roomType: selectedRoomForApplication.type || 'single',
          studyHabits: formData.preferences?.studyHabits || 'early',
          sleepSchedule: formData.preferences?.sleepSchedule || 'medium'
        }
      };

      // Log the final application data
      console.log('Final application data:', applicationData);

      // Submit the application
      const response = await submitApplication(applicationData);
      
      // Log the response
      console.log('Application submission response:', response);

      // Show success message
      toast.success('Application submitted successfully! Check your email for the application ID.');
      
      // Close the modal and reset the selected room
      setIsApplicationModalOpen(false);
      setSelectedRoomForApplication(null);
    } catch (error) {
      // Log the full error details
      console.error('Error submitting application:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        data: error.response?.data,
        details: error.details
      });

      // Show a more specific error message based on the response
      let errorMessage = 'Failed to submit application. ';
      
      if (error.response?.data?.error) {
        errorMessage += error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Please try again later.';
      }

      // Log the error response for debugging
      console.log('Error response:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        config: error.config,
        details: error.details
      });
      
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    const loadRooms = async () => {
      try {
        setLoading(true);
        const rooms = await fetchRooms();
        // Transform the room data to match our UI requirements
        const transformedRooms = rooms.map(room => ({
          id: room._id,
          title: `${room.type.charAt(0).toUpperCase() + room.type.slice(1)} Room`,
          location: `Floor: ${room.floorLevel}`,
          price: parseFloat(room.price),
          displayPrice: `USD ${room.price}`,
          type: room.type,
          image: room.image || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          features: room.amenities || [],
          roomFeatures: room.features || { quietStudyArea: false, preferredGender: 'any' },
          beds: `${room.capacity} ${room.capacity > 1 ? 'Beds' : 'Bed'}`,
          availability: room.isAvailable ? "Available Now" : "Occupied",
          isAvailable: room.isAvailable,
          occupants: room.occupants || [],
          capacity: room.capacity,
          occupancyStatus: getOccupancyStatus(room),
          floorLevel: room.floorLevel
        }));
        setFeaturedRooms(transformedRooms);
        setFilteredRooms(transformedRooms);
      } catch (err) {
        console.error('Error loading rooms:', err);
        setError('Failed to load rooms');
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, []);

  // Apply filters when selectedFilters change
  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...featuredRooms];

      // Filter by price range
      if (selectedFilters.priceRange) {
        const [min, max] = selectedFilters.priceRange.split('-').map(Number);
        if (max) {
          filtered = filtered.filter(room => room.price >= min && room.price <= max);
        } else {
          filtered = filtered.filter(room => room.price >= min);
        }
      }

      // Filter by room type
      if (selectedFilters.roomType && selectedFilters.roomType !== '') {
        filtered = filtered.filter(room => room.type.toLowerCase() === selectedFilters.roomType);
      }

      // Filter by availability
      if (selectedFilters.availability) {
        switch (selectedFilters.availability) {
          case 'immediate':
            filtered = filtered.filter(room => room.isAvailable);
            break;
          case 'next-month':
            filtered = filtered.filter(room => room.occupancyStatus !== 'full');
            break;
          case 'next-semester':
            filtered = filtered.filter(room => room.occupancyStatus !== 'full');
            break;
          default:
            break;
        }
      }

      setFilteredRooms(filtered);
    };

    applyFilters();
  }, [selectedFilters, featuredRooms]);

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const getOccupancyStatus = (room) => {
    if (!room.occupants || room.occupants.length === 0) return 'available';
    if (room.occupants.length < room.capacity) return 'partially';
    return 'full';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'from-green-600 to-green-500';
      case 'partially':
        return 'from-yellow-600 to-yellow-500';
      case 'full':
        return 'from-red-600 to-red-500';
      default:
        return 'from-gray-600 to-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available':
        return 'Available Now';
      case 'partially':
        return 'Partially Occupied';
      case 'full':
        return 'Fully Occupied';
      default:
        return 'Status Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[600px] overflow-hidden w-full">
        {/* Static Background Image */}
        <div className="absolute inset-0">
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url(https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80)`,
              filter: 'brightness(0.6)'
            }}
          />
        </div>
        
        {/* Overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50 z-10"></div>
        
        {/* Content */}
        <div className="relative w-full max-w-[1200px] mx-auto px-4 h-full flex flex-col justify-center items-center text-white z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6 px-4"
          >
            <h1 className="text-3xl md:text-5xl font-bold mb-2">Premium Student Accommodation</h1>
            <p className="text-base md:text-xl text-gray-200">Experience Luxury Living with SairosProperties Zimbabwe</p>
          </motion.div>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full max-w-2xl px-4"
          >
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search by university or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 md:px-6 py-3 md:py-4 rounded-full text-gray-800 text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/30 text-black p-2 md:p-3 rounded-full hover:bg-blue-700 transition-colors duration-300"
              >
                <FaSearch className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </form>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex gap-4 flex-wrap justify-center"
          >
            <button
              onClick={() => handleQuickLinks('/student/dashboard')}
              className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-full hover:bg-white/30 transition-colors duration-300 flex items-center gap-2 transform hover:scale-105"
            >
              <FaClipboardCheck /> Student Portal
            </button>
            <button
              onClick={() => handleQuickLinks('/register')}
              className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-full hover:bg-white/30 transition-colors duration-300 flex items-center gap-2 transform hover:scale-105"
            >
              <FaUserGraduate /> Apply Now
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 md:mt-12 grid grid-cols-2 md:flex gap-4 text-center px-4"
          >
            <div className="bg-white/10 backdrop-blur-md px-4 md:px-6 py-2 md:py-3 rounded-lg">
              <div className="text-xl md:text-3xl font-bold">500+</div>
              <div className="text-xs md:text-sm">Available Rooms</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 md:px-6 py-2 md:py-3 rounded-lg">
              <div className="text-xl md:text-3xl font-bold">6</div>
              <div className="text-xs md:text-sm">Universities</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 md:px-6 py-2 md:py-3 rounded-lg col-span-2 md:col-span-1">
              <div className="text-xl md:text-3xl font-bold">1000+</div>
              <div className="text-xs md:text-sm">Happy Students</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Search Filters */}
      <section className="py-6 md:py-8 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <div className="relative w-full md:w-auto">
              <select 
                className="w-full md:w-auto appearance-none bg-white border-2 border-gray-200 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-gray-500"
                value={selectedFilters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
              >
                <option value="">Price Range</option>
                <option value="0-200">Under $200</option>
                <option value="200-300">$200 - $300</option>
                <option value="300">Above $300</option>
              </select>
              <FaDollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <div className="relative w-full md:w-auto">
              <select 
                className="w-full md:w-auto appearance-none bg-white border-2 border-gray-200 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-gray-500"
                value={selectedFilters.roomType}
                onChange={(e) => handleFilterChange('roomType', e.target.value)}
              >
                <option value="">Room Type</option>
                <option value="single">Single Room</option>
                <option value="double">Double Room</option>
                <option value="suite">Suite</option>
              </select>
              <FaBed className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <div className="relative w-full md:w-auto">
              <select 
                className="w-full md:w-auto appearance-none bg-white border-2 border-gray-200 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-gray-500"
                value={selectedFilters.availability}
                onChange={(e) => handleFilterChange('availability', e.target.value)}
              >
                <option value="">Move In Date</option>
                <option value="immediate">Immediate</option>
                <option value="next-month">Next Month</option>
                <option value="next-semester">Next Semester</option>
              </select>
              <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <button 
              onClick={() => setSelectedFilters({ priceRange: '', roomType: '', availability: '' })}
              className="w-full md:w-auto bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition flex items-center justify-center gap-2"
            >
              <FaFilter />
              Reset Filters
            </button>
          </div>
        </div>
      </section>

      {/* Universities Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-gray-900">Popular Universities</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {universities.map((uni, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-3 md:p-4 rounded-lg text-center hover:bg-gray-100 cursor-pointer transition border border-gray-200"
              >
                <FaUniversity className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-gray-900" />
                <p className="text-xs md:text-sm font-medium text-gray-800">{uni}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Properties</h2>
              <p className="text-gray-600 mt-2">
                {filteredRooms.length} {filteredRooms.length === 1 ? 'property' : 'properties'} found
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-4 md:mt-0">
              <div className="flex gap-2 items-center mr-4">
                <span className="inline-block w-3 h-3 bg-gradient-to-r from-green-600 to-green-500 rounded-full"></span>
                <span className="text-sm text-gray-600">Available</span>
              </div>
              <div className="flex gap-2 items-center mr-4">
                <span className="inline-block w-3 h-3 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-full"></span>
                <span className="text-sm text-gray-600">Partially Occupied</span>
              </div>
              <div className="flex gap-2 items-center mr-4 md:mr-8">
                <span className="inline-block w-3 h-3 bg-gradient-to-r from-red-600 to-red-500 rounded-full"></span>
                <span className="text-sm text-gray-600">Fully Occupied</span>
              </div>
              <div className="hidden md:flex gap-4">
                <button 
                  onClick={() => document.querySelector('.slick-prev').click()}
                  className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <FaChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <button 
                  onClick={() => document.querySelector('.slick-next').click()}
                  className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <FaChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-8">
              {error}
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="text-center text-gray-600 py-8">
              No rooms match your selected filters
            </div>
          ) : (
            <Slider {...carouselSettings}>
              {filteredRooms.map((room) => (
                <div key={room.id} className="px-2">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={room.image} 
                        alt={room.title}
                        className="w-full h-full object-cover transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60";
                        }}
                      />
                      <div className={`absolute top-4 right-4 bg-gradient-to-r ${getStatusColor(room.occupancyStatus)} text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg`}>
                        {getStatusText(room.occupancyStatus)}
                      </div>
                      {room.occupancyStatus !== 'full' && (
                        <div className="absolute bottom-4 right-4 bg-black/80 text-white px-3 py-1 rounded-full text-xs">
                          {room.occupants.length} / {room.capacity} Occupied
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-2 text-gray-900">{room.title}</h3>
                          <div className="flex items-center text-gray-600">
                            <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                            <span className="text-sm">{room.location}</span>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {room.features.slice(0, 3).map((feature, index) => (
                              <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-blue-600 font-bold text-lg">{room.displayPrice}/mo</div>
                      </div>
                      
                      <button 
                        onClick={() => handleViewDetails(room)}
                        className="w-full mt-4 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2 group"
                      >
                        View Details
                        <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                </div>
              ))}
            </Slider>
          )}
        </div>
      </section>

      {/* Room Details Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
          >
            <button
              onClick={() => setSelectedRoom(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
            >
              <FaTimes className="w-5 h-5 text-gray-600" />
            </button>
            
            <RoomCard
              room={{
                ...selectedRoom,
                roomNumber: selectedRoom.title.split(' ')[0],
                type: selectedRoom.type,
                capacity: selectedRoom.capacity,
                price: selectedRoom.price,
                amenities: selectedRoom.features,
                isAvailable: selectedRoom.isAvailable,
                features: selectedRoom.features,
                floorLevel: selectedRoom.floorLevel
              }}
              onApplyClick={() => handleApplyNow(selectedRoom)}
            />
          </motion.div>
        </div>
      )}

      {/* Remove Map Section and Replace with Available Rooms Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Available Rooms</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find your perfect student accommodation from our selection of available rooms. 
              Apply now to secure your spot in our premium student housing.
            </p>
                </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
          ) : error ? (
            <div className="text-center text-red-600 py-8">
              {error}
          </div>
          ) : filteredRooms.length === 0 ? (
            <div className="text-center text-gray-600 py-8">
              No rooms match your selected filters
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRooms.map((room) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={room.image} 
                      alt={room.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60";
                      }}
                    />
                    <div className={`absolute top-4 right-4 bg-gradient-to-r ${getStatusColor(room.occupancyStatus)} text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg`}>
                      {getStatusText(room.occupancyStatus)}
                    </div>
                    {room.occupancyStatus !== 'full' && (
                      <div className="absolute bottom-4 right-4 bg-black/80 text-white px-3 py-1 rounded-full text-xs">
                        {room.occupants.length} / {room.capacity} Occupied
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-900">{room.title}</h3>
                        <div className="flex items-center text-gray-600">
                          <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                          <span className="text-sm">{room.location}</span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {room.features.slice(0, 3).map((feature, index) => (
                            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-blue-600 font-bold text-lg">{room.displayPrice}/mo</div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleViewDetails(room)}
                        className="flex-1 bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        View Details
                      </button>
                      {room.occupancyStatus !== 'full' && (
                        <button 
                          onClick={() => handleApplyNow(room)}
                          className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          Apply Now
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {filteredRooms.length > 0 && (
            <div className="text-center mt-12">
              <button 
                onClick={() => navigate('/rooms')}
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 transition-colors duration-300"
              >
                View All Rooms
                <FaArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">What Our Students Say</h2>
          <Slider {...testimonialSettings}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="px-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="bg-white p-8 rounded-xl shadow-lg border border-gray-200"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                      <FaUserGraduate className="w-6 h-6 text-gray-900" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-gray-500 text-sm">{testimonial.university}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.text}"</p>
                </motion.div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* Price Comparison Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-gray-900">Accommodation Price Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {priceComparison.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-200"
              >
                <div className="text-gray-900 text-lg md:text-xl font-bold mb-2">{option.type}</div>
                <div className="text-2xl md:text-3xl font-bold mb-4 text-black">{option.priceRange}</div>
                <div className="text-xs md:text-sm text-gray-600 mb-4">per month</div>
                <ul className="space-y-2 mb-6">
                  {option.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-600 text-sm md:text-base">
                      <span className="w-2 h-2 bg-gray-900 rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="text-xs md:text-sm text-gray-500">Best for: {option.bestFor}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* City Guide Section */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-gray-900">{cityGuide.title}</h2>
            <p className="text-sm md:text-base text-gray-600">{cityGuide.description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {cityGuide.sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative h-48 md:h-64 mb-4 rounded-xl overflow-hidden">
                  <img 
                    src={section.image} 
                    alt={section.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-600/70 to-transparent group-hover:from-blue-600/50 transition-all">
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-lg md:text-xl font-bold mb-2">{section.title}</h3>
                      <p className="text-xs md:text-sm opacity-90">{section.content}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-8 md:mt-12">
            <button className="bg-black text-white px-6 md:px-8 py-2 md:py-3 rounded-full hover:bg-gray-800 transition text-sm md:text-base">
              Explore Harare Guide
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-white to-blue-50 p-4 md:p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <div className="mb-4 flex justify-center text-blue-600">{feature.icon}</div>
                <h3 className="text-lg md:text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm md:text-base text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-center"
            >
              <div className="bg-blue-100 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl md:text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Search</h3>
              <p className="text-sm md:text-base text-gray-600">Find properties near your university in Harare</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="bg-purple-100 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl md:text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Book</h3>
              <p className="text-sm md:text-base text-gray-600">Secure your accommodation with easy online booking</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }} 
              className="text-center"
            >
              <div className="bg-indigo-100 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl md:text-2xl font-bold text-indigo-600">3</span>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Move In</h3>
              <p className="text-sm md:text-base text-gray-600">Start enjoying your new student home in Harare</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Maintenance Section */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">Maintenance & Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-200"
            >
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-2 md:p-3 rounded-lg">
                  <FaTools className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold ml-4">24/7 Repairs</h3>
              </div>
              <p className="text-sm md:text-base text-gray-600 mb-4">Quick response to maintenance requests with our dedicated team available round the clock.</p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm md:text-base text-gray-600">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  Emergency repairs
                </li>
                <li className="flex items-center text-sm md:text-base text-gray-600">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  Regular maintenance
                </li>
                <li className="flex items-center text-sm md:text-base text-gray-600">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  Online request tracking
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-200"
            >
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-2 md:p-3 rounded-lg">
                  <FaHeadset className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold ml-4">Support Services</h3>
              </div>
              <p className="text-sm md:text-base text-gray-600 mb-4">Dedicated support team to assist with any accommodation-related queries.</p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm md:text-base text-gray-600">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                  24/7 helpline
                </li>
                <li className="flex items-center text-sm md:text-base text-gray-600">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                  Online chat support
                </li>
                <li className="flex items-center text-sm md:text-base text-gray-600">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                  Email assistance
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-200"
            >
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-2 md:p-3 rounded-lg">
                  <FaClipboardCheck className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold ml-4">Regular Inspections</h3>
              </div>
              <p className="text-sm md:text-base text-gray-600 mb-4">Scheduled property inspections to ensure everything is in perfect condition.</p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm md:text-base text-gray-600">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                  Monthly checks
                </li>
                <li className="flex items-center text-sm md:text-base text-gray-600">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                  Safety assessments
                </li>
                <li className="flex items-center text-sm md:text-base text-gray-600">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                  Preventive maintenance
                </li>
              </ul>
            </motion.div>
          </div>

          <div className="mt-8 md:mt-12 text-center">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-black text-white px-6 md:px-8 py-2 md:py-3 rounded-full hover:bg-gray-800 transition flex items-center mx-auto text-sm md:text-base"
            >
              <FaWrench className="mr-2 w-4 h-4 md:w-5 md:h-5" />
              Submit Maintenance Request
            </motion.button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-black via-gray-900 to-black text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">Ready to Find Your Student Home in Harare?</h2>
            <p className="text-base md:text-xl mb-6 md:mb-8 text-gray-300 max-w-2xl mx-auto">Join hundreds of students who have found their ideal accommodation</p>
            <button 
              onClick={() => handleQuickLinks('/register')}
              className="bg-white text-black px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 mx-auto text-sm md:text-base"
            >
              Get Started <FaArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Application Modal */}
      <ApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={() => {
          setIsApplicationModalOpen(false);
          setSelectedRoomForApplication(null);
        }}
        onSubmit={handleApplicationSubmit}
        room={selectedRoomForApplication || {}}
      />
    </div>
  );
};

export default Home;
