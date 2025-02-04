import React, { useState, useCallback, Suspense, lazy } from 'react';
import { FaSearch, FaHome, FaUserGraduate, FaShieldAlt, FaComments, FaUniversity, FaWifi, FaShieldVirus, FaBed, FaMapMarkerAlt, FaDollarSign, FaBath, FaCalendarAlt, FaFilter, FaChevronLeft, FaChevronRight, FaTools, FaHeadset, FaClipboardCheck, FaWrench } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'leaflet/dist/leaflet.css';

// Create a Map component that will be loaded lazily
const Map = lazy(() => import('./Map'));

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    priceRange: '',
    roomType: '',
    availability: ''
  });

  const universities = [
    "University of Zimbabwe",
    "Harare Institute of Technology",
    "Women's University in Africa",
    "Catholic University in Zimbabwe",
    "Zimbabwe Open University",
    "Africa University"
  ];

  const featuredRooms = [
    {
      id: 1,
      title: "Modern Studio Apartment",
      location: "Mount Pleasant, near UZ",
      price: "USD 250",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      features: ["Private Bathroom", "Study Desk", "WiFi", "Security"],
      beds: "1 Single Bed",
      availability: "Available Now",
      university: "University of Zimbabwe",
      distance: "5 mins walk"
    },
    {
      id: 2,
      title: "Shared Student House",
      location: "Belgravia, near HIT",
      price: "USD 180",
      image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      features: ["Shared Kitchen", "Laundry", "WiFi", "Garden"],
      beds: "2 Single Beds",
      availability: "From March 2024",
      university: "Harare Institute of Technology",
      distance: "10 mins walk"
    },
    {
      id: 3,
      title: "Premium En-suite Room",
      location: "Avondale, City Center",
      price: "USD 300",
      image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      features: ["Private Bathroom", "Balcony", "Air Conditioning", "Study Area"],
      beds: "1 Double Bed",
      availability: "Available Now",
      university: "Multiple Universities",
      distance: "15 mins by bus"
    }
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

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[600px] bg-black">
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 to-black/90"></div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-white">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold mb-6 text-center"
          >
            Find Your Perfect Student Home in Harare
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl mb-8 text-center max-w-2xl text-gray-200"
          >
            Quality accommodation near all major universities in Harare
          </motion.p>
          
          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full max-w-2xl"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search by university or location in Harare..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 rounded-full text-gray-800 text-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black text-white p-3 rounded-full hover:bg-gray-800 transition">
                <FaSearch className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Search Filters */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="relative">
              <select 
                className="appearance-none bg-white border-2 border-gray-200 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-gray-500"
                onChange={(e) => setSelectedFilters({...selectedFilters, priceRange: e.target.value})}
              >
                <option value="">Price Range</option>
                <option value="0-200">Under $200</option>
                <option value="200-300">$200 - $300</option>
                <option value="300+">Above $300</option>
              </select>
              <FaDollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <div className="relative">
              <select 
                className="appearance-none bg-white border-2 border-gray-200 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-gray-500"
                onChange={(e) => setSelectedFilters({...selectedFilters, roomType: e.target.value})}
              >
                <option value="">Room Type</option>
                <option value="shared">Shared Room</option>
                <option value="private">Private Room</option>
                <option value="studio">Studio</option>
              </select>
              <FaBed className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <div className="relative">
              <select 
                className="appearance-none bg-white border-2 border-gray-200 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-gray-500"
                onChange={(e) => setSelectedFilters({...selectedFilters, availability: e.target.value})}
              >
                <option value="">Move In Date</option>
                <option value="immediate">Immediate</option>
                <option value="next-month">Next Month</option>
                <option value="next-semester">Next Semester</option>
              </select>
              <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition flex items-center gap-2">
              <FaFilter />
              Apply Filters
            </button>
          </div>
        </div>
      </section>

      {/* Universities Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Popular Universities</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {universities.map((uni, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-4 rounded-lg text-center hover:bg-gray-100 cursor-pointer transition border border-gray-200"
              >
                <FaUniversity className="w-8 h-8 mx-auto mb-2 text-gray-900" />
                <p className="text-sm font-medium text-gray-800">{uni}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties Carousel */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Featured Properties</h2>
            <div className="flex gap-4">
              <button className="text-gray-900 hover:text-gray-700">
                <FaChevronLeft className="w-6 h-6" />
              </button>
              <button className="text-gray-900 hover:text-gray-700">
                <FaChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <Slider {...carouselSettings}>
            {featuredRooms.map((room) => (
              <div key={room.id} className="px-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-200"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={room.image} 
                      alt={room.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                      {room.availability}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-900">{room.title}</h3>
                        <div className="flex items-center text-gray-600">
                          <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                          <span className="text-sm">{room.location}</span>
                        </div>
                      </div>
                      <div className="text-gray-900 font-bold">{room.price}/mo</div>
                    </div>
                    
                    <button className="w-full mt-4 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition">
                      View Details
                    </button>
                  </div>
                </motion.div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Find Properties on Map</h2>
          <div className="h-[500px] rounded-lg overflow-hidden shadow-lg">
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading map...</p>
                </div>
              </div>
            }>
              <Map properties={mapProperties} />
            </Suspense>
          </div>
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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Accommodation Price Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {priceComparison.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
              >
                <div className="text-gray-900 text-xl font-bold mb-2">{option.type}</div>
                <div className="text-3xl font-bold mb-4 text-black">{option.priceRange}</div>
                <div className="text-sm text-gray-600 mb-4">per month</div>
                <ul className="space-y-2 mb-6">
                  {option.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-600">
                      <span className="w-2 h-2 bg-gray-900 rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="text-sm text-gray-500">Best for: {option.bestFor}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* City Guide Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">{cityGuide.title}</h2>
            <p className="text-gray-600">{cityGuide.description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cityGuide.sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative h-64 mb-4 rounded-xl overflow-hidden">
                  <img 
                    src={section.image} 
                    alt={section.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-600/70 to-transparent group-hover:from-blue-600/50 transition-all">
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold mb-2">{section.title}</h3>
                      <p className="text-sm opacity-90">{section.content}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition">
              Explore Harare Guide
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <div className="mb-4 flex justify-center text-blue-600">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-center"
            >
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Search</h3>
              <p className="text-gray-600">Find properties near your university in Harare</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Book</h3>
              <p className="text-gray-600">Secure your accommodation with easy online booking</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-center"
            >
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Move In</h3>
              <p className="text-gray-600">Start enjoying your new student home in Harare</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Maintenance Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Maintenance & Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
            >
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaTools className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold ml-4">24/7 Repairs</h3>
              </div>
              <p className="text-gray-600 mb-4">Quick response to maintenance requests with our dedicated team available round the clock.</p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  Emergency repairs
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  Regular maintenance
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  Online request tracking
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
            >
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <FaHeadset className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold ml-4">Support Services</h3>
              </div>
              <p className="text-gray-600 mb-4">Dedicated support team to assist with any accommodation-related queries.</p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                  24/7 helpline
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                  Online chat support
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                  Email assistance
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
            >
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <FaClipboardCheck className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold ml-4">Regular Inspections</h3>
              </div>
              <p className="text-gray-600 mb-4">Scheduled property inspections to ensure everything is in perfect condition.</p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                  Monthly checks
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                  Safety assessments
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                  Preventive maintenance
                </li>
              </ul>
            </motion.div>
          </div>

          <div className="mt-12 text-center">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition flex items-center mx-auto"
            >
              <FaWrench className="mr-2" />
              Submit Maintenance Request
            </motion.button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Find Your Student Home in Harare?</h2>
          <p className="text-xl mb-8 text-gray-300">Join hundreds of students who have found their ideal accommodation</p>
          <button className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition">
            Get Started
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
