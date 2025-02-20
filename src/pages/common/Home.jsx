import React, { useState, useCallback, Suspense, lazy, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaHome, FaUserGraduate, FaShieldAlt, FaComments, FaUniversity, FaWifi, FaShieldVirus, FaBed, FaMapMarkerAlt, FaDollarSign, FaBath, FaCalendarAlt, FaFilter, FaChevronLeft, FaChevronRight, FaTools, FaHeadset, FaClipboardCheck, FaWrench, FaArrowRight, FaTimes, FaQuoteRight, FaCheck } from 'react-icons/fa';
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
    availability: '',
    university: '',
    location: ''
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
      type: "Single Room",
      priceRange: "USD 150-200",
      features: [
        "Private Personal Space",
        "Study Desk & Chair",
        "Single Bed",
        "Shared Kitchen Access",
        "Shared Bathroom",
        "Basic Utilities Included"
      ],
      bestFor: "Students who prefer privacy and independent living"
    },
    {
      type: "Double Room",
      priceRange: "USD 120-150",
      features: [
        "Shared Room (2 People)",
        "Individual Study Areas",
        "Twin Beds",
        "Shared Kitchen Access",
        "Shared Bathroom",
        "All Utilities Included"
      ],
      bestFor: "Budget-conscious students who enjoy companionship"
    },
    {
      type: "Suite",
      priceRange: "USD 250-300",
      features: [
        "Private Bedroom",
        "En-suite Bathroom",
        "Study Area",
        "Mini Kitchenette",
        "Premium Furnishings",
        "All Utilities + WiFi"
      ],
      bestFor: "Students seeking premium comfort and privacy"
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
          location: room.location,
          nearbyUniversities: room.nearbyUniversities,
          distanceToUniversity: room.distanceToUniversity,
          price: parseFloat(room.price),
          displayPrice: `USD ${room.price}`,
          type: room.type,
          image: room.image || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          features: [
            ...(room.amenities || []),
            room.distanceToUniversity && `${room.distanceToUniversity} to university`,
            'Safe neighborhood',
            '24/7 security'
          ].filter(Boolean),
          roomFeatures: room.features || { quietStudyArea: false, preferredGender: 'any' },
          beds: `${room.capacity} ${room.capacity > 1 ? 'Beds' : 'Bed'}`,
          availability: room.isAvailable ? "Available Now" : "Occupied",
          isAvailable: room.isAvailable,
          occupants: room.occupants || [],
          capacity: room.capacity,
          occupancyStatus: getOccupancyStatus(room),
          floorLevel: room.floorLevel,
          propertyAmenities: room.propertyAmenities || []
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

      // Filter by university
      if (selectedFilters.university) {
        filtered = filtered.filter(room => room.nearbyUniversities?.includes(selectedFilters.university));
      }

      // Filter by location
      if (selectedFilters.location) {
        filtered = filtered.filter(room => room.location.toLowerCase().includes(selectedFilters.location.toLowerCase()));
      }

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
      if (selectedFilters.roomType) {
        filtered = filtered.filter(room => room.type.toLowerCase() === selectedFilters.roomType.toLowerCase());
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
        {/* Animated Background with Parallax Effect */}
        <div className="absolute inset-0">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url(https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80)`,
              filter: 'brightness(0.6)'
            }}
          />
        </div>
        
        {/* Enhanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-transparent z-10"></div>
        
        {/* Content with Enhanced Animations */}
        <div className="relative w-full max-w-[1200px] mx-auto px-4 h-full flex flex-col justify-center items-center text-white z-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-8 px-4"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
              Premium Student Accommodation
            </h1>
            <p className="text-lg md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Experience Luxury Living with SairosProperties Zimbabwe
            </p>
          </motion.div>

          {/* Enhanced Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-2xl px-4"
          >
            <form onSubmit={handleSearch} className="relative group">
              <input
                type="text"
                placeholder="Search by university or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 rounded-full text-gray-800 text-lg focus:outline-none focus:ring-4 focus:ring-blue-500/30 shadow-lg transition-all duration-300 group-hover:shadow-2xl"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black text-white p-4 rounded-full hover:bg-blue-600 transition-all duration-300 group-hover:scale-105"
              >
                <FaSearch className="w-5 h-5" />
              </button>
            </form>
          </motion.div>

          {/* Enhanced Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
            className="mt-8 flex gap-4 flex-wrap justify-center"
          >
            <button
              onClick={() => handleQuickLinks('/student/dashboard')}
              className="bg-white/10 backdrop-blur-md px-8 py-3 rounded-full hover:bg-white/20 transition-all duration-300 flex items-center gap-3 transform hover:scale-105 border border-white/20 group"
            >
              <FaClipboardCheck className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" /> 
              <span className="font-medium">Student Portal</span>
            </button>
            <button
              onClick={() => handleQuickLinks('/register')}
              className="bg-white/10 backdrop-blur-md px-8 py-3 rounded-full hover:bg-white/20 transition-all duration-300 flex items-center gap-3 transform hover:scale-105 border border-white/20 group"
            >
              <FaUserGraduate className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" /> 
              <span className="font-medium">Apply Now</span>
            </button>
          </motion.div>

          {/* Enhanced Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
            className="mt-12 grid grid-cols-3 gap-6 text-center px-4"
          >
            <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">500+</div>
              <div className="text-sm md:text-base text-gray-300 mt-1">Available Rooms</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">6</div>
              <div className="text-sm md:text-base text-gray-300 mt-1">Universities</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">1000+</div>
              <div className="text-sm md:text-base text-gray-300 mt-1">Happy Students</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Search Filters */}
      <section className="py-8 md:py-12 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100"
          >
            <div className="flex flex-col md:flex-row gap-6 justify-center flex-wrap">
              <div className="relative w-full md:w-auto group">
              <select 
                  className="w-full md:w-64 appearance-none bg-white border-2 border-gray-200 rounded-xl px-4 py-3 pr-10 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-all duration-300 group-hover:border-blue-500"
                value={selectedFilters.university}
                onChange={(e) => handleFilterChange('university', e.target.value)}
              >
                <option value="">Select University</option>
                {universities.map((uni, index) => (
                  <option key={index} value={uni}>{uni}</option>
                ))}
              </select>
                <FaUniversity className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
            </div>

              <div className="relative w-full md:w-auto group">
              <select 
                  className="w-full md:w-64 appearance-none bg-white border-2 border-gray-200 rounded-xl px-4 py-3 pr-10 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-all duration-300 group-hover:border-blue-500"
                value={selectedFilters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              >
                <option value="">Select Location</option>
                <option value="Mount Pleasant">Mount Pleasant</option>
                <option value="Avondale">Avondale</option>
                <option value="Hatfield">Hatfield</option>
                <option value="Belvedere">Belvedere</option>
                <option value="Msasa">Msasa</option>
                <option value="Eastlea">Eastlea</option>
                <option value="Milton Park">Milton Park</option>
                <option value="Marlborough">Marlborough</option>
                <option value="Greendale">Greendale</option>
              </select>
                <FaMapMarkerAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
            </div>

              <div className="relative w-full md:w-auto group">
              <select 
                  className="w-full md:w-64 appearance-none bg-white border-2 border-gray-200 rounded-xl px-4 py-3 pr-10 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-all duration-300 group-hover:border-blue-500"
                value={selectedFilters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
              >
                <option value="">Price Range</option>
                <option value="0-200">Under $200</option>
                <option value="200-300">$200 - $300</option>
                <option value="300-400">$300 - $400</option>
                <option value="400">Above $400</option>
              </select>
                <FaDollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
            </div>

              <div className="relative w-full md:w-auto group">
              <select 
                  className="w-full md:w-64 appearance-none bg-white border-2 border-gray-200 rounded-xl px-4 py-3 pr-10 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-all duration-300 group-hover:border-blue-500"
                value={selectedFilters.roomType}
                onChange={(e) => handleFilterChange('roomType', e.target.value)}
              >
                <option value="">Room Type</option>
                <option value="single">Single Room</option>
                <option value="double">Double Room</option>
                <option value="suite">Suite</option>
                <option value="apartment">Apartment</option>
              </select>
                <FaBed className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
            </div>

              <div className="relative w-full md:w-auto group">
              <select 
                  className="w-full md:w-64 appearance-none bg-white border-2 border-gray-200 rounded-xl px-4 py-3 pr-10 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-all duration-300 group-hover:border-blue-500"
                value={selectedFilters.availability}
                onChange={(e) => handleFilterChange('availability', e.target.value)}
              >
                <option value="">Move In Date</option>
                <option value="immediate">Immediate</option>
                <option value="next-month">Next Month</option>
                <option value="next-semester">Next Semester</option>
              </select>
                <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
            </div>

            <button 
              onClick={() => setSelectedFilters({ priceRange: '', roomType: '', availability: '', university: '', location: '' })}
                className="w-full md:w-auto bg-gradient-to-r from-black to-gray-800 text-white px-8 py-3 rounded-xl 
                  hover:from-gray-800 hover:to-black transition-all duration-300 flex items-center justify-center gap-2 
                  transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
                <FaFilter className="w-4 h-4" />
                <span>Reset Filters</span>
            </button>
          </div>
          </motion.div>
        </div>
      </section>

      {/* Universities Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
              Popular Universities
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find accommodation near Zimbabwe's top educational institutions
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {universities.map((uni, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <FaUniversity className="w-6 h-6 md:w-8 md:h-8 text-blue-600 group-hover:text-purple-600 transition-colors duration-300" />
                  </div>
                  <p className="text-sm md:text-base font-medium text-gray-800 text-center group-hover:text-blue-600 transition-colors duration-300">
                    {uni}
                  </p>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></div>
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
                          {room.location && (
                          <div className="flex items-center text-gray-600 mb-2">
                            <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                            <span className="text-sm">{room.location}</span>
                          </div>
                          )}
                          {room.distanceToUniversity && (
                          <div className="flex items-center text-gray-600 mb-2">
                            <FaUniversity className="w-4 h-4 mr-2" />
                            <span className="text-sm">{room.distanceToUniversity}</span>
                          </div>
                          )}
                          {room.nearbyUniversities?.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {room.nearbyUniversities.slice(0, 2).map((uni, index) => (
                              <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {uni}
                              </span>
                            ))}
                          </div>
                          )}
                          {room.features?.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {room.features.slice(0, 3).map((feature, index) => (
                              <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {feature}
                              </span>
                            ))}
                          </div>
                          )}
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
                onClick={() => navigate('/rooms#available-rooms')}
                className="bg-white text-black px-8 py-4 rounded-xl border-2 border-black
                  hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-105 
                  shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto group"
              >
                <span>View All Available Rooms</span>
                <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
              What Our Students Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from students who have found their perfect accommodation through our platform
            </p>
          </motion.div>

          <Slider {...testimonialSettings} className="testimonial-slider">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="px-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group relative overflow-hidden"
                >
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-500"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-tr-full transform -translate-x-8 translate-y-8 group-hover:-translate-x-4 group-hover:translate-y-4 transition-transform duration-500"></div>

                  {/* Quote Icon */}
                  <div className="mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center transform -rotate-6 group-hover:rotate-0 transition-transform duration-500">
                      <FaQuoteRight className="w-6 h-6 text-blue-600 group-hover:text-purple-600 transition-colors duration-500" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative">
                    <p className="text-gray-600 italic mb-6 leading-relaxed">"{testimonial.text}"</p>
                    
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full flex items-center justify-center mr-4">
                        <FaUserGraduate className="w-6 h-6 text-blue-600 group-hover:text-purple-600 transition-colors duration-500" />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-500">{testimonial.name}</p>
                        <p className="text-sm text-gray-500">{testimonial.university}</p>
                    </div>
                  </div>
                  </div>

                  {/* Bottom Border Animation */}
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </motion.div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* Price Comparison Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
              Room Types & Pricing
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose from our range of carefully designed accommodation options to suit your needs and budget
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {priceComparison.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden"
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Content */}
                <div className="relative">
                  {/* Room Type Badge */}
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 mb-6">
                    <span className="text-blue-600 font-semibold group-hover:text-purple-600 transition-colors duration-500">
                      {option.type}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-500">
                      {option.priceRange}
                    </div>
                    <div className="text-sm text-gray-500">per month, per person</div>
                  </div>

                  {/* Divider */}
                  <div className="h-px w-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-transparent mb-8"></div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                  {option.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-600 group-hover:text-gray-700 transition-colors duration-500">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-500">
                          <FaCheck className="w-3 h-3 text-blue-600 group-hover:text-purple-600 transition-colors duration-500" />
                        </div>
                        <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                  {/* Best For Tag */}
                  <div className="text-sm text-gray-500 mt-6 pb-6">
                    <span className="font-medium text-gray-700">Perfect for:</span><br/>
                    <span className="italic">{option.bestFor}</span>
                  </div>

                  {/* CTA Button */}
                  <button 
                    onClick={() => {
                      const roomType = option.type.toLowerCase().replace(' ', '-');
                      navigate(`/rooms#available-rooms`, {
                        state: {
                          filters: {
                            type: roomType,
                            priceRange: option.priceRange.replace('USD ', '')
                          }
                        }
                      });
                    }}
                    className="w-full mt-6 bg-gradient-to-r from-black to-gray-800 text-white px-6 py-3 rounded-xl 
                    hover:from-gray-800 hover:to-black transition-all duration-300 transform group-hover:scale-105 
                      flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <span>Browse {option.type}s</span>
                    <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>

                {/* Bottom Border Animation */}
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </motion.div>
            ))}
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center"
          >
            <p className="text-gray-600 mb-6">
              All rooms come with basic furnishings and utilities. Prices may vary based on location and specific amenities.
            </p>
            <button 
              onClick={() => navigate('/rooms#available-rooms')}
              className="bg-white text-black px-8 py-4 rounded-xl border-2 border-black
                hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-105 
                shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto group"
            >
              <span>View All Available Rooms</span>
              <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* City Guide Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
              {cityGuide.title}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {cityGuide.description}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cityGuide.sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => navigate('/guide')}
              >
                <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-500">
                  {/* Background Image */}
                  <div className="absolute inset-0">
                  <img 
                    src={section.image} 
                    alt={section.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-500"></div>
                    </div>

                  {/* Content */}
                  <div className="relative h-full p-8 flex flex-col justify-end">
                    {/* Icon */}
                    <div className="mb-4">
                      <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500">
                        {index === 0 ? (
                          <FaUserGraduate className="w-6 h-6 text-white group-hover:text-blue-400 transition-colors duration-500" />
                        ) : index === 1 ? (
                          <FaMapMarkerAlt className="w-6 h-6 text-white group-hover:text-purple-400 transition-colors duration-500" />
                        ) : (
                          <FaHome className="w-6 h-6 text-white group-hover:text-pink-400 transition-colors duration-500" />
                        )}
                  </div>
                    </div>

                    {/* Text Content */}
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3 transform group-hover:translate-x-2 transition-transform duration-500">
                      {section.title}
                    </h3>
                    <p className="text-gray-300 text-sm md:text-base transform group-hover:translate-x-2 transition-transform duration-500 delay-75">
                      {section.content}
                    </p>

                    {/* Arrow Icon */}
                    <div className="mt-6 flex items-center text-white/80 group-hover:text-white transition-colors duration-500 transform group-hover:translate-x-2 transition-transform duration-500 delay-100">
                      <span className="text-sm font-medium mr-2">Learn More</span>
                      <FaArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Hover Border Effect */}
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-12"
          >
            <button 
              onClick={() => navigate('/guide')}
              className="bg-gradient-to-r from-black to-gray-800 text-white px-8 py-4 rounded-xl 
              hover:from-gray-800 hover:to-black transition-all duration-300 transform hover:scale-105 
              shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto group"
            >
              <span>Explore Harare Guide</span>
              <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
              Why Choose Us
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience the perfect blend of comfort, convenience, and community in our student accommodations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Content */}
                <div className="relative">
                  {/* Icon Container */}
                  <div className="mb-6 transform group-hover:scale-110 transition-transform duration-500">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl flex items-center justify-center">
                      {React.cloneElement(feature.icon, {
                        className: "w-8 h-8 text-blue-600 group-hover:text-purple-600 transition-colors duration-500"
                      })}
                    </div>
                  </div>
                  
                  {/* Text Content */}
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors duration-500">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-500">
                    {feature.description}
                  </p>
                </div>
                
                {/* Bottom Border Animation */}
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-full"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find and secure your perfect student accommodation in three simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative group"
            >
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 text-center">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    1
              </div>
                </div>
                <div className="mt-8">
                  <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    <FaSearch className="w-8 h-8 mx-auto text-blue-600 group-hover:text-purple-600 transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">Search</h3>
                  <p className="text-gray-600">Browse our extensive collection of student accommodations near your university</p>
                </div>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative group"
            >
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 text-center">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    2
              </div>
                </div>
                <div className="mt-8">
                  <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    <FaClipboardCheck className="w-8 h-8 mx-auto text-purple-600 group-hover:text-pink-600 transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">Apply</h3>
                  <p className="text-gray-600">Complete your application with our simple and secure online process</p>
                </div>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative group"
            >
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 text-center">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    3
              </div>
                </div>
                <div className="mt-8">
                  <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    <FaHome className="w-8 h-8 mx-auto text-pink-600 group-hover:text-red-600 transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">Move In</h3>
                  <p className="text-gray-600">Get your keys and start enjoying your new student home in Harare</p>
                </div>
              </div>
            </motion.div>
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
              onClick={() => {
                if (!isAuthenticated()) {
                  navigate('/login');
                  return;
                }
                navigate('/register');
              }}
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
